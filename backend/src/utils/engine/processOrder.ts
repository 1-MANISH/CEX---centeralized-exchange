import type { InComingOrder } from "../interfaces"
import { lockFunds } from "./lockFunds.ts"
import { matchBuy } from "./matchBuy.ts"
import { matchSell } from "./matchSell.ts"
import { validateOrder } from "./validateOrder.ts"

export async function processOrder(order:InComingOrder){

        try {
                validateOrder(order)

                lockFunds(order)

                const fills = order.side ==="buy" ? matchBuy(order) : matchSell(order)


                return {
                        message:"order placed",
                        filledQuantity:order.filledQuantity,
                        remainingQuantity:order.remainingQuantity
                }
        } catch (error) {
                throw new Error("Error in processing order")
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