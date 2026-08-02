import React, { useEffect, useMemo } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { PaginatedTable } from './PaginatedTable';
import { useExchangeStore } from '../store/useExchange';

export type OrderType = 'limit' | 'market';
export type OrderSide = 'buy' | 'sell';
export type OrderStatus = 'open' | 'closed' | 'cancelled' | 'partial_filled';

export interface Order {
        id: string;
        userId?: string;
        market: string;
        price: number;
        quantity: number;
        type: OrderType;
        side: OrderSide;
        filledQuantity: number;
        remainingQuantity: number;
        status: OrderStatus;
        createdAt: string;
}

interface ShowOrdersProps {
        currentMarket?: string | null; 
}

export const ShowOrders: React.FC<ShowOrdersProps> = ({
        currentMarket = null,
}) => {

        const {orders,getAllOrders,isFetching}:{orders:Order[],getAllOrders:()=>void,isFetching:boolean} = useExchangeStore()
     
        const filteredOrders = useMemo(() => {
                if (!currentMarket) return orders;
                if(!orders) return []
                return orders.filter(
                        (order) => order.market.toUpperCase() === currentMarket.toUpperCase()
                );
        }, [orders, currentMarket]);

    
        const columns = useMemo<ColumnDef<Order>[]>(
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
                                accessorKey: 'filledQuantity',
                                header: 'Filled / Remaining',
                                cell: (info) => {
                                        const row = info.row.original;
                                        const fillPercent = row.quantity > 0 ? Math.round((row.filledQuantity / row.quantity) * 100) : 0;
                                        return (
                                                <div className="flex flex-col text-xs font-mono">
                                                        <span className="text-gray-200">
                                                                {row.filledQuantity} / <span className="text-[#A09CA3]">{row.remainingQuantity}</span>
                                                        </span>
                                                        <span className="text-[10px] text-[#A09CA3]">{fillPercent}% Filled</span>
                                                </div>
                                        );
                                },
                        },
                        {
                                accessorKey: 'status',
                                header: 'Status',
                                cell: (info) => {
                                        const status = info.getValue<OrderStatus>()?.toLowerCase();

                                        let colorClasses = 'text-[#A09CA3] bg-[#161419] border-[#824b57]/40';
                                        if (status === 'open') colorClasses = 'text-[#E8829C] bg-[#E8829C]/10 border-[#E8829C]/40';
                                        if (status === 'closed') colorClasses = 'text-[#3DBE7E] bg-[#3DBE7E]/10 border-[#3DBE7E]/40';
                                        if (status === 'cancelled') colorClasses = 'text-gray-400 bg-gray-800/40 border-gray-700';

                                        return (
                                                <span className={`text-[11px] font-mono capitalize px-2 py-0.5 rounded border ${colorClasses}`}>
                                                        {status}
                                                </span>
                                        );
                                },
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
                        {
                                id: 'actions',
                                header: '',
                                cell: (info) => {
                                        const order = info.row.original;
                                        if (order.status?.toLowerCase() !== 'closed') {
                                                return (
                                                        <button
                                                                onClick={() =>{}}
                                                                className="px-2 py-1 text-[11px] font-mono font-bold text-[#E55555] bg-[#E55555]/10 hover:bg-[#E55555]/20 border border-[#E55555]/40 rounded transition-colors"
                                                        >
                                                                Cancel
                                                        </button>
                                                );
                                        }
                                        return null;
                                },
                        },
                ],
                []
        )

        useEffect(()=>{
                if(orders.length===0){
                        getAllOrders()
                }
        },[orders,getAllOrders])

        return (
                <div className=" w-full p-4 font-mono bg-[#0D0C0E]  text-[#FFFFFF] rounded-lg space-y-3">

        
                        <div className="flex items-center justify-between pb-2 border-b border-[#824b57]/40">
                                <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-bold text-white tracking-wide">
                                                {currentMarket ? `${currentMarket} Orders` : 'All User Orders'}
                                        </h3>
                                        <span className="text-xs px-2 py-0.5 bg-[#161419] border border-[#824b57] text-[#E8829C] rounded-full">
                                                {filteredOrders.length}
                                        </span>
                                </div>
                        </div>

                        <PaginatedTable
                                data={filteredOrders}
                                columns={columns}
                                isLoading={isFetching}
                        />
                </div>
        );
};