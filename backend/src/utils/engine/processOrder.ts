
import { prismaClient } from "../../db.ts"
import { lockFunds } from "./lockFunds.ts"
import { matchBuy } from "./matchBuy.ts"
import { matchSell } from "./matchSell.ts"
import { validateOrder } from "./validateOrder.ts"

export async function processOrder(order:any){

        try {

                // no need but just to be sure
                validateOrder(order)

                // locking funds if available otherwise throwing error to the user
                lockFunds(order)

                // we are sure that order can seat into the orderbook and can make order into database
                let newOrder = await prismaClient.order.create({
                        data:{
                                ...order,
                                status:"open",
                                filledQuantity:0,
                                remainingQuantity:order.quantity
                        }
                })

                const fills = order.side ==="buy" ? matchBuy(newOrder) : matchSell(newOrder)

                order = await prismaClient.order.findFirst({
                        where:{id:newOrder.id},
                })
                return {
                        message:"order placed",
                        filledQuantity:order.filledQuantity,
                        remainingQuantity:order.remainingQuantity,
                }
        } catch (error) {
                throw new Error("Error in processing order"+error)
        }
}
/*
MatchingEngine

├── processOrder()

├── validate()

├── matchBuy()

├── matchSell()

├── executeTrade()

├── unlockFunds()

├── updateBalances()

├── saveOrder()

├── saveFills()

└── saveTrades()
*/