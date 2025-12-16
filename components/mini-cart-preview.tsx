"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useCartStore } from "@/lib/cart-store"
import { ShoppingBag, ArrowRight, X } from "lucide-react"
import { Button } from "@/components/ui-lib"

interface MiniCartPreviewProps {
  isOpen: boolean
  onClose: () => void
}

export function MiniCartPreview({ isOpen, onClose }: MiniCartPreviewProps) {
  const { items, removeItem, getTotal } = useCartStore()
  const total = getTotal()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />

          {/* Mini Cart Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20, y: -10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 20, y: -10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-20 right-4 w-96 max-h-[80vh] bg-card border border-border rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-brand-teal-medium/10 to-brand-golden/10">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-brand-teal-medium" />
                <h3 className="font-bold text-lg">Shopping Cart</h3>
                <span className="px-2 py-0.5 bg-brand-teal-medium text-white text-xs rounded-full">
                  {items.length}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="p-6 bg-muted rounded-full mb-4">
                    <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-medium mb-1">Your cart is empty</p>
                  <p className="text-sm text-muted-foreground">Add some products to get started!</p>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
                  >
                    {/* Product Image */}
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-2"
                        sizes="64px"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.id}`}
                        onClick={onClose}
                        className="font-medium text-sm hover:text-brand-teal-medium transition-colors line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
                        <span className="font-bold text-sm text-brand-teal-medium">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-all text-red-600"
                      title="Remove from cart"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border p-4 space-y-3 bg-gradient-to-b from-transparent to-muted/30">
                {/* Subtotal */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-bold text-xl text-brand-teal-medium">
                    ${total.toFixed(2)}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/cart" onClick={onClose}>
                    <Button variant="outline" className="w-full" size="lg">
                      View Cart
                    </Button>
                  </Link>
                  <Link href="/checkout" onClick={onClose}>
                    <Button
                      className="w-full bg-gradient-to-r from-brand-teal-medium to-brand-teal-dark hover:from-brand-teal-dark hover:to-brand-teal-medium"
                      size="lg"
                    >
                      <span className="flex items-center gap-2">
                        Checkout
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
