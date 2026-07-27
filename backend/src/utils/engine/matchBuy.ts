import { ORDERBOOK } from "../..";
import type { InComingOrder } from "../interfaces"
import { executeTrade } from "./executeTrade";
export function matchBuy(order:InComingOrder) {

        const asks = ORDERBOOK[order.market].asks;

        while (
                order.remainingQuantity > 0 &&
                asks.length
        ) {

                const bestAsk = asks[0];

                if (
                        order.type === "limit" &&
                        bestAsk.price > order.price
                )
                break;

                executeTrade(order, bestAsk);

                if (bestAsk.remainingQuantity === 0)
                asks.shift();
        }

        if (
                order.type === "limit" &&
                order.remainingQuantity > 0
        ) {
                ORDERBOOK[order.market].bids.push(order);
        }
}