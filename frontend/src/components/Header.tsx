
import { LogOut, Monitor, User } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../store/useAuthStore';



export const Header = () => {

        const { isLoggedIn,logout,authUser } = useAuthStore()

        const navigate = useNavigate()
        return (
                <nav className="p-4 mb-6 flex justify-between items-center">
                        <div
                                className="flex items-center gap-3 cursor-pointer"
                                onClick={() => navigate('/')}
                        >
                                <Monitor className="text-[#e8829c]" />
                                <span className="text-2xl font-bold tracking-wide">Testexchange</span>
                        </div>

                        <div className="flex gap-6 text-lg">
                                <button
                                        onClick={() => navigate('/spot')}
                                        className={`hover:text-[#e8829c] ${window.location.pathname === 'spot' ? 'text-[#e8829c] underline' : ''}`}
                                >
                                        spot
                                </button>
                                <button
                                        onClick={() => navigate('/trade/BTC')}
                                        className={`hover:text-[#e8829c] ${window.location.pathname === 'trade' ? 'text-[#e8829c] underline' : ''}`}
                                >
                                        stocks
                                </button>

                                <button
                                        onClick={() => navigate('/docs')}
                                        className="hover:text-[#e8829c]"
                                >
                                        docs
                                </button>
                        </div>

                        <div className="flex items-center gap-3">
                                {
                                        isLoggedIn ? (
                                                  <div className="flex items-center gap-2">
                                                        <button onClick={() => navigate('/profile')} className="p-2 text-[#e8829c] hover:opacity-80 flex gap-2">
                                                                        <User />
                                                                        <span>{authUser?.username}</span>
                                                        </button>
                                                        <LogOut onClick={async ()=>{
                                                                await logout()
                                                                navigate('/')
                                                        }} />
                                                  </div>
                                        ) : (
                                                <>
                                                        <button onClick={() => navigate('/login')} className="chalk-button">
                                                                login
                                                        </button>
                                                        <button onClick={() => navigate('/signup')} className="chalk-button">
                                                                signup
                                                        </button>
                                                </>
                                        )
                                }


                        </div>
                </nav>
        );
};