import { ORDERBOOK } from "../..";
import type { Order } from "../interfaces"
import { executeTrade } from "./executeTrade";
export async function matchBuy(order: Order) {

        const asks = ORDERBOOK[order.market].asks

        while (
                order.remainingQuantity > 0 &&
                asks.length > 0
        ) {

                const bestAsk = asks[0]

                // Only LIMIT orders have a price restriction
                if (order.type === "limit" &&bestAsk.price > order.price) 
                        break
                
                await executeTrade(order, bestAsk)

                if (bestAsk.remainingQuantity === 0)
                        asks.shift()
        }

        // Only LIMIT orders can rest on the book
        if (
                order.type === "limit" &&
                order.remainingQuantity > 0
        ) {
                order.status = "open"
 
                ORDERBOOK[order.market].bids.push(order)

                ORDERBOOK[order.market].bids.sort(
                        (a, b) => b.price - a.price
                );
        }

        // MARKET orders never stay in the book
        if (
                order.type === "market" &&
                order.remainingQuantity > 0
        ) {
                order.status = "open"; // or close if remaining is 0
        }
}