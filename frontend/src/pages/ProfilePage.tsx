import React, { useState } from 'react';
import { UserMarketHistoryPanel } from '../components/UserMarketHistoryPanel';

export const ProfilePage: React.FC = () => {
        const [asset, setAsset] = useState('USD');
        const [amount, setAmount] = useState('');
        const [message, setMessage] = useState('');

        const handleDeposit = (e: React.FormEvent) => {
                e.preventDefault();
                if (!amount) return;
                setMessage(`Successfully deposited ${amount} ${asset} (Test Net)`);
                setAmount('');
        };

        return (
                <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Login / Profile Form */}
                                <div className="chalk-card p-6 space-y-4">
                                        <h2 className="text-xl text-[#e8829c]">Update Profile / Auth</h2>
                                        <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                                                <div>
                                                        <label className="text-xs text-[#a09ca3]">Username</label>
                                                        <input className="chalk-input w-full mt-1" defaultValue="testuser123" />
                                                </div>
                                                <div>
                                                        <label className="text-xs text-[#a09ca3]">Email</label>
                                                        <input className="chalk-input w-full mt-1" defaultValue="testuser@example.com" />
                                                </div>
                                                <div>
                                                        <label className="text-xs text-[#a09ca3]">Password</label>
                                                        <input className="chalk-input w-full mt-1" type="password" defaultValue="password123" />
                                                </div>
                                                <button type="submit" className="chalk-button w-full">Save Changes</button>
                                        </form>
                                </div>

                                {/* Deposit Test Money Form */}
                                <div className="chalk-card p-6 space-y-4">
                                        <h2 className="text-xl text-[#e8829c]">Deposit Test Funds</h2>
                                        {message && <div className="text-xs text-[#3dbe7e] border border-[#3dbe7e] p-2 rounded">{message}</div>}
                                        <form className="space-y-3 font-mono" onSubmit={handleDeposit}>
                                                <div>
                                                        <label className="text-xs text-[#a09ca3]">Select Asset</label>
                                                        <select
                                                                value={asset}
                                                                onChange={(e) => setAsset(e.target.value)}
                                                                className="chalk-input w-full mt-1 bg-[#121015]"
                                                        >
                                                                <option value="USD">USD</option>
                                                                <option value="ETH">ETH</option>
                                                                <option value="SOL">SOL</option>
                                                        </select>
                                                </div>
                                                <div>
                                                        <label className="text-xs text-[#a09ca3]">Amount</label>
                                                        <input
                                                                value={amount}
                                                                onChange={(e) => setAmount(e.target.value)}
                                                                className="chalk-input w-full mt-1"
                                                                placeholder="Enter test amount"
                                                                type="number"
                                                        />
                                                </div>
                                                <button type="submit" className="chalk-button w-full">Deposit Funds</button>
                                        </form>
                                </div>
                        </div>

                        <div>
                                 <UserMarketHistoryPanel />
                        </div>

                </div>
        );
};