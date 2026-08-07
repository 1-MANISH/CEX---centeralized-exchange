import cors from "cors"
import cookieParser from "cookie-parser"
import express , {
        type NextFunction,
        type Request,
        type Response
} from "express"
import { ENV } from "./utils/env.ts"
import appRouter from "./routes/index.ts"
import { STATUS_CODE } from "./utils/constant.ts"
import { sendError } from "./utils/response.ts"
import { connectRedis } from "./utils/engine-client.ts"
import { listenForEngineResponses } from "./utils/engine/listenForEngineResponses.ts"


async function main(){

        await connectRedis()

        await listenForEngineResponses()

        console.log(`[Backend] Starting...`)

        const app = express()

        app.use(express.json())
        app.use(cors({
                origin:ENV.CLIENT_URL,
                credentials:true
        }))

        app.use(cookieParser())

        app.get('/health/check',async(_req,res)=>{
                return res.status(200).json({
                        ok:true
                })
        })

        app.use("/",appRouter)

        app.use(
                (error:unknown , _req:Request,res:Response,_next:NextFunction)=>{

                        sendError(res,STATUS_CODE.SERVER_ERROR as number, "Internal server error",error instanceof Error ? error.message:"")
                }
        )

        app.listen(ENV.PORT,() => {
                console.log(`Backend running on http://localhost: ${ENV.PORT}`)
        })
}

main()



