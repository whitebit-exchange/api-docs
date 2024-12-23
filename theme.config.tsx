import React from "react";
import { DocsThemeConfig, useConfig } from "nextra-theme-docs";
import { useRouter } from "next/router";

const config: DocsThemeConfig = {
  logo: (
    <img src={"/img/logo.svg"} alt={"WhiteBIT logo"} width={32} height={32} />
  ),
  project: {
    link: "https://github.com/whitebit-exchange/api-docs",
  },
  docsRepositoryBase: "https://github.com/whitebit-exchange/api-docs/blob/main",
  color: { hue: 43 },
  backgroundColor: {
    light: "255,255,255",
    dark: "0,0,0",
  },
  footer: {
    component: <div />,
  },
  head: function useHead() {
    const config = useConfig();
    const { route } = useRouter();

    const description =
      "Official WhiteBIT API docs: integrate, trade, and access market data with ease using our developer-friendly guides and endpoints.";
    const title =
      config.title + (route === "/" ? "" : " | WhiteBIT API Documentation");

    return (
      <>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={"/img/og-image.png"} />

        <meta httpEquiv="Content-Language" content="en" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site:domain" content="docs.whitebit.com" />
        <meta name="twitter:url" content="https://docs.whitebit.com" />
        <meta
          name="apple-mobile-web-app-title"
          content="WhiteBIT API Documentation"
        />
        <link
          rel="shortcut icon"
          type="image/x-icon"
          href={"/img/favicon.ico"}
        />
        <link
          rel="icon"
          type="image/x-icon"
          sizes="16x16"
          href={"/img/favicon-16x16.png"}
        />
        <link
          rel="icon"
          type="image/x-icon"
          sizes="32x32"
          href={"/img/favicon-32x32.png"}
        />
      </>
    );
  },
  navigation: false,
};

export default config;
