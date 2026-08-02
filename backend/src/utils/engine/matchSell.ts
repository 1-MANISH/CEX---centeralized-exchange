import { ORDERBOOK } from "../..";
import type { Order } from "../interfaces"
import { executeTrade } from "./executeTrade";
export  function matchSell(order:Order) {

        const book  = ORDERBOOK[order.market]

        if (!book) {
                throw new Error("Invalid Market")
        }

        const fills = []
        const updatedOrders = []
        let lastTradePrice = book?.lastTradePrice

        const bids: Order[] = book?.bids ??[] // max to min

        while (order.remainingQuantity > 0 && bids.length > 0) {

                const currentBestBid = bids[0]

                if (order.type === "limit" && order.price && currentBestBid?.price && currentBestBid.price < order.price) break
                
                // 1. it will update balance
                // 2. it will update orderbook
                // 3. it will return the trade - need to be save in database
               const trade =   executeTrade(currentBestBid, order) // =>(buyOrder, sellOrder)

               if(trade){
                        fills.push(...trade.fills)
                        updatedOrders.push(...trade.updatedOrders)
                        lastTradePrice=trade.lastTradePrice
               }

              
                if (currentBestBid.remainingQuantity === 0) 
                        bids.shift()   // Remove completely filled BUY order
                
        }

        if(order.type === "limit" ) {
                // limit sell order not able to filled currently but in future can be
                if( order.remainingQuantity > 0) {
                       book.asks.push(order)
                       book.asks.sort((a:Order,b:Order)=>a.price - b.price)
                }
                else book.asks = book.asks.filter(ask=>ask.id !== order.id)
        }


        return {
                fills,
                updatedOrders,
                lastTradePrice
        }
}