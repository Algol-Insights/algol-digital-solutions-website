'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Laptop, 
  Shield, 
  Network, 
  Camera, 
  Cloud, 
  Wrench, 
  GraduationCap,
  Building2,
  ArrowRight,
  CheckCircle2,
  Phone,
  Mail,
  Code,
  Globe
} from 'lucide-react'

interface Service {
  id: string
  icon: any
  title: string
  description: string
  features: string[]
  benefits: string[]
  pricing: string
  cta: string
  ctaLink: string
}

const services: Service[] = [
  {
    id: 'hardware-software',
    icon: Laptop,
    title: 'IT Hardware & Software',
    description: 'Complete range of laptops, desktops, gadgets, and accessories from trusted global brands. We stock both new and certified refurbished devices, plus brand new boxed original smartphones.',
    features: [
      'New & Refurbished Laptops (HP, Dell, Lenovo)',
      'Desktop Computers & Workstations',
      'Brand New Boxed Phones (Samsung, iPhone, Google Pixel)',
      'Smartphones, Tablets & Smartwatches',
      'Printers, Scanners & Peripherals',
      'Laptop Bags, Cases & Accessories',
      'Power Banks, Chargers & Cables',
      'Warranty & After-Sales Support'
    ],
    benefits: [
      'Genuine products with warranty',
      'Original sealed smartphones',
      'Competitive pricing',
      'Free setup & configuration',
      'Nationwide delivery available'
    ],
    pricing: 'From $299',
    cta: 'Browse Products',
    ctaLink: '/products'
  },
  {
    id: 'microsoft-365',
    icon: Cloud,
    title: 'Cloud Productivity Services',
    description: 'Multi-cloud productivity solutions for individuals and businesses. Microsoft 365 and Google Workspace - Office apps, cloud storage, Teams, Gmail, and collaboration tools.',

    features: [
      'Microsoft 365 Business Basic, Standard & Premium',
      'Office Apps (Word, Excel, PowerPoint, Outlook)',
      'OneDrive Cloud Storage (1TB per user)',
      'Microsoft Teams for Collaboration',
      'Exchange Online Email Hosting',
      'License Management & Renewal',
      'Setup, Training & Support'
    ],
    benefits: [
      'Official Microsoft licenses',
      'Monthly or annual subscriptions',
      'Free consultation on best plan',
      'Ongoing technical support'
    ],
    pricing: 'From $5/user/month',
    cta: 'View Plans & Pricing',
    ctaLink: '/services/microsoft-365'
  },
  {
    id: 'network-security',
    icon: Shield,
    title: 'Network Security & Firewalls',
    description: 'Protect your business with enterprise-grade firewall solutions. We supply, install, and configure network security equipment to safeguard your data.',
    features: [
      'Firewall Appliances (Fortinet, Cisco, MikroTik)',
      'Intrusion Prevention Systems (IPS)',
      'Virtual Private Networks (VPN)',
      'Web Content Filtering',
      'Threat Intelligence & Monitoring',
      'Security Policy Configuration',
      'Regular Security Updates & Patches'
    ],
    benefits: [
      'Protect against cyber threats',
      'Secure remote access',
      'Compliance with data protection laws',
      '24/7 monitoring available'
    ],
    pricing: 'From $750',
    cta: 'View Security Packages',
    ctaLink: '/services/network-security'
  },
  {
    id: 'cctv-surveillance',
    icon: Camera,
    title: 'CCTV Surveillance Systems',
    description: 'Complete CCTV solutions for businesses and homes. From consultation to installation, we provide reliable security camera systems with mobile viewing.',
    features: [
      'IP & Analog Camera Systems',
      'HD & 4K Camera Options',
      'Night Vision & Motion Detection',
      'Digital Video Recorders (DVR/NVR)',
      'Remote Viewing via Mobile App',
      'Professional Installation & Cabling',
      'System Maintenance & Support'
    ],
    benefits: [
      'Deter crime and theft',
      'Monitor premises 24/7',
      'Record evidence for incidents',
      'Integration with alarms'
    ],
    pricing: 'From $600',
    cta: 'View CCTV Packages',
    ctaLink: '/services/cctv-systems'
  },
  {
    id: 'network-installation',
    icon: Network,
    title: 'Network Installation & Setup',
    description: 'Professional network design and installation for offices and businesses. We handle structured cabling, Wi-Fi setup, and complete network infrastructure.',
    features: [
      'Office Network Design & Planning',
      'Structured Cabling (Cat5e, Cat6, Fiber)',
      'Router & Switch Configuration',
      'Wi-Fi Access Point Installation',
      'Network Testing & Optimization',
      'Server Room Setup',
      'Documentation & Labeling'
    ],
    benefits: [
      'Fast, reliable connectivity',
      'Scalable infrastructure',
      'Professional cable management',
      'Future-proof design'
    ],
    pricing: 'From $200',
    cta: 'View Network Packages',
    ctaLink: '/services/network-installation'
  },
  {
    id: 'it-support',
    icon: Wrench,
    title: 'IT Support & Maintenance',
    description: 'On-demand IT support for small businesses without in-house IT teams. We provide remote and on-site assistance to keep your technology running smoothly.',
    features: [
      'Remote & On-Site Technical Support',
      'Computer Repair & Troubleshooting',
      'Software Installation & Updates',
      'Data Backup & Recovery',
      'Email & Network Issues',
      'Hardware Upgrades & Replacement',
      'IT Consultancy for SMEs'
    ],
    benefits: [
      'Cost-effective IT department',
      'Quick response times',
      'Preventive maintenance',
      'Monthly retainer options'
    ],
    pricing: 'From $50/visit or $100/month',
    cta: 'View Support Plans',
    ctaLink: '/services/it-support'
  },
  {
    id: 'training-consultancy',
    icon: GraduationCap,
    title: 'IT Training & Consultancy',
    description: 'Empower your team with IT skills training and strategic consultancy. We help businesses plan their technology investments and train staff effectively.',
    features: [
      'Microsoft Office & Productivity Training',
      'Cybersecurity Awareness Workshops',
      'IT Procurement Consulting',
      'Digital Transformation Strategy',
      'Technology Roadmap Planning',
      'Custom Training Programs',
      'Group & One-on-One Sessions'
    ],
    benefits: [
      'Improve staff productivity',
      'Better technology decisions',
      'Reduce security risks',
      'Tailored to your industry'
    ],
    pricing: 'From $100/session',
    cta: 'Book Training',
    ctaLink: '/contact'
  },
  {
    id: 'website-development',
    icon: Globe,
    title: 'Website Development',
    description: 'Custom websites and web applications built with modern technologies. From business websites to e-commerce platforms, we create responsive, fast, and user-friendly web solutions.',
    features: [
      'Custom Website Design & Development',
      'E-commerce Platforms (Online Stores)',
      'Content Management Systems (CMS)',
      'Responsive Mobile-First Design',
      'SEO Optimization & Analytics',
      'Domain & Hosting Setup',
      'Website Maintenance & Updates'
    ],
    benefits: [
      'Professional online presence',
      'Mobile-friendly designs',
      'Search engine optimized',
      'Ongoing support included'
    ],
    pricing: 'From $500',
    cta: 'View Packages & Pricing',
    ctaLink: '/services/web-development'
  },
  {
    id: 'software-development',
    icon: Code,
    title: 'Software Development',
    description: 'Custom software solutions tailored to your business needs. We develop desktop applications, mobile apps, and enterprise systems that streamline operations and boost productivity.',
    features: [
      'Custom Business Applications',
      'Mobile App Development (iOS & Android)',
      'Desktop Software Solutions',
      'API Development & Integration',
      'Database Design & Management',
      'System Integration & Migration',
      'Software Testing & Quality Assurance'
    ],
    benefits: [
      'Automated business processes',
      'Increased efficiency',
      'Scalable solutions',
      'Competitive advantage'
    ],
    pricing: 'From $2,000',
    cta: 'View Packages & Pricing',
    ctaLink: '/services/software-development'
  },
  {
    id: 'corporate-solutions',
    icon: Building2,
    title: 'Corporate & Bulk Orders',
    description: 'Special programs for corporates, schools, and institutions. We offer bulk pricing, custom configurations, and dedicated account management.',
    features: [
      'Volume Discounts on Hardware',
      'Custom Device Configurations',
      'Asset Tagging & Imaging',
      'Flexible Payment Terms',
      'Dedicated Account Manager',
      'Priority Support & Warranty',
      'Tender & Quotation Services'
    ],
    benefits: [
      'Significant cost savings',
      'Standardized equipment',
      'Simplified procurement',
      'Long-term partnership'
    ],
    pricing: 'Custom Pricing',
    cta: 'Request Enterprise Quote',
    ctaLink: '/contact'
  }
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-teal-dark via-brand-teal-medium to-brand-golden py-20 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20px 20px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
        
        <div className="absolute top-10 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-brand-golden/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}} />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Our Services
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Comprehensive IT solutions and technology services for businesses and individuals across Zimbabwe
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-dark rounded-2xl overflow-hidden border border-border/50 hover-lift"
              >
                <div className="p-8 lg:p-10">
                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Overview */}
                    <div className="lg:col-span-1">
                      <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-brand-teal-medium/20 to-brand-golden/20 mb-4">
                        <service.icon className="h-8 w-8 text-brand-teal-medium" />
                      </div>
                      <h2 className="text-2xl font-bold text-foreground mb-3">
                        {service.title}
                      </h2>
                      <p className="text-muted-foreground mb-6">
                        {service.description}
                      </p>
                      <div className="mb-6">
                        <p className="text-sm text-muted-foreground mb-2">Starting from</p>
                        <p className="text-3xl font-bold text-gradient-teal">
                          {service.pricing}
                        </p>
                      </div>
                      <Link href={service.ctaLink}>
                        <button className="w-full bg-gradient-to-r from-brand-teal-medium to-brand-teal-dark hover:shadow-lg hover:shadow-brand-teal-medium/30 text-white px-6 py-3 rounded-xl font-semibold transition-all hover-lift flex items-center justify-center gap-2">
                          {service.cta}
                          <ArrowRight className="h-5 w-5" />
                        </button>
                      </Link>
                    </div>

                    {/* Middle Column - Features */}
                    <div className="lg:col-span-1">
                      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                        <span className="w-1 h-6 bg-brand-teal-medium rounded-full" />
                        What's Included
                      </h3>
                      <ul className="space-y-3">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
                            <CheckCircle2 className="h-5 w-5 text-brand-teal-medium flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Right Column - Benefits */}
                    <div className="lg:col-span-1">
                      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                        <span className="w-1 h-6 bg-brand-golden rounded-full" />
                        Key Benefits
                      </h3>
                      <ul className="space-y-3 mb-8">
                        {service.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
                            <div className="w-2 h-2 rounded-full bg-brand-golden mt-2 flex-shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                      
                      {/* Contact Card */}
                      <div className="p-4 rounded-xl bg-accent/30 border border-border/50">
                        <p className="text-sm font-semibold text-foreground mb-3">
                          Need more information?
                        </p>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <a href="tel:+263788663313" className="flex items-center gap-2 hover:text-brand-teal-medium transition-colors">
                            <Phone className="h-4 w-4" />
                            +263 788 663 313
                          </a>
                          <a href="mailto:info@algoldigital.co.zw" className="flex items-center gap-2 hover:text-brand-teal-medium transition-colors">
                            <Mail className="h-4 w-4" />
                            info@algoldigital.co.zw
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Get in touch with our team for a free consultation and custom quote
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <button className="px-8 py-4 bg-gradient-to-r from-brand-teal-medium to-brand-teal-dark hover:shadow-lg hover:shadow-brand-teal-medium/30 text-white rounded-xl font-semibold transition-all hover-lift">
                  Request a Quote
                </button>
              </Link>
              <Link href="/support">
                <button className="px-8 py-4 glass-dark border-2 border-border hover:border-brand-teal-medium text-foreground rounded-xl font-semibold transition-all hover-lift">
                  Contact Support
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
