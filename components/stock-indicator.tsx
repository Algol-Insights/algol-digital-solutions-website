"use client"

import { AlertCircle, Package, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

interface StockIndicatorProps {
  stock: number
  variant?: "badge" | "inline" | "detailed"
  className?: string
}

export function StockIndicator({ stock, variant = "badge", className = "" }: StockIndicatorProps) {
  const getStockStatus = () => {
    if (stock === 0) {
      return {
        label: "Out of Stock",
        color: "text-red-600 dark:text-red-400",
        bg: "bg-red-100 dark:bg-red-900/20",
        border: "border-red-500/30",
        icon: AlertCircle,
        dotColor: "bg-red-500",
      }
    } else if (stock <= 5) {
      return {
        label: `Only ${stock} left!`,
        color: "text-orange-600 dark:text-orange-400",
        bg: "bg-orange-100 dark:bg-orange-900/20",
        border: "border-orange-500/30",
        icon: AlertCircle,
        dotColor: "bg-orange-500",
        urgent: true,
      }
    } else if (stock <= 10) {
      return {
        label: "Low Stock",
        color: "text-yellow-600 dark:text-yellow-400",
        bg: "bg-yellow-100 dark:bg-yellow-900/20",
        border: "border-yellow-500/30",
        icon: TrendingUp,
        dotColor: "bg-yellow-500",
      }
    } else {
      return {
        label: "In Stock",
        color: "text-green-600 dark:text-green-400",
        bg: "bg-green-100 dark:bg-green-900/20",
        border: "border-green-500/30",
        icon: Package,
        dotColor: "bg-green-500",
      }
    }
  }

  const status = getStockStatus()
  const Icon = status.icon

  if (variant === "badge") {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${status.bg} ${status.color} ${className}`}
      >
        <span className={`h-2 w-2 rounded-full ${status.dotColor} ${status.urgent ? 'animate-pulse' : ''}`} />
        {status.label}
      </motion.div>
    )
  }

  if (variant === "inline") {
    return (
      <div className={`flex items-center gap-2 ${status.color} ${className}`}>
        <span className={`h-2 w-2 rounded-full ${status.dotColor} ${status.urgent ? 'animate-pulse' : ''}`} />
        <span className="text-sm font-medium">{status.label}</span>
      </div>
    )
  }

  // Detailed variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-3 p-4 rounded-xl border ${status.bg} ${status.border} ${className}`}
    >
      <div className={`p-2 rounded-lg ${status.bg}`}>
        <Icon className={`h-5 w-5 ${status.color}`} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className={`h-2 w-2 rounded-full ${status.dotColor} ${status.urgent ? 'animate-pulse' : ''}`} />
          <span className={`font-bold ${status.color}`}>{status.label}</span>
        </div>
        {stock > 0 && stock <= 5 && (
          <p className="text-xs text-muted-foreground">
            Hurry! Limited quantity available. Order now to secure yours.
          </p>
        )}
        {stock > 5 && stock <= 10 && (
          <p className="text-xs text-muted-foreground">
            Stock is running low. Add to cart before it's gone.
          </p>
        )}
        {stock > 10 && (
          <p className="text-xs text-muted-foreground">
            Available for immediate local delivery within Zimbabwe.
          </p>
        )}
        {stock === 0 && (
          <p className="text-xs text-muted-foreground">
            Currently unavailable. Check back soon or contact us for alternatives.
          </p>
        )}
      </div>
    </motion.div>
  )
}

// Stock progress bar component
interface StockProgressProps {
  stock: number
  maxStock?: number
  showLabel?: boolean
  className?: string
}

export function StockProgress({ stock, maxStock = 100, showLabel = true, className = "" }: StockProgressProps) {
  const percentage = Math.min((stock / maxStock) * 100, 100)
  
  const getColor = () => {
    if (percentage === 0) return "bg-red-500"
    if (percentage <= 20) return "bg-orange-500"
    if (percentage <= 40) return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex items-center justify-between mb-2 text-xs">
          <span className="text-muted-foreground">Stock Level</span>
          <span className="font-medium">{stock} units</span>
        </div>
      )}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${getColor()} rounded-full`}
        />
      </div>
    </div>
  )
}
