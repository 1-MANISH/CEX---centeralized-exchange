import React, { useMemo } from 'react';

export interface OrderBookLevel {
        price: number;
        quantity: number;
        filledQuantity?: number;
        remainingQuantity?: number;
}

export interface MarketOrderBook {
        bids: OrderBookLevel[];
        asks: OrderBookLevel[];
        lastTradePrice: number;
}

interface OrderBookProps {
        symbol?: string; // e.g., "SOL" or "SOL/USD"
        data?: MarketOrderBook;
}

export const OrderBookTest: React.FC<OrderBookProps> = ({
        symbol = 'SOL',
        data = {
                bids: [],
                asks: [],
                lastTradePrice: 0,
        },
}) => {
        const baseSymbol = symbol

        const sortedAsks = data.asks // lowest to highest
        const sortedBids = data.bids// highest to lowest


        const processedAsks = useMemo(() => {
                let runningTotal = 0;
                const reversed = [...sortedAsks]
                const mapped = reversed.map((item) => {
                        const activeSize = item.remainingQuantity ?? item.quantity
                        runningTotal += activeSize;
                        const filled = item.filledQuantity || 0
                        const fillPercentage = item.quantity > 0 ? (filled / item.quantity) * 100 : 0;
                        return {
                                ...item,
                                displaySize: activeSize,
                                total: runningTotal,
                                fillPercentage,
                        }
                })
                return mapped.reverse()
        }, [sortedAsks]);

        // 2. Process Bids (Green)

        const processedBids = useMemo(() => {
                let runningTotal = 0
                return sortedBids.map((item) => {
                        const activeSize = item.remainingQuantity ?? item.quantity
                        runningTotal += activeSize
                        const filled = item.filledQuantity || 0
                        const fillPercentage = item.quantity > 0 ? (filled / item.quantity) * 100 : 0
                        return {
                                ...item,
                                displaySize: activeSize,
                                total: runningTotal,
                                fillPercentage,
                        }
                })
        }, [sortedBids])

        // 3. Max Cumulative Total for Depth Bar Background Width
        const maxTotal = useMemo(() => {
                const maxAskTotal = processedAsks[0]?.total || 0;
                const maxBidTotal = processedBids[processedBids.length - 1]?.total || 0;
                return Math.max(maxAskTotal, maxBidTotal, 0.0001);
        }, [processedAsks, processedBids]);

        // 4. Overall Depth Percentage Bar (Bid % vs Ask %)
        const depthRatio = useMemo(() => {
                const totalBidVolume = processedBids[processedBids.length - 1]?.total || 0
                const totalAskVolume = processedAsks[0]?.total || 0
                const sum = totalBidVolume + totalAskVolume

                if (sum === 0) return { bidPercent: 50, askPercent: 50 }
                const bidPercent = Math.round((totalBidVolume / sum) * 100)
                return {
                        bidPercent,
                        askPercent: 100 - bidPercent,
                }
        }, [processedBids, processedAsks])

        return (
                <div className="chalk-card w-full max-w-sm p-3 font-mono bg-[#0D0C0E] border-2 border-[#824b57] text-[#FFFFFF] rounded-lg space-y-2 select-none">

                        {/* Mode Controls */}
                        <div className="flex items-center justify-between pb-2 border-b border-[#824b57]/40 text-xs text-[#A09CA3]">
                                <div className="flex items-center gap-2">
                                        {/* Visual Orderbook Layout Icons */}
                                        <button className="text-[#3DBE7E] hover:text-white transition-colors" title="Both Asks & Bids">
                                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                                        <rect x="3" y="4" width="18" height="6" fill="#E55555" rx="1" />
                                                        <rect x="3" y="14" width="18" height="6" fill="#3DBE7E" rx="1" />
                                                </svg>
                                        </button>
                                        <button className="text-[#A09CA3] hover:text-[#E55555] transition-colors" title="Asks Only">
                                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                                        <rect x="3" y="4" width="18" height="16" fill="#E55555" rx="1" />
                                                </svg>
                                        </button>
                                        <button className="text-[#A09CA3] hover:text-[#3DBE7E] transition-colors" title="Bids Only">
                                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                                        <rect x="3" y="4" width="18" height="16" fill="#3DBE7E" rx="1" />
                                                </svg>
                                        </button>
                                </div>

                                <div className="flex items-center gap-1 text-[11px] font-semibold text-[#A09CA3]">
                                        <span>Precision:</span>
                                        <span className="px-1.5 py-0.5 bg-[#161419] border border-[#824b57]/60 rounded text-white">0.1</span>
                                </div>
                        </div>

                        {/* Table Header */}
                        <div className="grid grid-cols-3 text-[11px] text-[#A09CA3] font-semibold py-1 border-b border-[#824b57]/20">
                                <span className="text-left">Price (USD)</span>
                                <span className="text-right">Size ({baseSymbol})</span>
                                <span className="text-right">Total ({baseSymbol})</span>
                        </div>

                        {/* Orderbook List */}
                        <div className="space-y-0.5 text-xs">

                                {/* ASKS (RED) */}
                                <div className="space-y-0.5">
                                        {processedAsks.length > 0 ? (
                                                processedAsks.map((ask, idx) => {
                                                        const depthBarWidth = Math.min((ask.total / maxTotal) * 100, 100);

                                                        return (
                                                                <div
                                                                        key={`ask-${ask.price}-${idx}`}
                                                                        className="relative grid grid-cols-3 py-0.5 px-1 items-center hover:bg-[#E55555]/15 rounded transition-colors group cursor-pointer"
                                                                >
                                                                        {/* Visual Cumulative Depth Fill */}
                                                                        <div
                                                                                className="absolute right-0 top-0 bottom-0 bg-[#E55555]/25 rounded-l transition-all pointer-events-none"
                                                                                style={{ width: `${depthBarWidth}%` }}
                                                                        />

                                                                        {/* Price */}
                                                                        <span className="text-[#E55555] font-semibold z-10 text-left">
                                                                                {ask.price.toFixed(2)}
                                                                        </span>

                                                                        {/* Active / Remaining Size */}
                                                                        <div className="text-right z-10 text-gray-200 flex flex-col items-end">
                                                                                <span>{ask.displaySize.toFixed(4)}</span>
                                                                                {/* Partial fill badge indicator if order is partially filled */}
                                                                                {ask.fillPercentage > 0 && (
                                                                                        <span className="text-[9px] text-[#A09CA3] leading-none">
                                                                                                {ask.fillPercentage.toFixed(0)}% filled
                                                                                        </span>
                                                                                )}
                                                                        </div>

                                                                        {/* Cumulative Total */}
                                                                        <span className="text-right z-10 text-gray-300">
                                                                                {ask.total.toFixed(4)}
                                                                        </span>
                                                                </div>
                                                        );
                                                })
                                        ) : (
                                                <div className="text-center py-2 text-[11px] text-[#6B6570]">No asks available</div>
                                        )}
                                </div>

                                {/* MIDDLE SPREAD / LAST TRADE PRICE */}
                                <div className="py-2 my-1 px-2 border-y border-[#824b57]/40 bg-[#161419] flex items-center justify-between text-sm font-bold">
                                        <div className="flex items-center gap-2">
                                                <span
                                                        className={`text-base font-extrabold ${data.lastTradePrice > 0 ? 'text-[#3DBE7E]' : 'text-gray-400'
                                                                }`}
                                                >
                                                          ${data.lastTradePrice > 0 ? data.lastTradePrice.toFixed(4) : '—'}
                                                </span>
                                        </div>
                                </div>

                                {/* BIDS (GREEN) */}
                                <div className="space-y-0.5">
                                        {processedBids.length > 0 ? (
                                                processedBids.map((bid, idx) => {
                                                        const depthBarWidth = Math.min((bid.total / maxTotal) * 100, 100);

                                                        return (
                                                                <div
                                                                        key={`bid-${bid.price}-${idx}`}
                                                                        className="relative grid grid-cols-3 py-0.5 px-1 items-center hover:bg-[#3DBE7E]/15 rounded transition-colors group cursor-pointer"
                                                                >
                                                                        {/* Visual Cumulative Depth Fill */}
                                                                        <div
                                                                                className="absolute right-0 top-0 bottom-0 bg-[#3DBE7E]/25 rounded-l transition-all pointer-events-none"
                                                                                style={{ width: `${depthBarWidth}%` }}
                                                                        />

                                                                        {/* Price */}
                                                                        <span className="text-[#3DBE7E] font-semibold z-10 text-left">
                                                                                {bid.price.toFixed(2)}
                                                                        </span>

                                                                        {/* Active / Remaining Size */}
                                                                        <div className="text-right z-10 text-gray-200 flex flex-col items-end">
                                                                                <span>{bid.displaySize.toFixed(4)}</span>
                                                                                {/* Partial fill badge indicator */}
                                                                                {bid.fillPercentage > 0 && (
                                                                                        <span className="text-[9px] text-[#A09CA3] leading-none">
                                                                                                {bid.fillPercentage.toFixed(0)}% filled
                                                                                        </span>
                                                                                )}
                                                                        </div>

                                                                        {/* Cumulative Total */}
                                                                        <span className="text-right z-10 text-gray-300">
                                                                                {bid.total.toFixed(4)}
                                                                        </span>
                                                                </div>
                                                        );
                                                })
                                        ) : (
                                                <div className="text-center py-2 text-[11px] text-[#6B6570]">No bids available</div>
                                        )}
                                </div>

                        </div>

                        {/* Bottom Bid/Ask Depth Percentage Bar */}
                        <div className="pt-2">
                                <div className="w-full h-5 bg-[#161419] rounded overflow-hidden flex border border-[#824b57]/40 text-[10px] font-bold">
                                        <div
                                                style={{ width: `${depthRatio.bidPercent}%` }}
                                                className="bg-[#3DBE7E]/30 text-[#3DBE7E] flex items-center justify-start px-2 transition-all"
                                        >
                                                {depthRatio.bidPercent}%
                                        </div>
                                        <div
                                                style={{ width: `${depthRatio.askPercent}%` }}
                                                className="bg-[#E55555]/30 text-[#E55555] flex items-center justify-end px-2 transition-all"
                                        >
                                                {depthRatio.askPercent}%
                                        </div>
                                </div>
                        </div>

                </div>
        );
};