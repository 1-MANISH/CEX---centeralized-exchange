

type Balance = {
        available:number,
        locked:number
}

type Status = "open" | "cancelled" | "closed" | "partial_filled"

type Type = "market" | "limit"

type Side = "buy" | "sell"

interface UserOrder{
        userId:string,
        type:Type,
        side:Side,
        market:string,
        quantity:number
        price?:number|null,
}

 interface Order {
    id: string;
    userId: string;
    side: Side;
    type: Type;
    market: string;
    price?: number | null;
    quantity: number;
    remainingQuantity: number;
    filledQuantity: number;
    status: Status;
    createdAt: Date;
}


interface Matrix {
        symbol:string,
        currentPrice:number,
        volume24h:number,
        change24h:number
}

interface TokenPayload {
        userId:string;
}



export type {UserOrder,Order, Status, Type, Side , Balance, Matrix, TokenPayload}