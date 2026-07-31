
import { ORDERBOOK } from "../..";
import type { UserOrder } from "../interfaces";

export  function validateOrder(order:UserOrder){

        const book = ORDERBOOK[order.market]

        if(!book) { // first order
                // market not exists means there is no order book for this market
                // we can create a new order book for this market
                ORDERBOOK[order.market] = {bids:[],asks:[],lastTradePrice:0}
        }

        if(order.quantity <= 0) throw new Error("Quantity must be greater than 0")

        if(order.type === "limit") {
                
                if(!order.price) throw new Error("Price is required")
               
        }
}