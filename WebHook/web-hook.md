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

While you are generating new web hook keys you should make sure your web-hook server is online. To check it the test request will be performed. 
The request will be performed with HEAD method. As a result your web hook service should respond with 200 http status code

### For processing web-hook requests

All web hook requests are performing using POST method and with application/json content type. Consumer server should respond with 200 HTTP status code. If consumer was unable to handle web-hook, the request will be retry every 10 minutes but not more than 5 times.  

#### Body data

All web-hook requests are performing with 

```json
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
2. `'X-TXC-APIKEY': api_key` - where api_key is your public WhiteBit API key
3. `'X-TXC-PAYLOAD': payload'` - where payload is base64-encoded body data
4. `'X-TXC-SIGNATURE': signature` - where signature is `hex(HMAC_SHA512(payload), key=api_secret))`

On consumer side you can process security headers to be sure request was performed by WhiteBIT.

## WebHook Methods

### WhiteBIT code apply

Performed when code was applied. Request example:

```json
{
   "method": "code.applied",
   "params": {
       "code": "<SOME_WHITE_BIT_CODE>",
       "nonce": 1
   },
   "id": "45a1d85d-2fdf-483e-8dfa-6d253148c730"
}   
```



