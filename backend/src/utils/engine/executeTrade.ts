
import { BALANCES, ORDERBOOK } from "../..";
import { prismaClient } from "../../db";
import type { Order } from "../interfaces";

export async function executeTrade(
    buyOrder: Order,
    sellOrder: Order
) {
        const tradeQty = Math.min(
                buyOrder.remainingQuantity,
                sellOrder.remainingQuantity
        )

        const tradePrice = sellOrder.price

        buyOrder.remainingQuantity -= tradeQty
        buyOrder.filledQuantity += tradeQty

        sellOrder.remainingQuantity -= tradeQty
        sellOrder.filledQuantity += tradeQty


        buyOrder.status =buyOrder.remainingQuantity === 0? "close": "open"

        sellOrder.status = sellOrder.remainingQuantity === 0? "close" : "open"


        ORDERBOOK[buyOrder.market].lastTradePrice =tradePrice

        // update the balances -  means unlock the funds
        BALANCES[buyOrder.userId].USD.locked -=tradeQty * tradePrice
        BALANCES[buyOrder.userId].[buyOrder.market].available +=tradeQty


        BALANCES[sellOrder.userId].[sellOrder.market].locked -=tradeQty
        BALANCES[sellOrder.userId].USD.available += tradeQty * tradePrice

        //make a trade- for each buy and sell order
        await prismaClient.fill.create({
                data: {
                        quantity: tradeQty,
                        side: "buy",
                        type: buyOrder.type,
                        price: tradePrice,
                        market: buyOrder.market,
                        userId: buyOrder.userId,
                        originalOrderID: buyOrder.id
                }
        })

        await prismaClient.fill.create({
                data: {
                        quantity: tradeQty,
                        side: "sell",
                        type: sellOrder.type,
                        price: tradePrice,
                        market: sellOrder.market,
                        userId: sellOrder.userId,
                        originalOrderID: sellOrder.id
                }
        })

        // update the order for buy and sell
        await prismaClient.order.update({
                where: {
                        id: buyOrder.id
                },
                data: {
                        filledQuantity:buyOrder.filledQuantity,
                        remainingQuantity:buyOrder.remainingQuantity,
                        status: buyOrder.status
                }
        })

        await prismaClient.order.update({
                where: {
                        id: sellOrder.id
                },
                data: {
                        filledQuantity:sellOrder.filledQuantity,
                        remainingQuantity:sellOrder.remainingQuantity,
                        status: sellOrder.status
                }
        })


}