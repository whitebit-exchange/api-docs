# WebHook HTTP API

## How to use

1. Go to your account on whitebit.com.
2. Click on the API keys tab.
3. Select the web-hook configuration tab for your API keys.
4. Paste correct URI to your web server which will process web-hook calls.
5. Press Generate a new key button and toggle the activation switcher to "Activated".

Please pay attention that secret key will be show only one time, so make sure you save it in any secure key store

## Requirements:

### For web hook keys generation

Before starting using webhooks, you'll be asked to verify ownership of the domain, you are set as webhook destination. You can do it in one of three ways
1. You can add TXT DNS record to your domain with your webhook public key.
2. You can add plain text file `whiteBIT-verification.txt` into your root domain folder and provide public web access to this file from your server. In this file should be placed your public webhook key.
3. You can implement `/whiteBIT-verification` endpoint. This endpoint should respond with 200 OK and return JSON array which contains your public webhook key. For example: ```["<your-public-webhook-key>"]```

Passing just one of these checks will be able you to switch webhook on 

### For processing web-hook requests

All web hook requests are performing using POST method and with application/json content type. Consumer server should respond with 200 HTTP status code. If consumer was unable to handle web-hook, the request will be retry every 10 minutes but not more than 5 times.  

#### Body data

All web-hook requests are performing with 

```json5
{
   "method": "string",
   "params": {

       "nonce": 0
   },
   "id": "uniqueID"
}
```

**method** - string. The name of method which was evaluated. Web hooks API supports such web-hook methods:

- **code.apply**. Performs when code owned by a customer was applied. 

**id** - string. Uuid to identify every request.

**params** - the request payload. Here you can find useful data about passed actions, which triggered web hook call. Also in this field placed a nonce. **'nonce'** - a number that is always **greater** than the previous request’s nonce number 


#### Request headers

Also, all request contains additional data in headers:

1. `'Content-type': 'application/json'`
2. `'X-TXC-APIKEY': api_key` - where api_key is your WhiteBit webhook API key
3. `'X-TXC-PAYLOAD': payload'` - where payload is base64-encoded body data
4. `'X-TXC-SIGNATURE': signature` - where signature is `hex(HMAC_SHA512(payload), key=api_secret))`

On consumer side you can process security headers to be sure request was performed by WhiteBIT.

## WebHook Methods

### WhiteBIT code apply

Performed when code was applied. Request example:

```json5
{
   "method": "code.apply",
   "params": {
       "code": "<SOME_WHITE_BIT_CODE>",
       "nonce": 1
   },
   "id": "45a1d85d-2fdf-483e-8dfa-6d253148c730"
} 
```

### WhiteBIT deposit to main balance

Performed when deposit was accepted. Request example:

```json5
{
  method: "deposit.accepted",
  params: {
    "address": "wallet address",                  // deposit address
    "amount": "0.000600000000000000",             // amount of deposit
    "createdAt": 1593437922,                      // timestamp of deposit
    "currency": "Bitcoin",                        // deposit currency
    "description": "",                            // deposit description
    "fee": "0.000000000000000000",                // deposit fee
    "memo": "",                                   // deposit memo
    "method": 1,                                  // called method 1 - deposit, 2 - withdraw
    "network": "TRC20",                           // if currency is multi network
    "status": 15,                                 // transactions status
    "ticker": "BTC",                              // deposit currency ticker
    "transactionHash": "transaction hash",        // deposit transaction hash
    "uniqueId": null,                             // unique Id of deposit
    "confirmations": {                            // if transaction has confirmations info it will display here
        "actual": 1,                              // current block confirmations
        "required": 2                             // required block confirmation for successful deposit
    }
  },
  id: 'uuid'
}   
```

Performed when deposit was processed, so it is available on your balance. Request example:

```json5
{
  method: "deposit.processed",
  params: {
    "address": "wallet address",                  // deposit address
    "amount": "0.000600000000000000",             // amount of deposit
    "createdAt": 1593437922,                      // timestamp of deposit
    "currency": "Bitcoin",                        // deposit currency
    "description": "",                            // deposit description
    "fee": "0.000000000000000000",                // deposit fee
    "memo": "",                                   // deposit memo
    "method": 1,                                  // called method 1 - deposit, 2 - withdraw
    "network": "ERC20",                           // if currency is multi network
    "status": 15,                                 // transactions status
    "ticker": "BTC",                              // deposit currency ticker
    "transactionHash": "transaction hash",        // deposit transaction hash
    "uniqueId": null,                             // unique Id of deposit
    "confirmations": {                            // if transaction has confirmations info it will display here
        "actual": 1,                              // current block confirmations
        "required": 2                             // required block confirmation for successful deposit
    }
  },
  id: 'uuid'
}   
```

Performed when deposit was canceled. Request example:

```json5
{
  method: "deposit.canceled",
  params: {
    "address": "wallet address",                  // deposit address
    "amount": "100.00",                           // amount of deposit
    "createdAt": 1593437922,                      // timestamp of deposit
    "currency": "Tether US",                      // deposit currency
    "description": "",                            // deposit description
    "fee": "0.000000000000000000",                // deposit fee
    "memo": "",                                   // deposit memo
    "method": 1,                                  // called method 1 - deposit, 2 - withdraw
    "network": "TRC20",                           // if currency is multi network, "null" if no multi network
    "status": 15,                                 // transactions status
    "ticker": "USDT",                             // deposit currency ticker
    "transactionHash": "transaction hash",        // deposit transaction hash
    "uniqueId": null,                             // unique Id of deposit
    "confirmations": {                            // if transaction has confirmations info it will display here
        "actual": 1,                              // current block confirmations
        "required": 32                             // required block confirmation for successful deposit
    }
  },
  id: 'uuid'
}
```

### WhiteBIT withdraw from main balance

Performed when withdraw was created. Request example:

```json5
{
  method: "withdraw.unconfirmed",
  params: {
    "address": "wallet address",                  // withdraw address
    "amount": "100.00",                           // amount of withdraw
    "createdAt": 1593437922,                      // timestamp of withdraw
    "currency": "Tether US",                      // withdraw currency
    "ticker": "USDT",                             // withdraw currency ticker
    "description": null,                            // withdraw description
    "fee": "0.000000000000000000",                // withdraw fee
    "memo": "",                                   // withdraw memo
    "method": 2,                                  // called method 1 - deposit, 2 - withdraw
    "network": "TRC20",                           // if currency is multi network, "null" if no multi network
    "status": 15,                                 // transactions status
    "transactionHash": "transaction hash",        // withdraw transaction hash
    "uniqueId": null,                             // unique Id of withdraw
  },
  id: 'uuid'
}
```

Performed when withdraw is pending. Request example:

```json5
{
  method: "withdraw.pending",
  params: {
    "address": "wallet address",                  // withdraw address
    "amount": "100.00",                           // amount of withdraw
    "createdAt": 1593437922,                      // timestamp of withdraw
    "currency": "Tether US",                      // withdraw currency
    "ticker": "USDT",                             // withdraw currency ticker
    "description": null,                            // withdraw description
    "fee": "0.000000000000000000",                // withdraw fee
    "memo": "",                                   // withdraw memo
    "method": 2,                                  // called method 1 - deposit, 2 - withdraw
    "network": "TRC20",                           // if currency is multi network, "null" if no multi network
    "status": 15,                                 // transactions status
    "transactionHash": "transaction hash",        // withdraw transaction hash
    "uniqueId": null,                             // unique Id of withdraw
  },
  id: 'uuid'
}
```

Performed when withdraw was canceled. Request example:

```json5
{
  method: "withdraw.canceled",
  params: {
    "address": "wallet address",                  // withdraw address
    "amount": "100.00",                           // amount of withdraw
    "createdAt": 1593437922,                      // timestamp of withdraw
    "currency": "Tether US",                      // withdraw currency
    "ticker": "USDT",                             // withdraw currency ticker
    "description": null,                            // withdraw description
    "fee": "0.000000000000000000",                // withdraw fee
    "memo": "",                                   // withdraw memo
    "method": 2,                                  // called method 1 - deposit, 2 - withdraw
    "network": "TRC20",                           // if currency is multi network, "null" if no multi network
    "status": 15,                                 // transactions status
    "transactionHash": "transaction hash",        // withdraw transaction hash
    "uniqueId": null,                             // unique Id of withdraw
  },
  id: 'uuid'
}
```

Performed when withdraw was completed. Request example:

```json5
{
  method: "withdraw.successful",
  params: {
    "address": "wallet address",                  // withdraw address
    "amount": "100.00",                           // amount of withdraw
    "createdAt": 1593437922,                      // timestamp of withdraw
    "currency": "Tether US",                      // withdraw currency
    "ticker": "USDT",                             // withdraw currency ticker
    "description": null,                            // withdraw description
    "fee": "0.000000000000000000",                // withdraw fee
    "memo": "",                                   // withdraw memo
    "method": 2,                                  // called method 1 - deposit, 2 - withdraw
    "network": "TRC20",                           // if currency is multi network, "null" if no multi network
    "status": 15,                                 // transactions status
    "transactionHash": "transaction hash",        // withdraw transaction hash
    "uniqueId": null,                             // unique Id of withdraw
  },
  id: 'uuid'
}
```