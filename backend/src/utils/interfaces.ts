

type Balance = {
        available:number,
        locked:number
}

type Status = "open" | "cancelled" | "close"

type Type = "market" | "limit"

type Side = "buy" | "sell"


 interface Order {
    id: number;
    userId: number;
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


export type {Order, Status, Type, Side , Balance, Matrix}