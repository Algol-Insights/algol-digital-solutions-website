"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  ShoppingCart,
  Heart,
  Star,
  Plus,
  Minus,
  Share2,
  TrendingUp,
  Shield,
  Truck,
  RotateCcw,
  Check
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface Product {
  id: number
  name: string
  category: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  stock: number
  image: string
  images?: string[]
  description: string
  features: string[]
  specs: { label: string; value: string }[]
  inStock: boolean
}

interface QuickViewProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

export function ProductQuickView({ product, isOpen, onClose }: QuickViewProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="grid md:grid-cols-2 gap-8 p-8 overflow-y-auto max-h-[90vh]">
                {/* Left: Product Images */}
                <div className="space-y-4">
                  {/* Main Image */}
                  <div className="relative bg-gray-100 rounded-xl overflow-hidden aspect-square">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ShoppingCart className="h-32 w-32 text-gray-300" />
                    </div>
                    {discount > 0 && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        -{discount}%
                      </div>
                    )}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-white px-6 py-3 rounded-lg font-bold text-gray-900">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Gallery */}
                  {product.images && product.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {product.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`bg-gray-100 rounded-lg aspect-square border-2 transition-all ${
                            selectedImage === index
                              ? "border-brand-teal-medium"
                              : "border-transparent hover:border-gray-300"
                          }`}
                        >
                          <div className="h-full flex items-center justify-center">
                            <ShoppingCart className="h-8 w-8 text-gray-300" />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Trust Badges */}
                  <div className="grid grid-cols-3 gap-3 pt-4">
                    <div className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Truck className="h-6 w-6 text-brand-teal-medium" />
                      <span className="text-xs font-semibold text-center">Free Delivery</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <RotateCcw className="h-6 w-6 text-brand-teal-medium" />
                      <span className="text-xs font-semibold text-center">30-Day Returns</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Shield className="h-6 w-6 text-brand-teal-medium" />
                      <span className="text-xs font-semibold text-center">2-Year Warranty</span>
                    </div>
                  </div>
                </div>

                {/* Right: Product Info */}
                <div className="space-y-6">
                  {/* Category & Brand */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-brand-teal-medium uppercase">
                      {product.category}
                    </span>
                    <button
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Product Name */}
                  <h2 className="text-3xl font-bold text-gray-900">
                    {product.name}
                  </h2>

                  {/* Rating & Reviews */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(product.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold">{product.rating}</span>
                    <span className="text-sm text-gray-500">
                      ({product.reviews} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-gray-900">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xl text-gray-500 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                    {discount > 0 && (
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm font-bold">
                        Save {discount}%
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="flex items-center gap-2">
                    {product.inStock ? (
                      <>
                        <Check className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-semibold text-green-600">
                          In Stock ({product.stock} available)
                        </span>
                      </>
                    ) : (
                      <span className="text-sm font-semibold text-red-600">
                        Currently Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-gray-600 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Key Features */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900">Key Features:</h3>
                    <ul className="space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-brand-teal-medium flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Specifications */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900">Specifications:</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      {product.specs.map((spec, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600">{spec.label}:</span>
                          <span className="font-semibold text-gray-900">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quantity & Add to Cart */}
                  {product.inStock && (
                    <div className="space-y-3 border-t border-gray-200 pt-4">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold">Quantity:</span>
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="p-2 hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 font-semibold">{quantity}</span>
                          <button
                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                            className="p-2 hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          className="flex-1 bg-brand-teal-dark hover:bg-brand-teal-medium text-white font-semibold"
                          size="lg"
                        >
                          <ShoppingCart className="mr-2 h-5 w-5" />
                          Add to Cart
                        </Button>
                        <Button
                          variant="outline"
                          size="lg"
                          className="border-2 border-brand-teal-dark text-brand-teal-dark hover:bg-brand-teal-dark hover:text-white"
                        >
                          <Share2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Example usage component
export function QuickViewExample() {
  const [isOpen, setIsOpen] = useState(false)

  const exampleProduct: Product = {
    id: 1,
    name: "Advanced Security Camera System Pro",
    category: "Security Systems",
    price: 299.99,
    originalPrice: 499.99,
    rating: 4.8,
    reviews: 234,
    stock: 24,
    image: "/products/camera.jpg",
    images: ["/1.jpg", "/2.jpg", "/3.jpg", "/4.jpg"],
    description: "Professional-grade security camera system with AI-powered motion detection, night vision, and cloud storage. Perfect for home and business security.",
    features: [
      "4K Ultra HD Resolution",
      "AI-Powered Motion Detection",
      "Night Vision up to 30m",
      "Two-Way Audio Communication",
      "Weather-Resistant IP66 Rating",
      "Cloud & Local Storage Options"
    ],
    specs: [
      { label: "Resolution", value: "3840 x 2160 (4K)" },
      { label: "Field of View", value: "120° Wide Angle" },
      { label: "Night Vision", value: "30m Infrared" },
      { label: "Storage", value: "Cloud + MicroSD" },
      { label: "Connectivity", value: "Wi-Fi 6 / Ethernet" },
      { label: "Warranty", value: "2 Years" }
    ],
    inStock: true
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Quick View Demo
      </Button>
      <ProductQuickView
        product={exampleProduct}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}
