# Public HTTP API V1

## Public endpoints V1

* [Market info](#market-info)
* [Market activity](#market-activity)
* [Single market activity](#single-market-activity)
* [Kline](#kline)
* [Symbols](#symbols)
* [Order depth](#order-depth)
* [Trade history](#trade-history)
    
Base URL is https://whitebit.com

Endpoint example: https://whitebit.com/api/v1/public/{endpoint}

All endpoints return time in Unix-time format.

All endpoints return either a __JSON__ object or array.

For receiving responses from API calls please use http method __GET__

If an endpoint requires parameters you should send them as `query string`

#### Error messages V1 format:
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
### Market Info

```
[GET] /api/v1/public/markets
```
This endpoint retrieves all information about available markets.

**Response is cached for:**
_1 second_

**Parameters:**
NONE

**Response:**
```json5
{
  "success": true,
  "message": null,
  "result": [
    {
      "name": "BTC_USDT",      // Name of market pair
      "stock": "BTC",          // Ticker of stock currency
      "money": "USDT",         // Ticker of money currency
      "stockPrec": "6",        // Precision of stock currency
      "moneyPrec": "2",        // Precision of money currency
      "feePrec": "4",          // Precision of fee
      "makerFee": "0.001",     // Default maker fee ratio
      "takerFee": "0.001",     // Default taker fee ratio
      "minAmount": "0.0001"    // Minimal amount of stock to trade
    },
    {
      ...
    }
  ]
}
```
___

### Market Activity

```
[GET] /api/v1/public/tickers
```
This endpoint retrieves information about recent trading activity on all markets.

**Response is cached for:**
_1 second_

**Parameters:**
NONE

**Response:**
```json5
{
  "success": true,
  "message": null,
  "result": {
    "BTC_USDT": {                         // Name of market pair
      "ticker": {
        "bid": "9412.1",                  // Highest bid
        "ask": "9416.33",                 // Lowest ask
        "low": "9203.13",                 // Lowest price for 24h
        "high": "9469.99",                // Highest price for 24h
        "last": "9414.4",                 // Last deal price
        "vol": "27324.819448",            // Volume in stock currency
        "deal": "254587570.43407191",     // Volume in money currency
        "change": "1.53"                  // Change in percent between open and last prices
      },
      "at": 159423219                     // Timestamp in seconds
    },
    "ETH_BTC": {
      ...
    }
  }
}
```
___

### Single market activity

```
[GET] /api/v1/public/ticker?market=ETH_BTC
```
This endpoint retrieves information about recent trading activity on the requested market.

**Response is cached for:**
_1 second_

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
market | String | **Yes** | Available market. Example: BTC_USDT

**Response:**
```json5
{
  "success": true,
  "message": null,
  "result": {
    "open": "9267.98",               // Open price for day
    "bid": "9417.4",                 // The highest bid currently available
    "ask": "9421.64",                // The lowest ask currently available
    "low": "9203.13",                // Lowest price for day
    "high": "9469.99",               // Highest price for day
    "last": "9419.55",               // Latest deal price
    "volume": "27303.824558",        // Volume in stock
    "deal": "254399191.68843464",    // Volume in money
    "change": "1.63"                 // Change between open and close price in percentage
  }
}
```
___


### Kline

```
[GET] /api/v1/public/kline?market=BTC_USDT&interval=1h
```
This endpoint retrieves information about market kline.

**Response is cached for:**
_1 second_

**Max numbers of candles cannot exceed:**
_1440_

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
market | String | **Yes** | Available market. Example: BTC_USDT
start | Timestamp | **No** | Start time in seconds, default value is current start day. Cannot be greater or equal to End Time. Example: 1596848400
end | Timestamp | **No** | End time in seconds, default value is current time. Cannot be smaller or equal to Start Time. Example: 1596927600
interval | String | **NO** | Possible values - 1m, 3m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 8h, 12h, 1d, 3d, 1w, 1M. Default value is 1h
limit | Integer | **NO** | Possible values from 1 to 1440. Default value is 1440

**Response:**
```json5
{
  "success": true,
  "message": null,
  "result": [
    [
        1631440800,            // Time in seconds
        "45865.62",            // Open
        "45958.14",            // Close
        "45981.3",             // High
        "45750.23",            // Low
        "15.327634",           // Volume stock
        "703140.24230131"      // Volume money
    ],
    [...]
  ]
}
```
___

### Symbols

```
[GET] /api/v1/public/symbols
```
This endpoint retrieves information about all available markets for trading.

**Response is cached for:**
_1 second_

**Parameters:**
NONE

**Response:**
```json5
{
  "success": true,
  "message": null,
  "result": [
    "BTC_USDT",      // Name of market pair
    "ETH_BTC",       // Name of market pair
    "ETH_USDT",      // Name of market pair
    ...
  ]
}
```
___

### Order depth

```
[GET] /api/v1/public/depth/result?market=BTC_USDT
```
This endpoint retrieves the current order book as two arrays (bids / asks)

**Response is cached for:**
_1 second_

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
market | String | **Yes** | Available market. Example: BTC_USDT
limit | int | **No** | Limit of results. Default: 100 Max: 100 Example: 100


**Response:**
```json5
{
  "asks": [
    [
      "9431.9",            // Price of lowest ask
      "0.705088"           // Amount of lowest ask
    ],
    [
      "9433.67",           // Price of next ask
      "0.324509"           // Amount of next ask
    ],
    [...]
  ],
  "bids": [
    [
      "9427.65",           // Price of highest bid
      "0.547909"           // Amount of highest bid
    ],
    [
      "9427.3",            // Price of next bid
      "0.669249"           // Amount of next bid
    ],
    [...]
  ]
}
```
___

### Trade History

```
[GET] /api/v1/public/history?market=BTC_USDT&lastId=1
```
This endpoint retrieves trades that have been executed for the requested market.

**Response is cached for:**
_1 second_

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
market | String | **Yes** | Available market. Example: BTC_USDT
lastId | int | **Yes** | Largest id of last returned result. Example: request deals starting from id equals to 6
limit | int | **No** | Limit of results. Default: 50 Example: 100


**Response:**
```json5
{
  "success": true,
  "message": null,
  "result": [
    {
      "id": 156720314,              // Deal id
      "time": 1594240477.849703,    // Deal time in seconds
      "price": "9429.66",           // Deal price
      "amount": "0.002784",         // Deal amount
      "type": "sell"                // Deal type (buy or sell)
    },
    {
      "id": 156720309,
      "time": 1594240476.832347,
      "price": "9429.66",
      "amount": "0.002455",
      "type": "sell"
    },
    {...}
  ]
}
```
___
