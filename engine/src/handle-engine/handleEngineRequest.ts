import type { Message } from "../utils/interfaces";
import { createOrder, depositFunds } from "./requestHandler";


export async function handleEngineRequest(message:Message){

        const {type,payload} = message
        console.log(type,payload)

        // if(type  === 'create_order' ){
        //        let  response = createOrder(payload)
        //        return response
        // }

        // if(type==="deposit_asset"){
        //         let response = depositFunds(payload)
        //         return response 
        // }

        const filledQuantity = 1
        const remainingQuantity = 2
        return {filledQuantity,remainingQuantity}


}