"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Shield, 
  ArrowRight, 
  CheckCircle2, 
  Lock,
  Eye,
  AlertTriangle,
  Server,
  Wifi,
  FileCheck,
  Headphones
} from "lucide-react"
import { Button } from "@/components/ui-lib"

const solutions = [
  {
    icon: Shield,
    name: "Firewall Solutions",
    description: "Enterprise-grade firewalls from leading vendors",
    brands: ["Fortinet", "Cisco", "MikroTik", "SonicWall"],
    startingPrice: "$599"
  },
  {
    icon: Eye,
    name: "Threat Monitoring",
    description: "24/7 network monitoring and threat detection",
    features: ["Real-time alerts", "Log analysis", "Incident response"],
    startingPrice: "$199/month"
  },
  {
    icon: Lock,
    name: "Access Control",
    description: "Manage who can access your network resources",
    features: ["VPN setup", "Multi-factor auth", "Role-based access"],
    startingPrice: "$399"
  },
  {
    icon: AlertTriangle,
    name: "Security Audits",
    description: "Comprehensive assessment of your security posture",
    features: ["Vulnerability scan", "Penetration testing", "Compliance check"],
    startingPrice: "$799"
  }
]

const packages = [
  {
    name: "Small Business",
    price: "$1,499",
    description: "For offices up to 25 users",
    features: [
      "Entry-level firewall (FortiGate 40F or equivalent)",
      "Basic security configuration",
      "VPN for remote access",
      "1 year vendor support",
      "Installation & training"
    ]
  },
  {
    name: "Professional",
    price: "$3,499",
    description: "For medium businesses (25-100 users)",
    features: [
      "Mid-range firewall with advanced features",
      "Intrusion prevention (IPS)",
      "Web filtering",
      "Application control",
      "SSL inspection",
      "1 year vendor support",
      "Advanced configuration & training"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "$7,999+",
    description: "For large organizations",
    features: [
      "Enterprise-grade firewall cluster",
      "High availability setup",
      "Advanced threat protection",
      "SIEM integration",
      "Compliance reporting",
      "24/7 monitoring option",
      "Dedicated support manager"
    ]
  }
]

export default function NetworkSecurityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[100px]" />
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

              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 shadow-lg mb-6">
                <Shield className="w-12 h-12 text-white" />
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                Network{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-400">
                  Security
                </span>
              </h1>

              <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                Protect your business with enterprise-grade security solutions. 
                Firewalls, threat monitoring, and comprehensive security services.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/contact">
                  <Button size="lg" className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
                    Get Security Assessment
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
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-24 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Security Solutions
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Comprehensive security offerings to protect your network infrastructure.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {solutions.map((solution, index) => (
              <motion.div
                key={solution.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8"
              >
                <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 mb-4">
                  <solution.icon className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{solution.name}</h3>
                <p className="text-slate-400 mb-4">{solution.description}</p>
                
                {solution.brands && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {solution.brands.map(brand => (
                      <span key={brand} className="px-3 py-1 bg-slate-700/50 rounded-full text-sm text-slate-300">
                        {brand}
                      </span>
                    ))}
                  </div>
                )}
                
                {solution.features && (
                  <ul className="space-y-2 mb-4">
                    {solution.features.map(feature => (
                      <li key={feature} className="flex items-center gap-2 text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-red-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
                
                <div className="text-lg font-bold text-red-400">
                  Starting at {solution.startingPrice}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-24 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Security Packages
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Complete firewall solutions including hardware, installation, and configuration.
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
                    ? "border-red-500 shadow-xl shadow-red-500/20" 
                    : "border-slate-700/50"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full text-white text-sm font-medium">
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
                    <li key={feature} className="flex items-start gap-2 text-slate-300 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href="/contact">
                  <Button 
                    className={`w-full ${
                      pkg.popular 
                        ? "bg-gradient-to-r from-red-500 to-orange-500 text-white" 
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

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 opacity-90" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Protect Your Business Today
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Get a free security assessment and custom proposal for your organization.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-red-600 hover:bg-slate-100">
                  Request Assessment
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
