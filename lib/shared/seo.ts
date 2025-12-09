import { COMPANY_INFO, SUBSIDIARIES, type SubsidiaryKey } from "./constants"

export interface SeoConfig {
  title: string
  description: string
  url: string
  image?: string
  type?: "website" | "article"
  publishedTime?: string
  modifiedTime?: string
  author?: string
  keywords?: string[]
}

export function generateMetadata(config: SeoConfig, subsidiary?: SubsidiaryKey) {
  const sub = subsidiary ? SUBSIDIARIES[subsidiary] : SUBSIDIARIES.web
  const fullTitle = config.title === sub.name 
    ? `${config.title} | ${COMPANY_INFO.tagline}`
    : `${config.title} | ${sub.name}`

  return {
    title: fullTitle,
    description: config.description,
    keywords: config.keywords?.join(", "),
    openGraph: {
      title: fullTitle,
      description: config.description,
      url: config.url,
      siteName: sub.name,
      type: config.type || "website",
      images: config.image ? [{ url: config.image, width: 1200, height: 630 }] : undefined,
      ...(config.publishedTime && { publishedTime: config.publishedTime }),
      ...(config.modifiedTime && { modifiedTime: config.modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: config.description,
      images: config.image ? [config.image] : undefined,
    },
    alternates: {
      canonical: config.url,
    },
  }
}

export function jsonLdOrganization(subsidiary?: SubsidiaryKey) {
  const sub = subsidiary ? SUBSIDIARIES[subsidiary] : SUBSIDIARIES.web
  
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `https://${sub.domain}/#organization`,
    name: sub.name,
    url: `https://${sub.domain}`,
    description: sub.description,
    parentOrganization: subsidiary ? {
      "@type": "Organization",
      name: COMPANY_INFO.name,
      url: `https://${SUBSIDIARIES.web.domain}`,
    } : undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: COMPANY_INFO.city,
      addressCountry: COMPANY_INFO.country,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: COMPANY_INFO.email,
    },
  }
}

export function jsonLdWebSite(subsidiary?: SubsidiaryKey) {
  const sub = subsidiary ? SUBSIDIARIES[subsidiary] : SUBSIDIARIES.web
  
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `https://${sub.domain}/#website`,
    url: `https://${sub.domain}`,
    name: sub.name,
    description: sub.description,
    publisher: {
      "@id": `https://${sub.domain}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `https://${sub.domain}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
}

export function jsonLdBreadcrumb(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function jsonLdService(service: {
  name: string
  description: string
  url: string
  provider?: SubsidiaryKey
}) {
  const sub = service.provider ? SUBSIDIARIES[service.provider] : SUBSIDIARIES.web
  
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: service.url,
    provider: {
      "@type": "Organization",
      name: sub.name,
      url: `https://${sub.domain}`,
    },
    areaServed: {
      "@type": "Country",
      name: COMPANY_INFO.country,
    },
  }
}
