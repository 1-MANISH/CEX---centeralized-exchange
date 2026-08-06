import "dotenv/config"

function readRequiredEnv(name: string): string {

        const value = process.env[name]
        if (!value) {
                throw new Error(`Missing required environment variable: ${name}`)
        }
        return value
}

export const ENV = {
        REDIS_URL: readRequiredEnv("REDIS_URL"),
        IN_COMING_QUEUE: readRequiredEnv("IN_COMING_QUEUE"),
}