import "dotenv/config"

function readRequiredEnv(name:string):string {

        const value = process.env[name]
        if (!value) {
            throw new Error(`Missing required environment variable: ${name}`)
        }
        return value
}

export const ENV = {
        PORT:Number(process.env.PORT ?? "3000"),
        JWT_SECRET:readRequiredEnv("JWT_SECRET") ?? "",
        DATABASE_URL:readRequiredEnv("DATABASE_URL") ??"",
        REFRESH_SECRET:readRequiredEnv("REFRESH_SECRET") ?? "",
        TOKEN_NAME:readRequiredEnv("TOKEN_NAME") ?? "",
        ACCESS_TOKEN_EXPIRY:readRequiredEnv("ACCESS_TOKEN_EXPIRY") ?? "",
        REFRESH_TOKEN_EXPIRY:readRequiredEnv("REFRESH_TOKEN_EXPIRY") ?? "",
       ADMIN_USERNAME:readRequiredEnv("ADMIN_USERNAME") ?? "",
       ADMIN_PASSWORD:readRequiredEnv("ADMIN_PASSWORD") ?? "",
        
}