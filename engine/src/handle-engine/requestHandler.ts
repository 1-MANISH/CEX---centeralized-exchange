import { BALANCES } from "..";
import type { Order } from "../utils/interfaces";
import { lockFunds } from "./match/lockFunds";
import { matchBuy } from "./match/matchBuy";
import { matchSell } from "./match/matchSell";
import { validateOrder } from "./match/validateOrder";


function createOrder(order:Order){
             try {

                // no need but just to be sure
                validateOrder(order)

                // locking funds if available otherwise throwing error to the user
                lockFunds(order)

                // now order may be full filled or partially filled
                const { fills,updatedOrders,lastTradePrice} = order.side ==="buy" ? matchBuy(order) : matchSell(order)


                return {
                        filledQuantity:order?.filledQuantity,
                        remainingQuantity:order?.remainingQuantity,
                        lastTradePrice,
                        updatedOrders,
                        fills
                }
        } catch (error) {
                throw new Error("Error in processing order" + (error?.message ?? error))
        }
}

function depositFunds(payload:{userId:string,symbol:string,quantity:number}){

        let balances = BALANCES[payload.userId]
        if(!balances){
                balances = {}
                BALANCES[payload.userId] = balances
        }

        const balance = balances[payload.symbol] ?? {available:0,locked:0}

        balance.available += payload.quantity
        balances[payload.symbol] = balance

        return {
                userId:payload.userId,
                balance:BALANCES[payload.userId]
        }
   
}

export {
        createOrder,
        depositFunds
}