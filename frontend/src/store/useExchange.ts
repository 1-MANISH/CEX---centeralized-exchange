import {create} from "zustand"
import {axiosInstance} from "../lib/axios"
import toast from 'react-hot-toast'

type Type = 'limit' | 'market'
type Side = 'buy' | 'sell'


interface StockItem {
        name: string;
        symbol: string;
        currentPrice: string;
        volume24h: string;
        change24h: string;
}
interface OrderBookEntry {
        market: string;
        type:Type,
        side:Side
        price?: number;
        quantity: number;
}

export const useExchangeStore = create((set,get)=>({

        stockMarketMatrix:[] as StockItem[],
        orderBook:{bids:[],asks:[],lastTradePrice:0},
        orders:[],
        fills:[],
        orderDetails:{},
        orderFills:[],
        graphData:[],
        isFetching:false,
        createOrderLoading:false,

       
        getStockMarketMatrix:async()=>{

                set({isFetching:true})
                try {
                        const response = await axiosInstance.get("/exchange/stocks/matrix")
                        set({stockMarketMatrix:response.data.data.stocks})
                } catch (error) {
                        console.log("Error fetching stock market matrix:", error)
                }finally{
                        set({isFetching:false})
                }
        },
        getOrderBook:async(symbol:string)=>{

                set({isFetching:true})
                try {
                        const response = await axiosInstance.get(`/exchange/depth/${symbol}`)
                        set({orderBook:response.data.data.depth})
                } catch (error) {
                        console.log("Error fetching order book:", error)
                }finally{
                        set({isFetching:false})
                }
        },
         getOrderDetails:async(orderId:string)=>{

                set({isFetching:true})
                try {
                        const response = await axiosInstance.get(`/exchange/order/${orderId}`)
                        set({orderDetails:response.data.data})
                } catch (error) {
                        console.log("Error fetching order book:", error)
                }finally{
                        set({isFetching:false})
                }
        },
         getAllOrders:async()=>{

                set({isFetching:true})
                try {
                        const response = await axiosInstance.get(`/exchange/orders`)
                        set({orders:response.data.data.orders})
                } catch (error) {
                        console.log("Error fetching orders:", error)
                }finally{
                        set({isFetching:false})
                }
        },
        getAllFills:async()=>{

                set({isFetching:true})
                try {
                        const response = await axiosInstance.get(`/exchange/fills`)
                        set({fills:response.data.data.fills})
                } catch (error) {
                        console.log("Error fetching fills:", error)
                }finally{
                        set({isFetching:false})
                }
        },
        getOrderFills:async(orderId:string)=>{

                set({isFetching:true})
                try {
                        const response = await axiosInstance.get(`/exchange/fills/${orderId}`)
                        set({orderFills:response.data.data})
                } catch (error) {
                        console.log("Error fetching order fills:", error)
                }finally{
                        set({isFetching:false})
                }
        },
        createOrder:async(order:OrderBookEntry)=>{
                set({createOrderLoading:true})
                try {
                        const response = await axiosInstance.post("/exchange/order",order)
                       console.log("Order created successfully:", response.data.data)
                       toast.success("Order created successfully")
                       //call orderbook and order history api to update the data
                } catch (error) {
                        console.log("Error fetching stock market matrix:", error)
                        toast.error("Failed to create order")
                }finally{
                        set({createOrderLoading:false})
                }
        },


}))
