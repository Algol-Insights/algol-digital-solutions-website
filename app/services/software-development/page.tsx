"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Code2, 
  ArrowRight, 
  CheckCircle2, 
  Smartphone,
  Monitor,
  Database,
  Cpu,
  Layers,
  GitBranch,
  Headphones,
  Zap
} from "lucide-react"
import { Button } from "@/components/ui-lib"

const services = [
  {
    icon: Monitor,
    name: "Desktop Applications",
    description: "Native Windows, macOS, and Linux applications",
    technologies: ["Electron", ".NET", "Python", "Java"],
    startingPrice: "$2,499"
  },
  {
    icon: Smartphone,
    name: "Mobile Apps",
    description: "iOS and Android applications",
    technologies: ["React Native", "Flutter", "Swift", "Kotlin"],
    startingPrice: "$3,999"
  },
  {
    icon: Database,
    name: "Business Systems",
    description: "ERP, CRM, and custom enterprise solutions",
    technologies: ["Node.js", "PostgreSQL", "MongoDB", "Redis"],
    startingPrice: "$4,999"
  },
  {
    icon: Layers,
    name: "API Development",
    description: "RESTful and GraphQL API solutions",
    technologies: ["Express", "FastAPI", "GraphQL", "REST"],
    startingPrice: "$1,499"
  }
]

const packages = [
  {
    name: "MVP Development",
    price: "$4,999",
    timeline: "4-6 weeks",
    description: "Launch your idea with a minimum viable product",
    features: [
      "Requirements analysis",
      "Core feature development",
      "Basic UI/UX design",
      "Testing & QA",
      "Deployment setup",
      "Source code handover",
      "30 days support"
    ]
  },
  {
    name: "Full Product",
    price: "$12,999",
    timeline: "8-12 weeks",
    description: "Complete software solution for your business",
    features: [
      "In-depth requirements workshop",
      "Full feature development",
      "Custom UI/UX design",
      "Database design & optimization",
      "Third-party integrations",
      "Comprehensive testing",
      "Documentation",
      "90 days support"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    timeline: "Ongoing",
    description: "Large-scale solutions with dedicated team",
    features: [
      "Dedicated development team",
      "Agile project management",
      "Complex system architecture",
      "High availability setup",
      "Security auditing",
      "Performance optimization",
      "24/7 support option",
      "SLA guarantees"
    ]
  }
]

const techStack = [
  { name: "React / Next.js", category: "Frontend" },
  { name: "Node.js", category: "Backend" },
  { name: "Python", category: "Backend" },
  { name: "PostgreSQL", category: "Database" },
  { name: "MongoDB", category: "Database" },
  { name: "AWS / Azure", category: "Cloud" },
  { name: "Docker", category: "DevOps" },
  { name: "TypeScript", category: "Language" }
]

export default function SoftwareDevelopmentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[100px]" />
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

              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg mb-6">
                <Code2 className="w-12 h-12 text-white" />
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                Software{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                  Development
                </span>
              </h1>

              <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                Custom software solutions built with modern technologies. 
                Desktop apps, mobile apps, and enterprise systems tailored to your needs.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/contact">
                  <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    Discuss Your Project
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

      {/* Tech Stack */}
      <section className="py-12 border-t border-b border-slate-800">
        <div className="container mx-auto px-4">
          <p className="text-center text-slate-400 mb-6">Technologies we work with</p>
          <div className="flex flex-wrap justify-center gap-4">
            {techStack.map(tech => (
              <span 
                key={tech.name} 
                className="px-4 py-2 bg-slate-800/50 rounded-full text-sm text-slate-300 border border-slate-700/50"
              >
                {tech.name}
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
              Development Services
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              From concept to deployment, we handle every aspect of software development.
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
                <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 mb-4">
                  <service.icon className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{service.name}</h3>
                <p className="text-slate-400 mb-4">{service.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {service.technologies.map(tech => (
                    <span key={tech} className="px-3 py-1 bg-slate-700/50 rounded-full text-sm text-slate-300">
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="text-lg font-bold text-purple-400">
                  Starting at {service.startingPrice}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Development Process */}
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
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {[
              { 
                step: "1", 
                title: "Discovery & Planning", 
                desc: "We analyze your requirements, define scope, and create a detailed project plan.",
                icon: Zap
              },
              { 
                step: "2", 
                title: "Design & Architecture", 
                desc: "UI/UX design and technical architecture to ensure scalability and performance.",
                icon: Layers
              },
              { 
                step: "3", 
                title: "Development", 
                desc: "Agile development with regular demos and feedback cycles.",
                icon: Code2
              },
              { 
                step: "4", 
                title: "Testing & QA", 
                desc: "Comprehensive testing to ensure quality and reliability.",
                icon: GitBranch
              },
              { 
                step: "5", 
                title: "Deployment & Support", 
                desc: "Smooth deployment and ongoing maintenance support.",
                icon: Cpu
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-6 mb-8 last:mb-0"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    {item.step}
                  </div>
                </div>
                <div className="flex-grow pb-8 border-b border-slate-800 last:border-0">
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-slate-400">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Engagement Models
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Choose the engagement model that fits your project needs and budget.
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
                    ? "border-purple-500 shadow-xl shadow-purple-500/20" 
                    : "border-slate-700/50"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-sm font-medium">
                    Most Popular
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                  <div className="text-4xl font-bold text-white mb-2">{pkg.price}</div>
                  <p className="text-purple-400 text-sm font-medium">{pkg.timeline}</p>
                  <p className="text-slate-400 text-sm mt-2">{pkg.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-slate-300 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href="/contact">
                  <Button 
                    className={`w-full ${
                      pkg.popular 
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" 
                        : "bg-slate-700 text-white hover:bg-slate-600"
                    }`}
                  >
                    {pkg.price === "Custom" ? "Contact Us" : "Get Started"}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-90" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Have a Project in Mind?
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Let's discuss your idea and create a custom solution that drives your business forward.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-slate-100">
                  Schedule Consultation
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
