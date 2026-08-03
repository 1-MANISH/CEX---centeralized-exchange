import type { Request, Response } from "express";
import { depositBodySchema, orderBodySchema, stockBodySchema } from "../types/exchange-schema.ts"
import { processOrder } from "../utils/engine/processOrder.ts";
import { BALANCES, ORDERBOOK } from "../index.ts";
import { prismaClient } from "../db.ts";
import type { Matrix } from "../utils/interfaces.ts";
import { helper } from "../utils/matrix.ts"
import { ENV } from "../utils/env.ts";
import { MESSAGES, STATUS_CODE } from "../utils/constant.ts";
import { sendError, sendSuccess } from "../utils/response.ts";
import { sendValidationError } from "../utils/validation.ts";

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

        /*
        1 balance check & lock funds - > error(not enough funds)
        2. match logic (if order is not able to full fill then sit on orderbook, otherwise fill the order)
        3. if matched then update the balance- and order and create fills/trade to save history
        4. response
        */
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
        const remainingQuantity = order.remainingQuantity

        const book = ORDERBOOK[order.market]
        if(!book){
               sendError(res, STATUS_CODE.SERVER_ERROR as number, MESSAGES.SOME_THING_WENT_WRONG as string)
        }

        // need to think of
        if (order.side === "buy") {
                const refund = remainingQuantity* order.price
                BALANCES[userId].USD.locked -=refund
                BALANCES[userId].USD.available += refund
                book.bids = book.bids.filter((bid) => bid.id !== order.id)
        } else {
                BALANCES[userId][order.market].locked -= remainingQuantity
                BALANCES[userId][order.market].available += remainingQuantity
                book.asks = book.asks.filter((ask) => ask.id !== order.id)
        }

        const updatedOrder = await prismaClient.order.update({
                where: { id: orderId },
                data: {
                        status: "cancelled"
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

        if(!ORDERBOOK[symbol]){
                // sendError(res, STATUS_CODE.NOT_FOUND as number, MESSAGES.MARKET_NOT_FOUND as string)
                // return
                ORDERBOOK[symbol] = {bids:[],asks:[],lastTradePrice:0}
        }
        const outputBidsMap = new Map<number,number>()
        const outputAsksMap = new Map<number,number>()

        //  only top 10 bids and asks should be sent to the user
        let count = 0
        ORDERBOOK[symbol]?.bids.map((bid) => {
                 if(count >= 10) return
                 count++
                if(outputBidsMap.has(bid.price)){
                        const existingQuantity = outputBidsMap.get(bid.price) as number
                        outputBidsMap.set(bid.price,existingQuantity + bid.quantity)
                }
                else outputBidsMap.set(bid.price,bid.quantity)
               
        })
        count = 0
        ORDERBOOK[symbol]?.asks.map((ask) => {
                if(count >= 10) return
                count++
                if(outputAsksMap.has(ask.price)){
                        const existingQuantity = outputAsksMap.get(ask.price) as number
                        outputAsksMap.set(ask.price,existingQuantity + ask.quantity)
                }
                else outputAsksMap.set(ask.price,ask.quantity)
        })

        const data = {
                bids: Array.from(outputBidsMap.entries()).map(([price,quantity])=>({price,quantity})),
                asks: Array.from(outputAsksMap.entries()).map(([price,quantity])=>({price,quantity})),
                lastTradePrice: ORDERBOOK[symbol].lastTradePrice
        }

        sendSuccess(res, STATUS_CODE.OK as number, {depth:data}, MESSAGES.FETCHED as string)

}

async function getBalance(req: Request, res: Response): Promise<void> {

        const userId = getUserId(req) as string
      
        sendSuccess(res, STATUS_CODE.OK as number, { balance: BALANCES[userId] }, MESSAGES.FETCHED as string)
}


async function depositAsset(req: Request, res: Response): Promise<void> {
        const userId = getUserId(req) as string

        const parsedBody = depositBodySchema.safeParse(req.body)

        if (!parsedBody.success) {
                sendValidationError(res, parsedBody.error)
                return
        }

        const { symbol, quantity } = parsedBody.data

        if (!BALANCES[userId]) BALANCES[userId] = {}

        if (!BALANCES[userId][symbol]) BALANCES[userId][symbol] = { available: 0, locked: 0 }
        BALANCES[userId][symbol].available += quantity


        sendSuccess(res, STATUS_CODE.OK as number, { balance: BALANCES[userId] }, MESSAGES.ASSET_DEPOSITED as string)
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

        if (!ORDERBOOK[stock.symbol])
                ORDERBOOK[stock.symbol] = { bids: [], asks: [], lastTradePrice: 0 }

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