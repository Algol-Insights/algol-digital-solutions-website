"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui-lib"
import { ShoppingCart, Check } from "lucide-react"
import type { Product } from "@/lib/cart-store"
import { useCartStore } from "@/lib/cart-store"
import * as React from "react"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [added, setAdded] = React.useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-violet-500/50 hover:shadow-lg">
        {/* Image */}
        <div className="relative aspect-square bg-muted/50 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {discount > 0 && (
            <span className="absolute top-2 left-2 px-2 py-1 rounded-md bg-red-500 text-white text-xs font-semibold">
              -{discount}%
            </span>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm font-medium">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
          <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-violet-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {product.description}
          </p>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-bold">${product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Add to Cart */}
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock || added}
            className={`w-full ${added ? "bg-green-600 hover:bg-green-600" : "bg-violet-600 hover:bg-violet-700"}`}
            size="sm"
          >
            {added ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Added!
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>
    </Link>
  )
}
