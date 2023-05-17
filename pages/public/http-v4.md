# Public HTTP API V4

 - [Error messages V4 format](#error-messages-v4-format)
    - [Market Info](#market-info)
    - [Market activity](#market-activity)
    - [Asset status list](#asset-status-list)
    - [Orderbook](#orderbook)
    - [Recent Trades](#recent-trades)
    - [Fee](#fee)
    - [Server Time](#server-time)
    - [Server Status](#server-status)
    - [Collateral Markets List](#collateral-markets-list)
    - [Available Futures Markets List](#available-futures-markets-list)

Base URL is https://whitebit.com

Endpoint example: https://whitebit.com/api/v4/public/{endpoint}

All endpoints return time in Unix-time format.

All endpoints return either a __JSON__ object or array.

For receiving responses from API calls please use http method __GET__

If an endpoint requires parameters you should send them as `query string`

___
### Error messages V4 format

```json
{
    "success": false,
    "message": "ERROR MESSAGE",
    "params": []
}
```

___
### Market Info

```
[GET] /api/v4/public/markets
```
This endpoint retrieves all information about available spot and futures markets.

**Response is cached for:**
_1 second_

**Parameters:**
NONE

❗ Rate limit 2000 requests/10 sec.

**Response:**
```json
[
    {
      "name": "SON_USD",         // Market pair name
      "stock": "SON",            // Ticker of stock currency
      "money": "USD",            // Ticker of money currency
      "stockPrec": "3",          // Stock currency precision
      "moneyPrec": "2",          // Precision of money currency
      "feePrec": "4",            // Fee precision
      "makerFee": "0.001",       // Default maker fee ratio
      "takerFee": "0.001",       // Default taker fee ratio
      "minAmount": "0.001",      // Minimal amount of stock to trade
      "minTotal": "0.001",       // Minimal amount of money to trade
      "maxTotal": "10000000000", // Maximum total(amount * price) of money to trade
      "tradesEnabled": true,     // Is trading enabled
      "isCollateral": true,      // Is margin trading enabled
      "type": "spot"             // Market type. Possible values: "spot", "futures"
    },
    {
      ...
    }
]
```
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

❗ Rate limit 2000 requests/10 sec.

**Response:**
```json
{
  "BTC_USDT": {
    "base_id": 1,                           // CoinmarketCap Id of base currency; 0 - if unknown
    "quote_id": 825,                        // CoinmarketCap Id of quote currency; 0 - if unknown
    "last_price": "9164.09",                // Last price
    "quote_volume": "43341942.90416876",    // Volume in quote currency
    "base_volume": "4723.286463",           // Volume in base currency
    "isFrozen": false,                      // Identifies if trades are closed
    "change": "0.57"                        // Change in percent between open and last prices
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

❗ Rate limit 2000 requests/10 sec.

**Response:**
```json
{
  "BTC": {
    "name": "Bitcoin",                        // Full name of cryptocurrency.
    "unified_cryptoasset_id": 1,              // Unique ID of cryptocurrency assigned by Unified Cryptoasset ID, 0 if unknown
    "can_withdraw": true,                     // Identifies whether withdrawals are enabled or disabled.
    "can_deposit": true,                      // Identifies whether deposits are enabled or disabled.
    "min_withdraw": "0.001",                  // Identifies the single minimum withdrawal amount of a cryptocurrency.
    "max_withdraw": "2",                      // Identifies the single maximum withdrawal amount of a cryptocurrency.
    "maker_fee": "0.1",                       // Maker fee in percentage
    "taker_fee": "0.1",                       // Taker fee in percentage
    "min_deposit": "0.0001",                  // Min deposit amount
    "max_deposit": "0",                       // Max deposit amount, will not be returned if there is no limit, 0 if unlimited
    "currency_precision": 18,                 // Max number of digits to the right of the decimal point
    "is_memo": false,                         // Identifies if currency has memo address
    "networks": {                             // Currency networks. It might be a list of networks for cryptocurrency networks or just a single item list for simple cryptocurrencies or tokens
      "deposits": [                           // Networks available for depositing
        "BTC"
      ],
      "withdraws": [                          // Networks available for withdrawing
        "BTC"
      ],
      "default": "BTC"                        // Default network for depositing / withdrawing if available
    },
    "limits": {                               // Currency limits by each network
      "deposit": {                            // Deposits limits
        "BTC": {                              // Network
          "min": "0.001"                      // Min deposit amount
        },
      },
      "withdraw": {                           // Withdraws limits
        "BTC": {                              // Network
          "min": "0.002",                     // Min withdraw amount
        },
      }
    },
    "confirmations": {                        // Deposit confirmations count mapped by network
      "BTC": 2
    }
  },
  "ETH": {
    "name": "Ethereum",
    "unified_cryptoasset_id": 1027,
    "can_withdraw": true,
    "can_deposit": true,
    "min_withdraw": "0.02",
    "max_withdraw": "0",
    "maker_fee": "0.1",
    "taker_fee": "0.1",
    "min_deposit": "0.1",
    "max_deposit": "0",
    "currency_precision": 18,
    "is_memo": false,
    "networks": {                             // Currency networks. It might be a list of networks for cryptocurrency networks or just a single item list for simple cryptocurrencies or tokens
      "deposits": [                           // Networks available for depositing
        "ETH"
      ],
      "withdraws": [                          // Networks available for withdrawing
        "ETH"
      ],
      "default": "ETH"                        // Default network for depositing / withdrawing if available
    },
    "limits": {                               // Currency limits by each network
      "deposit": {                            // Deposits limits
        "ETH": {                              // Network
          "min": "0.001"                      // Max deposit amount
        },
      },
      "withdraw": {                           // Withdraws limits
        "ETH": {                              // Network
          "min": "0.002",                     // Min withdraw amount
        },
      }
    },
    "confirmations": {
      "ETH": 20
    }
  },
  "USDT": {
    "name": "Tether US",
    "unified_cryptoasset_id": 825,
    "can_withdraw": true,
    "can_deposit": true,
    "min_withdraw": "5",
    "max_withdraw": "0",
    "maker_fee": "0.1",
    "taker_fee": "0.1",
    "min_deposit": "0",
    "max_deposit": "0",
    "currency_precision": 6,
    "is_memo": false,
    "networks": {                             // Currency networks. It might be a list of networks for cryptocurrency networks or just a single item list for simple cryptocurrencies or tokens
      "deposits": [                           // Networks available for depositing
        "ERC20",
        "TRC20",
        "OMNI",
        "BEP20"
      ],
      "withdraws": [                          // Networks available for withdrawing
        "ERC20",
        "TRC20",
        "OMNI",
        "BEP20"
      ],
      "default": "ERC20"                      // Default network for depositing / withdrawing
    },
    "limits": {                               // This object will be returned when currency has several networks/providers
      "deposit": {                            // Deposits limits
        "ERC20": {                            // Network
          "min": "5",                         // Min deposit amount
          "max": "1000"                       // Max deposit amount
        },
        "TRC20": {
          "min": "5"                          // If there is no max limit, it is not returned
        },
        ...
      },
      "withdraw": {                           // Withdraws limits
        "ERC20": {                            // Network
          "min": "10",                        // Min withdraw amount
          "max": "1000"                       // Max withdraw amount
        },
        "TRC20": {
          "min": "10"                         // If there is no max limit, it is not returned
        },
        ...
      }
    },
    "confirmations": {
      "ERC20": 20,
      "TRC20": 20
    }
  },
  "UAH": {
    "name": "Hryvnia",
    "unified_cryptoasset_id": 0,
    "can_withdraw": true,
    "can_deposit": true,
    "min_withdraw": "50",
    "max_withdraw": "100000",
    "maker_fee": "0.1",
    "taker_fee": "0.1",
    "min_deposit": "50",
    "max_deposit": "100000",
    "is_memo": false,
    "providers": {                            // Fiat currency providers
      "deposits": [                           // Providers available for depositing
        "VISAMASTER",
        "ADVCASH",
        "GEOPAY"
      ],
      "withdraws": [                          // Providers available for withdrawing
        "VISAMASTER",
        "GEOPAY"
      ],
    },
    "limits": {                               // This object will be returned when currency has several networks/providers
      "deposit": {                            // Deposits limits
        "VISAMASTER": {                       // Provider
          "min": "50",                        // Min deposit amount
          "max": "50000"                      // Max deposit amount
        },
      ...
      },
      "withdraw": {                          // Withdraws limits
        "VISAMASTER": {                      // Provider
          "min": "50",                       // Min withdraw amount
          "max": "50000"                     // Max withdraw amount
        },
        ...
      }
    }
  },
  {...}
}
```
___

### Orderbook

```
[GET] /api/v4/public/orderbook/{market}?limit=100&level=2
```
This endpoint retrieves the current [order book](./../glossary.md#order-book as two arrays ([bids](./../glossary.md#bid) / [asks](./../glossary.md#ask)) with additional parameters.

**Response is cached for:**
_1 second_

❗ Rate limit 600 requests/10 sec.

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
limit | int | **No** | Orders depth quantity: 0 - 100. Not defined or 0 will return 100 entries.
level | int | **No** | Optional parameter that allows API user to see different level of aggregation. Level 0 – default level, no aggregation. Starting from level 1 (lowest possible aggregation) and up to level 5 - different levels of aggregated [orderbook](./../glossary.md#order-book).


**Response:**
```json
{
  "ticker_id": "BTC_PERP",        // Market Name
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
This endpoint retrieves the [trades](./../glossary.md#deal-trade) that have been executed recently on the requested [market](./../glossary.md#market).

**Response is cached for:**
_1 second_

❗ Rate limit 2000 requests/10 sec.

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
type | String | **No** | Can be buy or sell


**Response:**
```json
[
  {
    "tradeID": 158056419,             // A unique ID associated with the trade for the currency pair transaction Note: Unix timestamp does not qualify as trade_id.
    "price": "9186.13",               // Transaction price in quote pair volume.
    "quote_volume": "0.0021",         // Transaction amount in quote pair volume.
    "base_volume": "9186.13",         // Transaction amount in base pair volume.
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
This endpoint retrieves the list of [fees](./../glossary.md#fee) and min/max amount for deposits and withdraws

**Response is cached for:**
_1 second_

❗ Rate limit 2000 requests/10 sec.
___

**Response:**
```json
{
  "USDT (ERC20)": {
    "ticker": "USDT",                         // currency ticker
    "name": "Tether US",                      // currency ticker
    "providers": [],
    "deposit": {                              // deposit fees
      "min_amount": "0.0005",                 // min deposit amount. 0 if there is no limitation
      "max_amount": "0.1",                    // max deposit amount. 0 if there is no limitation
      "fixed": "0.0005",                      // fixed fee amount which applies for all transaction
      "flex": {
        "min_fee": "100",                     // min fee amount
        "max_fee": "1000",                    // max fee amount
        "percent": "10"
      },                                      // flex fee only applies for all transactions but according to min/max fee. Nullable if there is no flex fee
    },
    "withdraw": {
      "min_amount": "0.001",
      "max_amount": "0",
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
        "min_amount": "10",
        "max_amount": "1500",
        "fixed": null,
        "flex": null,
        "is_depositable": false,
        "name": "USD Visa/MasterCard Interkassa", // provider name
        "ticker": "USD_VISAMASTER_INTERKASSA"     //provider ticker
      }
    },
    "withdraw": {
      "USD_VISAMASTER_INTERKASSA": {
        "min_amount": "20",
        "max_amount": "1500",
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

❗ Rate limit 2000 requests/10 sec.

**Response:**
```json
{
  "time": 1631451591
}
```
### Server Status

```
[GET] /api/v4/public/ping
```
This endpoint retrieves the current API life-state.

❗ Rate limit 2000 requests/10 sec.

**Response is cached for:**
_1 second_

**Response:**
```json
[
  "pong"
]
```

### Collateral Markets List

```
[GET] /api/v4/public/collateral/markets
```
This endpoint returns the list of [markets](./../glossary.md#market) that available for [collateral](./../glossary.md#collateral) trading

❗ Rate limit 2000 requests/10 sec.

**Response is cached for:**
_1 second_

**Response:**
```json
[
    "ADA_USDT",
    "BCH_USDT",
    "BTC_USDT",
    "DOGE_USDT",
    "EOS_USDT",
    "ETH_BTC",
    "ETH_USDT",
    "LINK_USDT",
    "LTC_USDT",
    "SHIB_USDT",
    "SOL_USDT",
    "TRX_USDT",
    "USDC_USDT",
    "XLM_USDT",
    "XRP_USDT"
]
```

### Available Futures Markets List

```
[GET] /api/v4/public/futures
```
This endpoint returns the list of available futures markets.

❗ Rate limit 2000 requests/10 sec.

**Response is cached for:**
_1 second_

**Response:**
```json
{
  "success": true,
  "message": null,
  "result": [
    {
      "ticker_id": "BTC_PERP",                        //Identifier of a ticker with delimiter to separate base/target
      "stock_currency": "BTC",                        //Symbol/currency code of base pair
      "money_currency": "USDT",                       //Symbol/currency code of target pair
      "last_price": "24005.5",                        //Last transacted price of base currency based on given target currency
      "stock_volume": "196965.591",                   //24 hour trading volume in base pair volume
      "money_volume": "4737879075.7817",              //24 hour trading volume in target pair volume
      "bid": "24005.4",                               //Current highest bid price
      "ask": "24005.6",                               //Current lowest ask price
      "high": "24295.1",                              //Rolling 24-hours highest transaction price
      "low": "23765.3",                               //Rolling 24-hours lowest transaction price
      "product_type": "Perpetual",                    //What product is this? Futures, Perpetual, Options?
      "open_interest": "6000",                        //The open interest in the last 24 hours in contracts.
      "index_price": "24019.25",                      //Underlying index price
      "index_name": "Bitcoin",                        //Name of the underlying index if any
      "index_currency": "BTC",                        //Underlying currency for index
      "funding_rate": "0.000044889033693137",         //Current funding rate
      "next_funding_rate_timestamp": "1660665600000"  //Timestamp of the next funding rate change
    }
  ]
}
```
