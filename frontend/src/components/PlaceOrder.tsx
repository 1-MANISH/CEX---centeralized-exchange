import React, { useState, useEffect, useMemo } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useNavigate } from 'react-router'
import { useExchangeStore } from '../store/useExchange';
interface PlaceOrderProps {
        assetSymbol?: string;      // e.g., "ETH", "SOL", "BTC"
        quoteSymbol?: string;      // e.g., "USD"
        currentMarketPrice?: number; // Current ticker price for Market orders
        availableEquity?: number;  // User's available balance in quote currency
        isLoggedIn?: boolean;

}

export interface OrderPayload {
        side: 'buy' | 'sell';
        type: 'limit' | 'market';
        price: number;
        quantity: number;
        market: string;
}

export const PlaceOrder: React.FC<PlaceOrderProps> = ({
        assetSymbol = 'BTC',
        quoteSymbol = 'USD',
        currentMarketPrice = 63963.90,
}) => {

        const {createOrder,createOrderLoading} = useExchangeStore()
        const navigate = useNavigate()
        const {isLoggedIn} = useAuthStore()
        const [side, setSide] = useState<'buy' | 'sell'>('buy')
        const [orderType, setOrderType] = useState<'limit' | 'market'>('limit')
        const [priceInput, setPriceInput] = useState<string>(currentMarketPrice.toString())
        const [quantityInput, setQuantityInput] = useState<number>(0)


        // Sync price input when market price updates initially
        useEffect(() => {
                if (orderType === 'limit' && !priceInput) {
                        setPriceInput(currentMarketPrice.toString());
                }
        }, [currentMarketPrice, orderType]);

        // Derived Values
        const numericPrice = useMemo(() => {
                if (orderType === 'market') return currentMarketPrice
                const parsed = parseFloat(priceInput)
                return isNaN(parsed) ? 0 : parsed
        }, [priceInput, currentMarketPrice, orderType])

        const numericQuantity = useMemo(() => {
                const parsed = parseFloat(quantityInput)
                return isNaN(parsed) ? 0 : parsed
        }, [quantityInput])

        // Pre-calculated Order Value
        const orderValue = useMemo(() => {
                return (numericPrice * numericQuantity).toFixed(2)
        }, [numericPrice, numericQuantity])



        const handleSubmit = (e: React.FormEvent) => {
                e.preventDefault();
                if (!isLoggedIn) return

                if (numericQuantity <= 0) return

           
                try {
                        if(orderType === 'limit' ){
                                createOrder({
                                        side,
                                                type: orderType,
                                                price: numericPrice,
                                                quantity: numericQuantity,
                                                market: assetSymbol,
                                })
                        }else{
                                createOrder({
                                        side,
                                                type: orderType,
                                                quantity: numericQuantity,
                                                market: assetSymbol,
                                        })
                        }
                        
                } catch (error) {
                        console.log("Error creating order:", error)
                }
                
        }

        return (
                <div className="chalk-card my-4 w-full max-w-sm p-4 font-mono space-y-4 bg-[#0D0C0E] border-2 border-[#824b57] text-[#FFFFFF] rounded-lg">

                    
                        <div className="grid grid-cols-2 gap-2 p-1 bg-[#161419] rounded border border-[#824b57]/60">
                                <button
                                        type="button"
                                        onClick={() => setSide('buy')}
                                        className={`py-2 text-center text-sm font-bold rounded transition-all ${side === 'buy'
                                                        ? 'bg-[#3DBE7E] text-black shadow-md'
                                                        : 'text-[#A09CA3] hover:text-white'
                                                }`}
                                >
                                        Buy
                                </button>
                                <button
                                        type="button"
                                        onClick={() => setSide('sell')}
                                        className={`py-2 text-center text-sm font-bold rounded transition-all ${side === 'sell'
                                                        ? 'bg-[#E55555] text-white shadow-md'
                                                        : 'text-[#A09CA3] hover:text-white'
                                                }`}
                                >
                                        Sell
                                </button>
                        </div>

                       
                        <div className="flex items-center gap-4 text-xs font-semibold border-b border-[#824b57]/40 pb-2">
                                <button
                                        type="button"
                                        onClick={() => setOrderType('limit')}
                                        className={`px-2 py-1 rounded transition-colors ${orderType === 'limit'
                                                        ? 'bg-[#824b57]/40 text-[#E8829C] border border-[#E8829C]'
                                                        : 'text-[#A09CA3] hover:text-white'
                                                }`}
                                >
                                        Limit
                                </button>
                                <button
                                        type="button"
                                        onClick={() => setOrderType('market')}
                                        className={`px-2 py-1 rounded transition-colors ${orderType === 'market'
                                                        ? 'bg-[#824b57]/40 text-[#E8829C] border border-[#E8829C]'
                                                        : 'text-[#A09CA3] hover:text-white'
                                                }`}
                                >
                                        Market
                                </button>
                        </div>



                        <form onSubmit={handleSubmit} className="space-y-3">

                                {/* Price Input (Only for Limit Order) */}
                                {orderType === 'limit' && (
                                        <div className="space-y-1">
                                                <div className="flex justify-between text-xs text-[#A09CA3]">
                                                        <span>Price</span>
                                                      
                                                </div>
                                                <div className="relative flex items-center">
                                                        <input
                                                                type="number"
                                                                step="any"
                                                                placeholder="0.00"
                                                                value={priceInput}
                                                                onChange={(e) => setPriceInput(e.target.value)}
                                                                className="w-full bg-[#161419] border border-[#824b57] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E8829C] font-mono"
                                                        />
                                                        <span className="absolute right-3 text-xs text-[#A09CA3]">{quoteSymbol}</span>
                                                </div>
                                        </div>
                                )}

                                <div className="space-y-1">
                                        <div className="flex justify-between text-xs text-[#A09CA3]">
                                                <span>Quantity</span>
                                                {orderType === 'market' && (
                                                        <span className="text-xs text-[#A09CA3]">
                                                                ≈ {orderValue} {quoteSymbol}
                                                        </span>
                                                )}
                                        </div>
                                        <div className="relative flex items-center">
                                                <input
                                                        type="number"
                                                        step="any"
                                                        placeholder="0.00"
                                                        value={quantityInput}
                                                        onChange={(e) => {
                                                                setQuantityInput(Number(e.target.value))
                                                        }}
                                                        className="w-full bg-[#161419] border border-[#824b57] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E8829C] font-mono"
                                                />
                                                <span className="absolute right-3 text-xs text-[#E8829C] font-bold">{assetSymbol}</span>
                                        </div>
                                </div>

        
                                {orderType === 'limit' && (
                                        <div className="space-y-1 pt-1">
                                                <span className="text-xs text-[#A09CA3]">Order Value</span>
                                                <div className="w-full bg-[#161419]/60 border border-[#824b57]/50 rounded px-3 py-2 text-sm text-white font-mono flex justify-between items-center">
                                                        <span>{orderValue}</span>
                                                        <span className="text-xs text-[#A09CA3]">{quoteSymbol}</span>
                                                </div>
                                        </div>
                                )}

                                <div className="pt-2 text-[11px] text-[#A09CA3] space-y-1 border-t border-[#824b57]/30">
                                        <div className="flex justify-between">
                                                <span>Margin Required</span>
                                                <span className="text-white">—</span>
                                        </div>
                                        <div className="flex justify-between">
                                                <span>Est. Liquidation Price</span>
                                                <span className="text-white">—</span>
                                        </div>
                                        {orderType === 'market' && (
                                                <div className="flex justify-between">
                                                        <span>Max Slippage</span>
                                                        <span className="text-[#3DBE7E]">0.5%</span>
                                                </div>
                                        )}
                                </div>


                                <div className="pt-3">
                                        {isLoggedIn ? (
                                                <button
                                                        type="submit"
                                                        className={`w-full py-3 text-sm font-bold rounded capitalize transition-all border ${side === 'buy'
                                                                        ? 'bg-[#3DBE7E] hover:bg-[#34a36c] text-black border-[#3DBE7E]'
                                                                        : 'bg-[#E55555] hover:bg-[#c94848] text-white border-[#E55555]'
                                                                }`}
                                                                disabled={createOrderLoading}
                                                >
                                                        {createOrderLoading ? 'Placing Order...' : ` ${side} ${assetSymbol} `}
       
                                                </button>
                                        ) : (
                                                <div className="space-y-2">
                                                        <button
                                                                type="button"
                                                                onClick={() => navigate('/signup')}
                                                                className="w-full py-2.5 bg-white text-black font-bold text-sm rounded hover:bg-gray-200 transition-colors"
                                                        >
                                                                Sign up to trade
                                                        </button>
                                                        <button
                                                                type="button"
                                                                onClick={() => navigate('/login')}
                                                                className="w-full py-2.5 bg-[#161419] border border-[#824b57] text-white font-bold text-sm rounded hover:bg-[#824b57]/20 transition-colors"
                                                        >
                                                                Log in to trade
                                                        </button>
                                                </div>
                                        )}
                                </div>

                        </form>
                </div>
        );
};