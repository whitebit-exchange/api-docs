const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
});

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
};
