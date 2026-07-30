import React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { PaginatedTable } from '../components/PaginatedTable';

interface StockItem {
        name: string;
        symbol: string;
        price: string;
        volume: string;
        change: string;
}

const mockStocks: StockItem[] = [
        { name: 'Raydium', symbol: 'RAY/USD', price: '$1.84', volume: '$159.6M', change: '-2.31%' },
        { name: 'Shiba Inu', symbol: 'SHIB/USD', price: '$0.000024', volume: '$2.7B', change: '+4.18%' },
        { name: 'io.net', symbol: 'IO/USD', price: '$3.21', volume: '$47.5M', change: '-1.07%' },
        { name: 'Lido', symbol: 'LDO/USD', price: '$2.31', volume: '$297.4M', change: '-0.52%' },
        { name: 'Official Trump', symbol: 'TRUMP/USD', price: '$12.48', volume: '$359.7M', change: '-3.34%' },
        { name: 'DoubleZero', symbol: '2Z/USD', price: '$0.41', volume: '$195.9M', change: '-0.91%' },
        { name: 'Seeker', symbol: 'SKR/USD', price: '$0.67', volume: '$49.9M', change: '-2.18%' },
        { name: 'Bitcoin', symbol: 'BTC/USD', price: '$63,967.60', volume: '$2.0B', change: '-0.67%' },
        { name: 'Ethereum', symbol: 'ETH/USD', price: '$3,410.20', volume: '$1.2B', change: '+1.45%' },
        { name: 'Solana', symbol: 'SOL/USD', price: '$188.50', volume: '$890M', change: '+5.20%' },
];

interface SpotPageProps {
        onSelectStock: (symbol: string) => void;
}

export const SpotPage: React.FC<SpotPageProps> = ({ onSelectStock }) => {
        const stockColumns: ColumnDef<StockItem>[] = [
                {
                        header: 'Name / Symbol',
                        cell: ({ row }) => (
                                <div>
                                        <div className="font-bold text-white">{row.original.name}</div>
                                        <div className="text-xs text-[#a09ca3]">{row.original.symbol}</div>
                                </div>
                        ),
                },
                { header: 'Price (USD)', accessorKey: 'price' },
                { header: '24h Volume (USD)', accessorKey: 'volume' },
                {
                        header: '24h Change',
                        cell: ({ row }) => (
                                <span className={row.original.change.startsWith('+') ? 'text-[#3dbe7e]' : 'text-[#e55555]'}>
                                        {row.original.change}
                                </span>
                        ),
                },
                {
                        header: 'Action',
                        cell: ({ row }) => (
                                <button
                                        onClick={() => onSelectStock(row.original.symbol)}
                                        className="px-3 py-1 text-xs chalk-button"
                                >
                                        Trade
                                </button>
                        ),
                },
        ];

        return (
                <div className="space-y-4">
                        <h2 className="text-2xl text-[#e8829c]">Spot Markets</h2>
                        <PaginatedTable data={mockStocks} columns={stockColumns} />
                </div>
        );
};