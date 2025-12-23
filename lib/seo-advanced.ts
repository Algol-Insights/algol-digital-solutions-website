import type { Metadata } from 'next'

export interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  ogImage?: string
  ogType?: 'website' | 'article'
  author?: string
  url?: string
  structuredData?: Record<string, any>
}

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords,
    ogImage,
    ogType = 'website',
    author,
    url,
  } = config

  return {
    title,
    description,
    keywords: keywords?.join(', '),
    authors: author ? [{ name: author }] : undefined,
    openGraph: {
      title,
      description,
      type: ogType,
      url: url || 'https://algolinsights.com',
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: url || 'https://algolinsights.com',
    },
  }
}

// Schema.org structured data generators

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Algol Insights',
    description:
      'Building Africa\'s fintech future through technology, innovation, and trust',
    url: 'https://algolinsights.com',
    logo: 'https://algolinsights.com/logo.png',
    sameAs: [
      'https://twitter.com/algolinsights',
      'https://linkedin.com/company/algol-insights',
      'https://facebook.com/algolinsights',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      telephone: '+263-242-708634',
      email: 'support@algoldigital.com',
    },
  }
}

export function generateProductSchema(product: {
  name: string
  description: string
  price: number
  currency?: string
  rating?: number
  reviewCount?: number
  image?: string
  url?: string
}) {
  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    brand: {
      '@type': 'Brand',
      name: 'Algol Insights',
    },
    offers: {
      '@type': 'Offer',
      url: product.url,
      priceCurrency: product.currency || 'USD',
      price: product.price.toString(),
      availability: 'https://schema.org/InStock',
    },
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating.toString(),
        reviewCount: product.reviewCount || 0,
      },
    }),
  }
}

export function generateArticleSchema(article: {
  title: string
  description: string
  author: string
  publishedDate: Date
  modifiedDate?: Date
  image?: string
  url?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.publishedDate.toISOString(),
    dateModified: article.modifiedDate?.toISOString() || article.publishedDate.toISOString(),
    author: {
      '@type': 'Person',
      name: article.author,
    },
  }
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateLocalBusinessSchema(business: {
  name: string
  address: string
  phone: string
  email: string
  openingHours: string[]
  image?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    image: business.image,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address,
      addressCountry: 'ZW',
    },
    telephone: business.phone,
    email: business.email,
    openingHoursSpecification: business.openingHours.map((hours) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: hours.split(':')[0],
      opens: hours.split(':')[1],
      closes: hours.split(':')[2],
    })),
  }
}

// SEO utility functions

export function generateSitemap(routes: Array<{ url: string; lastmod?: Date; changefreq?: string; priority?: number }>) {
  const baseUrl = 'https://algolinsights.com'

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `
  <url>
    <loc>${baseUrl}${route.url}</loc>
    ${route.lastmod ? `<lastmod>${route.lastmod.toISOString().split('T')[0]}</lastmod>` : ''}
    ${route.changefreq ? `<changefreq>${route.changefreq}</changefreq>` : ''}
    ${route.priority ? `<priority>${route.priority}</priority>` : ''}
  </url>
  `
  )
  .join('')}
</urlset>`

  return sitemap
}

export const robotsFile = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api
Disallow: /*.json$
Disallow: /*?*

Sitemap: https://algolinsights.com/sitemap.xml
`

// SEO recommendations

export const SEO_TIPS = {
  TITLE: 'Keep between 50-60 characters',
  DESCRIPTION: 'Keep between 155-160 characters',
  KEYWORDS: 'Use 5-10 relevant keywords',
  HEADINGS: 'Use H1 for main title, H2-H6 for sections',
  IMAGES: 'Use descriptive alt text',
  LINKS: 'Use descriptive anchor text',
  CONTENT: 'Aim for 300+ words per page',
  MOBILE: 'Ensure mobile-friendly design',
}
