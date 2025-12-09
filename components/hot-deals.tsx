"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Flame, Clock, Star, ShoppingCart, Eye, Heart, TrendingUp, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Deal {
  id: number
  name: string
  category: string
  price: number
  originalPrice: number
  discount: number
  rating: number
  reviews: number
  sold: number
  stock: number
  image: string
  endsAt: Date
  badge?: "HOT" | "NEW" | "LIMITED"
}

const mockDeals: Deal[] = [
  {
    id: 1,
    name: "Advanced Security Camera System",
    category: "Security",
    price: 299.99,
    originalPrice: 499.99,
    discount: 40,
    rating: 4.8,
    reviews: 234,
    sold: 156,
    stock: 24,
    image: "/products/camera.jpg",
    endsAt: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours
    badge: "HOT"
  },
  {
    id: 2,
    name: "Enterprise Router Pro",
    category: "Networking",
    price: 189.99,
    originalPrice: 299.99,
    discount: 37,
    rating: 4.6,
    reviews: 189,
    sold: 98,
    stock: 45,
    image: "/products/router.jpg",
    endsAt: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours
    badge: "NEW"
  },
  {
    id: 3,
    name: "Smart Home Hub",
    category: "Smart Home",
    price: 149.99,
    originalPrice: 249.99,
    discount: 40,
    rating: 4.9,
    reviews: 412,
    sold: 287,
    stock: 12,
    image: "/products/hub.jpg",
    endsAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
    badge: "LIMITED"
  },
  {
    id: 4,
    name: "Business Laptop Ultra",
    category: "Laptops",
    price: 899.99,
    originalPrice: 1299.99,
    discount: 31,
    rating: 4.7,
    reviews: 156,
    sold: 67,
    stock: 18,
    image: "/products/laptop.jpg",
    endsAt: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours
    badge: "HOT"
  }
]

function CountdownTimer({ endsAt }: { endsAt: Date }) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const end = endsAt.getTime()
      const distance = end - now

      if (distance < 0) {
        clearInterval(timer)
        return
      }

      setTimeLeft({
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [endsAt])

  return (
    <div className="flex items-center gap-2">
      <Clock className="h-4 w-4 text-red-500" />
      <div className="flex gap-1">
        <span className="bg-black text-white px-2 py-1 rounded text-sm font-bold min-w-[2rem] text-center">
          {String(timeLeft.hours).padStart(2, '0')}
        </span>
        <span className="text-sm">:</span>
        <span className="bg-black text-white px-2 py-1 rounded text-sm font-bold min-w-[2rem] text-center">
          {String(timeLeft.minutes).padStart(2, '0')}
        </span>
        <span className="text-sm">:</span>
        <span className="bg-black text-white px-2 py-1 rounded text-sm font-bold min-w-[2rem] text-center">
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}

function DealCard({ deal }: { deal: Deal }) {
  const [isHovered, setIsHovered] = useState(false)
  const stockPercentage = (deal.stock / (deal.stock + deal.sold)) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300"
    >
      {/* Badge */}
      {deal.badge && (
        <div className={`absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1 ${
          deal.badge === "HOT" ? "bg-gradient-to-r from-red-500 to-orange-500" :
          deal.badge === "NEW" ? "bg-gradient-to-r from-green-500 to-teal-500" :
          "bg-gradient-to-r from-purple-500 to-pink-500"
        }`}>
          {deal.badge === "HOT" && <Flame className="h-3 w-3" />}
          {deal.badge === "NEW" && <Zap className="h-3 w-3" />}
          {deal.badge === "LIMITED" && <TrendingUp className="h-3 w-3" />}
          {deal.badge}
        </div>
      )}

      {/* Discount Badge */}
      <div className="absolute top-3 right-3 z-10 bg-brand-golden text-white px-3 py-1 rounded-full text-sm font-bold">
        -{deal.discount}%
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute top-16 right-3 z-10 flex flex-col gap-2"
      >
        <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full bg-white shadow-lg">
          <Heart className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full bg-white shadow-lg">
          <Eye className="h-4 w-4" />
        </Button>
      </motion.div>

      {/* Product Image */}
      <Link href={`/products/${deal.id}`}>
        <div className="relative h-64 bg-gray-100 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <ShoppingCart className="h-24 w-24 text-gray-300" />
          </div>
          {/* Overlay on hover */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-black/10 backdrop-blur-[1px]"
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        {/* Category & Rating */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-brand-teal-medium font-semibold uppercase">
            {deal.category}
          </span>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold">{deal.rating}</span>
            <span className="text-xs text-gray-500">({deal.reviews})</span>
          </div>
        </div>

        {/* Product Name */}
        <Link href={`/products/${deal.id}`}>
          <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-brand-teal-medium transition-colors">
            {deal.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900">
            ${deal.price.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500 line-through">
            ${deal.originalPrice.toFixed(2)}
          </span>
        </div>

        {/* Stock Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">
              Available: <span className="font-semibold text-brand-teal-medium">{deal.stock}</span>
            </span>
            <span className="text-gray-600">
              Sold: <span className="font-semibold text-gray-900">{deal.sold}</span>
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${100 - stockPercentage}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-brand-teal-medium to-brand-golden"
            />
          </div>
        </div>

        {/* Countdown */}
        <div className="pt-2 border-t border-gray-200">
          <CountdownTimer endsAt={deal.endsAt} />
        </div>

        {/* Add to Cart Button */}
        <Button
          className="w-full bg-brand-teal-dark hover:bg-brand-teal-medium text-white font-semibold group"
          size="lg"
        >
          <ShoppingCart className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
          Add to Cart
        </Button>
      </div>
    </motion.div>
  )
}

export function HotDealsSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-2 rounded-full">
            <Flame className="h-5 w-5 animate-pulse" />
            <span className="font-bold text-lg">TODAY'S HOT DEALS</span>
            <Flame className="h-5 w-5 animate-pulse" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900">
            Limited Time Offers
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't miss out on these incredible deals! Premium products at unbeatable prices.
            Hurry, stocks are limited!
          </p>
        </motion.div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockDeals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-2 border-brand-teal-dark text-brand-teal-dark hover:bg-brand-teal-dark hover:text-white font-semibold"
          >
            <Link href="/deals">
              View All Deals
              <TrendingUp className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
