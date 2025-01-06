/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://docs.whitebit.com', // Replace with your actual domain
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  exclude: ['/404'], // Add any pages you want to exclude
  robotsTxtOptions: {
    additionalSitemaps: [],
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
  // Since this is a documentation site, we want search engines to index all pages
  changefreq: 'weekly',
  priority: 0.7,
}
