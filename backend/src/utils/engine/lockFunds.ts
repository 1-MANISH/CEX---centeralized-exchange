import { BALANCES } from "../..";

import { estimateMarketBuyCost } from "./estimateMarketBuyCost";

export  function lockFunds(order:any){


        if(order.side ==="buy"){
                let amountNeeded = 0
                if(order.type === "limit")amountNeeded = order.price * order.quantity
                else amountNeeded = estimateMarketBuyCost(order) // estimate market buy cost which is cheapest ask - 

                const userBalance =  BALANCES[order.userId]?.USD
                // bro u can't have enough funds
                if(userBalance.available < amountNeeded) throw new Error("Locking funds failed : Insufficient funds")

                userBalance.available -= amountNeeded
                userBalance.locked += amountNeeded

        }else{
                // sell  -> either its limit order or market order  - first need to have enough assets
                let userAssetBalance = BALANCES[order.userId]?.[order.market]

                if(userAssetBalance.available < order.quantity) throw new Error("Locking funds failed : Insufficient funds")

                userAssetBalance.available -= order.quantity
                userAssetBalance.locked += order.quantity
        }
}