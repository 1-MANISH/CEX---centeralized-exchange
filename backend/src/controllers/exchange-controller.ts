import type { Request, Response } from "express";
import { depositBodySchema, orderBodySchema, stockBodySchema } from "../types/exchange-schema.ts"
import { processOrder } from "../utils/engine/processOrder.ts";
import { prismaClient } from "../db.ts";
import type { Matrix } from "../utils/interfaces.ts";
import { helper } from "../utils/matrix.ts"
import { ENV } from "../utils/env.ts";
import { MESSAGES, STATUS_CODE } from "../utils/constant.ts";
import { sendError, sendSuccess } from "../utils/response.ts";
import { sendValidationError } from "../utils/validation.ts";
import { publisher } from "../utils/engine-client.ts";
import { waitForEngineResponse } from "../store/pending-response.ts";
import { sendResponseToEngine } from "../utils/engine/sendResponseToEngine.ts";

function getUserId(req: Request): string {
        if (!req.userId) throw new Error(MESSAGES.NOT_AUTHORIZED as string)
        return req.userId
}

/*

1. check if the user is authenticated
2. validate the request body
3. check if the user has enough balance balances[userId][symbol]>=price*quantity
4. lock the funds in the balances[userId][symbol] -> balances[userId][symbol] = {
        available:balances[userId][symbol].available - price*quantity,
        locked:balances[userId][symbol].locked + price*quantity
}
5. read the orderbook
6. run the matching logic to match this order
7. update the balance
8. Insert the trades in the trades/fills table -  also in order
9. update the order status
10. return response - {message:"order placed",filledQuantity:filledQuantity,remainingQuantity:remainingQuantity}
*/

async function createOrder(req: Request, res: Response): Promise<void> {

        const userId = getUserId(req) as string

        const parsedBody = orderBodySchema.safeParse(req.body)

        if (!parsedBody.success) {
               sendValidationError(res, parsedBody.error)
                return
        }

        let order = parsedBody.data

        // 1. validate request once again
        // 2. send this order to engine via - queue
        // 3. engine will process this order and return the transaction details with filled quantity
        // 4. then we will update the order in the database - for this continusaly listening to response-for this correlation id
        // 5. return the response
        const result = await processOrder({ ...order, userId }) //{message:"",filledQuantity:0,remainingQuantity:0}

        sendSuccess(res, STATUS_CODE.CREATED as number, result, MESSAGES.ORDER_PLACED as string)

}
async function cancelOrder(req: Request, res: Response): Promise<void> {
        const userId = getUserId(req) as string
        const orderId = req.params.orderId as string

        const order = await prismaClient.order.findFirst({
                where: { id: orderId },
                include: { fills: true, user: true }
        })

        if (order?.userId !== userId) {
                sendError(res, STATUS_CODE.UNAUTHORIZED as number, MESSAGES.NOT_AUTHORIZED as string)
                return
        }

        //  unlock funds and remove this order from order book
        // order may be partially filled
       const correlationId = crypto.randomUUID()
       const response =  waitForEngineResponse(correlationId)
       
       const payload = {order}
       await sendResponseToEngine(correlationId,ENV.RESPONSE_QUEUE,'cancel_order',payload)
       const data = await response as any

        const updatedOrder = await prismaClient.order.update({
                where: { id: orderId },
                data: {
                        status: data.status ?? "cancelled"
                }
        })

        sendSuccess(res, STATUS_CODE.OK as number, {order:updatedOrder}, MESSAGES.ORDER_CANCELLED as string)
}
// get order details
/*
return {
        orderInformation:{},
        fillHistory:[],
        filledQuantity:0,
        remainingQuantity:0
        orderStatus:"open" | "close" | "cancelled"
}
*/
async function getOrder(req: Request, res: Response): Promise<void> {
        const userId = getUserId(req) as string
        const orderId = req.params.orderId as string

        if(!orderId){
                sendError(res, STATUS_CODE.BAD_REQUEST as number, MESSAGES.MISSING_FIELD as string)
                return
        }

        const order = await prismaClient.order.findFirst({
                where: { id: orderId },
                include: { fills: true, user: true }
        })

        if(!order){
                sendError(res, STATUS_CODE.NOT_FOUND as number, MESSAGES.ORDER_NOT_FOUND as string)
                return
        }
        if( order.userId !== userId){
                sendError(res, STATUS_CODE.UNAUTHORIZED as number, MESSAGES.NOT_AUTHORIZED as string)
                return
        }

        const orderData = {
                id: order?.id,
                userId: order?.userId,
                side: order?.side,
                type: order?.type,
                market: order?.market,
                price: order?.price,
                quantity: order?.quantity,
                createdAt: order?.createdAt,
                fillHistory: order?.fills,
                filledQuantity: order?.filledQuantity,
                remainingQuantity: order?.remainingQuantity,
                orderStatus: order?.status
        }

        sendSuccess(res, STATUS_CODE.OK as number, {order:orderData}, MESSAGES.FETCHED as string)
}

async function getAllOrder(req: Request, res: Response): Promise<void> {
        const userId = getUserId(req) as string
        const orders = await prismaClient.order.findMany({
                where: { userId },
                orderBy: { createdAt: "desc" }
        })
        
        sendSuccess(res, STATUS_CODE.OK as number, {orders}, MESSAGES.FETCHED as string)
}

async function getAllFills(req: Request, res: Response): Promise<void> {
        const userId = getUserId(req) as string

        const fills = await prismaClient.fill.findMany({
                where: { userId },
                orderBy: { createdAt: "desc" }
        })

        sendSuccess(res, STATUS_CODE.OK as number, {fills}, MESSAGES.FETCHED as string)
}
async function getOrderFills(req: Request, res: Response): Promise<void> {
        const userId = getUserId(req) as string
        const orderId = req.params.orderId as string

        const orderFills = await prismaClient.fill.findMany({
                where: { id:orderId,userId },
                orderBy: { createdAt: "desc" }
        })

        sendSuccess(res, STATUS_CODE.OK as number, {orderFills}, MESSAGES.FETCHED as string)
}
async function getDepth(req: Request, res: Response): Promise<void> {
        const symbol = req.params.symbol as string

        const correlationId = crypto.randomUUID()
        const response =  waitForEngineResponse(correlationId)
        const payload={symbol}

        // sending the order to the engine =>
        await sendResponseToEngine(correlationId,ENV.RESPONSE_QUEUE,'get_depth',payload)

        const data = await response as any

        const {asks,bids,lastTradePrice} = data

        // lets send {price:10 ->{quantity:10,remainingQuantity:4,filledQuantity:6}}
        const outputBidsMap = new Map<number,{quantity:number,remainingQuantity:number,filledQuantity:number}>()
        const outputAsksMap = new Map<number,{quantity:number,remainingQuantity:number,filledQuantity:number}>()

        //  only top 10 bids and asks should be sent to the user

        bids?.map((bid:any) => {
                if(outputBidsMap.has(bid.price)){
                        const data = outputBidsMap.get(bid.price) as {quantity:number,remainingQuantity:number,filledQuantity:number}

                        outputBidsMap.set(bid.price,{quantity:data.quantity + bid.quantity,remainingQuantity:data.remainingQuantity+bid.remainingQuantity,filledQuantity:data.filledQuantity+bid.filledQuantity})
                }
                else outputBidsMap.set(bid.price,{quantity:bid.quantity,remainingQuantity:bid.remainingQuantity,filledQuantity:bid.filledQuantity})
        })

        asks?.map((ask:any) => {
                if(outputAsksMap.has(ask.price)){
                        const data = outputAsksMap.get(ask.price) as {quantity:number,remainingQuantity:number,filledQuantity:number}
                        outputAsksMap.set(ask.price,{quantity:data.quantity + ask.quantity,remainingQuantity:data.remainingQuantity+ask.remainingQuantity,filledQuantity:data.filledQuantity+ask.filledQuantity})
                }
                else outputAsksMap.set(ask.price,{quantity:ask.quantity,remainingQuantity:ask.remainingQuantity,filledQuantity:ask.filledQuantity})
        })
        // need to also send filled quantity and remaining quantity for each price level -  for that we need to maintain a map of price to filled quantity and remaining quantity
        const depth = {
                bids: Array.from(outputBidsMap.entries()).map(([price,{quantity,remainingQuantity,filledQuantity}])=>({price,quantity,remainingQuantity,filledQuantity})),
                asks: Array.from(outputAsksMap.entries()).map(([price,{quantity,remainingQuantity,filledQuantity}])=>({price,quantity,remainingQuantity,filledQuantity})),
                lastTradePrice: lastTradePrice
        }

        sendSuccess(res, STATUS_CODE.OK as number, {depth}, MESSAGES.FETCHED as string)

}

async function getBalance(req: Request, res: Response): Promise<void> {

        const userId = getUserId(req) as string

        const correlationId = crypto.randomUUID()
        const response =  waitForEngineResponse(correlationId)
        const payload={userId}
        await sendResponseToEngine(correlationId,ENV.RESPONSE_QUEUE,'get_user_balance',payload)
        const data = await response as any
      
        sendSuccess(res, STATUS_CODE.OK as number, { balance: data.balance}, MESSAGES.FETCHED as string)
}


async function depositAsset(req: Request, res: Response): Promise<void> {
        const userId = getUserId(req) as string

        const parsedBody = depositBodySchema.safeParse(req.body)

        if (!parsedBody.success) {
                sendValidationError(res, parsedBody.error)
                return
        }

        const { symbol, quantity } = parsedBody.data

        const correlationId = crypto.randomUUID()
        const response =  waitForEngineResponse(correlationId)

        // sending the order to the engine =>
        const payload={userId,symbol,quantity}
        await sendResponseToEngine(correlationId,ENV.RESPONSE_QUEUE,'deposit_asset',payload)

        const data = await response as any

        sendSuccess(res, STATUS_CODE.OK as number, {balance:data.balance}, MESSAGES.ASSET_DEPOSITED as string)
}

// only admin can create a stock
async function createAStock(req: Request, res: Response): Promise<void> {

        const userId = getUserId(req)

        const user = await prismaClient.user.findUnique({ where: { id: userId } })

        if (!user) {
                sendError(res, STATUS_CODE.UNAUTHORIZED as number, MESSAGES.NOT_AUTHORIZED as string)
                return
        }

        if (user.username != ENV.ADMIN_USERNAME && user.password != ENV.ADMIN_PASSWORD) {
                sendError(res, STATUS_CODE.UNAUTHORIZED as number, MESSAGES.ADMIN_UNAUTHORIZED as string)
                return
        }

        const parsedBody = stockBodySchema.safeParse(req.body)

        if (!parsedBody.success) {
                sendValidationError(res, parsedBody.error)
                return
        }

        // only unique symbol can be created
        const stock = await prismaClient.stock.create({ data: parsedBody.data })

        // if (!ORDERBOOK[stock.symbol])
        //         ORDERBOOK[stock.symbol] = { bids: [], asks: [], lastTradePrice: 0 }
        const  correlationId = crypto.randomUUID()
        const payload= { symbol: stock.symbol }
        await sendResponseToEngine(correlationId,ENV.RESPONSE_QUEUE,'make_new_stock_entry',payload)

        sendSuccess(res, STATUS_CODE.CREATED as number, stock, MESSAGES.STOCK_CREATED as string)
}



async function getAllStocksMatrix(req: Request, res: Response): Promise<void> {


        const stocks: Matrix[] = []
        // {SOL:{currentPrice,volume24,change24h}}

        const sts = await prismaClient.stock.findMany()

        for (const st of sts) {
                const matrix = await helper(st.symbol,st.name)
                stocks.push(matrix)
        }


        sendSuccess(res, STATUS_CODE.OK as number, {stocks}, MESSAGES.FETCHED as string)

}


export {
        createOrder,
        getOrder,
        depositAsset,
        getAllOrder,
        getDepth,
        getBalance,
        getAllFills,
        getAllStocksMatrix,
        createAStock,
        cancelOrder,
        getOrderFills
}