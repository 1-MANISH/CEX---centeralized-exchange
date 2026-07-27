import { Router } from "express";
import {asyncHandler} from "../utils/async-handler.ts";
import { signupHandler, signinHandler } from "../controllers/auth-controller.ts";

const authRouter = Router()

authRouter.post('/signup',asyncHandler(signupHandler))
authRouter.post('/signin',asyncHandler(signinHandler))

export default authRouter