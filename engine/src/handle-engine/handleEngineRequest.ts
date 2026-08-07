import { BALANCES, ORDERBOOK } from "..";
import type { Message } from "../utils/interfaces";
import { cancelOrder, createOrder, depositFunds, getDepth, getUserBalance, initiatedUserBalance, makeNewStockEntry } from "./requestHandler";


export async function handleEngineRequest(message:Message){

        const {type,payload} = message
        console.log(`Handling backend request ${type}`)
        
        if(type==="initiated_user_balance")return initiatedUserBalance(payload)

        if(type==="get_user_balance")return getUserBalance(payload)

        if(type==="deposit_asset")return depositFunds(payload)

        if(type==="get_depth")return getDepth(payload)
 
        if(type  === 'create_order' )return createOrder(payload)
        
        if(type==="cancel_order")return cancelOrder(payload)
        
        if(type==="make_new_stock_entry")return  makeNewStockEntry(payload)
        

}