import { Router } from "express";
import authRouter from "./auth-routes.ts"
import exchangeRouter from "./exchange-router.ts";

const appRouter = Router()

appRouter.use("/auth",authRouter)
appRouter.use('/exchange',exchangeRouter)

export default appRouter