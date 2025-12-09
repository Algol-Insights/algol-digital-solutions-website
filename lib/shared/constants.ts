// Algol Insights Group - Constants and Configuration

export const COMPANY_INFO = {
  name: "Algol Insights",
  legalName: "Algol Insights (Pvt) Ltd",
  tagline: "Hacking the Future",
  founded: 2025,
  launching: 2026,
  country: "Zimbabwe",
  city: "Harare",
  email: "info@algolinsights.com",
  phone: "+263 242 000 000",
} as const

export const BRAND_COLORS = {
  tealDarkest: "#0D3B3B",
  tealDark: "#1A4747",
  tealMedium: "#156363",
  tealLight: "#2D8080",
  golden: "#C4A84D",
  goldenLight: "#D4BE73",
  creamWarm: "#FFF8E7",
  creamSoft: "#F5F0E3",
} as const

export const SUBSIDIARIES = {
  web: {
    name: "Algol Insights",
    slug: "web",
    domain: "algolinsights.com",
    description: "Technology holding company pioneering fintech and digital solutions in Africa",
    color: "teal",
  },
  financia: {
    name: "Financia",
    slug: "financia",
    domain: "financia.co.zw",
    description: "Comprehensive wealth management and investment platform",
    color: "golden",
  },
  security: {
    name: "Algol Cyber Security",
    slug: "security",
    domain: "security.algolinsights.com",
    description: "Enterprise cybersecurity and CDPA compliance services",
    color: "teal",
  },
  analytics: {
    name: "Algol Analytics",
    slug: "analytics",
    domain: "analytics.algolinsights.com",
    description: "Data analytics, ML/AI solutions, and business intelligence",
    color: "blue",
  },
  digitalHomes: {
    name: "Algol Digital Homes",
    slug: "digital-homes",
    domain: "digitalhomes.algolinsights.com",
    description: "Smart home automation and IoT solutions",
    color: "purple",
  },
  forensics: {
    name: "Algol Digital Forensics",
    slug: "forensics",
    domain: "forensics.algolinsights.com",
    description: "Digital forensics, incident response, and evidence recovery",
    color: "red",
  },
  futureFund: {
    name: "Future Fund",
    slug: "future-fund",
    domain: "futurefund.co.zw",
    description: "Investment fund focused on emerging markets and technology",
    color: "golden",
  },
} as const

export const SOCIAL_LINKS = {
  twitter: "https://twitter.com/algolinsights",
  linkedin: "https://www.linkedin.com/company/algol-insights",
  facebook: "https://www.facebook.com/algolinsights",
  instagram: "https://www.instagram.com/algolinsights",
  github: "https://github.com/algol-insights",
} as const

export const LEGAL = {
  cdpaCompliant: true,
  dataProtectionOfficer: "dpo@algolinsights.com",
  privacyPolicy: "/legal/privacy",
  termsOfService: "/legal/terms",
  cookiePolicy: "/legal/cookies",
} as const

export type SubsidiaryKey = keyof typeof SUBSIDIARIES
export type Subsidiary = typeof SUBSIDIARIES[SubsidiaryKey]
