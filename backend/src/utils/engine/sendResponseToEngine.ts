import { publisher } from "../engine-client";
import { ENV } from "../env";

export async function sendResponseToEngine(correlationId:string,responseQueue:string,type:string,payload:any){

        console.log(`Sending response for ${correlationId} for ${type} to ${responseQueue}`)
        await publisher.lPush(ENV.IN_COMING_QUEUE,JSON.stringify({correlationId,responseQueue,type,payload}))
}