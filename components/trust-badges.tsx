"use client"

import { Shield, Lock, Award, RotateCcw, Truck, CreditCard, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"

interface TrustBadgesProps {
  variant?: "compact" | "detailed" | "inline"
  className?: string
}

export function TrustBadges({ variant = "compact", className = "" }: TrustBadgesProps) {
  const badges = [
    {
      icon: Award,
      title: "Authorized Dealer",
      description: "Official Dell & HP partner",
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "SSL encrypted transactions",
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-900/20",
    },
    {
      icon: RotateCcw,
      title: "30-Day Returns",
      description: "Hassle-free money back",
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      icon: Truck,
      title: "Free Delivery",
      description: "Within Harare",
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-50 dark:bg-orange-900/20",
    },
  ]

  if (variant === "inline") {
    return (
      <div className={`flex flex-wrap gap-3 ${className}`}>
        {badges.map((badge, index) => {
          const Icon = badge.icon
          return (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg ${badge.bg}`}
            >
              <Icon className={`h-4 w-4 ${badge.color}`} />
              <span className="text-xs font-medium">{badge.title}</span>
            </motion.div>
          )
        })}
      </div>
    )
  }

  if (variant === "compact") {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
        {badges.map((badge, index) => {
          const Icon = badge.icon
          return (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex flex-col items-center text-center p-4 rounded-xl ${badge.bg} border border-border hover:shadow-lg transition-shadow`}
            >
              <div className={`p-3 rounded-full ${badge.bg} mb-2`}>
                <Icon className={`h-6 w-6 ${badge.color}`} />
              </div>
              <div className="font-bold text-sm">{badge.title}</div>
            </motion.div>
          )
        })}
      </div>
    )
  }

  // Detailed variant
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      {badges.map((badge, index) => {
        const Icon = badge.icon
        return (
          <motion.div
            key={badge.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-start gap-4 p-4 rounded-xl ${badge.bg} border border-border hover:shadow-lg transition-shadow`}
          >
            <div className={`p-3 rounded-lg ${badge.bg}`}>
              <Icon className={`h-6 w-6 ${badge.color}`} />
            </div>
            <div className="flex-1">
              <div className="font-bold mb-1">{badge.title}</div>
              <div className="text-sm text-muted-foreground">{badge.description}</div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

// Payment method badges
export function PaymentBadges({ className = "" }: { className?: string }) {
  const paymentMethods = [
    { name: "Visa", logo: "💳" },
    { name: "Mastercard", logo: "💳" },
    { name: "EcoCash", logo: "📱" },
    { name: "OneMoney", logo: "📱" },
  ]

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Lock className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">Secure payment with:</span>
      <div className="flex items-center gap-2">
        {paymentMethods.map((method) => (
          <div
            key={method.name}
            className="px-3 py-1.5 bg-muted rounded-md text-xs font-medium flex items-center gap-1 hover:bg-muted/80 transition-colors"
            title={method.name}
          >
            <span>{method.logo}</span>
            <span>{method.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Warranty badge
export function WarrantyBadge({ months = 12, className = "" }: { months?: number; className?: string }) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg ${className}`}
    >
      <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      <div>
        <div className="text-sm font-bold text-blue-600 dark:text-blue-400">{months}-Month Warranty</div>
        <div className="text-xs text-muted-foreground">Manufacturer guaranteed</div>
      </div>
    </motion.div>
  )
}

// Verified seller badge
export function VerifiedSellerBadge({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-full ${className}`}>
      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
      <span className="text-xs font-bold text-green-600 dark:text-green-400">Verified Seller</span>
    </div>
  )
}

// Security section for checkout
export function CheckoutSecurity({ className = "" }: { className?: string }) {
  return (
    <div className={`p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-2xl border border-green-200 dark:border-green-800 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-green-500 rounded-lg">
          <Lock className="h-5 w-5 text-white" />
        </div>
        <h3 className="font-bold text-lg">Secure Checkout</h3>
      </div>
      
      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
          <span>256-bit SSL encryption for all transactions</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
          <span>Your payment information is never stored</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
          <span>PCI DSS compliant payment processing</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
          <span>Money-back guarantee on all orders</span>
        </div>
      </div>

      <PaymentBadges className="mt-4 pt-4 border-t border-green-200 dark:border-green-800" />
    </div>
  )
}
