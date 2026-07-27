import type { Request, Response } from "express";
import {orderBodySchema} from "../types/exchange-schema.ts"
import { processOrder } from "../utils/engine/processOrder.ts";
import { prismaClient } from "../db.ts";

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

        const newOrder = await prismaClient.order.create({
                data:{
                        userId,
                        ...order,
                        status:"open",
                        filledQuantity:0,
                        remainingQuantity:order.quantity,
                        price:order.price || null
                }
        })

        const result = await processOrder({
                ...newOrder
        })


        res.status(201).json({
               result
        })

}


export  {
        createOrder
}