const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
});

const isProduction = process.env.NODE_ENV === "production";
const assetPrefix = isProduction ? "/api-documentation" : "";

module.exports = {
  ...withNextra(),
  async redirects() {
    return [
      {
        source: "/",
        destination: "/public/http-v1",
        permanent: true,
      },
    ];
  },
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true,
  assetPrefix,
  basePath: assetPrefix,
};
