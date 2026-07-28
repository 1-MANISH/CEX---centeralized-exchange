import { ORDERBOOK } from "../..";
import type { Order } from "../interfaces"
import { executeTrade } from "./executeTrade";
export async function matchSell(order:Order) {

        const orderBook = ORDERBOOK[order.market]
        const bids = orderBook.bids

        while (
                order.remainingQuantity > 0 &&
                bids.length > 0
        ) {
                // Highest BUY order
                const bestBid = bids[0];

                // LIMIT SELL:
                // Don't sell below your requested price
                if (
                order.type === "limit" &&
                bestBid.price < order.price
                ) {
                break
                }

                // Execute one trade
                await executeTrade(bestBid, order)

                // Remove completely filled BUY order
                if (bestBid.remainingQuantity === 0) 
                        bids.shift()
                
        }

        // -------------------------------------------------
        // If LIMIT order wasn't completely filled,
        // add remaining quantity to orderbook
        // -------------------------------------------------

        if (
                order.type === "limit" &&
                order.remainingQuantity > 0
        ) {
                order.status =
                order.filledQuantity > 0
                        ? "open"
                        : "open";

                orderBook.asks.push(order)

                // Lowest price first
                orderBook.asks.sort(
                (a:any, b:any) => a.price - b.price
                );
        }

        // -------------------------------------------------
        // MARKET orders never remain in orderbook
        // -------------------------------------------------

        if (order.type === "market") {
                order.status =
                order.remainingQuantity === 0
                        ? "close"
                        : "open";
        }

        // If LIMIT order completely matched
        if (
                order.type === "limit" &&
                order.remainingQuantity === 0
        ) {
                order.status = "close";
        }

        return order;
}