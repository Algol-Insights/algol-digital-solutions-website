"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useComparisonStore } from "@/lib/comparison-store"
import { GitCompare, X, Plus } from "lucide-react"
import { Button } from "@/components/ui-lib"

export function ComparisonBar() {
  const { products, removeProduct, clearAll } = useComparisonStore()

  if (products.length === 0) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border shadow-2xl"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <GitCompare className="h-5 w-5 text-brand-teal-medium" />
                <span className="font-semibold">Compare Products ({products.length}/4)</span>
              </div>

              {/* Product thumbnails */}
              <div className="hidden md:flex gap-2">
                {products.map((product) => (
                  <div key={product.id} className="relative group">
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-border bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="object-contain p-1"
                      />
                    </div>
                    <button
                      onClick={() => removeProduct(product.id)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {Array.from({ length: 4 - products.length }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="w-12 h-12 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center"
                  >
                    <Plus className="h-5 w-5 text-muted-foreground/30" />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={clearAll}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear All
              </button>
              <Link href="/compare">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-brand-teal-medium to-brand-teal-dark hover:from-brand-teal-dark hover:to-brand-teal-medium"
                >
                  Compare Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// Compare button for product cards
interface CompareButtonProps {
  product: any
  className?: string
}

export function CompareButton({ product, className = "" }: CompareButtonProps) {
  const { addProduct, removeProduct, isInComparison, products } = useComparisonStore()
  const isComparing = isInComparison(product.id)
  const canAdd = products.length < 4

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isComparing) {
      removeProduct(product.id)
    } else if (canAdd) {
      addProduct(product)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={!isComparing && !canAdd}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-sm ${
        isComparing
          ? "bg-brand-teal-medium text-white border-brand-teal-medium"
          : "border-border hover:bg-muted"
      } ${!isComparing && !canAdd ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      <GitCompare className="h-4 w-4" />
      <span>{isComparing ? "Comparing" : "Compare"}</span>
    </button>
  )
}
