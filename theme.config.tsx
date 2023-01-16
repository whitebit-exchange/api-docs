import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";
import { assetPrefix } from "./constants";

const config: DocsThemeConfig = {
  logo: (
    <img
      src={`${assetPrefix}/img/logo.svg`}
      alt={"WhiteBIT logo"}
      width={32}
      height={32}
    />
  ),
  project: {
    link: "https://github.com/whitebit-exchange/api-documentation",
  },
  docsRepositoryBase: "https://github.com/whitebit-exchange/api-documentation/blob/main",
  useNextSeoProps() {
    return {
      titleTemplate: "%s | WhiteBIT API Documentation",
      openGraph: {
        images: [{ url: `${assetPrefix}/img/og-image.png` }],
        siteName: "WhiteBIT API Documentation",
      },
    };
  },
  primaryHue: 43,
  footer: {
    text: (
      <span>
        {new Date().getFullYear()} ©{" "}
        <a href="https://whitebit.com" target="_blank">
          WhiteBIT
        </a>
      </span>
    ),
  },
  head: (
    <>
      <link rel="icon" href={`${assetPrefix}/img/favicon.svg`} />
    </>
  ),
};

export default config;
