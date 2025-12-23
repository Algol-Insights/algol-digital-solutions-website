const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const services = [
  {
    name: 'Custom Software Development',
    slug: 'custom-software-development',
    description: 'Tailored software solutions for your unique business needs',
    longDescription: 'We create custom software applications designed specifically for your business processes and requirements.',
    icon: 'code',
    price: 5000,
    pricingType: 'from',
    category: 'Software Development',
    featured: true,
    active: true,
    features: ['Custom web applications', 'Mobile app development', 'API integration', 'Database design'],
    sortOrder: 1,
  },
  {
    name: 'Web Design & Development',
    slug: 'web-design-development',
    description: 'Professional websites that drive results',
    longDescription: 'Modern, responsive websites built with the latest technologies to help your business grow online.',
    icon: 'globe',
    price: 1500,
    pricingType: 'from',
    category: 'Web Services',
    featured: true,
    active: true,
    features: ['Responsive design', 'SEO optimization', 'E-commerce integration', 'CMS setup'],
    sortOrder: 2,
  },
  {
    name: 'IT Consulting',
    slug: 'it-consulting',
    description: 'Expert guidance for your technology decisions',
    longDescription: 'Strategic IT consulting to help you make informed technology decisions and optimize your infrastructure.',
    icon: 'users',
    price: 150,
    pricingType: 'from',
    duration: 'per hour',
    category: 'Consulting',
    featured: true,
    active: true,
    features: ['Technology assessment', 'Digital transformation', 'Infrastructure planning', 'Security audit'],
    sortOrder: 3,
  },
  {
    name: 'CCTV Installation & Monitoring',
    slug: 'cctv-installation',
    description: 'Professional security camera systems',
    longDescription: 'Complete CCTV solutions including installation, configuration, and 24/7 monitoring services.',
    icon: 'video',
    price: 800,
    pricingType: 'from',
    category: 'Security Systems',
    featured: true,
    active: true,
    features: ['HD cameras', 'Remote viewing', 'Night vision', 'Recording systems', 'Professional installation'],
    sortOrder: 4,
  },
  {
    name: 'Network Setup & Configuration',
    slug: 'network-setup',
    description: 'Reliable network infrastructure',
    longDescription: 'Professional network design and setup for homes and businesses with optimal performance and security.',
    icon: 'network',
    price: 500,
    pricingType: 'from',
    category: 'Networking',
    featured: false,
    active: true,
    features: ['Router configuration', 'WiFi optimization', 'Network security', 'Cable installation'],
    sortOrder: 5,
  },
  {
    name: 'Digital Marketing & SEO',
    slug: 'digital-marketing-seo',
    description: 'Grow your online presence',
    longDescription: 'Comprehensive digital marketing services to increase your visibility and drive traffic to your business.',
    icon: 'trending-up',
    price: 200,
    pricingType: 'from',
    duration: 'per month',
    category: 'Marketing',
    featured: false,
    active: true,
    features: ['SEO optimization', 'Social media management', 'Content marketing', 'Google Ads', 'Email campaigns'],
    sortOrder: 6,
  },
  {
    name: 'Business Automation & AI',
    slug: 'business-automation',
    description: 'Streamline your operations with automation',
    longDescription: 'Implement intelligent automation solutions to reduce manual work and increase efficiency.',
    icon: 'zap',
    price: 1500,
    pricingType: 'from',
    category: 'Automation',
    featured: false,
    active: true,
    features: ['Process automation', 'AI chatbots', 'Workflow optimization', 'ERP/CRM integration'],
    sortOrder: 7,
  },
  {
    name: 'Web Hosting & Domains',
    slug: 'web-hosting-domains',
    description: 'Fast, secure hosting solutions',
    longDescription: 'Reliable web hosting with 99.9% uptime guarantee, domain registration, and email hosting.',
    icon: 'server',
    price: 5,
    pricingType: 'from',
    duration: 'per month',
    category: 'Hosting',
    featured: false,
    active: true,
    features: ['Domain registration', 'SSD storage', 'Email hosting', 'SSL certificates', '24/7 support'],
    sortOrder: 8,
  },
  {
    name: 'Graphic Design & Branding',
    slug: 'graphic-design-branding',
    description: 'Professional design services',
    longDescription: 'Create a strong visual identity with professional logos, marketing materials, and brand guidelines.',
    icon: 'palette',
    price: 100,
    pricingType: 'from',
    category: 'Design',
    featured: false,
    active: true,
    features: ['Logo design', 'Brand identity', 'Marketing materials', 'Social media graphics'],
    sortOrder: 9,
  },
]

async function seedServices() {
  console.log('🌱 Seeding services...')
  
  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    })
  }
  
  console.log('✅ Services seeded successfully!')
}

seedServices()
  .catch((e) => {
    console.error('Error seeding services:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
