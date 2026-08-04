import React from 'react';

export interface StepItem {
        number: number;
        title: string;
        description: string;
        badge?: string;
        details?: string[];
}

export const StepsToRun: React.FC = () => {
        const steps: StepItem[] = [
                {
                        number: 1,
                        title: 'Sign Up / Log In',
                        description: 'Create your test account using email or continuous guest session.',
                        badge: 'Account Required',
                        details: [
                                'Instant registration without KYC verification',
                                'Secure wallet identity assigned for paper trading',
                        ],
                },
                {
                        number: 2,
                        title: 'Deposit Mock USD',
                        description: 'Fund your exchange account with free test USD to simulate trading balance.',
                        badge: '$10 - $10,000 USD Limit',
                        details: [
                                'Minimum deposit: $10 USD',
                                'Maximum deposit: $10,000 USD per request',
                                'Unlimited mock refills available anytime',
                        ],
                },
                {
                        number: 3,
                        title: 'Explore Markets & Trade',
                        description: 'Place simulated Limit or Market orders on real-time orderbooks.',
                        badge: 'Orderbook Matching',
                        details: [
                                'Real-time bid/ask order matching engine',
                                'Track open orders, filled history, and position updates',
                        ],
                },
                {
                        number: 4,
                        title: 'Available Trading Markets',
                        description: 'Trade major crypto pairs supported on this exchange.',
                        badge: 'Active Markets',
                        details: ['BTC / USD', 'ETH / USD', 'SOL / USD'],
                },
        ];

        return (
                <div className="w-full space-y-6 font-mono">
                        {/* Title Header */}
                        <div className="text-center space-y-2">
                                <h2 className="text-2xl font-bold text-white tracking-wide">
                                        How To Get Started
                                </h2>
                                <p className="text-xs text-[#A09CA3] max-w-lg mx-auto">
                                        Follow these simple steps to simulate realistic Centralized Exchange (CEX) trading without real financial risk.
                                </p>
                        </div>

                        {/* Steps Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                {steps.map((step) => (
                                        <div
                                                key={step.number}
                                                className="chalk-card p-5 bg-[#0D0C0E] border-2 border-[#824b57] text-[#FFFFFF] rounded-lg space-y-3 flex flex-col justify-between hover:border-[#E8829C] transition-colors"
                                        >
                                                <div>
                                                        {/* Step Header */}
                                                        <div className="flex items-center justify-between pb-2 border-b border-[#824b57]/40">
                                                                <div className="flex items-center gap-3">
                                                                        <div className="w-8 h-8 rounded-full bg-[#161419] border border-[#E8829C] flex items-center justify-center font-bold text-sm text-[#E8829C]">
                                                                                0{step.number}
                                                                        </div>
                                                                        <h3 className="font-bold text-sm text-white">{step.title}</h3>
                                                                </div>
                                                                {step.badge && (
                                                                        <span className="text-[10px] font-semibold px-2 py-0.5 bg-[#161419] border border-[#3DBE7E]/50 text-[#3DBE7E] rounded-full">
                                                                                {step.badge}
                                                                        </span>
                                                                )}
                                                        </div>

                                                        {/* Description */}
                                                        <p className="text-xs text-[#A09CA3] mt-3">{step.description}</p>

                                                        {/* Bullet Details */}
                                                        {step.details && (
                                                                <ul className="mt-3 space-y-1.5 text-xs text-gray-300">
                                                                        {step.details.map((detail, idx) => (
                                                                                <li key={idx} className="flex items-center gap-2">
                                                                                        <span className="w-1.5 h-1.5 rounded-full bg-[#E8829C]" />
                                                                                        <span>{detail}</span>
                                                                                </li>
                                                                        ))}
                                                                </ul>
                                                        )}
                                                </div>
                                        </div>
                                ))}
                        </div>
                </div>
        );
};