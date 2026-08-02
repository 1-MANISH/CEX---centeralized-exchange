import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../store/useAuthStore';
import { UserBalance } from './UserBalance';
import { ShowOrders } from './ShowOrders';
import { ShowFills } from './ShowFills';
export type MainTabType =
        | 'balances'
        | 'fillHistory'
        | 'orderHistory'

interface UserHistoryPanelProps {
        marketSymbol?: string; // e.g. "SOL"
        currentMarketButtonEnable:boolean
}

export const UserMarketHistoryPanel: React.FC<UserHistoryPanelProps> = ({
        marketSymbol = null,
        currentMarketButtonEnable=true
}) => {
        const {isLoggedIn} = useAuthStore()
        const navigate  =  useNavigate()
        const [activeTab, setActiveTab] = useState<MainTabType>('balances');
        const [onlyCurrentMarket, setOnlyCurrentMarket] = useState<boolean>(true);

        // Tab definitions
        const mainTabs: { id: MainTabType; label: string }[] = [
                { id: 'balances', label: 'Balances' },
                { id: 'fillHistory', label: 'Trade History' },
                { id: 'orderHistory', label: 'Order History' },

        ];

        // Helper text for empty state based on active tab
        const getEmptyStateMessage = () => {
                switch (activeTab) {
                        case 'fillHistory':
                                return {
                                        title: 'No fill history',
                                        desc: `Once your orders have been filled on ${onlyCurrentMarket ? marketSymbol : 'a market'}, they will show up here.`,
                                };
                        case 'orderHistory':
                                return {
                                        title: 'No order history',
                                        desc: 'Completed and canceled orders will appear in this section.',
                                };
                        case 'balances':
                                return {
                                        title: 'No balance data',
                                        desc: 'Your wallet equity and asset allocation will display here.',
                                };
                        default:
                                return {
                                        title: 'No records found',
                                        desc: 'No activity records found for the selected category.',
                                };
                }
        };

        const emptyInfo = getEmptyStateMessage()

        const ActiveTab =useMemo( () => {

                switch (activeTab) {
                        case 'balances':
                                return (
                                        <UserBalance/>
                                );      
                        case 'fillHistory':
                                return onlyCurrentMarket && currentMarketButtonEnable ? ( <ShowFills currentMarket={marketSymbol} />) : (
                                           <ShowFills currentMarket={null} />
                                )
                        case 'orderHistory':
                                
                                return onlyCurrentMarket && currentMarketButtonEnable ? ( <ShowOrders currentMarket={marketSymbol} />) : (
                                           <ShowOrders currentMarket={null} />
                                )
                        default:
                                return null
                }
        }, [activeTab, marketSymbol,currentMarketButtonEnable,onlyCurrentMarket]);

        return (
                <div className="chalk-card w-full p-4 font-mono bg-[#0D0C0E] border-2 border-[#824b57] text-[#FFFFFF] rounded-lg space-y-4">

                        {/* 1. Header Navigation Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#824b57]/40 pb-3">

                                {/* Main Category Tabs */}
                                <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
                                        {mainTabs.map((tab) => {
                                                const isActive = activeTab === tab.id;
                                                return (
                                                        <button
                                                                key={tab.id}
                                                                onClick={() => setActiveTab(tab.id)}
                                                                className={`px-3 py-1.5 text-xs font-semibold rounded whitespace-nowrap transition-all ${isActive
                                                                                ? 'bg-[#161419] text-[#E8829C] border border-[#E8829C]'
                                                                                : 'text-[#A09CA3] hover:text-white hover:bg-[#161419]/50'
                                                                        }`}
                                                        >
                                                                {tab.label}
                                                        </button>
                                                );
                                        })}
                                </div>

                                {/* Right Controls: Market Filter Checkbox */}
                                <div className="flex items-center gap-4 text-xs text-[#A09CA3]">
                                        {currentMarketButtonEnable && (
                                        <label className="flex items-center gap-2 cursor-pointer hover:text-white select-none">
                                                <input
                                                        type="checkbox"
                                                        checked={onlyCurrentMarket}
                                                        onChange={(e) => setOnlyCurrentMarket(e.target.checked)}
                                                        className="w-4 h-4 rounded accent-[#E8829C] bg-[#161419] border-[#824b57] cursor-pointer"
                                                />
                                                <span>Current Market ({marketSymbol})</span>
                                        </label>
                                        )}
                                </div>
                        </div>

                       

                        {/* 3. Main Content Area */}
                        <div className="min-h-[220px] flex flex-col items-center justify-center py-8">

                                {!isLoggedIn ? (
                                        /* STATE A: User Not Logged In */
                                        <div className="flex flex-col items-center justify-center space-y-3 text-center max-w-sm">
                                                {/* Sketch / Monospace Icon Container */}
                                                <div className="w-12 h-12 rounded-full bg-[#161419] border border-[#824b57] flex items-center justify-center text-[#E8829C]">
                                                        <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="w-6 h-6"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                                strokeWidth={2}
                                                        >
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                        </svg>
                                                </div>

                                                <h3 className="text-base font-bold text-white">Please log in to view history</h3>
                                                <p className="text-xs text-[#A09CA3]">
                                                        Log in or sign up to view your open orders, trades, and position history for {marketSymbol}.
                                                </p>

                                                <button
                                                        type="button"
                                                        onClick={() => navigate('/login')}
                                                        className="mt-2 px-6 py-2 bg-[#E8829C] hover:bg-[#d66b85] text-black font-bold text-xs rounded transition-colors"
                                                >
                                                        Log in
                                                </button>
                                        </div>
                                ) : activeTab ? (
                                        /* STATE B: User Logged In & Has Table Data */
                                        <div className="w-full">{ActiveTab}</div>
                                ) : (
                                        /* STATE C: User Logged In & No Orders/History Data */
                                        <div className="flex flex-col items-center justify-center space-y-3 text-center max-w-md">
                                                {/* Open Book Checkmark Icon matching the screenshot */}
                                                <div className="w-14 h-14 rounded-full bg-[#161419] border border-[#824b57] flex items-center justify-center text-[#E8829C] shadow-inner">
                                                        <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="w-7 h-7"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                                strokeWidth={1.8}
                                                        >
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 10l1.5 1.5L14 8" />
                                                        </svg>
                                                </div>

                                                <h3 className="text-base font-bold text-white">{emptyInfo.title}</h3>
                                                <p className="text-xs text-[#A09CA3] max-w-xs">{emptyInfo.desc}</p>
                                        </div>
                                )}

                        </div>

                </div>
        );
};