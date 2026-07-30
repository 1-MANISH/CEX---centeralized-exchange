import React, { useState } from 'react';
import { AgCharts } from 'ag-charts-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-charts-community';
import type { AgChartOptions } from 'ag-charts-community';

ModuleRegistry.registerModules([AllCommunityModule]);

export const StockChart: React.FC = () => {
        const [chartOptions] = useState<AgChartOptions>({
                theme: 'ag-default-dark',
                background: { fill: '#161419' },
                data: [
                        { date: '15 Jul', price: 63120 },
                        { date: '16 Jul', price: 63540 },
                        { date: '17 Jul', price: 62800 },
                        { date: '18 Jul', price: 64100 },
                        { date: '19 Jul', price: 63960 },
                        { date: '20 Jul', price: 64400 },
                        { date: '21 Jul', price: 63963 },
                ],
                series: [
                        {
                                type: 'line',
                                xKey: 'date',
                                yKey: 'price',
                                yName: 'Price (USD)',
                                stroke: '#3dbe7e',
                                strokeWidth: 3,
                                marker: { fill: '#3dbe7e', size: 6 },
                        },
                ],
                axes: [
                        { type: 'category', position: 'bottom', label: { color: '#a09ca3' } },
                        { type: 'number', position: 'left', label: { color: '#a09ca3' } },
                ],
        });

        return (
                <div className="chalk-card p-2 h-[380px] w-full">
                        <AgCharts options={chartOptions} />
                </div>
        );
};