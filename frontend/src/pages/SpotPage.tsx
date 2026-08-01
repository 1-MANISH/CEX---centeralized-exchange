
import type { ColumnDef } from '@tanstack/react-table';
import { PaginatedTable } from '../components/PaginatedTable';
import { useNavigate } from 'react-router';
import { useExchangeStore } from '../store/useExchange';
import { useEffect } from 'react';

// interface StockItem {
//         name: string;
//         symbol: string;
//         currentPrice: string;
//         volume24h: string;
//         change24h: string;
// }

// const mockStocks: StockItem[] = [
//         { name: 'Raydium', symbol: 'RAY/USD', currentPrice: '$1.84', volume24h: '$159.6M', change24h: '-2.31%' },
//         { name: 'Shiba Inu', symbol: 'SHIB/USD', currentPrice: '$0.000024', volume24h: '$2.7B', change24h: '+4.18%' },
//         { name: 'io.net', symbol: 'IO/USD', currentPrice: '$3.21', volume24h: '$47.5M', change24h: '-1.07%' },
//         { name: 'Lido', symbol: 'LDO/USD', currentPrice: '$2.31', volume24h: '$297.4M', change24h: '-0.52%' },
//         { name: 'Official Trump', symbol: 'TRUMP/USD', currentPrice: '$12.48', volume24h: '$359.7M', change24h: '-3.34%' },
//         { name: 'DoubleZero', symbol: '2Z/USD', currentPrice: '$0.41', volume24h: '$195.9M', change24h: '-0.91%' },
//         { name: 'Seeker', symbol: 'SKR/USD', currentPrice: '$0.67', volume24h: '$49.9M', change24h: '-2.18%' },
//         { name: 'Bitcoin', symbol: 'BTC/USD', currentPrice: '$63,967.60', volume24h: '$2.0B', change24h: '-0.67%' },
//         { name: 'Ethereum', symbol: 'ETH/USD', currentPrice: '$3,410.20', volume24h: '$1.2B', change24h: '+1.45%' },
//         { name: 'Solana', symbol: 'SOL/USD', currentPrice: '$188.50', volume24h: '$890M', change24h: '+5.20%' },
// ]



export const SpotPage = () => {

        const {getStockMarketMatrix,isFetching,stockMarketMatrix} = useExchangeStore()
        const navigate = useNavigate()

        const onSelectStock = (symbol: string) => {

                navigate(`/trade/${symbol}`)
        
        }
        const stockColumns: ColumnDef<StockItem>[] = [
                {
                        header: 'Name / Symbol',
                        cell: ({ row }) => (
                                <div>
                                        <div className="font-bold text-white">{row.original.name}</div>
                                        <div className="text-xs text-[#a09ca3]">{row.original.symbol+"/USD"}</div>
                                </div>
                        ),
                },
                { header: 'Price (USD)', accessorKey: 'currentPrice' },
                { header: '24h Volume (USD)', accessorKey: 'volume24h' },
                {
                        header: '24h Change',
                        cell: ({ row }) => (
                                <span className={row.original.change24h>0? 'text-[#3dbe7e]' : 'text-[#e55555]'}>
                                        {row.original.change24h}
                                </span>
                        ),
                },
                {
                        header: 'Last 7 days',
                        cell: ({ row }) => (
                                <div
                                        className="px-3 py-1 text-xs "
                                >
                                        ----------------------
                                </div>
                        ),
                },
        ]
        useEffect(()=>{
                if(stockMarketMatrix.length === 0) {
                        getStockMarketMatrix()
                }
              
                return ()=>{
                        // cleanup if needed
                }
        },[])

        return (
                <div className="space-y-4">
                        <h2 className="text-2xl text-[#e8829c]">Spot Markets</h2>
                        <PaginatedTable 
                        data={stockMarketMatrix} 
                        columns={stockColumns} 
                        rowSelectCall={(row) => onSelectStock(row)}
                        isLoading={isFetching}
                        />
                </div>
        );
};