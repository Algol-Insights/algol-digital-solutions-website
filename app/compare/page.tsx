"use client"

import * as React from "react"
import { useComparisonStore } from "@/lib/comparison-store"
import Image from "next/image"
import Link from "next/link"
import { GitCompare, X, Check, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui-lib"
import { useCartStore } from "@/lib/cart-store"
import { motion } from "framer-motion"

export default function ComparePage() {
  const { products, removeProduct, clearAll } = useComparisonStore()
  const { addItem } = useCartStore()

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <div className="p-6 bg-muted rounded-full w-fit mx-auto mb-6">
            <GitCompare className="h-16 w-16 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-3">No Products to Compare</h1>
          <p className="text-muted-foreground mb-8">
            Add products from the catalog to compare them side-by-side
          </p>
          <Link href="/products">
            <Button size="lg" className="bg-gradient-to-r from-brand-teal-medium to-brand-teal-dark">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const specs: Array<{
    key: string
    label: string
    format?: (v: any) => string
  }> = [
    { key: "price", label: "Price", format: (v: number) => `$${v.toFixed(2)}` },
    { key: "originalPrice", label: "Original Price", format: (v: number | undefined) => v ? `$${v.toFixed(2)}` : "—" },
    { key: "brand", label: "Brand" },
    { key: "category", label: "Category" },
    { key: "stock", label: "Stock Available" },
    { key: "inStock", label: "Availability", format: (v: boolean) => v ? "In Stock" : "Out of Stock" },
    { key: "rating", label: "Rating", format: (v: number | undefined) => v ? `${v}/5 ⭐` : "—" },
  ]

  // Get best values
  const bestPrice = Math.min(...products.map((p) => p.price))

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-brand-teal-medium/10 to-brand-golden/10 rounded-xl">
            <GitCompare className="h-6 w-6 text-brand-teal-medium" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Product Comparison</h1>
            <p className="text-muted-foreground">Compare up to 4 products side-by-side</p>
          </div>
        </div>
        <Button onClick={clearAll} variant="outline">
          Clear All
        </Button>
      </div>

      {/* Comparison Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="p-4 text-left font-semibold min-w-[200px] sticky left-0 bg-muted/30 z-10">
                  Specification
                </th>
                {products.map((product) => (
                  <th key={product.id} className="p-4 text-center min-w-[280px]">
                    <div className="space-y-4">
                      {/* Remove Button */}
                      <div className="flex justify-end">
                        <button
                          onClick={() => removeProduct(product.id)}
                          className="p-1.5 hover:bg-muted rounded-full transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Product Image */}
                      <Link href={`/products/${product.id}`}>
                        <div className="relative aspect-square bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-contain p-6"
                            sizes="280px"
                          />
                        </div>
                      </Link>

                      {/* Product Info */}
                      <div className="space-y-2">
                        <Link
                          href={`/products/${product.id}`}
                          className="font-semibold hover:text-brand-teal-medium transition-colors line-clamp-2 text-sm"
                        >
                          {product.name}
                        </Link>
                        <div className="text-2xl font-bold text-brand-teal-medium">
                          ${product.price.toFixed(2)}
                        </div>
                        {product.originalPrice && (
                          <div className="text-sm text-muted-foreground line-through">
                            ${product.originalPrice.toFixed(2)}
                          </div>
                        )}
                      </div>

                      {/* Add to Cart Button */}
                      <Button
                        onClick={() => addItem(product)}
                        disabled={!product.inStock}
                        className="w-full bg-gradient-to-r from-brand-teal-medium to-brand-teal-dark hover:from-brand-teal-dark hover:to-brand-teal-medium"
                        size="lg"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {specs.map((spec, index) => {
                const values = products.map((p) => {
                  const value: any = p[spec.key as keyof typeof p]
                  return spec.format ? spec.format(value) : value
                })
                const allSame = new Set(values).size === 1

                return (
                  <motion.tr
                    key={spec.key}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`border-b border-border ${index % 2 === 0 ? "bg-muted/20" : ""}`}
                  >
                    <td className="p-4 font-medium sticky left-0 bg-card z-10">
                      {spec.label}
                    </td>
                    {products.map((product) => {
                      const rawValue: any = product[spec.key as keyof typeof product]
                      const value = spec.format ? spec.format(rawValue) : rawValue

                      // Highlight best price
                      const isBestPrice = spec.key === "price" && product.price === bestPrice
                      
                      // Highlight differences
                      const isDifferent = !allSame

                      return (
                        <td
                          key={product.id}
                          className={`p-4 text-center ${
                            isBestPrice
                              ? "bg-green-100 dark:bg-green-900/30 font-bold text-green-700 dark:text-green-300"
                              : isDifferent
                              ? "font-medium"
                              : ""
                          }`}
                        >
                          <div className="flex items-center justify-center gap-2">
                            {spec.key === "inStock" && rawValue ? (
                              <Check className="h-5 w-5 text-green-500" />
                            ) : spec.key === "inStock" && !rawValue ? (
                              <X className="h-5 w-5 text-red-500" />
                            ) : null}
                            <span>{value?.toString() || "—"}</span>
                          </div>
                        </td>
                      )
                    })}
                  </motion.tr>
                )
              })}

              {/* Specifications from product specs object */}
              {products[0]?.specs && Object.keys(products[0].specs).length > 0 && (
                <>
                  <tr className="border-b border-border bg-muted/50">
                    <td colSpan={products.length + 1} className="p-4 font-bold text-center">
                      Technical Specifications
                    </td>
                  </tr>
                  {Object.keys(products[0].specs).map((specKey, index) => (
                    <tr
                      key={specKey}
                      className={`border-b border-border ${index % 2 === 0 ? "bg-muted/20" : ""}`}
                    >
                      <td className="p-4 font-medium sticky left-0 bg-card z-10 capitalize">
                        {specKey.replace(/([A-Z])/g, " $1").trim()}
                      </td>
                      {products.map((product) => (
                        <td key={product.id} className="p-4 text-center">
                          {product.specs?.[specKey] || "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add More Products */}
      {products.length < 4 && (
        <div className="mt-8 p-6 border-2 border-dashed border-border rounded-xl text-center">
          <p className="text-muted-foreground mb-4">
            Add up to {4 - products.length} more {products.length === 3 ? "product" : "products"} to compare
          </p>
          <Link href="/products">
            <Button variant="outline" size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Browse Products
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
