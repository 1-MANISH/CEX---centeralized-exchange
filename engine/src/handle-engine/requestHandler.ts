import { BALANCES, ORDERBOOK } from "..";
import type { Order } from "../utils/interfaces";
import { lockFunds } from "./match/lockFunds";
import { matchBuy } from "./match/matchBuy";
import { matchSell } from "./match/matchSell";
import { validateOrder } from "./match/validateOrder";


function createOrder(payload:{order:Order}){
             try {

                const order:Order = payload.order

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

function cancelOrder(payload:{order:Order}){

        const order:Order = payload.order       

        const remainingQuantity = order.remainingQuantity

        const book = ORDERBOOK[order.market]
        if(!book){
                throw new Error("Invalid Market")
        }

        // need to think of
        if (order.side === "buy") {
                const refund = remainingQuantity* order.price
                BALANCES[userId].USD.locked -=refund
                BALANCES[userId].USD.available += refund
                book.bids = book.bids.filter((bid) => bid.id !== order.id)
        } else {
                BALANCES[userId][order.market].locked -= remainingQuantity
                BALANCES[userId][order.market].available += remainingQuantity
                book.asks = book.asks.filter((ask) => ask.id !== order.id)
        }

        return {
                order,
                status:"cancelled"
        }
}

function depositFunds(payload:{userId:string,symbol:string,quantity:number}){

         if(!BALANCES[payload.userId]){
                BALANCES[payload.userId]={}
        }
        const userBalance = BALANCES[payload.userId]

        if( !userBalance[payload.symbol]){
                userBalance[payload.symbol] = {available:0,locked:0}
        }

        const userAssetBalance = userBalance[payload.symbol]

        userAssetBalance.available += payload.quantity

        return {
                userId:payload.userId,
                balance:BALANCES[payload.userId]
        }
   
}

function  initiatedUserBalance(payload:{userId:string,symbol:string,quantity:number}){

        if(!BALANCES[payload.userId]){
                BALANCES[payload.userId]={}
        }
        const userBalance = BALANCES[payload.userId]

        if( !userBalance[payload.symbol]){
                userBalance[payload.symbol] = {available:0,locked:0}
        }

        const userAssetBalance = userBalance[payload.symbol] 

        userAssetBalance.available += payload.quantity

        return {
                userId:payload.userId,
                balance:BALANCES[payload.userId]
        }
}

function getUserBalance(payload:{userId:string}){

         if(!BALANCES[payload.userId]){
                BALANCES[payload.userId]={}
        }

        return {
                userId:payload.userId,
                balance:BALANCES[payload.userId]
        }
}

function getDepth(payload:{symbol:string}){

        if(!ORDERBOOK[payload.symbol]){
                ORDERBOOK[payload.symbol] = {bids:[],asks:[],lastTradePrice:0}
        }

        const top_10_ask = ORDERBOOK[payload.symbol].asks.slice(0,10)
        const top_10_bid = ORDERBOOK[payload.symbol].bids.slice(0,10)
        return {
                symbol:payload.symbol,
                asks:top_10_ask,
                bids:top_10_bid,
                lastTradePrice:ORDERBOOK[payload.symbol].lastTradePrice
        }
}

function makeNewStockEntry(payload:{symbol:string}){
        if(!ORDERBOOK[payload.symbol]){
                ORDERBOOK[payload.symbol] = {bids:[],asks:[],lastTradePrice:0}
        }
        return {
                symbol:payload.symbol,
                orderbook:ORDERBOOK[payload.symbol]
        }
}

export {
        createOrder,
        depositFunds,
        initiatedUserBalance,
        getUserBalance,
        getDepth,
        makeNewStockEntry,
        cancelOrder
}