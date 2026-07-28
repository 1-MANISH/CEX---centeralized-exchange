import { ORDERBOOK } from "../..";
import type { Order } from "../interfaces"
import { executeTrade } from "./executeTrade";
export async function matchBuy(order: Order) {

        const asks = ORDERBOOK[order.market]?.asks// min to max

        while (order.remainingQuantity > 0 && asks.length > 0) {
                        const currentBestAsk = asks[0]

                        if (order.type === "limit" && currentBestAsk.price > order.price)  break
                                
                         await executeTrade(order, currentBestAsk)

                        if (currentBestAsk.remainingQuantity === 0)
                                asks.shift() // remove this  ask from the orderbook
        }

        if(order.remainingQuantity > 0) {
                        // partially filled -  still can be on order book
                        order.status = "open"
                        ORDERBOOK[order.market].bids.push(order)
                        ORDERBOOK[order.market].bids.sort((a, b) => b.price - a.price)
        }else{
                // fully filled
                order.status = "close"
                ORDERBOOK[order.market]?.bids = ORDERBOOK[order.market].bids.filter(bid=>bid.id != order.id)
        }
                        
}