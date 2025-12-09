"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Plus,
  Check,
  Star,
  ShoppingCart,
  TrendingUp,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface ComparisonProduct {
  id: number
  name: string
  category: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  image: string
  inStock: boolean
  specs: Record<string, string>
}

interface ProductComparisonProps {
  products: ComparisonProduct[]
  onRemove: (id: number) => void
  onAddMore: () => void
}

export function ProductComparison({ products, onRemove, onAddMore }: ProductComparisonProps) {
  const [highlightDifferences, setHighlightDifferences] = useState(false)

  // Get all unique spec keys from all products
  const allSpecKeys = Array.from(
    new Set(products.flatMap((product) => Object.keys(product.specs)))
  )

  // Check if a spec value is different across products
  const isDifferent = (specKey: string) => {
    const values = products.map((p) => p.specs[specKey] || "N/A")
    return new Set(values).size > 1
  }

  // Find best value for price (lowest)
  const bestPrice = Math.min(...products.map((p) => p.price))
  
  // Find best rating (highest)
  const bestRating = Math.max(...products.map((p) => p.rating))

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-teal-dark to-brand-teal-medium p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Compare Products</h2>
            <p className="text-white/80 text-sm mt-1">
              Side-by-side comparison of {products.length} product{products.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={highlightDifferences}
                onChange={(e) => setHighlightDifferences(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Highlight Differences</span>
            </label>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <tbody>
            {/* Product Images & Names Row */}
            <tr className="border-b border-gray-200">
              <td className="p-4 font-semibold text-gray-900 bg-gray-50 sticky left-0 z-10 min-w-[200px]">
                Product
              </td>
              {products.map((product) => (
                <td key={product.id} className="p-4 text-center min-w-[280px] relative">
                  <button
                    onClick={() => onRemove(product.id)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="space-y-3">
                    {/* Product Image */}
                    <div className="mx-auto w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="h-16 w-16 text-gray-300" />
                    </div>
                    {/* Product Name */}
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {product.name}
                    </h3>
                    <span className="text-xs text-brand-teal-medium font-semibold uppercase">
                      {product.category}
                    </span>
                  </div>
                </td>
              ))}
              {/* Add More Button */}
              {products.length < 4 && (
                <td className="p-4 text-center min-w-[280px]">
                  <button
                    onClick={onAddMore}
                    className="w-32 h-32 mx-auto border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-brand-teal-medium hover:bg-brand-teal-medium/5 transition-colors group"
                  >
                    <Plus className="h-8 w-8 text-gray-400 group-hover:text-brand-teal-medium" />
                    <span className="text-sm font-semibold text-gray-600 group-hover:text-brand-teal-medium">
                      Add Product
                    </span>
                  </button>
                </td>
              )}
            </tr>

            {/* Price Row */}
            <tr className="border-b border-gray-200 bg-gray-50/50">
              <td className="p-4 font-semibold text-gray-900 bg-gray-50 sticky left-0 z-10">
                Price
              </td>
              {products.map((product) => (
                <td key={product.id} className="p-4 text-center">
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-2xl font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.price === bestPrice && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">
                          Best Price
                        </span>
                      )}
                    </div>
                    {product.originalPrice && (
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-sm text-gray-500 line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                        <span className="text-xs text-red-600 font-semibold">
                          Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                        </span>
                      </div>
                    )}
                  </div>
                </td>
              ))}
              {products.length < 4 && <td className="p-4" />}
            </tr>

            {/* Rating Row */}
            <tr className="border-b border-gray-200">
              <td className="p-4 font-semibold text-gray-900 bg-gray-50 sticky left-0 z-10">
                Rating
              </td>
              {products.map((product) => (
                <td key={product.id} className="p-4 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{product.rating}</span>
                      <span className="text-sm text-gray-500">
                        ({product.reviews} reviews)
                      </span>
                      {product.rating === bestRating && (
                        <Check className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  </div>
                </td>
              ))}
              {products.length < 4 && <td className="p-4" />}
            </tr>

            {/* Stock Status Row */}
            <tr className="border-b border-gray-200 bg-gray-50/50">
              <td className="p-4 font-semibold text-gray-900 bg-gray-50 sticky left-0 z-10">
                Availability
              </td>
              {products.map((product) => (
                <td key={product.id} className="p-4 text-center">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                      product.inStock
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.inStock ? (
                      <>
                        <Check className="h-4 w-4" />
                        In Stock
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4" />
                        Out of Stock
                      </>
                    )}
                  </span>
                </td>
              ))}
              {products.length < 4 && <td className="p-4" />}
            </tr>

            {/* Specifications Rows */}
            {allSpecKeys.map((specKey, index) => {
              const different = isDifferent(specKey)
              const shouldHighlight = highlightDifferences && different

              return (
                <tr
                  key={specKey}
                  className={`border-b border-gray-200 ${
                    index % 2 === 0 ? "" : "bg-gray-50/50"
                  } ${shouldHighlight ? "bg-yellow-50/50" : ""}`}
                >
                  <td className="p-4 font-semibold text-gray-900 bg-gray-50 sticky left-0 z-10">
                    <div className="flex items-center gap-2">
                      {specKey}
                      {shouldHighlight && (
                        <span className="w-2 h-2 bg-yellow-500 rounded-full" />
                      )}
                    </div>
                  </td>
                  {products.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <span className="text-gray-700">
                        {product.specs[specKey] || (
                          <span className="text-gray-400 italic">N/A</span>
                        )}
                      </span>
                    </td>
                  ))}
                  {products.length < 4 && <td className="p-4" />}
                </tr>
              )
            })}

            {/* Action Buttons Row */}
            <tr className="bg-gray-50">
              <td className="p-4 font-semibold text-gray-900 sticky left-0 z-10">
                Actions
              </td>
              {products.map((product) => (
                <td key={product.id} className="p-4">
                  <div className="flex flex-col gap-2">
                    <Button
                      className="w-full bg-brand-teal-dark hover:bg-brand-teal-medium text-white font-semibold"
                      disabled={!product.inStock}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      {product.inStock ? "Add to Cart" : "Out of Stock"}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-brand-teal-dark text-brand-teal-dark hover:bg-brand-teal-dark hover:text-white"
                    >
                      View Details
                    </Button>
                  </div>
                </td>
              ))}
              {products.length < 4 && <td className="p-4" />}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Legend */}
      {highlightDifferences && (
        <div className="p-4 bg-yellow-50 border-t border-yellow-200">
          <div className="flex items-center gap-2 text-sm text-yellow-800">
            <span className="w-3 h-3 bg-yellow-500 rounded-full" />
            <span className="font-semibold">Highlighted rows show different values across products</span>
          </div>
        </div>
      )}
    </div>
  )
}

// Example usage component
export function ComparisonExample() {
  const [comparisonProducts, setComparisonProducts] = useState<ComparisonProduct[]>([
    {
      id: 1,
      name: "Advanced Security Camera System Pro",
      category: "Security",
      price: 299.99,
      originalPrice: 499.99,
      rating: 4.8,
      reviews: 234,
      image: "/camera.jpg",
      inStock: true,
      specs: {
        "Resolution": "4K Ultra HD",
        "Field of View": "120°",
        "Night Vision": "30m",
        "Storage": "Cloud + SD",
        "Connectivity": "Wi-Fi 6",
        "Warranty": "2 Years"
      }
    },
    {
      id: 2,
      name: "Smart Security Camera Basic",
      category: "Security",
      price: 149.99,
      originalPrice: 199.99,
      rating: 4.5,
      reviews: 189,
      image: "/camera2.jpg",
      inStock: true,
      specs: {
        "Resolution": "1080p Full HD",
        "Field of View": "90°",
        "Night Vision": "20m",
        "Storage": "SD Card Only",
        "Connectivity": "Wi-Fi 5",
        "Warranty": "1 Year"
      }
    },
    {
      id: 3,
      name: "Professional CCTV System",
      category: "Security",
      price: 599.99,
      rating: 4.9,
      reviews: 412,
      image: "/camera3.jpg",
      inStock: false,
      specs: {
        "Resolution": "4K Ultra HD",
        "Field of View": "180°",
        "Night Vision": "50m",
        "Storage": "NVR + Cloud",
        "Connectivity": "PoE + Wi-Fi 6",
        "Warranty": "3 Years"
      }
    }
  ])

  const handleRemove = (id: number) => {
    setComparisonProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const handleAddMore = () => {
    alert("Add more products functionality")
  }

  return (
    <div className="p-8">
      <ProductComparison
        products={comparisonProducts}
        onRemove={handleRemove}
        onAddMore={handleAddMore}
      />
    </div>
  )
}
