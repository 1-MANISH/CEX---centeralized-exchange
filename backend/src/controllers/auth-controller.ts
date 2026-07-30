import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import { authSchema } from "../types/auth.schema.ts";
import {sendValidationError} from "../utils/validation.ts"
import { prismaClient } from "../db.ts";
import { createToken } from "../utils/auth-token.ts";
import { BALANCES } from "../index.ts";
import { ENV } from "../utils/env.ts";

function getUserId(req:Request):number{
       if(!req.userId)  throw new Error("Missing authenticated user")
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

                BALANCES[user.id] = {USD:{available:0,locked:0},SOL:{available:0,locked:0},BTC:{available:0,locked:0}}

                const token = createToken({
                                userId:user.id
                 },res)



                res.status(201).json({
                        message:'User created successfully',
                        token,
                        userId:user.id,
                        username:user.username
                })
        } catch (error) {
                res.status(409).json({
                        error:"user already exists"
                })
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
                        res.status(404).json({
                                error:"user not found"
                        })
                        return
                }


                const correctPassword = await bcrypt.compare(password,userExist.password)

                if(!correctPassword){
                        res.status(403).json({
                                error:"incorrect password"
                        })
                        return
                }

                const token = createToken({
                                userId:userExist.id
                 },res)

                res.status(201).json({
                        token,
                        userId:userExist.id,
                        username:userExist.username
                })
        } catch (error) {
                res.status(500).json({
                        error:"internal server error"
                })
        }
}

async function getMyProfile( req:Request,res:Response    ):Promise<void>{
        const userId = getUserId(req) as number

        const user = await prismaClient.user.findUnique({where:{id:userId}})

        res.status(200).json({user:user.username})
}

async function logout (req:Request,res:Response):Promise<void>{
        res.cookie(
                ENV.TOKEN_NAME as string,
                "",
                {
                        httpOnly:true,
                        secure:true,
                        sameSite:"none",
                        maxAge:0
                }
        )
        res.status(200).json({message:"Logout successful"})
}

export {
        signupHandler,
        signinHandler,
        getMyProfile,
        logout
}