"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Globe, 
  ArrowRight, 
  CheckCircle2, 
  Code2, 
  Smartphone, 
  Zap,
  Search,
  Shield,
  Palette,
  ShoppingCart,
  BarChart3,
  Headphones
} from "lucide-react"
import { Button } from "@/components/ui-lib"

const features = [
  {
    icon: Palette,
    title: "Custom Design",
    description: "Unique, brand-aligned designs that capture your identity and engage visitors"
  },
  {
    icon: Smartphone,
    title: "Responsive Development",
    description: "Websites that look and work perfectly on all devices - desktop, tablet, and mobile"
  },
  {
    icon: Search,
    title: "SEO Optimization",
    description: "Built-in SEO best practices to help your site rank higher in search results"
  },
  {
    icon: Zap,
    title: "Fast Performance",
    description: "Optimized code and hosting for lightning-fast load times"
  },
  {
    icon: ShoppingCart,
    title: "E-commerce Ready",
    description: "Full online store functionality with secure payment processing"
  },
  {
    icon: Shield,
    title: "Security First",
    description: "SSL certificates, secure coding practices, and regular security updates"
  }
]

const packages = [
  {
    name: "Starter",
    price: "$499",
    description: "Perfect for small businesses and personal brands",
    features: [
      "Up to 5 pages",
      "Responsive design",
      "Contact form",
      "Basic SEO setup",
      "Social media integration",
      "1 month support"
    ],
    popular: false
  },
  {
    name: "Professional",
    price: "$1,299",
    description: "Ideal for growing businesses needing more features",
    features: [
      "Up to 15 pages",
      "Custom design",
      "CMS (Content Management)",
      "Advanced SEO",
      "Blog functionality",
      "Google Analytics",
      "3 months support",
      "Performance optimization"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "$2,999+",
    description: "Full-featured solution for larger organizations",
    features: [
      "Unlimited pages",
      "E-commerce integration",
      "Custom functionality",
      "API integrations",
      "Multi-language support",
      "Advanced analytics",
      "6 months support",
      "Priority support",
      "Training included"
    ],
    popular: false
  }
]

const process = [
  {
    step: "01",
    title: "Discovery",
    description: "We learn about your business, goals, and target audience to create the perfect strategy."
  },
  {
    step: "02",
    title: "Design",
    description: "Our designers create mockups and wireframes for your approval before development begins."
  },
  {
    step: "03",
    title: "Development",
    description: "We build your website using modern technologies ensuring performance and scalability."
  },
  {
    step: "04",
    title: "Launch & Support",
    description: "After thorough testing, we launch your site and provide ongoing support and maintenance."
  }
]

export default function WebDevelopmentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Link href="/services" className="inline-flex items-center text-brand-teal-light hover:text-brand-teal-medium transition-colors">
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                Back to Services
              </Link>
              
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
                <Globe className="w-10 h-10 text-white" />
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
                Website{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                  Development
                </span>
              </h1>

              <p className="text-xl text-slate-300 max-w-xl">
                Custom websites that convert visitors into customers. From simple landing pages 
                to complex e-commerce platforms, we build digital experiences that drive results.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/contact">
                  <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600">
                    Get Free Quote
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="#packages">
                  <Button size="lg" variant="outline" className="border-slate-600 text-white hover:bg-white/10">
                    View Packages
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              {/* Code preview mockup */}
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-700/50 border-b border-slate-600/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-xs text-slate-400 ml-2 font-mono">your-website.co.zw</span>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="h-8 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded w-3/4" />
                    <div className="h-4 bg-slate-700/50 rounded w-full" />
                    <div className="h-4 bg-slate-700/50 rounded w-5/6" />
                    <div className="h-4 bg-slate-700/50 rounded w-4/6" />
                    <div className="grid grid-cols-3 gap-3 mt-6">
                      <div className="h-24 bg-slate-700/50 rounded-lg" />
                      <div className="h-24 bg-slate-700/50 rounded-lg" />
                      <div className="h-24 bg-slate-700/50 rounded-lg" />
                    </div>
                    <div className="flex gap-3 mt-4">
                      <div className="h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg w-32" />
                      <div className="h-10 bg-slate-700/50 rounded-lg w-32" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              What We Deliver
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Every website we build includes these essential features to ensure your success online.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition-colors"
              >
                <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 mb-4">
                  <feature.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Our Development Process
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              A proven methodology that ensures your project is delivered on time and exceeds expectations.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="text-6xl font-bold text-slate-800 mb-4">{step.step}</div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-slate-400">{step.description}</p>
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-8 right-0 w-full h-0.5 bg-gradient-to-r from-slate-700 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="packages" className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Transparent Pricing
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Choose the package that fits your needs. All prices in USD, payable in local currency equivalent.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-slate-800/50 backdrop-blur-sm border rounded-2xl p-8 ${
                  pkg.popular 
                    ? "border-blue-500 shadow-xl shadow-blue-500/20" 
                    : "border-slate-700/50"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-white text-sm font-medium">
                    Most Popular
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                  <div className="text-4xl font-bold text-white mb-2">{pkg.price}</div>
                  <p className="text-slate-400 text-sm">{pkg.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-slate-300">
                      <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href="/contact">
                  <Button 
                    className={`w-full ${
                      pkg.popular 
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white" 
                        : "bg-slate-700 text-white hover:bg-slate-600"
                    }`}
                  >
                    Get Started
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-slate-500 mt-8">
            Need a custom solution? <Link href="/contact" className="text-blue-400 hover:underline">Contact us</Link> for a tailored quote.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-90" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Build Your Dream Website?
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Let's discuss your project. Get a free consultation and quote within 24 hours.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100">
                  Start Your Project
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
