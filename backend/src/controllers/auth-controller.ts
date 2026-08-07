import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import { authSchema } from "../types/auth.schema.ts";
import {sendValidationError} from "../utils/validation.ts"
import { prismaClient } from "../db.ts";
import { createToken } from "../utils/auth-token.ts";
import { ENV } from "../utils/env.ts";
import { MESSAGES, STATUS_CODE } from "../utils/constant.ts";
import { sendError, sendSuccess } from "../utils/response.ts";
import { publisher } from "../utils/engine-client.ts";
import { waitForEngineResponse } from "../store/pending-response.ts";
import { sendResponseToEngine } from "../utils/engine/sendResponseToEngine.ts";

function getUserId(req:Request):string{
       if(!req.userId)  throw new Error(MESSAGES.NOT_AUTHORIZED as string)
       return req.userId 
}



async function signupHandler(
        req:Request,
        res:Response
):Promise<void> {

        const parsedBody = authSchema.safeParse(req.body)

        if(!parsedBody.success){
                sendValidationError(res,parsedBody.error)
                return
        }

        const {username,password} = parsedBody.data

        const hashedPassword = await bcrypt.hash(password,10)

        try {
                const user = await prismaClient.user.create({
                        data:{
                                username,
                                password:hashedPassword 
                        }
                })

                // create token and set cookie
                createToken({userId:user.id},res)

                // also send request to backend for initial balance -  to add 1000 USD by default
                const correlationId = crypto.randomUUID()
                const response =  waitForEngineResponse(correlationId)
                const payload ={userId:user.id,symbol:'USD',quantity:1000}
                await sendResponseToEngine(correlationId,ENV.RESPONSE_QUEUE,'initiated_user_balance',payload)
                const data = await response as any
                sendSuccess(res,STATUS_CODE.CREATED as number,{userId:user.id,username:user.username,balance:data.balance ??{}},MESSAGES.SIGNUP_SUCCESS as string)

        } catch (error) {

                sendError(res,STATUS_CODE.SERVER_ERROR as number,MESSAGES.USER_EXISTS as string, error?.message  ?? "Internal server error")
        }
}

async function signinHandler(
        req:Request,
        res:Response
):Promise<void> {

        const parsedBody = authSchema.safeParse(req.body)

        if(!parsedBody.success){
                sendValidationError(res,parsedBody.error)
                return
        }

        const {username,password} = parsedBody.data


        try {
                const userExist = await prismaClient.user.findFirst({
                        where:{
                                username,
                        }
                })

                if(!userExist){
                        sendError(res,STATUS_CODE.NOT_FOUND as number,MESSAGES.USER_NOT_FOUND as string)
                        return
                }


                const correctPassword = await bcrypt.compare(password,userExist.password)

                if(!correctPassword){
                        sendError(res,STATUS_CODE.FORBIDDEN as number,MESSAGES.INVALID_CREDENTIALS as string)
                        return
                }

                // create token and set cookie
                createToken({userId:userExist.id },res)

                sendSuccess(res,STATUS_CODE.OK as number,{userId:userExist.id,username:userExist.username,balance:null },MESSAGES.LOGIN_SUCCESS as string)
        } catch (error) {
                sendError(res,STATUS_CODE.SERVER_ERROR as number,MESSAGES.USER_NOT_FOUND as string, error?.message  ?? "Internal server error")
        }
}

async function getMyProfile( req:Request,res:Response    ):Promise<void>{
        const userId = getUserId(req) as string

        const user = await prismaClient.user.findUnique({where:{id:userId}})

        if(!user){
                sendError(res,STATUS_CODE.NOT_FOUND as number,MESSAGES.USER_NOT_FOUND as string)
                return
        }

        const correlationId = crypto.randomUUID()
        // register correlationId -  means waiting for queue response
        const response =  waitForEngineResponse(correlationId)
        const payload={userId:user.id}
        await sendResponseToEngine(correlationId,ENV.RESPONSE_QUEUE,'get_user_balance',payload)
        const data = await response as any

        sendSuccess(res,STATUS_CODE.OK as number,{userId:user.id,username:user.username,balance:data.balance??null},MESSAGES.LOGIN_SUCCESS as string)
}

async function logout (req:Request,res:Response):Promise<void>{
        res.cookie(
                ENV.TOKEN_NAME as string,
                "",
                {
                        maxAge:0
                }
        )

        sendSuccess(res,STATUS_CODE.OK as number,{},MESSAGES.LOGOUT_SUCCESS as string)
}

export {
        signupHandler,
        signinHandler,
        getMyProfile,
        logout
}