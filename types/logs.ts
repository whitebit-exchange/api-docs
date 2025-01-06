export interface TradePayload {
  market: string
  amount?: string
  price?: string
  side: 'buy' | 'sell'
  clientOrderId?: string
  stopPrice?: string
  activation_price?: string
  type?: 'stop' | 'stop_limit'
  timeInForce?: 'GTC' | 'IOC'
  orderId?: string
}

export interface ApiLog {
  id: string
  timestamp: string
  path: string
  payload: TradePayload
  statusCode: number
}

