import type { Request, Response } from "express";
import {depositBodySchema, orderBodySchema} from "../types/exchange-schema.ts"
import { processOrder } from "../utils/engine/processOrder.ts";
import { BALANCES } from "../index.ts";

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
               result
        })

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


export  {
        createOrder,
        depositAsset
}