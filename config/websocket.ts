export interface WebSocketConfig {
    name: string
    url: string
    description?: string
    samplePayloads: {
        label: string
        payload: string
        description?: string
    }[]
}

export const websocketConfigs: Record<string, WebSocketConfig> = {
    whitebit: {
        name: "Public Socket API",
        url: "wss://api.whitebit.com/ws",
        samplePayloads: [
            // Service Methods
            {
                label: "Ping",
                payload: JSON.stringify({
                    id: 1,
                    method: "ping",
                    params: [],
                }, null, 2),
                description: "Keep connection alive"
            },
            {
                label: "Time",
                payload: JSON.stringify({
                    id: 2,
                    method: "time",
                    params: [],
                }, null, 2),
                description: "Get server time"
            },
            // Kline Methods
            {
                label: "Kline Request",
                payload: JSON.stringify({
                    id: 3,
                    method: "candles_request",
                    params: ["BTC_USDT", 1659569940, 1660894800, 3600],
                }, null, 2),
                description: "Get historical candlestick data"
            },
            {
                label: "Kline Subscribe",
                payload: JSON.stringify({
                    id: 4,
                    method: "candles_subscribe",
                    params: ["BTC_USDT", 900],
                }, null, 2),
                description: "Subscribe to real-time candlestick updates"
            },
            {
                label: "Kline Unsubscribe",
                payload: JSON.stringify({
                    id: 5,
                    method: "candles_unsubscribe",
                    params: [],
                }, null, 2),
                description: "Unsubscribe from candlestick updates"
            },
            // Price Methods
            {
                label: "Last Price Request",
                payload: JSON.stringify({
                    id: 6,
                    method: "lastprice_request",
                    params: ["BTC_USDT"],
                }, null, 2),
                description: "Get latest price for a market"
            },
            {
                label: "Last Price Subscribe",
                payload: JSON.stringify({
                    id: 7,
                    method: "lastprice_subscribe",
                    params: ["BTC_USDT"],
                }, null, 2),
                description: "Subscribe to real-time price updates"
            },
            {
                label: "Last Price Unsubscribe",
                payload: JSON.stringify({
                    id: 8,
                    method: "lastprice_unsubscribe",
                    params: [],
                }, null, 2),
                description: "Unsubscribe from price updates"
            },
            // Market Stats Methods
            {
                label: "Market Stats Request",
                payload: JSON.stringify({
                    id: 9,
                    method: "market_request",
                    params: ["BTC_USDT", 86400],
                }, null, 2),
                description: "Get 24h market statistics"
            },
            {
                label: "Market Stats Subscribe",
                payload: JSON.stringify({
                    id: 10,
                    method: "market_subscribe",
                    params: ["BTC_USDT"],
                }, null, 2),
                description: "Subscribe to market statistics updates"
            },
            {
                label: "Market Stats Unsubscribe",
                payload: JSON.stringify({
                    id: 11,
                    method: "market_unsubscribe",
                    params: [],
                }, null, 2),
                description: "Unsubscribe from market statistics"
            },
            // Market Today Stats Methods
            {
                label: "Market Today Request",
                payload: JSON.stringify({
                    id: 12,
                    method: "marketToday_query",
                    params: ["BTC_USDT"],
                }, null, 2),
                description: "Get current day UTC market statistics"
            },
            {
                label: "Market Today Subscribe",
                payload: JSON.stringify({
                    id: 13,
                    method: "marketToday_subscribe",
                    params: ["BTC_USDT"],
                }, null, 2),
                description: "Subscribe to current day market updates"
            },
            {
                label: "Market Today Unsubscribe",
                payload: JSON.stringify({
                    id: 14,
                    method: "marketToday_unsubscribe",
                    params: [],
                }, null, 2),
                description: "Unsubscribe from current day updates"
            },
            // Trades Methods
            {
                label: "Trades Request",
                payload: JSON.stringify({
                    id: 15,
                    method: "trades_request",
                    params: ["BTC_USDT", 100, 41358445],
                }, null, 2),
                description: "Get recent trades for a market"
            },
            {
                label: "Trades Subscribe",
                payload: JSON.stringify({
                    id: 16,
                    method: "trades_subscribe",
                    params: ["BTC_USDT"],
                }, null, 2),
                description: "Subscribe to real-time trade updates"
            },
            {
                label: "Trades Unsubscribe",
                payload: JSON.stringify({
                    id: 17,
                    method: "trades_unsubscribe",
                    params: [],
                }, null, 2),
                description: "Unsubscribe from trade updates"
            },
            // Depth Methods
            {
                label: "Depth Request",
                payload: JSON.stringify({
                    id: 18,
                    method: "depth_request",
                    params: ["BTC_USDT", 100, "0"],
                }, null, 2),
                description: "Get order book for a market"
            },
            {
                label: "Depth Subscribe",
                payload: JSON.stringify({
                    id: 19,
                    method: "depth_subscribe",
                    params: ["BTC_USDT", 100, "0"],
                }, null, 2),
                description: "Subscribe to order book updates"
            },
            {
                label: "Depth Unsubscribe",
                payload: JSON.stringify({
                    id: 20,
                    method: "depth_unsubscribe",
                    params: [],
                }, null, 2),
                description: "Unsubscribe from order book updates"
            },
            // Book Ticker Methods
            {
                label: "Book Ticker Subscribe",
                payload: JSON.stringify({
                    id: 21,
                    method: "bookTicker_subscribe",
                    params: ["BTC_USDT"],
                }, null, 2),
                description: "Subscribe to best bid/ask updates"
            },
            {
                label: "Book Ticker Unsubscribe",
                payload: JSON.stringify({
                    id: 22,
                    method: "bookTicker_unsubscribe",
                    params: [],
                }, null, 2),
                description: "Unsubscribe from best bid/ask updates"
            }
        ]
    }
}

export type WebSocketProviderKey = keyof typeof websocketConfigs
