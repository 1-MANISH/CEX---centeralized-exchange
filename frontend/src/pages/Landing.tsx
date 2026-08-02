
import { ShieldCheck, FlaskConical, Zap, TrendingUp, PieChart, Users } from 'lucide-react';
import { useNavigate } from 'react-router';

export const LandingPage= () => {

        const navigate = useNavigate()
        return (
                <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                                <div className="space-y-4">
                                        <h1 className="text-5xl font-bold leading-tight ">
                                                Modern <span className="text-[#e8829c]">Test Finance</span>
                                        </h1>
                                        <p className="text-[#a09ca3] text-lg">
                                                Your brokerage, your exchange, your money — in the same place. Trade, borrow, spend and earn with everything working together.
                                        </p>
                                        <div className="flex gap-2 max-w-md">
                                                <input placeholder="Enter your email" className="chalk-input flex-1" />
                                                <button onClick={() => navigate('/signup')} className="chalk-button">signup</button>
                                        </div>
                                        <div className="chalk-card p-6 text-center space-y-4 mt-10">
                                        <h2 className="text-xl text-[#e8829c]">Simulated Environment</h2>
                                        <div className="grid grid-cols-3 gap-4 pt-2">
                                                <div className="border border-[#824b57] p-3 rounded text-center">
                                                        <ShieldCheck className="mx-auto text-[#3dbe7e] mb-1" />
                                                        <span className="text-xs">Test Environment</span>
                                                </div>
                                                <div className="border border-[#824b57] p-3 rounded text-center">
                                                        <FlaskConical className="mx-auto text-[#e8829c] mb-1" />
                                                        <span className="text-xs">No Real Money</span>
                                                </div>
                                                <div className="border border-[#824b57] p-3 rounded text-center">
                                                        <Zap className="mx-auto text-[#3dbe7e] mb-1" />
                                                        <span className="text-xs">Fast & Reliable</span>
                                                </div>
                                        </div>
                                </div>
                                </div>

                                <div className=" p-6 text-center space-y-4">
                                       <img src="/images/pc.png" alt="Landing Page" />
                                </div>
                        </div>

                         

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
                                <div className="chalk-card p-4 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/spot')}>
                                        <TrendingUp className="text-[#3dbe7e]" />
                                        <div>
                                                <div className="font-bold">Live Market Data</div>
                                                <div className="text-xs text-[#a09ca3]">Real-time prices from top exchanges</div>
                                        </div>
                                </div>
                                <div className="chalk-card p-4 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/trade')}>
                                        <PieChart className="text-[#e8829c]" />
                                        <div>
                                                <div className="font-bold">Advanced Charts</div>
                                                <div className="text-xs text-[#a09ca3]">Track and analyze strategies</div>
                                        </div>
                                </div>
                                <div className="chalk-card p-4 flex items-center gap-3">
                                        <Users className="text-[#3dbe7e]" />
                                        <div>
                                                <div className="font-bold">Built for Developers</div>
                                                <div className="text-xs text-[#a09ca3]">Clean UI for sandbox trading</div>
                                        </div>
                                </div>
                        </div>
                </div>
        );
};