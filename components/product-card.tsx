"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Button } from "@/components/ui-lib"
import { ShoppingCart, Check, Heart, Eye, Star, TrendingUp } from "lucide-react"
import type { Product } from "@/lib/cart-store"
import { useCartStore } from "@/lib/cart-store"
import { useWishlistStore } from "@/lib/wishlist-store"
import * as React from "react"

interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [added, setAdded] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)
  const addItem = useCartStore((state) => state.addItem)
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlistStore()
  const inWishlist = isInWishlist(product.id)
  
  // 3D tilt effect
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 })
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (inWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="group relative"
    >
      <Link href={`/products/${product.id}`}>
        <motion.div
          whileHover={{ y: -8 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative rounded-2xl border border-border bg-card overflow-hidden transition-all hover:border-brand-teal-medium/50 hover:shadow-2xl hover:shadow-brand-teal-medium/20"
        >
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-teal-medium/0 via-transparent to-brand-golden/0 group-hover:from-brand-teal-medium/5 group-hover:to-brand-golden/5 transition-all duration-500 z-10 pointer-events-none" />

          {/* Image Container */}
          <div className="relative aspect-square bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-all duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
              {discount > 0 && (
                <motion.span
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                  className="px-3 py-1.5 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold shadow-lg flex items-center gap-1"
                >
                  <TrendingUp className="h-3 w-3" />
                  -{discount}%
                </motion.span>
              )}
              {product.featured && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                  className="px-3 py-1.5 rounded-full bg-gradient-to-r from-brand-golden to-yellow-500 text-white text-xs font-bold shadow-lg"
                >
                  ⭐ Featured
                </motion.span>
              )}
            </div>

            {/* Quick Action Buttons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
              transition={{ duration: 0.3 }}
              className="absolute top-3 right-3 flex flex-col gap-2 z-20"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleWishlistToggle}
                className={`p-2.5 rounded-full backdrop-blur-xl border shadow-lg transition-colors ${
                  inWishlist
                    ? "bg-red-500 border-red-400 text-white"
                    : "bg-white/90 dark:bg-slate-800/90 border-white/20 text-slate-700 dark:text-slate-200 hover:bg-red-500 hover:text-white"
                }`}
              >
                <Heart className={`h-4 w-4 ${inWishlist ? "fill-current" : ""}`} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-white/20 text-slate-700 dark:text-slate-200 hover:bg-brand-teal-medium hover:text-white shadow-lg transition-colors"
              >
                <Eye className="h-4 w-4" />
              </motion.button>
            </motion.div>

            {!product.inStock && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-30">
                <span className="px-4 py-2 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-bold shadow-xl">
                  Out of Stock
                </span>
              </div>
            )}

            {/* Shine effect on hover */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
                backgroundSize: "200% 100%",
              }}
              animate={{
                backgroundPosition: isHovered ? ["0% 0%", "200% 0%"] : "0% 0%"
              }}
              transition={{
                duration: 1.5,
                ease: "easeInOut"
              }}
            />
          </div>

          {/* Content */}
          <div className="p-5 space-y-3">
            {/* Brand & Rating */}
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-brand-teal-medium uppercase tracking-wider">
                {product.brand}
              </p>
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-semibold">4.8</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="font-bold text-base line-clamp-2 group-hover:text-brand-teal-medium transition-colors leading-snug min-h-[3rem]">
              {product.name}
            </h3>

            {/* Description */}
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {product.description}
            </p>

            {/* Price */}
            <div className="flex items-center gap-3 pt-2">
              <span className="text-2xl font-bold text-brand-teal-dark dark:text-brand-teal-light">
                ${product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground line-through">
                    ${product.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-xs text-green-600 dark:text-green-400 font-semibold">
                    Save ${(product.originalPrice - product.price).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Add to Cart Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock || added}
                className={`w-full font-bold shadow-lg transition-all duration-300 ${
                  added
                    ? "bg-green-600 hover:bg-green-600 shadow-green-500/50"
                    : "bg-gradient-to-r from-brand-teal-medium to-brand-teal-dark hover:from-brand-teal-dark hover:to-brand-teal-medium shadow-brand-teal-medium/30"
                }`}
                size="lg"
              >
                {added ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="h-5 w-5" />
                    Added to Cart!
                  </motion.div>
                ) : (
                  <div className="flex items-center gap-2 group/btn">
                    <ShoppingCart className="h-5 w-5 group-hover/btn:animate-bounce" />
                    Add to Cart
                  </div>
                )}
              </Button>
            </motion.div>
          </div>

          {/* 3D depth effect border */}
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none" />
        </motion.div>
      </Link>
    </motion.div>
  )
}
