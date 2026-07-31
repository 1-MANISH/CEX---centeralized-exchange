
import { BALANCES, ORDERBOOK } from "../..";
import type { Order, Side } from "../interfaces";

export function  executeTrade(
        buyOrder: Order,
        sellOrder: Order
) {
        const tradeQty = Math.min(
                buyOrder.remainingQuantity,
                sellOrder.remainingQuantity
        )

        const tradePrice = sellOrder.price

        // updating the orders
        buyOrder.remainingQuantity -= tradeQty
        buyOrder.filledQuantity += tradeQty
        buyOrder.status = buyOrder.remainingQuantity === 0 ? "closed" : "partial_filled"

        sellOrder.remainingQuantity -= tradeQty
        sellOrder.filledQuantity += tradeQty
        sellOrder.status = sellOrder.remainingQuantity === 0 ? "closed" : "partial_filled"

       
        // update the balances -  means unlock the funds
        // buyer
        BALANCES[buyOrder.userId].USD.locked -= tradeQty * tradePrice
        BALANCES[buyOrder.userId][buyOrder.market].available += tradeQty

        // seller
        BALANCES[sellOrder.userId][sellOrder.market].locked -= tradeQty
        BALANCES[sellOrder.userId].USD.available += tradeQty * tradePrice

         // first update orderbook - last trade price
        ORDERBOOK[buyOrder.market].lastTradePrice = tradePrice


        //this we will do at the end - saving into database
        const fills = [
                {
                        side: "buy" as Side,
                        type: buyOrder.type,
                        quantity: tradeQty,
                        price: tradePrice as number,
                        market: buyOrder.market,
                        userId: buyOrder.userId,
                        originalOrderID: buyOrder.id
                },

                {
                        quantity: tradeQty,
                        side: "sell" as Side,
                        type: sellOrder.type,
                        price: tradePrice as number,
                        market: sellOrder.market,
                        userId: sellOrder.userId,
                        originalOrderID: sellOrder.id
                }

        ]

        const updatedOrders = [
                // update the order for buy and sell
                {
                        id: buyOrder.id,
                        filledQuantity: buyOrder.filledQuantity,
                        remainingQuantity: buyOrder.remainingQuantity,
                        status: buyOrder.status
                },
                {
                        id: sellOrder.id,
                        filledQuantity: sellOrder.filledQuantity,
                        remainingQuantity: sellOrder.remainingQuantity,
                        status: sellOrder.status
                }

        ]

        return {
                fills,
                updatedOrders,
                lastTradePrice: ORDERBOOK[buyOrder.market].lastTradePrice
        }

}