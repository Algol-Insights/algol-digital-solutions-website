"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"
import Image from "next/image"

interface Testimonial {
  id: number
  name: string
  role: string
  company: string
  content: string
  rating: number
  avatar: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Tendai Moyo",
    role: "IT Director",
    company: "TechCorp Zimbabwe",
    content: "Algol Digital Solutions provided exceptional service. Their enterprise networking solutions transformed our infrastructure. Fast delivery and expert support throughout!",
    rating: 5,
    avatar: "/avatars/avatar-1.jpg"
  },
  {
    id: 2,
    name: "Sarah Ncube",
    role: "CEO",
    company: "Innovate Harare",
    content: "Outstanding quality products at competitive prices. The team's technical expertise helped us choose the perfect security system for our office. Highly recommended!",
    rating: 5,
    avatar: "/avatars/avatar-2.jpg"
  },
  {
    id: 3,
    name: "James Chiweshe",
    role: "Operations Manager",
    company: "BuildRight Ltd",
    content: "Reliable, professional, and always available. Their 24/7 support saved us during a critical system issue. Best IT supplier in Zimbabwe!",
    rating: 5,
    avatar: "/avatars/avatar-3.jpg"
  },
  {
    id: 4,
    name: "Grace Mutasa",
    role: "Business Owner",
    company: "Retail Solutions ZW",
    content: "The custom software solution exceeded our expectations. Delivery was prompt and the after-sales support is incredible. Worth every dollar!",
    rating: 5,
    avatar: "/avatars/avatar-4.jpg"
  }
]

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-background via-slate-50 to-background dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-brand-teal-medium/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-brand-golden/20 rounded-full blur-3xl" />
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-teal-medium/10 border border-brand-teal-medium/20 mb-4"
          >
            <Star className="h-4 w-4 text-brand-golden fill-brand-golden" />
            <span className="text-sm font-semibold text-brand-teal-dark dark:text-brand-teal-light">
              Customer Reviews
            </span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-brand-teal-dark via-brand-teal-medium to-brand-golden">
            Trusted by Businesses Across Zimbabwe
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it - hear what our customers have to say about their experience
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative group"
            >
              <div className="relative h-full bg-white dark:bg-slate-800 rounded-2xl p-6 border border-border hover:border-brand-teal-medium/50 shadow-lg hover:shadow-2xl hover:shadow-brand-teal-medium/20 transition-all duration-300">
                {/* Quote icon */}
                <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-brand-teal-medium to-brand-teal-dark rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Quote className="h-6 w-6 text-white" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4 mt-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-teal-medium to-brand-golden flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    <p className="text-xs text-brand-teal-medium font-semibold">{testimonial.company}</p>
                  </div>
                </div>

                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-teal-medium/5 to-brand-golden/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Removed stats section under customer confessions as requested */}
      </div>
    </section>
  )
}
