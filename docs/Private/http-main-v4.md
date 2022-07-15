# Private HTTP API V4

## Private endpoints V4 for Main balance changes

* [Main balance](#main-balance)
* [Get cryptocurrency deposit address](#get-cryptocurrency-deposit-address)
* [Get fiat deposit address](#get-fiat-deposit-address)
* [Create withdraw request](#create-withdraw-request)
* [Transfer between main and trade balances](#transfer-between-main-and-trade-balances)
* [Get deposit/withdraw history](#get-depositwithdraw-history)
* [Create new address for deposit](#create-new-address-for-deposit)
* Codes
    * [Create code](#create-code)
    * [Apply code](#apply-code)
    * [Get my codes](#get-my-codes)
    * [Get codes history](#get-codes-history)
* SMART
    * [Get plans](#get-plans)
    * [Invest](#invest)
    * [Close investment](#close-investment)
    * [Get investments history](#get-investments-history)
    * [Get interest payments history](#get-interest-payments-history)
* [Fees](#fees)

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

`Taker` - person who finishes the existing order

`Precision` - is the number of digits to the right of the decimal point

`Bid` - buy order

`Ask` - sell order

`Limit order` - to place this order, you need to fill in the 'Price' and 'Amount' fields. If this order finds a corresponding order on the opposite side, it will be executed. Otherwise it will be placed into the orderbook.

`Fiat` - is a currency (a medium of exchange) established as money, often by government regulation, but that does not have intrinsic value (value independent of the nominal value, such as a precious metal might have).

`Provider` - fiat currencies has different providers that helps people making deposits and withdraws by bank transfers.

`Multinetwork` - cryptocurrency like USDT obtained in different networks, like: OMNI, Tron, Ethereum etc. Network should be selected in order to make a deposit or withdraw.

`Main balance` - balance on exchange that accepts deposits and/or withdraws.

`Memo` - some currencies like XLM can create only one address for exchange. So for detecting which transaction is yours exchanges uses additional data - memo.


___
### Main balance

```
[POST] /api/v4/main-account/balance
```
This endpoint retrieves the main balance by currency ticker or all balances.

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
* `Status 400 if request validation failed`

```json5
{
    "BSV": {
        "main_balance": "0"           // main balance volume of BSV
    },
    "BTC": {
        "main_balance": "0"           // main balance volume of BTC
    },
    "BTG": {
        "main_balance": "0"           // main balance volume of BTG
    },
    "BTT": {
        "main_balance": "0"           // main balance volume of BTT
    },
    "XLM": {
        "main_balance": "36.48"       // main balance volume of XLM
    },
    "currecty_ticker": {...}
}
```

<details>
<summary><b>Errors:</b></summary>

```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "ticker": [
            "The selected ticker is invalid."
        ]
    }
}
```

</details>
___

### Get cryptocurrency deposit address

```
[POST] /api/v4/main-account/address
```
This endpoint retrieves a deposit address of the cryptocurrency.

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
ticker | String | **Yes** | Currencies ticker. Example: BTC ⚠ Currency ticker should be: not fiat and has "can_deposit" status must be "true". If currency has multiple networks like USDT - you need to use multinetwork ticker you can find it in https://whitebit.com/api/v4/public/assets request. Default network for USDT is Ethereum (ERC20).
network | String | **No** | Cryptocurrency network. Available for multi network currencies. Example: ERC20 ⚠ Currency network should be taken from https://whitebit.com/api/v4/public/assets response. Default for USDT is Ethereum (ERC20).

**Request BODY raw:**
```json5
{
    "ticker": "BTC",
    "request": "{{request}}",
    "nonce": "{{nonce}}"
}
```

**Request BODY (for multinetwork currency) raw:**
```json5
{
    "ticker": "USDT",
    "network": "ERC20",
    "request": "{{request}}",
    "nonce": "{{nonce}}"
}
```

**Response:**
Available statuses:
* `Status 200`
* `Status 400 if request validation failed`
* `Status 503 if service temporary unavailable`

```json5
{
    "account": {
        "address": "GDTSOI56XNVAKJNJBLJGRNZIVOCIZJRBIDKTWSCYEYNFAZEMBLN75RMN",        // deposit address
        "memo": "48565488244493"                                                      // memo if currency requires memo
    },
    "required": {
        "fixedFee": "0",                                                              // fixed deposit fee
        "flexFee": {                                                                  // flexible fee - is fee that use percent rate
            "maxFee": "0",                                                            // maximum fixed fee that you will pay
            "minFee": "0",                                                            // minimum fixed fee that you will pay
            "percent": "0"                                                            // percent of deposit that you will pay
        },
        "maxAmount": "0",                                                             // max amount of deposit that can be accepted by exchange - if you deposit more than that number, it won't be accepted by exchange
        "minAmount": "1"                                                              // min amount of deposit that can be accepted by exchange - if you will deposit less than that number, it won't be accepted by exchange
    }
}
```
<details>
<summary><b>Errors:</b></summary>

```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "ticker": [
            "The selected ticker is invalid."
        ]
    }
}
```

```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "network": [
            "The selected network is invalid."
        ]
    }
}
```

```json5
{
    "code": 1,
    "message": "Inner validation failed",
    "errors": {
        "ticker": [
            "Currency is not depositable"
        ]
    }
}
```

```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "ticker": [
            "Fiat deposits are available only on the website"
        ]
    }
}
```

</details>

___


### Get fiat deposit address

```
[POST] /api/v4/main-account/fiat-deposit-url
```
This endpoint retrieves a deposit url of the fiat invoice. Please, pay attention that this endpoint works on demand. It means that you need to contact WhiteBIT support and provide your API key to get access to this functionality.

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
ticker | String | **Yes** | Currencies ticker. Example: UAH ⚠ Currencies ticker should be: fiat and has "can_deposit" status must be "true". Use this [url](https://whitebit.com/api/v4/public/assets) to know more about currency.
provider | String | **Yes** | Fiat currency provider. Example: VISAMASTER ⚠ Currency provider should be taken from https://whitebit.com/api/v4/public/assets response.
amount | Numeric String | **Yes** | Deposit amount.
email | String | **Yes, if currency is RUB with VISAMASTER_PAYCORE provider** | Email entered by user for Fiat currency provider. ⚠ Field is **Mandatory** in case currency is **RUB** and provider **VISAMASTER_PAYCORE**
address | String | **Yes, if currency is RUB with VISAMASTER_PAYCORE provider** | Credit card number that will be used for deposit. ⚠ Field is **Mandatory** in case currency is **RUB** and provider **VISAMASTER_PAYCORE**
uniqueId | String | **Yes** | Unique transaction identifier on client's side.
successLink | String | **No** | Customer will be redirected to this URL by acquiring provider after success deposit. To activate this feature, please contact support
failureLink | String | **No** | Customer will be redirected to this URL in case of fail or rejection on acquiring provider side. To activate this feature, please contact support
returnLink | String | **No** | Customer will be redirected to the URL defined if selects 'back' option after from the payment success or failure page. To activate this feature, define desired link. If not populated, option 'back' won't be displayed


**Request BODY raw:**
```json5
{
    "ticker": "UAH",
    "provider": "VISAMASTER",
    "amount": "100",
    "email": "test@email.com",
    "address": "4111111111111111",
    "uniqueId": "{{generateID}}",
    "request": "{{request}}",
    "nonce": "{{nonce}}"
}
```

**Response:**
Available statuses:
* `Status 200`
* `Status 400 if request validation failed`
* `Status 503 if service temporary unavailable`

```json5
{
    "url": "https://someaddress.com"                  // address for deposit
}
```

**⚠ If you have used VISAMASTER as provider, you must pass [referer header](https://developer.mozilla.org/ru/docs/Web/HTTP/Headers/Referer) when you go to the invoice link (for example, pass `referer` header when you go to `https://someaddress.com`). Otherwise if there is no header (for example, you go to `https://someaddress.com` from Telegram message) you will be redirected to the WhiteBIT homepage**

<details>
<summary><b>Errors:</b></summary>

```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "amount": [
            "Amount is too little for deposit"
        ]
    }
}
```

```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "provider": [
            "Cannot find currency for specified provider"
        ]
    }
}
```

```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "uniqueId": [
            "The unique id has already been taken."
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
            "The amount must be a number."
        ],
        "provider": [
            "The selected provider is invalid."
        ],
        "ticker": [
            "The selected ticker is invalid."
        ]
    }
}
```

```json5
{
    "code": 10,
    "message": "Failed to generate deposit url"
}
```

```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "amount": [
            "The amount field is required."
        ],
        "provider": [
            "The provider field is required."
        ],
        "ticker": [
            "The ticker field is required."
        ],
        "uniqueId": [
            "The unique id field is required."
        ]
    }
}
```

```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "successLink": [
            "Your domain is incorrect. Please contact support for more details"
        ],
        "failureLink": [
            "Your domain is incorrect. Please contact support for more details"
        ]
  }
}
```

```json5
{
  "success": false,
  "message": "You don't have permission to use this endpoint. Please contact support for more details",
  "code": 0
}
```
```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "successLink": [
            "Uri domain must have only https scheme"
        ],
        "failureLink": [
            "Uri domain must have only https scheme"
        ]
    }
}
```

```json5
{
   "code": 0,
   "message": "Validation failed",
   "errors": {
      "email": [
         "The email field is required."
      ],
      "address": [
         "The address field is required."
      ]
   }
}
```
</details>

___

### Create withdraw request

```
[POST] /api/v4/main-account/withdraw
```
This endpoint creates withdraw for the specified ticker.

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
ticker | String | **Yes** | Currencies ticker. Example: BTC ⚠ Currencies ticker must have "can_deposit" status equal to "true". Use this [url](https://whitebit.com/api/v4/public/assets) to know more about currency.
amount | Numeric string | **Yes** | Withdraw amount (including fee). If you want fee to be added to the specified amount, you need to use [/main-account/withdraw-pay](#create-withdraw-request-with-specifying-absolute-withdraw-amount) request (see examples there)
email | String | **Yes, if currency is RUB with VISAMASTER_PAYCORE provider** | Email entered by user for Fiat currency provider. ⚠ Field is **Mandatory** in case currency is **RUB** and provider **VISAMASTER_PAYCORE**
address | String | **Yes** | Target address (wallet address for cryptocurrencies, identifier/card number for fiat currencies)
memo | String | **Yes, if currency is memoable** | Target address (wallet address for cryptocurrencies, identifier/card number for fiat currencies)
uniqueId | String | **Yes** | Unique transaction identifier. ⚠ Note that you should generate new unique id for each withdrawal request.
provider | String | **Yes, if currency is fiat** | Fiat currency provider. Example: VISAMASTER ⚠ Currency provider should be taken from https://whitebit.com/api/v4/public/assets response.
network | String | **No** | Cryptocurrency network. Available for multi network currencies. Example: OMNI ⚠ Currency network should be taken from https://whitebit.com/api/v4/public/assets response. Default for USDT is ERC20
partialEnable | Boolean | **No** | Optional parameter for FIAT withdrawals with increased Maximum Limit if set as “true”. In order to use this parameter your application should support “Partially successful” withdrawal status and latest updates in deposit/withdrawal history.

**Request BODY raw:**
```json5
{
    "ticker": "ETH",
    "amount": "0.9",
    "address": "0x0964A6B8F794A4B8d61b62652dB27ddC9844FB4c",
    "uniqueId" : "24529041",
    "request": "{{request}}",
    "nonce": "{{nonce}}"
}
```

**Request BODY (for multinetwork currency) raw:**
```json5
{
    "ticker": "USDT",
    "amount": "0.9",
    "address": "0x0964A6B8F794A4B8d61b62652dB27ddC9844FB4c",
    "uniqueId" : "24529042",
    "network" : "ERC20",
    "request": "{{request}}",
    "nonce": "{{nonce}}"
}
```

**Request BODY (for fiat currency) raw:**
```json5
{
    "ticker": "UAH",
    "amount": "100",
    "provider" : "VISAMASTER",
    "uniqueId" : "24529043",
    "request": "{{request}}",
    "nonce": "{{nonce}}"
}
```

**Request BODY (for fiat currency with email address) raw:**
```json5
{
    "ticker": "RUB",
    "email": "test@email.com",
    "address": "4111111111111111",
    "amount": "100",
    "provider" : "VISAMASTER_PAYCORE",
    "uniqueId" : "24529044",
    "request": "{{request}}",
    "nonce": "{{nonce}}"
}
```

**Request BODY (for fiat currency with partialEnable) raw:**
```json5
{
    "ticker": "UAH",
    "amount": "50000",
    "address": "4111111111111111",
    "provider" : "VISAMASTER_PAYCORE",
    "partialEnable": true,
    "uniqueId" : "24529045",
    "request": "{{request}}",
    "nonce": "{{nonce}}"
}
```

**Response:**
Available statuses:
* `Status 201 if validation succeeded and withdraw creation process is started`
* `Status 400 if request validation failed`
* `Status 422 if inner validation failed`

Response error codes:
   * 1 - currency is not withdrawable
   * 2 - specified address is invalid
   * 3 - amount is too small
   * 4 - amount is too small for the payment system
   * 5 - not enough balance
   * 6 - amount is less than or equals fee
   * 7 - amount should be integer (can happen for currencies with zero precision like Neo)
   * 8 - target withdraw amount without fee equals zero
   * 9 - address is unavailable (occurs for withdraws to own address)

```json5
[
                                // empty array - has success status - go to deposit/withdraw history and check you request status by uniqueId
]
```
<details>
<summary><b>Errors:</b></summary>

```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "address": [
            "The address field is required."
        ],
        "amount": [
            "The amount field is required."
        ],
        "ticker": [
            "The ticker field is required."
        ],
        "uniqueId": [
            "The unique id field is required."
        ]
    }
}
```

```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "uniqueId": [
            "The unique id has already been taken."
        ]
    }
}
```
Errors for unconfirmed users (without KYC):
```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "amount": [
            "This currency has no active pairs or it may have been delisted. Its rate cannot be calculated at the moment.",
            "Current limit exceeded"
        ],
    }
}
```
Also, fiat currencies can't be withdrawn without KYC:
```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "amount": [
            "Your account must be verified"
        ]
    }
}
```

```json5
{
    "code": 2,
    "message": "Inner validation failed",
    "errors": {
        "address": [
            "The address is invalid"
        ]
    }
}
```

```json5
{
    "code": 5,
    "message": "Inner validation failed",
    "errors": {
        "amount": [
            "Not enough money, Ethereum balance = 1"
        ]
    }
}
```

```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "ticker": [
            "The selected ticker is invalid."
        ]
    }
}
```

```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "provider": [
            "Provider is required for fiat currency"
        ]
    }
}
```

```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "memo": [
            "The memo field is required."
        ]
    }
}
```

```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "partialEnable": [
            "The partial enable field must be true or false."
        ]
    }
}
```

</details>

___


### Create withdraw request with the specific withdraw amount (fee is not included)

```
[POST] /api/v4/main-account/withdraw-pay
```
This endpoint has the similar logic as [/main-account/withdraw](#create-withdraw-request), but with the only difference: amount that is specified will not include fee (it will be calculated to make target withdraw amount equal to the specified amount).

Example:
* When you create base withdraw and set amount = 100 USD, receiver will recieve 100 USD - fee amount, and your balance will decrease by 100 USD.
* When you use this endpoint and set amount = 100 USD, receiver will recieve 100 USD, and your balance will decrease by 100 USD + fee amount.

---

### Transfer between main and trade balances

```
[POST] /api/v4/main-account/transfer
```
This endpoint transfers the specified amount between main and trade balances

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
method | String | **No** if **from** and **to** are set | Method We highly recommend to use **from** and **to** fields, which provides more flexibility. This way will be deprecated in future. Example: **deposit** if you need to transfer from main to trade / **withdraw** if you need to transfer from trade balance to main. For collateral balances you can use **collateral-deposit** to transfer from main to collateral balance and **collateral-withdraw** to transfer from collateral balance to main
from | String | **No** if **method** is set | Balance FROM which funds will move to. Acceptable values: **main**, **spot**, **collateral** 
to | String | **No** if **method** is set | Balance TO which funds will move to. Acceptable values: **main**, **spot**, **collateral**
ticker | String | **Yes** | Currency's ticker. Example: BTC 
amount | Numeric string | **Yes** | Amount to transfer. Max precision = 8, value should be greater than zero and less or equal your available balance.

**Request BODY raw:**
```json5
{
    "ticker": "XLM",
    "amount": "0.9",
    "method": "deposit",
    "request": "{{request}}",
    "nonce": "{{nonce}}"
}
```

**Response:**
Available statuses:
* `Status 201 if all validations succeeded and creating transaction is started`
* `Status 400 if request validation failed`
* `Status 422 if inner validation failed`

Response error codes:
   * 1 - transfers from trade to main are disabled
   * 2 - transfers from main to trade are disabled
   * 3 - not enough balance

```json5
[
                                // empty array - has success status
]
```
<details>
<summary><b>Errors:</b></summary>

```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "amount": [
            "The amount field is required."
        ],
        "method": [
            "The method field is required."
        ],
        "ticker": [
            "The ticker field is required."
        ]
    }
}
```

```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "ticker": [
            "The selected ticker is invalid."
        ]
    }
}
```
Errors for unconfirmed users (without KYC):
```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "amount": [
            "This currency has no active pairs or it may have been delisted. Its rate cannot be calculated at the moment.",
            "Current limit exceeded"
        ],
    }
}
```
Also, fiat currencies can't be withdrawn without KYC:
```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "amount": [
            "Your account must be verified"
        ]
    }
}
```

```json5
{
    "code": 3,
    "message": "Inner validation failed",
    "errors": {
        "amount": [
            "You don't have such amount for transfer (available 34.68, in amount: 1000000)"
        ]
    }
}
```

```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "method": [
            "The selected method is invalid."
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
            "The amount must be at least 0.00000001."
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
            "The amount must be a number.",
            "Invalid number"
        ]
    }
}
```

</details>

___

### Get deposit/withdraw history

```
[POST] /api/v4/main-account/history
```
This endpoint retrieves the history of deposits and withdraws

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
transactionMethod | Number | **No** | Method. Example: **1** to display deposits / **2** to display withdraws. Do not send this parameter in order to receive both deposits and withdraws.
ticker | String | **No** | Currency's ticker. Example: BTC
address | String | **No** | Can be used for filtering transactions by specific address or memo.
addresses | Array | **No** | Can be used for filtering transactions by specific addresses or memos (max: 20).
uniqueId | String | **No** | Can be used for filtering transactions by specific unique id
limit | Int | **Yes** | LIMIT is a special clause used to limit records a particular query can return. Default: 50, Min: 1, Max: 100
offset | Int | **Yes** | If you want the request to return entries starting from a particular line, you can use OFFSET clause to tell it where it should start. Default: 0, Min: 0, Max: 10000
status | Array | **No** | Can be used for filtering transactions by status codes. :heavy_exclamation_mark: Caution: You must use this parameter with appropriate `transactionMethod` and use valid status codes for this method. You can find them below. Example: `"status": [3,7]`

| Deposit status codes: |
| ------------ |
| `Successful` - 3 and 7 |
| `Canceled` - 4 and 9 |
| `Unconfirmed by user` - 5 |
| `Pending` - 15 |

| Withdraw status codes: |
| ------------ |
| `Pending` - 1, 2, 6, 10, 11, 12, 13, 14, 15, 16, 17 |
| `Successful` - 3 and 7 |
| `Canceled` - 4 |
| `Unconfirmed by user` - 5 |
| `Partially successful` - 18 |


**Request BODY raw:**
```json5
{
    "transactionMethod": "1",
    "ticker": "BTC",
    "offset": 0,
    "limit": 100,
    "status": [3,7],
    "request": "{{request}}",
    "nonce": "{{nonce}}"
}
```

**Response:**
Available statuses:
* `Status 201 if all validations succeeded and creating transaction is started`
* `Status 400 if request validation failed`
* `Status 422 if inner validation failed`

Response error codes:
* 1 - transfers from trade to main are disabled
* 2 - transfers from main to trade are disabled
* 3 - not enough balance


```json5
{
    "limit": 100,
    "offset": 0,
    "records": [
        {
            "address": "3ApEASLcrQtZpg1TsssFgYF5V5YQJAKvuE",                                              // deposit address
            "uniqueId": null,                                                                             // unique Id of deposit
            "createdAt": 1593437922,                                                                      // timestamp of deposit
            "currency": "Bitcoin",                                                                        // deposit currency
            "ticker": "BTC",                                                                              // deposit currency ticker
            "method": 1,                                                                                  // called method 1 - deposit, 2 - withdraw
            "amount": "0.0006",                                                                           // amount of deposit
            "description": "",                                                                            // deposit description
            "memo": "",                                                                                   // deposit memo
            "fee": "0",                                                                                   // deposit fee
            "status": 15,                                                                                 // transactions status
            "network": null,                                                                              // if currency is multinetwork
            "transactionHash": "a275a514013e4e0f927fd0d1bed215e7f6f2c4c6ce762836fe135ec22529d886",        // deposit transaction hash
            "details": {
                "partial": {                                                                              // details about partially successful withdrawals
                    "requestAmount": "50000",                                                             // requested withdrawal amount
                    "processedAmount": "39000",                                                           // processed withdrawal amount
                    "processedFee": "273",                                                                // fee for processed withdrawal amount
                    "normalizeTransaction": ""                                                            // deposit id
                }
            },
            "confirmations": {                                                                            // if transaction status == 15 you can see this object
                "actual": 1,                                                                              // current block confirmations
                "required": 2                                                                             // required block confirmation for successful deposit
            }
        },
        {...},
        {...},
        {...}
    ],
    "total": 300                                                                                             // total number of  transactions, use this for calculating ‘limit’ and ‘offset'
}

```
<details>
<summary><b>Errors:</b></summary>

```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "limit": [
            "The limit field is required."
        ],
        "offset": [
            "The offset field is required."
        ],
        "transactionMethod": [
            "The transaction method field is required."
        ]
    }
}
```

```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "ticker": [
            "The selected ticker is invalid."
        ]
    }
}
```

```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "transactionMethod": [
            "The selected transaction method is invalid."
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
        "status": [
            "The selected status is invalid."
        ]
    }
}
```

</details>

___

### Create new address for deposit

```
[POST] /api/v4/main-account/create-new-address
```
This endpoint creates a new address even when the last created address is not used. This endpoint is not available by default, you need to contact support@whitebit.com in order to get permissions to use this endpoint.

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
ticker | String | **Yes** | Currency's ticker. Example: BTC
network | String | **No** | Currency's network if it multinetwork currency. Example: OMNI or TRC20 or ERC20. For USDT default network is ERC20(ETH).
type | String | **No** | Address type, available for specific currencies list (see address types table below)

**Address types:**

Currency | Types | Default
---------|------|-------------
BTC | p2sh-segwit, bech32 | bech32
LTC | p2sh-segwit, bech32 | bech32


**Request BODY raw:**
```json5
{
    "ticker": "XLM",
    "request": "{{request}}",
    "nonce": "{{nonce}}"
}
```

**Request BODY (for multinetwork currency) raw:**
```json5
{
    "ticker": "USDT",
    "network": "ERC20",
    "request": "{{request}}",
    "nonce": "{{nonce}}"
}
```

**Request BODY (for BTC with specific address type):**
```json5
{
    "ticker": "BTC",
    "type": "bech32",
    "request": "{{request}}",
    "nonce": "{{nonce}}"
}
```

**Response:**
Available statuses:
* `Status 201 if all validations succeeded and creating transaction is started`
* `Status 400 if request validation failed`
* `Status 422 if inner validation failed`

```json5
{
    "account": {
        "address": "GDTSOI56XNVAKJNJBLJGRNZIVOCIZJRBIDKTWSCYEYNFAZEMBLN75RMN",        // deposit address
        "memo": "48565488244493"                                                      // memo if currency requires memo
    },
    "required": {
        "maxAmount": "0",                                                             // max amount of deposit that can be accepted by exchange - if you deposit more than that number, it won't be accepted by exchange
        "minAmount": "1",                                                             // min amount of deposit that accepted by exchange - if you deposit less than that number, it won't be accepted by exchange
        "fixedFee": "0",                                                              // fixed deposit fee
        "flexFee": {                                                                  // flexible fee - is fee that use percent rate
            "maxFee": "0",                                                            // maximum fixed fee that you will pay
            "minFee": "0",                                                            // minimum fixed fee that you will pay
            "percent": "0"                                                            // percent of deposit that you will pay
        },
    }
}

```
<details>
<summary><b>Errors:</b></summary>

```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "ticker": [
            "The ticker field is required."
        ]
    }
}
```

```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "ticker": [
            "The selected ticker is invalid."
        ]
    }
}
```

```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "network": [
            "Unsupported network"
        ]
    }
}
```

```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "network": [
            "The network must be a string."
        ],
        "ticker": [
            "The ticker must be a string."
        ]
    },
}
```

</details>

___

## Codes

### Create code

```
[POST] /api/v4/main-account/codes
```
This endpoint creates WhiteBIT code.

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
ticker | String | **Yes** | Currency's ticker. Example: BTC
amount | Numeric string | **Yes** | Amount to transfer. Max precision = 8, value should be greater than zero and your main balance.
passphrase | String | **No** | Passphrase that will be used for applying codes. Passphrase must contain only latin letters, numbers and symbols (like !@#$%^, no whitespaces).  Max: 25 symbols.
description | String | **No** | Additional text description for code. Visible only for creator Max: 75 symbols.

**Request BODY raw:**
```json5
{
    "ticker" : "ETH",
    "amount" : "0.002",
    "passphrase": "some passphrase",
    "description": "some description",
    "request": "{{request}}",
    "nonce": "{{nonce}}"
}
```

**Response:**
Available statuses:
* `Status 201 if all validations succeeded and creating transaction is started`
* `Status 400 if request validation failed`
* `Status 422 if inner validation failed`

Response error codes:
* 0 - Fiat are available on the front-end only
* 1 - currency is not withdrawable
* 2 - specified address is invalid
* 3 - amount is too small
* 4 - amount is too small for the payment system
* 5 - not enough balance
* 6 - amount is less than or equals fee

```json5
{
    "code": "WBe11f4fce-2a53-4edc-b195-66b693bd77e3ETH",         // generated WhiteBIT code
    "message": "Code was successfully created"
}

```
<details>
<summary><b>Errors:</b></summary>

```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "amount": [
            "The amount field is required."
        ],
        "ticker": [
            "The ticker field is required."
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
            "The amount must be a number.",
            "Invalid number"
        ],
        "description": [
            "The description must be a string."
        ],
        "passphrase": [
            "The passphrase must be a string."
        ],
        "ticker": [
            "The selected ticker is invalid."
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
            "The amount must be at least 0."
        ],
        "description": [
            "The description may not be greater than 75 characters."
        ],
        "passphrase": [
            "The passphrase may not be greater than 25 characters."
        ],
        "ticker": [
            "The selected ticker is invalid."
        ]
    }
}
```
Errors for unconfirmed users (without KYC):
```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "amount": [
            "This currency has no active pairs or it may have been delisted. Its rate cannot be calculated at the moment.",
            "Current limit exceeded"
        ]
    }
}
```
Also, fiat currencies can't be withdrawn without KYC:
```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "amount": [
            "Your account must be verified"
        ]
    }
}
```
Passphrase must contain only latin letters, numbers and symbols (like !@#$%^, no whitespaces)
```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "passphrase": [
            "The passphrase format is invalid."
        ]
    }
}

```


</details>

___

### Apply code

```
[POST] /api/v4/main-account/codes/apply
```
This endpoint applies WhiteBIT code.

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
code | String | **Yes** | Code that will be applied.
passphrase | String | **No** | Should be provided if the code was created with passphrase Max: 25 symbols.

**Request BODY raw:**
```json5
{
    "code" : "WBe11f4fce-2a53-4edc-b195-66b693bd77e3ETH",
    "passphrase": "some passphrase",
    "request": "{{request}}",
    "nonce": "{{nonce}}"
}
```

**Response:**
Available statuses:
* `Status 201 if all validations succeeded and creating transaction is started`
* `Status 400 if request validation failed`
* `Status 422 if inner validation failed`


```json5
{
    "message": "Code was successfully applied",
    "ticker": "ETH",
    "amount": "0.002"
}

```
<details>
<summary><b>Errors:</b></summary>

```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "code": [
            "The code field is required."
        ]
    }
}
```

```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "code": [
            "Incorrect code or passphrase"
        ]
    }
}
```

</details>

___

### Get my codes

```
[POST] /api/v4/main-account/codes/my
```
This endpoint retrieves the list of WhiteBIT codes created by my account.


**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
limit | Int | **No** | LIMIT is a special clause used to limit records a particular query can return. Default: 30, Min: 1, Max: 100
offset | Int | **No** | If you want the request to return entries starting from a particular line, you can use OFFSET clause to tell it where it should start. Default: 0, Min: 0, Max: 10000


**Request BODY raw:**
```json5
{
    "request": "{{request}}",
    "nonce": "{{nonce}}"
}
```

**Response:**
Available statuses:
* `Status 201 if all validations succeeded and creating transaction is started`
* `Status 400 if request validation failed`
* `Status 422 if inner validation failed`


```json5
{
    "total": 15,
    "data": [
        {
            "amount": "0.002",                                          // code amount
            "code": "WBe11f4fce-2a53-4edc-b195-66b693bd77e3ETH",        // code
            "date": 1598296332,                                         // code creation timestamp
            "status": "Activated",                                      // code status
            "ticker": "ETH"                                             // code ticker
        },
        {...}
    ],
    "limit": 30,
    "offset": 0
}


```
<details>
<summary><b>Errors:</b></summary>

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

</details>

___

### Get codes history

```
[POST] /api/v4/main-account/codes/history
```
This endpoint retrieves the whole codes history on your account.


**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
limit | Int | **No** | LIMIT is a special clause used to limit records a particular query can return. Default: 30, Min: 1, Max: 100
offset | Int | **No** | If you want the request to return entries starting from a particular line, you can use OFFSET clause to tell it where it should start. Default: 0, Min: 0, Max: 10000


**Request BODY raw:**
```json5
{
    "request": "{{request}}",
    "nonce": "{{nonce}}"
}
```

**Response:**
Available statuses:
* `Status 201 if all validations succeeded and creating transaction is started`
* `Status 400 if request validation failed`
* `Status 422 if inner validation failed`


```json5
{
    "total": 29,
    "data": [
        {
            "amount": "+0.002",                                           // code amount change; - is created; + is applied
            "code": "WBe11f4fce-2a53-4edc-b195-66b693bd77e3ETH",          // code
            "date": 1598296734,                                           // code activation timestamp
            "status": "Activated",                                        // current code status
            "ticker": "ETH"                                               // code ticker
        },
        {
            "amount": "-0.002",                                           // code amount change; - is created; + is applied
            "code": "WBe11f4fce-2a53-4edc-b195-66b693bd77e3ETH",          // code
            "date": 1598296332,                                           // code creation timestamp
            "status": "Activated",                                        // current code status
            "ticker": "ETH"                                               // code ticker
        },
        {...}
    ],
    "limit": 100,
    "offset": 0
}



```
<details>
<summary><b>Errors:</b></summary>

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

</details>

___

## SMART Staking

This API provides endpoints for interacting with SMART Staking: getting active plans, creating/closing investments, retrieving investments/interest payments history.

These endpoints are available only for B2B partner services, you need to contact support@whitebit.com in order to get permissions to use these endpoints.

### Get plans

```
[POST] /api/v4/main-account/smart/plans
```

This endpoint retrieves all active SMART plans

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
ticker | String | **No** | Invest plan source currency's ticker. Example: BTC

**Request BODY raw:**
```json5
{
    "ticker": "USDT",
    "request": "{{request}}",
    "nonce": "{{nonce}}"
}
```

**Response:**

Available statuses:
* `Status 200`
* `Status 400 if request validation failed`

```json5
[
  {
    "id": "8e667b4a-0b71-4988-8af5-9474dbfaeb51", // Invest plan identifier
    "ticker": "USDT",                             // Source currency ticker
    "status": 1,                                  // Status (1 - active, 2 - no coins left, 3 - inactive, 4 - pause)
    "percent": "10",                              // Interest percent
    "duration": 14400,                            // Investment duration (in minutes)
    "interestTicker": "USDT",                     // Target currency ticker
    "interestRatio": "1",                         // Target currency to source currency ratio, see note
    "minInvestment": "100",                       // Min investment amount
    "maxInvestment": "10000",                     // Max investment amount
    "maxPossibleInvestment": "3000"               // Max investment amount due to current invest plan state
  }
]
```

<details>
<summary><b>Errors:</b></summary>

```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "ticker": [
            "The selected ticker is invalid."
        ]
    }
}
```

</details>

_Note_: when target currency is different from source currency, interest amount in target currency will be calculated using `interestRatio` value.

Examples:
* When source currency = USDT, target currency = BTC and interest ratio = 40000,
it means that you will receive interest in BTC that equals interest amount in USDT divided by interest ratio (in this case 0.000025 BTC per each 1 USDT of interest amount).
* When source currency equals target currency, interest ratio equals 1.

___

### Invest

```
[POST] /api/v4/main-account/smart/investment
```

This endpoint creates a new investment to the specified invest plan

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
planId | String | **Yes** | Invest plan identifier
amount | Numeric String | **Yes** | Investment amount

**Request BODY raw:**
```json5
{
    "planId": "8e667b4a-0b71-4988-8af5-9474dbfaeb51",
    "amount": "100",
    "request": "{{request}}",
    "nonce": "{{nonce}}"
}
```

**Response:**

Available statuses:
* `Status 201`
* `Status 400 if request validation failed`
* `Status 422 if inner validation failed`

```json5
{
  "id": "0d7b66ff-1909-4938-ab7a-d16d9a64dcd5" // Investment identifier
}
```

<details>
<summary><b>Errors:</b></summary>

Request validation exceptions

```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "planId": [
            "The selected planId is invalid."
        ],
        "amount": [
            "The amount must be a number.",
            "Invalid number"
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
            "The amount must be at least 0.000001."
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
            "The amount you are trying to invest is bigger than the amount left in this SMART plan. Please try investing a smaller amount."
        ]
    }
}
```

```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "planId": [
            "Plan is disabled"
        ]
    }
}
```

```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "planId": [
            "Plan is inactive"
        ]
    }
}
```

```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "planId": [
            "There are no coins left in the plan"
        ]
    }
}
```

```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "planId": [
            "There are no coins left in the plan"
        ]
    }
}
```

```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "planId": [
            "Plan is paused"
        ]
    }
}
```

Inner validation exceptions

When investment already exists, and you don't have permissions to create multiple investments by plan
```json5
{
    "code": 1,
    "message": "Inner validation failed",
    "errors": {
        "planId": [
            "The investment in this investment plan already exists"
        ]
    }
}
```

When amount is less than min investment amount
```json5
{
    "code": 2,
    "message": "Inner validation failed",
    "errors": {
        "amount": [
            "The amount you're trying to invest is lower than the minimum amount in this investment plan."
        ]
    }
}
```

When amount is greater than max investment amount
```json5
{
    "code": 3,
    "message": "Inner validation failed",
    "errors": {
        "amount": [
            "The amount you're trying to invest exceeds the maximum amount in this investment plan."
        ]
    }
}
```

When there is not enough balance to create investment
```json5
{
    "code": 4,
    "message": "Inner validation failed",
    "errors": {
        "amount": [
            "Insufficient coins on your balance. 9 available, you're trying to invest 10"
        ]
    }
}
```

When there are no funds in plan to cover target interest amount
```json5
{
    "code": 5,
    "message": "Inner validation failed",
    "errors": {
        "amount": [
            "Insufficient funds for the payment."
        ]
    }
}
```

</details>

___

### Close investment

```
[POST] /api/v4/main-account/smart/investment/close
```

This endpoint closes active investment

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
id | String | **Yes** | Investment identifier

**Request BODY raw:**
```json5
{
    "id": "0d7b66ff-1909-4938-ab7a-d16d9a64dcd5",
    "request": "{{request}}",
    "nonce": "{{nonce}}"
}
```

**Response:**

Available statuses:
* `Status 200`
* `Status 400 if request validation failed`

```json5
{}
```

<details>
<summary><b>Errors:</b></summary>

```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "id": [
            "Investment not found"
        ]
    }
}
```

</details>

___

### Get investments history

```
[POST] /api/v4/main-account/smart/investments
```

This endpoint retrieves an investments history

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
id | String | **No** | Investment identifier
ticker | String | **No** | Invest plan source currency's ticker
status | Integer | **No** | Investment status (1 - active, 2 - closed)
limit | Int | **No** | LIMIT is a special clause used to limit records a particular query can return. Default: 100, Min: 1, Max: 100
offset | Int | **No** | If you want the request to return entries starting from a particular line, you can use OFFSET clause to tell it where it should start. Default: 0, Min: 0, Max: 10000

**Request BODY raw:**
```json5
{
    "id": "0d7b66ff-1909-4938-ab7a-d16d9a64dcd5",
    "ticker": "USDT",
    "status": 1,
    "request": "{{request}}",
    "nonce": "{{nonce}}"
}
```

**Response:**

Available statuses:
* `Status 200`
* `Status 400 if request validation failed`

```json5
{
    "offset": 0,
    "limit": 100,
    "records": [
        {
            "id": "0d7b66ff-1909-4938-ab7a-d16d9a64dcd5",     // Investment id
            "plan": {                                         // Similar to the record from Get plans response
                "id": "8e667b4a-0b71-4988-8af5-9474dbfaeb51",
                "ticker": "USDT",
                "status": 1,
                "percent": "10",
                "duration": 14400,
                "interestTicker": "USDT",
                "interestRatio": "1",
                "minInvestment": "100",
                "maxInvestment": "10000",
                "maxPossibleInvestment": "3000"
            },
            "status": 1,                                      // Investment status (1 - active, 2 - closed)
            "created": 1646825196,                            // Timestamp of investment creation
            "updated": 1646825196,                            // Timestamp of investment update
            "paymentTime": 1646839596,                        // Timestamp of the payment time
            "amount": "100",                                  // Investment amount
            "interestPaid": "0"                               // Interest paid amount
        }
    ]
}
```

<details>
<summary><b>Errors:</b></summary>

```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "id": [
            "The selected id is invalid."
        ],
        "ticker": [
            "The selected ticker is invalid."
        ],
        "status": [
            "The selected status is invalid."
        ]
    }
}
```

</details>

---

### Get interest payments history

```
[POST] /api/v4/main-account/smart/interest-payment-history
```

This endpoint retrieves the history of interest payments


**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
planId | String | **No** | Invest plan identifier
ticker | String | **No** | Invest plan target currency's ticker
limit | Int | **No** | LIMIT is a special clause used to limit records a particular query can return. Default: 100, Min: 1, Max: 100
offset | Int | **No** | If you want the request to return entries starting from a particular line, you can use OFFSET clause to tell it where it should start. Default: 0, Min: 0, Max: 10000

**Request BODY raw:**
```json5
{
    "planId": "8e667b4a-0b71-4988-8af5-9474dbfaeb51",
    "ticker": "USDT",
    "request": "{{request}}",
    "nonce": "{{nonce}}"
}
```

**Response:**

Available statuses:
* `Status 200`
* `Status 400 if request validation failed`

```json5
{
    "offset": 0,
    "limit": 100,
    "records": [
        {
            "planId": "8e667b4a-0b71-4988-8af5-9474dbfaeb51",         // Invest plan identifier
            "investmentId": "0d7b66ff-1909-4938-ab7a-d16d9a64dcd5",   // Investment identifier
            "amount": "10",                                           // Interest amount
            "ticker": "USDT",                                         // Interest currency ticker
            "timestamp": 1646839596                                   // Transaction timestamp
        }
    ]
}
```

<details>
<summary><b>Errors:</b></summary>

```json5
{
    "code": 0,
    "message": "Validation failed",
    "errors": {
        "planId": [
            "The selected planId is invalid."
        ],
        "ticker": [
            "The selected ticker is invalid."
        ],
    }
}
```

</details>

---

## Fees

This API provides an endpoint for getting deposit/withdrawal fees and limits by all currencies

### Get fees 

Returns an array of objects containing deposit/withdrawal settings for the corresponding currencies.
Zero value in amount fields means that the setting is disabled.

```
[POST] /api/v4/main-account/fee
```

**Response:**

Available statuses:
* `Status 200`

```json5
[
  {
    "ticker": "BTC",          // Ticker
    "name": "Bitcoin",        // Currency name
    "can_deposit": "0",       // Status currency
    "can_withdraw": "0",      // Status currency
    "deposit": {              // Deposit fees/limits
      "minFlex": "0",         // Min fee amount when flex fee is enabled
      "maxFlex": "0",         // Max fee amount when flex fee is enabled
      "percentFlex": "0",     // Flex fee percent
      "fixed": "0",           // Fixed fee
      "minAmount": "0.0005",  // Min deposit amount
      "maxAmount": "0"        // Max deposit amount
    },
    "withdraw": {             // Withdrawal fees/limits
      "minFlex": "0",         // Min fee amount when flex fee is enabled
      "maxFlex": "0",         // Max fee amount when flex fee is enabled
      "percentFlex": "0",     // Flex fee percent
      "fixed": "0.0004",      // Fixed fee
      "minAmount": "0.001",   // Min withdrawal amount
      "maxAmount": "0"        // Max withdrawal amount
    }
  }
]
```

---
