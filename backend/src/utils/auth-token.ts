import jwt from "jsonwebtoken"
import {ENV} from "./env.ts"
import type { Response } from "express";

export interface TokenPayload {
        userId:number;
}

export function createToken(payload:TokenPayload,res:Response):string {

        const NODE_ENV = ENV.NODE_ENV
        const TOKEN_NAME=ENV.TOKEN_NAME
        const ACCESS_TOKEN_EXPIRY=ENV.ACCESS_TOKEN_EXPIRY

        const token =  jwt.sign(
                payload,
                ENV.JWT_SECRET as string,
               {expiresIn: ENV.ACCESS_TOKEN_EXPIRY as any}
        )

        res.cookie(
                TOKEN_NAME,
                token,
                {
                        maxAge:ACCESS_TOKEN_EXPIRY,
                        httpOnly:true,
                        sameSite:NODE_ENV==="development"?"lax":"strict",
                        secure:NODE_ENV==="development"?false:true,
                      
                }
        )

        return token

}