import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <img src={"/static/img/logo.svg"} alt={"WhiteBIT logo"} width={32} height={32}/>,
  project: {
    link: 'https://github.com/whitebit-exchange/api-documentation',
  },
  docsRepositoryBase: 'https://github.com/whitebit-exchange/api-documentation',
  useNextSeoProps() {
    return {
      titleTemplate: '%s | WhiteBIT API Documentation',
      openGraph: {
        images: [
          { url: '/static/img/og-image.png' },
        ],
        siteName: 'SiteName',
      }
    }
  },
  primaryHue: 43,
  head: (
    <>
      <link rel="icon" href="/static/img/favicon.svg" />
    </>
  ),
}

export default config
