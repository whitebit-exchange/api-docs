# Private HTTP API Authenticate

## How to use:

1. Go to your account on whitebit.com.
2. Click on the API keys tab.
3. Select the appropriate configuration tab for your API keys. Different API keys allow access to different API calls.
4. Generate API keys and toggle the activation switcher to "Activated".

## Requirements:

Auth request should be using `POST` method and should include:
1. [Body data](#body-data)
2. [Headers](#headers)

### Body data

**JSON** that includes:
1. **'request'** - a request path without the domain name. Example: `'/api/v4/trade-account/balance'`.
2. **'nonce'** - a number that is always **greater** than the previous request’s nonce number. Example: `'1594297865'`. A good method of creating a **nonce** is to use the unix timestamp in milliseconds. This way you'll always get an incrementing number, but make sure not to send two API calls at the same time, otherwise their nonce will be identical.
3. **params of request** - Example: `'ticker': 'BTC'`

### Headers

With every request you need to provide next **headers**:
1. `'Content-type': 'application/json'`
2. `'X-TXC-APIKEY': api_key` - where api_key is your public WhiteBit API key
3. `'X-TXC-PAYLOAD': payload'` - where payload is base64-encoded body data
4. `'X-TXC-SIGNATURE': signature` - where signature is `hex(HMAC_SHA512(payload), key=api_secret))`


### Examples of auth

To help you get started with our API, we've created the [API Quick start helper](https://github.com/whitebit-exchange/api-quickstart) library. It supports the following languages:
```json5
1. Python
2. PHP
3. JavaScript
4. Go
5. Kotlin
6. Java
```

### Errors:
    
**"Too many requests."** - this error occurs if the **“nonce”** in your current request is equal or is lower than the one in the previous request.

___
```json5
{
    "message": [
        [
            "Too many requests."
        ]
    ],
    "result": [],
    "success": false
}
```
___

**"This action is unauthorized. Enable your key in API settings"** - this error occurs when you are using disabled API key. You can enable your API key in account settings https://whitebit.com/settings/api

___
```json5
{
    "message": [
        [
            "This action is unauthorized. Enable your key in API settings"
        ]
    ],
    "result": [],
    "success": false
}
```
___

**"Invalid payload"** - this error occurs when the data that was provided in the body of the request doesn't match the **base64-decoded** payload.
___
```json5
{
     "message": [
         [
             "Invalid payload."
         ]
     ],
     "result": [],
     "success": false
}
```
___
**"Unauthorized request."** - this error occurs if the request was signed incorrectly.
___
```json5
{
    "message": [
        [
            "Unauthorized request."
        ]
    ],
    "result": [],
    "success": false
}
```
___ 
**"Nonce not provided."** - this error occurs if your request is missing **"nonce"** in the request body.
___
```json5
{
    "message": [
        [
            "Nonce not provided."
        ]
    ],
    "result": [],
    "success": false
}
```
___ 
**"Request not provided."** - this error occurs if your request is missing **"request"** path in the request body.
___
```json5
{
    "message": [
        [
            "Request not provided."
        ]
    ],
    "result": [],
    "success": false
}
```
___ 