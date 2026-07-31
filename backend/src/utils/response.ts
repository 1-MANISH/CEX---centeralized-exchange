import type { Response } from "express";

export function sendSuccess(res:Response,status:number,data={},message:string){
        return res.status(status).json({
                success:true,
                message,
                data
        })
}

export function sendError(res:Response,status:number,message:string,error?:any){
        return res.status(status).json({
                success:true,
                message,
                error
        })
}