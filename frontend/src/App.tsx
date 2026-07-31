
import { Header } from './components/Header';
import { LandingPage } from './pages/Landing';
import { SpotPage } from './pages/SpotPage';
import { TradePage } from './pages/TradePage';
import { ProfilePage } from './pages/ProfilePage';
import {Routes,Route} from 'react-router'
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';
import PageLoader from './components/PageLoader';
import { LoginSignup } from './pages/LoginSignup';


function App() {

        const {checkAuth,isCheckingAuth,authUser} = useAuthStore()

         useEffect(()=>{
                checkAuth()
         },[checkAuth])

        if(isCheckingAuth){
                return <PageLoader />
        } 


        return (
                <div className="min-h-screen bg-[#0d0c0e] text-white p-4 max-w-7xl mx-auto">

                        <Header  />

                        <Routes>
                                <Route path="/" element={<LandingPage />} />
                                <Route path="/login" element={<LoginSignup />} />
                                <Route path="/signup" element={<LoginSignup />} />
                                <Route path="/spot" element={<SpotPage />} />
                                <Route path="/trade" element={<TradePage />} />
                                <Route path="/profile" element={<ProfilePage />} />
                        </Routes>

                        <Toaster />

                </div>
        )
}

export default App
