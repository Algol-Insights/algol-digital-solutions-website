"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui-lib"
import {
  ArrowRight,
  Laptop,
  Code,
  Palette,
  Server,
  Cloud,
  Lock,
  ShoppingCart as Cart,
  Search,
  Sparkles
} from "lucide-react"
import { HeroBanner } from "@/components/hero-banner"
import { HotDealsSection } from "@/components/hot-deals"
import { MegaMenu } from "@/components/mega-menu"
import { AdvancedSearch } from "@/components/advanced-search"
import { TestimonialsSection } from "@/components/testimonials"
import { FeaturesSection } from "@/components/features-section"
import { products } from "@/lib/products"
import { ProductCard } from "@/components/product-card"

const services = [
  {
    icon: Laptop,
    title: "IT Hardware & Software",
    description: "Premium laptops, desktops, smartphones, tablets, and accessories. New and certified refurbished devices with warranty and support."
  },
  {
    icon: Cloud,
    title: "Microsoft 365 Services",
    description: "Authorized Microsoft 365 reseller. Get Office apps, cloud storage, Teams, and email hosting with expert setup and support."
  },
  {
    icon: Lock,
    title: "Network Security & Firewalls",
    description: "Enterprise-grade firewall solutions from Fortinet, Cisco, and MikroTik. Complete network security implementation and monitoring."
  },
  {
    icon: Server,
    title: "Network Installation",
    description: "Professional office network design, structured cabling, Wi-Fi setup, and complete IT infrastructure implementation."
  },
  {
    icon: Code,
    title: "Website & Software Development",
    description: "Custom websites, e-commerce platforms, mobile apps, and business software solutions tailored to your needs."
  },
  {
    icon: Palette,
    title: "CCTV & IT Support",
    description: "Security camera systems with remote viewing, plus on-demand technical support and maintenance for SMEs."
  },
]

export default function HomePage() {
  const featuredProducts = products.filter(p => p.featured).slice(0, 8)
  const saleProducts = products.filter(p => p.originalPrice).slice(0, 4)

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO BANNER WITH ADVANCED ANIMATIONS */}
      <section className="py-8 lg:py-12 bg-gradient-to-b from-slate-950 via-slate-900 to-background relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-brand-teal-medium/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-golden/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <HeroBanner />
        </div>
      </section>

      {/* MEGA MENU NAVIGATION */}
      <MegaMenu />

      {/* MOBILE CATEGORY SCROLL */}
      <section className="md:hidden bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4">
            <Link 
              href="/products"
              className="flex items-center gap-2 px-4 py-2 bg-brand-teal-medium text-white rounded-full text-sm font-medium whitespace-nowrap shadow-md flex-shrink-0"
            >
              <Search className="h-4 w-4" />
              All Products
            </Link>
            <Link 
              href="/products?category=laptops"
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium whitespace-nowrap hover:bg-gray-200 flex-shrink-0"
            >
              <Laptop className="h-4 w-4" />
              Laptops
            </Link>
            <Link 
              href="/products?category=security"
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium whitespace-nowrap hover:bg-gray-200 flex-shrink-0"
            >
              <Lock className="h-4 w-4" />
              Security
            </Link>
            <Link 
              href="/products?category=networking"
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium whitespace-nowrap hover:bg-gray-200 flex-shrink-0"
            >
              <Server className="h-4 w-4" />
              Networking
            </Link>
            <Link 
              href="/deals"
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-bold whitespace-nowrap hover:bg-red-100 flex-shrink-0"
            >
              <Sparkles className="h-4 w-4" />
              Hot Deals
            </Link>
          </div>
        </div>
      </section>

      {/* ADVANCED SEARCH BAR SECTION */}
      <section className="py-6 md:py-8 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center gap-2 mb-4 md:mb-6">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Search className="h-5 w-5 md:h-6 md:w-6 text-brand-teal-medium" />
              </motion.div>
              <h2 className="text-lg md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-teal-dark to-brand-golden">
                Find Your Perfect Product
              </h2>
            </div>
            <AdvancedSearch />
          </motion.div>
        </div>
      </section>

      {/* HOT DEALS SECTION */}
      <HotDealsSection />

      {/* FEATURES SECTION */}
      <FeaturesSection />

      {/* FEATURED PRODUCTS SECTION WITH ENHANCED LAYOUT */}
      <section className="py-24 bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal-medium/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-golden/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-teal-medium/10 border border-brand-teal-medium/20 mb-4"
            >
              <Sparkles className="h-4 w-4 text-brand-golden animate-pulse" />
              <span className="text-sm font-semibold text-brand-teal-dark dark:text-brand-teal-light">
                Handpicked Selection
              </span>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Featured <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-teal-dark to-brand-golden">Premium Products</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our top-rated technology solutions trusted by businesses across Zimbabwe
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <Link href="/products">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-brand-teal-medium to-brand-teal-dark hover:from-brand-teal-dark hover:to-brand-teal-medium text-white font-bold shadow-xl hover:shadow-2xl hover:shadow-brand-teal-medium/30 transition-all duration-300 group"
              >
                Explore All Products
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* SERVICES SECTION WITH IMPROVED DESIGN */}
      <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-950 text-white relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-teal-medium/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-golden/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Comprehensive <span className="text-brand-golden">Digital Solutions</span>
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              End-to-end technology services tailored for Zimbabwean businesses
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group"
              >
                <div className="relative h-full bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-brand-teal-medium/50 hover:bg-white/10 transition-all duration-300 overflow-hidden">
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-teal-medium/10 to-brand-golden/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="w-16 h-16 mb-6 rounded-xl bg-gradient-to-br from-brand-teal-medium to-brand-golden flex items-center justify-center shadow-lg group-hover:shadow-brand-teal-medium/50"
                    >
                      <service.icon className="h-8 w-8 text-white" />
                    </motion.div>
                    
                    <h3 className="text-xl font-bold mb-3 group-hover:text-brand-golden transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-white/70 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Corner decoration */}
                  <div className="absolute bottom-0 right-0 w-24 h-24 opacity-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-teal-medium to-brand-golden transform rotate-45 translate-x-12 translate-y-12" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="text-center mt-12"
          >
            <Link href="/services">
              <Button 
                size="lg" 
                className="bg-brand-golden hover:bg-yellow-500 text-white font-bold shadow-xl hover:shadow-2xl hover:shadow-brand-golden/30 transition-all duration-300"
              >
                View All Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <TestimonialsSection />

      {/* CALL TO ACTION SECTION */}
      <section className="py-24 bg-gradient-to-br from-brand-teal-dark via-brand-teal-medium to-brand-golden relative overflow-hidden animate-gradient">
        {/* Animated background pattern */}
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            backgroundPosition: ["0px 0px", "100px 100px"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center text-white"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Join thousands of satisfied customers and experience the future of technology today
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center mb-12">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/products">
                  <Button size="lg" className="bg-white text-brand-teal-dark hover:bg-white/90 font-bold text-lg px-8 py-6 shadow-2xl">
                    <Cart className="mr-2 h-6 w-6" />
                    Start Shopping Now
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/support">
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-brand-teal-dark font-bold text-lg px-8 py-6 bg-transparent">
                    Contact Our Experts
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: "2000+", label: "Happy Clients" },
                { value: "5000+", label: "Products Sold" },
                { value: "20+", label: "Years in Business" },
                { value: "24/7", label: "Support Available" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm md:text-base text-white/80">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
