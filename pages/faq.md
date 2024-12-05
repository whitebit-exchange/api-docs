## FAQ

1. Q: Why am I getting a 429 error and can't make requests?

A: If the rate limit for an endpoint is exceeded, you will receive a 429 error. To fix the error, you need to wait a bit. The rate limit value for a specific request can be found in the endpoint description.

2. Q: Why do I get a CORS error when requesting the [whitebit.com/api/v4/public/ticker](http://whitebit.com/api/v4/public/ticker) method?

A: CORS requests to this endpoint are forbidden for security reasons. Make the request from the backend.

3. Q: Why am I getting a 403 error when making requests to the Smartplan endpoints?

A: These endpoints are available only for B2B partner services. You need to contact [support@whitebit.com](mailto:support@whitebit.com) in order to get permissions to use these endpoints.

[https://whitebit-exchange.github.io/api-docs/private/http-main-v4/#crypto-lеnding](https://whitebit-exchange.github.io/api-docs/private/http-main-v4/#crypto-l%D0%B5nding)

4. Q: Can I get information on pairs for multiple time periods in the [https://whitebit-exchange.github.io/api-docs/public/websocket/#kline](https://whitebit-exchange.github.io/api-docs/public/websocket/#kline) method?

A: Open multiple WebSocket connections or call an equivalent HTTP method.

5. Q: Why can't I see trade history for a pair in the last 24 hours?

A: You can only see the last 100 deals. If you want to see more, subscribe to our WebSocket and accumulate information on your side.

6. Q: Why am I getting nonce errors?

A: The problem is solved by debugging your code and recreating the keys.

7. Q: Why doesn't the transfer between balances occur when transferring assets via API? Example: I made a transfer from a trading account to a main account and made a withdrawal request, but I received an error indicating that there were no funds in the balance.

A: You made a withdrawal before the transfer was completed. Wait for it to finish (about 2 seconds).

8. Q: I get an error that there are insufficient funds for withdrawal, even though there are assets on the balance.

A: The amount plus the fee was greater than the balance. For the withdraw-pay method, you need to take into account the withdrawal fee [https://github.com/whitebit-exchange/api-docs/blob/main/docs/Private/http-main-v4.md#fees](https://github.com/whitebit-exchange/api-docs/blob/main/docs/Private/http-main-v4.md#fees)

9. Q: Is https required for Webhook API communication? What port is used for this communication?

A: Yes, https is required. Communication takes place through port 443.

10. Q: How can I find out if deposits and withdrawals of a specific currency are working through the API?

A: You can find this information at [https://whitebit.com/api/v4/public/assets](https://whitebit.com/api/v4/public/assets)
