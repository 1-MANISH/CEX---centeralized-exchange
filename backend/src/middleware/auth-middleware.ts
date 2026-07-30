import type { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken"
import { ENV } from "../utils/env.ts";
import { prismaClient } from "../db.ts";

declare global {
        namespace Express {
                interface Request {
                        userId?: number;
                }
        }
}

export interface TokenPayload {
        userId:number
}

export async function requiredAuth(req:Request,res:Response,next:NextFunction):void{

        try {
                const token = req.cookies[ENV.TOKEN_NAME as string]

                if(!token){
                         res.status(401).json({error:"unauthorized"})
                         return
                }

                const payload = jwt.verify(token,ENV.JWT_SECRET as string) as TokenPayload

                const user  = await prismaClient.user.findUnique({where:{id:payload.userId}})

                if(!user){
                        res.status(401).json({message:'Unauthorized access. User not found.'})
                        return
                }

                req.userId = user.id

                next()

        } catch (error) {
                res.status(401).json({error:"Invalid auth token"})
        }

}