"use client"

import { useState, useEffect } from "react"
import { useParams, notFound } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui-lib"
import { 
  ShoppingCart, 
  Check, 
  ArrowLeft, 
  Minus, 
  Plus, 
  Truck, 
  Shield, 
  RefreshCw,
  Star,
  Package,
  X
} from "lucide-react"
import { useCartStore, type Product, type ProductVariant } from "@/lib/cart-store"
import { ProductCard } from "@/components/product-card"
import { ProductImageGalleryEnhanced } from "@/components/product-image-gallery-enhanced"
import { VariantSelector } from "@/components/variant-selector"
import { ReviewsDisplay } from "@/components/reviews-display"
import { ReviewForm } from "@/components/review-form"
import { StockAlertButton } from "@/components/stock-alert-button"
import { WishlistButton } from "@/components/wishlist-button"
import { motion, AnimatePresence } from "framer-motion"

export default function ProductDetailPage() {
  const params = useParams()
  const { data: session } = useSession()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined)
  const [added, setAdded] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const addItem = useCartStore((state) => state.addItem)
  const cartItems = useCartStore((state) => state.items)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/products/${params.id}`)
        if (!response.ok) {
          notFound()
          return
        }
        const data = await response.json()
        setProduct(data)
        
        // Set first variant as default if variants exist
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0])
        }

        // Fetch related products from the same category
        const categoryId = typeof data.category === 'string' ? data.category : data.category?.id
        const categoryParam = categoryId ? `&categoryId=${categoryId}` : ''
        const relatedResponse = await fetch(`/api/products?limit=8${categoryParam}`)
        const relatedData = await relatedResponse.json()
        setRelatedProducts((relatedData.data || relatedData).filter((p: Product) => p.id !== params.id).slice(0, 4))
      } catch (error) {
        console.error('Error fetching product:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-teal-medium mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    notFound()
  }

  const handleAddToCart = () => {
    const productToAdd = selectedVariant 
      ? { ...product, variantId: selectedVariant.id, price: selectedVariant.price }
      : product
    for (let i = 0; i < quantity; i++) {
      addItem(productToAdd)
    }
    setAdded(true)
    setShowToast(true)
    setTimeout(() => setAdded(false), 3000)
    setTimeout(() => setShowToast(false), 5000)
  }

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant)
  }

  // Get current price based on variant selection
  const currentPrice = selectedVariant ? selectedVariant.price : product.price
  const currentOriginalPrice = selectedVariant?.originalPrice || product.originalPrice
  const currentStock = selectedVariant ? selectedVariant.stock : (product.stock || 0)
  const isInStock = selectedVariant ? selectedVariant.inStock : product.inStock

  const discount = currentOriginalPrice
    ? Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)
    : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/products" className="text-muted-foreground hover:text-violet-600">
              Products
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link href={`/products?category=${typeof product.category === 'string' ? product.category : (product.category as any)?.slug || product.category}`} className="text-muted-foreground hover:text-violet-600">
              {typeof product.category === 'string' ? product.category : (product.category as any)?.name || product.category}
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium truncate">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Link
          href="/products"
          className="inline-flex items-center text-violet-600 hover:underline mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image Gallery */}
          <ProductImageGalleryEnhanced
            images={product.images && product.images.length > 0 ? product.images : [product.image]}
            productName={product.name}
          />

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{product.brand}</p>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Math.round(product.rating || 0)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">
                    ({product.reviewCount || 0} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold">${currentPrice.toLocaleString()}</span>
              {currentOriginalPrice && currentOriginalPrice > currentPrice && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    ${currentOriginalPrice.toLocaleString()}
                  </span>
                  <span className="text-sm font-semibold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
                    Save {discount}%
                  </span>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {isInStock ? (
                <>
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-green-600 font-medium">
                    In Stock ({currentStock} available)
                  </span>
                </>
              ) : (
                <>
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                  <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="border-t border-b border-border py-6">
                <VariantSelector
                  variants={product.variants}
                  selectedVariant={selectedVariant}
                  onVariantChange={handleVariantChange}
                />
              </div>
            )}

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border border-border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-muted transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-muted transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock || added}
                className={`flex-1 ${added ? "bg-green-600 hover:bg-green-600" : "bg-violet-600 hover:bg-violet-700"}`}
                size="lg"
              >
                {added ? (
                  <>
                    <Check className="mr-2 h-5 w-5" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </>
                )}
              </Button>
              <WishlistButton
                productId={product.id}
                variantId={selectedVariant?.id}
                size="lg"
              />
              <Link href="/cart">
                <Button variant="outline" size="lg">
                  View Cart
                </Button>
              </Link>
            </div>

            {/* Stock Alert Button */}
            <StockAlertButton
              productId={product.id}
              variantId={selectedVariant?.id}
              productName={product.name}
              variantName={selectedVariant?.name}
              inStock={product.inStock ?? true}
              userEmail={session?.user?.email ?? undefined}
            />

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-950 text-violet-600">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-sm">Free Delivery in Harare</p>
                  <p className="text-xs text-muted-foreground">$10-15 other areas</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-950 text-violet-600">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-sm">Warranty</p>
                  <p className="text-xs text-muted-foreground">1 Year Manufacturer</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-950 text-violet-600">
                  <RefreshCw className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-sm">Easy Returns</p>
                  <p className="text-xs text-muted-foreground">14 Day Policy</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-950 text-violet-600">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-sm">Genuine Product</p>
                  <p className="text-xs text-muted-foreground">100% Authentic</p>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="pt-6 border-t border-border">
              <h3 className="font-bold mb-4">Specifications</h3>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Brand</span>
                  <span className="font-medium">{product.brand}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium">{typeof product.category === 'string' ? product.category : (product.category as any)?.name || product.category}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">SKU</span>
                  <span className="font-medium">{product.id.toUpperCase()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Availability</span>
                  <span className={`font-medium ${product.inStock ? "text-green-600" : "text-red-600"}`}>
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Customer Reviews</h2>
            <ReviewForm 
              productId={product.id} 
              productName={product.name}
              onSuccess={() => window.location.reload()}
            />
          </div>
          <ReviewsDisplay productId={product.id} />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="fixed bottom-6 right-6 z-50 max-w-md"
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl shadow-2xl p-6 flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg mb-1">Added to Cart!</h4>
                <p className="text-white/90 text-sm mb-3">
                  {quantity} × {product.name}
                </p>
                <div className="flex gap-2">
                  <Link href="/cart">
                    <Button 
                      size="sm" 
                      className="bg-white text-green-600 hover:bg-white/90 font-semibold"
                    >
                      View Cart ({cartItems.length})
                    </Button>
                  </Link>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={() => setShowToast(false)}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
              <button
                onClick={() => setShowToast(false)}
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
