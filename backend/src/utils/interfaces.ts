

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

interface InComingOrder extends Order{
        userId:number,
}


export type {Order, InComingOrder, Status, Type, Side}