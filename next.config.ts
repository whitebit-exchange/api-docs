import nextra from "nextra";

const withNextra = nextra({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
  defaultShowCopyCode: true,
  search: {
    codeblocks: false
  },
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
  async redirects() {
    return [
      {
        source: '/overview',
        destination: '/platform/overview',
        permanent: true,
      },
      {
        source: '/colocation',
        destination: '/platform/colocation',
        permanent: true,
      },
      {
        source: '/oauth',
        destination: '/platform/oauth',
        permanent: true,
      },
      {
        source: '/oauth/:path*',
        destination: '/platform/oauth/:path*',
        permanent: true,
      },
      {
        source: '/webhook',
        destination: '/platform/webhook',
        permanent: true,
      },
      {
        source: '/webhook/:path*',
        destination: '/platform/webhook',
        permanent: true,
      }
    ]
  },
});
