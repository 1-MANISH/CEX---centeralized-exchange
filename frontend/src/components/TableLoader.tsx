import React from 'react';

interface TableLoaderProps {
        message?: string;
}

export const TableLoader: React.FC<TableLoaderProps> = ({
        message = "Fetching market data..."
}) => {
        return (
                <div className="w-full py-12 flex flex-col items-center justify-center space-y-4 font-mono select-none">
                        {/* Hand-Drawn Retro Monitor Container */}
                        <div className="relative flex flex-col items-center">
                                {/* Monitor Screen */}
                                <div className="w-28 h-20 chalk-card border-2 border-[#824b57] bg-[#121015] p-2 flex flex-col justify-end overflow-hidden relative shadow-lg">
                                        {/* Top Status Bar Dot */}
                                        <div className="absolute top-1 right-2 flex gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#e8829c] animate-ping" />
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#3dbe7e]" />
                                        </div>

                                        {/* Animated Candlesticks / Trading Bars */}
                                        <div className="flex items-end justify-between gap-1 w-full h-12 pt-2">
                                                <div className="w-2.5 bg-[#3dbe7e] rounded-t animate-[bounce_1s_infinite_100ms] h-[40%]" />
                                                <div className="w-2.5 bg-[#e55555] rounded-t animate-[bounce_1s_infinite_300ms] h-[75%]" />
                                                <div className="w-2.5 bg-[#3dbe7e] rounded-t animate-[bounce_1s_infinite_200ms] h-[50%]" />
                                                <div className="w-2.5 bg-[#e8829c] rounded-t animate-[bounce_1s_infinite_400ms] h-[90%]" />
                                                <div className="w-2.5 bg-[#3dbe7e] rounded-t animate-[bounce_1s_infinite_150ms] h-[60%]" />
                                        </div>

                                        {/* Grid lines overlay */}
                                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#824b5715_1px,transparent_1px),linear-gradient(to_bottom,#824b5715_1px,transparent_1px)] bg-[size:8px_8px] pointer-events-none" />
                                </div>

                                {/* Monitor Stand */}
                                <div className="w-6 h-3 bg-[#161419] border-x-2 border-[#824b57]" />
                                {/* Monitor Base */}
                                <div className="w-16 h-1.5 bg-[#161419] border-2 border-[#824b57] rounded-full" />
                        </div>

                        {/* Handwritten / Monospace Animated Text */}
                        <div className="flex items-center gap-1 text-sm text-[#e8829c] tracking-wide">
                                <span>{message}</span>
                                <span className="animate-pulse">_</span>
                        </div>
                </div>
        );
};