# Public HTTP API V2

## Public endpoints V2

* [Market info](#market-info)
* [Market activity](#market-activity)
* [Recent Trades](#recent-trades)
* [Fee](#fee)
* [Asset Status List](#asset-status-list)
* [Orderbook](#orderbook)
    
Base endpoint is https://whitebit.com

Example how to use: https://whitebit.com/api/v2/public/{endpoint}

All endpoints return time in Unix-time format.

All endpoints return either a __JSON__ object array.

For receiving responses from API calls please use http method __GET__

If endpoint required parameters you will need to send them as `query string`

#### Error messages V2 format:
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
[GET] /api/v2/public/markets
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
      "tradesEnabled": true      // Is trading enabled
    },
    {
      ...
    }
  ]
}
```
___

### Market activity

```
[GET] /api/v2/public/ticker
```
This endpoint retrieves information on recent trading activity on all markets.

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
      "lastUpdateTimestamp": "2020-07-10T13:37:27.000Z",     // ISO 8601 time format of last update
      "tradingPairs": "ETH_BTC",                             // Name of market pair
      "lastPrice": "0.026014",                               // Last deal price
      "lowestAsk": "0.026027",                               // Lowest ask price
      "highestBid": "0.026001",                              // Highest bid price
      "baseVolume24h": "13445.988",                          // Volume in stock currency
      "quoteVolume24h": "350.113082102",                     // Volume in money currency
      "tradesEnabled": true                                  // Is trading enabled on exchange
    },
    {
      ...
    }
  ]
}
```
___

### Recent Trades

```
[GET] /api/v2/public/trades/{market}
```
This endpoint retrieves the trades that have been executed recently on the requested market

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
      "tradeId": 157257950,                 // A unique ID associated with the trade for the currency pair transaction Note: Unix timestamp does not qualify as trade_id.
      "price": "9371.69",                   // Price.
      "volume": "0.145642",                 // Amount.
      "time": "2020-07-09T14:13:01.000Z",   // Time.
      "isBuyerMaker": true                  // Sell order is taker: true, Buy order is taker: false
    },
    {
      ...
    }
  }
}
```
___

### Fee

```
[GET] /api/v2/public/fee
```
This endpoint retrieves the trading fee.

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
    "makerFee": "0.1",  // Default maker fee (percent of trading amount in money currency)
    "takerFee": "0.1"   // Default taker fee (percent of trading amount in money currency)
  }
}
```
___

### Asset Status List

```
[GET] /api/v2/public/assets
```
This endpoint retrieves the assets status.

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
    "BTC": {
      "id": "4f37bc79-f612-4a63-9a81-d37f7f9ff622",         // Asset id
      "lastUpdateTimestamp": "2020-07-10T13:20:07.000Z",    // ISO 8601 time format of last update
      "name": "Bitcoin",                                    // Name of currency
      "canWithdraw": true,                                  // Is currency withdrawable
      "canDeposit": true,                                   // Is currency depositable
      "minWithdrawal": "0.001",                             // Minimal amount to withdraw
      "maxWithdrawal": "0",                                 // Maximum amount to withdraw
      "makerFee": "0.1",                                    // Maker fee for currency
      "takerFee": "0.1"                                     // Taker fee for currency
    },
    {...}
  }
}
```
___

### Orderbook

```
[GET] /v2/public/depth/{market}
```
This endpoint retrievs the current order book as two arrays (bids / asks).

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
      "lastUpdateTimestamp": "2020-07-09T14:49:12.000Z",     // Timestamp of last update
      "asks": [
        [
          "9431.9",                                          // Price of lowest ask
          "0.705088"                                         // Amount of lowest ask
        ],
        [
          "9433.67",                                         // Price of the next ask
          "0.324509"                                         // Amount of the next ask
        ],
        [...]
      ],
      "bids": [
        [
          "9427.65",                                         // Price of highest bid
          "0.547909"                                         // Amount of highest bid
        ],
        [
          "9427.3",                                          // Price of next bid
          "0.669249"                                         // Amount of next bid
        ],
      ],
      [...]
  },
}
```
___
