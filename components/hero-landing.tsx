"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion"
import { 
  Code2, 
  Globe, 
  Cloud, 
  Shield, 
  Server, 
  Monitor, 
  Smartphone,
  ArrowRight,
  Play,
  CheckCircle2,
  Sparkles,
  Zap,
  Users,
  Award,
  Clock,
  HeadphonesIcon,
  ChevronRight,
  Terminal,
  Braces,
  Database,
  Cpu,
  ShoppingCart as Cart
} from "lucide-react"
import { Button } from "@/components/ui-lib"

// Animated code snippets for visual effect
const codeSnippets = [
  `const algol = {
  mission: "Digital Excellence",
  location: "Harare, Zimbabwe",
  expertise: ["Web", "Cloud", "Security"]
};`,
  `async function transform() {
  const business = await analyze();
  return innovate(business);
}`,
  `interface Solution {
  quality: "Premium";
  support: "24/7";
  delivery: "On-Time";
}`
]

// Services data with full details
const services = [
  {
    id: "web-development",
    icon: Globe,
    title: "Website Development",
    shortDesc: "Custom websites that convert visitors into customers",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    href: "/services/web-development"
  },
  {
    id: "software-development", 
    icon: Code2,
    title: "Software Development",
    shortDesc: "Tailored software solutions for your business needs",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    href: "/services/software-development"
  },
  {
    id: "cloud-productivity",
    icon: Cloud,
    title: "Cloud Productivity Services",
    shortDesc: "Complete Microsoft cloud solutions & support",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
    href: "/services/microsoft-365"
  },
  {
    id: "it-support",
    icon: HeadphonesIcon,
    title: "IT Support",
    shortDesc: "Reliable technical support when you need it",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    href: "/services/it-support"
  },
  {
    id: "hardware-sales",
    icon: Smartphone,
    title: "Hardware & Electronics",
    shortDesc: "Laptops, phones, tablets & IT equipment",
    color: "from-indigo-500 to-purple-500",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/20",
    href: "/products"
  },
  {
    id: "network-installation",
    icon: Server,
    title: "Network Installation",
    shortDesc: "Professional network setup & infrastructure",
    color: "from-teal-500 to-cyan-500",
    bgColor: "bg-teal-500/10",
    borderColor: "border-teal-500/20",
    href: "/services/network-installation"
  }
]

// Stats for credibility
const stats = [
  { value: "150+", label: "Projects Delivered" },
  { value: "1000+", label: "Happy Clients" },
  { value: "5+", label: "Years Experience" },
  { value: "24/7", label: "Support Available" }
]

// Floating code animation component
function FloatingCode() {
  const [currentSnippet, setCurrentSnippet] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSnippet((prev) => (prev + 1) % codeSnippets.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div 
      className="absolute right-0 top-1/2 -translate-y-1/2 w-[400px] hidden xl:block"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
    >
      <div className="relative">
        {/* Glowing background */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-teal-medium/20 to-brand-golden/20 blur-3xl rounded-full" />
        
        {/* Code window */}
        <motion.div 
          className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {/* Window header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 border-b border-slate-700/50">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-xs text-slate-400 ml-2 font-mono">algol-solutions.ts</span>
          </div>
          
          {/* Code content */}
          <div className="p-4 font-mono text-sm">
            <AnimatePresence mode="wait">
              <motion.pre
                key={currentSnippet}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-slate-300 leading-relaxed"
              >
                <code>{codeSnippets[currentSnippet]}</code>
              </motion.pre>
            </AnimatePresence>
          </div>
          
          {/* Typing indicator */}
          <div className="px-4 pb-3 flex items-center gap-1">
            <motion.div
              className="w-2 h-4 bg-brand-teal-medium"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
            <span className="text-xs text-slate-500">Ready to code your success...</span>
          </div>
        </motion.div>

        {/* Floating icons */}
        <motion.div
          className="absolute -top-8 -left-8 p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg"
          animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Terminal className="w-6 h-6 text-white" />
        </motion.div>
        
        <motion.div
          className="absolute -bottom-6 -right-6 p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg"
          animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
        >
          <Database className="w-6 h-6 text-white" />
        </motion.div>
        
        <motion.div
          className="absolute top-1/2 -left-12 p-2 bg-gradient-to-br from-brand-golden to-orange-500 rounded-lg shadow-lg"
          animate={{ x: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Braces className="w-5 h-5 text-white" />
        </motion.div>
      </div>
    </motion.div>
  )
}

// Animated background particles
// Pre-generated stable positions to avoid hydration mismatch
const PARTICLE_POSITIONS = Array.from({ length: 20 }, (_, i) => ({
  left: (i * 7.3 + 13.7) % 100,
  top: (i * 11.9 + 23.1) % 100,
  duration: 3 + (i % 5) * 0.4,
  delay: (i % 8) * 0.25,
}))

function ParticleField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {PARTICLE_POSITIONS.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-brand-teal-medium/30 rounded-full"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  )
}

export function HeroLanding() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-teal-medium/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-brand-golden/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-[150px]" />
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <ParticleField />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Main content */}
          <div className="space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-teal-medium/10 border border-brand-teal-medium/20 text-brand-teal-light text-sm font-medium">
                <Sparkles className="w-4 h-4 text-brand-golden animate-pulse" />
                Zimbabwe's Premier IT Solutions Provider
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-4"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="text-white">We Build</span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-teal-light via-brand-teal-medium to-brand-golden">
                  Digital Excellence
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-300 max-w-xl leading-relaxed">
                Algol Digital Solutions transforms businesses with cutting-edge technology. 
                From custom software to complete IT infrastructure, we deliver solutions that drive growth.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/products">
                <Button size="xl" className="group bg-gradient-to-r from-brand-golden to-yellow-500 hover:from-yellow-500 hover:to-brand-golden text-slate-900 font-bold shadow-lg shadow-brand-golden/25">
                  <Cart className="mr-2 w-5 h-5" />
                  Shop Now
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#services">
                <Button size="xl" className="group bg-gradient-to-r from-brand-teal-medium to-brand-teal-dark hover:from-brand-teal-dark hover:to-brand-teal-medium text-white shadow-lg shadow-brand-teal-medium/25">
                  Explore Our Services
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="xl" variant="outline" className="border-slate-600 text-white hover:bg-white/10 hover:border-white/30">
                  <Play className="mr-2 w-5 h-5" />
                  Get Free Consultation
                </Button>
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap items-center gap-6 pt-4"
            >
              {[
                { icon: CheckCircle2, text: "Trusted by 1000+ Businesses" },
                { icon: Award, text: "Microsoft Partner" },
                { icon: Clock, text: "24/7 Support" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-400 text-sm">
                  <item.icon className="w-4 h-4 text-brand-golden" />
                  <span>{item.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right column - Floating code */}
          <FloatingCode />
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-16 lg:mt-24"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-brand-teal-medium/10 to-brand-golden/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 text-center hover:border-brand-teal-medium/50 transition-colors">
                  <div className="text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-teal-light to-brand-golden">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-slate-500"
        >
          <span className="text-xs uppercase tracking-wider">Scroll to explore</span>
          <ChevronRight className="w-5 h-5 rotate-90" />
        </motion.div>
      </motion.div>
    </section>
  )
}

// Services showcase section
export function ServicesShowcase() {
  return (
    <section id="services" className="py-24 bg-gradient-to-b from-slate-950 to-slate-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-brand-teal-medium/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-golden/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-golden/10 border border-brand-golden/20 text-brand-golden text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            Our Services
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Complete IT Solutions for{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-teal-light to-brand-golden">
              Your Success
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            From development to deployment, security to support — we provide end-to-end 
            technology services tailored to your business needs.
          </p>
        </motion.div>

        {/* Services grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={service.href}>
                <div className={`group relative h-full ${service.bgColor} ${service.borderColor} border rounded-2xl p-6 hover:border-opacity-50 transition-all duration-300 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-1`}>
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity`} />
                  
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${service.color} mb-4 shadow-lg`}>
                      <service.icon className="w-6 h-6 text-white" />
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-teal-light transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-slate-400 mb-4">
                      {service.shortDesc}
                    </p>
                    
                    {/* CTA */}
                    <div className="flex items-center text-brand-teal-light font-medium">
                      <span>Learn More</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View all services button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/services">
            <Button size="lg" variant="outline" className="border-slate-600 text-white hover:bg-white/10">
              View All Services
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// About section for homepage
export function AboutSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Visual */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative">
              {/* Main image placeholder with gradient */}
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-brand-teal-dark to-brand-teal-medium p-1">
                <div className="w-full h-full rounded-3xl bg-slate-900 flex items-center justify-center overflow-hidden">
                  {/* Tech illustration */}
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="grid grid-cols-3 gap-4 p-8">
                        {[Code2, Globe, Cloud, Shield, Server, Monitor].map((Icon, i) => (
                          <motion.div
                            key={i}
                            animate={{ 
                              y: [0, -10, 0],
                              opacity: [0.5, 1, 0.5]
                            }}
                            transition={{ 
                              duration: 2,
                              delay: i * 0.2,
                              repeat: Infinity
                            }}
                            className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50"
                          >
                            <Icon className="w-8 h-8 text-brand-teal-light" />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-6 -right-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-4 border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-golden/10 rounded-lg">
                    <Award className="w-6 h-6 text-brand-golden" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">5+ Years</div>
                    <div className="text-xs text-slate-500">Industry Experience</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-teal-medium/10 border border-brand-teal-medium/20 text-brand-teal-dark dark:text-brand-teal-light text-sm font-medium">
              <Users className="w-4 h-4" />
              About Algol Digital Solutions
            </span>

            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              Your Trusted Technology Partner in{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-teal-dark to-brand-golden">
                Zimbabwe
              </span>
            </h2>

            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Founded with a vision to bridge the digital divide, Algol Digital Solutions has 
              grown to become Zimbabwe's leading provider of comprehensive IT services. We 
              combine technical expertise with a deep understanding of local business needs.
            </p>

            <div className="space-y-4">
              {[
                "Microsoft Certified Partner with expert-level certifications",
                "Local team providing responsive support across Zimbabwe",
                "Proven track record with 150+ successful projects",
                "Competitive pricing tailored for African businesses"
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-brand-teal-medium flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600 dark:text-slate-300">{item}</span>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/about">
                <Button className="bg-gradient-to-r from-brand-teal-medium to-brand-teal-dark text-white">
                  Learn More About Us
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline">
                  Contact Our Team
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
