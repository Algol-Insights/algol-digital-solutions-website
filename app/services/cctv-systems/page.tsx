"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Camera, 
  ArrowRight, 
  CheckCircle2, 
  Eye,
  Shield,
  Smartphone,
  HardDrive,
  Cloud,
  Zap,
  Headphones
} from "lucide-react"
import { Button } from "@/components/ui-lib"

const features = [
  {
    icon: Eye,
    name: "HD & 4K Cameras",
    description: "Crystal clear footage with IP and analog options",
    details: "2MP to 8MP resolution, night vision up to 30m"
  },
  {
    icon: HardDrive,
    name: "NVR/DVR Systems",
    description: "Reliable recording with generous storage",
    details: "4 to 64 channel systems, up to 8TB storage"
  },
  {
    icon: Smartphone,
    name: "Mobile Viewing",
    description: "Watch your property from anywhere",
    details: "iOS and Android apps, real-time notifications"
  },
  {
    icon: Cloud,
    name: "Cloud Backup",
    description: "Secure off-site video storage",
    details: "30-day cloud retention, encrypted storage"
  }
]

const packages = [
  {
    name: "Home Security",
    cameras: "4 Cameras",
    price: "$699",
    description: "Perfect for homes and small shops",
    includes: [
      "4x 2MP IP cameras",
      "4-channel NVR with 1TB",
      "Night vision up to 20m",
      "Mobile app access",
      "Professional installation",
      "1 year warranty"
    ]
  },
  {
    name: "Business Standard",
    cameras: "8 Cameras",
    price: "$1,499",
    description: "Ideal for small to medium businesses",
    includes: [
      "8x 4MP IP cameras",
      "8-channel NVR with 2TB",
      "Night vision up to 30m",
      "Mobile & desktop access",
      "Motion detection alerts",
      "Professional installation",
      "Remote technical support",
      "2 year warranty"
    ],
    popular: true
  },
  {
    name: "Enterprise Solution",
    cameras: "16+ Cameras",
    price: "$3,999+",
    description: "For large facilities and warehouses",
    includes: [
      "16x 4K IP cameras",
      "16+ channel NVR with 4TB+",
      "PTZ cameras available",
      "Advanced analytics",
      "Integration with access control",
      "Centralized management",
      "24/7 monitoring option",
      "Priority support"
    ]
  }
]

const cameraTypes = [
  {
    name: "Bullet Cameras",
    description: "Long-range outdoor surveillance",
    price: "From $79",
    bestFor: "Parking lots, perimeters"
  },
  {
    name: "Dome Cameras",
    description: "Discreet indoor/outdoor coverage",
    price: "From $69",
    bestFor: "Offices, retail stores"
  },
  {
    name: "PTZ Cameras",
    description: "Pan-tilt-zoom for wide area coverage",
    price: "From $299",
    bestFor: "Large open areas"
  },
  {
    name: "Turret Cameras",
    description: "Flexible mounting, anti-vandal",
    price: "From $89",
    bestFor: "Entrances, corridors"
  }
]

const brands = [
  "Hikvision", "Dahua", "Uniview", "Reolink", "Ezviz"
]

export default function CCTVSystemsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]" />
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

              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg mb-6">
                <Camera className="w-12 h-12 text-white" />
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                CCTV{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-purple-400">
                  Systems
                </span>
              </h1>

              <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                Professional surveillance solutions for homes, businesses, and enterprises. 
                HD and 4K cameras with remote viewing capabilities.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/contact">
                  <Button size="lg" className="bg-gradient-to-r from-violet-500 to-purple-500 text-white">
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
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-12 border-t border-b border-slate-800">
        <div className="container mx-auto px-4">
          <p className="text-center text-slate-400 mb-6">Trusted brands we install</p>
          <div className="flex flex-wrap justify-center gap-8">
            {brands.map(brand => (
              <span key={brand} className="text-xl font-semibold text-slate-500 hover:text-slate-300 transition-colors">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              System Features
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Modern surveillance technology for complete peace of mind.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 text-center"
              >
                <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 mb-4">
                  <feature.icon className="w-8 h-8 text-violet-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.name}</h3>
                <p className="text-slate-400 mb-2">{feature.description}</p>
                <p className="text-sm text-slate-500">{feature.details}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Camera Types */}
      <section className="py-24 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Camera Types
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              We offer various camera styles to suit different environments.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {cameraTypes.map((camera, index) => (
              <motion.div
                key={camera.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6"
              >
                <h3 className="text-lg font-bold text-white mb-2">{camera.name}</h3>
                <p className="text-slate-400 text-sm mb-3">{camera.description}</p>
                <div className="text-violet-400 font-bold mb-2">{camera.price}</div>
                <p className="text-xs text-slate-500">Best for: {camera.bestFor}</p>
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
              Complete Packages
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Turnkey solutions including equipment, installation, and setup.
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
                    ? "border-violet-500 shadow-xl shadow-violet-500/20" 
                    : "border-slate-700/50"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full text-white text-sm font-medium">
                    Best Value
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                  <div className="text-4xl font-bold text-white mb-2">{pkg.price}</div>
                  <p className="text-violet-400 font-medium">{pkg.cameras}</p>
                  <p className="text-slate-400 text-sm mt-2">{pkg.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-slate-300 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>

                <Link href="/contact">
                  <Button 
                    className={`w-full ${
                      pkg.popular 
                        ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white" 
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

      {/* Add-ons */}
      <section className="py-24 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Optional Add-ons
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { name: "Extra Camera", price: "+$79/camera" },
              { name: "Storage Upgrade", price: "+$99/TB" },
              { name: "Cloud Backup", price: "$9.99/month" },
              { name: "24/7 Monitoring", price: "$49/month" },
              { name: "Access Control Integration", price: "From $299" },
              { name: "Extended Warranty", price: "+$149/year" }
            ].map((addon, index) => (
              <motion.div
                key={addon.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4 flex justify-between items-center"
              >
                <span className="text-slate-300">{addon.name}</span>
                <span className="text-violet-400 font-medium">{addon.price}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 opacity-90" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Protect What Matters Most
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Get a free site assessment and custom surveillance solution for your property.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-violet-600 hover:bg-slate-100">
                  Get Free Assessment
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
