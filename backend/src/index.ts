import cors from "cors"
import express , {
        type NextFunction,
        type Request,
        type Response
} from "express"
import { ENV } from "./utils/env.ts"
import appRouter from "./routes/index.ts"
import {  type Balance, type Order } from "./utils/interfaces.ts"
// in-memory state


export const BALANCES : Record<number,Record<string,Balance>> = {
        1:{
                USD:{available:0,locked:0} ,
                SOL:{available:0,locked:0} 
        }
}//balances = {userId:{USD:{available:0,locked:0},SOL:{available:0,locked:0}}}

/*
bids:[] // highest price first
asks:[] // lowest price first
*/
export const ORDERBOOK:Record<string,{bids:Order[],ask:Order[],lastTradePrice:number}> = {
        ETH:{bids:[] ,asks:[] ,lastTradePrice:0},
        SOL:{bids:[] ,asks:[] ,lastTradePrice:0}
}


const app = express()

app.use(cors())
app.use(express.json())


app.get('/health/check',async(_req,res)=>{
        return res.status(200).json({
                ok:true
        })
})


app.use("/",appRouter)


app.use(
        (error:unknown , _req:Request,res:Response,_next:NextFunction)=>{
                console.error(error)

                res.status(500).json({
                        error:error instanceof Error ? error.message : "Internal server error"
                })
        }
)

app.listen(ENV.PORT,() => {
        console.log(`Backend running on http://localhost: ${ENV.PORT}`)
})