"use client"

import * as React from "react"
import { RotateCcw, ShoppingCart, Check } from "lucide-react"
import { Button } from "@/components/ui-lib"
import { useCartStore, type Product } from "@/lib/cart-store"
import { motion, AnimatePresence } from "framer-motion"

interface OneClickReorderProps {
  orderId: string
  orderItems: Array<{
    product: Product
    quantity: number
  }>
  className?: string
}

export function OneClickReorder({ orderId, orderItems, className = "" }: OneClickReorderProps) {
  const { addItem } = useCartStore()
  const [isAdding, setIsAdding] = React.useState(false)
  const [showSuccess, setShowSuccess] = React.useState(false)

  const handleReorder = async () => {
    setIsAdding(true)

    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Add all items to cart
    orderItems.forEach(({ product, quantity }) => {
      for (let i = 0; i < quantity; i++) {
        addItem(product)
      }
    })

    setIsAdding(false)
    setShowSuccess(true)

    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false)
    }, 3000)
  }

  return (
    <div className={`relative ${className}`}>
      <Button
        onClick={handleReorder}
        disabled={isAdding || showSuccess}
        variant="outline"
        size="lg"
        className="group relative overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div
              key="success"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="flex items-center gap-2"
            >
              <Check className="h-5 w-5 text-green-600" />
              <span>Added to Cart!</span>
            </motion.div>
          ) : (
            <motion.div
              key="button"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <RotateCcw
                className={`h-5 w-5 ${isAdding ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-300"}`}
              />
              <span>{isAdding ? "Adding..." : "Reorder"}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      {/* Success toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 left-0 right-0 p-3 bg-green-100 dark:bg-green-900/30 border border-green-500 rounded-lg text-sm text-green-700 dark:text-green-300 text-center whitespace-nowrap"
          >
            {orderItems.length} items added to your cart
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Reorder section in order history
interface ReorderSectionProps {
  orders: Array<{
    id: string
    date: string
    total: number
    status: string
    items: Array<{
      product: Product
      quantity: number
    }>
  }>
}

export function ReorderSection({ orders }: ReorderSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Quick Reorder</h3>
      <p className="text-sm text-muted-foreground">
        Reorder from your previous purchases with one click
      </p>

      <div className="grid gap-4">
        {orders.slice(0, 3).map((order) => (
          <div
            key={order.id}
            className="p-4 border border-border rounded-xl hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-semibold">Order #{order.id}</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(order.date).toLocaleDateString()} • {order.items.length} items
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg text-brand-teal-medium">
                  ${order.total.toFixed(2)}
                </div>
                <div
                  className={`text-xs px-2 py-1 rounded-full ${
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  }`}
                >
                  {order.status}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {order.items.slice(0, 3).map((item, index) => (
                  <div
                    key={index}
                    className="w-10 h-10 rounded-full border-2 border-background bg-muted overflow-hidden"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-medium">
                    +{order.items.length - 3}
                  </div>
                )}
              </div>

              <OneClickReorder orderId={order.id} orderItems={order.items} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Reorder button with item preview
interface ReorderButtonWithPreviewProps {
  orderId: string
  orderItems: Array<{
    product: Product
    quantity: number
  }>
}

export function ReorderButtonWithPreview({ orderId, orderItems }: ReorderButtonWithPreviewProps) {
  const [showPreview, setShowPreview] = React.useState(false)

  return (
    <div className="relative">
      <div
        onMouseEnter={() => setShowPreview(true)}
        onMouseLeave={() => setShowPreview(false)}
      >
        <OneClickReorder orderId={orderId} orderItems={orderItems} />
      </div>

      {/* Hover Preview */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full mb-2 right-0 w-80 p-4 bg-card border border-border rounded-xl shadow-2xl z-50"
          >
            <div className="text-sm font-semibold mb-3">
              This will add {orderItems.length} items to your cart:
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {orderItems.map(({ product, quantity }, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-medium">{product.name}</div>
                    <div className="text-xs text-muted-foreground">Qty: {quantity}</div>
                  </div>
                  <div className="font-semibold">${product.price.toFixed(2)}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-border flex items-center justify-between font-semibold">
              <span>Total:</span>
              <span className="text-brand-teal-medium">
                $
                {orderItems
                  .reduce((sum, { product, quantity }) => sum + product.price * quantity, 0)
                  .toFixed(2)}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
