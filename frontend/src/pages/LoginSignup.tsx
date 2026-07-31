import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../store/useAuthStore';


export const LoginSignup = () => {

        const [username, setUsername] = useState('')
        const [password, setPassword] = useState('')

        const navigate = useNavigate()
        const path = window.location.pathname

        const {login,signup,isSignIn}  =useAuthStore()

        const handleSubmit =async (e: React.FormEvent) => {
              try {
                      e.preventDefault()
                      if(path === '/signup') await signup({username,password})
                     else  await login({username,password})
              } catch (error) {
                        console.log(`Error logging in: ${error}`)
              }
        };

        return (
                <div className="w-full min-h-[calc(100vh-120px)] flex items-center justify-center p-4">
                        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

        
                                <div className="flex flex-col justify-center space-y-6 max-w-md mx-auto w-full">
                                        <form onSubmit={handleSubmit} className="space-y-5">
                                                <div>
                                                        <input
                                                                type="text"
                                                                placeholder="username"
                                                                value={username}
                                                                onChange={(e) => setUsername(e.target.value)}
                                                                className="w-full text-center text-lg chalk-input py-3 focus:outline-none"
                                                                required
                                                        />
                                                </div>

                                                <div>
                                                        <input
                                                                type="password"
                                                                placeholder="password"
                                                                value={password}
                                                                onChange={(e) => setPassword(e.target.value)}
                                                                className="w-full text-center text-lg chalk-input py-3 focus:outline-none"
                                                                required
                                                        />
                                                </div>

                                                <button
                                                        type="submit"
                                                        className="w-full py-3 text-lg font-bold chalk-button capitalize transition-all"
                                                        disabled={!username || !password || isSignIn}
                                                >
                                                       {path === '/signup' ? 'signup' : 'login'}
                                                </button>
                                        </form>

        
                                        <div className="text-center font-mono text-sm text-[#A09CA3] pt-2">
                                                {path === '/signup' ? (
                                                        <p>
                                                                Already have an account ?{' '}
                                                                <button
                                                                        type="button"
                                                                        onClick={() => navigate('/login')}
                                                                        className="text-white underline hover:text-[#E8829c] transition-colors font-bold ml-1"
                                                                >
                                                                        login
                                                                </button>
                                                        </p>
                                                ) : (
                                                        <p>
                                                                Don't have an account ?{' '}
                                                                <button
                                                                        type="button"
                                                                        onClick={() => navigate('/signup')}
                                                                        className="text-white underline hover:text-[#E8829c] transition-colors font-bold ml-1"
                                                                >
                                                                        signup
                                                                </button>
                                                        </p>
                                                )}
                                        </div>
                                </div>

                              
                                <div className="flex justify-center items-center w-full ">
                                                <img
                                                        src="/images/pc.png"
                                                        alt="Trading Monitor"
                                                        className="w-full h-full object-contain " 
                                                />
                                </div>

                        </div>
                </div>
        );
};