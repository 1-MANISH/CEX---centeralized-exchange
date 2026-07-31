import { ORDERBOOK } from "../..";
import type { Order, UserOrder } from "../interfaces";

// asks- min to max
// bids- max to min
// currently lets just take the best ask - min cheapest ask
// also just making estimataion so no need to save the orderbook
export function estimateMarketBuyCost(order:UserOrder){
        // for market order - buy the best ask

        const book = ORDERBOOK[order.market]
        if(!book){
                 throw new Error("Invalid Market");
        }
        const asks = book?.asks as Order[] //lowest price first - asc order
        if(asks.length===0){
                throw new Error("No sell-side liquidity available")
        }
      
        let remainingQuantity = order.quantity
        let amountNeeded = 0
        let filledQuantity = 0

        for(const ask of asks ){
                if(remainingQuantity==0)break
                const quantity = Math.min(remainingQuantity,ask.remainingQuantity)
                // there is never ever a case for market order sell -because market order not its on orderbook
                amountNeeded += quantity * (ask.price)
                filledQuantity += quantity
                remainingQuantity -= quantity
        }

        // if(remainingQuantity > 0) throw new Error("Insufficient funds : not enough orderbook to fill order")
        // we can partially fill the order whatever possible lets fill and other remaining still can sit or cancel this order now
        return amountNeeded
}