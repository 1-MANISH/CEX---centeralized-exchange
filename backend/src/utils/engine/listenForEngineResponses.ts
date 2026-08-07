import { pendingResponses } from "../../store/pending-response";
import { subscriber } from "../engine-client";
import { ENV } from "../env";


// connect before we starting our express server 
export async function listenForEngineResponses(){
        // listen to all events from engine -  make
        //  entry in pending response store
        console.log(`[Engine] Listening for engine responses...`)

        const response = await subscriber.brPop(ENV.RESPONSE_QUEUE,2) as any // blocking for 1 sec then response null

        if(response) {
                const{key,element} = response
                const message = JSON.parse(element)
                const {correlationId,ok,data} = message
                console.log(`[Engine] Received response for ${correlationId}`)
                if(correlationId &&  pendingResponses.has(correlationId)){
                        pendingResponses.get(correlationId)(data)
                        pendingResponses.delete(correlationId)
                }
        }
             
        listenForEngineResponses()
        
}