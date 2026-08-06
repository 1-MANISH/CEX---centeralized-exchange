import { pendingResponses } from "../../store/pending-response";
import { subscriber } from "../engine-client";
import { ENV } from "../env";



// connect before we starting our express server 
export async function listenForEngineResponses(){
        // listen to all events from engine -  make
        //  entry in pending response store
        console.log(`[Engine] Listening for engine responses...`)

        console.log(pendingResponses)
        const response = await subscriber.brPop(ENV.RESPONSE_QUEUE,1) as any // blocking for 1 sec then response null

        if(response) {
                const{key,element} = response
                const message = JSON.parse(element)
                const {correlationId,ok,data} = message
                if(correlationId && pendingResponses.has(correlationId)){
                        pendingResponses.get(correlationId)({ok,data})
                        pendingResponses.delete(correlationId)
                }
        }
             
        listenForEngineResponses()
        
}