import { Router } from "express";
import { createAStock, createOrder, depositAsset, getAllFills, getAllOrder, getAllStocksMatrix, getBalance, getDepth, getOrder } from "../controllers/exchange-controller.ts";
import { asyncHandler } from "../utils/async-handler.ts";
import { requiredAuth } from "../middleware/auth-middleware.ts";

const exchangeRouter = Router()


exchangeRouter.post('/deposit',requiredAuth,asyncHandler(depositAsset))

// create a new stock
exchangeRouter.post("/stock", requiredAuth,asyncHandler(createAStock))
exchangeRouter.get("/stocks/matrix", requiredAuth,asyncHandler(getAllStocksMatrix))
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
        orderStatus:"open" | "close" | "cancelled"
}
*/
exchangeRouter.get("/order/:orderId",requiredAuth, asyncHandler(getOrder))

// cancel order -  only unfilled orders can be cancelled
/*
originalOrder 100 SOL
filled  = 40 SOL
remaining = 60 SOL

60 SOL removed from orderbook
*/
exchangeRouter.delete("/order/:orderId", (req, res) => {})

// get all orders
exchangeRouter.get("/orders", requiredAuth,asyncHandler(getAllOrder))

// --- Market data ---
// get orderbook - app.get('/depth/:symbol',(req,res)=>{})
exchangeRouter.get("/depth/:symbol",requiredAuth,asyncHandler(getDepth))

exchangeRouter.get("/fills/:symbol",requiredAuth,asyncHandler(getAllFills))

exchangeRouter.get("/balance", requiredAuth,asyncHandler(getBalance))



export default exchangeRouter