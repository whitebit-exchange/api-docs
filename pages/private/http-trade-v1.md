# Private HTTP API V1

#### Those endpoints are deprecated. Use [V4 alternatives](./http-trade-v4) instead

- [Trading balance by currency](#trading-balance-by-currency)
- [Trading balances](#trading-balances)
- [Create limit order](#create-limit-order)
- [Cancel order](#cancel-order)
- [Query unexecuted(active) orders](#query-unexecutedactive-orders)
- [Query order history](#query-order-history)
- [Query order history by single market](#query-executed-order-history-by-single-market)
- [Query order history by all markets](#query-executed-order-history-by-all-markets)
- [Query executed order deals](#query-executed-order-deals)

Base URL is https://whitebit.com

Endpoint example: https://whitebit.com/api/v1/{endpoint}

All endpoints return time in Unix-time format.

All endpoints return either a **JSON** object or array.

For receiving responses from API calls please use http method **POST**

---

### Error messages V1 format

```json
{
  "code": 0,
  "message": "MESSAGE",
  "errors": {
    "PARAM1": ["MESSAGE"],
    "PARAM2": ["MESSAGE"]
  }
}
```

---

### Trading balance by currency

#### This endpoint is deprecated. Use [V4 endpoint](./http-trade-v4#trading-balance) instead

```
[POST] /api/v1/account/balance
```

This endpoint retrieves the [trade balance](./../glossary.md#balance-spotbalance-trade) by currency [ticker](./../glossary.md#ticker).

❗ Rate limit 1000 requests/10 sec.

**Response is cached for:**
NONE

**Parameters:**

| Name     | Type   | Mandatory | Description                                                |
| -------- | ------ | --------- | ---------------------------------------------------------- |
| currency | String | **Yes**   | Currency's [ticker](./../glossary.md#ticker). Example: BTC |

**Request BODY raw:**

```json
{
  "currency": "BTC",
  "request": "{{request}}",
  "nonce": "{{nonce}}"
}
```

**Response:**

```json
{
  "available": "0.2", // Available balance of currency for trading
  "freeze": "1.02" // Balance of currency on orders
}
```

<details>
<summary><b>Errors:</b></summary>

```json
{
  "message": "Currency not found"
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "ticker": ["The ticker must be a string."]
  }
}
```

</details>
___

### Trading balances

#### This endpoint is deprecated. Use [V4 endpoint](./http-trade-v4#trading-balance) instead

```
[POST] /api/v1/account/balances
```

This endpoint retrieves all available [balances for trading](./../glossary.md#balance-spotbalance-trade).

❗ Rate limit 1000 requests/10 sec.

**Response is cached for:**
NONE

**Parameters:**
NONE

**Request BODY raw:**

```json
{
  "request": "{{request}}",
  "nonce": "{{nonce}}"
}
```

**Response:**

```json
{
    "success": true,
    "message": "",
    "result": {
        "BAT": {
            "available": "0",
            "freeze": "0"
        },
        "BCH": {
            "available": "0.00096586",
            "freeze": "0"
        },
        "BNB": {
            "available": "0",
            "freeze": "0"
        },
        "BSV": {
            "available": "0",
            "freeze": "0"
        },
        "BTC": {
            "available": "0.2",
            "freeze": "1.02"
        },
        "BTG": {
            "available": "0",
            "freeze": "0"
        },
        "BTT": {
            "available": "0",
            "freeze": "0"
        },
        "DASH": {
            "available": "0",
            "freeze": "0"
        },
        "DBTC": {
            "available": "0.47",
            "freeze": "0"
        },
        "ETH": {
            "available": "0.0000059",
            "freeze": "0"
        },
        "EUR": {
            "available": "0.00155901",
            "freeze": "0"
        },
        {...}
    }
}
```

---

### Create limit order

#### This endpoint is deprecated. Use [V4 endpoint](./http-trade-v4#create-limit-order) instead

```
[POST] /api/v1/order/new
```

This endpoint creates [limit trading order](./../glossary.md#orders).

❗ Rate limit 1000 requests/10 sec.

**Response is cached for:**
NONE

**Parameters:**

| Name          | Type   | Mandatory | Description                                                                                                                   |
| ------------- | ------ | --------- | ----------------------------------------------------------------------------------------------------------------------------- |
| market        | String | **Yes**   | Available market. Example: BTC_USDT                                                                                           |
| side          | String | **Yes**   | Order type. Variables: 'buy' / 'sell' Example: 'buy'                                                                          |
| amount        | String | **Yes**   | Amount of [stock](./../glossary.md#stock) currency to buy or sell. Example: '0.001'                                           |
| price         | String | **Yes**   | Price in [money](./../glossary.md#money) currency. Example: '9800'                                                            |
| clientOrderId | String | **No**    | Identifier should be unique and contain letters, dashes or numbers only. The identifier must be unique for the next 24 hours. |

**Request BODY raw:**

```json
{
  "market": "BTC_USDT",
  "side": "buy",
  "amount": "0.001",
  "price": "40000",
  "clientOrderId": "order1987111",
  "request": "{{request}}",
  "nonce": "{{nonce}}"
}
```

**Response:**

```json
{
  "orderId": 4180284841, // order id
  "clientOrderId": "order1987111", // custom client order id; "clientOrderId": "" - if not specified.
  "market": "BTC_USDT", // deal market
  "side": "buy", // order side
  "type": "limit", // order type
  "timestamp": 1595792396.165973, // current timestamp
  "dealMoney": "0", // if order finished - amount in money currency that finished
  "dealStock": "0", // if order finished - amount in stock currency that finished
  "amount": "0.001", // amount
  "makerFee": "0.001", // maker fee ratio. If the number less than 0.0001 - its rounded to zero
  "takerFee": "0.001", // maker fee ratio. If the number less than 0.0001 - its rounded to zero
  "left": "0.001", // if order not finished - rest of amount that must be finished
  "dealFee": "0", // fee in money that you pay if order is finished
  "price": "40000" // price
}
```

<details>
<summary><b>Errors:</b></summary>

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "amount": ["The amount field is required."],
    "market": ["The market field is required."],
    "price": ["The price field is required."],
    "side": ["The side field is required."]
  }
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "side": ["The selected side is invalid."]
  }
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "amount": ["The amount must be a number."]
  }
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "price": ["The price must be a number."]
  }
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "market": ["Unknown market."]
  }
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "amount": ["Not enough balance"]
  }
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "amount": ["Given amount is less than min amount 0.0001"],
    "total": ["Total is less than 5.05"]
  }
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "clientOrderId": ["The field should be a string."]
  }
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "clientOrderId": ["The field format should be: «0-9a-z»"]
  }
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "clientOrderId": [
      "This client order id is already used by the current account. It will become available in 24 hours (86400 seconds). "
    ]
  }
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "amount": [
      "Min amount step = 0.01" //money/stock precision is not taken into consideration when order was submitted
    ]
  }
}
```

</details>

---

### Cancel order

#### This endpoint is deprecated. Use [V4 endpoint](./http-trade-v4#cancel-order) instead

```
[POST] /api/v1/order/cancel
```

This endpoint cancels the existing [order](./../glossary.md#orders).

❗ Rate limit 1000 requests/10 sec.

**Response is cached for:**
NONE

**Parameters:**

| Name    | Type   | Mandatory | Description                         |
| ------- | ------ | --------- | ----------------------------------- |
| market  | String | **Yes**   | Available market. Example: BTC_USDT |
| orderId | Int    | **Yes**   | Order Id. Example: 4180284841       |

**Request BODY raw:**

```json
{
  "market": "BTC_USDT",
  "orderId": 4180284841,
  "request": "{{request}}",
  "nonce": "{{nonce}}"
}
```

**Response:**

```json
{
  "amount": "0.001", // amount
  "dealFee": "0", // fee in money that you pay if order is finished
  "dealMoney": "0", // if order finished - amount in money currency that finished
  "dealStock": "0", // if order finished - amount in stock currency that finished
  "left": "0.001", // if order not finished - rest of amount that must be finished
  "makerFee": "0.001", // maker fee ratio. If the number less than 0.0001 - its rounded to zero
  "market": "BTC_USDT", // deal market
  "orderId": 4180284841, // order id
  "clientOrderId": "order1987111", // custom client order id; "clientOrderId": "" - if not specified.
  "price": "9800", // price
  "side": "buy", // order side
  "takerFee": "0.001", // maker fee ratio. If the number less than 0.0001 - its rounded to zero
  "timestamp": 1595792396.165973, // current timestamp
  "type": "limit" // order type
}
```

<details>
<summary><b>Errors:</b></summary>

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "market": ["The market field is required."],
    "orderId": ["The order id field is required."]
  }
}
```

```json
{
  "code": 2,
  "message": "Inner validation failed",
  "errors": {
    "order_id": ["Unexecuted order was not found."]
  }
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "market": ["Market is not available"]
  }
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "orderId": ["The order id must be an integer."]
  }
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "market": [
      "The market must be a string.",
      "The market format is invalid.",
      "Market is not available"
    ]
  }
}
```

</details>

---

### Query unexecuted(active) orders

#### This endpoint is deprecated. Use [V4 endpoint](./http-trade-v4#query-unexecutedactive-orders) instead

```
[POST] /api/v1/orders
```

This endpoint retrieves [unexecuted orders](./../glossary.md#active-orders) only.

❗ Rate limit 1000 requests/10 sec.

**Response is cached for:**
NONE

**Parameters:**

| Name   | Type   | Mandatory | Description                                                                                                                                                           |
| ------ | ------ | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| market | String | **Yes**   | Available market. Example: BTC_USDT                                                                                                                                   |
| limit  | Int    | **No**    | LIMIT is a special clause used to limit records a particular query can return. Default: 50, Min: 1, Max: 100                                                          |
| offset | Int    | **No**    | If you want the request to return entries starting from a particular line, you can use OFFSET clause to tell it where it should start. Default: 0, Min: 0, Max: 10000 |

**Request BODY raw:**

```json
{
  "market": "BTC_USDT",
  "offset": 0,
  "limit": 100,
  "request": "{{request}}",
  "nonce": "{{nonce}}"
}
```

**Response:**

```json
[
    {
        "orderId": 3686033640,            // unexecuted order ID
        "clientOrderId": "order1987111",  // custom client order id; "clientOrderId": "" - if not specified.
        "market": "BTC_USDT",             // currency market
        "side": "buy",                    // order side
        "type": "limit",                  // unexecuted order type
        "timestamp": 1594605801.49815,    // current timestamp of unexecuted order
        "dealMoney": "0",                 // executed amount in money
        "dealStock": "0",                 // executed amount in stock
        "amount": "2.241379",             // active order amount
        "takerFee": "0.001",              // taker fee ratio. If the number less than 0.0001 - its rounded to zero
        "makerFee": "0.001",              // maker fee ratio. If the number less than 0.0001 - its rounded to zero
        "left": "2.241379",               // unexecuted amount in stock
        "dealFee": "0",                   // executed fee by deal
        "price": "60000"                  // unexecuted order price
    },
    {...}
]

```

<details>
<summary><b>Errors:</b></summary>

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "market": ["The market field is required."]
  }
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "market": ["Market is not available"]
  }
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "limit": ["The limit must be an integer."],
    "offset": ["The offset must be an integer."]
  }
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "limit": ["The limit may not be greater than 100."],
    "offset": ["The offset may not be greater than 10000."]
  }
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "limit": ["The limit must be at least 1."],
    "offset": ["The offset must be at least 0."]
  }
}
```

</details>

---

### Query order history

#### This endpoint is deprecated. Use [V4 endpoint](./http-trade-v4#query-executed-orders) instead

```
[POST] /api/v1/account/order_history
```

This endpoint retrieves [orders](./../glossary.md#orders) history sorted by all markets

❗ Rate limit 1000 requests/10 sec.

**Response is cached for:**
NONE

**Parameters:**

| Name   | Type   | Mandatory | Description                                                                                                                                                           |
| ------ | ------ | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| market | String | **No**    | Requested available market. Example: BTC_USDT                                                                                                                         |
| limit  | Int    | **No**    | LIMIT is a special clause used to limit records a particular query can return. Default: 50, Min: 1, Max: 100                                                          |
| offset | Int    | **No**    | If you want the request to return entries starting from a particular line, you can use OFFSET clause to tell it where it should start. Default: 0, Min: 0, Max: 10000 |

**Request BODY raw:**

```json
{
  "offset": 0,
  "limit": 100,
  "request": "{{request}}",
  "nonce": "{{nonce}}"
}
```

**Response:**

```json
{
    "success": true,
    "message": "",
    "result": {
        "BTC_USDT": [
            {
                "amount": "0.70326019",           // executed order amount
                "price": "0",                     // executed order price, if executed order type is market it is equal to 0
                "type": "market",                 // executed order type
                "id": 3711942768,                 // executed order ID
                "clientOrderId": "order11-23-3",  // custom client order ID; "clientOrderId": "" - if not specified.
                "side": "sell",                   // executed order side
                "ctime": 1594667731.724387,       // executed order creating time
                "takerFee": "0.001",              // taker fee ratio. If the number less than 0.0001 - it is rounded to zero
                "ftime": 1594667731.724403,       // executed order finish time
                "makerFee": "0.001",              // maker fee ratio. If the number less than 0.0001 - its rounded to zero
                "dealFee": "0",                   // executed order fee that user pay
                "dealStock": "0.000076",          // executed order amount in stock
                "dealMoney": "0.70407996",        // executed order amount in money
                "marketName": "BTC_USDT",         // market name
                "status": 1                      // Order status: either 1 (finished) or 2 (canceled)
            }
        ],
        "DBTC_DUSDT": [
            {...}
        ],
        "ETH_USDT": [
            {...}
        ]
    }
}

```

<details>
<summary><b>Errors:</b></summary>

```json
{
  "success": false,
  "message": {
    "market": ["The market must be a string.", "The market format is invalid."]
  },
  "result": []
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "limit": ["The limit must be an integer."],
    "offset": ["The offset must be an integer."]
  }
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "limit": ["The limit may not be greater than 100."],
    "offset": ["The offset may not be greater than 10000."]
  }
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "limit": ["The limit must be at least 1."],
    "offset": ["The offset must be at least 0."]
  }
}
```

</details>

---

### Query executed order history by single market

#### This endpoint is deprecated. Use [V4 endpoint](./http-trade-v4#query-executed-order-history) instead

```
[POST] /api/v1/account/executed_history
```

This endpoint retrieves [deals](./../glossary.md#deal-trade) history sorted by single market

❗ Rate limit 1000 requests/10 sec.

**Response is cached for:**
NONE

**Parameters:**

| Name   | Type   | Mandatory | Description                                                                                                                                                           |
| ------ | ------ | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| market | String | **Yes**   | Requested available market. Example: BTC_USDT                                                                                                                         |
| limit  | Int    | **No**    | LIMIT is a special clause used to limit records that a particular query can return. Default: 50, Min: 1, Max: 100                                                     |
| offset | Int    | **No**    | If you want the request to return entries starting from a particular line, you can use OFFSET clause to tell it where it should start. Default: 0, Min: 0, Max: 10000 |

**Request BODY raw:**

```json
{
  "market": "BTC_USDT",
  "offset": 0,
  "limit": 100,
  "request": "{{request}}",
  "nonce": "{{nonce}}"
}
```

**Response:**

```json
{
    "success": true,
    "message": "",
    "result": [
        {
            "id": 160305483,                  // orderID
            "clientOrderId": "order1987111",  // custom client order id; "clientOrderId": "" - if not specified.
            "time": 1594667731.724403,        // Timestamp of executed order
            "side": "sell",                   // Order side "sell" / "buy"
            "role": 2,                        // Role - 1 - maker, 2 - taker
            "amount": "0.000076",             // amount in stock
            "price": "9264.21",               // price
            "deal": "0.70407996",             // amount in money
            "fee": "0.00070407996"            // fee that you pay
        },
        {...}
    ]
}


```

<details>
<summary><b>Errors:</b></summary>

```json
{
  "success": false,
  "message": {
    "market": ["The market must be a string.", "The market format is invalid."]
  },
  "result": []
}
```

```json
{
  "success": false,
  "message": {
    "market": ["The market field is required."]
  },
  "result": []
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "limit": ["The limit may not be greater than 100."],
    "offset": ["The offset may not be greater than 10000."]
  }
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "limit": ["The limit must be at least 1."],
    "offset": ["The offset must be at least 0."]
  }
}
```

</details>

---

### Query executed order history by all markets

#### This endpoint is deprecated. Use [V4 endpoint](./http-trade-v4#query-executed-order-history) instead

```
[POST] /api/v1/account/executed_history/all
```

This endpoint retrieves [orders](./../glossary.md#orders) history sorted by all markets.

❗ Rate limit 1000 requests/10 sec.

**Response is cached for:**
NONE

**Parameters:**

| Name   | Type | Mandatory | Description                                                                                                                                                           |
| ------ | ---- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| limit  | Int  | **No**    | LIMIT is a special clause used to limit records a particular query can return. Default: 50, Min: 1, Max: 100                                                          |
| offset | Int  | **No**    | If you want the request to return entries starting from a particular line, you can use OFFSET clause to tell it where it should start. Default: 0, Min: 0, Max: 10000 |

**Request BODY raw:**

```json
{
  "offset": 0,
  "limit": 100,
  "request": "{{request}}",
  "nonce": "{{nonce}}"
}
```

**Response:**

```json
{
    "success": true,
    "message": "",
    "result": {
        "BTC_USDT": [
            {
                "id": 160305483,                    // orderID
                "clientOrderId": "order1987111",    // custom client order id; "clientOrderId": "" - if not specified.
                "time": 1594667731.724403,          // Timestamp of executed order
                "side": "sell",                     // Order side "sell" / "buy"
                "role": 2,                          // Role - 1 - maker, 2 - taker
                "amount": "0.000076",               // amount in stock
                "price": "9264.21",                 // price
                "deal": "0.70407996",               // amount in money
                "fee": "0.00070407996"              // paid fee
            },
            {...},
        ],
        "DBTC_DUSDT": [
            {...}
        ]
    }
}


```

<details>
<summary><b>Errors:</b></summary>

```json
{
  "success": false,
  "message": {
    "market": ["The market must be a string.", "The market format is invalid."]
  },
  "result": []
}
```

```json
{
  "success": false,
  "message": {
    "market": ["The market field is required."]
  },
  "result": []
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "limit": ["The limit may not be greater than 100."],
    "offset": ["The offset may not be greater than 10000."]
  }
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "limit": ["The limit must be at least 1."],
    "offset": ["The offset must be at least 0."]
  }
}
```

</details>

---

### Query executed order deals

#### This endpoint is deprecated. Use [V4 endpoint](./http-trade-v4#query-executed-order-deals) instead

```
[POST] /api/v1/account/order
```

This endpoint retrieves more details on [order](./../glossary.md#orders) deals history.

❗ Rate limit 1000 requests/10 sec.

**Response is cached for:**
NONE

**Parameters:**

| Name    | Type | Mandatory | Description                                                                                                                                                           |
| ------- | ---- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| orderId | Int  | **Yes**   | Order ID. Example: 1234                                                                                                                                               |
| limit   | Int  | **No**    | LIMIT is a special clause used to limit records a particular query can return. Default: 50, Min: 1, Max: 100                                                          |
| offset  | Int  | **No**    | If you want the request to return entries starting from a particular line, you can use OFFSET clause to tell it where it should start. Default: 0, Min: 0, Max: 10000 |

**Request BODY raw:**

```json
{
  "orderId": 3135554375,
  "offset": 0,
  "limit": 100,
  "request": "{{request}}",
  "nonce": "{{nonce}}"
}
```

**Response:**

Empty response if order is not yours

```json
{
  "success": true,
  "message": "",
  "result": {
    "limit": 50,
    "offset": 0,
    "records": [
      {
        "id": 149156519, // id of trade
        "clientOrderId": "order1987111", // custom client order id; "clientOrderId": "" - if not specified.
        "amount": "598", // amount in stock
        "time": 1593342324.613711, // Timestamp of executed order
        "dealOrderId": 3134995325, // completed order ID
        "role": 2, // Role - 1 - maker, 2 - taker
        "deal": "0.00419198", // amount in money
        "price": "0.00000701", // price
        "fee": "0.00000419198" // paid fee
      }
    ]
  }
}
```

<details>
<summary><b>Errors:</b></summary>

```json
{
  "success": false,
  "message": {
    "orderId": ["The order id field is required."]
  },
  "result": []
}
```

```json
{
  "success": false,
  "message": {
    "orderId": ["The order id must be an integer."]
  },
  "result": []
}
```

```json
{
  "success": false,
  "message": {
    "limit": ["The limit may not be greater than 100."],
    "offset": ["The offset may not be greater than 10000."]
  },
  "result": []
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "limit": ["The limit must be at least 1."],
    "offset": ["The offset must be at least 0."]
  }
}
```

</details>

---
