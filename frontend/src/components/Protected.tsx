import { Navigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";

export function Protected({children}:{children:React.ReactNode}){

        const {isLoggedIn} = useAuthStore()

        if(!isLoggedIn){
                return <Navigate to="/login" replace />
        }

        return children

}