# Public HTTP API V4

## Public endpoints V4

* [Ticker](#market-activity)
* [Assets](#asset-status-list)
* [Orderbook](#orderbook)
* [Recent Trades](#recent-trades)
* [Server Time](#server-time)
* [Server Status](#server-status)
    
Base URL is https://whitebit.com

Endpoint example: https://whitebit.com/api/v4/public/{endpoint}

All endpoints return time in Unix-time format.

All endpoints return either a __JSON__ object or array.

For receiving responses from API calls please use http method __GET__

If an endpoint requires parameters you should send them as `query string`

#### Error messages V4 format:
___
```json5
{
    "success": false,
    "message": "ERROR MESSAGE",
    "params": []
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

___

### Market activity 

```
[GET] /api/v4/public/ticker
```
This endpoint retrieves a 24-hour pricing and volume summary for each market pair available on the exchange.

**Response is cached for:**
_1 second_

**Parameters:**
NONE

**Response:**
```json5
{
  "BTC_USDT": {
    "base_id": 1,                           // CoinmarketCap Id of base currency; 0 - if unknown
    "quote_id": 825,                        // CoinmarketCap Id of quote currency; 0 - if unknown
    "last_price": "9164.09",                // Last price
    "quote_volume": "43341942.90416876",    // Volume in quote currency
    "base_volume": "4723.286463",           // Volume in base currency
    "isFrozen": false                       // Identifies if trades are closed
  },
  {...}
}
```
___

### Asset status list

```
[GET] /api/v4/public/assets
```
This endpoint retrieves the assets status.

**Response is cached for:**
_1 second_

**Parameters:**
NONE

**Response:**
```json5
{
  "BTC": {
    "name": "Bitcoin",                        // Full name of cryptocurrency.
    "unified_cryptoasset_id": null,           // Unique ID of cryptocurrency assigned by Unified Cryptoasset ID.
    "can_withdraw": true,                     // Identifies whether withdrawals are enabled or disabled.
    "can_deposit": true,                      // Identifies whether deposits are enabled or disabled.
    "min_withdraw": "0.001000000000000000",   // Identifies the single minimum withdrawal amount of a cryptocurrency.
    "max_withdraw": "0.000000000000000000",   // Identifies the single maximum withdrawal amount of a cryptocurrency.
    "maker_fee": "0.1",                       // Maker fee in percentage
    "taker_fee": "0.1",                       // Taker fee in percentage
    "min_deposit": "0.01",                    // Min deposit amount
    "max_deposit": "100",                     // Max deposit amount, will not be returned if there is no limit
  },
  "ETH": {
    "name": "Ethereum",
    "unified_cryptoasset_id": null,
    "can_withdraw": true,
    "can_deposit": true,
    "min_withdraw": "0.020000000000000000",
    "max_withdraw": "0.000000000000000000",
    "maker_fee": "0.1",
    "taker_fee": "0.1",
    "min_deposit": "0.1"
  },
  "USDT": {
    "name": "Tether US",
    "unified_cryptoasset_id": null,
    "can_withdraw": true,
    "can_deposit": true,
    "min_withdraw": "10.000000000000000000",
    "max_withdraw": "0.000000000000000000",
    "maker_fee": "0.1",
    "taker_fee": "0.1",
    "networks": {                             // This object will be available in response if the currency is available on several networks
      "deposits": [                           // Networks available for depositing
        "ERC20",
        "TRC20",
        "OMNI"
      ],
      "withdraws": [                          // Networks available for withdrawing
        "ERC20",
        "TRC20",
        "OMNI"
      ],
      "default": "ERC20"                      // Default network for depositing / withdrawing
    },
    "limits": {                               // This object will be returned when currency has several networks/providers
      "deposit": {                            // Deposits limits
        "ERC20": {                            // Network/provider
          "min": "10",                        // Min deposit amount
          "max": "1000"                       // Max deposit amount
        },
        "TRC20": {
          "min": "10"                         // If there is no max limit, it is not returned
        }
      },
      "withdraw": {                           // Withdraws limits
        "ERC20": {                            // Network/provider
          "min": "10",                        // Min withdraw amount
          "max": "1000"                       // Max withdraw amount
        },
        "TRC20": {
          "min": "10"                         // If there is no max limit, it is not returned
        }
      } 
    }
  },
  {...}
}
```
___

### Orderbook

```
[GET] /api/v4/public/orderbook/{market}?depth=100&level=2
```
This endpoint retrieves the current order book as two arrays (bids / asks) with additional parameters.

**Response is cached for:**
_1 second_

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
depth | int | **No** | Orders depth quantity:[0,5,10,20,50,100,500]. Not defined or 0 will return full order book
limit | int | **No** | Level 1 – Only the best bid and ask. Level 2 – Arranged by best bids and asks. Level 3 – Complete order book, no aggregation.


**Response:**
```json5
{
  "timestamp": 1594391413,        // Current timestamp
  "asks": [                       // Array of ask orders
    [
      "9184.41",                  // Price of lowest ask
      "0.773162"                  // Amount of lowest ask
    ],
    [ ... ]
  ],
  "bids": [                       // Array of bid orders
    [
      "9181.19",                  // Price of highest bid
      "0.010873"                  // Amount of highest bid
    ],
    [ ... ]
  ]
}
```
___

### Recent Trades

```
[GET] /api/v4/public/trades/{market}?type=sell
```
This endpoint retrieves the trades that have been executed recently on the requested market.

**Response is cached for:**
_1 second_

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
type | String | **No** | Can be buy or sell


**Response:**
```json5
[
  {
    "tradeID": 158056419,             // A unique ID associated with the trade for the currency pair transaction Note: Unix timestamp does not qualify as trade_id.
    "price": "9186.13",               // Transaction price in quote pair volume.
    "base_volume": "9186.13",         // Transaction amount in base pair volume.
    "quote_volume": "0.0021",         // Transaction amount in quote pair volume.
    "trade_timestamp": 1594391747,    // Unix timestamp in milliseconds, identifies when the transaction occurred.
    "type": "sell"                    // Used to determine whether or not the transaction originated as a buy or sell. Buy – Identifies an ask that was removed from the order book. Sell – Identifies a bid that was removed from the order book.
  },
  {
    "tradeID": 158056416,
    "price": "9186.13",
    "base_volume": "9186.13",
    "quote_volume": "0.002751",
    "trade_timestamp": 1594391746,
    "type": "sell"
  },
  {...}
}
```
___

### Fee

```
[GET] /api/v4/public/fee
```
This endpoint retrieves the list of fees and min/max amount for deposits and withdraws
___

**Response:**
```json5
{
  "USDT (ERC20)": {
    "ticker": "USDT",                         // currency ticker
    "name": "Tether US",                      // currency ticker
    "providers": [], 
    "deposit": {                              // deposit fees
      "min_amount": "0.000500000000000000",   // min deposit amount. 0 if there is no limitation
      "max_amount": "0.100000000000000000",   // min deposit amount. 0 if there is no limitation
      "fixed": "0.000500000000000000",        // fixed fee amount which applies for all transaction
      "flex": {
        "min_fee": "100.000000000000000000",  // min fee amount
        "max_fee": "1000.000000000000000000", // max fee amount
        "percent": "10.000000000000000000" 
      },                                      // flex fee only applies for all transactions but according to min/max fee. Nullable if there is no flex fee
    },
    "withdraw": {
      "min_amount": "0.001000000000000000",
      "max_amount": "0.000000000000000000",
      "fixed": null,
      "flex": null
    },
    "is_depositable": true,                   //true if currency can be deposit
    "is_withdrawal": true                     //true if currency can be withdraw
  },
  "USD": {
    "ticker": "USD",                          // currency ticker
    "name": "United States Dollar",           // currency ticker
    "providers": [
      "USD_ADVCASH",
      "USD_CAPITALIST",
      "USD_EPAY_COM",
      "USD_PERFECT_MONEY",
      "USD_VISAMASTER_INTERKASSA"
    ],                                        // the list of providers. It is uses for fiat currencies. Provider is a payment system with own fees, which process payment operation
    "deposit": {                              // for currencies with payment providers fee and amounts shows for each provider directly
      "USD_VISAMASTER_INTERKASSA": {
        "min_amount": "10.000000000000000000",
        "max_amount": "1500.000000000000000000",
        "fixed": null,
        "flex": null,
        "is_depositable": false,
        "name": "USD Visa/MasterCard Interkassa", // provider name
        "ticker": "USD_VISAMASTER_INTERKASSA"     //provider ticker
      }
    },
    "withdraw": {
      "USD_VISAMASTER_INTERKASSA": {
        "min_amount": "20.000000000000000000",
        "max_amount": "1500.000000000000000000",
        "fixed": null,
        "flex": null,
        "is_withdrawal": false,
        "name": "USD Visa/MasterCard Interkassa",
        "ticker": "USD_VISAMASTER_INTERKASSA"
      }
    }
  },
}
```

### Server Time

```
[GET] /api/v4/public/time
```
This endpoint retrieves the current server time.

**Response is cached for:**
_1 second_

**Response:**
```json5
{
  "time": 1605168359 
}
```
### Server Status

```
[GET] /api/v4/public/ping
```
This endpoint retrieves the current API life-state.

**Response is cached for:**
_1 second_

**Response:**
```json5
[
  "pong"
]
```

