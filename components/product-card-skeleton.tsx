"use client"

import { motion } from "framer-motion"

export function ProductCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      className="relative rounded-2xl border border-border bg-card overflow-hidden"
    >
      {/* Image skeleton */}
      <div className="relative aspect-square bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{
            translateX: ["-100%", "100%"]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Content skeleton */}
      <div className="p-5 space-y-3">
        {/* Brand and rating */}
        <div className="flex items-center justify-between">
          <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          <div className="h-3 w-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-3 w-5/6 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
        </div>

        {/* Price and button */}
        <div className="flex items-center justify-between pt-2">
          <div className="space-y-1">
            <div className="h-6 w-20 bg-brand-teal-medium/20 rounded animate-pulse" />
            <div className="h-3 w-16 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
          </div>
          <div className="h-10 w-24 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
        </div>
      </div>
    </motion.div>
  )
}
