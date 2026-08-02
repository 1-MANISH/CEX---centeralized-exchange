import cors from "cors"
import cookieParser from "cookie-parser"
import express , {
        type NextFunction,
        type Request,
        type Response
} from "express"
import { ENV } from "./utils/env.ts"
import appRouter from "./routes/index.ts"
import {  type Balance, type Order } from "./utils/interfaces.ts"
import { STATUS_CODE } from "./utils/constant.ts"
import { sendError } from "./utils/response.ts"

// in-memory state
//balances = {userId:{USD:{available:0,locked:0},SOL:{available:0,locked:0}}}
export const BALANCES : Record<string,Record<string,Balance>> = {}

/*
bids:[] // highest price first
asks:[] // lowest price first
orderbook = {ETH:{bids:[] ,asks:[] ,lastTradePrice:0}}
*/
export const ORDERBOOK:Record<string,{bids:Order[],asks:Order[],lastTradePrice:number}> = {}


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