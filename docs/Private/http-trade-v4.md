# Private HTTP API V4

## Private endpoints V4 for trading

* Spot
  * [Trading balance](#trading-balance)
  * [Create limit order](#create-limit-order)
  * [Create market order](#create-market-order)
  * [Create buy stock market order](#create-stock-market-order)
  * [Create stop-limit order](#create-stop-limit-order)
  * [Create stop-market order](#create-stop-market-order)
  * [Cancel order](#cancel-order)
  * [Query unexecuted orders](#query-unexecutedactive-orders)
  * [Query executed order history](#query-executed-order-history)
  * [Query executed order deals](#query-executed-order-deals)
  * [Query executed orders by market](#query-executed-orders-by-market)
* Collateral
  * [Collateral Account Balance](#collateral-account-balance)
  * [Collateral Limit Order](#collateral-limit-order)
  * [Collateral Market Order](#collateral-market-order)
  * [Collateral Trigger Market Order](#collateral-market-order)
  * [Collateral Account Summary](#collateral-account-summary)
  * [Open Positions](#open-positions)
  * [Position History](#positions-history)
  * [Change Collateral Account Leverage](#change-collateral-account-leverage)

    
Base URL is https://whitebit.com

Endpoint example: https://whitebit.com/api/v4/{endpoint}

All endpoints return time in Unix-time format.

All endpoints return either a __JSON__ object or array.

For receiving responses from API calls please use http method __POST__

#### Error messages V4 format:
___
```json5
{
    "code": 0,
    "message": "MESSAGE",
    "errors": {
        "PARAM1": [
            "MESSAGE"
        ],
        "PARAM2": [
            "MESSAGE"
        ]
    }
}
```
___
### Terminology

#### Pair:

`Stock` - currency that you want to buy or sell

`Money` - currency that you are using to buy or sell something

`Maker` - person who puts an order and waiting till this order will be finished

`Taker` - person who finishes existing order

`Precision` - is the number of digits to the right of the decimal point

`Bid` - buy order

`Ask` - sell order

`Limit order` - to place this order, you need to fill in the 'Price' and 'Amount' fields. If this order finds a corresponding order on the opposite side, it will be executed. Otherwise it will be placed into the orderbook.

`Market order` - to place this order, you need to fill 'Amount' field using **Money** value. This order finds a corresponding order on the opposite side and executes. Otherwise it will be cancelled.

`Stock market order` - to place this order, you need to fill 'Amount' field using **Stock** value. This order finds a corresponding order on the opposite side and executes. Otherwise it will be cancelled.
___

## Spot

### Trading balance

```
[POST] /api/v4/trade-account/balance
```
This endpoint retrieves the trade balance by currency ticker or all balances.

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
ticker | String | **No** | Currency's ticker. Example: BTC

**Request BODY raw:**
```json5
{
    "request": "{{request}}",
    "nonce": "{{nonce}}"
}
```

**Response:**


Available statuses:
* `Status 200`
* `Status 422 if request validation failed`
* `Status 400 if inner validation failed`
* `Status 503 if service temporary unavailable`

```json5
{
    "...": {...},
    "BTC": {
        "available": "0.123",      // Available balance of currency for trading
        "freeze": "1"              // Balance of currency that is currently in active orders
    },
    "...": {...},
    "XMR": {
        "available": "3013",
        "freeze": "100"
    },
    "...": {...}
}
```

<details>
<summary><b>Errors:</b></summary>

```json5
{
    "code": 30,
    "message": "Validation failed",
    "errors": {
        "ticker": [
            "Ticker field should be a string."
        ]
    }
}
```

```json5
{
    "code": 30,
    "message": "Validation failed",
    "errors": {
        "ticker": [
            "Currency was not found."
        ]
    }
}
```

```json5
{
    "code": 1,
    "message": "Inner validation failed",
    "errors": {
        "amount": [
            "Invalid argument."
        ]
    }
}
```
</details>
___

### Create limit order

```
[POST] /api/v4/order/new
```
This endpoint creates limit trading order.

**Parameters:**

Name | Type          | Mandatory | Description
------------ |---------------| ------------ | ------------
market | String        | **Yes** | Available market. Example: BTC_USDT
side | String        | **Yes** | Order type. Variables: 'buy' / 'sell' Example: 'buy'
amount | String/Number | **Yes** | Amount of stock currency to buy or sell. Example: '0.001' or 0.001
price | String/Number        | **Yes** | Price in money currency. Example: '9800' or 9800
clientOrderId | String        | **No** | Identifier should be unique and contain letters, dashes or numbers only. The identifier must be unique for the next 24 hours.

**Request BODY raw:**
```json5
{
    "market": "BTC_USDT",
    "side": "buy",
    "amount": "0.01",
    "price": "40000",
    "clientOrderId": "order1987111",
    "request": "{{request}}",
    "nonce": "{{nonce}}"
}
```

**Response:**
Available statuses:
* `Status 200`
* `Status 400 if inner validation failed`
* `Status 422 if request validation failed`
* `Status 503 if service temporary unavailable`

```json5
{
    "orderId": 4180284841,             // order id
    "clientOrderId": "order1987111",   // custom client order id; "clientOrderId": "" - if not specified.
    "market": "BTC_USDT",              // deal market
    "side": "buy",                     // order side
    "type": "limit",                   // order type
    "timestamp": 1595792396.165973,    // current timestamp
    "dealMoney": "0",                  // if order finished - amount in money currency that is finished
    "dealStock": "0",                  // if order finished - amount in stock currency that is finished
    "amount": "0.01",                  // amount
    "takerFee": "0.001",               // maker fee ratio. If the number less than 0.0001 - it will be rounded to zero
    "makerFee": "0.001",               // maker fee ratio. If the number less than 0.0001 - it will be rounded to zero
    "left": "0.001",                   // if order not finished - rest of the amount that must be finished
    "dealFee": "0",                    // fee in money that you pay if order is finished
    "price": "40000"                   // price
}
```
<details>
<summary><b>Errors:</b></summary>

Error codes:
* `30` - default validation error code
* `31` - market validation failed
* `32` - amount validation failed
* `33` - price validation failed
* `34` - incorrect taker fee (it is less than zero or its precision is too big)
* `35` - incorrect maker fee (it is less than zero or its precision is too big)
* `36` - clientOrderId validation failed

```json5
{
    "code": 30,
    "message": "Validation failed",
    "errors": {
        "amount": [
            "Amount field is required."
        ],
        "market": [
            "Market field is required."
        ],
        "price": [
            "Price field is required."
        ],
        "side": [
            "Side field is required."
        ]
    }
}
```

```json5
{
    "code": 30,
    "message": "Validation failed",
    "errors": {
        "side": [
            "Side field should contain only 'buy' or 'sell' values."
        ]
    }
}
```

```json5
{
    "code": 32,
    "message": "Validation failed",
    "errors": {
        "amount": [
            "Amount field should be numeric string or number."
        ]
    }
}
```

```json5
{
    "code": 33,
    "message": "Validation failed",
    "errors": {
        "price": [
            "Price field should be numeric string or number."
        ]
    }
}
```

```json5
{
    "code": 31,
    "message": "Validation failed",
    "errors": {
        "market": [
            "Market is not available."
        ]
    }
}
```

```json5
{
    "code": 32,
    "message": "Validation failed",
    "errors": {
        "amount": [
            "Given amount is less than min amount 0.001",
            "Min amount step = 0.000001"
        ]
    }
}

```

```json5
{
    "code": 36,
    "message": "Validation failed",
    "errors": {
        "clientOrderId": [
            "ClientOrderId field should be a string."
        ]
    }
}

```

```json5
{
    "code": 36,
    "message": "Validation failed",
    "errors": {
        "clientOrderId": [
            "ClientOrderId field field should contain only latin letters, numbers and dashes."
        ]
    }
}

```

```json5
{
    "code": 36,
    "message": "Validation failed",
    "errors": {
        "clientOrderId": [
            "This client order id is already used by the current account. It will become available in 24 hours (86400 seconds)."
        ]
    }
}
```

```json5
{
    "code": 30,
    "message": "Validation failed",
    "errors": {
        "total": [
            "Total(amount * price) is less than 5.05"
        ]
    }
}
```

```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "amount": [
            "Min amount step = 0.01"         // money/stock precision is not taken into consideration when order was submitted
        ]
    }
}

```

```json5
{
  "code": 33,
  "message": "Validation failed",
  "errors": {
    "price": [
      "Price field should be at least 10",
      "Min price step = 0.000001"
    ]
  }
}
```

```json5
{
  "code": 33,
  "message": "Validation failed",
  "errors": {
    "price": [
      "Price should be greater than 0."
    ]
  }
}
```

```json5
{
  "code": 34,
  "message": "Validation failed",
  "errors": {
    "taker_fee": [
      "Incorrect taker fee"
    ]
  }
}
```

```json5
{
  "code": 35,
  "message": "Validation failed",
  "errors": {
    "maker_fee": [
      "Incorrect maker fee"
    ]
  }
}
```


```json5
{
    "code": 10,
    "message": "Inner validation failed",
    "errors": {
        "amount": [
            "Not enough balance."
        ]
    }
}
```

```json5
{
    "code": 1,
    "message": "Inner validation failed",
    "errors": {
        "amount": [
            "Invalid argument."
        ]
    }
}
```

```json5
{
    "code": 11,
    "message": "Inner validation failed",
    "errors": {
        "amount": [
            "Amount too small."
        ]
    }
}
```

</details>

___

### Create market order

```
[POST] /api/v4/order/market
```
This endpoint creates market trading order.

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
market | String | **Yes** | Available market. Example: BTC_USDT
side | String | **Yes** | Order type. Variables: 'buy' / 'sell' Example: 'buy'
amount | String/Number | **Yes** | ⚠️ Amount of money currency to buy or amount in stock currency to sell. Example: '5 USDT' for buy (min total) and '0.001 BTC' for sell (min amount).
clientOrderId | String | **No** | Identifier should be unique and contain letters, dashes or numbers only. The identifier must be unique for the next 24 hours.

**Request BODY raw:**
```json5
{
    "market": "BTC_USDT",
    "side": "buy",
    "amount": "50",             // I want to buy BTC for 50 USDT
    "clientOrderId": "order1987111",
    "request": "{{request}}",
    "nonce": "{{nonce}}"
}
```

```json5
{
    "market": "BTC_USDT",
    "side": "sell",
    "amount": "0.01",              // I want to sell 0.01 BTC
    "clientOrderId": "order1987111",
    "request": "{{request}}",
    "nonce": "{{nonce}}"
}
```

**Response:**
Available statuses:
* `Status 200`
* `Status 400 if inner validation failed`
* `Status 422 if request validation failed`
* `Status 503 if service temporary unavailable`

```json5
{
    "orderId": 4180284841,             // order id
    "clientOrderId": "order1987111",   // custom client order id; "clientOrderId": "" - if not specified.
    "market": "BTC_USDT",              // deal market
    "side": "buy",                     // order side
    "type": "market",                  // order type
    "timestamp": 1595792396.165973,    // current timestamp
    "dealMoney": "0",                  // amount in money currency that finished
    "dealStock": "0",                  // amount in stock currency that finished
    "amount": "0.001",                 // amount
    "takerFee": "0.001",               // maker fee ratio. If the number less than 0.0001 - its rounded to zero
    "makerFee": "0.001",               // maker fee ratio. If the number less than 0.0001 - its rounded to zero
    "left": "0.001",                   // rest of amount that must be finished
    "dealFee": "0"                     // fee in money that you pay if order is finished
}
```
<details>
<summary><b>Errors:</b></summary>

Error codes:
* `30` - default validation error code
* `31` - market validation failed
* `32` - amount validation failed
* `34` - incorrect taker fee (it is less than zero or its precision is too big)
* `36` - clientOrderId validation failed

```json5
{
    "code": 30,
    "message": "Validation failed",
    "errors": {
        "amount": [
            "Amount field is required."
        ],
        "market": [
            "Market field is required."
        ],
        "side": [
            "Side field is required."
        ]
    }
}
```

```json5
{
  "code": 30,
  "message": "Validation failed",
  "errors": {
    "side": [
      "Side field should contain only 'buy' or 'sell' values."
    ]
  }
}
```

```json5
{
    "code": 32,
    "message": "Validation failed",
    "errors": {
        "amount": [
            "Amount field should be numeric string or number."
        ]
    }
}
```

```json5
{
    "code": 31,
    "message": "Validation failed",
    "errors": {
        "market": [
            "Market is not available."
        ]
    }
}
```

```json5
{
    "code": 32,
    "message": "Validation failed",
    "errors": {
        "amount": [
            "Not enough balance."
        ]
    }
}

```

```json5
{
    "code": 32,
    "message": "Validation failed",
    "errors": {
        "amount": [
            "Given amount is less than min amount 0.001",
            "Min amount step = 0.000001"
        ]
    }
}

```

```json5
{
    "code": 36,
    "message": "Validation failed",
    "errors": {
        "clientOrderId": [
            "ClientOrderId field should be a string."
        ]
    }
}

```

```json5
{
    "code": 36,
    "message": "Validation failed",
    "errors": {
        "clientOrderId": [
            "ClientOrderId field field should contain only latin letters, numbers and dashes."
        ]
    }
}

```

```json5
{
    "code": 36,
    "message": "Validation failed",
    "errors": {
        "clientOrderId": [
            "This client order id is already used by the current account. It will become available in 24 hours (86400 seconds)."
        ]
    }
}

```

```json5
{
    "code": 32,
    "message": "Validation failed",
    "errors": {
        "amount": [
            "Total amount + fee should be no less than"
        ]
    }
}

```

```json5
{
  "code": 32,
  "message": "Validation failed",
  "errors": {
    "amount": [
      "Min total step = = 0.000001"
    ]
  }
}

```

```json5
{
  "code": 32,
  "message": "Validation failed",
  "errors": {
    "amount": [
      "Amount should be greater than 0."
    ]
  }
}

```

```json5
{
  "code": 34,
  "message": "Validation failed",
  "errors": {
    "taker_fee": [
      "Incorrect taker fee"
    ]
  }
}

```

```json5
{
    "code": 10,
    "message": "Inner validation failed",
    "errors": {
        "amount": [
            "Not enough balance."
        ]
    }
}

```

```json5
{
    "code": 1,
    "message": "Inner validation failed",
    "errors": {
        "amount": [
            "Invalid argument."
        ]
    }
}

```

```json5
{
    "code": 11,
    "message": "Inner validation failed",
    "errors": {
        "amount": [
            "Amount too small."
        ]
    }
}

```
</details>

___

### Create stock market order

```
[POST] /api/v4/order/stock_market
```
This endpoint creates buy stock market trading order.

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
market | String | **Yes** | Available market. Example: BTC_USDT
side | String | **Yes** | Order type. Available variables: "buy", "sell"
amount | String/Number | **Yes** | ⚠️ Amount in stock currency for buy or sell. Example: "0.0001" or 0.0001.
clientOrderId | String | **No** | Identifier should be unique and contain letters, dashes or numbers only. The identifier must be unique for the next 24 hours.

**Request BODY raw:**
```json5
{
    "market": "BTC_USDT",
    "side": "buy",
    "amount": "0.001",             // I want to buy 0.001 BTC
    "clientOrderId": "order1987111",
    "request": "{{request}}",
    "nonce": "{{nonce}}"
}
```

**Response:**
Available statuses:
* `Status 200`
* `Status 400 if inner validation failed`
* `Status 422 if request validation failed`
* `Status 503 if service temporary unavailable`

```json5
{
    "orderId": 4180284841,             // order id
    "clientOrderId": "order1987111",   // custom client order id; "clientOrderId": "" - if not specified.
    "market": "BTC_USDT",              // deal market
    "side": "buy",                     // order side
    "type": "stock market",            // order type
    "timestamp": 1595792396.165973,    // current timestamp
    "dealMoney": "0",                  // amount in money currency that finished
    "dealStock": "0",                  // amount in stock currency that finished
    "amount": "0.001",                 // amount
    "takerFee": "0.001",               // maker fee ratio. If the number less than 0.0001 - its rounded to zero
    "makerFee": "0.001",               // maker fee ratio. If the number less than 0.0001 - its rounded to zero
    "left": "0.001",                   // rest of amount that must be finished
    "dealFee": "0"                     // fee in money that you pay if order is finished
}
```
<details>
<summary><b>Errors:</b></summary>

Error codes:
* `30` - default validation error code
* `31` - market validation failed
* `32` - amount validation failed
* `34` - incorrect taker fee (it is less than zero or its precision is too big)
* `36` - clientOrderId validation failed

```json5
{
    "code": 30,
    "message": "Validation failed",
    "errors": {
        "amount": [
            "Amount field is required."
        ],
        "market": [
            "Market field is required."
        ],
        "side": [
            "Side field is required."
        ]
    }
}
```

```json5
{
  "code": 30,
  "message": "Validation failed",
  "errors": {
    "side": [
      "Side field should contain only 'buy' or 'sell' values."
    ]
  }
}
```

```json5
{
    "code": 32,
    "message": "Validation failed",
    "errors": {
        "amount": [
            "Amount field should be numeric string or number."
        ]
    }
}
```

```json5
{
    "code": 31,
    "message": "Validation failed",
    "errors": {
        "market": [
            "Market is not available."
        ]
    }
}
```

```json5
{
    "code": 32,
    "message": "Validation failed",
    "errors": {
        "amount": [
            "Not enough balance."
        ]
    }
}

```

```json5
{
    "code": 32,
    "message": "Validation failed",
    "errors": {
        "amount": [
            "Given amount is less than min amount 0.001",
            "Min amount step = 0.000001"
        ]
    }
}

```

```json5
{
    "code": 36,
    "message": "Validation failed",
    "errors": {
        "clientOrderId": [
            "ClientOrderId field should be a string."
        ]
    }
}

```

```json5
{
    "code": 36,
    "message": "Validation failed",
    "errors": {
        "clientOrderId": [
            "ClientOrderId field field should contain only latin letters, numbers and dashes."
        ]
    }
}

```

```json5
{
    "code": 36,
    "message": "Validation failed",
    "errors": {
        "clientOrderId": [
            "This client order id is already used by the current account. It will become available in 24 hours (86400 seconds)."
        ]
    }
}

```

```json5
{
  "code": 32,
  "message": "Validation failed",
  "errors": {
    "amount": [
      "Amount should be greater than 0."
    ]
  }
}

```

```json5
{
  "code": 34,
  "message": "Validation failed",
  "errors": {
    "taker_fee": [
      "Incorrect taker fee"
    ]
  }
}

```

```json5
{
    "code": 10,
    "message": "Inner validation failed",
    "errors": {
        "amount": [
            "Not enough balance."
        ]
    }
}

```

```json5
{
    "code": 1,
    "message": "Inner validation failed",
    "errors": {
        "amount": [
            "Invalid argument."
        ]
    }
}

```

```json5
{
  "code": 11,
  "message": "Inner validation failed",
  "errors": {
    "amount": [
      "Amount too small."
    ]
  }
}

```
</details>

___

### Create stop-limit order

```
[POST] /api/v4/order/stop_limit
```
This endpoint creates stop-limit trading order

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
market | String | **Yes** | Available market. Example: BTC_USDT
side | String | **Yes** | Order type. Variables: 'buy' / 'sell' Example: 'buy'
amount | String/Number | **Yes** | Amount of stock currency to buy or sell. Example: '0.001' or 0.001
price | String/Number | **Yes** | Price in money currency. Example: '9800' or 9800
activation_price | String/Number | **Yes** | Activation price in money currency. Example: '10000' or 10000
clientOrderId | String | **No** | Identifier should be unique and contain letters, dashes or numbers only. The identifier must be unique for the next 24 hours.

**Request BODY raw:**
```json5
{
    "market": "BTC_USDT",
    "side": "buy",
    "amount": "0.001",
    "price": "40000",
    "activation_price": "40000",
    "clientOrderId": "order1987111",
    "request": "{{request}}",
    "nonce": "{{nonce}}"
}
```

**Response:**
Available statuses:
* `Status 200`
* `Status 400 if inner validation failed`
* `Status 422 if request validation failed`
* `Status 503 if service temporary unavailable`

```json5
{
    "orderId": 4180284841,             // order id
    "clientOrderId": "order1987111",   // custom client order id; "clientOrderId": "" - if not specified.
    "market": "BTC_USDT",              // deal market
    "side": "buy",                     // order side
    "type": "stop limit",              // order type
    "timestamp": 1595792396.165973,    // current timestamp
    "dealMoney": "0",                  // if order finished - amount in money currency that finished
    "dealStock": "0",                  // if order finished - amount in stock currency that finished
    "amount": "0.001",                 // amount
    "takerFee": "0.001",               // maker fee ratio. If the number less than 0.0001 - it will be rounded to zero
    "makerFee": "0.001",               // maker fee ratio. If the number less than 0.0001 - it will be rounded to zero
    "left": "0.001",                   // if order not finished - rest of amount that must be finished
    "dealFee": "0",                    // fee in money that you pay if order is finished
    "price": "40000",                  // price
    "activation_price": "40000"        // activation price
}
```
<details>
<summary><b>Errors:</b></summary>

Error codes:
* `30` - default validation error code
* `31` - market validation failed
* `32` - amount validation failed
* `33` - price validation failed
* `34` - incorrect taker fee (it is less than zero or its precision is too big)
* `35` - incorrect maker fee (it is less than zero or its precision is too big)
* `36` - clientOrderId validation failed

```json5
{
    "code": 30,
    "message": "Validation failed",
    "errors": {
        "activation_price": [
            "Activation price field is required."
        ],
        "amount": [
            "Amount field is required."
        ],
        "market": [
            "Market field is required."
        ],
        "price": [
            "Price field is required."
        ],
        "side": [
            "Side field is required."
        ]
    }
}
```

```json5
{
  "code": 30,
  "message": "Validation failed",
  "errors": {
    "side": [
      "Side field should contain only 'buy' or 'sell' values."
    ]
  }
}
```

```json5
{
    "code": 32,
    "message": "Validation failed",
    "errors": {
        "amount": [
            "Amount field should be numeric string or number."
        ]
    }
}
```

```json5
{
    "code": 33,
    "message": "Validation failed",
    "errors": {
        "price": [
            "Price field should be numeric string or number."
        ]
    }
}
```

```json5
{
    "code": 31,
    "message": "Validation failed",
    "errors": {
        "market": [
            "Market is not available."
        ]
    }
}
```

```json5
{
    "code": 32,
    "message": "Validation failed",
    "errors": {
        "amount": [
            "Not enough balance."
        ]
    }
}
```

```json5
{
    "code": 32,
    "message": "Validation failed",
    "errors": {
        "amount": [
            "Given amount is less than min amount 0.001",
            "Min amount step = 0.000001"
        ]
    }
}
```

```json5
{
    "code": 30,
    "message": "Validation failed",
    "errors": {
        "total": [
            "Total(amount * price) is less than 5.05"
        ]
    }
}
```

```json5
{
    "code": 36,
    "message": "Validation failed",
    "errors": {
        "clientOrderId": [
            "ClientOrderId field should be a string."
        ]
    }
}
```

```json5
{
    "code": 36,
    "message": "Validation failed",
    "errors": {
        "clientOrderId": [
            "ClientOrderId field field should contain only latin letters, numbers and dashes."
        ]
    }
}

```

```json5
{
    "code": 36,
    "message": "Validation failed",
    "errors": {
        "clientOrderId": [
            "This client order id is already used by the current account. It will become available in 24 hours (86400 seconds)."
        ]
    }
}

```

```json5
{
  "code": 32,
  "message": "Validation failed",
  "errors": {
    "amount": [
      "Amount should be greater than 0."
    ]
  }
}

```

```json5
{
  "code": 33,
  "message": "Validation failed",
  "errors": {
    "price": [
      "Price field should be at least 10",
      "Min price step = 0.000001"
    ]
  }
}
```

```json5
{
  "code": 33,
  "message": "Validation failed",
  "errors": {
    "price": [
      "Price should be greater than 0."
    ]
  }
}
```

```json5
{
  "code": 34,
  "message": "Validation failed",
  "errors": {
    "taker_fee": [
      "Incorrect taker fee"
    ]
  }
}
```

```json5
{
  "code": 35,
  "message": "Validation failed",
  "errors": {
    "maker_fee": [
      "Incorrect maker fee"
    ]
  }
}
```

```json5
{
    "code": 30,
    "message": "Validation failed",
    "errors": {
        "activationPrice": [
            "Activation price should not be equal to the last price"
        ]
    }
}
```

```json5
{
    "code": 30,
    "message": "Validation failed",
    "errors": {
        "activation_price": [
            "Activation price should be numeric string."
        ]
    }
}
```

```json5
{
    "code": 30,
    "message": "Validation failed",
    "errors": {
        "activationPrice": [
            "Activation price should be greater than 0."
        ]
    }
}
```

```json5
{
    "code": 30,
    "message": "Validation failed",
    "errors": {
        "activationPrice": [
            "Empty history"
        ]
    }
}
```

```json5
{
    "code": 30,
    "message": "Validation failed",
    "errors": {
        "activationPrice": [
            "Min activation price = 10"
        ]
    }
}
```

```json5
{
    "code": 30,
    "message": "Validation failed",
    "errors": {
        "activationPrice": [
            "Min activation price step = 0.00001"
        ]
    }
}
```

```json5
{
    "code": 30,
    "message": "Validation failed",
    "errors": {
        "activationPrice": [
            "Activation price should not be equal to the last price"
        ]
    }
}
```

```json5
{
    "code": 30,
    "message": "Validation failed",
    "errors": {
        "lastPrice": [
            "internal error"
        ]
    }
}
```

```json5
{
    "code": 10,
    "message": "Inner validation failed",
    "errors": {
        "amount": [
            "Not enough balance."
        ]
    }
}
```

```json5
{
    "code": 1,
    "message": "Inner validation failed",
    "errors": {
        "amount": [
            "Invalid argument."
        ]
    }
}
```

```json5
{
  "code": 11,
  "message": "Inner validation failed",
  "errors": {
    "amount": [
      "Amount too small."
    ]
  }
}
```

</details>

___

### Create stop-market order

```
[POST] /api/v4/order/stop_market
```
This endpoint creates stop-market trading order

**Parameters:**

Name | Type          | Mandatory | Description
------------ |---------------| ------------ | ------------
market | String        | **Yes** | Available market. Example: BTC_USDT
side | String        | **Yes** | Order type. Variables: 'buy' / 'sell' Example: 'buy'
amount | String/Number | **Yes** | ⚠️Amount of **`money`** currency to **buy** or amount in **`stock`** currency to **sell**. Example: '0.01' or 0.01 for buy and '0.0001' for sell.
activation_price | String/Number | **Yes** | Activation price in money currency. Example: '10000' or 10000
clientOrderId | String        | **No** | Identifier should be unique and contain letters, dashes or numbers only. The identifier must be unique for the next 24 hours.

**Request BODY raw:**
```json5
{
    "market": "BTC_USDT",
    "side": "buy",
    "amount": "50",              // I want to buy for 50 USDT
    "activation_price": "40000",
    "clientOrderId": "order1987111",
    "request": "{{request}}",
    "nonce": "{{nonce}}"
}
```
```json5
{
    "market": "BTC_USDT",
    "side": "sell",
    "amount": "0.001",             // I want to sell 0.01 BTC
    "activation_price": "40000",
    "request": "{{request}}",
    "nonce": "{{nonce}}"
}
```

**Response:**
Available statuses:
* `Status 200`
* `Status 422 if inner validation failed`
* `Status 503 if service temporary unavailable`

```json5
{
    "orderId": 4180284841,             // order id
    "clientOrderId": "order1987111",   // custom order identifier; "clientOrderId": "" - if not specified.
    "market": "BTC_USDT",              // deal market
    "side": "buy",                     // order side
    "type": "stop market",             // order type
    "timestamp": 1595792396.165973,    // current timestamp
    "dealMoney": "0",                  // if order finished - amount in money currency that finished
    "dealStock": "0",                  // if order finished - amount in stock currency that finished
    "amount": "0.001",                 // amount
    "takerFee": "0.001",               // maker fee ratio. If the number less than 0.0001 - it will be rounded to zero
    "makerFee": "0.001",               // maker fee ratio. If the number less than 0.0001 - it will be rounded to zero
    "left": "0.001",                   // if order not finished - rest of amount that must be finished
    "dealFee": "0",                    // fee in money that you pay if order is finished
    "activation_price": "40000"        // activation price
}
```
<details>
<summary><b>Errors:</b></summary>

Error codes:
* `30` - default validation error code
* `31` - market validation failed
* `32` - amount validation failed
* `34` - incorrect taker fee (it is less than zero or its precision is too big)
* `36` - clientOrderId validation failed

```json5
{
    "code": 30,
    "message": "Validation failed",
    "errors": {
        "activation_price": [
            "Activation price field is required."
        ],
        "amount": [
            "Amount field is required."
        ],
        "market": [
            "Market field is required."
        ],
        "side": [
            "Side field is required."
        ]
    }
}
```

```json5
{
  "code": 30,
  "message": "Validation failed",
  "errors": {
    "side": [
      "Side field should contain only 'buy' or 'sell' values."
    ]
  }
}
```

```json5
{
    "code": 32,
    "message": "Validation failed",
    "errors": {
        "amount": [
            "Amount field should be numeric string or number."
        ]
    }
}
```

```json5
{
    "code": 31,
    "message": "Validation failed",
    "errors": {
        "market": [
            "Market is not available."
        ]
    }
}
```

```json5
{
    "code": 32,
    "message": "Validation failed",
    "errors": {
        "amount": [
            "Not enough balance."
        ]
    }
}

```

```json5
{
    "code": 32,
    "message": "Validation failed",
    "errors": {
        "amount": [
            "Given amount is less than min amount 0.001",
            "Min amount step = 0.000001"
        ]
    }
}

```

```json5
{
    "code": 36,
    "message": "Validation failed",
    "errors": {
        "clientOrderId": [
            "ClientOrderId field should be a string."
        ]
    }
}

```

```json5
{
    "code": 36,
    "message": "Validation failed",
    "errors": {
        "clientOrderId": [
            "ClientOrderId field field should contain only latin letters, numbers and dashes."
        ]
    }
}

```

```json5
{
    "code": 36,
    "message": "Validation failed",
    "errors": {
        "clientOrderId": [
            "This client order id is already used by the current account. It will become available in 24 hours (86400 seconds)."
        ]
    }
}

```

```json5
{
  "code": 32,
  "message": "Validation failed",
  "errors": {
    "amount": [
      "Amount should be greater than 0."
    ]
  }
}

```

```json5
{
  "code": 34,
  "message": "Validation failed",
  "errors": {
    "taker_fee": [
      "Incorrect taker fee"
    ]
  }
}

```

```json5
{
    "code": 30,
    "message": "Validation failed",
    "errors": {
        "activationPrice": [
            "Activation price should not be equal to the last price"
        ]
    }
}
```

```json5
{
    "code": 30,
    "message": "Validation failed",
    "errors": {
        "activation_price": [
            "Activation price should be numeric string."
        ]
    }
}
```

```json5
{
    "code": 30,
    "message": "Validation failed",
    "errors": {
        "activationPrice": [
            "Activation price should be greater than 0."
        ]
    }
}
```

```json5
{
    "code": 30,
    "message": "Validation failed",
    "errors": {
        "activationPrice": [
            "Empty history"
        ]
    }
}
```

```json5
{
    "code": 30,
    "message": "Validation failed",
    "errors": {
        "activationPrice": [
            "Min activation price = 10"
        ]
    }
}
```

```json5
{
    "code": 30,
    "message": "Validation failed",
    "errors": {
        "activationPrice": [
            "Min activation price step = 0.00001"
        ]
    }
}
```

```json5
{
    "code": 30,
    "message": "Validation failed",
    "errors": {
        "activationPrice": [
            "Activation price should not be equal to the last price"
        ]
    }
}
```

```json5
{
    "code": 30,
    "message": "Validation failed",
    "errors": {
        "lastPrice": [
            "internal error"
        ]
    }
}
```

```json5
{
    "code": 10,
    "message": "Inner validation failed",
    "errors": {
        "amount": [
            "Not enough balance."
        ]
    }
}
```

```json5
{
    "code": 1,
    "message": "Inner validation failed",
    "errors": {
        "amount": [
            "Invalid argument."
        ]
    }
}
```

```json5
{
  "code": 11,
  "message": "Inner validation failed",
  "errors": {
    "amount": [
      "Amount too small."
    ]
  }
}
```

</details>

___

### Cancel order

```
[POST] /api/v4/order/cancel
```
Cancel existing order

**Parameters:**

Name | Type       | Mandatory | Description
------------ |------------| ------------ | ------------
market | String     | **Yes** | Available market. Example: BTC_USDT
orderId | String/Int | **Yes** | Order Id. Example: 4180284841 or "4180284841"

**Request BODY raw:**
```json5
{
    "market": "BTC_USDT",
    "orderId": 4180284841,
    "request": "{{request}}",
    "nonce": "{{nonce}}"
}
```

**Response:**

Available statuses:
* `Status 200`
* `Status 400 if inner validation failed`
* `Status 422 if validation failed`
* `Status 503 if service temporary unavailable`


```json5
{
    "orderId": 4180284841,             // order id
    "clientOrderId": "customId11",     // custom order identifier; "clientOrderId": "" - if not specified.
    "market": "BTC_USDT",              // deal market
    "side": "buy",                     // order side
    "type": "stop market",             // order type
    "timestamp": 1595792396.165973,    // current timestamp
    "dealMoney": "0",                  // if order finished - amount in money currency that is finished
    "dealStock": "0",                  // if order finished - amount in stock currency that is finished
    "amount": "0.001",                 // amount
    "takerFee": "0.001",               // maker fee ratio. If the number less than 0.0001 - it will be rounded to zero
    "makerFee": "0.001",               // maker fee ratio. If the number less than 0.0001 - it will be rounded to zero
    "left": "0.001",                   // if order not finished - rest of the amount that must be finished
    "dealFee": "0",                    // fee in money that you pay if order is finished
    "price": "40000",                  // price if price isset
    "activation_price": "40000"        // activation price if activation price is set
}
```
<details>
<summary><b>Errors:</b></summary>

Error codes:
* `30` - default validation error code 
* `31` - market validation failed

```json5
{
    "code": 30,
    "message": "Validation failed",
    "errors": {
        "market": [
            "Market field is required."
        ],
        "orderId": [
            "OrderId field is required."
        ]
    }
}
```

```json5
{
    "code": 31,
    "message": "Validation failed",
    "errors": {
        "market": [
            "Market is not available."
        ]
    }
}
```

```json5
{
    "code": 30,
    "message": "Validation failed",
    "errors": {
        "orderId": [
            "OrderId field should be an integer."
        ]
    }
}
```

```json5
{
    "code": 30,
    "message": "Validation failed",
    "errors": {
        "market": [
            "Market field should be a string.",
            "Market field format is invalid."
        ]
    }
}
```

```json5
{
    "code": 2,
    "message": "Inner validation failed",
    "errors": {
        "orderId": [
            "Unexecuted order was not found."
        ]
    }
}
```

```json5
{
    "code": 1,
    "message": "Inner validation failed",
    "errors": {
        "amount": [
            "Invalid argument."
        ]
    }
}
```
</details>

___

### Query unexecuted(active) orders

```
[POST] /api/v4/orders
```
This endpoint retrieves unexecuted orders only.

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
market | String | **Yes** | Available market. Example: BTC_USDT
orderId | String | **No** | Available orderId. Example: 3134995325
clientOrderId | String | **No** | Available clientOrderId. Example: customId11
limit | Int | **No** | LIMIT is a special clause used to limit records a particular query can return. Default: 50, Min: 1, Max: 100
offset | Int | **No** | If you want the request to return entries starting from a particular line, you can use OFFSET clause to tell it where it should start. Default: 0, Min: 0, Max: 10000

**Request BODY raw:**
```json5
{
    "market": "BTC_USDT",
    "orderId": "3134995325",              //order Id (optional)
    "clientOrderId": "customId11",      // custom order id; (optional)
    "offset": 0,
    "limit": 100,
    "request": "{{request}}",
    "nonce": "{{nonce}}"
}
```

**Response:**

Available statuses:
* `Status 200`
* `Status 422 if request validation failed`
* `Status 400 if inner validation failed`
* `Status 503 if service temporary unavailable`
```json5
[
    {
        "orderId": 3686033640,            // unexecuted order ID
        "clientOrderId": "customId11",    // custom order id; "clientOrderId": "" - if not specified.
        "market": "BTC_USDT",             // currency market
        "side": "buy",                    // order side
        "type": "limit",                  // unexecuted order type
        "timestamp": 1594605801.49815,    // current timestamp of unexecuted order
        "dealMoney": "0",                 // executed amount in money
        "dealStock": "0",                 // executed amount in stock
        "amount": "2.241379",             // active order amount
        "takerFee": "0.001",              // taker fee ratio. If the number less than 0.0001 - it will be rounded to zero
        "makerFee": "0.001",              // maker fee ratio. If the number less than 0.0001 - it will be rounded to zero
        "left": "2.241379",               // unexecuted amount in stock
        "dealFee": "0",                   // executed fee by deal
        "price": "40000"                  // unexecuted order price
    },
    {...}
]

```
<details>
<summary><b>Errors:</b></summary>

```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "market": [
            "The market field is required."
        ]
    }
}
```

```json5
{
  "code": 30,
  "message": "Validation failed",
  "errors": {
    "market": [
      "Market field should be a string."
    ]
  }
}
```

```json5
{
  "code": 30,
  "message": "Validation failed",
  "errors": {
    "market": [
      "Market field format is invalid."
    ]
  }
}
```


```json5
{
    "message": "Validation failed",
    "code": 0,
    "errors": {
        "market": [
            "Market is not available"
        ]
    }
}
```

```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "limit": [
            "The limit must be an integer."
        ],
        "offset": [
            "The offset must be an integer."
        ]
    }
}
```

```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "limit": [
            "The limit may not be greater than 100."
        ],
        "offset": [
            "The offset may not be greater than 10000."
        ]
    }
}
```

```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "limit": [
            "The limit must be at least 1."
        ],
        "offset": [
            "The offset must be at least 0."
        ]
    }
}
```

```json5
{
    "code": 1,
    "message": "Inner validation failed",
    "errors": {
        "amount": [
            "Invalid argument."
        ]
    }
}
```

</details>

___

### Query executed order history

```
[POST] /api/v4/trade-account/executed-history
```
This endpoint retrieves the deals history. Can be sorted by single market if needed.

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
market | String | **No** | Requested market. Example: BTC_USDT
clientOrderId | String | **No** | Requested clientOrderId. Example: customId11
limit | Int | **No** | LIMIT is a special clause used to limit records a particular query can return. Default: 50, Min: 1, Max: 100
offset | Int | **No** | If you want the request to return entries starting from a particular line, you can use OFFSET clause to tell it where it should start. Default: 0, Min: 0, Max: 10000

**Request BODY raw:**
```json5
{
    "clientOrderId": "customId11",      // custom order id; (optional)
    "offset": 0,
    "limit": 100,
    "request": "{{request}}",
    "nonce": "{{nonce}}"
}
```

**Response:**

Available statuses:
* `Status 200`
* `Status 422 if request validation failed`
* `Status 400 if inner validation failed`
* `Status 503 if service temporary unavailable`
```json5
{
    "BTC_USDT": [
        {
            "id": 160305483,               // deal ID
            "clientOrderId": "customId11", // custom order id; "clientOrderId": "" - if not specified.
            "time": 1594667731.724403,     // Timestamp of the executed deal
            "side": "sell",                // Deal side "sell" / "buy"
            "role": 2,                     // Role - 1 - maker, 2 - taker
            "amount": "0.000076",          // amount in stock
            "price": "9264.21",            // price
            "deal": "0.70407996",          // amount in money
            "fee": "0.00070407996"         // paid fee
        },
        {...}
    ],
    "DTBC_DUSDT": [...]
}


```
<details>
<summary><b>Errors:</b></summary>

```json5
{
    "code": 30,
    "message": "Validation failed",
    "errors": {
        "limit": [
            "Limit field should be an integer."
        ],
        "offset": [
            "Offset field should be an integer."
        ]
    }
}
```

```json5
{
  "code": 30,
  "message": "Validation failed",
  "errors": {
    "market": [
      "Market field format is invalid."
    ]
  }
}
```

```json5
{
    "code": 30,
    "message": "Validation failed",
    "errors": {
        "market": [
            "Market field should be a string."
        ]
    }
}
```

```json5
{
    "code": 30,
    "message": "Validation failed",
    "errors": {
        "limit": [
            "Limit should not be greater than 100."
        ],
        "offset": [
            "Offset should not be greater than 10000."
        ]
    }
}
```

```json5
{
    "code": 30,
    "message": "Validation failed",
    "errors": {
        "limit": [
            "Limit should be at least 1."
        ],
        "offset": [
            "Offset should be at least 0."
        ]
    }
}
```

```json5
{
    "code": 1,
    "message": "Inner validation failed",
    "errors": {
        "amount": [
            "Invalid argument."
        ]
    }
}
```

</details>

___

### Query executed order deals

```
[POST] /api/v4/trade-account/order
```
This endpoint retrieves deals history details on pending or executed order.

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
orderId | Int | **Yes** | Order ID. Example: 1234
limit | Int | **No** | LIMIT is a special clause used to limit records a particular query can return. Default: 50, Min: 1, Max: 100
offset | Int | **No** | If you want the request to return entries starting from a particular line, you can use OFFSET clause to tell it where it should start. Default: 0, Min: 0, Max: 10000

**Request BODY raw:**
```json5
{
    "orderId": 3135554375,
    "offset": 0,
    "limit": 100,
    "request": "{{request}}",
    "nonce": "{{nonce}}"
}
```

**Response:**

Available statuses:
* `Status 200`
* `Status 422 if request validation failed`
* `Status 400 if inner validation failed`
* `Status 503 if service temporary unavailable`

```json5
{
    "records": [
        {
            "time": 1593342324.613711,      // Timestamp of executed order
            "fee": "0.00000419198",         // fee that you pay
            "price": "0.00000701",          // price
            "amount": "598",                // amount in stock
            "id": 149156519,                // deal id
            "dealOrderId": 3134995325,      // completed order Id
            "clientOrderId": "customId11",  // custom order id; "clientOrderId": "" - if not specified.
            "role": 2,                      // Role - 1 - maker, 2 - taker
            "deal": "0.00419198"            // amount in money
        }
    ],
    "offset": 0,
    "limit": 100
}


```
<details>
<summary><b>Errors:</b></summary>

```json5
{
  "code": 30,
  "message": "Validation failed",
  "errors": {
    "orderId": [
      "Order was not found."
    ]
  }
}
```

```json5
{
    "code": 30,
    "message": "Validation failed",
    "errors": {
        "orderId": [
            "OrderId field is required."
        ]
    }
}
```

```json5
{
    "code": 30,
    "message": "Validation failed",
    "errors": {
        "orderId": [
            "OrderId field should be an integer."
        ]
    }
}
```

```json5
{
    "code": 30,
    "message": "Validation failed",
    "errors": {
        "limit": [
            "Limit should not be greater than 100."
        ],
        "offset": [
            "Offset should not be greater than 10000."
        ]
    }
}
```

```json5
{
    "code": 30,
    "message": "Validation failed",
    "errors": {
        "limit": [
            "Limit should be at least 1."
        ],
        "offset": [
            "Offset should be at least 0."
        ]
    }
}
```

```json5
{
    "code": 1,
    "message": "Inner validation failed",
    "errors": {
        "amount": [
            "Invalid argument."
        ]
    }
}
```

```json5
{
    "code": 1,
    "message": "Inner validation failed",
    "errors": {
        "amount": [
            "Invalid argument."
        ]
    }
}
```

</details>

___

### Query executed orders

```
[POST] /api/v4/trade-account/order/history
```
This endpoint retrieves executed order history by market.

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
market | String | **No** | Requested available market. Example: BTC_USDT
orderId | String | **No** | Requested available orderId. Example: 3134995325
clientOrderId | String | **No** | Requested available clientOrderId. Example: clientOrderId
limit | Int | **No** | LIMIT is a special clause used to limit records a particular query can return. Default: 50, Min: 1, Max: 100
offset | Int | **No** | If you want the request to return entries starting from a particular line, you can use OFFSET clause to tell it where it should start. Default: 0, Min: 0, Max: 10000

**Request BODY raw:**
```json5
{
    "market": "BTC_USDT",               //optional
    "orderId": "3134995325",            //order Id (optional)
    "clientOrderId": "clientOrderId",   // custom order id; (optional)
    "offset": 0,
    "limit": 100,
    "request": "{{request}}",
    "nonce": "{{nonce}}"
}
```

**Response:**

Available statuses:
* `Status 200`
* `Status 422 if request validation failed`
* `Status 400 if inner validation failed`
* `Status 503 if service temporary unavailable`

Empty response if order is not yours
```json5
{
    "BTC_USDT": [
        {
            "amount": "0.0009",               // amount of trade
            "price": "40000",                 // price
            "type": "limit",                  // order type
            "id": 4986126152,                 // order id
            "clientOrderId": "customId11",    // custom order identifier; "clientOrderId": "" - if not specified.
            "side": "sell",                   // order side
            "ctime": 1597486960.311311,       // timestamp of order creation
            "takerFee": "0.001",              // maker fee ratio. If the number less than 0.0001 - its rounded to zero
            "ftime": 1597486960.311332,       // executed order timestamp
            "makerFee": "0.001",              // maker fee ratio. If the number less than 0.0001 - its rounded to zero
            "dealFee": "0.041258268",         // paid fee if order is finished
            "dealStock": "0.0009",            // amount in stock currency that finished
            "dealMoney": "41.258268"          // amount in money currency that finished
        },
        {...}
    ]
}


```
<details>
<summary><b>Errors:</b></summary>

```json5
{
    "code": 30,
    "message": "Validation failed",
    "errors": {
        "limit": [
            "Limit field should be an integer."
        ],
        "offset": [
            "Offset field should be an integer."
        ]
    }
}
```

```json5
{
  "code": 30,
  "message": "Validation failed",
  "errors": {
    "market": [
      "Market field format is invalid."
    ]
  }
}
```

```json5
{
    "code": 30,
    "message": "Validation failed",
    "errors": {
        "market": [
            "Market field should be a string."
        ]
    }
}
```

```json5
{
    "code": 30,
    "message": "Validation failed",
    "errors": {
        "limit": [
            "Limit should not be greater than 100."
        ],
        "offset": [
            "Offset should not be greater than 10000."
        ]
    }
}
```

```json5
{
    "code": 30,
    "message": "Validation failed",
    "errors": {
        "limit": [
            "Limit should be at least 1."
        ],
        "offset": [
            "Offset should be at least 0."
        ]
    }
}
```

```json5
{
    "code": 1,
    "message": "Inner validation failed",
    "errors": {
        "amount": [
            "Invalid argument."
        ]
    }
}
```

</details>

## Collateral

### Collateral Account Balance

```
[POST] /api/v4/collateral-account/balance
```

This endpoint returns a current collateral balance

**Parameters**

Name | Type | Mandatory | Description
------------ | ------------ |-----------| ------------
ticker | String | **No**    | Asset to be filtered. For example: BTC

**Request BODY raw:**

```json5
{
    "ticker": "BTC",
    "request": "{{request}}",
    "nonce": "{{nonce}}"
}
```
**Response:**
Available statuses:
* `Status 200`
* `Status 422 if inner validation failed`
* `Status 503 if service temporary unavailable`

```json5
{
    "BTC": 1,
    "USDT": 1000
}
```

### Collateral Limit Order

```
[POST] /api/v4/order/collateral/limit
```
This endpoint creates limit order using collateral balance

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
market | String | **Yes** | Available margin market. Example: BTC_USDT
side | String | **Yes** | Order type. Variables: 'buy' / 'sell' Example: 'buy'. For open long position you have to use **buy**, for short **sell**. Also to close current position you have to place opposite order with current position amount.
amount | String | **Yes** | ⚠️Amount of **`stock`** currency to **buy** or **sell**.
price | String | **Yes** | Price in money currency. Example: '9800'
clientOrderId | String | **No** | Identifier should be unique and contain letters, dashes or numbers only. The identifier must be unique for the next 24 hours.

**Request BODY raw:**
```json5
{
    "market": "BTC_USDT",
    "side": "buy",
    "amount": "0.01",
    "price": "40000",
    "clientOrderId": "order1987111",
    "request": "{{request}}",
    "nonce": "{{nonce}}"
}
```

**Response:**
Available statuses:
* `Status 200`
* `Status 422 if inner validation failed`
* `Status 503 if service temporary unavailable`

```json5
{
    "orderId": 4180284841,             // order id
    "clientOrderId": "order1987111",   // custom client order id; "clientOrderId": "" - if not specified.
    "market": "BTC_USDT",              // deal market
    "side": "buy",                     // order side
    "type": "limit",                   // order type
    "timestamp": 1595792396.165973,    // current timestamp
    "dealMoney": "0",                  // if order finished - amount in money currency that is finished
    "dealStock": "0",                  // if order finished - amount in stock currency that is finished
    "amount": "0.01",                  // amount
    "takerFee": "0.001",               // maker fee ratio. If the number less than 0.0001 - it will be rounded to zero
    "makerFee": "0.001",               // maker fee ratio. If the number less than 0.0001 - it will be rounded to zero    
    "left": "0.001",                   // if order not finished - rest of the amount that must be finished
    "dealFee": "0",                    // fee in money that you pay if order is finished
    "price": "40000"                   // price
}
```
<details>
<summary><b>Errors:</b></summary>

Error codes:
* `1` - market is disabled for trading
* `2` - incorrect amount (it is less than or equals zero or its precision is too big)
* `3` - incorrect price (it is less than or equals zero or its precision is too big)
* `4` - incorrect taker fee (it is less than zero or its precision is too big)
* `5` - incorrect maker fee (it is less than zero or its precision is too big)
* `6` - incorrect clientOrderId (invalid string or not unique id)
___
</details>

Detailed information about errors response you can find in [Create limit order](#create-limit-order)

---


### Collateral Market Order

```
[POST] /api/v4/order/collateral/market
```
This endpoint creates market trading order.

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
market | String | **Yes** | Available margin market. Example: BTC_USDT
side | String | **Yes** | Order type. Variables: 'buy' / 'sell' Example: 'buy'. For open long position you have to use **buy**, for short **sell**. Also to close current position you have to place opposite order with current position amount.
amount | String | **Yes** | ⚠️Amount of **`stock`** currency to **buy** or **sell**.
clientOrderId | String | **No** | Identifier should be unique and contain letters, dashes or numbers only. The identifier must be unique for the next 24 hours.

**Request BODY raw:**
```json5
{
    "market": "BTC_USDT",
    "side": "buy",
    "amount": "0.01",             // I want to buy 0.01 BTC
    "clientOrderId": "order1987111",
    "request": "{{request}}",
    "nonce": "{{nonce}}"
}
```

```json5
{
    "market": "BTC_USDT",
    "side": "sell",
    "amount": "0.01",              // I want to sell 0.01 BTC
    "clientOrderId": "order1987111",
    "request": "{{request}}",
    "nonce": "{{nonce}}"
}
```

**Response:**
Available statuses:
* `Status 200`
* `Status 422 if internal validation failed`
* `Status 503 if service is temporary unavailable`

```json5
{
    "orderId": 4180284841,             // order id
    "clientOrderId": "order1987111",   // custom client order id; "clientOrderId": "" - if not specified.
    "market": "BTC_USDT",              // deal market
    "side": "buy",                     // order side
    "type": "market",                  // order type
    "timestamp": 1595792396.165973,    // current timestamp
    "dealMoney": "0",                  // amount in money currency that finished
    "dealStock": "0",                  // amount in stock currency that finished
    "amount": "0.001",                 // amount
    "takerFee": "0.001",               // maker fee ratio. If the number less than 0.0001 - its rounded to zero
    "makerFee": "0.001",               // maker fee ratio. If the number less than 0.0001 - its rounded to zero    
    "left": "0.001",                   // rest of amount that must be finished
    "dealFee": "0"                     // fee in money that you pay if order is finished
}
```
<details>
<summary><b>Errors:</b></summary>

Error codes:
* `1` - market is disabled for trading
* `2` - incorrect amount (it is less than or equals zero or its precision is too big)
* `3` - incorrect price (it is less than or equals zero or its precision is too big)
* `4` - incorrect taker fee (it is less than zero or its precision is too big)
* `5` - incorrect maker fee (it is less than zero or its precision is too big)
* `6` - incorrect clientOrderId (invalid string or not unique id)

</details>

Detailed information about errors response you can find in  [Create market order](#create-market-order)

---
___

### Collateral Trigger Market Order

```
[POST] /api/v4/order/collateral/trigger_market
```
This endpoint creates margin trigger market order

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
market | String | **Yes** | Available margin market. Example: BTC_USDT
side | String | **Yes** | Order type. Variables: 'buy' / 'sell' Example: 'buy'. For open long position you have to use **buy**, for short **sell**. Also to close current position you have to place opposite order with current position amount.
amount | String | **Yes** | ⚠️Amount of **`stock`** currency to **buy** or **sell**.
activation_price | String | **Yes** | Activation price in money currency. Example: '10000'
clientOrderId | String | **No** | Identifier should be unique and contain letters, dashes or numbers only. The identifier must be unique for the next 24 hours.

**Request BODY raw:**
```json5
{
    "market": "BTC_USDT",
    "side": "buy",
    "amount": "0.01",             // I want to buy 0.01 BTC
    "activation_price": "40000",
    "clientOrderId": "order1987111",
    "request": "{{request}}",
    "nonce": "{{nonce}}"
}
```
```json5
{
    "market": "BTC_USDT",
    "side": "sell",
    "amount": "0.01",             // I want to sell 0.01 BTC
    "activation_price": "40000",
    "request": "{{request}}",
    "nonce": "{{nonce}}"
}
```

**Response:**
Available statuses:
* `Status 200`
* `Status 422 if inner validation failed`
* `Status 503 if service temporary unavailable`

```json5
{
    "orderId": 4180284841,             // order id
    "clientOrderId": "order1987111",   // custom order identifier; "clientOrderId": "" - if not specified.
    "market": "BTC_USDT",              // deal market
    "side": "buy",                     // order side
    "type": "stop market",             // order type
    "timestamp": 1595792396.165973,    // current timestamp
    "dealMoney": "0",                  // if order finished - amount in money currency that finished
    "dealStock": "0",                  // if order finished - amount in stock currency that finished
    "amount": "0.001",                 // amount
    "takerFee": "0.001",               // maker fee ratio. If the number less than 0.0001 - it will be rounded to zero
    "makerFee": "0.001",               // maker fee ratio. If the number less than 0.0001 - it will be rounded to zero    
    "left": "0.001",                   // if order not finished - rest of amount that must be finished
    "dealFee": "0",                    // fee in money that you pay if order is finished
    "activation_price": "40000"        // activation price
}
```
<details>
<summary><b>Errors:</b></summary>

Error codes:
* `1` - market is disabled for trading
* `2` - incorrect amount (it is less than or equals zero or its precision is too big)
* `3` - incorrect price (it is less than or equals zero or its precision is too big)
* `4` - incorrect taker fee (it is less than zero or its precision is too big)
* `5` - incorrect maker fee (it is less than zero or its precision is too big)
* `6` - incorrect clientOrderId (invalid string or not unique id)
</details>

---

### Collateral Account Summary

```
[POST] /api/v4/collateral-account/summary
```
This endpoint retrieves summary of collateral account

**Request BODY raw:**
```json5
{
    "request": "{{request}}",
    "nonce": "{{nonce}}"
}
```

**Response:**
Available statuses:
* `Status 200`
* `Status 503 if service temporary unavailable`

```json5
{
  "equity": "130970.8947456254113367",       // total equity of collateral balance including lending funds in USDT
  "margin": "456.58349",                     // amount of funds in open position USDT
  "freeMargin": "129681.3285348840110099",   // free funds for trading according to 
  "unrealizedFunding": "0.0292207414003268", // funding that will be paid on next position stage change (order, liquidation, etc) 
  "pnl": "-832.9535",                        // curren profit and loss in USDT
  "leverage": 10                             // current leverage of account which affect amount of lending funds
}
```

---

### Open Positions

```
[POST] /api/v4/collateral-account/positions/open
```
This endpoint returns all open positions

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
market | String | **No** | Requested market. Example: BTC_USDT

**Request BODY raw:**
```json5
{
    "market": "BTC_USDT",
    "request": "{{request}}",
    "nonce": "{{nonce}}"
}
```

**Response:**
Available statuses:
* `Status 200`
* `Status 422 if inner validation failed`
* `Status 503 if service temporary unavailable`

```json5
[
  {
    "positionId": 527,                         // position ID
    "market": "BTC_USDT",                      // market name
    "openDate": 1651568067.789679,             // date of position opening
    "modifyDate": 1651568067.789679,           // date of position modifying (this is date of current event)
    "amount": "0.1",                           // amount of order
    "basePrice": "45658.349",                  // base price of position
    "liquidationPrice": null,                  // liquidation price according to current state of position 
    "liquidationState": null,                  // state of liquidation. Possible values: null, Margin_call, Liquidation
    "leverage": "5",                           // current collateral balance leverage
    "pnl": "-168.42",                          // current profit and loss in **money**
    "pnlPercent": "-0.43",                     // current profit and loss in percentage
    "margin": "8316.74",                       // amount of funds in open position **money**
    "freeMargin": "619385.67",                 // free funds for trading according to 
    "funding": "0",                            // funding that will be paid on next position stage change (order, liquidation, etc)
    "unrealizedFunding": "0.0019142920201966", // funding that will be paid on next position stage change (order, liquidation, etc)
  },
  ...
]
```

* NOTE: In case of position opening using trigger or limit order you can get situation when `basePrice`, `liquidationPrice`, `amount`, `pnl`, `pnlPercent` returns with null value. It happens when funds are lending, and you start to pay funding fee, but position is not completely opened, cos activation price hadn't been triggered yet. 

---

### Positions History

```
[POST] /api/v4/collateral-account/positions/history
```
This endpoint returns past positions history. Each position represented by position states. Each of them means event that shows current position changes such order, position close, liquidation, etc.  

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
market | String | **No** | Requested market. Example: BTC_USDT
positionId | Int | **No** | Requested position

**Request BODY raw:**
```json5
{
    "market": "BTC_USDT",
    "request": "{{request}}",
    "nonce": "{{nonce}}"
}
```

**Response:**
Available statuses:
* `Status 200`
* `Status 422 if inner validation failed`
* `Status 503 if service temporary unavailable`

```json5
[
  
  {
      "positionId": 111,               // position ID
      "market": "BTC_USDT",            // position market
      "openDate": 1650400589.882613,   // date of position opening
      "modifyDate": 1650400589.882613, // date of position modifying (this is date of current event)
      "amount": "0.1",                 // amount of order
      "basePrice": "45658.349",        // base price of position
      "realizedFunding": "0",          // funding fee for whole position lifetime till current state
      "liquidationPrice": null,        // liquidation price according to current state of position 
      "liquidationState": null,        // state of liquidation. Possible values: null, Margin_call, Liquidation
      "orderDetail": {                 // details of order which changes position
        "id": 97067934,                // order ID
        "tradeAmount": "0.1",          // trade amount of order
        "basePrice": "41507.59",       // order's base price
        "tradeFee": "415.07",          // order's trade fee
        "fundingFee": null             // funding fee which was captured by this position change (order)
      }
    }, 
    ... 
]
```

---

### Change Collateral Account Leverage

```
[POST] /api/v4/collateral-account/leverage
```
This endpoint changes the current leverage of account.

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
leverage | Int | **Yes** | New collateral account leverage value. Acceptable values: 1, 2, 3, 5, 10, 20

**Request BODY raw:**
```json5
{
    "leverage": 5,
    "request": "{{request}}",
    "nonce": "{{nonce}}"
}
```

**Response:**
Available statuses:
* `Status 200`
* `Status 422 if inner validation failed`
* `Status 503 if service temporary unavailable`

```json5
{
  "leverage": 5 // current collateral balance leverage
}
```

---
