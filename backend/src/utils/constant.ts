const STATUS_CODE:Record<string,number> = {
        OK:200, // success
        CREATED:201,// success- data created
        NO_CONTENT:204,// success - but no data delete and put
        BAD_REQUEST:400,// client sent invalid request
        UNAUTHORIZED:401,// user not logged in
        FORBIDDEN:403,// user logged in but not authorized
        NOT_FOUND:404,// resource not found
        CONFLICT:409, // resource already exists
        SERVER_ERROR:500 // internal server error
}

const MESSAGES:Record<string,string> = {
        USER_EXISTS:"User already exists",
        USER_NOT_FOUND:"User not found",
        INVALID_CREDENTIALS:"Invalid credentials",
        SIGNUP_SUCCESS:"You have signup successfully",
        LOGOUT_SUCCESS:"You have logged out successfully",
        LOGIN_SUCCESS:"You have logged in successfully",
        TOKEN_INVALID:"Token is invalid",
        TOKEN_MISSING:"Token is missing",
        NOT_AUTHORIZED:"You are not authorized",
        SERVER_ERROR:"Internal server error",
        VALIDATION_ERROR:"Validation error",
        ADMIN_UNAUTHORIZED:"Only admin can access this route",
        STOCK_CREATED:"Stock created successfully",
        ASSETS_DEPOSIT_SUCCESS:"Assets deposit successfully",
        FETCHED:"Status fetched successfully",
        MARKET_NOT_FOUND:"Market not found",
        MISSING_FIELD:"Missing field",
        ORDER_NOT_FOUND:"Order not found",
        ORDER_PLACED:"Order placed successfully",
        ORDER_CANCELLED:"Order cancelled successfully",
        SOME_THING_WENT_WRONG:"Sorry but something went wrong",
}


export {
        STATUS_CODE,
        MESSAGES,
}