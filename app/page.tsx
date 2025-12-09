"use client"

import Link from "next/link"
import { Button } from "@/components/ui-lib"
import {
  ArrowRight,
  Laptop,
  Monitor,
  Wifi,
  Shield,
  Truck,
  CreditCard,
  HeadphonesIcon,
  Star,
  Printer,
  HardDrive,
  Package,
  Mouse,
  Code,
  Palette,
  Server,
  Cloud,
  Lock,
  ShoppingCart as Cart,
  Zap,
  TrendingUp,
  Heart,
  Search
} from "lucide-react"
import { HeroBanner } from "@/components/hero-banner"
import { HotDealsSection } from "@/components/hot-deals"
import { MegaMenu } from "@/components/mega-menu"
import { AdvancedSearch } from "@/components/advanced-search"
import { products } from "@/lib/products"
import { ProductCard } from "@/components/product-card"

const features = [
  { icon: Truck, title: "Nationwide Delivery", description: "Fast delivery across Zimbabwe" },
  { icon: CreditCard, title: "Multiple Payment Options", description: "EcoCash, Bank Transfer & COD" },
  { icon: Shield, title: "Genuine Products", description: "100% authentic hardware & software" },
  { icon: HeadphonesIcon, title: "Expert Support", description: "24/7 technical assistance" },
]

const services = [
  {
    icon: Laptop,
    title: "IT Hardware & Software",
    description: "Premium laptops, desktops, networking equipment, and enterprise software solutions from leading global brands."
  },
  {
    icon: Cloud,
    title: "Microsoft 365 & Office Services",
    description: "Complete cloud productivity solutions, Microsoft 365 subscriptions, and enterprise collaboration tools."
  },
  {
    icon: Server,
    title: "Network Installations",
    description: "Professional network design, implementation, and maintenance for businesses of all sizes across Zimbabwe."
  },
  {
    icon: Lock,
    title: "Sophos Security Solutions",
    description: "Advanced cybersecurity and antivirus protection powered by Sophos to secure your business infrastructure."
  },
  {
    icon: Code,
    title: "Website Development",
    description: "Custom web applications, e-commerce platforms, and digital solutions tailored to your business needs."
  },
  {
    icon: Palette,
    title: "Graphic Design",
    description: "Creative branding, marketing materials, and visual identity design that makes your business stand out."
  },
  {
    icon: Cart,
    title: "Reselling & Partnerships",
    description: "Authorized reseller of premium software and hardware. Join our partner network for exclusive benefits."
  },
]

export default function HomePage() {
  const featuredProducts = products.filter(p => p.featured).slice(0, 8)
  const saleProducts = products.filter(p => p.originalPrice).slice(0, 4)

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO BANNER WITH CAROUSEL */}
      <section className="py-8 bg-gradient-to-b from-slate-900 via-slate-800 to-background">
        <div className="container mx-auto px-4">
          <HeroBanner />
        </div>
      </section>

      {/* MEGA MENU NAVIGATION */}
      <MegaMenu />

      {/* SEARCH BAR SECTION */}
      <section className="py-6 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <Search className="h-5 w-5 text-brand-teal-medium" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Find Your Perfect Product</h2>
            </div>
            <AdvancedSearch />
          </div>
        </div>
      </section>

      {/* HOT DEALS SECTION */}
      <HotDealsSection />

      {/* ABOUT US SECTION */}
      <section className="py-16 bg-gradient-to-b from-violet-50 dark:from-slate-950 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-violet-700 dark:text-violet-400">
                Algol Digital Solutions
              </h1>
              <p className="text-xl text-muted-foreground mb-2">
                A Subsidiary of Algol Insights
              </p>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Your trusted partner for premium IT hardware, software, and digital solutions across Zimbabwe
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6 mb-16">
              {features.map((feature, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700 text-center hover:shadow-lg transition-shadow">
                  <feature.icon className="h-8 w-8 mx-auto mb-3 text-violet-600 dark:text-violet-400" />
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>

            <div className="bg-violet-50 dark:bg-slate-800 p-8 rounded-lg border border-violet-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6 text-center text-violet-700 dark:text-violet-400">
                Why Choose Us?
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-violet-600 dark:text-violet-400 flex-shrink-0 mt-0.5" />
                  <span>20+ years of experience in IT solutions and business technology</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-violet-600 dark:text-violet-400 flex-shrink-0 mt-0.5" />
                  <span>Partnerships with leading global technology brands</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-violet-600 dark:text-violet-400 flex-shrink-0 mt-0.5" />
                  <span>Dedicated support team available 24/7 for all your tech needs</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-violet-600 dark:text-violet-400 flex-shrink-0 mt-0.5" />
                  <span>Competitive pricing with quality assurance</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS SECTION */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Featured Products</h2>
            <p className="text-muted-foreground">
              Handpicked selection of our best-selling items
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center">
            <Button asChild size="lg" variant="outline">
              <Link href="/products">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="py-16 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Our Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive technology solutions for businesses of all sizes
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <div
                key={i}
                className="group bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700 hover:shadow-lg hover:border-violet-300 dark:hover:border-violet-600 transition-all"
              >
                <service.icon className="h-10 w-10 mb-4 text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="py-16 bg-gradient-to-r from-violet-600 to-violet-700 dark:from-violet-900 dark:to-violet-950 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Trusted by Thousands</h2>
            <p className="text-lg mb-12 text-white/90">
              Join our growing community of satisfied customers across Zimbabwe
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div>
                <div className="text-4xl font-bold">10,000+</div>
                <p className="text-white/80 mt-2">Happy Customers</p>
              </div>
              <div>
                <div className="text-4xl font-bold">5,000+</div>
                <p className="text-white/80 mt-2">Products Available</p>
              </div>
              <div>
                <div className="text-4xl font-bold">98%</div>
                <p className="text-white/80 mt-2">Customer Satisfaction</p>
              </div>
            </div>
            <Button asChild size="lg" className="bg-white text-violet-600 hover:bg-white/90">
              <Link href="/products">
                Start Shopping Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
