import nextra from "nextra";
import { DEFAULT_REGION } from "./config/regions";

const withNextra = nextra({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
  defaultShowCopyCode: true,
  search: true,
  mdxOptions: {
    rehypePrettyCodeOptions: {
      theme: {
        dark: "dark-plus",
        light: "min-light",
      },
    },
  },
});

export default withNextra({
  images: {
    unoptimized: true,
  },
  output: "export",
  reactStrictMode: true,
  trailingSlash: true,
  poweredByHeader: false,
  env: {
    // Support for region configuration via environment variables
    NEXT_PUBLIC_DEFAULT_REGION: process.env.NEXT_PUBLIC_DEFAULT_REGION || DEFAULT_REGION,
  },
});
