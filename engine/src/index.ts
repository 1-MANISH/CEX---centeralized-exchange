import { handleEngineRequest } from "./handle-engine/handleEngineRequest"
import { connectRedis, consumerClient, responserClient } from "./utils/engine-client"
import { ENV } from "./utils/env"
import type { Balance, Order } from "./utils/interfaces"

// in-memory state
//balances = {userId:{USD:{available:0,locked:0},SOL:{available:0,locked:0}}}
export const BALANCES : Record<string,Record<string,Balance>> = {}

/*
bids:[] // highest price first
asks:[] // lowest price first
orderbook = {ETH:{bids:[] ,asks:[] ,lastTradePrice:0}}
*/
export const ORDERBOOK:Record<string,{bids:Order[],asks:Order[],lastTradePrice:number}> = {}


async function main(){

        console.log(`[Engine] Starting...`)
        await connectRedis()

        // take the latest snapshot

        while(true){
                // let pick event from queue
                const response = await consumerClient.brPop(ENV.IN_COMING_QUEUE,1) as any // blocking for 1 sec then response null

                if(!response) continue

                const{key,element} = response
                const message = JSON.parse(element)
               const {correlationId,responseQueue,type,payload} = message

                const data = await handleEngineRequest({type,payload})

                // send response via- responserQueue
                // await sendResponse(responseQueue,correlationId,ok:true,data)
                await responserClient.lPush(responseQueue,JSON.stringify({correlationId,ok:true,data}))
                
        }
}
main()