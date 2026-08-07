//  {correlationId -> Promise<any>= PendingResponse}

type PendingResponse = (data:any) => void

export const pendingResponses = new Map<string,PendingResponse>()

export function waitForEngineResponse(correlationId:string){

        console.log(`Waiting for engine response for ${correlationId}`)
        return new Promise((resolve,reject)=>{
                pendingResponses.set(correlationId,resolve)
        })
}