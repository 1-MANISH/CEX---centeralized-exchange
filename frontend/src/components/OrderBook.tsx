import React, { useMemo } from 'react';

export interface OrderBookEntry {
        price: number;
        quantity: number;
}

export interface OrderBookDepth {
        bids: OrderBookEntry[];
        asks: OrderBookEntry[];
        lastTradePrice: number;
}

interface OrderBookProps {
        symbol?: string; 
        data?: OrderBookDepth;
}

export const OrderBook: React.FC<OrderBookProps> = ({
        symbol = 'SOL',
        data = {
                bids: [],
                asks: [],
                lastTradePrice: 0,
        },
}) => {

        const sortedAsks = data.asks // lowest to highest
        // highest to lowest
        const sortedBids = data.bids


        const processedAsks = useMemo(() => {
                let cumulative = 0
                const mapped = sortedAsks.map((item) => {
                        const size = item.price * item.quantity;
                        cumulative += size;
                        return {
                                ...item,
                                size,
                                total: cumulative,
                        }
                })
                return mapped
        }, [sortedAsks])


        const processedBids = useMemo(() => {
                let cumulative = 0;
                return sortedBids.map((item) => {
                        const size = item.price * item.quantity;
                        cumulative += size;
                        return {
                                ...item,
                                size,
                                total: cumulative,
                        };
                });
        }, [sortedBids])

        // Max cumulative total across bids & asks for calculating depth bar percentages
        const maxTotal = useMemo(() => {
                const maxAskTotal = processedAsks[0]?.total || 0
                const maxBidTotal = processedBids[processedBids.length - 1]?.total || 0
                return Math.max(maxAskTotal, maxBidTotal, 1)
        }, [processedAsks, processedBids])

        // Calculate overall Bid vs Ask volume ratio percentage
        const depthRatio = useMemo(() => {
                const totalBidVolume = processedBids.reduce((acc, curr) => acc + curr.size, 0)
                const totalAskVolume = processedAsks.reduce((acc, curr) => acc + curr.size, 0)
                const sum = totalBidVolume + totalAskVolume

                if (sum === 0) return { bidPercent: 50, askPercent: 50 }
                const bidPercent = Math.round((totalBidVolume / sum) * 100)
                return {
                        bidPercent,
                        askPercent: 100 - bidPercent,
                };
        }, [processedBids, processedAsks])

        const [quoteSymbol] = symbol

        return (
                <div className="chalk-card w-full max-w-sm p-3 font-mono bg-[#0D0C0E] border-2 border-[#824b57] text-[#FFFFFF] rounded-lg space-y-2 select-none">

                      
                        <div className="flex items-center justify-between pb-2 border-b border-[#824b57]/40 text-xs text-[#A09CA3]">
                                <div className="flex items-center gap-3 font-bold text-white">
                                        <span className="text-[#E8829C]">Book</span>
                                </div>
                                <div className="flex items-center gap-1 text-[11px]">
                                        <span className="text-[#6B6570]">0.00001</span>
                                </div>
                        </div>

         
                        <div className="grid grid-cols-3 text-[11px] text-[#A09CA3] font-semibold py-1">
                                <span className="text-left">Price (USD)</span>
                                <span className="text-right">Size ({quoteSymbol || 'USD'})</span>
                                <span className="text-right">Total (USD)</span>
                        </div>

         
                        <div className="space-y-0.5 text-xs">

                                {/* Asks (Red) */}
                                <div className="space-y-0.5">
                                        {processedAsks.length > 0 ? (
                                                processedAsks.map((ask, idx) => {
                                                        const depthWidth = Math.min((ask.total / maxTotal) * 100, 100);
                                                        return (
                                                                <div
                                                                        key={`ask-${ask.price}-${idx}`}
                                                                        className="relative grid grid-cols-3 py-0.5 px-1 items-center hover:bg-[#E55555]/10 rounded transition-colors"
                                                                >
                                                                        {/* Depth Bar Background */}
                                                                        <div
                                                                                className="absolute right-0 top-0 bottom-0 bg-[#E55555]/25 rounded-l transition-all pointer-events-none"
                                                                                style={{ width: `${depthWidth}%` }}
                                                                        />

                                                                        <span className="text-[#E55555] font-semibold z-10 text-left">
                                                                                {ask.price.toFixed(4)}
                                                                        </span>
                                                                        <span className="text-right z-10 text-gray-200">
                                                                                {ask.size.toFixed(2)}
                                                                        </span>
                                                                        <span className="text-right z-10 text-gray-300">
                                                                                {ask.total.toFixed(2)}
                                                                        </span>
                                                                </div>
                                                        );
                                                })
                                        ) : (
                                                <div className="text-center py-2 text-[11px] text-[#6B6570]">No asks available</div>
                                        )}
                                </div>

                                {/* Middle Bar: Last Trade Price Indicator */}
                                <div className="py-2 my-1 px-2 border-y border-[#824b57]/30 bg-[#161419] flex items-center justify-between text-sm font-bold">
                                        <div className="flex items-center gap-2">
                                                <span className="text-[#3DBE7E] text-base">
                                                        {data.lastTradePrice > 0 ? data.lastTradePrice.toFixed(4) : '—'}
                                                </span>
                                                <span className="text-xs text-[#A09CA3] font-normal">
                                                        ${data.lastTradePrice > 0 ? data.lastTradePrice.toFixed(2) : '0.00'}
                                                </span>
                                        </div>
                                </div>

                                {/* Bids (Green) */}
                                <div className="space-y-0.5">
                                        {processedBids.length > 0 ? (
                                                processedBids.map((bid, idx) => {
                                                        const depthWidth = Math.min((bid.total / maxTotal) * 100, 100);
                                                        return (
                                                                <div
                                                                        key={`bid-${bid.price}-${idx}`}
                                                                        className="relative grid grid-cols-3 py-0.5 px-1 items-center hover:bg-[#3DBE7E]/10 rounded transition-colors"
                                                                >
                                                                        {/* Depth Bar Background */}
                                                                        <div
                                                                                className="absolute right-0 top-0 bottom-0 bg-[#3DBE7E]/25 rounded-l transition-all pointer-events-none"
                                                                                style={{ width: `${depthWidth}%` }}
                                                                        />

                                                                        <span className="text-[#3DBE7E] font-semibold z-10 text-left">
                                                                                {bid.price.toFixed(4)}
                                                                        </span>
                                                                        <span className="text-right z-10 text-gray-200">
                                                                                {bid.size.toFixed(2)}
                                                                        </span>
                                                                        <span className="text-right z-10 text-gray-300">
                                                                                {bid.total.toFixed(2)}
                                                                        </span>
                                                                </div>
                                                        );
                                                })
                                        ) : (
                                                <div className="text-center py-2 text-[11px] text-[#6B6570]">No bids available</div>
                                        )}
                                </div>

                        </div>

                        {/* Bottom Depth Ratio Bar (Bid % vs Ask %) */}
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