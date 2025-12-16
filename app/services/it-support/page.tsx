"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { 
  HeadphonesIcon, 
  ArrowRight, 
  CheckCircle2, 
  Monitor,
  Clock,
  Phone,
  MessageSquare,
  Shield,
  Zap,
  Users,
  Wrench,
  Laptop
} from "lucide-react"
import { Button } from "@/components/ui-lib"

const supportPlans = [
  {
    name: "Pay-As-You-Go",
    price: "$75/hour",
    description: "For occasional support needs",
    features: [
      "Remote support via phone/email",
      "On-site visits available (+$25/hr)",
      "No monthly commitment",
      "Priority email response",
      "Weekend support (+50%)"
    ],
    popular: false
  },
  {
    name: "Business Care",
    price: "$299/month",
    description: "For small businesses (up to 10 users)",
    features: [
      "Unlimited remote support",
      "4 hours on-site included",
      "Next business day response",
      "Proactive monitoring",
      "Monthly health reports",
      "Discounted hardware"
    ],
    popular: true
  },
  {
    name: "Enterprise Care",
    price: "$599/month",
    description: "For growing businesses (up to 25 users)",
    features: [
      "Unlimited remote & on-site",
      "4-hour response time",
      "24/7 emergency support",
      "Full network monitoring",
      "Quarterly reviews",
      "Hardware discounts",
      "Dedicated account manager"
    ],
    popular: false
  }
]

const services = [
  {
    icon: Monitor,
    title: "Remote Support",
    description: "Instant remote access to troubleshoot and resolve issues without waiting for a technician visit"
  },
  {
    icon: Wrench,
    title: "On-Site Support",
    description: "Professional technicians dispatched to your location for hands-on hardware and network support"
  },
  {
    icon: Shield,
    title: "Proactive Monitoring",
    description: "24/7 monitoring of your systems to detect and prevent issues before they cause downtime"
  },
  {
    icon: Laptop,
    title: "Hardware Repair",
    description: "Expert repair services for laptops, desktops, printers, and other IT equipment"
  },
  {
    icon: Users,
    title: "User Training",
    description: "Training sessions to help your team use technology more effectively and securely"
  },
  {
    icon: Zap,
    title: "Emergency Response",
    description: "Rapid response for critical issues affecting your business operations"
  }
]

const benefits = [
  {
    stat: "< 1hr",
    label: "Average Response Time",
    description: "Most issues resolved remotely within an hour"
  },
  {
    stat: "95%",
    label: "First-Call Resolution",
    description: "Most problems fixed on the first support call"
  },
  {
    stat: "24/7",
    label: "Emergency Support",
    description: "Critical issues handled any time, any day"
  },
  {
    stat: "100%",
    label: "Satisfaction Guarantee",
    description: "Not happy? We'll make it right"
  }
]

export default function ITSupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px]" />
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
              
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg">
                <HeadphonesIcon className="w-10 h-10 text-white" />
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
                IT Support &{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-400">
                  Maintenance
                </span>
              </h1>

              <p className="text-xl text-slate-300 max-w-xl">
                Reliable technical support when you need it most. From helpdesk services 
                to complete managed IT, we keep your business running smoothly.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/contact">
                  <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600">
                    Get Support Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="tel:+263242123456">
                  <Button size="lg" variant="outline" className="border-slate-600 text-white hover:bg-white/10">
                    <Phone className="mr-2 w-5 h-5" />
                    Emergency Hotline
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="grid grid-cols-2 gap-4"
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 text-center"
                >
                  <div className="text-3xl font-bold text-green-400 mb-1">{benefit.stat}</div>
                  <div className="text-sm font-medium text-white mb-1">{benefit.label}</div>
                  <div className="text-xs text-slate-400">{benefit.description}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Support Services
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Comprehensive IT support services to keep your business productive and secure.
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
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-green-500/50 transition-colors"
              >
                <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 mb-4">
                  <service.icon className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                <p className="text-slate-400">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Support Plans
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Choose the support plan that fits your business. All plans include access 
              to our experienced technical team.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {supportPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-slate-800/50 backdrop-blur-sm border rounded-2xl p-8 ${
                  plan.popular 
                    ? "border-green-500 shadow-xl shadow-green-500/20" 
                    : "border-slate-700/50"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-white text-sm font-medium">
                    Most Popular
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-white mb-2">{plan.price}</div>
                  <p className="text-slate-400 text-sm">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-slate-300">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href="/contact">
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white" 
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
            Larger organization? <Link href="/contact" className="text-green-400 hover:underline">Contact us</Link> for custom enterprise support plans.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 opacity-90" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Need Help Right Now?
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Our support team is standing by. Call us for immediate assistance 
              or submit a ticket online.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="tel:+263242123456">
                <Button size="lg" className="bg-white text-green-600 hover:bg-slate-100">
                  <Phone className="mr-2 w-5 h-5" />
                  Call: +263 242 123 456
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <MessageSquare className="mr-2 w-5 h-5" />
                  Submit a Ticket
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
