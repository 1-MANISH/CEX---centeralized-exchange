import { ORDERBOOK } from "../..";

// asks- min to max
// bids- max to min
// currently lets just take the best ask - min cheapest ask
// also just making estimataion so no need to save the orderbook
export function estimateMarketBuyCost(order:any){

        const asks = ORDERBOOK[order.market]?.asks
        let remainingQuantity = order.quantity
        let amountNeeded = 0

        for(const ask of asks ??[]){
                if(remainingQuantity==0)break
                const quantity = Math.min(remainingQuantity,ask.remainingQuantity)
                amountNeeded += quantity * ask.price
                remainingQuantity -= quantity
        }

        // whole orderbook has been consumed still not enough
        if(remainingQuantity > 0) throw new Error("Insufficient funds : not enough orderbook to fill order")
        return amountNeeded
}