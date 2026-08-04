import React from 'react';
import { StepsToRun } from '../components/StepsToRun';

export const Docs: React.FC = () => {
        return (
                <div className="max-w-5xl mx-auto p-4 sm:p-6 font-mono space-y-10 bg-[#0D0C0E] text-white min-h-screen my-20">

                        {/* 1. Main Header */}
                        <div className="text-center space-y-3 border-b border-[#824b57]/50 pb-8">
                                <span className=" text-xs px-3 py-1 bg-[#161419] border border-[#E8829C] text-[#E8829C] rounded-full uppercase tracking-widest font-bold">
                                        Documentation & Rules
                                </span>
                                <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
                                        Simulated Centralized Exchange (CEX)
                                </h1>
                                <p className="text-sm text-[#A09CA3] max-w-2xl mx-auto">
                                        Learn how centralized orderbooks, limit orders, market fills, and virtual balances work in an interactive, risk-free environment.
                                </p>
                        </div>

                        {/* 2. Platform Overview & Rules */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="chalk-card p-5 bg-[#0D0C0E] border-2 border-[#824b57] rounded-lg space-y-2">
                                        <div className="text-[#3DBE7E] text-lg font-bold">01. Zero Real Money</div>
                                        <h3 className="font-bold text-white text-sm">Paper Trading Only</h3>
                                        <p className="text-xs text-[#A09CA3]">
                                                All funds, trades, and balances are purely simulated. You can test strategies and learn orderbook dynamics without losing actual assets.
                                        </p>
                                </div>

                                <div className="chalk-card p-5 bg-[#0D0C0E] border-2 border-[#824b57] rounded-lg space-y-2">
                                        <div className="text-[#E8829C] text-lg font-bold">02. Real CEX Engine</div>
                                        <h3 className="font-bold text-white text-sm">Matching Orderbook</h3>
                                        <p className="text-xs text-[#A09CA3]">
                                                Experience live bid/ask spreads, order depth visualization, limit order executions, and trade history updates in real-time.
                                        </p>
                                </div>

                                <div className="chalk-card p-5 bg-[#0D0C0E] border-2 border-[#824b57] rounded-lg space-y-2">
                                        <div className="text-[#3DBE7E] text-lg font-bold">03. Free Pricing</div>
                                        <h3 className="font-bold text-white text-sm">100% Free Forever</h3>
                                        <p className="text-xs text-[#A09CA3]">
                                                There are no subscription fees, hidden charges, or real deposit costs. Everything is free to use for education and simulation.
                                        </p>
                                </div>
                        </div>

                        {/* 3. Pricing & Fees Information Box */}
                        <div className="chalk-card p-6 bg-[#161419] border-2 border-[#824b57] rounded-lg space-y-4">
                                <div className="flex items-center justify-between border-b border-[#824b57]/40 pb-3">
                                        <h2 className="text-lg font-bold text-white">Application Pricing & Fees</h2>
                                        <span className="px-2.5 py-0.5 text-xs font-bold bg-[#3DBE7E]/20 text-[#3DBE7E] border border-[#3DBE7E]/40 rounded">
                                                Free Tier Active
                                        </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                        <div className="space-y-1">
                                                <span className="text-[#A09CA3] font-semibold">Account Registration:</span>
                                                <p className="text-white font-bold">$0.00 (Free)</p>
                                        </div>
                                        <div className="space-y-1">
                                                <span className="text-[#A09CA3] font-semibold">Mock Deposits & Withdrawals:</span>
                                                <p className="text-white font-bold">$0.00 (Free)</p>
                                        </div>
                                        <div className="space-y-1">
                                                <span className="text-[#A09CA3] font-semibold">Trading Commission:</span>
                                                <p className="text-[#3DBE7E] font-bold">0.00% Maker / 0.00% Taker</p>
                                        </div>
                                        <div className="space-y-1">
                                                <span className="text-[#A09CA3] font-semibold">Supported Assets:</span>
                                                <p className="text-white font-bold">BTC, ETH, SOL, USD</p>
                                        </div>
                                </div>
                        </div>

                        {/* 4. Steps To Run Section */}
                        <div className="pt-4 border-t border-[#824b57]/50">
                                <StepsToRun />
                        </div>

                        {/* 5. Bottom Call To Action */}
                        <div className="chalk-card p-6 bg-[#0D0C0E] border-2 border-[#824b57] text-center rounded-lg space-y-3">
                                <h3 className="text-base font-bold text-white">Ready to start simulated trading?</h3>
                                <p className="text-xs text-[#A09CA3] max-w-md mx-auto">
                                        Deposit test USD into your wallet balance and place your first limit order on BTC, ETH, or SOL.
                                </p>
                        </div>

                </div>
        );
};