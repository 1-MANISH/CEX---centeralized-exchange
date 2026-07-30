import React, { useState } from 'react';
import { StockChart } from '../components/StockChart';
import { Box } from 'lucide-react';

export const TradePage: React.FC = () => {
        const [side, setSide] = useState<'buy' | 'sell'>('buy');

        return (
                <div className="space-y-4">
                        {/* Top Ticker Header */}
                        <div className="chalk-card p-4 flex justify-between items-center font-mono">
                                <div>
                                        <span className="text-[#e8829c] font-bold text-xl">BTC/USD</span>
                                        <span className="ml-4 text-[#3dbe7e]">$63,963.9</span>
                                </div>
                                <div className="flex gap-6 text-xs text-[#a09ca3]">
                                        <div>24h Change: <span className="text-[#e55555]">-0.67%</span></div>
                                        <div>24h High: 64,400.0</div>
                                        <div>24h Low: 63,120.0</div>
                                        <div>24h Vol: $2,034,512,891.4</div>
                                </div>
                        </div>

                        {/* Graph and Order Placement Form */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <div className="lg:col-span-2 space-y-4">
                                        <StockChart />

                                        {/* Open Orders Container */}
                                        <div className="chalk-card p-6 text-center space-y-2">
                                                <Box className="mx-auto text-[#824b57]" size={32} />
                                                <div className="text-sm text-[#a09ca3]">No open orders</div>
                                        </div>
                                </div>

                                {/* Order Form */}
                                <div className="chalk-card p-4 space-y-4 h-fit">
                                        <div className="flex border-b border-[#824b57] pb-2 gap-2">
                                                <button
                                                        onClick={() => setSide('buy')}
                                                        className={`flex-1 py-1 font-bold rounded ${side === 'buy' ? 'bg-[#3dbe7e]/20 text-[#3dbe7e] border border-[#3dbe7e]' : 'text-[#a09ca3]'
                                                                }`}
                                                >
                                                        Buy
                                                </button>
                                                <button
                                                        onClick={() => setSide('sell')}
                                                        className={`flex-1 py-1 font-bold rounded ${side === 'sell' ? 'bg-[#e55555]/20 text-[#e55555] border border-[#e55555]' : 'text-[#a09ca3]'
                                                                }`}
                                                >
                                                        Sell
                                                </button>
                                        </div>

                                        <div className="space-y-3 font-mono text-sm">
                                                <div>
                                                        <label className="text-xs text-[#a09ca3]">Price (USD)</label>
                                                        <input className="chalk-input w-full mt-1" defaultValue="63963.9" />
                                                </div>
                                                <div>
                                                        <label className="text-xs text-[#a09ca3]">Quantity (BTC)</label>
                                                        <input className="chalk-input w-full mt-1" placeholder="0.00" />
                                                </div>
                                                <button
                                                        className={`w-full chalk-button mt-4 font-bold ${side === 'buy' ? 'bg-[#3dbe7e] text-black hover:bg-[#3dbe7e]/80' : 'bg-[#e55555] text-white hover:bg-[#e55555]/80'
                                                                }`}
                                                >
                                                        {side === 'buy' ? 'Buy BTC' : 'Sell BTC'}
                                                </button>
                                        </div>
                                </div>
                        </div>
                </div>
        );
};