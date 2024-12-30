interface SEOConfig {
  title: string;
  description: string;
}

interface PageSEOConfig {
  [key: string]: SEOConfig;
}

const seoConfig: PageSEOConfig = {
  index: {
    title: "WhiteBIT API Documentation",
    description: "Complete API documentation for WhiteBIT cryptocurrency exchange. Access trading endpoints, market data, and integration guides.",
  },
  // Private API endpoints
  "private/http-main-v4": {
    title: "Private HTTP API V4 - Main Balance Operations | WhiteBIT API",
    description: "Comprehensive guide for WhiteBIT's private HTTP API V4 endpoints. Learn how to manage deposits, withdrawals, and balance transfers securely.",
  },
  "private/http-trade-v4": {
    title: "Private Trading API V4 | WhiteBIT API",
    description: "Advanced trading endpoints documentation for WhiteBIT exchange. Place orders, manage positions, and access trading history.",
  },
  "private/http-trade-v1": {
    title: "Private Trading API V1 (Legacy) | WhiteBIT API",
    description: "Legacy V1 trading API documentation for WhiteBIT exchange. Reference for maintaining existing integrations using the V1 endpoints.",
  },
  "private/http-auth": {
    title: "API Authentication Guide | WhiteBIT API",
    description: "Learn how to authenticate your requests to WhiteBIT's private API endpoints. Step-by-step guide for implementing secure API authentication.",
  },
  "private/websocket": {
    title: "Private WebSocket API | WhiteBIT API",
    description: "Secure WebSocket endpoints for real-time account updates, order status changes, and balance modifications.",
  },
  // Public API endpoints
  "public/http-v4": {
    title: "Public HTTP API V4 | WhiteBIT API",
    description: "Access public market data, ticker information, and trading pairs through WhiteBIT's V4 HTTP API endpoints. No authentication required.",
  },
  "public/http-v2": {
    title: "Public HTTP API V2 (Legacy) | WhiteBIT API",
    description: "Legacy V2 public API documentation. Reference for existing integrations using WhiteBIT's V2 public endpoints.",
  },
  "public/http-v1": {
    title: "Public HTTP API V1 (Legacy) | WhiteBIT API",
    description: "Legacy V1 public API documentation. Historical reference for WhiteBIT's first public API version endpoints.",
  },
  "public/websocket": {
    title: "Public WebSocket API | WhiteBIT API",
    description: "Real-time market data access through WhiteBIT's WebSocket API. Stream live prices, order book updates, and trading activity.",
  },
  // Webhook documentation
  "webhook/web-hook": {
    title: "Webhooks Integration Guide | WhiteBIT API",
    description: "Implement real-time notifications for account and trading events using WhiteBIT's webhook system. Complete setup and integration guide.",
  },
  // OAuth documentation
  "oauth/overview": {
    title: "OAuth 2.0 Overview | WhiteBIT API",
    description: "Introduction to WhiteBIT's OAuth 2.0 implementation. Learn about secure third-party authentication and authorization flows.",
  },
  "oauth/usage": {
    title: "OAuth 2.0 Implementation Guide | WhiteBIT API",
    description: "Step-by-step guide for implementing OAuth 2.0 authentication with WhiteBIT. Includes code examples and best practices.",
  },
  // General pages
  faq: {
    title: "Frequently Asked Questions | WhiteBIT API",
    description: "Common questions and answers about WhiteBIT's API integration, rate limits, authentication, and best practices.",
  },
  glossary: {
    title: "API Terms Glossary | WhiteBIT API",
    description: "Comprehensive glossary of trading terms, API concepts, and cryptocurrency terminology used in WhiteBIT's documentation.",
  },
  sdks: {
    title: "API SDKs & Libraries | WhiteBIT API",
    description: "Official and community SDKs, libraries, and code examples for integrating with WhiteBIT's API in various programming languages.",
  },
};

export default seoConfig;
