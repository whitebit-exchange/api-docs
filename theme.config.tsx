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
    link: "https://github.com/whitebit-exchange/api-docs",
  },
  docsRepositoryBase: "https://github.com/whitebit-exchange/api-docs/blob/main",
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
      <link
        rel="shortcut icon"
        type="image/x-icon"
        href={`${assetPrefix}/img/favicon.ico`}
      />
      <link
        rel="icon"
        type="image/x-icon"
        sizes="16x16"
        href={`${assetPrefix}/img/favicon-16x16.png`}
      />
      <link
        rel="icon"
        type="image/x-icon"
        sizes="32x32"
        href={`${assetPrefix}/img/favicon-32x32.png`}
      />
      <link rel="stylesheet" href={`${assetPrefix}/styles.css`} />
    </>
  ),
  navigation: false,
};

export default config;
