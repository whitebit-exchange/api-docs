# OAuth 2.0 API

### Get token

```
[POST] /oauth2/token
```

This endpoint activates access token.

For this request the IP of a client must be added to WB Allowlist.

❗ Access token duration is 300 sec.

**Request BODY x-www-form-urlencoded:**
Need to send "client_id", "client_secret" and "code".

**Response:**

```json
{
  "data": {
    "access_token": "MZM1MDBMMJYTNWM4MI0ZNTIYLTKXNDATNZY1MZHKM2Y2MJY3",
    "expires_in": 300,
    "refresh_token": "ODK5ZTVKZDUTYTI5ZC01NWJHLTGZZDMTYWFKYTNMNJHHMGZM",
    "scope": "codes.apply,show.userinfo",
    "token_type": "Bearer"
  }
}
```

## Errors:

"This action is unauthorized."

```json
{
  "data": {
    "message": ["Invalid request"]
  }
}
```

### Refresh token

```
[POST] /oauth2/refresh_token
```

This endpoint creates refresh token.

For this request the IP of a client must be added to WB Allowlist.

❗ Refresh token duration is 600 sec.

❗ Rate limit 1 request/1 sec.

**Request BODY x-www-form-urlencoded:**
Need to send "client_id", "client_secret" and "token".

**Response:**

```json
{
  "data": {
    "access_token": "NTBLZJKYNZETNJFIZC0ZNGM1LWJMYTMTODBJYZRKNWE2NMRM",
    "expires_in": 300,
    "refresh_token": "ODZMNMRHM2ETMZQZZI01OTQYLWEWMZATNWQ0NDYZNJBMOWUW",
    "scope": "codes.apply,show.userinfo",
    "token_type": "Bearer"
  }
}
```

## Errors:

"Invalid token."

```json
{
  "data": {
    "token": ["Invalid token."]
  }
}
```
