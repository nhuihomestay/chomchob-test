declare interface IAddUser {
    username: String
    password: String
}

declare interface IEditBalance {
    username: String
    balance: ICurrency
}

declare interface ICurrency {
    USDT: Number | null
    BTC: Number | null
    ETH: Number | null
    ARB: Number | null
    OP: Number | null
}

declare interface ISendToken {
    recipient: String
    send_token: String
    to_token: String
    amount: Number
}