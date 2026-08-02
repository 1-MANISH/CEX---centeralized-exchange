import {create} from "zustand"
import {axiosInstance} from "../lib/axios"
import toast from 'react-hot-toast'


export const useAuthStore = create((set,get)=>({
        authUser:null,
        isCheckingAuth:true,
        isSigningUp:false,
        isLoginIn:false,
        isLoggedIn:false,
        isDepositing:false,

        checkAuth:async()=>{
                try {
                        const response = await axiosInstance.get("/auth/check")
                        console.log("YHAA CHECK AUTH ME AAYA",response.data.data)
                        set({authUser:response.data.data,isLoggedIn:true})
                        
                        // socket connection
                } catch (error) {
                        set({authUser:null,isLoggedIn:false})
                }finally{
                        set({isCheckingAuth:false})
                }
        },
        signup:async(data:{username:string,password:string})=>{
                try {
                        set({isSigningUp:true})
                        const response = await axiosInstance.post("/auth/signup",data)
                        set({authUser:response.data.data,isLoggedIn:true})
                        toast.success("Account created successful")
                        // socket connection
                } catch (error:any) {
                        set({authUser:null,isLoggedIn:false})
                        toast.error(error?.response?.data?.message ?? "Failed to signup")
                }finally{
                        set({isSigningUp:false})
                }
        },
        login:async(data:{username:string,password:string})=>{
                try {
                        set({isLoginIn:true})
                 
                        const response = await axiosInstance.post("/auth/login",data)
                        set({authUser:response.data.data,isLoggedIn:true})
                        toast.success("Login successful")

                        // socket connection
                } catch (error:any) {
                        set({authUser:null,isLoggedIn:false})
                        console.log("YHAA LOGIN ME ERROR"+error)
                        toast.error(error.response.data.message ?? "Failed to login")
                }finally{
                        set({isLoginIn:false})
                }
        },
         logout:async()=>{
                try {
                        await axiosInstance.post('/auth/logout')
                        set({authUser:null,isLoggedIn:false})
                        toast.success('Logged out successfully');
                        // socket disconnection
                } catch (error:any) {
                        console.log(`Error logging out: ${error}`)
                        toast.error(`Failed to logout : ${error.response.data.message}`);
                }finally{
                        set({isCheckingAuth:false})
                }
        },
        depositFunds:async(data:{symbol:string,quantity:number})=>{
                set({isDepositing:true})
                try {
                        const response = await axiosInstance.post('/exchange/deposit',data)
                        set({authUser:{...get().authUser,balance:response.data.data.balance}})
                        toast.success('Funds deposited successfully');
                        // socket disconnection
                } catch (error:any) {
                        console.log(`Error logging out: ${error}`)
                        toast.error(`Failed to logout : ${error.response.data.message}`);
                }finally{
                          set({isDepositing:false})
                }
        }

}))