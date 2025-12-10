"use client"

import { motion } from "framer-motion"
import { Truck, Shield, CreditCard, HeadphonesIcon, Award, Zap, RefreshCw, Lock } from "lucide-react"

const features = [
  {
    icon: Truck,
    title: "Nationwide Delivery",
    description: "Fast and reliable delivery across all cities in Zimbabwe. Track your order in real-time.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Shield,
    title: "100% Genuine Products",
    description: "Authentic hardware and software from authorized distributors. Quality guaranteed.",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: CreditCard,
    title: "Flexible Payment",
    description: "Multiple payment options: EcoCash, Bank Transfer, Cash on Delivery, and more.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Expert Support",
    description: "Round-the-clock technical assistance and customer support whenever you need us.",
    color: "from-orange-500 to-red-500"
  },
  {
    icon: Award,
    title: "Best Price Guarantee",
    description: "Competitive pricing with regular deals and discounts. Value for your money.",
    color: "from-yellow-500 to-orange-500"
  },
  {
    icon: Zap,
    title: "Quick Installation",
    description: "Professional installation and setup services for all purchased equipment.",
    color: "from-indigo-500 to-purple-500"
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "Hassle-free 30-day return policy. Your satisfaction is our priority.",
    color: "from-teal-500 to-green-500"
  },
  {
    icon: Lock,
    title: "Secure Transactions",
    description: "Bank-level encryption for all transactions. Your data is safe with us.",
    color: "from-red-500 to-pink-500"
  }
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-slate-50 dark:to-slate-900 relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-golden/10 border border-brand-golden/20 mb-4"
          >
            <Zap className="h-4 w-4 text-brand-golden" />
            <span className="text-sm font-semibold text-brand-golden">
              Why Choose Us
            </span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Experience Excellence in <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-teal-dark to-brand-golden">Every Detail</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We don't just sell products - we deliver complete solutions backed by exceptional service
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative"
            >
              <div className="relative h-full bg-white dark:bg-slate-800 rounded-2xl p-6 border border-border hover:border-brand-teal-medium/50 shadow-md hover:shadow-2xl hover:shadow-brand-teal-medium/20 transition-all duration-300 overflow-hidden">
                {/* Icon with gradient background */}
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl`}
                >
                  <feature.icon className="h-7 w-7 text-white" />
                </motion.div>

                {/* Content */}
                <h3 className="text-lg font-bold mb-2 group-hover:text-brand-teal-medium transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} transform rotate-45 translate-x-10 -translate-y-10`} />
                </div>

                {/* Hover effect glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl pointer-events-none`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
