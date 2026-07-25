import cors from "cors"

import express , {
        type NextFunction,
        type Request,
        type Response
} from "express"
import { ENV } from "./utils/env.ts"

// in-memory state

const BALANCES = {
        1:{
                USD:{available:0,locked:0},
                SOL:{available:0,locked:0}
        }
}//balances = {userId:{USD:{available:0,locked:0},SOL:{available:0,locked:0}}}
const ORDERBOOK = {
        AXIS:{bids:[],ask:[],lastTradePrice:0},
        PERP:{bids:[],ask:[],lastTradePrice:0}
}

const app = express()


app.use(cors())
app.use(express.json())


app.get('/health/check',async(_req,res)=>{
        return res.status(200).json({
                ok:true
        })
})


app.post("/signup", (req, res) => {})
app.post("/login", (req, res) => {})

// --- Orders ---

/*
body:{
                type: "market":"limit",
                price: number | null,
                quantity: number,
                marketId : string | null,
                side: "buy" | "sell"
        }

        //buy
        10 SOL   99.9
        // some one selling
        5 => 99.8
        5= > 99.9
        totalPrice = price * quantity => 5 * 99.9 + 5 * 99.8
        averagePrice = totalPrice / quantity=> 99.85

        why not averagePrice ??? ---> avoid sending decimals to users

@returns {
        orderId:string,
        filledQuantity:number,
        totalPrice:number
}

*/
app.post("/order", (req, res) => {

})
app.delete("/order/:orderId", (req, res) => {})
app.get("/orders", (req, res) => {})

// --- Market data ---
app.get("/orderbook/:symbol", (req, res) => {})
app.get("/fills/:symbol", (req, res) => {})
app.get("/stocks", (req, res) => {})
app.get("/balance", (req, res) => {})


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