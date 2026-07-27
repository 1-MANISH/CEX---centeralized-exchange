import { ORDERBOOK } from "../..";
import type { InComingOrder } from "../interfaces"
import { executeTrade } from "./executeTrade";
export function matchSell(order:InComingOrder) {

        const orderBook = ORDERBOOK[order.market];
        const bids = orderBook.bids;

        while (
                order.remainingQuantity > 0 &&
                bids.length > 0
        ) {
                const bestBid = bids[0];

                // LIMIT SELL
                // Stop if buyer is offering less than seller wants.
                if (
                        order.type === "limit" &&
                        bestBid.price < order.price
                ) {
                         break;
                }

                executeTrade(bestBid, order);

                if (bestBid.remainingQuantity === 0) {
                        bids.shift();
                }
        }

        // Remaining quantity becomes a resting ask
        if (
                order.type === "limit" &&
                order.remainingQuantity > 0
        ) {
                orderBook.asks.push(order)

                orderBook.asks.sort(
                (a:any, b:any) => a.price - b.price
                )
        }

        order.status =
                order.remainingQuantity === 0
                ? "close"
                : order.filledQuantity > 0
                ? "open"
                : "open";
}