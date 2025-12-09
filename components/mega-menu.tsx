"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronDown,
  Laptop,
  Shield,
  Wifi,
  Camera,
  Server,
  Smartphone,
  Headphones,
  Monitor,
  Printer,
  HardDrive,
  Cpu,
  Keyboard,
  Mouse,
  Home,
  TrendingUp,
  Zap,
  Package
} from "lucide-react"

interface SubCategory {
  name: string
  href: string
  icon?: any
  description?: string
  badge?: string
}

interface Category {
  name: string
  href: string
  icon: any
  subcategories: SubCategory[]
  featured?: {
    title: string
    description: string
    image: string
    href: string
    badge?: string
  }
}

const categories: Category[] = [
  {
    name: "Laptops & Computers",
    href: "/products?category=laptops",
    icon: Laptop,
    subcategories: [
      { name: "Business Laptops", href: "/products?category=business-laptops", icon: Laptop },
      { name: "Gaming Laptops", href: "/products?category=gaming-laptops", icon: Laptop, badge: "HOT" },
      { name: "Desktop PCs", href: "/products?category=desktops", icon: Monitor },
      { name: "All-in-One PCs", href: "/products?category=all-in-one", icon: Monitor },
      { name: "Workstations", href: "/products?category=workstations", icon: Server }
    ],
    featured: {
      title: "New Arrival: Ultra Pro Laptop",
      description: "Experience next-gen performance with our latest business laptop",
      image: "/featured/laptop.jpg",
      href: "/products/ultra-pro-laptop",
      badge: "NEW"
    }
  },
  {
    name: "Security Systems",
    href: "/products?category=security",
    icon: Shield,
    subcategories: [
      { name: "CCTV Cameras", href: "/products?category=cctv", icon: Camera },
      { name: "Access Control", href: "/products?category=access-control", icon: Shield },
      { name: "Alarm Systems", href: "/products?category=alarms", icon: Shield, badge: "TRENDING" },
      { name: "Smart Locks", href: "/products?category=smart-locks", icon: Shield },
      { name: "Video Doorbells", href: "/products?category=doorbells", icon: Camera }
    ],
    featured: {
      title: "AI-Powered Security Suite",
      description: "Advanced threat detection with 24/7 monitoring",
      image: "/featured/security.jpg",
      href: "/products/ai-security-suite",
      badge: "BEST SELLER"
    }
  },
  {
    name: "Networking",
    href: "/products?category=networking",
    icon: Wifi,
    subcategories: [
      { name: "Routers", href: "/products?category=routers", icon: Wifi },
      { name: "Switches", href: "/products?category=switches", icon: Server },
      { name: "Access Points", href: "/products?category=access-points", icon: Wifi, badge: "NEW" },
      { name: "Network Cards", href: "/products?category=network-cards", icon: Wifi },
      { name: "Cables & Accessories", href: "/products?category=cables", icon: Package }
    ],
    featured: {
      title: "Enterprise Router Pro",
      description: "Ultra-fast Wi-Fi 6E with advanced security features",
      image: "/featured/router.jpg",
      href: "/products/enterprise-router-pro",
      badge: "40% OFF"
    }
  },
  {
    name: "Peripherals",
    href: "/products?category=peripherals",
    icon: Keyboard,
    subcategories: [
      { name: "Keyboards", href: "/products?category=keyboards", icon: Keyboard },
      { name: "Mice", href: "/products?category=mice", icon: Mouse },
      { name: "Headsets", href: "/products?category=headsets", icon: Headphones, badge: "HOT" },
      { name: "Webcams", href: "/products?category=webcams", icon: Camera },
      { name: "Printers", href: "/products?category=printers", icon: Printer }
    ],
    featured: {
      title: "Mechanical Keyboard Pro",
      description: "Premium typing experience for professionals",
      image: "/featured/keyboard.jpg",
      href: "/products/mechanical-keyboard-pro"
    }
  },
  {
    name: "Components",
    href: "/products?category=components",
    icon: Cpu,
    subcategories: [
      { name: "Processors", href: "/products?category=processors", icon: Cpu, badge: "NEW" },
      { name: "Graphics Cards", href: "/products?category=gpu", icon: Cpu },
      { name: "Memory (RAM)", href: "/products?category=ram", icon: HardDrive },
      { name: "Storage Drives", href: "/products?category=storage", icon: HardDrive },
      { name: "Motherboards", href: "/products?category=motherboards", icon: Cpu }
    ],
    featured: {
      title: "High-Performance SSD",
      description: "Lightning-fast speeds up to 7000MB/s",
      image: "/featured/ssd.jpg",
      href: "/products/high-performance-ssd",
      badge: "LIMITED"
    }
  }
]

export function MegaMenu() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  return (
    <nav className="relative bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-8">
          {/* All Categories Button */}
          <div
            className="relative py-4 cursor-pointer group"
            onMouseEnter={() => setActiveCategory("all")}
            onMouseLeave={() => setActiveCategory(null)}
          >
            <div className="flex items-center gap-2 font-semibold text-gray-700 hover:text-brand-teal-medium transition-colors">
              <Package className="h-5 w-5" />
              All Categories
              <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
            </div>
          </div>

          {/* Category Links */}
          {categories.map((category) => (
            <div
              key={category.name}
              className="relative py-4 cursor-pointer group"
              onMouseEnter={() => setActiveCategory(category.name)}
              onMouseLeave={() => setActiveCategory(null)}
            >
              <Link
                href={category.href}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-brand-teal-medium transition-colors"
              >
                <category.icon className="h-4 w-4" />
                {category.name}
                <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
              </Link>
            </div>
          ))}

          {/* Hot Deals Link */}
          <Link
            href="/deals"
            className="flex items-center gap-2 py-4 text-sm font-bold text-red-600 hover:text-red-700 transition-colors"
          >
            <Zap className="h-4 w-4" />
            Hot Deals
            <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">NEW</span>
          </Link>
        </div>
      </div>

      {/* Mega Menu Dropdown */}
      <AnimatePresence>
        {activeCategory && activeCategory !== "all" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 top-full z-50 bg-white shadow-2xl border-t border-gray-200"
            onMouseEnter={() => setActiveCategory(activeCategory)}
            onMouseLeave={() => setActiveCategory(null)}
          >
            <div className="container mx-auto px-4 py-8">
              {categories
                .filter((cat) => cat.name === activeCategory)
                .map((category) => (
                  <div key={category.name} className="grid grid-cols-12 gap-8">
                    {/* Subcategories */}
                    <div className="col-span-8">
                      <div className="grid grid-cols-3 gap-6">
                        {category.subcategories.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className="group flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            {sub.icon && (
                              <div className="flex-shrink-0 mt-0.5">
                                <sub.icon className="h-5 w-5 text-brand-teal-medium" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-900 group-hover:text-brand-teal-medium transition-colors">
                                  {sub.name}
                                </span>
                                {sub.badge && (
                                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                                    sub.badge === "HOT" ? "bg-red-100 text-red-700" :
                                    sub.badge === "NEW" ? "bg-green-100 text-green-700" :
                                    "bg-purple-100 text-purple-700"
                                  }`}>
                                    {sub.badge}
                                  </span>
                                )}
                              </div>
                              {sub.description && (
                                <p className="text-xs text-gray-600 mt-1">
                                  {sub.description}
                                </p>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>

                      {/* View All Link */}
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <Link
                          href={category.href}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-teal-medium hover:text-brand-teal-dark transition-colors group"
                        >
                          View All {category.name}
                          <TrendingUp className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </div>

                    {/* Featured Product */}
                    {category.featured && (
                      <div className="col-span-4">
                        <Link
                          href={category.featured.href}
                          className="block group relative h-full"
                        >
                          <div className="relative h-full bg-gradient-to-br from-brand-teal-dark to-brand-teal-medium rounded-xl p-6 text-white overflow-hidden">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-10">
                              <div className="absolute inset-0" style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                              }} />
                            </div>

                            <div className="relative z-10 space-y-4">
                              {category.featured.badge && (
                                <span className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">
                                  {category.featured.badge}
                                </span>
                              )}
                              <h3 className="text-xl font-bold">
                                {category.featured.title}
                              </h3>
                              <p className="text-sm text-white/90">
                                {category.featured.description}
                              </p>

                              {/* Product Image Placeholder */}
                              <div className="mt-6 bg-white/10 backdrop-blur-md rounded-lg p-4 flex items-center justify-center h-32">
                                <category.icon className="h-16 w-16 text-white/50" />
                              </div>

                              <div className="flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all">
                                <span>Learn More</span>
                                <TrendingUp className="h-4 w-4" />
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </motion.div>
        )}

        {/* All Categories Dropdown */}
        {activeCategory === "all" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 top-full z-50 bg-white shadow-2xl border-t border-gray-200"
            onMouseEnter={() => setActiveCategory("all")}
            onMouseLeave={() => setActiveCategory(null)}
          >
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-5 gap-6">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="group p-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-shrink-0 bg-brand-teal-medium/10 p-2 rounded-lg group-hover:bg-brand-teal-medium/20 transition-colors">
                        <category.icon className="h-6 w-6 text-brand-teal-medium" />
                      </div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-brand-teal-medium transition-colors">
                        {category.name}
                      </h3>
                    </div>
                    <ul className="space-y-2">
                      {category.subcategories.slice(0, 4).map((sub) => (
                        <li key={sub.name}>
                          <span className="text-sm text-gray-600 hover:text-brand-teal-medium transition-colors">
                            {sub.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
