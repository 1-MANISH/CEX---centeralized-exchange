import { ORDERBOOK } from "../..";
import type { Order } from "../interfaces"
import { executeTrade } from "./executeTrade";
export async function matchSell(order:Order) {

        const bids = ORDERBOOK[order.market]?.bids // max to min

        while (order.remainingQuantity > 0 && bids.length > 0) {

                const currentBestBid = bids[0]

                if (order.type === "limit" && currentBestBid.price < order.price) break
                
                // Execute one trade
                await executeTrade(currentBestBid, order) // =>(buyOrder, sellOrder)

              
                if (currentBestBid.remainingQuantity === 0) 
                        bids.shift()   // Remove completely filled BUY order
                
        }


         if(order.remainingQuantity>0){
                // partially filled -  still can be on order book
                order.status = "open"
                ORDERBOOK[order.market].asks.push(order)
                ORDERBOOK[order.market].asks.sort((a,b)=>a.price-b.price)// ascsending order
                        
        }else{
                order.status = "close"
                ORDERBOOK[order.market].asks = ORDERBOOK[order.market]?.asks.filter(ask=>ask.id != order.id)
        }
}