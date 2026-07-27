import { ORDERBOOK } from "../..";
import type { InComingOrder } from "../interfaces";

export function estimateMarketBuyCost(order:InComingOrder){

        const asks = ORDERBOOK[order.market].asks

        let remaining = order.quantity

        let totalCost = 0;

        for(const ask of asks){
                if(remaining==0)break

                const qty = Math.min(remaining,ask.remainingQuantity)
                
                totalCost += qty * ask.price

                remaining -= qty

        }

        if(remaining > 0) throw new Error("Insufficient funds"

        )

        return totalCost

}