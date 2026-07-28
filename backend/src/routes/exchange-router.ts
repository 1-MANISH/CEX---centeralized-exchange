import { Router } from "express";
import { createOrder, depositAsset } from "../controllers/exchange-controller.ts";
import { asyncHandler } from "../utils/async-handler.ts";
import { requiredAuth } from "../middleware/auth-middleware.ts";

const exchangeRouter = Router()


exchangeRouter.post('/deposit',requiredAuth,asyncHandler(depositAsset))

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

// create order
exchangeRouter.post("/order",requiredAuth,asyncHandler(createOrder))
// get order details
/*
return {
        orderInformation:{},
        fillHistory:[],
        filledQuantity:0,
        remainingQuantity:0
        orderStatus:"open" | "closed" | "cancelled"
}
*/
exchangeRouter.get("/order/:orderId", (req, res) => {})

// cancel order -  only unfilled orders can be cancelled
/*
originalOrder 100 SOL
filled  = 40 SOL
remaining = 60 SOL

60 SOL removed from orderbook
*/
exchangeRouter.delete("/order/:orderId", (req, res) => {})

// get all orders
exchangeRouter.get("/orders", (req, res) => {})

// --- Market data ---
// get orderbook - app.get('/depth/:symbol',(req,res)=>{})
exchangeRouter.get("/depth/:symbol", (req, res) => {})

exchangeRouter.get("/fills/:symbol", (req, res) => {})
exchangeRouter.get("/stocks", (req, res) => {})
exchangeRouter.get("/balance", (req, res) => {})



export default exchangeRouter