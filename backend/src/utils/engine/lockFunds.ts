import { BALANCES } from "../..";

import { estimateMarketBuyCost } from "./estimateMarketBuyCost";

export  function lockFunds(order:any){

        if(order.side ==="buy"){
                let amount = 0
                if(order.type === "limit"){
                        amount = order.price * order.quantity
                }else{
                        amount = estimateMarketBuyCost(order)
                }

                const balance =  BALANCES[order.userId].USD
                // bro u can't have enough funds
                if(balance.available < amount) throw new Error("Insufficient funds")

                balance.available -= amount
                balance.locked += amount

        }else{
                // sell  -> either its limit order or market order  - first need to have enough assets
                let asset = BALANCES[order.userId][order.market]

                if(!asset) throw new Error("Asset not found in user balance")

                if(asset.available < order.quantity) throw new Error("Insufficient Assets")

                asset.available -= order.quantity
                asset.locked += order.quantity
        }
}