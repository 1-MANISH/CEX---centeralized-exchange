import jwt from "jsonwebtoken"
import {ENV} from "./env.ts"
import type { Response } from "express";
import type { TokenPayload } from "./interfaces.ts";



export function createToken(payload:TokenPayload,res:Response):string {

        const NODE_ENV = ENV.NODE_ENV
        const TOKEN_NAME=ENV.TOKEN_NAME
        const ACCESS_TOKEN_EXPIRY=ENV.ACCESS_TOKEN_EXPIRY
        const JWT_SECRET=ENV.JWT_SECRET

        const token =  jwt.sign(payload,JWT_SECRET,{expiresIn: ACCESS_TOKEN_EXPIRY })

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