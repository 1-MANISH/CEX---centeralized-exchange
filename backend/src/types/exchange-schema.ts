import {z} from "zod"

export const stockParseSchema = z.object({
        name:z.string().trim().min(2,"symbol name is required"),
        symbol:z.string().trim().min(1,"symbol is required")

})
export const orderParamSchema = z.object({
        orderId:z.string().trim().min(1,"orderId is required")
})


export const orderBodySchema = z.discriminatedUnion("type",[
        z.object({
                type:z.literal("limit"),
                side:z.enum(["buy","sell"]),
                market:z.string().trim().min(1,"Market is required"),
                price:z.number().positive("Price must be greater than 0"),
                quantity:z.number().positive("Quantity must be greater than 0"),
        }),
        z.object({
                type:z.literal("market"),
                side:z.enum(["buy","sell"]),
                market:z.string().trim().min(1,"Market is required"),
                price:z.number().positive("Price must be greater than 0").optional(),
                quantity:z.number().positive("Quantity must be greater than 0"),
        })
])

export const depositBodySchema = z.object({
        symbol:z.string().trim().min(1,"symbol is required"),
        quantity:z.number().positive("Quantity must be greater than 0")
})

export const stockBodySchema = z.object({
        name:z.string().trim().min(2,"symbol name is required"),
        symbol:z.string().trim().min(1,"symbol is required")
})