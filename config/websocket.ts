import { WebSocketConfig } from "@/types/websocket";
import { REGIONS, DEFAULT_REGION } from "./regions";

export const config: WebSocketConfig = {
  providers: {
    public: {
      label: "Public WebSocket API",
      url: `${REGIONS[DEFAULT_REGION].wsBaseUrl}/ws`,
      description: "Public WebSocket API for market data",
      samples: [
        {
          label: "Ping",
          payload: JSON.stringify({
            id: 1,
            method: "ping",
            params: [],
          }, null, 2)
        },
        {
          label: "Time",
          payload: JSON.stringify({
            id: 2,
            method: "time",
            params: [],
          }, null, 2)
        },
        {
          label: "Subscribe to Klines",
          payload: JSON.stringify({
            id: 4,
            method: "candles_subscribe",
            params: ["BTC_USDT", 900],
          }, null, 2)
        },
        {
          label: "Unsubscribe from Klines",
          payload: JSON.stringify({
            id: 5,
            method: "candles_unsubscribe",
            params: ["BTC_USDT", 900],
          }, null, 2)
        },
        {
          label: "Subscribe to Market Price",
          payload: JSON.stringify({
            id: 7,
            method: "lastprice_subscribe",
            params: ["BTC_USDT"],
          }, null, 2)
        },
        {
          label: "Unsubscribe from Market Price",
          payload: JSON.stringify({
            id: 8,
            method: "lastprice_unsubscribe",
            params: [],
          }, null, 2)
        },
        {
          label: "Get Market Price",
          payload: JSON.stringify({
            id: 9,
            method: "lastprice_request",
            params: ["BTC_USDT"],
          }, null, 2)
        },
        {
          label: "Subscribe to Market Stats",
          payload: JSON.stringify({
            id: 10,
            method: "market_subscribe",
            params: ["BTC_USDT"],
          }, null, 2)
        },
        {
          label: "Unsubscribe from Market Stats",
          payload: JSON.stringify({
            id: 11,
            method: "market_unsubscribe",
            params: [],
          }, null, 2)
        },
        {
          label: "Get Market Stats",
          payload: JSON.stringify({
            id: 12,
            method: "market_request",
            params: ["BTC_USDT", 86400],
          }, null, 2)
        },
        {
          label: "Subscribe to Trades",
          payload: JSON.stringify({
            id: 13,
            method: "trades_subscribe",
            params: ["BTC_USDT"],
          }, null, 2)
        },
        {
          label: "Unsubscribe from Trades",
          payload: JSON.stringify({
            id: 14,
            method: "trades_unsubscribe",
            params: ["BTC_USDT"],
          }, null, 2)
        },
        {
          label: "Get Recent Trades",
          payload: JSON.stringify({
            id: 15,
            method: "trades_request",
            params: ["BTC_USDT", 100, 41358445],
          }, null, 2)
        },
        {
          label: "Subscribe to Book Ticker",
          payload: JSON.stringify({
            id: 16,
            method: "bookTicker_subscribe",
            params: ["BTC_USDT"],
          }, null, 2)
        },
        {
          label: "Unsubscribe from Book Ticker",
          payload: JSON.stringify({
            id: 17,
            method: "bookTicker_unsubscribe",
            params: ["BTC_USDT"],
          }, null, 2)
        },
        {
          label: "Subscribe to Order Book",
          payload: JSON.stringify({
            id: 18,
            method: "depth_subscribe",
            params: ["BTC_USDT", 100, "0"],
          }, null, 2)
        },
        {
          label: "Unsubscribe from Order Book",
          payload: JSON.stringify({
            id: 19,
            method: "depth_unsubscribe",
            params: ["BTC_USDT", 100, "0"],
          }, null, 2)
        },
        {
          label: "Get Order Book",
          payload: JSON.stringify({
            id: 20,
            method: "depth_request",
            params: ["BTC_USDT", 100, "0"],
          }, null, 2)
        }
      ]
    }
  }
};

export type WebSocketProviderKey = keyof (typeof config)["providers"];
