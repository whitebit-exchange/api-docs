import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";
import { useRouter } from "next/router";
import seoConfig from "./seo.config";

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
    const { route } = useRouter();
    const pagePath = route === "/" ? "index" : route.replace(/^\//, "");

    const pageConfig = seoConfig[pagePath] || {
      title: "WhiteBIT API Documentation",
      description: "Official WhiteBIT API documentation: integrate, trade, and access market data with ease using our developer-friendly guides and endpoints.",
    };

    const canonicalUrl = `https://docs.whitebit.com${route}`;

    return (
      <>
        <title>{pageConfig.title}</title>
        <meta property="og:title" content={pageConfig.title} />
        <meta name="description" content={pageConfig.description} />
        <meta property="og:description" content={pageConfig.description} />
        <meta property="og:image" content={"/img/og-image.png"} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="WhiteBIT API Documentation" />

        <meta httpEquiv="Content-Language" content="en" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site:domain" content="docs.whitebit.com" />
        <meta name="twitter:url" content="https://docs.whitebit.com" />
        <meta name="twitter:title" content={pageConfig.title} />
        <meta name="twitter:description" content={pageConfig.description} />
        <meta name="twitter:image" content={"/img/og-image.png"} />

        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="keywords" content="WhiteBIT API, cryptocurrency exchange, trading API, crypto trading, API documentation, WebSocket API, REST API" />
        <meta name="author" content="WhiteBIT" />
        <meta name="robots" content="index, follow" />

        <link rel="canonical" href={canonicalUrl} />
        <link
          rel="apple-mobile-web-app-title"
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

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechnicalArticle",
            "headline": pageConfig.title,
            "description": pageConfig.description,
            "image": "https://docs.whitebit.com/img/og-image.png",
            "author": {
              "@type": "Organization",
              "name": "WhiteBIT"
            },
            "publisher": {
              "@type": "Organization",
              "name": "WhiteBIT",
              "logo": {
                "@type": "ImageObject",
                "url": "https://docs.whitebit.com/img/logo.svg"
              }
            },
            "url": canonicalUrl,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": canonicalUrl
            }
          })}
        </script>
      </>
    );
  },
  navigation: false,
};

export default config;
