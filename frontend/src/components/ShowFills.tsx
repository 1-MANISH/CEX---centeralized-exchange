import React, { useEffect, useMemo } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { PaginatedTable } from './PaginatedTable';
import { useExchangeStore } from '../store/useExchange';

export type OrderType = 'limit' | 'market';
export type OrderSide = 'buy' | 'sell';
export type OrderStatus = 'open' | 'closed' | 'cancelled' | 'partial_filled';

export interface Fill {
        id: string;
        userId?: string;
        originalOrderID?: string;
        market: string;
        price: number;
        quantity: number;
        type: OrderType;
        side: OrderSide;
        createdAt: string;
}

interface ShowFillsProps {
        currentMarket?: string | null; 
}

export const ShowFills: React.FC<ShowFillsProps> = ({
        currentMarket = null,
}) => {

        const {fills,getAllFills,isFetching}:{fills:Fill[],getAllFills:()=>void,isFetching:boolean} = useExchangeStore()
     
        const filteredFills = useMemo(() => {
                if (!currentMarket) return fills;
                if(!fills) return []
                return fills.filter(
                        (fill:Fill) => fill.market.toUpperCase() === currentMarket.toUpperCase()
                );
        }, [fills, currentMarket]);

    
        const columns = useMemo<ColumnDef<Fill>[]>(
                () => [
                       
                        {
                                accessorKey: 'market',
                                header: 'Market',
                                cell: (info) => (
                                        <span className="font-bold text-white font-mono text-xs">
                                                {info.getValue<string>()}
                                        </span>
                                ),
                        },
                        {
                                accessorKey: 'side',
                                header: 'Side',
                                cell: (info) => {
                                        const side = info.getValue<OrderSide>();
                                        const isBuy = side?.toLowerCase() === 'buy';
                                        return (
                                                <span
                                                        className={`font-bold font-mono text-xs uppercase px-1.5 py-0.5 rounded ${isBuy
                                                                        ? 'text-[#3DBE7E] bg-[#3DBE7E]/10 border border-[#3DBE7E]/30'
                                                                        : 'text-[#E55555] bg-[#E55555]/10 border border-[#E55555]/30'
                                                                }`}
                                                >
                                                        {side}
                                                </span>
                                        );
                                },
                        },
                        {
                                accessorKey: 'type',
                                header: 'Type',
                                cell: (info) => (
                                        <span className="text-xs text-[#A09CA3] font-mono capitalize">
                                                {info.getValue<string>()}
                                        </span>
                                ),
                        },
                        {
                                accessorKey: 'price',
                                header: 'Price',
                                cell: (info) => (
                                        <span className="font-mono text-xs text-white">
                                                ${info.getValue<number>().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                                        </span>
                                ),
                        },
                        {
                                accessorKey: 'quantity',
                                header: 'Amount',
                                cell: (info) => (
                                        <span className="font-mono text-xs text-white">
                                                {info.getValue<number>().toLocaleString()}
                                        </span>
                                ),
                        },
                         {
                                accessorKey: 'createdAt',
                                header: 'Time',
                                cell: (info) => {
                                        const val = info.getValue<string>();
                                        const date = new Date(val);
                                        return (
                                                <span className="text-[11px] text-[#A09CA3] font-mono whitespace-nowrap">
                                                        {isNaN(date.getTime())
                                                                ? val
                                                                : date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                </span>
                                        );
                                },
                        },
                ],
                []
        )

        useEffect(()=>{
                if(fills.length===0){
                        getAllFills()
                }
        },[fills,getAllFills])

        return (
                <div className=" w-full p-4 font-mono bg-[#0D0C0E]  text-[#FFFFFF] rounded-lg space-y-3">

        
                        <div className="flex items-center justify-between pb-2 border-b border-[#824b57]/40">
                                <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-bold text-white tracking-wide">
                                                {currentMarket ? `${currentMarket} Orders` : 'All User Trades'}
                                        </h3>
                                        <span className="text-xs px-2 py-0.5 bg-[#161419] border border-[#824b57] text-[#E8829C] rounded-full">
                                                {filteredFills.length}
                                        </span>
                                </div>
                        </div>

                        <PaginatedTable
                                data={filteredFills}
                                columns={columns}
                                isLoading={isFetching}
                        />
                </div>
        );
};