"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui-lib"
import { Heart, ShoppingCart, Trash2, Share2, ArrowLeft } from "lucide-react"
import { products } from "@/lib/products"
import { useCartStore } from "@/lib/cart-store"

// Mock wishlist - in real app this would be stored in state/database
const mockWishlistIds = ["laptop-001", "laptop-003", "monitor-001", "accessory-003"]

export default function WishlistPage() {
  const [wishlistIds, setWishlistIds] = useState(mockWishlistIds)
  const addItem = useCartStore((state) => state.addItem)
  
  const wishlistProducts = products.filter(p => wishlistIds.includes(p.id))

  const removeFromWishlist = (id: string) => {
    setWishlistIds(wishlistIds.filter(wId => wId !== id))
  }

  const addToCart = (product: typeof products[0]) => {
    addItem(product)
  }

  const addAllToCart = () => {
    wishlistProducts.forEach(product => {
      if (product.inStock) {
        addItem(product)
      }
    })
  }

  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <Heart className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Your Wishlist is Empty</h1>
          <p className="text-muted-foreground mb-8">
            Save items you love by clicking the heart icon on any product.
          </p>
          <Link href="/products">
            <Button className="bg-violet-600 hover:bg-violet-700">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <Link 
          href="/products" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">My Wishlist</h1>
            <p className="text-muted-foreground">{wishlistProducts.length} items saved</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share List
            </Button>
            <Button 
              size="sm" 
              className="bg-violet-600 hover:bg-violet-700"
              onClick={addAllToCart}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add All to Cart
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          {wishlistProducts.map((product) => (
            <div 
              key={product.id} 
              className="bg-card border border-border rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row gap-4"
            >
              {/* Product Image */}
              <div className="w-full sm:w-32 h-32 bg-muted rounded-lg flex items-center justify-center shrink-0">
                <Heart className="h-8 w-8 text-muted-foreground" />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <Link 
                      href={`/products/${product.id}`}
                      className="font-semibold hover:text-violet-600 line-clamp-1"
                    >
                      {product.name}
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1">{product.brand} • {product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">${product.price}</p>
                    {product.originalPrice && (
                      <p className="text-sm text-muted-foreground line-through">${product.originalPrice}</p>
                    )}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{product.description}</p>

                <div className="flex flex-wrap items-center gap-3 mt-4">
                  {product.inStock ? (
                    <span className="text-sm text-green-600">In Stock</span>
                  ) : (
                    <span className="text-sm text-red-600">Out of Stock</span>
                  )}
                  
                  <div className="flex gap-2 ml-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFromWishlist(product.id)}
                      className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      className="bg-violet-600 hover:bg-violet-700"
                      onClick={() => addToCart(product)}
                      disabled={!product.inStock}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recommendations */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6">You May Also Like</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products
              .filter(p => !wishlistIds.includes(p.id) && p.featured)
              .slice(0, 4)
              .map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="bg-card border border-border rounded-xl p-4 hover:border-violet-500/50 transition-colors group"
                >
                  <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center">
                    <Heart className="h-8 w-8 text-muted-foreground group-hover:text-violet-600 transition-colors" />
                  </div>
                  <p className="font-medium line-clamp-1">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.brand}</p>
                  <p className="font-bold mt-1">${product.price}</p>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
