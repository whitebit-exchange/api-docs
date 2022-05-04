// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
module.exports = {
  docs: [
    {
      type: "category",
      label: "Public",
      collapsible: true,
      collapsed: false,
      link: {
        type: "generated-index",
        title: "Public API overview",
      },
      items: [
        {
          type: "doc",
          id: "Public/http-v1",
          label: "API V1",
        },
        {
          type: "doc",
          id: "Public/http-v2",
          label: "API v2",
        },
        {
          type: "doc",
          id: "Public/http-v4",
          label: "API v4",
        },
        {
          type: "doc",
          id: "Public/websocket",
          label: "WebSocket API",
        },
      ],
    },
    {
      type: "category",
      label: "Private",
      collapsible: true,
      collapsed: false,
      link: {
        type: "generated-index",
        title: "Private API overview",
      },
      items: [
        {
          type: "doc",
          id: "Private/http-auth",
          label: "API Authentication",
        },
        {
          type: "doc",
          id: "Private/http-main-v4",
          label: "Main API V4",
        },
        {
          type: "doc",
          id: "Private/http-trade-v4",
          label: "Trade API V4",
        },
        {
          type: "doc",
          id: "Private/websocket",
          label: "WebSocket API",
        },
      ],
    },
    {
      type: "category",
      label: "Web Hook",
      collapsible: true,
      collapsed: false,
      link: {
        type: "generated-index",
        title: "Web Hook overview",
      },
      items: [
        {
          type: "doc",
          id: "WebHook/web-hook",
          label: "API",
        },
      ],
    },
  ],
};
