/*
function asyncHandler(fn){

        return async function(req,res,next){
                try{
                        await fn(req,res)
                }catch(error){
                        next(error)
                }
        }
}

*/

import type { NextFunction, Request, Response } from "express";

export function asyncHandler(
        handler:(
                req:Request,
                res:Response,
                next:NextFunction
        ) => Promise<void>

) {
        return async function (req:Request,res:Response,next:NextFunction){
                try{
                        await handler(req,res,next)
                }catch(error){
                        next(error)
                }
        }
}