"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Cloud, 
  ArrowRight, 
  CheckCircle2, 
  Mail,
  Users,
  FileText,
  Video,
  Shield,
  Database,
  Headphones,
  Building2,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui-lib"

const products = [
  {
    icon: Mail,
    name: "Microsoft 365 Business Basic",
    price: "$6/user/month",
    description: "Web and mobile versions of Office apps",
    features: [
      "Business email (50GB mailbox)",
      "Microsoft Teams",
      "SharePoint",
      "OneDrive (1TB storage)",
      "Web versions of Word, Excel, PowerPoint"
    ]
  },
  {
    icon: FileText,
    name: "Microsoft 365 Business Standard",
    price: "$12.50/user/month",
    description: "Full desktop apps + web and mobile",
    features: [
      "Everything in Business Basic",
      "Desktop versions of Office apps",
      "Outlook desktop app",
      "Microsoft Bookings",
      "Webinar hosting (up to 300)"
    ],
    popular: true
  },
  {
    icon: Shield,
    name: "Microsoft 365 Business Premium",
    price: "$22/user/month",
    description: "Full suite with advanced security",
    features: [
      "Everything in Business Standard",
      "Advanced threat protection",
      "Intune device management",
      "Azure AD Premium P1",
      "Windows Autopilot"
    ]
  },
  {
    icon: Mail,
    name: "Google Workspace Business Starter",
    price: "$6/user/month",
    description: "Professional email and collaboration tools",
    features: [
      "Business email with Gmail",
      "Google Meet (100 participants)",
      "Google Drive (30GB storage)",
      "Docs, Sheets, Slides",
      "Shared calendars"
    ]
  },
  {
    icon: FileText,
    name: "Google Workspace Business Standard",
    price: "$12/user/month",
    description: "Enhanced storage and meeting features",
    features: [
      "Everything in Business Starter",
      "Google Drive (2TB storage)",
      "Google Meet (150 participants + recording)",
      "Shared drives for teams",
      "Enhanced admin controls"
    ]
  },
  {
    icon: Shield,
    name: "Google Workspace Business Plus",
    price: "$18/user/month",
    description: "Advanced security and compliance",
    features: [
      "Everything in Business Standard",
      "Google Drive (5TB storage)",
      "Google Meet (500 participants)",
      "Advanced security & management",
      "Vault for eDiscovery & retention"
    ]
  }
]

const services = [
  {
    icon: Building2,
    title: "Migration Services",
    description: "Seamless migration from existing email and file systems to Microsoft 365 or Google Workspace",
    price: "From $199"
  },
  {
    icon: Users,
    title: "Setup & Configuration",
    description: "Complete setup of your cloud tenant, users, and security policies",
    price: "From $299"
  },
  {
    icon: Video,
    title: "Teams Implementation",
    description: "Full Microsoft Teams setup including channels, meetings, and training",
    price: "From $399"
  },
  {
    icon: Shield,
    title: "Security Configuration",
    description: "Advanced security setup including MFA, conditional access, and policies",
    price: "From $499"
  },
  {
    icon: Headphones,
    title: "Ongoing Support",
    description: "Monthly support plans for user assistance and admin management",
    price: "From $99/month"
  },
  {
    icon: Database,
    title: "Backup Solutions",
    description: "Third-party backup for Microsoft 365 data protection",
    price: "From $3/user/month"
  }
]

const benefits = [
  "Work from anywhere with cloud-based apps",
  "Real-time collaboration on documents",
  "Enterprise-grade security and compliance",
  "Automatic updates and new features",
  "Integrated communication with Teams",
  "Professional business email with your domain",
  "1TB cloud storage per user",
  "99.9% uptime guarantee"
]

export default function Microsoft365Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Link href="/services" className="inline-flex items-center text-brand-teal-light hover:text-brand-teal-medium transition-colors mb-6">
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                Back to Services
              </Link>

              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg mb-6">
                <Cloud className="w-12 h-12 text-white" />
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                Cloud Productivity{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-400">
                  Services
                </span>
              </h1>

              <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                Multi-cloud solutions provider offering Microsoft 365 and Google Workspace — 
                licensing, migration, setup, and ongoing support for businesses in Zimbabwe.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/contact">
                  <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600">
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="#pricing">
                  <Button size="lg" variant="outline" className="border-slate-600 text-white hover:bg-white/10">
                    View Pricing
                  </Button>
                </Link>
              </div>

              {/* Partner Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 text-slate-300"
              >
                <Sparkles className="w-4 h-4 text-orange-400" />
                <span className="text-sm">Authorized Cloud Solutions Partner</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3 p-4 bg-slate-800/30 rounded-xl"
              >
                <CheckCircle2 className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Licensing Section */}
      <section id="pricing" className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Cloud Productivity Plans
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Choose the right plan for your business. Microsoft 365 or Google Workspace - all prices are per user per month, 
              billed annually. Contact us for volume discounts.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {products.map((product, index) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-slate-800/50 backdrop-blur-sm border rounded-2xl p-8 ${
                  product.popular 
                    ? "border-orange-500 shadow-xl shadow-orange-500/20" 
                    : "border-slate-700/50"
                }`}
              >
                {product.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-white text-sm font-medium">
                    Most Popular
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 mb-4">
                    <product.icon className="w-8 h-8 text-orange-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                  <div className="text-3xl font-bold text-white mb-2">{product.price}</div>
                  <p className="text-slate-400 text-sm">{product.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-slate-300 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href="/contact">
                  <Button 
                    className={`w-full ${
                      product.popular 
                        ? "bg-gradient-to-r from-orange-500 to-red-500 text-white" 
                        : "bg-slate-700 text-white hover:bg-slate-600"
                    }`}
                  >
                    Get Quote
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Professional Services
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Beyond licensing, we provide complete implementation and support services 
              to ensure your Microsoft 365 deployment is successful.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-orange-500/50 transition-colors"
              >
                <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 mb-4">
                  <service.icon className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                <p className="text-slate-400 mb-4">{service.description}</p>
                <div className="text-lg font-bold text-orange-400">{service.price}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-90" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Move to the Cloud?
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Get a free consultation and custom quote for your organization. 
              We'll help you choose between Microsoft 365 or Google Workspace and handle the entire setup.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-orange-600 hover:bg-slate-100">
                  Get Free Quote
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="tel:+263242123456">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Headphones className="mr-2 w-5 h-5" />
                  Call Us Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
