import { prismaClient } from "../db"

 export async function helper(symbol:string){
        
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)

        const [ latestTrade,trade24hAgo,fills] = await Promise.all([
                prismaClient.fill.findFirst({
                        where: {
                                market: symbol
                        },
                        orderBy: {
                                createdAt: "desc"
                        }
                }),

                prismaClient.fill.findFirst({
                        where: {
                                market: symbol,
                                createdAt: {
                                        gte: yesterday
                                }
                                },
                                orderBy: {
                                        createdAt: "asc"
                                }
                }),

                prismaClient.fill.findMany({
                        where: {
                        market: symbol,
                        createdAt: {
                                gte: yesterday
                        }
                        },
                        select: {
                                quantity: true,
                                price: true
                        }
                })

        ])

        const volume = fills.reduce((sum, fill) => sum + (fill && fill?.price !=null ? fill.price * fill.quantity:fill.quantity),0)
        const currentPrice = latestTrade?.price ?? 0
        const previousPrice = trade24hAgo?.price ?? currentPrice
        const change24h =previousPrice === 0? 0: ((currentPrice - previousPrice) / previousPrice) * 100
        return {
                symbol,
                currentPrice,
                volume24h: volume,
                change24h
        }
 }