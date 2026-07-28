import { ORDERBOOK } from "../..";


// currently lets just take the best ask - min cheapest ask
// also just making estimataion so no need to save the orderbook
export function estimateMarketBuyCost(order:any){

        const asks = ORDERBOOK[order.market].asks
        let remaining = order.quantity
        let totalCost = 0
        asks.sort((a:any,b:any) => a.price - b.price)

        for(const ask of asks){
                if(remaining==0)break
                const qty = Math.min(remaining,ask.remainingQuantity)
                totalCost += qty * ask.price
                remaining -= qty
        }

        // whole orderbook has been consumed still not enough
        if(remaining > 0) throw new Error("Insufficient funds : not enough orderbook to fill order")
        return totalCost
}