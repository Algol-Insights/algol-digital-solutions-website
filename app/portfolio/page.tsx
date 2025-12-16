'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Code, Zap, Users, Target, Trophy, Star } from 'lucide-react'

const caseStudies = [
  {
    id: 1,
    title: "Enterprise ERP Implementation",
    client: "Manufacturing Corp",
    industry: "Manufacturing",
    challenge: "Legacy system integration with modern cloud infrastructure",
    solution: "Custom API development and seamless data migration",
    results: ["40% cost reduction", "99.9% uptime", "Real-time analytics"],
    technologies: ["Next.js", "PostgreSQL", "AWS", "Python"],
    image: "bg-gradient-to-br from-blue-600 to-blue-700",
  },
  {
    id: 2,
    title: "E-commerce Platform Scaling",
    client: "TechRetail Inc",
    industry: "E-commerce",
    challenge: "Handle 10x traffic increase during peak season",
    solution: "Microservices architecture with auto-scaling",
    results: ["300% traffic increase", "50ms response time", "$2M revenue increase"],
    technologies: ["Next.js", "Node.js", "Docker", "Kubernetes"],
    image: "bg-gradient-to-br from-purple-600 to-purple-700",
  },
  {
    id: 3,
    title: "Mobile-First Banking App",
    client: "FinanceHub",
    industry: "Finance",
    challenge: "Secure, scalable banking platform for millions of users",
    solution: "React Native with backend-driven security",
    results: ["2M+ users", "ISO 27001 certified", "4.8★ app rating"],
    technologies: ["React Native", "Node.js", "Stripe", "AWS"],
    image: "bg-gradient-to-br from-green-600 to-green-700",
  },
  {
    id: 4,
    title: "AI-Powered Analytics Dashboard",
    client: "DataSystems Ltd",
    industry: "Data Analytics",
    challenge: "Process 10TB+ of data daily with real-time insights",
    solution: "ML pipeline with custom visualization engine",
    results: ["10x faster insights", "Predictive accuracy 92%", "$500K saved"],
    technologies: ["Python", "TensorFlow", "React", "PostgreSQL"],
    image: "bg-gradient-to-br from-amber-600 to-amber-700",
  },
  {
    id: 5,
    title: "Healthcare Telemedicine Platform",
    client: "MediCare Plus",
    industry: "Healthcare",
    challenge: "HIPAA-compliant video consultation platform",
    solution: "End-to-end encryption with WebRTC integration",
    results: ["HIPAA compliant", "10K+ consultations/month", "98% satisfaction"],
    technologies: ["Next.js", "WebRTC", "AWS", "TypeScript"],
    image: "bg-gradient-to-br from-red-600 to-red-700",
  },
  {
    id: 6,
    title: "Real Estate Platform",
    client: "PropertyWorks",
    industry: "Real Estate",
    challenge: "Virtual tours and 3D property visualization",
    solution: "3D visualization with AR preview feature",
    results: ["30% faster sales", "200K+ listings", "4.6★ app rating"],
    technologies: ["Three.js", "React", "Node.js", "WebAR"],
    image: "bg-gradient-to-br from-indigo-600 to-indigo-700",
  },
]

const metrics = [
  { label: "Successful Projects", value: "150+", icon: Trophy },
  { label: "Client Satisfaction", value: "98%", icon: Star },
  { label: "Team Experts", value: "50+", icon: Users },
  { label: "Years Experience", value: "5+", icon: Target },
]

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-950 border-b border-slate-700 py-8 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <Link href="/" className="text-slate-400 hover:text-white mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            <Code size={36} />
            Portfolio & Case Studies
          </h1>
          <p className="text-slate-400 mt-1">Explore our successful client projects</p>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Award-Winning Solutions
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              From startups to enterprises, we've delivered transformative digital solutions
            </p>
          </motion.div>
        </div>
      </section>

      {/* Metrics */}
      <section className="py-12 px-6 bg-slate-800/50 border-y border-slate-700">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {metrics.map((metric, idx) => {
              const Icon = metric.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <Icon size={32} className="text-blue-400 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-white">{metric.value}</p>
                  <p className="text-slate-400 text-sm mt-1">{metric.label}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-12">
            {caseStudies.map((study, idx) => (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-blue-500 transition"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                  {/* Image */}
                  <div className={`${study.image} h-64 lg:h-auto flex items-center justify-center text-slate-600 font-bold text-2xl`}>
                    {study.client}
                  </div>

                  {/* Content */}
                  <div className="lg:col-span-2 p-8">
                    <div className="mb-4">
                      <span className="text-xs font-semibold text-blue-400 bg-blue-900/30 px-3 py-1 rounded-full">
                        {study.industry}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2">{study.title}</h3>
                    <p className="text-slate-400 mb-6">{study.client}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div>
                        <p className="text-slate-400 text-sm font-semibold mb-2">CHALLENGE</p>
                        <p className="text-white text-sm">{study.challenge}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm font-semibold mb-2">SOLUTION</p>
                        <p className="text-white text-sm">{study.solution}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm font-semibold mb-2">RESULTS</p>
                        <ul className="space-y-1">
                          {study.results.map((result, i) => (
                            <li key={i} className="text-green-400 text-sm">✓ {result}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {study.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs px-3 py-1 bg-slate-700 text-slate-300 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <button className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-2 transition">
                      Read Full Case Study
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Business?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Let's discuss how we can help you achieve your goals
            </p>
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition">
              Schedule a Consultation
              <ArrowRight size={20} />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
