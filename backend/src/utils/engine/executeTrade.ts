

import { BALANCES, ORDERBOOK } from "../..";
import { prismaClient } from "../../db";
import type { InComingOrder } from "../interfaces";

export async function executeTrade(
    buyOrder: InComingOrder,
    sellOrder: InComingOrder
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


        buyOrder.status =
                buyOrder.remainingQuantity === 0
                ? "close"
                : "open";

        sellOrder.status =
                sellOrder.remainingQuantity === 0
                ? "close"
                : "open";


        ORDERBOOK[buyOrder.market].lastTradePrice =tradePrice

        BALANCES[buyOrder.userId].USD.locked -=tradeQty * tradePrice

        BALANCES[buyOrder.userId].SOL.available +=tradeQty



        BALANCES[sellOrder.userId].SOL.locked -=tradeQty

        BALANCES[sellOrder.userId].USD.available += tradeQty * tradePrice


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
        });


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