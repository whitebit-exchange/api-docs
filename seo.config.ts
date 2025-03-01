interface SEOConfig {
  title: string;
  description: string;
}

interface PageSEOConfig {
  [key: string]: SEOConfig;
}

const seoConfig: PageSEOConfig = {
  index: {
    title: "WhiteBIT API Documentation | Cryptocurrency Exchange",
    description: "Official WhiteBIT API documentation. Access market data, trading endpoints, WebSockets, and authentication guides for seamless integration.",
  },
  "guides/client-order-id": {
    title: "Client Order ID Guide | WhiteBIT API",
    description: "Learn to use clientOrderId for order tracking and strategy identification. Includes naming conventions, best practices, and examples.",
  },
  "platform/overview": {
    title: "API Overview | WhiteBIT Documentation",
    description: "Overview of WhiteBIT's API including public/private endpoints, WebSockets, webhooks, and authentication requirements.",
  },
  // Platform features
  "platform/self-trade-prevention": {
    title: "Self Trade Prevention (STP) | WhiteBIT API",
    description: "Implement STP in your trading systems. Learn about modes, supported endpoints, and best practices for algorithmic traders.",
  },
  "platform/colocation": {
    title: "Colocation Services | Low-Latency Trading | WhiteBIT",
    description: "Professional colocation for high-frequency trading. Execute trades with ultra-low latency through direct exchange connection.",
  },
  // Private API endpoints
  "private/http-main-v4": {
    title: "Main Balance API | Private HTTP V4 | WhiteBIT",
    description: "Reference for private HTTP API V4 balance operations. Manage deposits, withdrawals, and account balances securely.",
  },
  "private/http-trade-v4": {
    title: "Trading API V4 | Order Management | WhiteBIT",
    description: "API reference for V4 trading endpoints. Place, modify and cancel orders, retrieve history, and manage positions.",
  },
  "private/http-trade-v1": {
    title: "Trading API V1 | Legacy Endpoints | WhiteBIT",
    description: "Documentation for legacy V1 trading API. Reference guide for maintaining existing integrations with code examples.",
  },
  "private/http-auth": {
    title: "API Authentication | WhiteBIT Security Guide",
    description: "Step-by-step guide for implementing secure authentication. Learn to generate signatures, manage API keys, and secure requests.",
  },
  "private/websocket": {
    title: "Private WebSocket API | WhiteBIT Real-time Updates",
    description: "Guide for private WebSocket API implementation. Subscribe to real-time account updates, order executions, and balance changes.",
  },
  // Public API endpoints
  "public/http-v4": {
    title: "Public HTTP API V4 | WhiteBIT Market Data",
    description: "Access market data, tickers, orderbooks, and trading pairs through V4 public endpoints. No authentication required.",
  },
  "public/http-v2": {
    title: "Public HTTP API V2 | WhiteBIT Legacy Endpoints",
    description: "Documentation for V2 public API endpoints. Reference guide for existing integrations with response formats.",
  },
  "public/http-v1": {
    title: "Public HTTP API V1 | WhiteBIT Legacy Reference",
    description: "Legacy V1 public API documentation. Historical reference for first-generation endpoints with examples.",
  },
  "public/websocket": {
    title: "Public WebSocket API | WhiteBIT Market Streams",
    description: "Guide for public WebSocket API. Stream real-time market data including orderbooks, trades, and price tickers.",
  },
  // Webhook documentation
  "platform/webhook": {
    title: "Webhooks Integration | WhiteBIT API Notifications",
    description: "Guide to implementing webhooks for exchange events. Receive notifications for account activities, orders, and balance changes.",
  },
  // OAuth documentation
  "platform/oauth": {
    title: "OAuth 2.0 Authentication | WhiteBIT Integration",
    description: "Guide to WhiteBIT's OAuth 2.0 for third-party authentication. Learn about authorization flows, scopes, and token management.",
  },
  "platform/oauth/usage": {
    title: "OAuth 2.0 API Reference | WhiteBIT Authorization",
    description: "OAuth 2.0 implementation guide with authorization flows, token management, scopes, and account endpoints with examples.",
  },
  // General pages
  faq: {
    title: "WhiteBIT API FAQ | Frequently Asked Questions",
    description: "Answers to common questions about API integration, rate limits, authentication, best practices, and troubleshooting.",
  },
  glossary: {
    title: "API Glossary | WhiteBIT Trading Terminology",
    description: "Comprehensive glossary of trading terms, API concepts, and cryptocurrency terminology used in our documentation.",
  },
  sdks: {
    title: "WhiteBIT API Libraries & SDKs | Developer Tools",
    description: "Official SDKs and libraries for WhiteBIT API integration in Python, JavaScript, PHP, and other programming languages.",
  },
};

export default seoConfig;
