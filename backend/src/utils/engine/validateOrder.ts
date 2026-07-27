
import { ORDERBOOK } from "../..";
import type { InComingOrder } from "../interfaces";

export  function validateOrder(order:InComingOrder){

        const book = ORDERBOOK[order.market]

        if(!book) throw new Error("Market not found")

        if(order.quantity <= 0) throw new Error("Quantity must be greater than 0")

        if(order.type === "limit") {
                
                if(!order.price) throw new Error("Price is required")
               
        }
}