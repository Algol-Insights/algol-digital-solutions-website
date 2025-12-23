"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, Search, Phone, Mail } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const faqs = [
  {
    category: "Orders & Payments",
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept EcoCash, InnBucks, bank transfers (RTGS and USD), cash on delivery, Visa, Mastercard, and other payment arrangements. For corporate clients, we also offer 30-day payment terms upon credit approval."
      },
      {
        q: "Can I change or cancel my order?",
        a: "Yes, you can change or cancel your order within 2 hours of placing it. After that, if the order has been processed, you may need to follow our returns policy once the item is delivered."
      },
      {
        q: "Do you offer bulk or corporate discounts?",
        a: "Absolutely! We offer special pricing for bulk orders (10+ items) and corporate clients. Contact our sales team at +263 788 663 313 for a custom quote."
      },
      {
        q: "How do I track my order?",
        a: "Once your order is dispatched, you'll receive a tracking number via SMS and email. You can track your order anytime at our Order Tracking page or contact us for real-time updates."
      }
    ]
  },
  {
    category: "Delivery",
    questions: [
      {
        q: "Is delivery free?",
        a: "Delivery is completely free within Harare. For other cities and towns across Zimbabwe, delivery costs range from $10-15 depending on your location."
      },
      {
        q: "How long does delivery take?",
        a: "Harare deliveries typically take 1-2 business days. Other major cities receive orders within 2-5 business days. Express same-day delivery is available in Harare for orders placed before 2 PM."
      },
      {
        q: "Can I collect my order in person?",
        a: "Yes! Store pickup is available at our Harare office. Your order will be ready for collection within 2-4 hours during business hours (Mon-Sat: 8AM-5PM)."
      },
      {
        q: "Do you deliver to rural areas?",
        a: "Yes, we deliver nationwide including rural areas. Delivery to remote locations is arranged on a case-by-case basis. Contact us for specific delivery timeframes."
      }
    ]
  },
  {
    category: "Products & Specifications",
    questions: [
      {
        q: "Are your products genuine and new?",
        a: "All our products are 100% genuine, brand new, and sourced directly from authorized distributors. We are official partners for Dell, HP, Lenovo, Cisco, and Hikvision."
      },
      {
        q: "Do you offer custom PC builds?",
        a: "Yes! We specialize in custom PC builds for gaming, professional workstations, and servers. Contact us with your requirements and budget, and we'll design the perfect system for you."
      },
      {
        q: "Can you help me choose the right product?",
        a: "Absolutely! Our expert team can help you select products based on your needs and budget. Call us at +263 788 663 313 or use our live chat support."
      },
      {
        q: "Do you stock the latest models?",
        a: "Yes, we regularly update our inventory with the latest technology. If you're looking for a specific model not listed on our website, contact us – we can often order it for you."
      }
    ]
  },
  {
    category: "Returns & Warranty",
    questions: [
      {
        q: "What is your return policy?",
        a: "We accept returns within 14 days for unused items in original packaging. Manufacturing defects are covered within 30 days. See our Returns Policy page for complete details."
      },
      {
        q: "What warranty do you provide?",
        a: "All products come with manufacturer warranty (1-5 years depending on the product). Extended warranty options are available for purchase. Check our Warranty Information page for details."
      },
      {
        q: "How do I claim warranty?",
        a: "Contact us with your purchase details and a description of the issue. We'll assess the claim and arrange repair, replacement, or service typically within 24-48 hours."
      },
      {
        q: "Can I exchange a product?",
        a: "Yes, exchanges are possible within 14 days for unused items in original condition, subject to availability and price differences."
      }
    ]
  },
  {
    category: "Installation & Support",
    questions: [
      {
        q: "Do you offer installation services?",
        a: "Yes! We provide professional installation for security systems (from $50), network equipment (from $30), and software setup (from $20). Installation can be arranged during checkout."
      },
      {
        q: "Do you provide technical support?",
        a: "Absolutely! We offer comprehensive technical support via phone, email, WhatsApp, and in-person. Basic support is free; extended support packages are available for businesses."
      },
      {
        q: "Can you help with network setup?",
        a: "Yes, our team specializes in network design and implementation for homes and businesses. We handle everything from router configuration to enterprise network infrastructure."
      },
      {
        q: "Do you offer training on products?",
        a: "Yes, we provide basic product training with installation services. For enterprise solutions, comprehensive training packages are available for your team."
      }
    ]
  },
  {
    category: "Business & Corporate",
    questions: [
      {
        q: "Do you work with businesses and NGOs?",
        a: "Yes! We have extensive experience working with businesses, NGOs, government agencies, and educational institutions. We offer volume discounts, credit terms, and dedicated account management."
      },
      {
        q: "Can you provide quotes for tenders?",
        a: "Absolutely! We regularly participate in tenders and can provide detailed technical and financial proposals. Email your tender documents to sales@algoldigital.com"
      },
      {
        q: "Do you offer maintenance contracts?",
        a: "Yes, we offer annual maintenance contracts (AMCs) for IT infrastructure, security systems, and network equipment. Contact us for customized maintenance packages."
      },
      {
        q: "Can you design complete IT solutions?",
        a: "Yes! We provide end-to-end IT consulting, from needs assessment to implementation and ongoing support. Our expertise covers servers, networking, security, and software solutions."
      }
    ]
  }
]

export default function FAQsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [openItem, setOpenItem] = useState<string | null>(null)

  const filteredFAQs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      item =>
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-brand-teal-medium to-brand-golden bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
            Find answers to common questions about our products and services
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 pl-12 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-teal-medium/50 focus:border-brand-teal-medium transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((category, catIndex) => (
              <div key={catIndex} className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-slate-700/50">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-2 h-8 bg-gradient-to-b from-brand-teal-medium to-brand-golden rounded-full" />
                  {category.category}
                </h2>
                <div className="space-y-4">
                  {category.questions.map((item, index) => {
                    const itemId = `${catIndex}-${index}`
                    const isOpen = openItem === itemId

                    return (
                      <div
                        key={index}
                        className="bg-slate-700/30 rounded-xl overflow-hidden border border-slate-600/30 hover:border-brand-teal-medium/30 transition-all"
                      >
                        <button
                          onClick={() => setOpenItem(isOpen ? null : itemId)}
                          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-600/20 transition-colors"
                        >
                          <span className="font-semibold text-white pr-4">{item.q}</span>
                          <ChevronDown
                            className={`w-5 h-5 text-brand-teal-medium flex-shrink-0 transition-transform ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-4 text-slate-300 leading-relaxed">
                                {item.a}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">No results found for "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 text-brand-teal-medium hover:text-brand-golden transition-colors"
              >
                Clear search
              </button>
            </div>
          )}
        </div>

        {/* Still Need Help */}
        <div className="mt-16 bg-gradient-to-br from-brand-teal-dark to-brand-teal-medium rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-white/80 mb-6">Our team is here to help you find the answers you need</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:+263788663313"
              className="inline-flex items-center gap-2 bg-white text-brand-teal-dark px-6 py-3 rounded-lg font-medium hover:bg-slate-100 transition-colors"
            >
              <Phone className="w-5 h-5" />
              +263 788 663 313
            </a>
            <Link
              href="/support"
              className="inline-flex items-center gap-2 bg-brand-teal-dark text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-teal-dark/80 transition-colors border border-white/20"
            >
              <Mail className="w-5 h-5" />
              Contact Support
            </Link>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-12">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-brand-teal-medium hover:text-brand-golden transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
