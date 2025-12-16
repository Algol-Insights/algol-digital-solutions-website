"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui-lib"
import { Heart, ShoppingCart, Trash2, Share2, ArrowLeft, Loader2, Package } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"
import { useWishlistStore } from "@/lib/wishlist-store"

interface WishlistItem {
  id: string
  productId: string
  variantId?: string
  createdAt: string
  product: {
    id: string
    name: string
    price: number
    originalPrice?: number
    image: string
    images: string[]
    inStock: boolean
    stock: number
    brand: string
    category: {
      name: string
    }
  }
  variant?: {
    id: string
    name: string
    color?: string
    size?: string
    storage?: string
    price: number
    inStock: boolean
    image?: string
  }
}

export default function WishlistPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [removing, setRemoving] = useState<string | null>(null)
  const addItem = useCartStore((state) => state.addItem)
  const { setWishlistCount } = useWishlistStore()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/wishlist')
    } else if (status === 'authenticated') {
      fetchWishlist()
    }
  }, [status, router])

  const fetchWishlist = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/wishlist')
      if (!response.ok) throw new Error('Failed to fetch wishlist')
      const data = await response.json()
      setWishlistItems(data.items)
      setWishlistCount(data.items.length)
    } catch (error) {
      console.error('Error fetching wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (id: string) => {
    setRemoving(id)
    try {
      const response = await fetch(`/api/wishlist/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setWishlistItems(wishlistItems.filter(item => item.id !== id))
        setWishlistCount(wishlistItems.length - 1)
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
    } finally {
      setRemoving(null)
    }
  }

  const addToCart = (item: WishlistItem) => {
    const productToAdd = item.variant 
      ? { ...item.product, variantId: item.variant.id, price: item.variant.price } as any
      : item.product as any
    addItem(productToAdd)
  }

  const addAllToCart = () => {
    wishlistItems.forEach(item => {
      const isInStock = item.variant ? item.variant.inStock : item.product.inStock
      if (isInStock) {
        const productToAdd = item.variant 
          ? { ...item.product, variantId: item.variant.id, price: item.variant.price } as any
          : item.product as any
        addItem(productToAdd)
      }
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-teal-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    )
  }

  if (wishlistItems.length === 0) {
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
            <p className="text-muted-foreground">{wishlistItems.length} items saved</p>
          </div>
          <Button 
            size="sm" 
            className="bg-violet-600 hover:bg-violet-700"
            onClick={addAllToCart}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add All to Cart
          </Button>
        </div>

        <div className="grid gap-4">
          {wishlistItems.map((item) => {
            const displayPrice = item.variant?.price || item.product.price
            const displayOriginalPrice = item.variant ? item.product.originalPrice : item.product.originalPrice
            const displayImage = item.variant?.image || item.product.image || item.product.images[0]
            const isInStock = item.variant ? item.variant.inStock : item.product.inStock
            const discount = displayOriginalPrice && displayOriginalPrice > displayPrice
              ? Math.round(((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100)
              : null

            return (
              <div 
                key={item.id} 
                className="bg-card border border-border rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row gap-4"
              >
                {/* Product Image */}
                <Link href={`/products/${item.product.id}`} className="w-full sm:w-32 h-32 bg-muted rounded-lg overflow-hidden shrink-0">
                  {displayImage ? (
                    <img 
                      src={displayImage} 
                      alt={item.product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </Link>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <Link 
                        href={`/products/${item.product.id}`}
                        className="font-semibold hover:text-violet-600 line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      {item.variant && (
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {item.variant.color && `Color: ${item.variant.color}`}
                          {item.variant.size && ` • Size: ${item.variant.size}`}
                          {item.variant.storage && ` • Storage: ${item.variant.storage}`}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.product.brand} • {item.product.category.name}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-lg">${displayPrice.toLocaleString()}</p>
                      {discount && displayOriginalPrice && (
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-muted-foreground line-through">
                            ${displayOriginalPrice.toLocaleString()}
                          </p>
                          <span className="text-xs font-semibold text-red-600">
                            -{discount}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-4">
                    {isInStock ? (
                      <span className="text-sm font-medium text-green-600">✓ In Stock</span>
                    ) : (
                      <span className="text-sm font-medium text-red-600">Out of Stock</span>
                    )}
                    {item.variant && (
                      <span className="text-xs px-2 py-1 bg-muted rounded-full">
                        {item.variant.name}
                      </span>
                    )}
                    
                    <div className="flex gap-2 ml-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFromWishlist(item.id)}
                        disabled={removing === item.id}
                        className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                      >
                        {removing === item.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        className="bg-violet-600 hover:bg-violet-700"
                        onClick={() => addToCart(item)}
                        disabled={!isInStock}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
