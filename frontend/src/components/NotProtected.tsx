import { Navigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";

export function NotProtected({children}:{children:React.ReactNode}){

        const {isLoggedIn} = useAuthStore()

        if(isLoggedIn){
                return <Navigate to="/spot" replace />
        }

        return children

}