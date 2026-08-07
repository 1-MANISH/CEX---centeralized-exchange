

type Balance = {
        available:number,
        locked:number
}

type Status = "open" | "cancelled" | "closed" | "partial_filled"

type Type = "market" | "limit"

type Side = "buy" | "sell"

type EngineCommandType =
  | "initiated_user_balance"
  | "get_user_balance"
  | "deposit_asset"
  | "create_order"
  | "get_depth"
  | "cancel_order"
  | "make_new_stock_entry"
  ;

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

interface Message{
        type:EngineCommandType,
        payload:any
}




export type {Message,Order, Status, Type, Side , Balance}