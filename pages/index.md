# Official Documentation of WhiteBIT API

## General information

### WhiteBIT API supports `private` and `public` endpoints

### Available API versions: `V1`, `V2`, `V4`

### Using Public endpoints:

1. Public endpoints are cached. You can find specific cache refresh interval for each particular request in API documentation.
2. Use HTTP method `GET` method when making a request.
3. Use [query string](https://en.wikipedia.org/wiki/Query_string) if you need to send additional data.

+ **Public endpoints:**

> [Public API V4 Documentation](./public/http-v4) - Modified general endpoints + new endpoints: Ticker, Assets, Order and Trades, Fee, Server Time, Server Status, Collateral Markets.

+  **Deprecated endpoints:**

> [Public API V1 Documentation](./public/http-v1) - General endpoints: Market info, Market activity, Single market activity, Kline, Symbols, Order depth, Trade history.

> [Public API V2 Documentation](./public/http-v2) - Modified general endpoints + new endpoints: Recent trades, Fee, Asset status list, Orderbook.

### Using Private endpoints:

1. Read full guide [Private API Authentication Documentation](./private/http-auth)
2. You can add up to 5 trusted IPs
3. Read [API Quick start helper](https://github.com/whitebit-exchange/api-quickstart) to find the list of languages our API supports (and instructions for each language)
4. Auth request should be using `POST` method and include Body data and Headers

+ **Private endpoints:**

> [Private API Documentation - Authentication ](./private/http-auth) - How to use requests that require authentication on WhiteBIT.

> [Private API V1 Documentation - Trade balance](./private/http-trade-v1) - Documentation for making private trading, order operations and order history requests.

+  **Deprecated endpoints:**

> [Private API V4 Documentation - Main balance](./private/http-main-v4) - Main balance, deals methods & history, Codes, SMART, Fees.

> [Private API V4 Documentation - Trade balance](./private/http-trade-v4) - Additional endpoints (trade balance, orders, deals methods).

### WhiteBIT API supports private and public websockets

> [Public WebSocket API](./public/websocket) - General methods, Kline, Last Price, Market Statistics for current day UTC, Market Trades, Market depth.

> [Private WebSocket API](./private/websocket) - Authentication + private methods (trade balance, orders, deals methods).


### WhiteBIT API supports [**Webhooks**](./webhook/web-hook)

> [Private Webhooks Documentation - Main balance](./webhook/web-hook) - Documentation for processing webhooks

### [Glossary](./glossary/)

### [F.A.Q.](./faq/)
