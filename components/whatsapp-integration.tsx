"use client"

import * as React from "react"
import { MessageCircle, Phone } from "lucide-react"
import { Button } from "@/components/ui-lib"
import { Product } from "@/lib/cart-store"

interface WhatsAppButtonProps {
  product?: Product
  orderId?: string
  message?: string
  variant?: "button" | "fab" | "inline"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function WhatsAppButton({
  product,
  orderId,
  message,
  variant = "button",
  size = "md",
  className = "",
}: WhatsAppButtonProps) {
  const WHATSAPP_NUMBER = "263788663313" // +263 788 663 313 without spaces/symbols

  const generateMessage = (): string => {
    if (message) return message

    if (product) {
      return `Hi! I'm interested in:\n\n*${product.name}*\nPrice: $${product.price}\n\nCould you provide more details?`
    }

    if (orderId) {
      return `Hi! I need assistance with my order #${orderId}`
    }

    return "Hi! I'd like to inquire about your products."
  }

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(generateMessage())
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank", "noopener,noreferrer")
  }

  // Floating Action Button (FAB) variant
  if (variant === "fab") {
    return (
      <button
        onClick={handleWhatsAppClick}
        className={`fixed bottom-6 right-6 z-50 group ${className}`}
        aria-label="Chat on WhatsApp"
      >
        <div className="relative">
          {/* Pulse animation */}
          <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
          
          {/* Button */}
          <div className="relative flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full shadow-2xl transition-all duration-300 group-hover:shadow-green-500/50 group-hover:scale-110">
            <MessageCircle className="h-6 w-6" />
            <span className="font-medium whitespace-nowrap max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300">
              Chat with us
            </span>
          </div>
        </div>
      </button>
    )
  }

  // Inline variant
  if (variant === "inline") {
    return (
      <button
        onClick={handleWhatsAppClick}
        className={`flex items-center gap-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors ${className}`}
      >
        <MessageCircle className="h-4 w-4" />
        <span className="text-sm font-medium">WhatsApp us</span>
      </button>
    )
  }

  // Button variant
  const sizeClasses = {
    sm: "text-sm px-3 py-2",
    md: "text-base px-4 py-2.5",
    lg: "text-lg px-6 py-3",
  }

  return (
    <Button
      onClick={handleWhatsAppClick}
      className={`bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-green-500/50 transition-all ${sizeClasses[size]} ${className}`}
    >
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        <span className="font-medium">WhatsApp Inquiry</span>
      </div>
    </Button>
  )
}

// Product inquiry section
interface ProductInquiryProps {
  product: Product
}

export function ProductInquiry({ product }: ProductInquiryProps) {
  return (
    <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-2xl border border-green-200 dark:border-green-800">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-green-500 rounded-xl">
          <MessageCircle className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-1">Have Questions?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Chat with our team on WhatsApp for instant product information, pricing, and availability.
          </p>
          <div className="flex flex-wrap gap-3">
            <WhatsAppButton product={product} variant="button" size="md" />
            <a
              href="tel:+263788663313"
              className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span className="text-sm font-medium">Call Us</span>
            </a>
          </div>
        </div>
      </div>

      {/* Quick Info */}
      <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-800 grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-muted-foreground mb-1">Response Time</div>
          <div className="font-semibold text-green-600 dark:text-green-400">Within 5 minutes</div>
        </div>
        <div>
          <div className="text-muted-foreground mb-1">Available</div>
          <div className="font-semibold">Mon-Sat, 8AM-6PM</div>
        </div>
      </div>
    </div>
  )
}

// WhatsApp FAB that appears on all pages
export function WhatsAppFAB() {
  return <WhatsAppButton variant="fab" />
}
