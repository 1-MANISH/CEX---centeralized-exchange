import { createClient } from "redis";
import { ENV } from "./env.ts";

const publisher = createClient({
        url:ENV.REDIS_URL
})

const subscriber = createClient({
        url:ENV.REDIS_URL
})

export async function connectRedis(){
        try{
               console.log(`[Redis] Connecting...`)
                await publisher.connect()
                await subscriber.connect()
                console.log(`[Redis] Connected`)
        }catch(e){
                console.log(`Error connecting to redis: ${e}`)
        }
}

export {publisher,subscriber}