
import { prismaClient } from "../../db.ts"
import { waitForEngineResponse } from "../../store/pending-response.ts"
import { publisher } from "../engine-client.ts"
import { ENV } from "../env.ts"
import type {  UserOrder } from "../interfaces.ts"



export async function processOrder(order:UserOrder){

        try {

                // we are sure that order can seat into the orderbook and can make order into database
                let dbOrder =   await prismaClient.order.create({
                        data:{
                                ...order,
                                status:"open",
                                filledQuantity:0,
                                remainingQuantity:order.quantity
                        }
                })

                const correlationId = dbOrder.id

                const message= {correlationId,responseQueue:ENV.RESPONSE_QUEUE,type:'create_order',payload:dbOrder}

               // sending the order to the engine => matching logic
                await publisher.lPush(ENV.IN_COMING_QUEUE,JSON.stringify(message))

                const data= await waitForEngineResponse(correlationId,0)

                // persist the trades and orders in the database
        //        await prismaClient.$transaction(async (tx) => {
                       
        //                 await tx.fill.createMany({
        //                         data:fills
        //                 });

        //                 await Promise.all(updatedOrders.map(order => {
        //                         return tx.order.update({
        //                                 where:{id:order.id },
        //                                 data:{
        //                                         filledQuantity:order.filledQuantity,
        //                                         remainingQuantity:order.remainingQuantity,
        //                                         status:order.status
        //                                 }
        //                         })
        //                 }))
        //        })

                let ourOrder = await prismaClient.order.findFirst({
                        where:{id:dbOrder.id},
                })
                return {
                        id:dbOrder.id,
                        filledQuantity:ourOrder?.filledQuantity,
                        remainingQuantity:ourOrder?.remainingQuantity,
                        data
                }
        } catch (error) {
                throw new Error("Error in processing order" + (error?.message ?? error))
        }
}
/*
MatchingEngine

├── processOrder()

├── validate()

├── matchBuy()

├── matchSell()

├── executeTrade()
        -> uppdate order book
        -> update balance
        ->return trade as plan js object

├── saveOrder()

├── saveFills()

└── saveTrades()
*/