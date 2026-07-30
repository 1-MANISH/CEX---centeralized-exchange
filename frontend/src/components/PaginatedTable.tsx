import React, { useState } from 'react';
import {
        useReactTable,
        getCoreRowModel,
        getPaginationRowModel,
        flexRender,
        type ColumnDef,
} from '@tanstack/react-table';

interface PaginatedTableProps<T> {
        data: T[];
        columns: ColumnDef<T, any>[];
}

export function PaginatedTable<T>({ data, columns }: PaginatedTableProps<T>) {
        const [pagination, setPagination] = useState({
                pageIndex: 0,
                pageSize: 8, // Strictly 8 rows per page
        });

        const table = useReactTable({
                data,
                columns,
                state: { pagination },
                onPaginationChange: setPagination,
                getCoreRowModel: getCoreRowModel(),
                getPaginationRowModel: getPaginationRowModel(),
        });

        return (
                <div className="chalk-card p-4 overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                                <thead>
                                        {table.getHeaderGroups().map((headerGroup) => (
                                                <tr key={headerGroup.id} className="border-b-2 border-[#824b57] text-[#e8829c]">
                                                        {headerGroup.headers.map((header) => (
                                                                <th key={header.id} className="pb-3 px-3 font-semibold">
                                                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                                                </th>
                                                        ))}
                                                </tr>
                                        ))}
                                </thead>
                                <tbody>
                                        {table.getRowModel().rows.map((row) => (
                                                <tr
                                                        key={row.id}
                                                        className="border-b border-[#824b57]/40 hover:bg-[#9e4359]/20 transition-colors"
                                                >
                                                        {row.getVisibleCells().map((cell) => (
                                                                <td key={cell.id} className="py-3 px-3 font-mono">
                                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                                </td>
                                                        ))}
                                                </tr>
                                        ))}
                                </tbody>
                        </table>

                        {/* Pagination Controls */}
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#824b57] text-xs font-mono">
                                <div>
                                        Page <span className="text-[#e8829c]">{table.getState().pagination.pageIndex + 1}</span> of{' '}
                                        {table.getPageCount()}
                                </div>
                                <div className="flex gap-2">
                                        <button
                                                onClick={() => table.previousPage()}
                                                disabled={!table.getCanPreviousPage()}
                                                className="px-3 py-1 border border-[#824b57] rounded disabled:opacity-30 hover:bg-[#9e4359]"
                                        >
                                                Previous
                                        </button>
                                        <button
                                                onClick={() => table.nextPage()}
                                                disabled={!table.getCanNextPage()}
                                                className="px-3 py-1 border border-[#824b57] rounded disabled:opacity-30 hover:bg-[#9e4359]"
                                        >
                                                Next
                                        </button>
                                </div>
                        </div>
                </div>
        );
}