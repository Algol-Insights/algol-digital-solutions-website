"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, ShoppingCart, ArrowRight, Zap, TrendingUp, Package } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeroSlide {
  id: number
  title: string
  subtitle: string
  description: string
  image: string
  cta: string
  ctaLink: string
  badge?: string
  discount?: string
  bgGradient: string
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    title: "Revolutionary Tech Solutions",
    subtitle: "Next-Gen Innovation",
    description: "Experience cutting-edge technology that transforms your business. Premium quality, unmatched performance.",
    image: "/hero-tech-1.jpg",
    cta: "Explore Collection",
    ctaLink: "/products",
    badge: "New Arrival",
    discount: "Up to 40% OFF",
    bgGradient: "from-brand-teal-dark via-brand-teal-medium to-brand-golden"
  },
  {
    id: 2,
    title: "Smart Security Systems",
    subtitle: "Protect What Matters",
    description: "Advanced security solutions with AI-powered monitoring and real-time alerts. Enterprise-grade protection.",
    image: "/hero-security.jpg",
    cta: "View Solutions",
    ctaLink: "/products?category=security",
    badge: "Best Seller",
    discount: "Limited Offer",
    bgGradient: "from-slate-900 via-brand-teal-dark to-blue-900"
  },
  {
    id: 3,
    title: "Digital Transformation",
    subtitle: "Future-Ready Tech",
    description: "Complete digital solutions for modern enterprises. Cloud computing, IoT, and AI integration.",
    image: "/hero-digital.jpg",
    cta: "Start Journey",
    ctaLink: "/products?category=digital",
    badge: "Trending",
    discount: "Save 30%",
    bgGradient: "from-purple-900 via-brand-teal-medium to-brand-golden"
  }
]

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return
    
    const timer = setInterval(() => {
      setDirection(1)
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 6000)

    return () => clearInterval(timer)
  }, [isPaused])

  const navigate = (newIndex: number) => {
    setDirection(newIndex > currentSlide ? 1 : -1)
    setCurrentSlide(newIndex)
  }

  const slide = heroSlides[currentSlide]

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }

  return (
    <div 
      className="relative h-[600px] overflow-hidden rounded-2xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${slide.bgGradient} opacity-95`} />

      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={slide.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.4 },
          }}
          className="absolute inset-0"
        >
          <div className="container mx-auto h-full px-4">
            <div className="grid h-full items-center gap-8 lg:grid-cols-2">
              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6 text-white"
              >
                {/* Badges */}
                <div className="flex gap-3">
                  {slide.badge && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                      className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-4 py-2 text-sm font-semibold"
                    >
                      <Zap className="h-4 w-4" />
                      {slide.badge}
                    </motion.span>
                  )}
                  {slide.discount && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4, type: "spring" }}
                      className="inline-flex items-center gap-2 rounded-full bg-brand-golden px-4 py-2 text-sm font-bold text-white"
                    >
                      <TrendingUp className="h-4 w-4" />
                      {slide.discount}
                    </motion.span>
                  )}
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm font-semibold uppercase tracking-wider text-brand-golden"
                  >
                    {slide.subtitle}
                  </motion.p>
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-5xl font-bold leading-tight lg:text-6xl"
                  >
                    {slide.title}
                  </motion.h1>
                </div>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-lg text-white/90 max-w-lg"
                >
                  {slide.description}
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex gap-4"
                >
                  <Button
                    asChild
                    size="lg"
                    className="bg-white text-brand-teal-dark hover:bg-white/90 font-semibold group"
                  >
                    <Link href={slide.ctaLink}>
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      {slide.cta}
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-brand-teal-dark font-semibold"
                  >
                    <Link href="/about">
                      Learn More
                    </Link>
                  </Button>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center gap-6 pt-4"
                >
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-brand-golden" />
                    <span className="text-sm">Free Delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-brand-golden" />
                    <span className="text-sm">Best Prices</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-brand-golden" />
                    <span className="text-sm">Fast Support</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Product Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="relative hidden lg:block h-[500px]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl backdrop-blur-sm" />
                <div className="relative h-full flex items-center justify-center">
                  {/* Placeholder for product image */}
                  <div className="w-96 h-96 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center">
                    <Package className="h-32 w-32 text-white/50" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
        <Button
          variant="ghost"
          size="icon"
          className="pointer-events-auto h-12 w-12 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-all hover:scale-110"
          onClick={() => navigate((currentSlide - 1 + heroSlides.length) % heroSlides.length)}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="pointer-events-auto h-12 w-12 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-all hover:scale-110"
          onClick={() => navigate((currentSlide + 1) % heroSlides.length)}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => navigate(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide
                ? "w-8 bg-white"
                : "w-2 bg-white/50 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
