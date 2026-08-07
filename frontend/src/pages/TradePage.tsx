import React, { useEffect, useState } from 'react'
import { StockChart } from '../components/StockChart'
import { useParams } from 'react-router'
import { PlaceOrder } from '../components/PlaceOrder'
import { OrderBook } from '../components/OrderBook'
import { OrderBookTest } from '../components/OrderBookTest'
import { UserMarketHistoryPanel } from '../components/UserMarketHistoryPanel'
import { useExchangeStore } from '../store/useExchange'

const backendData = {

      bids: [
        {
          price: 1000,
          quantity: 5,
          filledQuantity: 4,
          remainingQuantity: 1,
        },
        {
          price: 900,
          quantity: 5,
          filledQuantity: 3,
          remainingQuantity: 2,
        },
      ],
      asks: [
        {
          price: 1050,
          quantity: 3,
          filledQuantity: 2,
          remainingQuantity: 1,
        },
         {
          price: 1100,
          quantity: 5,
          filledQuantity: 3,
          remainingQuantity: 2,
        }
      ],
      lastTradePrice: 1025.50,
};

export const TradePage: React.FC = () => {

        const {orderBook,stockMarketMatrix,getOrderBook} = useExchangeStore()


        const [side, setSide] = useState<'buy' | 'sell'>('buy')

        const params = useParams<{ symbol: string }>()
        const symbol = params.symbol as string

        const market = stockMarketMatrix.find((item) => item.symbol === symbol)

        useEffect(()=>{
                getOrderBook(symbol)
        },[symbol,getOrderBook])


        return (
                <div className="space-y-4">
                        {/* Top Ticker Header */}
                        <div className="chalk-card p-4 flex justify-between items-center font-mono">
                                <div>
                                        <span className="text-[#e8829c] font-bold text-xl">{symbol}/USD</span>
                                        <span className="ml-4 text-[#3dbe7e]">${market?.currentPrice}</span>
                                </div>
                                <div className="flex gap-6 text-xs text-[#a09ca3]">
                                        <div>24h Change: <span className="text-[#e55555]">{market?.change24h}%</span></div>
                                        <div>24h Volume: {market?.volume24h}</div>

                                </div>
                        </div>

                        {/* Graph and Order Placement Form */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <div className="lg:col-span-2 space-y-4">
                                        <div className="py-4 space-y-4 flex  gap-2 sm:flex-row flex-col">
                                                <div className='flex-2'><StockChart  /></div>
                                                <div className='flex-1'><OrderBook symbol={symbol} data={orderBook} /></div>
                                                {/* <div className='flex-1'><OrderBookTest symbol={symbol} data={orderBook} /></div> */}
                                        </div>

                                      
                                </div>

                                <PlaceOrder 
                                        assetSymbol={symbol}
                                        quoteSymbol="USD"
                                        currentMarketPrice={market?.currentPrice}
                                />
                        </div>
                        <div>
                                  <UserMarketHistoryPanel
                                   currentMarketButtonEnable={true}
                                   marketSymbol={symbol}
                                   />
                        </div>

                </div>
        );
};