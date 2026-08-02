import { Router } from "express";
import {asyncHandler} from "../utils/async-handler.ts";
import { signupHandler, signinHandler, getMyProfile, logout } from "../controllers/auth-controller.ts";
import { requiredAuth } from "../middleware/auth-middleware.ts";

const authRouter = Router()

authRouter.post('/signup',asyncHandler(signupHandler))
authRouter.post('/login',asyncHandler(signinHandler))
authRouter.get('/check',requiredAuth,asyncHandler(getMyProfile))
authRouter.post('/logout',asyncHandler(logout))

export default authRouter