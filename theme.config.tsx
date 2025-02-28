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
    const { route, locale } = useRouter();
    const pagePath = route === "/" ? "index" : route.replace(/^\//, "");

    const pageConfig = seoConfig[pagePath] || {
      title: "WhiteBIT API Documentation",
      description: "Official WhiteBIT API documentation: integrate, trade, and access market data with ease using our developer-friendly guides and endpoints.",
    };

    const canonicalUrl = `https://docs.whitebit.com${route}`;
    const ogImageUrl = "https://docs.whitebit.com/img/og-image.png";

    return (
      <>
        <title>{pageConfig.title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />

        {/* Primary Meta Tags */}
        <meta name="title" content={pageConfig.title} />
        <meta name="description" content={pageConfig.description} />
        <meta name="keywords" content="WhiteBIT API, cryptocurrency exchange, trading API, crypto trading, API documentation, WebSocket API, REST API" />
        <meta name="author" content="WhiteBIT" />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#000000" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={pageConfig.title} />
        <meta property="og:description" content={pageConfig.description} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:site_name" content="WhiteBIT API Documentation" />
        <meta property="og:locale" content={locale || 'en'} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@whitebit" />
        <meta name="twitter:creator" content="@whitebit" />
        <meta name="twitter:title" content={pageConfig.title} />
        <meta name="twitter:description" content={pageConfig.description} />
        <meta name="twitter:image" content={ogImageUrl} />
        <meta name="twitter:domain" content="docs.whitebit.com" />

        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="application-name" content="WhiteBIT Docs" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="WhiteBIT API Documentation" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* Icons */}
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" type="image/x-icon" href="/img/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/img/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/img/favicon-32x32.png" />
        <link rel="apple-touch-icon" href="/img/logo.svg" />

        {/* Preconnect to important origins */}
        <link rel="preconnect" href="https://whitebit.com" />
        <link rel="dns-prefetch" href="https://whitebit.com" />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechnicalArticle",
            "headline": pageConfig.title,
            "description": pageConfig.description,
            "image": ogImageUrl,
            "author": {
              "@type": "Organization",
              "name": "WhiteBIT",
              "url": "https://whitebit.com"
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
            },
            "dateModified": new Date().toISOString(),
            "inLanguage": locale || "en",
            "technicalLevel": "Expert"
          })}
        </script>
      </>
    );
  },
  navigation: false,
};

export default config;
