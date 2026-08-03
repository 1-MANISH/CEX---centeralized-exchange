import React, { useState } from 'react';
import { UserMarketHistoryPanel } from '../components/UserMarketHistoryPanel';
import { useAuthStore } from '../store/useAuthStore';

export const ProfilePage: React.FC = () => {

        const {authUser} = useAuthStore()

        const {depositFunds,isDepositing} = useAuthStore()
        const [asset, setAsset] = useState('USD');
        const [amount, setAmount] = useState(0);


        const handleDeposit = async  (e: React.FormEvent) => {
                e.preventDefault();
                if (!amount || !asset) return;

                await depositFunds({ symbol:asset,quantity: amount })
                setAmount('');
        }

        return (
                <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              
                                <div className="chalk-card p-6 space-y-4">
                                        <h2 className="text-xl text-[#e8829c]">Update Profile / Auth</h2>
                                        <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                                                <div>
                                                        <label className="text-xs text-[#a09ca3]">Username</label>
                                                        <input className="chalk-input w-full mt-1" defaultValue={authUser?.username} disabled />
                                                </div>
                                                <div>
                                                        <label className="text-xs text-[#a09ca3]">Email</label>
                                                        <input className="chalk-input w-full mt-1" defaultValue={`${authUser?.username}@test.com`} disabled />
                                                </div>

                                                <button type="submit" className="chalk-button-disabled  w-full" disabled>Save Changes</button>
                                        </form>
                                </div>

                                {/* Deposit Test Money Form */}
                                <div className="chalk-card p-6 space-y-4">
                                        <h2 className="text-xl text-[#e8829c]">Deposit Test Funds</h2>
                                       
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
                                                                 {/* <option value="SOL">SOL</option> 
                                                                <option value="BTC">BTC</option> */}
                                                        </select>
                                                </div>
                                                <div>
                                                        <label className="text-xs text-[#a09ca3]">Amount</label>
                                                        <input
                                                                value={amount}
                                                                onChange={(e) => setAmount(Number(e.target.value))}
                                                                className="chalk-input w-full mt-1"
                                                                placeholder="Enter test amount"
                                                                type="number"
                                                        />
                                                </div>
                                                <button type="submit" className="chalk-button w-full" disabled={isDepositing}>
                                                        {isDepositing ? 'Depositing...' : 'Deposit Funds'}
                                                </button>
                                        </form>
                                </div>
                        </div>

                        <div>
                                 <UserMarketHistoryPanel currentMarketButtonEnable={false}/>
                        </div>

                </div>
        );
};