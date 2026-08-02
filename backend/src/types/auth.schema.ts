import {z} from "zod"

export const authSchema = z.object({
        username:z.string().trim().min(2,"Username must be at least 2 characters long"),
        password:z.string().trim().min(8,"Password must be at least 8 characters long")
})