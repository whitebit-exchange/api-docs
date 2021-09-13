# Official Documentation of WhiteBIT API

### Latest releases:
- *Sep 13, 2021* minor fixes and updates to all docs
- *Jun 17, 2021* added webhook response examples
- *Jun 14, 2021* added buy stock market order to API v4

___

## WS

### `Public WS`

[Public WebSocket API](./Public/websocket.md) - General methods

### `Private WS`

[Private WebSocket API](./Private/websocket.md) - Authentication + private methods (trade balance, orders, deals methods)

___

## HTTP

### `Public endpoints`

[Public API V1 Documentation](./Public/http-v1.md) - General endpoints.

[Public API V2 Documentation](./Public/http-v2.md) - Modified general endpoints + new endpoints.

[Public API V4 Documentation](./Public/http-v4.md) - Modified general endpoints + new endpoints.

### `Private endpoints`

[Private API Documentation - Authentication ](./Private/http-auth.md) - How to use requests that require authentication on WhiteBIT.

[Private API V4 Documentation - Main balance](./Private/http-main-v4.md) - Main balance & deposit/withdraw endpoints.

[Private API V1 Documentation - Trade balance](./Private/http-v1.md) - Documentation for making private trading requests

[Private API V4 Documentation - Trade balance](./Private/http-trade-v4.md) - Additional endpoints.

### `Webhooks`

[Private Webhooks Documentation - Main balance](./WebHook/web-hook.md) - Documentation for processing webhooks

---

### `General info`

1. WhiteBIT API supports `private` and `public` endpoints.
2. Available API versions: `V1`, `V2`, `V4`.
3. Using **Public endpoints**:
    1. Public endpoints are cached. You can find specific cache refresh interval for each particular request in API documentation.
    2. Use HTTP method `GET` method when making a request.
    3. Use `query string` if you need to send additional data.
4. Using **Private endpoints** - full guide [Private API Authentication Documentation](./Private/http-auth.md):
    1. To make private API calls:
        1. Go to your account on whitebit.com and navigate to account settings.
        2. Click on the API keys tab.
        3. Select the appropriate configuration tab for your API keys. Different API keys allow access to different API calls.
        4. Generate an API key.
        5. Enable IP restrictions by specifying up to 5 trusted IPs *(optional, **recommended**)*
        6. Enable Endpoint access restrictions. Select only those endpoints, that you are going to use and click "Apply" button.
    2. Auth request should be using `POST` method and should include:
        1. Body data - **JSON** that includes:
            1. **'request'** - a request path without the domain name. Example: `'/api/v4/trade-account/balance'`.
            2. **'nonce'** - a number that is always **larger** than the previous request’s nonce number. Example: `'1594297865'`. A good method of creating a **nonce** is to use the unix timestamp in milliseconds. This way you'll always get an incrementing number, but make sure not to send two API calls at the same time, otherwise their nonce will be identical.
            3. **params of request** - Example: `'ticker': 'BTC'`
        2. Headers:
            1. `'Content-type': 'application/json'`
            2. `'X-TXC-APIKEY': api_key` - where api_key is your public WhiteBit API key
            3. `'X-TXC-PAYLOAD': payload'` - where payload is base64-encoded body data
            4. `'X-TXC-SIGNATURE': signature` - where signature is `hex(HMAC_SHA512(payload), key=api_secret))`
    3. To help you get started with our API, we've created the [API Quick start helper](https://github.com/whitebit-exchange/api-quickstart) library. It supports the following languages:
        1. ``Go``
        2. ``NodeJS``
        3. ``Python``
        4. ``PHP``
        5. ``Java``
        6. ``Kotlin``
        7. ``DotNet``
        8. ``Ruby``
        9. ``C++``
