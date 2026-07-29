import type { Request, Response } from "express";
import {depositBodySchema, orderBodySchema, stockBodySchema} from "../types/exchange-schema.ts"
import { processOrder } from "../utils/engine/processOrder.ts";
import { BALANCES, ORDERBOOK } from "../index.ts";
import { prismaClient } from "../db.ts";
import { Matrix } from "../utils/interfaces.ts";
import {helper} from "../utils/metrix.ts"
import { ENV } from "../utils/env.ts";
function getUserId(req:Request):number{
       if(!req.userId)  throw new Error("Missing authenticated user")
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

async function createOrder(req:Request,res:Response):Promise<void> {
        
        const userId = getUserId(req) as number

        const parsedBody = orderBodySchema.safeParse(req.body)

        if(!parsedBody.success){
                res.status(400).json(parsedBody.error)
                return
        }

        let order = parsedBody.data
        
        const result = await processOrder({...order,userId})

        res.status(201).json({
               result,
               BALANCES,
               ORDERBOOK
        })

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
async function getOrder(req:Request,res:Response):Promise<void> {
        const userId = getUserId(req) as number
        const orderId = Number(req.params.orderId )as number

        if(!BALANCES[userId]) throw new Error("User not found")

        const order = await prismaClient.order.findFirst({
                where:{id:orderId},
                include:{fills:true,user:true}
        })

        res.status(200).json({
                orderInformation:{
                        id:order?.id,
                        userId:order?.userId,
                        side:order?.side,
                        type:order?.type,
                        market:order?.market,
                        price:order?.price,
                        quantity:order?.quantity,
                        createdAt:order?.createdAt
                },
                fillHistory:order?.fills,
                filledQuantity:order?.filledQuantity,
                remainingQuantity:order?.remainingQuantity,
                orderStatus:order?.status
        })
}

async function getAllOrder(req:Request,res:Response):Promise<void> {
        const userId = getUserId(req) as number
        const orders = await prismaClient.order.findMany({
                where:{userId},
                orderBy:{createdAt:"desc"}
        })
        res.status(200).json(orders)
}

async function getAllFills(req:Request,res:Response):Promise<void> {
        const userId = getUserId(req) as number
        const symbol = req.params.symbol as string
        const fills = await prismaClient.fill.findMany({
                where:{userId,market:symbol},
                orderBy:{createdAt:"desc"}
        })
        res.status(200).json(fills)
}
async function getDepth(req:Request,res:Response):Promise<void> {
        const symbol = req.params.symbol as string

        const outputBids = ORDERBOOK[symbol]?.bids.map((bid)=>{
                return {
                        price:bid.price,
                        quantity:bid.quantity
                }
        })

        const outputAsks = ORDERBOOK[symbol]?.asks.map((ask)=>{
                return {
                        price:ask.price,
                        quantity:ask.quantity
                }
        })
        


        res.status(200).json({
                bids:outputBids,
                asks:outputAsks,
                lastTradePrice:ORDERBOOK[symbol].lastTradePrice
        })

}

async function getBalance(req:Request,res:Response):Promise<void> {
        const userId = getUserId(req) as number
        res.status(200).json(BALANCES[userId])
}

async function depositAsset(req:Request,res:Response):Promise<void> {
         const userId = getUserId(req) as number

         const parsedBody  = depositBodySchema.safeParse(req.body)

         if(!parsedBody.success){
                 res.status(400).json(parsedBody.error)
                 return
         }

        const {symbol,quantity} = parsedBody.data

        if(!BALANCES[userId]) BALANCES[userId] = {}

         if(!BALANCES[userId][symbol]) BALANCES[userId][symbol] = {available:0,locked:0}
        BALANCES[userId][symbol].available += quantity

        res.status(200).json({
                message:"Asset Deposited",
                BALANCES
        })
}

// only admin can create a stock
async function createAStock(req:Request,res:Response):Promise<void> {
        
        const userId = getUserId(req) as number

        const user = await prismaClient.user.findUnique({where:{id:userId}})
        if(user?.username!=ENV.ADMIN_USERNAME && user?.password!=ENV.ADMIN_PASSWORD){
                res.status(401).json({message:"Unauthorized: Only admin can create a stock"})
                return
        }
        
        const parsedBody = stockBodySchema.safeParse(req.body)

        if(!parsedBody.success){
                res.status(400).json(parsedBody.error)
                return
        }

        const stock = await prismaClient.stock.create({data:parsedBody.data})

        ORDERBOOK[stock.symbol] = {bids:[],asks:[],lastTradePrice:0}

        res.status(200).json({
                message:"Stock created",
                stock
        })
}



async function getAllStocksMatrix(req:Request,res:Response):Promise<void> {
        
        const userId = getUserId(req) as number

        const stocks :Matrix[]  = []
        // {SOL:{currentPrice,volume,change24h}}

        const sts = await prismaClient.stock.findMany()

        for(const st of sts){
                const matrix = await helper(st.symbol)
                stocks.push(matrix)
        }

        res.status(200).json(stocks)
        
}


export  {
        createOrder,
        getOrder,
        depositAsset,
        getAllOrder,
        getDepth,
        getBalance,
        getAllFills,
        getAllStocksMatrix,
        createAStock
}