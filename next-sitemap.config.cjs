/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://docs.whitebit.com',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  robotsTxtOptions: {
    additionalSitemaps: [],
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
  changefreq: 'weekly',
  priority: 0.8,
}
