// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'WhiteBIT API Documentation',
  tagline: '',
  url: 'https://whitebit-exchange.github.io',
  baseUrl: '/api-docs/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'whitebit-exchange',
  projectName: 'api-docs',
  trailingSlash: false,
  plugins: [
    [
      require.resolve("@cmfcmf/docusaurus-search-local"),
      {
      },
    ],
  ],
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'dark',
        respectPrefersColorScheme: true,
      },
      navbar: {
        logo: {
          alt: 'WhiteBIT logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'doc',
            docId: '/category/public',
            position: 'left',
            label: 'Docs',
          },
          {
            href: 'https://github.com/whitebit-exchange/api-docs',
            className: 'navbar-item-github',
            position: 'right',
          },
        ],
      },
      footer: {
        copyright: `Copyright © ${new Date().getFullYear()} WhiteBIT`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
