import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";
import { useRouter } from "next/router";
import seoConfig from "./seo.config";
import dynamic from "next/dynamic";

// Dynamically import to prevent SSR hydration mismatch (useRegion depends on client-side localStorage)
const RegionSegmentedControl = dynamic(() => import("@/components/region-segmented-control").then(mod => ({ default: mod.RegionSegmentedControl })), {
  ssr: false,
  loading: () => <div className="w-[100px] h-7" /> // Placeholder to prevent layout shift
});

const config: DocsThemeConfig = {
  logo: (
    <img src={"/img/logo.svg"} alt={"WhiteBIT logo"} width={32} height={32} />
  ),
  project: {
    link: "https://github.com/whitebit-exchange/api-docs",
  },
  docsRepositoryBase: "https://github.com/whitebit-exchange/api-docs/blob/main",
  color: { hue: 43, saturation: 79, lightness: 61 },
  backgroundColor: {
    light: "hsl(220, 14%, 98%)",
    dark: "hsl(240, 10%, 4%)",
  },
  footer: {
    component: <div />,
  },
  navbar: {
    extraContent: (
      <div className="region-toggle-wrapper">
        <RegionSegmentedControl size="sm" showTooltip={true} />
      </div>
    ),
  },
  head: function useHead() {
    const { route, locale } = useRouter();
    const pagePath = route === "/" ? "index" : route.replace(/^\//, "");

    const pageConfig = seoConfig[pagePath] || {
      title: "WhiteBIT API Documentation",
      description:
        "Official WhiteBIT API documentation: integrate, trade, and access market data with ease using our developer-friendly guides and endpoints.",
      keywords: [
        "api",
        "cryptocurrency",
        "exchange",
        "trading",
        "documentation",
      ],
      category: "Documentation",
      section: "Overview",
      og: {
        title: "WhiteBIT API Docs",
        description: "Complete guide to WhiteBIT's cryptocurrency exchange API",
      },
    };

    const canonicalUrl = `https://docs.whitebit.com${route}`;
    const ogImageUrl = `/og-images/${
      pagePath === "index" ? "home" : pagePath
    }.png`;
    const currentDate = new Date().toISOString();

    return (
      <>
        <title>{pageConfig.title}</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=5.0"
        />

        {/* Primary Meta Tags */}
        <meta name="title" content={pageConfig.title} />
        <meta name="description" content={pageConfig.description} />
        <meta
          name="keywords"
          content={
            pageConfig.keywords?.join(", ") ||
            "WhiteBIT API, cryptocurrency exchange, trading API, crypto trading, API documentation"
          }
        />
        <meta name="author" content="WhiteBIT" />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#000000" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta
          property="og:title"
          content={pageConfig.title}
        />
        <meta
          property="og:description"
          content={pageConfig.description}
        />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:site_name" content="WhiteBIT API Documentation" />
        <meta property="og:locale" content={locale || "en"} />
        <meta property="og:article:author" content="WhiteBIT" />
        <meta property="og:article:modified_time" content={currentDate} />
        <meta property="og:article:section" content={pageConfig.section} />
        {pageConfig.keywords?.map((keyword, index) => (
          <meta key={index} property="og:article:tag" content={keyword} />
        ))}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@whitebit" />
        <meta name="twitter:creator" content="@whitebit" />
        <meta
          name="twitter:title"
          content={pageConfig.title}
        />
        <meta
          name="twitter:description"
          content={pageConfig.description}
        />
        <meta name="twitter:image" content={ogImageUrl} />
        <meta name="twitter:domain" content="docs.whitebit.com" />

        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="application-name" content="WhiteBIT Docs" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta
          name="apple-mobile-web-app-title"
          content="WhiteBIT API Documentation"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* Icons */}
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" type="image/x-icon" href="/img/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/img/favicon-16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/img/favicon-32x32.png"
        />
        <link rel="apple-touch-icon" href="/img/logo.svg" />

        {/* Preconnect to important origins */}
        <link rel="preconnect" href="https://whitebit.com" />
        <link rel="dns-prefetch" href="https://whitebit.com" />

        {/* Performance optimization */}
        <link rel="preload" href="/img/logo.svg" as="image" />
        <link rel="preload" href={ogImageUrl} as="image" />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechnicalArticle",
            headline: pageConfig.title,
            description: pageConfig.description,
            image: ogImageUrl,
            keywords: pageConfig.keywords?.join(", "),
            author: {
              "@type": "Organization",
              name: "WhiteBIT",
              url: "https://whitebit.com",
              logo: {
                "@type": "ImageObject",
                url: "https://docs.whitebit.com/img/logo.svg",
              },
            },
            publisher: {
              "@type": "Organization",
              name: "WhiteBIT",
              logo: {
                "@type": "ImageObject",
                url: "https://docs.whitebit.com/img/logo.svg",
              },
            },
            url: canonicalUrl,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": canonicalUrl,
            },
            dateModified: currentDate,
            inLanguage: locale || "en",
            technicalLevel: "Expert",
            articleSection: pageConfig.section,
            genre: pageConfig.category,
            accessMode: ["textual", "visual"],
            accessibilityFeature: [
              "alternativeText",
              "tableOfContents",
              "readingOrder",
            ],
            accessibilityHazard: "none",
          })}
        </script>

        {/* Breadcrumb Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "WhiteBIT API Documentation",
                item: "https://docs.whitebit.com",
              },
              ...(pageConfig.category
                ? [
                    {
                      "@type": "ListItem",
                      position: 2,
                      name: pageConfig.category,
                      item: `https://docs.whitebit.com/${pageConfig.category.toLowerCase()}`,
                    },
                  ]
                : []),
              ...(pageConfig.section
                ? [
                    {
                      "@type": "ListItem",
                      position: 3,
                      name: pageConfig.section,
                      item: canonicalUrl,
                    },
                  ]
                : []),
            ],
          })}
        </script>
      </>
    );
  },
  navigation: false,
};

export default config;
