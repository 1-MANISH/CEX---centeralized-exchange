//  {correlationId -> Promise<any>= PendingResponse}

type PendingResponse = (data:any) => void

export const pendingResponses = new Map<string,PendingResponse>()

export function waitForEngineResponse(correlationId:string,timeoutMS:number){
        return new Promise((resolve,reject)=>{
                pendingResponses.set(correlationId,resolve)
        })
}