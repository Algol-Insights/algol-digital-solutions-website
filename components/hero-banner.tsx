"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion"
import { ChevronLeft, ChevronRight, ShoppingCart, ArrowRight, Zap, TrendingUp, Package, Shield, Award, Clock } from "lucide-react"
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
  features?: string[]
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
    bgGradient: "from-brand-teal-dark via-brand-teal-medium to-brand-golden",
    features: ["Free Nationwide Delivery", "24/7 Support", "Genuine Products"]
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
    bgGradient: "from-slate-900 via-brand-teal-dark to-blue-900",
    features: ["Enterprise-Grade", "AI-Powered", "Real-time Alerts"]
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
    bgGradient: "from-purple-900 via-brand-teal-medium to-brand-golden",
    features: ["Cloud Solutions", "IoT Integration", "AI Ready"]
  }
]

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Mouse parallax effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothMouseX = useSpring(mouseX, { stiffness: 100, damping: 30 })
  const smoothMouseY = useSpring(mouseY, { stiffness: 100, damping: 30 })
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], ["2deg", "-2deg"])
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], ["-2deg", "2deg"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsPaused(false)
  }

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
      ref={containerRef}
      className="relative h-[650px] lg:h-[700px] overflow-hidden rounded-3xl shadow-2xl"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Animated Background with Particles */}
      <div className={`absolute inset-0 bg-gradient-to-br ${slide.bgGradient}`}>
        {/* Animated floating orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-golden/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <motion.div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
          animate={{
            backgroundPosition: ['0px 0px', '60px 60px'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
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
                className="space-y-6 text-white z-10"
              >
                {/* Badges */}
                <div className="flex flex-wrap gap-3">
                  {slide.badge && (
                    <motion.span
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                      className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-4 py-2 text-sm font-semibold border border-white/30 shadow-lg"
                    >
                      <Zap className="h-4 w-4 animate-pulse" />
                      {slide.badge}
                    </motion.span>
                  )}
                  {slide.discount && (
                    <motion.span
                      initial={{ scale: 0, rotate: 180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-golden via-yellow-500 to-brand-golden px-4 py-2 text-sm font-bold text-white shadow-lg animate-pulse"
                    >
                      <TrendingUp className="h-4 w-4" />
                      {slide.discount}
                    </motion.span>
                  )}
                </div>

                {/* Title */}
                <div className="space-y-3">
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm font-bold uppercase tracking-widest text-brand-golden flex items-center gap-2"
                  >
                    <Award className="h-4 w-4" />
                    {slide.subtitle}
                  </motion.p>
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-brand-golden"
                  >
                    {slide.title}
                  </motion.h1>
                </div>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-lg md:text-xl text-white/90 max-w-xl leading-relaxed"
                >
                  {slide.description}
                </motion.p>

                {/* Feature Pills */}
                {slide.features && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-wrap gap-2"
                  >
                    {slide.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs font-medium border border-white/20"
                      >
                        ✓ {feature}
                      </span>
                    ))}
                  </motion.div>
                )}

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex flex-wrap gap-4 pt-2"
                >
                  <Link href={slide.ctaLink}>
                    <Button
                      size="lg"
                      className="bg-white text-brand-teal-dark hover:bg-brand-golden hover:text-white font-bold group shadow-2xl hover:shadow-brand-golden/50 transition-all duration-300 hover:scale-105"
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      {slide.cta}
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link href="/support">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-brand-teal-dark font-semibold shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      <Shield className="mr-2 h-5 w-5" />
                      Learn More
                    </Button>
                  </Link>
                </motion.div>

                {/* Trust Indicators with enhanced styling */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/20"
                >
                  <div className="flex items-center gap-2 group cursor-pointer">
                    <div className="p-2 bg-white/10 backdrop-blur-sm rounded-full group-hover:bg-brand-golden transition-colors">
                      <Package className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block">Free Delivery</span>
                      <span className="text-xs text-white/70">Nationwide</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 group cursor-pointer">
                    <div className="p-2 bg-white/10 backdrop-blur-sm rounded-full group-hover:bg-brand-golden transition-colors">
                      <TrendingUp className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block">Best Prices</span>
                      <span className="text-xs text-white/70">Guaranteed</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 group cursor-pointer">
                    <div className="p-2 bg-white/10 backdrop-blur-sm rounded-full group-hover:bg-brand-golden transition-colors">
                      <Clock className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block">24/7 Support</span>
                      <span className="text-xs text-white/70">Always here</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Enhanced 3D Product Display */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                style={{
                  rotateX,
                  rotateY,
                  transformStyle: "preserve-3d",
                }}
                className="relative hidden lg:block h-full"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Glowing backdrop */}
                  <motion.div
                    className="absolute w-[500px] h-[500px] bg-gradient-to-br from-white/20 via-brand-golden/20 to-transparent rounded-full blur-3xl"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Product card with glassmorphism */}
                  <motion.div
                    className="relative z-10 w-[450px] h-[450px] bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl flex items-center justify-center overflow-hidden group"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {/* Animated gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-teal-medium/20 via-transparent to-brand-golden/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Product icon/placeholder */}
                    <div className="relative z-10">
                      <Package className="h-48 w-48 text-white/60 group-hover:text-white transition-colors duration-300" />
                      
                      {/* Floating particles */}
                      <motion.div
                        className="absolute top-10 left-10 w-3 h-3 bg-brand-golden rounded-full"
                        animate={{
                          y: [-20, 20, -20],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                        }}
                      />
                      <motion.div
                        className="absolute bottom-10 right-10 w-2 h-2 bg-white rounded-full"
                        animate={{
                          y: [20, -20, 20],
                          opacity: [0.3, 1, 0.3],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                        }}
                      />
                    </div>

                    {/* Corner decorations */}
                    <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-white/30 rounded-tl-xl" />
                    <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-white/30 rounded-br-xl" />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Enhanced Navigation Arrows with better styling */}
      <div className="absolute inset-0 flex items-center justify-between px-6 pointer-events-none z-20">
        <motion.div
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="pointer-events-auto h-14 w-14 rounded-full bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 transition-all border border-white/20 shadow-xl hover:shadow-2xl"
            onClick={() => navigate((currentSlide - 1 + heroSlides.length) % heroSlides.length)}
          >
            <ChevronLeft className="h-7 w-7" />
          </Button>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.1, x: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="pointer-events-auto h-14 w-14 rounded-full bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 transition-all border border-white/20 shadow-xl hover:shadow-2xl"
            onClick={() => navigate((currentSlide + 1) % heroSlides.length)}
          >
            <ChevronRight className="h-7 w-7" />
          </Button>
        </motion.div>
      </div>

      {/* Enhanced Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {heroSlides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => navigate(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className={`relative h-2.5 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "w-10 bg-white shadow-lg shadow-white/50"
                : "w-2.5 bg-white/40 hover:bg-white/60 hover:w-6"
            }`}
          >
            {index === currentSlide && (
              <motion.div
                className="absolute inset-0 bg-brand-golden rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 6, ease: "linear" }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
