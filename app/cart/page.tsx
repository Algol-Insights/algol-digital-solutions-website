"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui-lib"
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ArrowRight, Package } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"
import { ErrorBoundary } from "@/components/error-boundary"
import { useToast } from "@/components/toast"

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore()
  const toast = useToast()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-6 flex items-center justify-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven&apos;t added any items to your cart yet. 
              Start shopping to fill it up!
            </p>
            <Link href="/products">
              <Button className="bg-violet-600 hover:bg-violet-700">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const subtotal = getTotal()
  const shipping = null // Will be determined at checkout based on location
  const total = subtotal // Delivery added at checkout

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-700 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold">Shopping Cart</h1>
          <p className="text-white/80">{items.length} items in your cart</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Cart Items</h2>
              <button
                onClick={clearCart}
                className="text-sm text-red-600 hover:underline flex items-center"
              >
                <Trash2 className="mr-1 h-4 w-4" />
                Clear Cart
              </button>
            </div>

            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 rounded-xl border border-border bg-card"
              >
                {/* Product Image */}
                <div className="relative w-24 h-24 bg-muted/50 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">{item.brand}</p>
                      <h3 className="font-semibold line-clamp-2">{item.name}</h3>
                    </div>
                    <button
                      onClick={() => {
                        removeItem(item.id)
                        toast.success('Item removed from cart')
                      }}
                      className="p-2 text-muted-foreground hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-end justify-between mt-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-border rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="p-2 hover:bg-muted transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-10 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-muted transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-lg font-bold">
                        ${(item.price * item.quantity).toLocaleString()}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-sm text-muted-foreground">
                          ${item.price.toLocaleString()} each
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue Shopping */}
            <Link
              href="/products"
              className="inline-flex items-center text-violet-600 hover:underline mt-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 p-6 rounded-xl border border-border bg-card">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="font-medium text-muted-foreground">
                    ---
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Free in Harare, $10-15 other areas (calculated at checkout)
                </p>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-xl">${total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Link href="/checkout">
                <Button className="w-full bg-violet-600 hover:bg-violet-700" size="lg">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              {/* Payment Methods */}
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground text-center mb-3">
                  We Accept
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <div className="px-3 py-1 rounded bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 text-xs font-medium">
                    EcoCash
                  </div>
                  <div className="px-3 py-1 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-medium">
                    InnBucks
                  </div>
                  <div className="px-3 py-1 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-medium">
                    Bank Transfer
                  </div>
                  <div className="px-3 py-1 rounded bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 text-xs font-medium">
                    Cash on Delivery
                  </div>
                  <div className="px-3 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium">
                    Other
                  </div>
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-4 flex items-center justify-center gap-2 text-muted-foreground">
                <Package className="h-4 w-4" />
                <span className="text-xs">Secure checkout • Nationwide delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
