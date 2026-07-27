import type { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken"
import { ENV } from "../utils/env.ts";

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

export function requiredAuth(req:Request,res:Response,next:NextFunction):void{

        try {
                const authHeader = req.headers.authorization

                const token = typeof authHeader ==="string" && authHeader.startsWith('Bearer ')?authHeader.slice(7):undefined

                if(!token){
                         res.status(401).json({error:"unauthorized"})
                         return
                }

                const payload = jwt.verify(token,ENV.JWT_SECRET as string) as TokenPayload

                req.userId = payload.userId

                next()

        } catch (error) {
                res.status(401).json({error:"Invalid auth token"})
        }

}