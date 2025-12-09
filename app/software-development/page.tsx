'use client'

import Link from 'next/link'
import { useState } from 'react'

interface Service {
  id: string
  title: string
  description: string
  icon: string
  features: string[]
  startingPrice: number
  deliveryTime: string
}

const services: Service[] = [
  {
    id: 'web-dev',
    title: 'Custom Web Development',
    description: 'Build scalable, modern web applications tailored to your business needs',
    icon: '🌐',
    features: [
      'React/Next.js Frontend Development',
      'Node.js/Express Backend Development',
      'Database Design & Optimization',
      'API Development & Integration',
      'Responsive Design',
      'SEO Optimization',
    ],
    startingPrice: 5000,
    deliveryTime: '4-8 weeks',
  },
  {
    id: 'mobile-dev',
    title: 'Mobile App Development',
    description: 'Native and cross-platform mobile applications for iOS and Android',
    icon: '📱',
    features: [
      'iOS Development (Swift)',
      'Android Development (Kotlin)',
      'React Native',
      'App Store Optimization',
      'Push Notifications',
      'Offline Functionality',
    ],
    startingPrice: 8000,
    deliveryTime: '6-12 weeks',
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce Solutions',
    description: 'Complete e-commerce platforms with payment processing and inventory management',
    icon: '🛒',
    features: [
      'Custom Shopping Platform',
      'Payment Gateway Integration',
      'Inventory Management',
      'Order Tracking',
      'Customer Analytics',
      'Multi-vendor Support',
    ],
    startingPrice: 10000,
    deliveryTime: '8-16 weeks',
  },
  {
    id: 'cloud-infra',
    title: 'Cloud Infrastructure',
    description: 'Scalable cloud solutions with AWS, Google Cloud, and Azure',
    icon: '☁️',
    features: [
      'Cloud Architecture Design',
      'DevOps & CI/CD',
      'Kubernetes Deployment',
      'Security & Compliance',
      'Auto-scaling Setup',
      'Cost Optimization',
    ],
    startingPrice: 4000,
    deliveryTime: '2-4 weeks',
  },
  {
    id: 'ai-ml',
    title: 'AI & Machine Learning',
    description: 'Intelligent solutions powered by artificial intelligence and machine learning',
    icon: '🤖',
    features: [
      'Computer Vision Solutions',
      'Natural Language Processing',
      'Predictive Analytics',
      'Recommendation Engines',
      'Data Analysis & Insights',
      'Model Training & Optimization',
    ],
    startingPrice: 15000,
    deliveryTime: '8-20 weeks',
  },
  {
    id: 'consulting',
    title: 'Technical Consulting',
    description: 'Expert guidance on architecture, technology selection, and best practices',
    icon: '💼',
    features: [
      'Technology Strategy',
      'Architecture Review',
      'Performance Optimization',
      'Security Audit',
      'Team Training',
      'Process Improvement',
    ],
    startingPrice: 2000,
    deliveryTime: 'Flexible',
  },
]

export default function SoftwareDevelopmentServices() {
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-950 border-b border-slate-700 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <Link href="/" className="text-slate-400 hover:text-white mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-white mb-4">Software Development Services</h1>
          <p className="text-xl text-slate-300 max-w-2xl">
            Cutting-edge development solutions for businesses of all sizes. From concept to deployment, we build world-class software that drives growth.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition cursor-pointer group"
              onClick={() => setSelectedService(service)}
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition">{service.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
              <p className="text-slate-400 text-sm mb-4">{service.description}</p>
              
              <div className="space-y-2 mb-4">
                {service.features.slice(0, 3).map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-blue-400 mt-1">✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-700 pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-slate-400 text-xs">Starting from</p>
                    <p className="text-2xl font-bold text-white">${service.startingPrice.toLocaleString()}</p>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
                    Learn More →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-slate-800 rounded-lg border border-slate-700 max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-5xl mb-4">{selectedService.icon}</div>
                  <h2 className="text-2xl font-bold text-white">{selectedService.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedService(null)}
                  className="text-slate-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <p className="text-slate-300 mb-6">{selectedService.description}</p>

              <div className="mb-6">
                <h3 className="font-semibold text-white mb-3">All Features</h3>
                <ul className="space-y-2">
                  {selectedService.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-slate-300">
                      <span className="text-blue-400">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-700 rounded-lg p-4">
                  <p className="text-slate-400 text-sm">Starting Price</p>
                  <p className="text-2xl font-bold text-white">${selectedService.startingPrice.toLocaleString()}</p>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <p className="text-slate-400 text-sm">Delivery Timeline</p>
                  <p className="text-2xl font-bold text-white">{selectedService.deliveryTime}</p>
                </div>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition">
                Request a Quote
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Process Section */}
      <div className="bg-slate-950 border-t border-slate-700 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Our Development Process</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: 'Discovery', description: 'Understanding your vision and requirements', icon: '🔍' },
              { title: 'Design', description: 'Creating architecture and UI/UX designs', icon: '✏️' },
              { title: 'Development', description: 'Building with cutting-edge technologies', icon: '⚙️' },
              { title: 'Deployment', description: 'Launching and ongoing support', icon: '🚀' },
            ].map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="text-5xl mb-4">{step.icon}</div>
                <h3 className="font-bold text-white mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Vision?</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Let's discuss your project and create something extraordinary together
          </p>
          <button className="bg-white text-blue-600 hover:bg-slate-100 font-semibold py-3 px-8 rounded-lg transition">
            Schedule a Consultation
          </button>
        </div>
      </div>
    </div>
  )
}
