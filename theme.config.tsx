import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
  logo: (
    <img
      src={"/img/logo.svg"}
      alt={"WhiteBIT logo"}
      width={32}
      height={32}
    />
  ),
  project: {
    link: "https://github.com/whitebit-exchange/api-docs",
  },
  docsRepositoryBase: "https://github.com/whitebit-exchange/api-docs/blob/main",
  useNextSeoProps() {
    return {
      titleTemplate: "%s | WhiteBIT API Documentation",
      openGraph: {
        images: [{ url: "/img/og-image.png" }],
        siteName: "WhiteBIT API Documentation",
      },
    };
  },
  primaryHue: 43,
  footer: {
    component: (
      <div />
    ),
  },
  head: (
    <>
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
  ),
  navigation: false,
};

export default config;
