import { ORDERBOOK } from "../..";
import type { Order } from "../interfaces"
import { executeTrade } from "./executeTrade";
export  function matchBuy(order: Order) {


        const book = ORDERBOOK[order.market]

        if (!book) {
                throw new Error("Invalid Market");
        }

        const fills = []
        const updatedOrders = []
        let lastTradePrice = book?.lastTradePrice


        const asks: Order[] = book.asks ?? []// min to max

        while (order.remainingQuantity > 0 && asks.length > 0) {
                        const currentBestAsk = asks[0]

                        if (order.type === "limit" && order.price && currentBestAsk?.price && currentBestAsk.price > order.price)  break
                       
                        // 1. it will update balance
                        // 2. it will update orderbook
                        // 3. it will return the trade - need to be save in database
                       const trade  =   executeTrade(order, currentBestAsk)//(buyOrder, sellOrder)

                        if(trade){
                                fills.push(...trade.fills)
                                updatedOrders.push(...trade.updatedOrders)
                                lastTradePrice=trade.lastTradePrice
                        }
                      
                        if (currentBestAsk.remainingQuantity === 0)
                                asks.shift() // remove this  ask from the orderbook
        }

         if(order.type === "limit" ){
                // limit buy order not able to filled currently but in future can be
                if( order.remainingQuantity > 0) {
                        book.bids.push(order)
                        book.bids.sort((a:Order,b:Order)=>b.price - a.price)
                }
                else book.bids = book.bids.filter(bid=>bid.id !== order.id)
        }


        return {
                fills,
                updatedOrders,
                lastTradePrice
        }
                        
}