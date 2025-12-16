"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Network, 
  ArrowRight, 
  CheckCircle2, 
  Wifi,
  Cable,
  Server,
  Router,
  Building2,
  Factory,
  Home,
  Headphones
} from "lucide-react"
import { Button } from "@/components/ui-lib"

const services = [
  {
    icon: Cable,
    name: "Structured Cabling",
    description: "Professional CAT6/CAT6A cabling installation",
    features: ["Cable termination", "Patch panels", "Testing & certification", "Cable management"],
    startingPrice: "$15/point"
  },
  {
    icon: Wifi,
    name: "Wireless Networks",
    description: "Enterprise WiFi coverage and management",
    features: ["Site survey", "Access point installation", "Controller setup", "Guest networks"],
    startingPrice: "$299/AP"
  },
  {
    icon: Router,
    name: "Router & Switch Setup",
    description: "Network equipment configuration and optimization",
    features: ["VLAN configuration", "QoS setup", "Network segmentation", "Redundancy"],
    startingPrice: "$199"
  },
  {
    icon: Server,
    name: "Server Room Setup",
    description: "Complete server room infrastructure",
    features: ["Rack installation", "Power management", "Cooling solutions", "Cable organization"],
    startingPrice: "$1,499"
  }
]

const projectTypes = [
  {
    icon: Home,
    name: "Small Office",
    points: "Up to 20 network points",
    price: "$999",
    description: "Perfect for small businesses and home offices",
    includes: [
      "Site assessment",
      "Up to 20 CAT6 drops",
      "Network switch",
      "WiFi access point",
      "Basic configuration",
      "Testing & documentation"
    ]
  },
  {
    icon: Building2,
    name: "Commercial Office",
    points: "20-100 network points",
    price: "$3,999",
    description: "For medium-sized offices and retail spaces",
    includes: [
      "Professional site survey",
      "Up to 100 CAT6A drops",
      "Managed switches",
      "Multiple WiFi APs",
      "VLAN configuration",
      "Network monitoring",
      "1-year support"
    ],
    popular: true
  },
  {
    icon: Factory,
    name: "Enterprise/Industrial",
    points: "100+ network points",
    price: "Custom",
    description: "Large-scale installations for enterprises",
    includes: [
      "Full network design",
      "Fiber backbone",
      "Industrial-grade equipment",
      "Redundant architecture",
      "Full documentation",
      "Project management",
      "Ongoing support contract"
    ]
  }
]

const brands = [
  "Cisco", "Ubiquiti", "MikroTik", "TP-Link", "Aruba", "Netgear"
]

export default function NetworkInstallationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]" />
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

              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg mb-6">
                <Network className="w-12 h-12 text-white" />
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                Network{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-400">
                  Installation
                </span>
              </h1>

              <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                Professional network infrastructure installation for offices, commercial buildings, and industrial facilities.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/contact">
                  <Button size="lg" className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
                    Request Site Survey
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="#pricing">
                  <Button size="lg" variant="outline" className="border-slate-600 text-white hover:bg-white/10">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Brands we work with */}
      <section className="py-12 border-t border-b border-slate-800">
        <div className="container mx-auto px-4">
          <p className="text-center text-slate-400 mb-6">Equipment from leading manufacturers</p>
          <div className="flex flex-wrap justify-center gap-8">
            {brands.map(brand => (
              <span key={brand} className="text-xl font-semibold text-slate-500 hover:text-slate-300 transition-colors">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Our Services
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Complete network infrastructure solutions from cabling to configuration.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8"
              >
                <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 mb-4">
                  <service.icon className="w-8 h-8 text-teal-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{service.name}</h3>
                <p className="text-slate-400 mb-4">{service.description}</p>
                
                <ul className="space-y-2 mb-4">
                  {service.features.map(feature => (
                    <li key={feature} className="flex items-center gap-2 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-teal-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <div className="text-lg font-bold text-teal-400">
                  Starting at {service.startingPrice}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Packages */}
      <section id="pricing" className="py-24 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Project Packages
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Complete turnkey solutions including equipment, installation, and configuration.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {projectTypes.map((project, index) => (
              <motion.div
                key={project.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-slate-800/50 backdrop-blur-sm border rounded-2xl p-8 ${
                  project.popular 
                    ? "border-teal-500 shadow-xl shadow-teal-500/20" 
                    : "border-slate-700/50"
                }`}
              >
                {project.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full text-white text-sm font-medium">
                    Most Popular
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <div className="inline-flex p-3 rounded-xl bg-slate-700/50 mb-4">
                    <project.icon className="w-8 h-8 text-teal-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{project.name}</h3>
                  <div className="text-4xl font-bold text-white mb-2">{project.price}</div>
                  <p className="text-slate-400 text-sm">{project.points}</p>
                  <p className="text-slate-500 text-xs mt-2">{project.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {project.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-slate-300 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>

                <Link href="/contact">
                  <Button 
                    className={`w-full ${
                      project.popular 
                        ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white" 
                        : "bg-slate-700 text-white hover:bg-slate-600"
                    }`}
                  >
                    {project.price === "Custom" ? "Request Quote" : "Get Started"}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Our Installation Process
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { step: "1", title: "Site Survey", desc: "We assess your space and requirements" },
              { step: "2", title: "Design", desc: "Custom network topology and equipment selection" },
              { step: "3", title: "Installation", desc: "Professional cabling and equipment setup" },
              { step: "4", title: "Testing", desc: "Comprehensive testing and documentation" }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-600 opacity-90" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Upgrade Your Network?
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Schedule a free site survey and get a detailed quote for your project.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-teal-600 hover:bg-slate-100">
                  Schedule Site Survey
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
