import jwt, { type SignOptions } from "jsonwebtoken"
import {ENV} from "./env.ts"

export interface TokenPayload {
        userId:number;
}

export function createToken(payload:TokenPayload):string {
        return jwt.sign(
                payload,
                ENV.JWT_SECRET as string,
               {expiresIn: ENV.ACCESS_TOKEN_EXPIRY as any}
        )
}