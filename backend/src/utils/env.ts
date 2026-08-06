import "dotenv/config"

function readRequiredEnv(name: string): string {

        const value = process.env[name]
        if (!value) {
                throw new Error(`Missing required environment variable: ${name}`)
        }
        return value
}

export const ENV = {
        PORT: Number(process.env.PORT ?? "3000") ?? 3000,
        CLIENT_URL: readRequiredEnv("CLIENT_URL") ?? "",
        JWT_SECRET: readRequiredEnv("JWT_SECRET") ?? "",
        DATABASE_URL: readRequiredEnv("DATABASE_URL") ?? "",
        TOKEN_NAME: readRequiredEnv("TOKEN_NAME") ?? "",
        ACCESS_TOKEN_EXPIRY: Number(readRequiredEnv("ACCESS_TOKEN_EXPIRY")) ?? 1 * 24 * 60 * 60,
        ADMIN_USERNAME: readRequiredEnv("ADMIN_USERNAME") ?? "",
        ADMIN_PASSWORD: readRequiredEnv("ADMIN_PASSWORD") ?? "",
        NODE_ENV: readRequiredEnv("NODE_ENV"),

        REDIS_URL: readRequiredEnv("REDIS_URL"),
        IN_COMING_QUEUE: readRequiredEnv("IN_COMING_QUEUE"),
        RESPONSE_QUEUE:`response-queue-${process.env.BACKEND_QUEUE_ID ?? crypto.randomUUID()}`,
        ENGINE_TIMEOUT_MS:Number(readRequiredEnv("ENGINE_TIMEOUT_MS"))
}