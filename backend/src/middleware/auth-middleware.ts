import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"
import { ENV } from "../utils/env.ts";
import { prismaClient } from "../db.ts";
import type { TokenPayload } from "../utils/interfaces.ts";
import { sendError } from "../utils/response.ts";
import { MESSAGES, STATUS_CODE } from "../utils/constant.ts";

declare global {
        namespace Express {
                interface Request {
                        userId?: string;
                }
        }
}



export async function requiredAuth(req: Request, res: Response, next: NextFunction): Promise<void> {

        try {
                const token = req.cookies[ENV.TOKEN_NAME]// from cookies - frontend

                if (!token) {
                        sendError(res, STATUS_CODE.UNAUTHORIZED as number, MESSAGES.TOKEN_MISSING as string)
                        return
                }

                const payload = jwt.verify(token, ENV.JWT_SECRET) as TokenPayload

                const { userId } = payload
                const user = await prismaClient.user.findUnique({ where: { id: userId } })

                if (!user) {
                        sendError(res, STATUS_CODE.UNAUTHORIZED as number, MESSAGES.TOKEN_INVALID as string)
                        return
                }

                req.userId = user.id
                next()

        } catch (error) {
                sendError(res, STATUS_CODE.SERVER_ERROR as number, error?.message  ?? error as string)
        }

}