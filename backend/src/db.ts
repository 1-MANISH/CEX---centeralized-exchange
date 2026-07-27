import { PrismaPg } from "@prisma/adapter-pg";
import { ENV } from "./utils/env.ts";
import { PrismaClient } from "./generated/prisma/client.ts";

const adapter  = new PrismaPg({
        connectionString:ENV.DATABASE_URL
})

export const prismaClient = new PrismaClient({adapter })
