# Public WebSocket API

- [Service](#service)
- [Ping](#ping)
- [Time](#time)
- [Kline](#kline)
- [Last price](#last-price)
- [Market statistics](#market-statistics)
- [Market statistics for current day UTC](#market-statistics-for-current-day-utc)
- [Market trades](#market-trades)
- [Market depth](#market-depth)

WebSocket endpoint is wss://api.whitebit.com/ws

The API is based on [JSON RPC](https://www.jsonrpc.org/specification) of WebSocket protocol.

⚠️ Connection will be closed by server in cause of inactivity after 30s.

❗ Rate limit 1000 ws connections per minute and 200 requests per minute in one connection.

All endpoints return time in Unix-time format.

## ⤴️ Request message

JSON Structure of request message:

- `id` - **Integer**. Should be unique to handle response for your request.
- `method` - **String**. Name of request.
- `params` - **Array**. Here you pass params for method.

🚫 WebSocket connection will be closed if invalid JSON was sent.

### Types of request messages

- Query (`ping`, `candles_request`, etc)
- Subscription (`candles_subscribe`, `lastprice_subscribe`, etc). Repeated subscription will be cancelled for the same data type.

## ⤵️ Response message

JSON Structure of response message:

- `id` - **Integer**. Id of request.
- `result` - **Null** for failure, for success - look for responses below
- `error` - **Null** for success, **JSON Object** for failure:
  - `message` - Detailed text
  - `code` - Error code

| Code  | Message             |
| ----- | ------------------- |
| **1** | invalid argument    |
| **2** | internal error      |
| **3** | service unavailable |
| **4** | method not found    |
| **5** | service timeout     |

## Types of response messages

- Query result
- Subscription status (success/failed)
- Update events

---

## Examples

**Example** messages for request with response:

#### ⤴️ Request:

```json
{
  "id": 0,
  "method": "ping",
  "params": []
}
```

#### ⤵️ Response:

```json
{
  "id": 0,
  "result": "pong",
  "error": null
}
```

**Example** subscription:

#### ⤴️ Request:

```json
{
  "id": 0,
  "method": "candles_subscribe",
  "params": []
}
```

#### ⤵️ Response:

```json
{
  "id": 0,
  "result": {
    "status": "success"
  },
  "error": null
}
```

#### 🔄 Update events:

```json
{
  "id": null,
  "method": "candles_update",
  "params": [] // look below for params
}
```

---

## API

### Service

#### Ping

##### ⤴️ Request:

```json
{
  "id": 0,
  "method": "ping",
  "params": []
}
```

##### ⤵️ Response:

```json
{
  "id": 0,
  "result": "pong",
  "error": null
}
```

#### Time

##### ⤴️ Request:

```json
{
  "id": 1,
  "method": "time",
  "params": []
}
```

##### ⤵️ Response:

```json
{
  "id": 1,
  "result": 1493285895,
  "error": null
}
```

---

### Kline

#### Query

The requested interval must meet the following conditions:

- If the number is less than 60, then 60 must be divisible by the requested number without a remainder;
- Less than 3600 (1 hour) - the number must be divisible by 60 without a remainder, and 3600 must be divisible by the requested number without a remainder;
- Less than 86400 (day) - the number must be whitened by 3600 without a remainder, and 86400 must be divisible by the number without a remainder;
- Less than 86400 \* 7 (week) - the number must be divisible by 86400 without a remainder;
- Equal to 86400 \* 7;
- Equal to 86400 \* 30.

##### ⤴️ Request:

```json
{
  "id": 2,
  "method": "candles_request",
  "params": [
    "ETH_BTC", // market
    1659569940, // start time
    1660894800, // end time
    3600 // interval in seconds
  ]
}
```

##### ⤵️ Response:

```json
{
    "id": 2,
    "result": [
        [
            1580860800,       // time
            "0.020543",       // open
            "0.020553",       // close
            "0.020614",       // highest
            "0.02054",        // lowest
            "7342.597",       // volume in stock
            "151.095481849",  // volume in deal
            "ETH_BTC"         // market
        ],
        ...
    ],
    "error": null
}
```

#### Subscribe

Update interval: 0.5 sec

##### ⤴️ Request:

```json
{
  "id": 3,
  "method": "candles_subscribe",
  "params": [
    "BTC_USD", // market
    900 // interval in seconds
  ]
}
```

##### ⤵️ Response:

```json
{
  "id": 3,
  "result": {
    "status": "success"
  },
  "error": null
}
```

##### 🔄 Update events:

```json
{
  "id": null,
  "method": "candles_update",
  "params": [
    [
      1580895000, // time
      "0.020683", // open
      "0.020683", // close
      "0.020683", // high
      "0.020666", // low
      "504.701", // volume in stock
      "10.433600491", // volume in money (deal)
      "ETH_BTC" // market
    ]
  ]
}
```

#### Unsubscribe

##### ⤴️ Request:

```json
{
  "id": 4,
  "method": "candles_unsubscribe",
  "params": []
}
```

##### ⤵️ Response:

```json
{
  "id": 4,
  "result": {
    "status": "success"
  },
  "error": null
}
```

---

### Last price

#### Query

##### ⤴️ Request:

```json
{
  "id": 5,
  "method": "lastprice_request",
  "params": [
    "ETH_BTC" // market
  ]
}
```

##### ⤵️ Response:

```json
{
  "id": 5,
  "result": "0.020553",
  "error": null
}
```

#### Subscribe

Update interval: 1 sec

##### ⤴️ Request:

```json
{
    "id": 6,
    "method": "lastprice_subscribe",
    "params": [
        "ETH_BTC", // markets
        "BTC_USDT",
        ...
    ]
}
```

##### ⤵️ Response:

```json
{
  "id": 6,
  "result": {
    "status": "success"
  },
  "error": null
}
```

##### 🔄 Update events:

```json
{
  "id": null,
  "method": "lastprice_update",
  "params": [
    "ETH_BTC", // market
    "0.020683" // price
  ]
}
```

#### Unsubscribe

##### ⤴️ Request:

```json
{
  "id": 7,
  "method": "lastprice_unsubscribe",
  "params": []
}
```

##### ⤵️ Response:

```json
{
  "id": 7,
  "result": {
    "status": "success"
  },
  "error": null
}
```

---

### Market statistics

#### Query

##### ⤴️ Request:

```json
{
  "id": 5,
  "method": "market_request",
  "params": [
    "ETH_BTC", // market
    86400 // period in seconds
  ]
}
```

##### ⤵️ Response:

```json
{
  "id": 5,
  "result": {
    "period": 86400, // period in seconds
    "last": "0.020981", // last price
    "open": "0.02035", // open price that was at 'now - period' time
    "close": "0.020981", // price that closes this period
    "high": "0.020988", // highest price
    "low": "0.020281", // lowest price
    "volume": "135220.218", // volume in stock
    "deal": "2776.587022649" // volume in money
  },
  "error": null
}
```

#### Subscribe

You can subscribe only for 86400s (24h from now).

Update interval: 1 sec

##### ⤴️ Request:

```json
{
    "id": 6,
    "method": "market_subscribe",
    "params": [
        "ETH_BTC", // markets
        "BTC_USDT",
        ...
    ]
}
```

##### ⤵️ Response:

```json
{
  "id": 6,
  "result": {
    "status": "success"
  },
  "error": null
}
```

##### 🔄 Update events:

```json
{
  "id": null,
  "method": "market_update",
  "params": [
    "ETH_BTC", // market
    {
      // response same as 'market_request'
      "period": 86400, // period in seconds
      "last": "0.020964", // last price
      "open": "0.020349", // open price that was at 'now - period' time
      "close": "0.020964", // price that closes this period
      "high": "0.020997", // highest price
      "low": "0.020281", // lowest price
      "volume": "135574.476", // volume in stock
      "deal": "2784.413999488" // volume in money
    }
  ]
}
```

#### Unsubscribe

##### ⤴️ Request:

```json
{
  "id": 7,
  "method": "market_unsubscribe",
  "params": []
}
```

##### ⤵️ Response:

```json
{
  "id": 7,
  "result": {
    "status": "success"
  },
  "error": null
}
```

---

### Market statistics for current day UTC

#### Query

##### ⤴️ Request:

```json
{
  "id": 14,
  "method": "marketToday_query",
  "params": [
    "ETH_BTC" // only one market per request
  ]
}
```

##### ⤵️ Response:

```json
{
  "id": 14,
  "result": {
    "last": "0.020981", // last price
    "open": "0.02035", // open price that was at 'now - period' time
    "high": "0.020988", // highest price
    "low": "0.020281", // lowest price
    "volume": "135220.218", // volume in stock
    "deal": "2776.587022649" // volume in money
  },
  "error": null
}
```

#### Subscribe

Update interval: 1 sec

##### ⤴️ Request:

```json
{
    "id": 15,
    "method": "marketToday_subscribe",
    "params": [
        "ETH_BTC", // markets
        "BTC_USDT",
        ...
    ]
}
```

##### ⤵️ Response:

```json
{
  "id": 15,
  "result": {
    "status": "success"
  },
  "error": null
}
```

##### 🔄 Update events:

```json
{
  "id": null,
  "method": "marketToday_update",
  "params": [
    "ETH_BTC", // market
    {
      // response same as 'market_request'
      "last": "0.020964", // last price
      "open": "0.020349", // open price that was at 'now - period' time
      "high": "0.020997", // highest price
      "low": "0.020281", // lowest price
      "volume": "135574.476", // volume in stock
      "deal": "2784.413999488" // volume in money
    }
  ]
}
```

#### Unsubscribe

##### ⤴️ Request:

```json
{
  "id": 16,
  "method": "marketToday_unsubscribe",
  "params": []
}
```

##### ⤵️ Response:

```json
{
  "id": 16,
  "result": {
    "status": "success"
  },
  "error": null
}
```

---

### Market trades

#### Query

##### ⤴️ Request:

```json
{
  "id": 8,
  "method": "trades_request",
  "params": [
    "ETH_BTC", // market
    100, // limit
    41358445 // largest id from which you want to request trades
  ]
}
```

##### ⤵️ Response:

```json
{
    "id": 8,
    "result": [
        {
            "id": 41358530,           // trade id
            "time": 1580905394.70332, // time in milliseconds
            "price": "0.020857",      // trade price
            "amount": "5.511",        // trade amount
            "type": "sell"            // type of trade (buy/sell)
        },
        ...
    ],
    "error": null
}

```

#### Subscribe

Update interval: 100 ms

❗ For each websocket connection, you can subscribe to either one or several markets. Every following subscription will replace the existing one.

##### ⤴️ Request:

```json
{
    "id": 9,
    "method": "trades_subscribe",
    "params": [
        "ETH_BTC", // markets
        "BTC_USDT",
        ...
    ]
}
```

##### ⤵️ Response:

```json
{
  "id": 9,
  "result": {
    "status": "success"
  },
  "error": null
}
```

##### 🔄 Update events:

```json
{
    "id": null,
    "method": "trades_update",
    "params": [
        "ETH_BTC",                         // market
         [                                 // response same as 'market_request'
             {
                 "id": 41358530,           // trade id
                 "time": 1580905394.70332, // time in milliseconds
                 "price": "0.020857",      // trade price
                 "amount": "5.511",        // trade amount
                 "type": "sell"            // type of trade (buy/sell)
             },
             ...
         ]
    ]
}
```

#### Unsubscribe

##### ⤴️ Request:

```json
{
  "id": 10,
  "method": "trades_unsubscribe",
  "params": []
}
```

##### ⤵️ Response:

```json
{
  "id": 10,
  "result": {
    "status": "success"
  },
  "error": null
}
```

---

### Market depth

#### Query

##### ⤴️ Request:

```json
{
  "id": 11,
  "method": "depth_request",
  "params": [
    "ETH_BTC", // market
    100, // limit, max value is 100
    "0" // price interval units. "0" - no interval, available values - "0.00000001", "0.0000001", "0.000001", "0.00001", "0.0001", "0.001", "0.01", "0.1"
  ]
}
```

##### ⤵️ Response:

```json
{
    "id": 11,
    "result": {
        "timestamp": 1689600180.5164471,
        "asks": [                   // sorted ascending
            ["0.020846", "29.369"], // [price, amount]
            ...
        ],
        "bids": [                   // sorted descending
            ["0.02083", "9.598"],   // [price, amount]
            ...
        ]
    },
    "error": null
}

```

#### Subscribe

Update interval: 100 ms

##### ⤴️ Request:

```json
{
  "id": 12,
  "method": "depth_subscribe",
  "params": [
    "ETH_BTC",  // market
    100,        // limit. available values - 1, 5, 10, 20, 30, 50, 100
    "0",        // price interval units. "0" - no interval, available values - "0.00000001", "0.0000001", "0.000001", "0.00001", "0.0001", "0.001", "0.01", "0.1"
    true        // multiple subscription flag. true - add, false - unsubscribe from all
  ]
}
```

The last parameter - Multiple subscription flag - allows you to subscribe to market depths as many markets as you want. The only restriction is one subscription with specific parameters per market.

##### ⤵️ Response:

```json
{
  "id": 12,
  "result": {
    "status": "success"
  },
  "error": null
}
```

##### 🔄 Update events:

```json
{
    "id": null,
    "method": "depth_update",
    "params": [
        false,                          // true - full reload, false - partial update
        {
            "timestamp": 1689600180.5164471,
            "asks": [
                ["0.020861", "0"],      // for partial update - finished orders will be [price, "0"]
                ...
            ],
            "bids": [
                ["0.020844", "5.949"],
                ...
            ]
        },
        "ETH_BTC"                       // market
    ]
}
```

#### Unsubscribe

##### ⤴️ Request:

```json
{
  "id": 13,
  "method": "depth_unsubscribe",
  "params": []
}
```

##### ⤵️ Response:

```json
{
  "id": 13,
  "result": {
    "status": "success"
  },
  "error": null
}
```
