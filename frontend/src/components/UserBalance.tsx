import React, { useMemo } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { PaginatedTable } from './PaginatedTable';
import { useAuthStore } from '../store/useAuthStore';

export interface AssetBalance {
        asset: string;          
        // assetName?: string;      // e.g. "Bitcoin", "Ethereum"
        available: number;      
        locked: number;         
        iconUrl?: string;       // Optional asset icon
}



export const UserBalance= ({

}) => {

        const {authUser} = useAuthStore()

        const balances = useMemo(()=>{
                const blns: AssetBalance[] = [];
                if(!authUser?.balance) return blns
                Object.keys(authUser?.balance).map((symbol)=>{
                        blns.push({
                                asset:symbol,
                                available:authUser?.balance[symbol].available,
                                locked:authUser?.balance[symbol].locked,
                        })
                })
                return blns ?? []
        },[authUser?.balance])
 
        const columns = useMemo<ColumnDef<AssetBalance>[]>(
                () => [
                        {
                                accessorKey: 'asset',
                                header: 'Asset',
                                cell: (info) => {
                                        const row = info.row.original;
                                        return (
                                                <div className="flex items-center gap-2.5">
                                                        {row.iconUrl && (
                                                                <img
                                                                        src={row.iconUrl}
                                                                        alt={row.asset}
                                                                        className="w-6 h-6 rounded-full border border-[#824b57]"
                                                                />
                                                        ) }
                                                        {row.asset && (
                                                                <div className="w-6 h-6 rounded-full bg-[#161419] border border-[#E8829C] flex items-center justify-center text-[10px] font-bold text-[#E8829C]">
                                                                        {row.asset}
                                                                </div>
                                                        )}
                                                        
                                                </div>
                                        );
                                },
                        },
                        {
                                accessorKey: 'available',
                                header: 'Available',
                                cell: (info) => {
                                        const val = info.getValue<number>();
                                        return (
                                                <span className="font-mono text-sm text-[#3DBE7E] font-semibold">
                                                        {val.toLocaleString(undefined, {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 6,
                                                        })}
                                                </span>
                                        );
                                },
                        },
                        {
                                accessorKey: 'locked',
                                header: 'Locked',
                                cell: (info) => {
                                        const val = info.getValue<number>();
                                        return (
                                                <span className="font-mono text-sm text-[#A09CA3]">
                                                        {val.toLocaleString(undefined, {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 6,
                                                        })}
                                                </span>
                                        );
                                },
                        },
                ],
                []
        );

     
        const totalAvailableCount = useMemo(() => {
                return balances.reduce((acc, curr) => acc + curr.available, 0);
        }, [balances]);

        const totalLockedCount = useMemo(() => {
                return balances.reduce((acc, curr) => acc + curr.locked, 0);
        }, [balances]);

        return (
                <div className=" w-full p-5 font-mono bg-[#0D0C0E]  text-[#FFFFFF] rounded-lg space-y-5">

               
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#824b57]/40 pb-4">
                                <div>
                                        <h2 className="text-xl font-bold text-white tracking-wide">Wallet Balances</h2>
                                        <p className="text-xs text-[#A09CA3]">Overview of your spot equity and locked assets</p>
                                </div>


                        </div>


                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="p-3 bg-[#161419] border border-[#824b57]/60 rounded flex flex-col justify-between">
                                        <span className="text-xs text-[#A09CA3]">Total Unlocked Balance</span>
                                        <span className="text-lg font-bold text-[#3DBE7E] mt-1">
                                                {totalAvailableCount.toLocaleString(undefined, { maximumFractionDigits: 4 })} Assets
                                        </span>
                                </div>
                                <div className="p-3 bg-[#161419] border border-[#824b57]/60 rounded flex flex-col justify-between">
                                        <span className="text-xs text-[#A09CA3]">In Open Orders (Locked)</span>
                                        <span className="text-lg font-bold text-[#E8829C] mt-1">
                                                {totalLockedCount.toLocaleString(undefined, { maximumFractionDigits: 4 })} Assets
                                        </span>
                                </div>
                        </div>

                        <div className="pt-2">
                                <PaginatedTable
                                        data={balances}
                                        columns={columns}
                                />
                        </div>

                </div>
        );
};