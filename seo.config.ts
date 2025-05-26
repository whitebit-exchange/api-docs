interface SEOConfig {
  // used for the title of the page
  title: string;
  // used for the description of the page
  description: string;
  // used for generating the ogImage:image of the page
  ogImage: {
    title: string;
    description: string;
  };
  keywords?: string[];
  category?: string;
  section?: string;
  canonicalPath?: string;
}

interface PageSEOConfig {
  [key: string]: SEOConfig;
}

const seoConfig: PageSEOConfig = {
  index: {
    title: "WhiteBIT API Documentation | Cryptocurrency Exchange",
    description: "Comprehensive guide to WhiteBIT API. Access market data, trading endpoints, WebSockets, and authentication guides for seamless integration.",
    keywords: ["api", "cryptocurrency", "exchange", "trading", "documentation", "whitebit"],
    category: "Documentation",
    section: "Overview",
    ogImage: {
      title: "WhiteBIT API Docs",
      description: "Complete guide to cryptocurrency exchange API"
    }
  },
  changelog: {
    title: "API Changelog | WhiteBIT API Documentation",
    description: "Track all updates, improvements, and upcoming changes to the WhiteBIT API platform. Stay informed about new features, deprecations, and platform evolution.",
    keywords: ["changelog", "api updates", "release notes", "api changes", "platform updates", "whitebit"],
    category: "Platform",
    section: "Updates",
    ogImage: {
      title: "API Changelog",
      description: "Track API platform evolution"
    }
  },
  "guides/client-order-id": {
    title: "Client Order ID Guide | WhiteBIT API Documentation",
    description: "Complete guide to using clientOrderId for order tracking and strategy identification. Includes naming conventions and best practices.",
    keywords: ["client order id", "order tracking", "trading strategy", "api guide"],
    category: "Guides",
    section: "Trading",
    ogImage: {
      title: "Client Order ID Guide",
      description: "Track orders & identify trading strategies"
    }
  },
  "guides/fireblocks": {
    title: "Fireblocks Integration Guide | WhiteBIT API Documentation",
    description: "Step-by-step instructions for connecting your WhiteBIT account to Fireblocks via API, including API key generation and security best practices.",
    keywords: ["fireblocks", "integration", "api", "whitebit", "security", "api key"],
    category: "Guides",
    section: "Integrations",
    ogImage: {
      title: "Fireblocks Integration Guide",
      description: "Connect WhiteBIT to Fireblocks via API"
    }
  },
  "platform/overview": {
    title: "API Overview | WhiteBIT API Documentation",
    description: "Complete overview of WhiteBIT's API including public/private endpoints, WebSockets, webhooks, and authentication requirements.",
    keywords: ["api overview", "endpoints", "websockets", "webhooks", "authentication"],
    category: "Platform",
    section: "Overview",
    ogImage: {
      title: "API Overview",
      description: "Endpoints, WebSockets & authentication"
    }
  },
  // Platform features
  "platform/self-trade-prevention": {
    title: "Self Trade Prevention (STP) | WhiteBIT API Documentation",
    description: "Complete guide to implementing STP in your trading systems. Includes modes, supported endpoints, and best practices.",
    keywords: ["self trade prevention", "stp", "algorithmic trading", "trading modes"],
    category: "Platform",
    section: "Features",
    ogImage: {
      title: "Self Trade Prevention",
      description: "STP modes for algorithmic trading"
    }
  },
  "platform/colocation": {
    title: "Colocation Services | WhiteBIT API Documentation",
    description: "Complete guide to professional colocation for high-frequency trading. Execute trades with ultra-low latency through direct exchange connection.",
    keywords: ["colocation", "low latency", "high frequency trading", "hft"],
    category: "Platform",
    section: "Features",
    ogImage: {
      title: "Colocation Services",
      description: "Ultra-low latency trading"
    }
  },
  // Private API endpoints
  "private/http-main-v4": {
    title: "Main Balance API | WhiteBIT API Documentation",
    description: "Complete reference for private HTTP API V4 balance operations. Learn how to manage deposits, withdrawals, and account balances.",
    keywords: ["balance api", "deposits", "withdrawals", "v4 api"],
    category: "API Reference",
    section: "Private",
    ogImage: {
      title: "Main Balance API V4",
      description: "Deposits, withdrawals & balances"
    }
  },
  "private/http-trade-v4": {
    title: "Trading API V4 | WhiteBIT API Documentation",
    description: "Complete reference for V4 trading endpoints. Learn how to place, modify and cancel orders, retrieve history, and manage positions.",
    keywords: ["trading api", "order management", "v4 api", "positions"],
    category: "API Reference",
    section: "Private",
    ogImage: {
      title: "Trading API V4",
      description: "Order management & positions"
    }
  },
  "private/http-trade-v1": {
    title: "Trading API V1 | WhiteBIT API Documentation",
    description: "Complete documentation for legacy V1 trading API. Reference guide for maintaining existing integrations with code examples.",
    keywords: ["trading api", "legacy api", "v1 api", "integration"],
    category: "API Reference",
    section: "Private",
    ogImage: {
      title: "Trading API V1",
      description: "Legacy trading endpoints"
    }
  },
  "private/http-auth": {
    title: "API Authentication | WhiteBIT API Documentation",
    description: "Complete guide for implementing secure authentication. Learn to generate signatures, manage API keys, and secure requests.",
    keywords: ["authentication", "api keys", "signatures", "security"],
    category: "API Reference",
    section: "Private",
    ogImage: {
      title: "API Authentication",
      description: "Keys, signatures & secure requests"
    }
  },
  "private/websocket": {
    title: "Private WebSocket API | WhiteBIT API Documentation",
    description: "Complete guide for private WebSocket API implementation. Learn to subscribe to real-time account updates and order executions.",
    keywords: ["websocket", "real-time", "private api", "streaming"],
    category: "API Reference",
    section: "Private",
    ogImage: {
      title: "Private WebSocket API",
      description: "Real-time account updates"
    }
  },
  // Public API endpoints
  "public/http-v4": {
    title: "Public HTTP API V4 | WhiteBIT API Documentation",
    description: "Complete guide to accessing market data, tickers, orderbooks, and trading pairs through V4 public endpoints. No authentication required.",
    keywords: ["market data", "public api", "v4 api", "orderbook"],
    category: "API Reference",
    section: "Public",
    ogImage: {
      title: "Public HTTP API V4",
      description: "Market data & trading pairs"
    }
  },
  "public/http-v2": {
    title: "Public HTTP API V2 | WhiteBIT API Documentation",
    description: "Complete documentation for V2 public API endpoints. Reference guide for existing integrations with response formats.",
    keywords: ["public api", "v2 api", "legacy api", "integration"],
    category: "API Reference",
    section: "Public",
    ogImage: {
      title: "Public HTTP API V2",
      description: "Legacy public endpoints"
    }
  },
  "public/http-v1": {
    title: "Public HTTP API V1 | WhiteBIT API Documentation",
    description: "Complete documentation for legacy V1 public API. Historical reference for first-generation endpoints with examples.",
    keywords: ["public api", "v1 api", "legacy api", "reference"],
    category: "API Reference",
    section: "Public",
    ogImage: {
      title: "Public HTTP API V1",
      description: "First-generation endpoints"
    }
  },
  "public/websocket": {
    title: "Public WebSocket API | WhiteBIT API Documentation",
    description: "Complete guide for public WebSocket API. Learn to stream real-time market data including orderbooks, trades, and price tickers.",
    keywords: ["websocket", "market data", "streaming", "public api"],
    category: "API Reference",
    section: "Public",
    ogImage: {
      title: "Public WebSocket API",
      description: "Stream market data in real-time"
    }
  },
  // Webhook documentation
  "platform/webhook": {
    title: "Webhooks Integration | WhiteBIT API Documentation",
    description: "Complete guide to implementing webhooks for exchange events. Learn to receive notifications for account activities and orders.",
    keywords: ["webhooks", "notifications", "integration", "events"],
    category: "Platform",
    section: "Features",
    ogImage: {
      title: "Webhooks Integration",
      description: "Exchange event notifications"
    }
  },
  // OAuth documentation
  "platform/oauth": {
    title: "OAuth 2.0 Authentication | WhiteBIT API Documentation",
    description: "Complete guide to WhiteBIT's OAuth 2.0 for third-party authentication. Learn about authorization flows and token management.",
    keywords: ["oauth", "authentication", "authorization", "integration"],
    category: "Platform",
    section: "Features",
    ogImage: {
      title: "OAuth 2.0 Authentication",
      description: "Third-party integration flows"
    }
  },
  "platform/oauth/usage": {
    title: "OAuth 2.0 API Reference | WhiteBIT API Documentation",
    description: "Complete implementation guide for OAuth 2.0 with authorization flows, token management, scopes, and account endpoints.",
    keywords: ["oauth", "api reference", "authorization", "scopes"],
    category: "Platform",
    section: "Features",
    ogImage: {
      title: "OAuth 2.0 API Reference",
      description: "Authorization flows & tokens"
    }
  },
  // General pages
  faq: {
    title: "FAQ | WhiteBIT API Documentation",
    description: "Complete answers to common questions about API integration, rate limits, authentication, best practices, and troubleshooting.",
    keywords: ["faq", "questions", "troubleshooting", "help"],
    category: "Support",
    section: "Help",
    ogImage: {
      title: "API FAQ",
      description: "Common questions answered"
    }
  },
  glossary: {
    title: "API Glossary | WhiteBIT API Documentation",
    description: "Complete glossary of trading terms, API concepts, and cryptocurrency terminology used in our documentation.",
    keywords: ["glossary", "terminology", "definitions", "terms"],
    category: "Support",
    section: "Help",
    ogImage: {
      title: "API Glossary",
      description: "Trading & API terminology"
    }
  },
  sdks: {
    title: "API Libraries & SDKs | WhiteBIT API Documentation",
    description: "Complete overview of official SDKs and libraries for WhiteBIT API integration in Python, JavaScript, PHP, and other languages.",
    keywords: ["sdk", "libraries", "integration", "development"],
    category: "Support",
    section: "Development",
    ogImage: {
      title: "API Libraries & SDKs",
      description: "Official integration tools"
    }
  },
};

export default seoConfig;
