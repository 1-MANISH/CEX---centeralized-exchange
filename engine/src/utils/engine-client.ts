import { createClient } from "redis";
import { ENV } from "./env";

const consumerClient = createClient({
        url:ENV.REDIS_URL
})

const responserClient = createClient({
        url:ENV.REDIS_URL
})


export async function connectRedis(){
        try{
                console.log(`[Redis] Connecting...`)
                await consumerClient.connect()
                await responserClient.connect()
                console.log(`[Redis] Connected`)
        }catch(e){
                console.log(`Error connecting to redis: ${e}`)
                process.exit(1)
        }
}

export {consumerClient,responserClient}