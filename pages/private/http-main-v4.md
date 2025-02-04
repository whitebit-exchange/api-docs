# Private HTTP API V4 for Main balance changes

- [Error messages V4 format](#error-messages-v4-format)
  - [Main balance](#main-balance)
  - [Get cryptocurrency deposit address](#get-cryptocurrency-deposit-address)
  - [Get fiat deposit address](#get-fiat-deposit-address)
  - [Create withdraw request](#create-withdraw-request)
  - [Create withdraw request with the specific withdraw amount (fee is not included)](#create-withdraw-request-with-the-specific-withdraw-amount-fee-is-not-included)
  - [Transfers between balances](#transfer-between-balances)
  - [Get deposit/withdraw history](#get-depositwithdraw-history)
  - [Create new address for deposit](#create-new-address-for-deposit)
  - [Codes](#codes)
    - [Create code](#create-code)
    - [Apply code](#apply-code)
    - [Get my codes](#get-my-codes)
    - [Get codes history](#get-codes-history)
  - [Crypto Lending](#crypto-lending)
    - [Get plans](#get-plans)
    - [Invest](#invest)
    - [Close investment](#close-investment)
    - [Get investments history](#get-investments-history)
    - [Get interest payments history](#get-interest-payments-history)
  - [Fees](#fees)
    - [Get fees](#get-fees)
  - [Sub Account](#sub-account)
    - [Create Sub-Account](#create-sub-account)
    - [Delete Sub-Account](#delete-sub-account)
    - [Edit Sub-Account](#edit-sub-account)
    - [List of Sub-Accounts](#list-of-sub-accounts)
    - [Sub-Account Transfer](#sub-account-transfer)
    - [Block Sub-Account](#block-sub-account)
    - [Unblock Sub-Account](#unblock-sub-account)
    - [Sub-Account Balances](#sub-account-balances)
    - [Get Sub-Account Transfer History](#get-sub-account-transfer-history)
  - [Mining Pool](#mining-pool)
    - [Get Rewards](#get-rewards)

Base URL is https://whitebit.com

Endpoint example: https://whitebit.com/api/v4/{endpoint}

All endpoints return time in Unix-time format.

All endpoints return either a **JSON** object or array.

For receiving responses from API calls please use http method **POST**

### Error messages V4 format

---

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

### Main balance

```
[POST] /api/v4/main-account/balance
```

This endpoint retrieves the [main balance](./../glossary.md#balance-main) by currency [ticker](./../glossary.md#ticker) or all balances.

❗ Rate limit 1000 requests/10 sec.

**Response is cached for:**
NONE

**Parameters:**

| Name   | Type   | Mandatory | Description                                                |
| ------ | ------ | --------- | ---------------------------------------------------------- |
| ticker | String | **No**    | Currency's [ticker](./../glossary.md#ticker). Example: BTC |

**Request BODY raw:**

```json
{
  "request": "{{request}}",
  "nonce": "{{nonce}}"
}
```

**Response:**

Available statuses:

- `Status 200`
- `Status 400 if request validation failed`

```json
{
    "BSV": {
        "main_balance": "0"     // main balance volume of BSV
    },
    "BTC": {
        "main_balance": "0"     // main balance volume of BTC
    },
    "BTG": {
        "main_balance": "0"     // main balance volume of BTG
    },
    "BTT": {
        "main_balance": "0"     // main balance volume of BTT
    },
    "XLM": {
        "main_balance": "36.48" // main balance volume of XLM
    },
}
```

<details>
<summary><b>Errors:</b></summary>

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "ticker": ["The selected ticker is invalid."]
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

❗ Rate limit 1000 requests/10 sec.

**Response is cached for:**
NONE

**Parameters:**

| Name    | Type   | Mandatory                                                             | Description                                                                                                                                                                                                                                               |
| ------- | ------ | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ticker  | String | **Yes**                                                               | Currencies [ticker](./../glossary.md#ticker). Example: BTC ⚠ Currency ticker should not be [fiat](./../glossary.md#fiat) and it's "can_deposit" status must be "true". You can find this status in https://whitebit.com/api/v4/public/assets response.   |
| network | String | **Yes, if currency is [multinetwork](./../glossary.md#multinetwork)** | Cryptocurrency network. ⚠ If currency has multiple networks like USDT - you need to specify network to be used. You can find [ticker](./../glossary.md#ticker) networks list in "networks" field from response https://whitebit.com/api/v4/public/assets. |

**Request BODY raw:**

```json
{
  "ticker": "BTC",
  "request": "{{request}}",
  "nonce": "{{nonce}}"
}
```

**Request BODY (for multinetwork currency) raw:**

```json
{
  "ticker": "USDT",
  "network": "ERC20",
  "request": "{{request}}",
  "nonce": "{{nonce}}"
}
```

**Response:**
Available statuses:

- `Status 200`
- `Status 400 if request validation failed`
- `Status 503 if service temporary unavailable`

```json
{
  "account": {
    "address": "GDTSOI56XNVAKJNJBLJGRNZIVOCIZJRBIDKTWSCYEYNFAZEMBLN75RMN", // deposit address
    "memo": "48565488244493"                                               // memo if currency requires memo
  },
  "required": {
    "fixedFee": "0",  // fixed deposit fee
    "flexFee": {      // flexible fee - is fee that use percent rate
      "maxFee": "0",  // maximum fixed fee that you will pay
      "minFee": "0",  // minimum fixed fee that you will pay
      "percent": "0"  // percent of deposit that you will pay
    },
    "maxAmount": "0", // max amount of deposit that can be accepted by exchange - if you deposit more than that number, it won't be accepted by exchange
    "minAmount": "1"  // min amount of deposit that can be accepted by exchange - if you will deposit less than that number, it won't be accepted by exchange
  }
}
```

<details>
<summary><b>Errors:</b></summary>

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "ticker": ["The selected ticker is invalid."]
  }
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "network": ["The selected network is invalid."]
  }
}
```

```json
{
  "code": 1,
  "message": "Inner validation failed",
  "errors": {
    "ticker": ["Currency is not deposable"]
  }
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "ticker": ["Fiat deposits are available only on the website"]
  }
}
```

</details>

---

### Get fiat deposit address

```
[POST] /api/v4/main-account/fiat-deposit-url
```

This endpoint retrieves a deposit url of the [fiat](./../glossary.md#fiat) invoice. Please, pay attention that this endpoint works on demand. It means that you need to contact WhiteBIT support and provide your API key to get access to this functionality.

❗ Rate limit 1000 requests/10 sec.

**Response is cached for:**
NONE

**Parameters:**

| Name                         | Type           | Mandatory                                                                              | Description                                                                                                                                                                                                                                                 |
|------------------------------| -------------- |----------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ticker                       | String         | **Yes**                                                                                | Currencies [ticker](./../glossary.md#ticker). Example: UAH ⚠ Currencies ticker should be: [fiat](./../glossary.md#fiat) and has "can_deposit" status must be "true". Use this [url](https://whitebit.com/api/v4/public/assets) to know more about currency. |
| provider                     | String         | **Yes**                                                                                | [Fiat](./../glossary.md#fiat) currency provider. Example: VISAMASTER ⚠ Currency [provider](./../glossary.md#provider) should be taken from https://whitebit.com/api/v4/public/assets response.                                                              |
| amount                       | Numeric String | **Yes**                                                                                | Deposit amount.                                                                                                                                                                                                                                             |
| uniqueId                     | String         | **Yes**                                                                                | Unique transaction identifier on client's side.                                                                                                                                                                                                             |
| customer.firstName           | String         | **Yes, if currency USD or EUR with VISAMASTER [provider](./../glossary.md#provider)**  | Customer billing first name                                                                                                                                                                                                                                 |
| customer.lastName            | String         | **Yes, if currency USD or EUR with VISAMASTER [provider](./../glossary.md#provider)**  | Customer billing last name                                                                                                                                                                                                                                  |
| customer.email               | String         | **Yes, if currency USD or EUR with VISAMASTER [provider](./../glossary.md#provider)**  | Customer billing email                                                                                                                                                                                                                                      |
| customer.address.line1       | String         | **Yes, if currency USD or EUR with VISAMASTER [provider](./../glossary.md#provider)**  | Customer address line1                                                                                                                                                                                                                                      |
| customer.address.line2       | String         | **No**                                                                                 | Customer address line2                                                                                                                                                                                                                                      |
| customer.address.city        | String         | **Yes, if currency USD or EUR with VISAMASTER [provider](./../glossary.md#provider)**  | Customer city                                                                                                                                                                                                                                               |
| customer.address.zipCode     | String         | **Yes, if currency USD or EUR with VISAMASTER [provider](./../glossary.md#provider)**  | Customer zip-code                                                                                                                                                                                                                                           |
| customer.address.countryCode | String         | **Yes, if currency USD or EUR with VISAMASTER [provider](./../glossary.md#provider)**  | Customer country code                                                                                                                                                                                                                                       |
| successLink                  | String         | **No**                                                                                 | Customer will be redirected to this URL by acquiring [provider](./../glossary.md#provider) after success deposit. To activate this feature, please contact support                                                                                          |
| failureLink                  | String         | **No**                                                                                 | Customer will be redirected to this URL in case of fail or rejection on acquiring [provider](./../glossary.md#provider) side. To activate this feature, please contact support                                                                              |
| returnLink                   | String         | **No**                                                                                 | Customer will be redirected to the URL defined if selects 'back' option after from the payment success or failure page. To activate this feature, define desired link. If not populated, option 'back' won't be displayed                                   |

**Request BODY raw:**

```json
{
  "ticker": "UAH",
  "provider": "VISAMASTER",
  "amount": "100",
  "uniqueId": "{{generateID}}",
  "request": "{{request}}",
  "nonce": "{{nonce}}"
}
```

**Request BODY with customer fields raw:**

```json
{
  "ticker": "UAH",
  "provider": "VISAMASTER",
  "amount": "100",
  "uniqueId": "{{generateID}}",
  "customer": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john_doe@email.com",
    "address": {
      "line1":"Martinez Campos 37",
      "city":"Madrid",
      "zipCode":"28010",
      "countryCode":"ES"
    }
  },
  "request": "{{request}}",
  "nonce": "{{nonce}}"
}
```

**Response:**
Available statuses:

- `Status 200`
- `Status 400 if request validation failed`
- `Status 503 if service temporary unavailable`

```json
{
  "url": "https://someaddress.com" // address for deposit
}
```

**⚠ If you have used VISAMASTER as [provider](./../glossary.md#provider), you must pass [referer header](https://developer.mozilla.org/ru/docs/Web/HTTP/Headers/Referer) when you go to the invoice link (for example, pass `referer` header when you go to `https://someaddress.com`). Otherwise if there is no header (for example, you go to `https://someaddress.com` from Telegram message) you will be redirected to the WhiteBIT homepage**

<details>
<summary><b>Errors:</b></summary>

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "amount": ["Amount is too little for deposit"]
  }
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "provider": ["Cannot find currency for specified provider"]
  }
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "uniqueId": ["The unique id has already been taken."]
  }
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "amount": ["The amount must be a number."],
    "provider": ["The selected provider is invalid."],
    "ticker": ["The selected ticker is invalid."]
  }
}
```

```json
{
  "code": 10,
  "message": "Failed to generate deposit url"
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "amount": ["The amount field is required."],
    "provider": ["The provider field is required."],
    "ticker": ["The ticker field is required."],
    "uniqueId": ["The unique id field is required."]
  }
}
```

```json
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

```json
{
  "success": false,
  "message": "You don't have permission to use this endpoint. Please contact support for more details",
  "code": 0
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "successLink": ["Uri domain must have only https scheme"],
    "failureLink": ["Uri domain must have only https scheme"]
  }
}
```

</details>

---

### Create withdraw request

```
[POST] /api/v4/main-account/withdraw
```

This endpoint creates withdraw for the specified ticker.

❗ Rate limit 1000 requests/10 sec.

**Response is cached for:**
NONE

**Parameters:**

| Name                  | Type           | Mandatory                                                                                                           | Description                                                                                                                                                                                                                                                              |
|-----------------------| -------------- |---------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ticker                | String         | **Yes**                                                                                                             | Currencies [ticker](./../glossary.md#ticker). Example: BTC ⚠ Currencies ticker must have "can_deposit" status equal to "true". Use this [url](https://whitebit.com/api/v4/public/assets) to know more about currency.                                                    |
| amount                | Numeric string | **Yes**                                                                                                             | Withdraw amount (including [fee](./../glossary.md#fee)). If you want fee to be added to the specified amount, you need to use [/main-account/withdraw-pay](#create-withdraw-request-with-specifying-absolute-withdraw-amount) request (see examples there)               |
| address               | String         | **Yes**                                                                                                             | Target address (wallet address for cryptocurrencies, identifier/card number for [fiat](./../glossary.md#fiat) currencies)                                                                                                                                                |
| memo                  | String         | **Yes, if currency is memoable**                                                                                    | Target address (wallet address for cryptocurrencies, identifier/card number for [fiat](./../glossary.md#fiat) currencies)                                                                                                                                                |
| uniqueId              | String         | **Yes**                                                                                                             | Unique transaction identifier. ⚠ Note that you should generate new unique id for each withdrawal request.                                                                                                                                                                |
| provider              | String         | **Yes, if currency is fiat**                                                                                        | [Fiat](./../glossary.md#fiat) currency [provider](./../glossary.md#provider). Example: VISAMASTER ⚠ Currency provider should be taken from https://whitebit.com/api/v4/public/assets response.                                                                           |
| network               | String         | **No**                                                                                                              | Cryptocurrency network. Available for multi network currencies. Example: OMNI ⚠ Currency network should be taken from https://whitebit.com/api/v4/public/assets response. Default for USDT is ERC20                                                                      |
| partialEnable         | Boolean        | **No**                                                                                                              | Optional parameter for [FIAT](./../glossary.md#fiat) withdrawals with increased Maximum Limit if set as "true". In order to use this parameter your application should support "Partially successful" withdrawal status and latest updates in deposit/withdrawal history. |
| beneficiary           | Object         | **Yes, if currency [ticker](./../glossary.md#ticker) is one of: UAH_IBAN, USD_VISAMASTER, EUR_VISAMASTER, USD, EUR** | Beneficiary information data array.                                                                                                                                                                                                                                      |
| beneficiary.firstName | String         | **Yes, if currency [ticker](./../glossary.md#ticker) is one of: UAH_IBAN, USD_VISAMASTER, USD, EUR**                | Beneficiary first name. Max length: 40 symbols, latin letters and special characters.                                                                                                                                                                                    |
| beneficiary.lastName  | String         | **Yes, if currency [ticker](./../glossary.md#ticker) is one of: UAH_IBAN, USD_VISAMASTER, USD, EUR**                | Beneficiary last name. Max length: 40 symbols, latin letters and special characters.                                                                                                                                                                                     |
| beneficiary.tin       | Integer        | **Yes, if currency is UAH_IBAN**                                                                                    | Beneficiary TAX payer number. Integer, 10 digits.                                                                                                                                                                                                                        |
| beneficiary.phone     | String         | **Yes, if currency [ticker](./../glossary.md#ticker) is one of: USD_VISAMASTER, EUR_VISAMASTER**                    | Beneficiary phone number.                                                                                                                                                                                                                                                |
| beneficiary.email     | String         | **Yes, if currency [ticker](./../glossary.md#ticker) is one of: USD_VISAMASTER, EUR_VISAMASTER**                    | Beneficiary email.                                                                                                                                                                                                                                                       |
| travelRule            | Object         | **Yes, if currency is crypto and you are from [EEA](../glossary#eea)**                                                                  | Travel Rule information data array
| travelRule.type       | String         | **Yes, if currency is crypto and you are from [EEA](../glossary#eea)**                                                                  | Travel rule receiver type. Values: "individual" or "entity"
| travelRule.vasp       | String         | **Yes, if currency is crypto and you are from [EEA](../glossary#eea)**                                                                  | Travel rule destination platform (VASP) name.
| travelRule.name       | String         | **Yes, if currency is crypto and you are from [EEA](../glossary#eea)**                                                                  | Travel rule. If individual - first_name ; if entity - entity_name
| travelRule.address    | String         | **Yes, if currency is crypto and you are from [EEA](../glossary#eea)**                                                                  | Travel rule. If individual - last_name ; if entity - entity_address

**Request BODY raw:**
<a href="#withdraw-request-body-crypto"></a>

```json
{
  "ticker": "ETH",
  "amount": "0.9",
  "address": "0x0964A6B8F794A4B8d61b62652dB27ddC9844FB4c",
  "uniqueId": "24529041",
  "request": "{{request}}",
  "nonce": "{{nonce}}"
}
```

**Request BODY (for multinetwork currency) raw:**
<a href="#withdraw-request-body-multinetwork"></a>

```json
{
  "ticker": "USDT",
  "amount": "0.9",
  "address": "0x0964A6B8F794A4B8d61b62652dB27ddC9844FB4c",
  "uniqueId": "24529042",
  "network": "ERC20",
  "request": "{{request}}",
  "nonce": "{{nonce}}"
}
```

**Request BODY (for fiat currency) raw:**
<a href="#withdraw-request-body-fiat"></a>

```json
{
  "ticker": "UAH",
  "amount": "100",
  "provider": "VISAMASTER",
  "uniqueId": "24529043",
  "request": "{{request}}",
  "nonce": "{{nonce}}"
}
```

**Request BODY (for fiat currency with partialEnable) raw:**
<a href="#withdraw-request-body-fiat-partial"></a>

```json
{
  "ticker": "UAH",
  "amount": "50000",
  "address": "4111111111111111",
  "provider": "VISAMASTER_PAYCORE",
  "partialEnable": true,
  "uniqueId": "24529045",
  "request": "{{request}}",
  "nonce": "{{nonce}}"
}
```

**Request BODY (for fiat IBAN currency) raw:**
<a href="#withdraw-request-body-fiat-iban"></a>

```json
{
  "ticker": "UAH",
  "amount": "50000",
  "address": "UA213223130000026007233566001",
  "beneficiary": {
    "firstName": "Firstname",
    "lastName": "Lastname",
    "tin": 1000000000
  },
  "provider": "UAH_IBAN",
  "uniqueId": "24529045",
  "request": "{{request}}",
  "nonce": "{{nonce}}"
}
```

**Request BODY (for fiat USD_VISAMASTER, EUR_VISAMASTER payment providers) raw:**
<a href="#withdraw-request-body-fiat-visamaster"></a>

```json
{
  "ticker": "USD",
  "amount": "30000",
  "address": "4111111111111111",
  "beneficiary": {
    "firstName": "Firstname",
    "lastName": "Lastname",
    "phone": "1234567891",
    "email": "john_doe@email.com"
  },
  "provider": "USD_VISAMASTER",
  "uniqueId": "24529045",
  "request": "{{request}}",
  "nonce": "{{nonce}}"
}
```


**Request BODY for travel rule raw:**
<a href="#withdraw-request-body-travel-rule"></a>

```json
{
  "ticker": "BTC",
  "amount": "0.5",
  "address": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  "uniqueId": "24529046",
  "travelRule": {
    "type": "individual",
    "vasp": "Binance",
    "name": "John",
    "address": "Doe"
  },
  "request": "{{request}}",
  "nonce": "{{nonce}}"
}
```

**Request BODY for travel rule with entity type raw:**
<a href="#withdraw-request-body-travel-rule-entity"></a>

```json
{
  "ticker": "BTC",
  "amount": "1.2",
  "address": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  "uniqueId": "24529047",
  "travelRule": {
    "type": "entity",
    "vasp": "Kraken",
    "name": "Acme Corp",
    "address": "123 Business Street, London, UK"
  },
  "request": "{{request}}",
  "nonce": "{{nonce}}"
}
```

**Response:**
Available statuses:

- `Status 201 if validation succeeded and withdraw creation process is started`
- `Status 400 if request validation failed`
- `Status 422 if inner validation failed`

Response error codes:

- 1 - currency is not withdrawable
- 2 - specified address is invalid
- 3 - amount is too small
- 4 - amount is too small for the payment system
- 5 - not enough balance
- 6 - amount is less than or equals [fee](./../glossary.md#fee)
- 7 - amount should be integer (can happen for currencies with zero [precision](./../glossary.md#precision) like Neo)
- 8 - target withdraw amount without [fee](./../glossary.md#fee) equals zero
- 9 - address is unavailable (occurs for withdraws to own address)

```json
[
  // empty array - has success status - go to deposit/withdraw history and check you request status by uniqueId
]
```

<details>
<summary><b>Errors:</b></summary>

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "address": ["The address field is required."],
    "amount": ["The amount field is required."],
    "ticker": ["The ticker field is required."],
    "uniqueId": ["The unique id field is required."]
  }
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "uniqueId": ["The unique id has already been taken."]
  }
}
```

Errors for unconfirmed users (without KYC):

```json
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

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "amount": ["Your account must be verified"]
  }
}
```

```json
{
  "code": 2,
  "message": "Inner validation failed",
  "errors": {
    "address": ["The address is invalid"]
  }
}
```

```json
{
  "code": 5,
  "message": "Inner validation failed",
  "errors": {
    "amount": ["Not enough money, Ethereum balance = 1"]
  }
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "ticker": ["The selected ticker is invalid."]
  }
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "provider": ["Provider is required for fiat currency"]
  }
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "memo": ["The memo field is required."]
  }
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "partialEnable": ["The partial enable field must be true or false."]
  }
}
```

```json
{
  "message": "Too Many Attempts.", // In case of throttling
  "code": 0
}
```

</details>

---

### Create withdraw request with the specific withdraw amount (fee is not included)

```
[POST] /api/v4/main-account/withdraw-pay
```

This endpoint has the similar logic as [/main-account/withdraw](#create-withdraw-request), but with the only difference: amount that is specified will not include [fee](./../glossary.md#fee) (it will be calculated to make target withdraw amount equal to the specified amount).

❗ Rate limit 1000 requests/10 sec.

**Response is cached for:**
NONE

Example:

- When you create base withdraw and set amount = 100 USD, receiver will recieve 100 USD - fee amount, and your balance will decrease by 100 USD.
- When you use this endpoint and set amount = 100 USD, receiver will recieve 100 USD, and your balance will decrease by 100 USD + [fee](./../glossary.md#fee) amount.

---

### Transfer between balances

```
[POST] /api/v4/main-account/transfer
```

This endpoint transfers the specified amount between [main](./../glossary.md#balance-main), [trade](./../glossary.md#balance-spotbalance-trade) and [collateral](./../glossary.md#balance-collateral) balances

❗ Rate limit 1000 requests/10 sec.

**Response is cached for:**
NONE

**Parameters:**

| Name   | Type           | Mandatory                             | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------ | -------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| method | String         | **No** if **from** and **to** are set | Method We highly recommend to use **from** and **to** fields, which provides more flexibility. This way will be deprecated in future. Example: **deposit** if you need to transfer from main to trade / **withdraw** if you need to transfer from [trade](./../glossary.md#balance-spotbalance-trade) balance to [main](./../glossary.md#balance-main). For [collateral balances](./../glossary.md#balance-collateral) you can use **collateral-deposit** to transfer from main to collateral balance and **collateral-withdraw** to transfer from collateral balance to main |
| from   | String         | **No** if **method** is set           | Balance FROM which funds will move to. Acceptable values: [**main**](./../glossary.md#balance-main), [**spot**](./../glossary.md#balance-spotbalance-trade), [**collateral**](./../glossary.md#balance-collateral)                                                                                                                                                                                                                                                                                                                                                            |
| to     | String         | **No** if **method** is set           | Balance TO which funds will move to. Acceptable values: [**main**](./../glossary.md#balance-main), [**spot**](./../glossary.md#balance-spotbalance-trade), [**collateral**](./../glossary.md#balance-collateral)                                                                                                                                                                                                                                                                                                                                                              |
| ticker | String         | **Yes**                               | Currency's [ticker](./../glossary.md#ticker). Example: BTC                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| amount | Numeric string | **Yes**                               | Amount to transfer. Max [precision](./../glossary.md#precision) = 8, value should be greater than zero and less or equal your available balance.                                                                                                                                                                                                                                                                                                                                                                                                                              |

**Request BODY raw:**

```json
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

- `Status 201 if all validations succeeded and creating transaction is started`
- `Status 400 if request validation failed`
- `Status 422 if inner validation failed`

Response error codes:

- 1 - transfers from [trade](./../glossary.md#balance-spotbalance-trade) to [main](./../glossary.md#balance-main) are disabled
- 2 - transfers from main to trade are disabled
- 3 - not enough balance

```json
[
  // empty array - has success status
]
```

<details>
<summary><b>Errors:</b></summary>

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "amount": ["The amount field is required."],
    "method": ["The method field is required."],
    "ticker": ["The ticker field is required."]
  }
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "ticker": ["The selected ticker is invalid."]
  }
}
```

Errors for unconfirmed users (without KYC):

```json
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

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "amount": ["Your account must be verified"]
  }
}
```

```json
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

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "method": ["The selected method is invalid."]
  }
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "amount": ["The amount must be at least 0.00000001."]
  }
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "amount": ["The amount must be a number.", "Invalid number"]
  }
}
```

```json
{
  "message": "Too Many Attempts.", // In case of throttling
  "code": 0
}
```

</details>

---

### Get deposit/withdraw history

```
[POST] /api/v4/main-account/history
```

This endpoint retrieves the history of deposits and withdraws

❗ Rate limit 200 requests/10 sec.

**Response is cached for:**
NONE

**Parameters:**

| Name              | Type   | Mandatory | Description                                                                                                                                                                                                                          |
| ----------------- | ------ | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| transactionMethod | Number | **No**    | Method. Example: **1** to display deposits / **2** to display withdraws. Do not send this parameter in order to receive both deposits and withdraws.                                                                                 |
| ticker            | String | **No**    | Currency's [ticker](./../glossary.md#ticker). Example: BTC                                                                                                                                                                           |
| address           | String | **No**    | Can be used for filtering transactions by specific address.                                                                                                                          |
| memo              | String | **No**    | Can be used for filtering transactions by specific [memo](./../glossary.md#memodestination-tag) |
| addresses         | Array  | **No**    | Can be used for filtering transactions by specific array of addresses (max: 20).                                                                                                             |
| uniqueId          | String | **No**    | Can be used for filtering transactions by specific unique id                                                                                                                                                                         |
| limit             | Int    | **No**   | LIMIT is a special clause used to limit records a particular query can return. Default: 50, Min: 1, Max: 100                                                                                                                         |
| offset            | Int    | **No**   | If you want the request to return entries starting from a particular line, you can use OFFSET clause to tell it where it should start. Default: 0, Min: 0, Max: 10000                                                                |
| status            | Array  | **No**    | Can be used for filtering transactions by status codes. ❗ Caution: You must use this parameter with appropriate `transactionMethod` and use valid status codes for this method. You can find them below. Example: `"status": [3,7]` |

| Deposit status codes:     |
| ------------------------- |
| `Successful` - 3, 7       |
| `Canceled` - 4, 9         |
| `Unconfirmed by user` - 5 |
| `Frozen` - 21         |
| `Uncredited` - 22         |
| `Pending` - 15            |

| Withdraw status codes:                              |
| --------------------------------------------------- |
| `Pending` - 1, 2, 6, 10, 11, 12, 13, 14, 15, 16, 17 |
| `Successful` - 3, 7                                 |
| `Canceled` - 4                                      |
| `Unconfirmed by user` - 5                           |
| `Frozen` - 21                                   |
| `Partially successful` - 18                         |

**Request BODY raw:**

```json
{
  "transactionMethod": "1",
  "ticker": "BTC",
  "offset": 0,
  "limit": 100,
  "status": [3, 7],
  "request": "{{request}}",
  "nonce": "{{nonce}}"
}
```

**Response:**
Available statuses:

- `Status 201 if all validations succeeded and creating transaction is started`
- `Status 400 if request validation failed`
- `Status 422 if inner validation failed`

```json
{
    "limit": 100,
    "offset": 0,
    "records": [
        {
            "address": "3ApEASLcrQtZpg1TsssFgYF5V5YQJAKvuE",                                        // deposit address
            "uniqueId": null,                                                                       // unique Id of deposit
            "createdAt": 1593437922,                                                                // timestamp of deposit
            "currency": "Bitcoin",                                                                  // deposit currency
            "ticker": "BTC",                                                                        // deposit currency ticker
            "method": 1,                                                                            // called method 1 - deposit, 2 - withdraw
            "amount": "0.0006",                                                                     // amount of deposit
            "description": "",                                                                      // deposit description
            "memo": "",                                                                             // deposit memo
            "fee": "0",                                                                             // deposit fee
            "status": 15,                                                                           // transactions status
            "network": null,                                                                        // if currency is multinetwork
            "transactionHash": "a275a514013e4e0f927fd0d1bed215e7f6f2c4c6ce762836fe135ec22529d886",  // deposit transaction hash
            "transactionId": "5e112b38-9652-11ed-a1eb-0242ac120002",                                // transaction id
            "details": {
                "partial": {                                                                        // details about partially successful withdrawals
                    "requestAmount": "50000",                                                       // requested withdrawal amount
                    "processedAmount": "39000",                                                     // processed withdrawal amount
                    "processedFee": "273",                                                          // fee for processed withdrawal amount
                    "normalizeTransaction": ""                                                      // deposit id
                }
            },
            "confirmations": {                                                                      // if transaction status == 15 (Pending) you can see this object
                "actual": 1,                                                                        // current block confirmations
                "required": 2                                                                       // required block confirmation for successful deposit
            }
        },
        {...},
        {...},
        {...}
    ],
    "total": 300                                                                                    // total number of  transactions, use this for calculating 'limit' and 'offset'
}

```

<details>
<summary><b>Errors:</b></summary>

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "limit": ["The limit field is required."],
    "offset": ["The offset field is required."],
    "transactionMethod": ["The transaction method field is required."]
  }
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "ticker": ["The selected ticker is invalid."]
  }
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "transactionMethod": ["The selected transaction method is invalid."]
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
    "status": ["The selected status is invalid."]
  }
}
```

</details>

---

### Create new address for deposit

```
[POST] /api/v4/main-account/create-new-address
```

This endpoint creates a new address even when the last created address is not used. This endpoint is not available by default, you need to contact support@whitebit.com in order to get permissions to use this endpoint.

❗ Rate limit 1000 requests/10 sec.

**Response is cached for:**
NONE

**Parameters:**

| Name    | Type   | Mandatory | Description                                                                                                                                                  |
| ------- | ------ | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ticker  | String | **Yes**   | Currency's [ticker](./../glossary.md#ticker). Example: BTC                                                                                                   |
| network | String | **No**    | Currency's network if it is [multinetwork](./../glossary.md#multinetwork) currency. Example: OMNI or TRC20 or ERC20. For USDT default network is ERC20(ETH). |
| type    | String | **No**    | Address type, available for specific currencies list (see address types table below)                                                                         |

**Address types:**

| Currency | Types               | Default |
| -------- | ------------------- | ------- |
| BTC      | p2sh-segwit, bech32 | bech32  |
| LTC      | p2sh-segwit, bech32 | bech32  |

**Request BODY raw:**

```json
{
  "ticker": "XLM",
  "request": "{{request}}",
  "nonce": "{{nonce}}"
}
```

**Request BODY (for multinetwork currency) raw:**

```json
{
  "ticker": "USDT",
  "network": "ERC20",
  "request": "{{request}}",
  "nonce": "{{nonce}}"
}
```

**Request BODY (for BTC with specific address type):**

```json
{
  "ticker": "BTC",
  "type": "bech32",
  "request": "{{request}}",
  "nonce": "{{nonce}}"
}
```

**Response:**
Available statuses:

- `Status 201 if all validations succeeded and creating transaction is started`
- `Status 400 if request validation failed`
- `Status 422 if inner validation failed`

```json
{
  "account": {
    "address": "GDTSOI56XNVAKJNJBLJGRNZIVOCIZJRBIDKTWSCYEYNFAZEMBLN75RMN", // deposit address
    "memo": "48565488244493"                                               // memo if currency requires memo
  },
  "required": {
    "maxAmount": "0", // max amount of deposit that can be accepted by exchange - if you deposit more than that number, it won't be accepted by exchange
    "minAmount": "1", // min amount of deposit that accepted by exchange - if you deposit less than that number, it won't be accepted by exchange
    "fixedFee": "0",  // fixed deposit fee
    "flexFee": {      // flexible fee - is fee that use percent rate
      "maxFee": "0",  // maximum fixed fee that you will pay
      "minFee": "0",  // minimum fixed fee that you will pay
      "percent": "0"  // percent of deposit that you will pay
    }
  }
}
```

<details>
<summary><b>Errors:</b></summary>

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "ticker": ["The ticker field is required."]
  }
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "ticker": ["The selected ticker is invalid."]
  }
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "network": ["Unsupported network"]
  }
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "network": ["The network must be a string."],
    "ticker": ["The ticker must be a string."]
  }
}
```

</details>

---

## Codes

### Create code

```
[POST] /api/v4/main-account/codes
```

This endpoint creates [WhiteBIT code](./../glossary.md#whitebit-codes).

❗ Rate limit 1000 requests/10 sec.

**Response is cached for:**
NONE

**Parameters:**

| Name        | Type           | Mandatory | Description                                                                                                                                                                                              |
| ----------- | -------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ticker      | String         | **Yes**   | Currency's [ticker](./../glossary.md#ticker). Example: BTC                                                                                                                                               |
| amount      | Numeric string | **Yes**   | Amount to transfer. Max [precision](./../glossary.md#precision) = 8, value should be greater than zero and your [main balance](./../glossary.md#balance-main).                                           |
| passphrase  | String         | **No**    | Passphrase that will be used for applying [codes](./../glossary.md#whitebit-codes). Passphrase must contain only latin letters, numbers and symbols (like !@#$%^, no whitespaces). Max: 25 symbols. |
| description | String         | **No**    | Additional text description for [code](./../glossary.md#whitebit-codes). Visible only for creator Max: 75 symbols.                                                                                  |

**Request BODY raw:**

```json
{
  "ticker": "ETH",
  "amount": "0.002",
  "passphrase": "some passphrase",
  "description": "some description",
  "request": "{{request}}",
  "nonce": "{{nonce}}"
}
```

**Response:**
Available statuses:

- `Status 201 if all validations succeeded and creating transaction is started`
- `Status 400 if request validation failed`
- `Status 422 if inner validation failed`

Response error codes:

- 0 - [Fiat](./../glossary.md#fiat) are available on the front-end only
- 1 - currency is not withdrawable
- 2 - specified address is invalid
- 3 - amount is too small
- 4 - amount is too small for the payment system
- 5 - not enough balance
- 6 - amount is less than or equals [fee](./../glossary.md#fee)

```json
{
  "code": "WBe11f4fce-2a53-4edc-b195-66b693bd77e3ETH", // generated WhiteBIT code
  "message": "Code was successfully created",
  "external_id": "be08a482-5faf-11ed-9b6a-0242ac120002"
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
    "ticker": ["The ticker field is required."]
  }
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "amount": ["The amount must be a number.", "Invalid number"],
    "description": ["The description must be a string."],
    "passphrase": ["The passphrase must be a string."],
    "ticker": ["The selected ticker is invalid."]
  }
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "amount": ["The amount must be at least 0."],
    "description": ["The description may not be greater than 75 characters."],
    "passphrase": ["The passphrase may not be greater than 25 characters."],
    "ticker": ["The selected ticker is invalid."]
  }
}
```

Errors for unconfirmed users (without KYC):

```json
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

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "amount": ["Your account must be verified"]
  }
}
```

Passphrase must contain only latin letters, numbers and symbols (like !@#$%^, no whitespaces)

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "passphrase": ["The passphrase format is invalid."]
  }
}
```

</details>

---

### Apply code

```
[POST] /api/v4/main-account/codes/apply
```

This endpoint applies [WhiteBIT code](./../glossary.md#whitebit-codes).

❗ Rate limit 60 requests/1 sec.

**Response is cached for:**
NONE

**Parameters:**

| Name       | Type   | Mandatory | Description                                                                                                         |
| ---------- | ------ | --------- | ------------------------------------------------------------------------------------------------------------------- |
| code       | String | **Yes**   | [Code](./../glossary.md#whitebit-codes) that will be applied.                                                  |
| passphrase | String | **No**    | Should be provided if the [code](./../glossary.md#whitebit-codes) was created with passphrase Max: 25 symbols. |

**Request BODY raw:**

```json
{
  "code": "WBe11f4fce-2a53-4edc-b195-66b693bd77e3ETH",
  "passphrase": "some passphrase",
  "request": "{{request}}",
  "nonce": "{{nonce}}"
}
```

**Response:**
Available statuses:

- `Status 201 if all validations succeeded and creating transaction is started`
- `Status 400 if request validation failed`
- `Status 422 if inner validation failed`

```json
{
  "message": "Code was successfully applied",
  "ticker": "ETH",
  "amount": "0.002",
  "external_id": "be08a482-5faf-11ed-9b6a-0242ac120002"
}
```

<details>
<summary><b>Errors:</b></summary>

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "code": ["The code field is required."]
  }
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "code": ["Incorrect code or passphrase"]
  }
}
```

</details>

---

### Get my codes

```
[POST] /api/v4/main-account/codes/my
```

This endpoint retrieves the list of [WhiteBIT codes](./../glossary.md#whitebit-codes) created by my account.

❗ Rate limit 1000 requests/10 sec.

**Response is cached for:**
NONE

**Parameters:**

| Name   | Type | Mandatory | Description                                                                                                                                                           |
| ------ | ---- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| limit  | Int  | **No**    | LIMIT is a special clause used to limit records a particular query can return. Default: 30, Min: 1, Max: 100                                                          |
| offset | Int  | **No**    | If you want the request to return entries starting from a particular line, you can use OFFSET clause to tell it where it should start. Default: 0, Min: 0, Max: 10000 |

**Request BODY raw:**

```json
{
  "request": "{{request}}",
  "nonce": "{{nonce}}"
}
```

**Response:**
Available statuses:

- `Status 201 if all validations succeeded and creating transaction is started`
- `Status 400 if request validation failed`
- `Status 422 if inner validation failed`

```json
{
    "total": 15,
    "data": [
        {
            "amount": "0.002",                                    // code amount
            "code": "WBe11f4fce-2a53-4edc-b195-66b693bd77e3ETH",  // code
            "date": 1598296332,                                   // code creation timestamp
            "status": "Activated",                                // code status
            "ticker": "ETH",                                      // code ticker
            "external_id": "cf7c3ff8-5eb0-11ed-9b6a-0242ac120002" // code external id
        },
        {...}
    ],
    "limit": 30,
    "offset": 0
}


```

<details>
<summary><b>Errors:</b></summary>

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

</details>

---

### Get codes history

```
[POST] /api/v4/main-account/codes/history
```

This endpoint retrieves the whole [codes](./../glossary.md#whitebit-codes) history on your account.

❗ Rate limit 1000 requests/10 sec.

**Response is cached for:**
NONE

**Parameters:**

| Name   | Type | Mandatory | Description                                                                                                                                                           |
| ------ | ---- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| limit  | Int  | **No**    | LIMIT is a special clause used to limit records a particular query can return. Default: 30, Min: 1, Max: 100                                                          |
| offset | Int  | **No**    | If you want the request to return entries starting from a particular line, you can use OFFSET clause to tell it where it should start. Default: 0, Min: 0, Max: 10000 |

**Request BODY raw:**

```json
{
  "request": "{{request}}",
  "nonce": "{{nonce}}"
}
```

**Response:**
Available statuses:

- `Status 201 if all validations succeeded and creating transaction is started`
- `Status 400 if request validation failed`
- `Status 422 if inner validation failed`

```json
{
    "total": 29,
    "data": [
        {
            "amount": "+0.002",                                   // code amount change; - is created; + is applied
            "code": "WBe11f4fce-2a53-4edc-b195-66b693bd77e3ETH",  // code
            "date": 1598296734,                                   // code activation timestamp
            "status": "Activated",                                // current code status
            "ticker": "ETH",                                      // code ticker
            "external_id": "cf7c3ff8-5eb0-11ed-9b6a-0242ac120002" // code external id
        },
        {
            "amount": "-0.002",                                   // code amount change; - is created; + is applied
            "code": "WBe11f4fce-2a53-4edc-b195-66b693bd77e3ETH",  // code
            "date": 1598296332,                                   // code creation timestamp
            "status": "Activated",                                // current code status
            "ticker": "ETH",                                      // code ticker
            "external_id": "52995812-5eb1-11ed-9b6a-0242ac120002" // code external id
        },
        {...}
    ],
    "limit": 100,
    "offset": 0
}



```

<details>
<summary><b>Errors:</b></summary>

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

</details>

---

## Crypto Lending

This API provides endpoints for interacting with [Crypto Lending](./../glossary.md#crypto-lending): getting active plans, creating/closing investments, retrieving investments/interest payments history.

These endpoints are available only for B2B partner services, you need to fill the form https://whitebit.com/institutional-services/b2b in order to get permissions to use these endpoints.

### Get plans

```
[POST] /api/v4/main-account/smart/plans
```

This endpoint retrieves all active [plans](./../glossary.md#crypto-lending)

❗ Rate limit 1000 requests/10 sec.

**Response is cached for:**
NONE

**Parameters:**

| Name   | Type   | Mandatory | Description                                                                                                                   |
| ------ | ------ | --------- | ----------------------------------------------------------------------------------------------------------------------------- |
| ticker | String | **No**    | [Invest plan](./../glossary.md#crypto-lending) source currency's [ticker](./../glossary.md#ticker). Example: BTC |

**Request BODY raw:**

```json
{
  "ticker": "USDT",
  "request": "{{request}}",
  "nonce": "{{nonce}}"
}
```

**Response:**

Available statuses:

- `Status 200`
- `Status 400 if request validation failed`

```json
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

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "ticker": ["The selected ticker is invalid."]
  }
}
```

</details>

_Note_: when target currency is different from source currency, interest amount in target currency will be calculated using `interestRatio` value.

Examples:

- When source currency = USDT, target currency = BTC and interest ratio = 40000,
  it means that you will receive interest in BTC that equals interest amount in USDT divided by interest ratio (in this case 0.000025 BTC per each 1 USDT of interest amount).
- When source currency equals target currency, interest ratio equals 1.

---

### Invest

```
[POST] /api/v4/main-account/smart/investment
```

This endpoint creates a new investment to the specified [invest plan](./../glossary.md#crypto-lending)

❗ Rate limit 1000 requests/10 sec.

**Response is cached for:**
NONE

**Parameters:**

| Name   | Type           | Mandatory | Description                                                            |
| ------ | -------------- | --------- | ---------------------------------------------------------------------- |
| planId | String         | **Yes**   | [Invest plan](./../glossary.md#crypto-lending) identifier |
| amount | Numeric String | **Yes**   | Investment amount                                                      |

**Request BODY raw:**

```json
{
  "planId": "8e667b4a-0b71-4988-8af5-9474dbfaeb51",
  "amount": "100",
  "request": "{{request}}",
  "nonce": "{{nonce}}"
}
```

**Response:**

Available statuses:

- `Status 201`
- `Status 400 if request validation failed`
- `Status 422 if inner validation failed`

```json
{
  "id": "0d7b66ff-1909-4938-ab7a-d16d9a64dcd5" // Investment identifier
}
```

<details>
<summary><b>Errors:</b></summary>

Request validation exceptions

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "planId": ["The selected planId is invalid."],
    "amount": ["The amount must be a number.", "Invalid number"]
  }
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "amount": ["The amount must be at least 0.000001."]
  }
}
```

```json
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

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "planId": ["Plan is disabled"]
  }
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "planId": ["Plan is inactive"]
  }
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "planId": ["There are no coins left in the plan"]
  }
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "planId": ["There are no coins left in the plan"]
  }
}
```

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "planId": ["Plan is paused"]
  }
}
```

Inner validation exceptions

When investment already exists, and you don't have permissions to create multiple investments by plan

```json
{
  "code": 1,
  "message": "Inner validation failed",
  "errors": {
    "planId": ["The investment in this investment plan already exists"]
  }
}
```

When amount is less than min investment amount

```json
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

```json
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

```json
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

```json
{
  "code": 5,
  "message": "Inner validation failed",
  "errors": {
    "amount": ["Insufficient funds for the payment."]
  }
}
```

</details>

---

### Close investment

```
[POST] /api/v4/main-account/smart/investment/close
```

This endpoint closes active investment

❗ Rate limit 1000 requests/10 sec.

**Response is cached for:**
NONE

**Parameters:**

| Name | Type   | Mandatory | Description           |
| ---- | ------ | --------- | --------------------- |
| id   | String | **Yes**   | Investment identifier |

**Request BODY raw:**

```json
{
  "id": "0d7b66ff-1909-4938-ab7a-d16d9a64dcd5",
  "request": "{{request}}",
  "nonce": "{{nonce}}"
}
```

**Response:**

Available statuses:

- `Status 200`
- `Status 400 if request validation failed`

```json
{}
```

<details>
<summary><b>Errors:</b></summary>

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "id": ["Investment not found"]
  }
}
```

</details>

---

### Get investments history

```
[POST] /api/v4/main-account/smart/investments
```

This endpoint retrieves an investments history

❗ Rate limit 1000 requests/10 sec.

**Response is cached for:**
NONE

**Parameters:**

| Name   | Type    | Mandatory | Description                                                                                                                                                           |
| ------ | ------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id     | String  | **No**    | Investment identifier                                                                                                                                                 |
| ticker | String  | **No**    | [Invest plan](./../glossary.md#crypto-lending) source currency's [ticker](./../glossary.md#ticker)                                                       |
| status | Integer | **No**    | Investment status (1 - active, 2 - closed)                                                                                                                            |
| limit  | Int     | **No**    | LIMIT is a special clause used to limit records a particular query can return. Default: 100, Min: 1, Max: 100                                                         |
| offset | Int     | **No**    | If you want the request to return entries starting from a particular line, you can use OFFSET clause to tell it where it should start. Default: 0, Min: 0, Max: 10000 |

**Request BODY raw:**

```json
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

- `Status 200`
- `Status 400 if request validation failed`

```json
{
  "offset": 0,
  "limit": 100,
  "records": [
    {
      "id": "0d7b66ff-1909-4938-ab7a-d16d9a64dcd5", // Investment id
      "plan": {                                     // Similar to the record from Get plans response
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
      "status": 1,               // Investment status (1 - active, 2 - closed)
      "created": 1646825196,     // Timestamp of investment creation
      "updated": 1646825196,     // Timestamp of investment update
      "paymentTime": 1646839596, // Timestamp of the payment time
      "amount": "100",           // Investment amount
      "interestPaid": "0"        // Interest paid amount
    }
  ]
}
```

<details>
<summary><b>Errors:</b></summary>

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "id": ["The selected id is invalid."],
    "ticker": ["The selected ticker is invalid."],
    "status": ["The selected status is invalid."]
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

❗ Rate limit 1000 requests/10 sec.

**Response is cached for:**
NONE

**Parameters:**

| Name   | Type   | Mandatory | Description                                                                                                                                                           |
| ------ | ------ | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| planId | String | **No**    | [Invest plan](./../glossary.md#crypto-lending) identifier                                                                                                |
| ticker | String | **No**    | [Invest plan](./../glossary.md#crypto-lending) target currency's [ticker](./../glossary.md#ticker)                                                       |
| limit  | Int    | **No**    | LIMIT is a special clause used to limit records a particular query can return. Default: 100, Min: 1, Max: 100                                                         |
| offset | Int    | **No**    | If you want the request to return entries starting from a particular line, you can use OFFSET clause to tell it where it should start. Default: 0, Min: 0, Max: 10000 |

**Request BODY raw:**

```json
{
  "planId": "8e667b4a-0b71-4988-8af5-9474dbfaeb51",
  "ticker": "USDT",
  "request": "{{request}}",
  "nonce": "{{nonce}}"
}
```

**Response:**

Available statuses:

- `Status 200`
- `Status 400 if request validation failed`

```json
{
  "offset": 0,
  "limit": 100,
  "records": [
    {
      "planId": "8e667b4a-0b71-4988-8af5-9474dbfaeb51",       // Invest plan identifier
      "investmentId": "0d7b66ff-1909-4938-ab7a-d16d9a64dcd5", // Investment identifier
      "amount": "10",                                         // Interest amount
      "ticker": "USDT",                                       // Interest currency ticker
      "timestamp": 1646839596                                 // Transaction timestamp
    }
  ]
}
```

<details>
<summary><b>Errors:</b></summary>

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "planId": ["The selected planId is invalid."],
    "ticker": ["The selected ticker is invalid."]
  }
}
```

</details>

---

## Fees

This API provides an endpoint for getting deposit/withdrawal [fees](./../glossary.md#fee) and limits by all currencies

### Get fees

Returns an array of objects containing deposit/withdrawal settings for the corresponding currencies.
Zero value in amount fields means that the setting is disabled.

```
[POST] /api/v4/main-account/fee
```

❗ Rate limit 1000 requests/10 sec.

**Response is cached for:**
NONE

**Response:**

Available statuses:

- `Status 200`

```json
[
  {
    "ticker": "BTC",         // Ticker
    "name": "Bitcoin",       // Currency name
    "can_deposit": "0",      // Status currency
    "can_withdraw": "0",     // Status currency
    "deposit": {             // Deposit fees/limits
      "minFlex": "0",        // Min fee amount when flex fee is enabled
      "maxFlex": "0",        // Max fee amount when flex fee is enabled
      "percentFlex": "0",    // Flex fee percent
      "fixed": "0",          // Fixed fee
      "minAmount": "0.0005", // Min deposit amount
      "maxAmount": "0"       // Max deposit amount
    },
    "withdraw": {            // Withdrawal fees/limits
      "minFlex": "0",        // Min fee amount when flex fee is enabled
      "maxFlex": "0",        // Max fee amount when flex fee is enabled
      "percentFlex": "0",    // Flex fee percent
      "fixed": "0.0004",     // Fixed fee
      "minAmount": "0.001",  // Min withdrawal amount
      "maxAmount": "0"       // Max withdrawal amount
    }
  }
]
```

---

## Sub Account

This API provides endpoints to manage [sub-accounts](./../glossary.md#sub-account)

### Create Sub-Account

```
[POST] /api/v4/sub-account/create
```

This endpoint creates new sub-account

❗ Rate limit 1000 requests/10 sec.

**Response is cached for:**
NONE

**Parameters:**

| Name                          | Type   | Mandatory | Description                                                                                                                                        |
|-------------------------------|--------|-----------|----------------------------------------------------------------------------------------------------------------------------------------------------|
| alias                         | String | **Yes**   | Name for sub-account                                                                                                                               |
| email                         | String | **No**    | Sub-account email. If this field is provided on this e-mail address will be sent invitation link. If not - new user without e-mail will be created |
| shareKyc                      | bool   | **No**    | If KYC shared with main account                                                                                                                    |
| permissions                   | object | **Yes**   | Sub-account permissions                                                                                                                            |
| permissions.spotEnabled       | bool   | **Yes**   | Enable spot trading                                                                                                                                |
| permissions.collateralEnabled | bool   | **Yes**   | Enable collateral trading                                                                                                                          |

**Request BODY raw:**

```json
{
  "alias": "training",
  "email": "email@google.com",
  "shareKyc": true,
  "permissions" : {
    "spotEnabled": true,
    "collateralEnabled": false
  }
}
```

**Response:**

Available statuses:

- `Status 201`
- `Status 400 if request validation failed`

```json
{
  "id": "8e667b4a-0b71-4988-8af5-9474dbfaeb51",     // subaccount id
  "alias": "training",
  "userId": "0d7b66ff-1909-4938-ab7a-d16d9a64dcd5", // user accociated with account
  "email": "e***@g***m",
  "status": "active",
  "color": "#FF0000",
  "kyc" : {
    "shareKyc": true,
    "kycStatus": "shared"
  },
  "permissions": {
    "spotEnabled": true,
    "collateralEnabled": false,
  }
}
```

<details>
<summary><b>Errors:</b></summary>

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "alias": ["Alias already exists."],
    "email": ["Email is invalid."],
  }
}
```

</details>

---

### Delete Sub-Account

```
[POST] /api/v4/sub-account/delete
```

This endpoint deletes sub-account

❗ Rate limit 1000 requests/10 sec.

**Response is cached for:**
NONE

**Parameters:**

| Name              | Type   | Mandatory | Description                                                                            |
|-------------------|--------|-----------|----------------------------------------------------------------------------------------|
| id                | String | **Yes**   | Sub-account id                                                                          |

**Request BODY raw:**

```json
{
  "id": "8e667b4a-0b71-4988-8af5-9474dbfaeb51"
}
```

**Response:**

Available statuses:

- `Status 200`
- `Status 400 if request validation failed`

```json
{
  // empty response
}
```

<details>
<summary><b>Errors:</b></summary>

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "id": ["Sub-account do not exists"],
  }
}
```

</details>

---

### Edit Sub-Account

```
[POST] /api/v4/sub-account/edit
```

This endpoint edit sub-account

❗ Rate limit 1000 requests/10 sec.

**Response is cached for:**
NONE

**Parameters:**

| Name                          | Type   | Mandatory | Description               |
|-------------------------------|--------|-----------|---------------------------|
| id                            | string | **yes**   | Sub-account id            |
| alias                         | String | **Yes**   | Name for sub-account      |
| permissions                   | object | **Yes**   | Sub-account permissions   |
| permissions.spotEnabled       | bool   | **Yes**   | Enable spot trading       |
| permissions.collateralEnabled | bool   | **Yes**   | Enable collateral trading |

**Request BODY raw:**

```json
{
  "id": true,
  "alias": "training",
  "permissions" : {
    "spotEnabled": true,
    "collateralEnabled": false
  }
}
```

**Response:**

Available statuses:

- `Status 200`
- `Status 400 if request validation failed`

```json
{
//empty response
}
```

<details>
<summary><b>Errors:</b></summary>

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "alias": ["Alias already exists."]
  }
}
```

</details>

---

### List of Sub-Accounts

```
[POST] /api/v4/sub-account/list
```

This endpoint returns list of current user sub-accounts

❗ Rate limit 1000 requests/10 sec.

**Response is cached for:**
NONE

**Parameters:**

| Name     | Type   | Mandatory  | Description                                                                                                                                                           |
|----------|--------|------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| search   | String | **No**     | Search term                                                                                                                                                           |
| limit    | Int    | **No**     | LIMIT is a special clause used to limit records a particular query can return. Default: 30, Min: 1, Max: 100                                                          |
| offset   | Int    | **No**     | If you want the request to return entries starting from a particular line, you can use OFFSET clause to tell it where it should start. Default: 0, Min: 0, Max: 10000 |

**Request BODY raw:**

```json
{
  "search": "training",
  "limit": 10,
  "offset": 0
}
```

**Response:**

Available statuses:

- `Status 200`
- `Status 400 if request validation failed`

```json
{
  "offset": 0,
  "limit": 10,
  "data": [
    {
      "id": "8e667b4a-0b71-4988-8af5-9474dbfaeb51",     // subaccount id
      "alias": "training",
      "userId": "0d7b66ff-1909-4938-ab7a-d16d9a64dcd5", // user associated with account
      "email": "e***@g***m",
      "status": "active",
      "color": "#FF0000",
      "kyc" : {
        "shareKyc": true,
        "kycStatus": "shared"
      },
      "permissions": {
        "spotEnabled": true,
        "collateralEnabled": false,
      }
    }
  ]
}
```
---

### Sub-Account Transfer

```
[POST] /api/v4/sub-account/transfer
```

This endpoint creates transfer from main account to sub-account or vice versa

❗ Rate limit 1000 requests/10 sec.

**Response is cached for:**
NONE

**Parameters:**

| Name      | Type           | Mandatory | Description                                                 |
|-----------|----------------|-----------|-------------------------------------------------------------|
| id        | String         | **Yes**   | Sub-account id                                              |
| direction | String         | **Yes**   | Transfer direction. Values: "main_to_sub" or "sub_to_main". |
| amount    | Numeric String | **Yes**   | Transfer amount. Min '0.00000001'                           |
| ticker    | String         | **Yes**   | Currencies [ticker](./../glossary.md#ticker).               |

**Request BODY raw:**

```json
{
  "id": "8e667b4a-0b71-4988-8af5-9474dbfaeb51",
  "direction": "main_to_sub",
  "amount": "42.0",
  "ticker": "USDC"
}
```

**Response:**

Available statuses:

- `Status 200`
- `Status 400 if request validation failed`

```json
{
  // empty response
}
```

<details>
<summary><b>Errors:</b></summary>

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "amount": ["Amount is invalid"],
    "ticker": ["Ticker do not exists"],
    "id": ["Sub-account do not exists"],
  }
}
```

</details>

---

### Block Sub-Account

```
[POST] /api/v4/sub-account/block
```

This endpoint blocks sub-account

❗ Rate limit 1000 requests/10 sec.

**Response is cached for:**
NONE

**Parameters:**

| Name              | Type   | Mandatory | Description                                                                            |
|-------------------|--------|-----------|----------------------------------------------------------------------------------------|
| id                | String | **Yes**   | Sub-account id                                                                          |

**Request BODY raw:**

```json
{
  "id": "8e667b4a-0b71-4988-8af5-9474dbfaeb51",
}
```

**Response:**

Available statuses:

- `Status 200`
- `Status 400 if request validation failed`

```json
{
  // empty response
}
```

<details>
<summary><b>Errors:</b></summary>

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "id": ["Sub-account do not exists"],
    "account": ["Sub-account already blocked"],
  }
}
```

</details>

---

### Unblock Sub-Account

```
[POST] /api/v4/sub-account/unblock
```

This endpoint unblocks sub-account

❗ Rate limit 1000 requests/10 sec.

**Response is cached for:**
NONE

**Parameters:**

| Name              | Type   | Mandatory | Description                                                                            |
|-------------------|--------|-----------|----------------------------------------------------------------------------------------|
| id                | String | **Yes**   | Sub-account id                                                                          |

**Request BODY raw:**

```json
{
  "id": "8e667b4a-0b71-4988-8af5-9474dbfaeb51",
}
```

**Response:**

Available statuses:

- `Status 200`
- `Status 400 if request validation failed`

```json
{
  // empty response
}
```

<details>
<summary><b>Errors:</b></summary>

```json
{
  "code": 0,
  "message": "Validation failed",
  "errors": {
    "id": ["Sub-account do not exists"],
    "account": ["Sub-account already unblocked"],
  }
}
```

</details>

---

### Sub-Account Balances

```
[POST] /api/v4/sub-account/balances
```

This endpoint returns sub-account balances

❗ Rate limit 1000 requests/10 sec.

**Response is cached for:**
NONE

**Parameters:**

| Name   | Type     | Mandatory | Description                                                                                   |
|--------|----------|-----------|-----------------------------------------------------------------------------------------------|
| id     | String   | **Yes**   | Sub-account id.                                                                               |
| ticker | String   | **No**     | Currencies [ticker](./../glossary.md#ticker). If not provided, returns data by all currencies |


**Request BODY raw:**

```json
{
  "id": "8e667b4a-0b71-4988-8af5-9474dbfaeb51",
  "ticker": "USDC"
}
```

**Response:**

Available statuses:

- `Status 200`
- `Status 422 if request validation failed`

```json
{
  "USDC": [
    {
      "main": "42",
      "spot": "10",
      "collateral": "14"
    }
  ]
}
```

<details>
<summary><b>Errors:</b></summary>

```json
{
  "code": 422,
  "message": "Account is not confirmed"
}
```

</details>

---

### Get Sub-Account Transfer History

```
[POST] /api/v4/sub-account/transfer/history
```

This endpoint returns history of transfers between main account and sub-account

❗ Rate limit 1000 requests/10 sec.

**Response is cached for:**
NONE

**Parameters:**

| Name      | Type    | Mandatory | Description                                                                                                                                                                                         |
|-----------|---------|-----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| id        | String  | **No**    | Sub-account id. If ot provided for all sub-accounts                                                                                                                                                 |
| direction | String  | **No**    | Transfer direction. Values: "main_to_sub" or "sub_to_main". If provided, returns transactions in selected direction. If not provided, returns all transactions between main account and sub-account |
| limit     | Int     | **No**    | LIMIT is a special clause used to limit records a particular query can return. Default: 30, Min: 1, Max: 100                                                                                        |
| offset    | Int     | **No**    | If you want the request to return entries starting from a particular line, you can use OFFSET clause to tell it where it should start. Default: 0, Min: 0, Max: 10000                               |


**Request BODY raw:**

```json
{
  "id": "8e667b4a-0b71-4988-8af5-9474dbfaeb51",
  "direction": "main_to_sub"
}
```

**Response:**

Available statuses:

- `Status 200`
- `Status 422 if request validation failed`

```json
{
  "offset": 0,
  "limit": 30,
  "data": [
    {
      "id": "0d7b66ff-1909-4938-ab7a-d16d9a64dcd5", // transaction id
      "direction": "main_to_sub",
      "currency": "USDT",
      "amount": "3.14",
      "createdAt": 1715339355
    }
  ]
}
```

<details>
<summary><b>Errors:</b></summary>

```json
{
  "code": 422,
  "message": "Account is not confirmed"
}
```

</details>

---

## Mining Pool

### Get Rewards

```
[POST] /api/v4/mining/rewards
```

This endpoint return rewards received from mining

❗ Rate limit 1000 requests/10 sec.

**Response is cached for:**
NONE

**Parameters:**

| Name      | Type    | Mandatory | Description                                                                                                                                                                                         |
|-----------|---------|-----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| account   | String  | **No**    | Mining pool account                                                                                                                                                                                 |
| from      | Int     | **No**    | Date timestamp starting from which rewards are received                                                                                                                                             |
| to        | Int     | **No**    | Date timestamp until which rewards are received                                                                                                                                                    |
| limit     | Int     | **No**    | LIMIT is a special clause used to limit records a particular query can return. Default: 30, Min: 1, Max: 100                                                                                        |
| offset    | Int     | **No**    | If you want the request to return entries starting from a particular line, you can use OFFSET clause to tell it where it should start. Default: 0, Min: 0, Max: 10000                               |

**Request BODY raw:**

```json
{
  "account": "my-mining-account-01",
  "from": 1704067200,
  "to": 1725148800,
  "limit": 25,
  "offset": 0
}
```

**Response:**

Available statuses:

- `Status 200`
- `Status 422 if request validation failed`

```json
{
  "offset": 0,
  "limit": 25,
  "data": [
    {
      "miningAccountName": "my-mining-account-01",
      "totalReward": "3.15",
      "reward": "3.14",
      "fee": "0.01",
      "fppsRate": "0.00000068",
      "hashRate": "658425440887845683",
      "date": 1715339355
    }
  ]
}
```

<details>
<summary><b>Errors:</b></summary>

```json
{
  "code": 422,
  "message": "Incorrect timestamp"
}
```

</details>

---
