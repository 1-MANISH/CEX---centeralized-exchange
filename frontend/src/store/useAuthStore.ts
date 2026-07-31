import {create} from "zustand"
import {axiosInstance} from "../lib/axios"
import toast from 'react-hot-toast'


export const useAuthStore = create((set,get)=>({
        authUser:null,
        isCheckingAuth:true,
        isSigningUp:false,
        isLoginIn:false,

        checkAuth:async()=>{
                try {
                        const response = await axiosInstance.get("/auth/check")
                        set({authUser:response.data})
                        
                        // socket connection
                } catch (error) {
                        set({authUser:null})
                }finally{
                        set({isCheckingAuth:false})
                }
        },
        signup:async(data:{username:string,password:string})=>{
                try {
                        set({isSigningUp:true})
                        const response = await axiosInstance.post("/auth/signup",data)
                        set({authUser:response.data})
                        toast.success("Account created successful")
                        // socket connection
                } catch (error:any) {
                        set({authUser:null})
                        toast.error(error?.response?.data?.message ?? "Failed to signup")
                }finally{
                        set({isSigningUp:false})
                }
        },
        login:async(data:{username:string,password:string})=>{
                try {
                        set({isLoginIn:true})
                        console.log("YHAA AA GYE"+data.username)
                        const response = await axiosInstance.post("/auth/login",data)
                        set({authUser:response.data})
                        toast.success("Login successful")

                        // socket connection
                } catch (error:any) {
                        set({authUser:null})
                        console.log("YHAA LOGIN ME ERROR"+error)
                        toast.error(error.response.data.message ?? "Failed to login")
                }finally{
                        set({isLoginIn:false})
                }
        },
         logout:async()=>{
                try {
                        await axiosInstance.post('/auth/logout')
                        set({authUser:null})
                        toast.success('Logged out successfully');
                        // socket disconnection
                } catch (error:any) {
                        console.log(`Error logging out: ${error}`)
                        toast.error(`Failed to logout : ${error.response.data.message}`);
                }finally{
                        set({isCheckingAuth:false})
                }
        },

}))