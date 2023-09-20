# Private WebSocket API

- [Websocket token](#websocket-token)
- [Authorize](#authorize)
- [Balance Spot](#balance-spot)
- [Balance Margin](#balance-margin)
- [Orders Pending](#orders-pending)
- [Orders Executed](#orders-executed)
- [Deals](#deals)

WebSocket endpoint is wss://api.whitebit.com/ws

The API is based on [JSON RPC](https://www.jsonrpc.org/specification) of WebSocket protocol.

⚠️ Connection will be closed by server in cause of inactivity after 30s.

❗ Rate limit 1000 ws connections per minute and 200 requests per minute in one connection.

All endpoints return time in Unix-time format.

## Order types

| Order type ID | Description |
|------|-----|
| 1 | Limit |
| 2 | Market |
| 202 | Market [stock](./../glossary.md#stock) |
| 3 | Stop limit |
| 4 | Stop market |
| 7 | Margin limit |
| 8 | Margin market |
| 9 | Margin stop limit |
| 10 | Margin trigger-stop market |
| 14 | Margin normalization |

## ⤴️ Request message

JSON Structure of request message:

* `id` - **Integer**. Should be unique to handle response for your request.
* `method` - **String**. Name of request.
* `params` - **Array**. Here you pass params for method.

🚫 WebSocket connection will be closed if invalid JSON was sent.

### Types of request messages

* Query (`balanceSpot_request`, `ordersPending_request`, etc)
* Subscription (`balanceSpot_subscribe`, `ordersPending_subscribe`, etc). Repeated subscription will be cancelled for the same data type.

## ⤵️ Response message

JSON Structure of response message:

* `id` - **Integer**. Request ID.
* `result` - **Null** for failure, for success - look for responses below
* `error` - **Null** for success, **JSON Object** for failure:
    * `message` - Detailed text
    * `code` - Error code

Code | Message
--- | ---
**1** | invalid argument
**2** | internal error
**3** | service unavailable
**4** | method not found
**5** | service timeout

## Types of response messages

* Query result
* Subscription status (success/failed)
* Update events

---

## Examples

**Example** messages for request with response:

#### ⤴️ Request:

```json
{
    "id": 0,
    "method": "authorize",
    "params": [
        "<get_your_token_via_api>",
        ""
    ]
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

**Example** subscription:

#### ⤴️ Request:

```json
{
    "id": 0,
    "method": "balanceSpot_subscribe",
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
    "method": "balanceSpot_update",
    "params": [] // look below for params
}
```

---

## API

### Websocket token

```
[POST] /api/v4/profile/websocket_token
```
This V4 endpoint can be used to retrieve the websocket token for user.

**Request BODY raw:**
```json
{
    "request": "{{request}}",
    "nonce": "{{nonce}}"
}
```

**Response:**

Available statuses:
* `Status 200`

```json
{
    "websocket_token": "your_current_token"
}
```
___

### Authorize

When you establish WS connection, you should authorize this ws connection via `authorize` method.
After successful authorization you will be able to send requests for balances, [orders](./../glossary.md#orders) etc.

It only needs to be done successfully once.

##### ⤴️ Request:

```json
{
    "id": 0,
    "method": "authorize",
    "params": [
        "<get_your_token_via_api>", // WebSocket Token,
        "public"                    // constant string, always should be "public"
    ]
}
```

##### ⤵️ Response:

```json
{
    "id": 0,
    "result": {
        "status": "success"
    },
    "error": null
}
```

---

### Balance Spot

#### Query

##### ⤴️ Request:

```json
{
    "id": 2,
    "method": "balanceSpot_request",
    "params": [
        "ETH",  // asset
        "BTC",  // asset
        ...
    ]
}
```

##### ⤵️ Response:

```json
{
    "id": 2,
    "result": {
        "ETH": {
            "available": "0", // Amount available for trade
            "freeze": "0"     // Amount in active orders
        },
        "BTC": {
            "available": "0", // Amount available for trade
            "freeze": "0"     // Amount in active orders
        }
    },
    "error": null
}
```

#### Subscribe

Subscribe to receive updates in [spot balances](./../glossary.md#balance-spotbalance-trade).

##### ⤴️ Request:

```json
{
    "id": 3,
    "method": "balanceSpot_subscribe",
    "params": [
        "USDT", // asset
        "ETH",  // asset
        ...
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
    "method": "balanceSpot_update",
    "params": [
        {
            "USDT": {
                "available": "100.1885", // Amount available for trade
                "freeze": "0"            // Amount in active orders
            }
        },
        ...
    ]
}
```

#### Unsubscribe

##### ⤴️ Request:

```json
{
    "id": 4,
    "method": "balanceSpot_unsubscribe",
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

### Balance Margin

#### Query

Request for amount on margin balance.
Balance available for [margin trade](./../glossary.md#margin-trading) is equal to `balance * leverage` and it depends on liquidity in [orderbook](./../glossary.md#order-book) and your open positions.
When you open position, your balance will not change, but amount available for [trade](./../glossary.md#deal-trade) will decrease

##### ⤴️ Request:

```json
{
    "id": 2,
    "method": "balanceMargin_request",
    "params": [
        "BTC",  // asset
        "USDT"  // asset
    ]
}
```

##### ⤵️ Response:

```json
{
    "error": null,
    "result": {
        "BTC": {
            "balance": "0.0006092",                   // total amount on collateral balance
            "borrow": "0",                            // borrowed amount
            "available_without_borrow": "0.0006092",  // available amount to transfer from collateral balance without borrowing
            "available_with_borrow": "0.00288701"     // available amount to transfer  from collateral balance with borrowing
        },
        "USDT": {
            "balance": "0.00538073",                  // total amount on collateral balance
            "borrow": "0",                            // borrowed amount
            "available_without_borrow": "0.00538073", // available amount to transfer from collateral balance without borrowing
            "available_with_borrow": "28.43739825"    // available amount to transfer  from collateral balance with borrowing
        }
    },
    "id": 1
}
```

#### Subscribe

Subscribe to receive updates in [spot balances](./../glossary.md#balance-spotbalance-trade).

##### ⤴️ Request:

```json
{
    "id": 3,
    "method": "balanceMargin_subscribe",
    "params": [
        "BTC",  // asset
        "USDT"  // asset
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
    "method": "balanceMargin_update",
    "params": [
        {
            "a": "BTC",         // asset ticker
            "B": "0.0006092",   // total amount on collateral balance
            "b": "0",           // borrowed amount
            "av": "0.0006092",  // available amount to transfer from collateral balance without borrowing
            "ab": "0.00288701"  // available amount to transfer  from collateral balance with borrowing
        },
        {
            "a": "USDT",        // asset ticker
            "B": "0.00538073",  // total amount on collateral balance
            "b": "0",           // borrowed amount
            "av": "0.00538073", // available amount to transfer from collateral balance without borrowing
            "ab": "28.43739825" // available amount to transfer  from collateral balance with borrowing
        }
    ],
    "id": null
}
```

#### Unsubscribe

##### ⤴️ Request:

```json
{
    "id": 4,
    "method": "balanceMargin_unsubscribe",
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

### Orders Pending

#### Query

##### ⤴️ Request:

[Market](./../glossary.md#market) should exist. The maximum limit is 100.

```json
{
    "id": 8,
    "method": "ordersPending_request",
    "params": [
        "BTC_USDT", // market
        0,          // offset
        30          // limit
    ]
}
```

##### ⤵️ Response:

All possible [order types](#order-types)

```json
{
    "id": 8,
    "result": {
        "limit": 100,                       // Limit from request
        "offset": 0,                        // Offset from request
        "total": 124,                       // Total count of records
        "records": [
            {
                "id": 6880290,              // Order ID
                "market": "BTC_USDT",       // Market
                "type": 1,                  // Order type. All types in table above
                "side": 1,                  // Side 1 - sell, 2 - bid
                "post_only": true,          // Post only flag
                "ctime": 1601464682.998461, // Created at in Unix time
                "mtime": 1601464682.998461, // Modified at in Unix time
                "price": "10900",           // Order price
                "amount": "0.773232",       // Stock amount
                "left": "0.773232",         // Stock amount that left to be executed
                "deal_stock": "0",          // Stock amount that executed
                "deal_money": "0",          // Money amount that executed
                "deal_fee": "0",            // Charged fee amount in money,
                "client_order_id": "22"     // Custom client order id
            },
            ...
        ]
    },
    "error": null
}
```

#### Subscribe

##### ⤴️ Request:

```json
{
    "id": 9,
    "method": "ordersPending_subscribe",
    "params": [
        "BTC_USDT", // market
        "ETH_BTC"  // market
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

| Update event ID | Description |
| --- | --- |
| 1 | New order |
| 2 | Update order |
| 3 | Finish order (cancel or execute) |

If new [order](./../glossary.md#orders) instantly matches an order from [orderbook](./../glossary.md#order-book), then you will receive only one message with update event ID equal to 3.

```json
{
    "id": null,
    "method": "ordersPending_update",
    "params": [
        2,                               // Update event ID (see above)
        {
            "id": 621879,                // Order ID
            "market": "BTC_USDT",        // Market
            "type": 1,                   // Order type. All types in table above
            "side": 1,                   // Side 1 - sell, 2 - bid
            "ctime": 1601475234.656275,  // Created at in Unix time
            "mtime": 1601475266.733574,  // Modified at in Unix time
            "price": "10646.12",         // Order price
            "amount": "0.01",            // Stock amount
            "left": "0.008026",          // Stock amount that left to be executed.
            "deal_stock": "0.001974",    // Stock amount that executed
            "deal_money": "21.01544088", // Money amount that executed
            "deal_fee": "2.101544088",   // Charged fee amount in money,
            "client_order_id": "22"      // Custom client order id
        }
    ]
}
```

#### Unsubscribe

##### ⤴️ Request:

```json
{
    "id": 10,
    "method": "ordersPending_unsubscribe",
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

### Orders Executed

#### Query

##### ⤴️ Request:

Market should exist. The maximum limit is 100.
All possible [order types](#order-types)

```json
{
    "id": 11,
    "method": "ordersExecuted_request",
    "params": [
        {
            "market": "BTC_USDT", // market
            "order_types": [1, 2]   // Order types filter. See above
        },
        0,                          // offset
        30                          // limit
    ]
}
```

##### ⤵️ Response:

All possible [order types](#order-types)

```json
{
    "id": 11,
    "result": {
        "limit": 100,
        "offset": 0,
        "total": 124,
        "records": [
            {
                "id": 3848860,                // Order ID
                "ctime": 1594999374.147639,   // Created at in Unix time
                "ftime": 1594999817.987435,   // Finished at in Unix time
                "market": "BTC_USDT",         // Market
                "type": 1,                    // Order type. All types in table above
                "side": 2,                    // Side 1 - sell, 2 - bid
                "status": 1,                  // Status 1 - finished, 2 - cancelled
                "post_only": true,            // Post only flag
                "price": "9157.95",           // Order price
                "amount": "0.633232",         // Stock amount
                "deal_stock": "0.633232",     // Stock amount that executed
                "deal_money": "5799.1069944", // Money amount that executed
                "deal_fee": "5.7991069944",   // Charged fee amount in money,
                "client_order_id": "-a-a-a"   // Custom client order id
            },
            ...
        ]
    },
    "error": null
}
```

#### Subscribe

##### ⤴️ Request:

```json
{
    "id": 12,
    "method": "ordersExecuted_subscribe",
    "params": [
        [
            "BTC_USDT", // market
            "ETH_BTC"   // market
        ],
        0               // filter executed limit or market orders
    ]
}
```

| Filter | Executed orders |
| --- | --- |
| 0 | Limit and Market |
| 1 | Limit |
| 2 | Market |

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
    "method": "ordersExecuted_update",
    "params": [
        {
            "id": 6887337167,           // Order ID
            "market": "BTC_USDT",       // Market
            "type": 1,                  // Order type. All types in table above
            "side": 1,                  // Side 1 - sell, 2 - bid
            "ctime": 1601478710.197908, // Created at in Unix time
            "mtime": 1601478710.197917, // Modified at in Unix time
            "price": "10745.42",        // Order price
            "amount": "0.001",          // Stock amount
            "left": "0",                // Stock amount that left to be executed.
            "deal_stock": "0.001",      // Stock amount that executed
            "deal_money": "10.74563",   // Money amount that executed
            "deal_fee": "0.01074563"    // Charged fee amount in money
        }
    ]
}
```

#### Unsubscribe

##### ⤴️ Request:

```json
{
    "id": 13,
    "method": "ordersExecuted_unsubscribe",
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

---

### Deals

#### Query

##### ⤴️ Request:

Market should exist. The maximum limit is 100.

```json
{
    "id": 14,
    "method": "deals_request",
    "params": [
        "BTC_USDT", // market
        0,          // offset
        30          // limit
    ]
}
```

##### ⤵️ Response:

```json
{
    "id": 14,
    "result": {
        "limit": 100,
        "offset": 0,
        "total": 124,
        "records": [
            {
                "time": 1602760519.688911,   // Deal time
                "id": 251923106,             // Deal ID
                "side": 1,                   // Side 1 - sell, 2 - bid
                "role": 2,                   // Your role. 1 - maker, 2 - taker
                "price": "11303.76",         // Deal price
                "amount": "0.001",           // Stock amount
                "deal": "11.30376",          // Money amount
                "fee": "0.01130376",         // Deal fee in money
                "market": "BTC_USDT",        // Market
                "deal_order_id": 7421295951  // Order ID
            },
            ...
        ]
    },
    "error": null
}
```

#### Subscribe

Update interval: 0,5 sec

##### ⤴️ Request:

```json
{
    "id": 15,
    "method": "deals_subscribe",
    "params": [
        [
            "BTC_USDT", // market
            "ETH_BTC"   // market
        ]
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
    "method": "deals_update",
    "params": [
        252104486,         // Deal ID
        1602770801.015587, // Deal time
        "BTC_USDT",        // Market
        7425988844,        // Order ID
        "11399.24",        // Price
        "0.008256",        // Stock amount
        "0.094112125440",  // Deal fee
        "1234",            // Custom client order id
        1                  // Side 1 - sell, 2 - bid
    ]
}
```

#### Unsubscribe

##### ⤴️ Request:

```json
{
    "id": 16,
    "method": "deals_unsubscribe",
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
