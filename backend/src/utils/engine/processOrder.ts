
import { prismaClient } from "../../db.ts"
import type {  UserOrder } from "../interfaces.ts"
import { lockFunds } from "./lockFunds.ts"
import { matchBuy } from "./matchBuy.ts"
import { matchSell } from "./matchSell.ts"
import { validateOrder } from "./validateOrder.ts"



export async function processOrder(order:UserOrder){

        try {

                // no need but just to be sure
                validateOrder(order)

                // locking funds if available otherwise throwing error to the user
                lockFunds(order)

                // now order may be full filled or partially filled

                // we are sure that order can seat into the orderbook and can make order into database
                let dbOrder =   await prismaClient.order.create({
                        data:{
                                ...order,
                                status:"open",
                                filledQuantity:0,
                                remainingQuantity:order.quantity
                        }
                })

                const { fills,updatedOrders,lastTradePrice} = order.side ==="buy" ? matchBuy(dbOrder) : matchSell(dbOrder)

                // persist the trades and orders in the database
               await prismaClient.$transaction(async (tx) => {
                       
                        await tx.fill.createMany({
                                data:fills
                        });

                        await Promise.all(updatedOrders.map(order => {
                                return tx.order.update({
                                        where:{id:order.id },
                                        data:{
                                                filledQuantity:order.filledQuantity,
                                                remainingQuantity:order.remainingQuantity,
                                                status:order.status
                                        }
                                })
                        }))
               })

                let ourOrder = await prismaClient.order.findFirst({
                        where:{id:dbOrder.id},
                })
                return {
                        filledQuantity:ourOrder?.filledQuantity,
                        remainingQuantity:ourOrder?.remainingQuantity,
                        lastTradePrice
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