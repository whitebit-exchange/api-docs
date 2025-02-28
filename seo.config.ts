interface SEOConfig {
  title: string;
  description: string;
}

interface PageSEOConfig {
  [key: string]: SEOConfig;
}

const seoConfig: PageSEOConfig = {
  index: {
    title: "WhiteBIT API Documentation | Cryptocurrency Exchange API",
    description: "Powerful cryptocurrency exchange API with comprehensive documentation. Access real-time market data, automated trading, secure authentication, and WebSocket feeds for seamless integration.",
  },
  "guides/client-order-id": {
    title: "Client Order ID Guide | Order Management | WhiteBIT",
    description: "Learn how to use clientOrderId for order tracking, broker implementations, and automated trading. Complete guide with examples for managing orders across multiple clients and strategies.",
  },
  "platform/overview": {
    title: "API Overview | WhiteBIT Documentation",
    description: "Overview of WhiteBIT's API capabilities, features, and integration options. Learn about our REST APIs, WebSocket feeds, and authentication methods.",
  },
  // Platform features
  "platform/self-trade-prevention": {
    title: "Self Trade Prevention (STP) | Trading Features | WhiteBIT",
    description: "Implement Self Trade Prevention (STP) in your trading strategy. Learn about STP modes, best practices for algorithmic trading, and how to prevent unintentional self-matching on WhiteBIT exchange.",
  },
  "platform/colocation": {
    title: "Colocation Services | Ultra-Low Latency Trading | WhiteBIT",
    description: "Professional-grade colocation services for high-frequency trading (HFT). Execute trades in 5ms with direct connection to WhiteBIT's matching engine. AWS integration guide and 24/7 support.",
  },
  // Private API endpoints
  "private/http-main-v4": {
    title: "Main Balance Operations | Private HTTP API V4 | WhiteBIT",
    description: "Comprehensive guide for WhiteBIT's private HTTP API V4 endpoints. Learn how to manage deposits, withdrawals, and balance transfers securely.",
  },
  "private/http-trade-v4": {
    title: "Trading API V4 | Private Endpoints | WhiteBIT",
    description: "Advanced trading endpoints documentation for WhiteBIT exchange. Place orders, manage positions, and access trading history.",
  },
  "private/http-trade-v1": {
    title: "Trading API V1 | Legacy Private Endpoints | WhiteBIT",
    description: "Legacy V1 trading API documentation for WhiteBIT exchange. Reference for maintaining existing integrations using the V1 endpoints.",
  },
  "private/http-auth": {
    title: "Authentication Guide | Private API | WhiteBIT",
    description: "Learn how to authenticate your requests to WhiteBIT's private API endpoints. Step-by-step guide for implementing secure API authentication.",
  },
  "private/websocket": {
    title: "Private WebSocket API | Real-time Updates | WhiteBIT",
    description: "Secure WebSocket endpoints for real-time account updates, order status changes, and balance modifications.",
  },
  // Public API endpoints
  "public/http-v4": {
    title: "Public HTTP API V4 | Market Data | WhiteBIT",
    description: "Access public market data, ticker information, and trading pairs through WhiteBIT's V4 HTTP API endpoints. No authentication required.",
  },
  "public/http-v2": {
    title: "Public HTTP API V2 | Legacy Endpoints | WhiteBIT",
    description: "Legacy V2 public API documentation. Reference for existing integrations using WhiteBIT's V2 public endpoints.",
  },
  "public/http-v1": {
    title: "Public HTTP API V1 | Legacy Endpoints | WhiteBIT",
    description: "Legacy V1 public API documentation. Historical reference for WhiteBIT's first public API version endpoints.",
  },
  "public/websocket": {
    title: "Public WebSocket API | Market Data Stream | WhiteBIT",
    description: "Real-time market data access through WhiteBIT's WebSocket API. Stream live prices, order book updates, and trading activity.",
  },
  // Webhook documentation
  "platform/webhook": {
    title: "Webhooks Integration | Real-time Notifications | WhiteBIT",
    description: "Implement real-time notifications for account and trading events using WhiteBIT's webhook system. Complete setup and integration guide.",
  },
  // OAuth documentation
  "platform/oauth": {
    title: "OAuth 2.0 Overview | WhiteBIT",
    description: "Introduction to WhiteBIT's OAuth 2.0 implementation. Learn about secure third-party authentication and authorization flows.",
  },
  "platform/oauth/usage": {
    title: "OAuth 2.0 Guide | WhiteBIT",
    description: "Step-by-step guide for implementing OAuth 2.0 authentication with WhiteBIT. Includes code examples and best practices.",
  },
  "platform/oauth/docs": {
    title: "OAuth 2.0 API Reference | WhiteBIT",
    description: "Complete OAuth 2.0 API reference documentation including authorization flows, token management, scopes, and account endpoints with detailed request/response examples.",
  },
  // General pages
  faq: {
    title: "FAQ | API Documentation | WhiteBIT",
    description: "Common questions and answers about WhiteBIT's API integration, rate limits, authentication, and best practices.",
  },
  glossary: {
    title: "API Glossary | Terms & Definitions | WhiteBIT",
    description: "Comprehensive glossary of trading terms, API concepts, and cryptocurrency terminology used in WhiteBIT's documentation.",
  },
  sdks: {
    title: "SDKs & Libraries | Developer Tools | WhiteBIT",
    description: "Official and community SDKs, libraries, and code examples for integrating with WhiteBIT's API in various programming languages.",
  },
};

export default seoConfig;
