"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui-lib"
import { X, Filter, ChevronDown, ChevronUp, Star } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Category {
  id: string
  name: string
  slug: string
}

interface ProductFiltersProps {
  categories: Category[]
  brands: string[]
  minPriceRange: number
  maxPriceRange: number
}

export function ProductFilters({
  categories,
  brands,
  minPriceRange,
  maxPriceRange,
}: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Filter state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([minPriceRange, maxPriceRange])
  const [minRating, setMinRating] = useState(0)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [isOpen, setIsOpen] = useState(true)

  // Section toggles
  const [openSections, setOpenSections] = useState({
    categories: true,
    brands: true,
    price: true,
    rating: true,
    stock: true,
  })

  // Initialize from URL params
  useEffect(() => {
    const category = searchParams.get("category")
    const brandsParam = searchParams.get("brands")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const rating = searchParams.get("minRating")
    const stock = searchParams.get("inStock")

    if (category) setSelectedCategories([category])
    if (brandsParam) setSelectedBrands(brandsParam.split(","))
    if (minPrice) setPriceRange((prev) => [parseFloat(minPrice), prev[1]])
    if (maxPrice) setPriceRange((prev) => [prev[0], parseFloat(maxPrice)])
    if (rating) setMinRating(parseFloat(rating))
    if (stock) setInStockOnly(stock === "true")
  }, [searchParams])

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const handleCategoryToggle = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    )
  }

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    )
  }

  const handleRatingClick = (rating: number) => {
    setMinRating(rating === minRating ? 0 : rating)
  }

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (selectedCategories.length === 1) {
      params.set("category", selectedCategories[0])
    }
    if (selectedBrands.length > 0) {
      params.set("brands", selectedBrands.join(","))
    }
    if (priceRange[0] > minPriceRange) {
      params.set("minPrice", priceRange[0].toString())
    }
    if (priceRange[1] < maxPriceRange) {
      params.set("maxPrice", priceRange[1].toString())
    }
    if (minRating > 0) {
      params.set("minRating", minRating.toString())
    }
    if (inStockOnly) {
      params.set("inStock", "true")
    }

    router.push(`/products?${params.toString()}`)
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setPriceRange([minPriceRange, maxPriceRange])
    setMinRating(0)
    setInStockOnly(false)
    router.push("/products")
  }

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    priceRange[0] > minPriceRange ||
    priceRange[1] < maxPriceRange ||
    minRating > 0 ||
    inStockOnly

  return (
    <div className="bg-card rounded-xl border border-border p-6 sticky top-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-brand-teal-medium" />
          <h2 className="font-bold text-lg">Filters</h2>
          {hasActiveFilters && (
            <span className="px-2 py-1 rounded-full bg-brand-teal-medium/10 text-brand-teal-medium text-xs font-medium">
              {[
                selectedCategories.length,
                selectedBrands.length,
                priceRange[0] > minPriceRange || priceRange[1] < maxPriceRange ? 1 : 0,
                minRating > 0 ? 1 : 0,
                inStockOnly ? 1 : 0,
              ].reduce((a, b) => a + b, 0)}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden"
        >
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-6"
          >
            {/* Categories */}
            <div className="border-b border-border pb-6">
              <button
                onClick={() => toggleSection("categories")}
                className="flex items-center justify-between w-full mb-3"
              >
                <h3 className="font-semibold">Categories</h3>
                {openSections.categories ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {openSections.categories && (
                <div className="space-y-2">
                  {(categories || []).map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.slug)}
                        onChange={() => handleCategoryToggle(category.slug)}
                        className="w-4 h-4 rounded border-border text-brand-teal-medium focus:ring-brand-teal-medium"
                      />
                      <span className="text-sm">{category.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Brands */}
            <div className="border-b border-border pb-6">
              <button
                onClick={() => toggleSection("brands")}
                className="flex items-center justify-between w-full mb-3"
              >
                <h3 className="font-semibold">Brands</h3>
                {openSections.brands ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {openSections.brands && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {(brands || []).map((brand) => (
                    <label
                      key={brand}
                      className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandToggle(brand)}
                        className="w-4 h-4 rounded border-border text-brand-teal-medium focus:ring-brand-teal-medium"
                      />
                      <span className="text-sm">{brand}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Price Range */}
            <div className="border-b border-border pb-6">
              <button
                onClick={() => toggleSection("price")}
                className="flex items-center justify-between w-full mb-3"
              >
                <h3 className="font-semibold">Price Range</h3>
                {openSections.price ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {openSections.price && (
                <div className="space-y-4">
                  <div className="px-2">
                    <input
                      type="range"
                      min={minPriceRange}
                      max={maxPriceRange}
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([parseFloat(e.target.value), priceRange[1]])
                      }
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-brand-teal-medium"
                    />
                    <input
                      type="range"
                      min={minPriceRange}
                      max={maxPriceRange}
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseFloat(e.target.value)])
                      }
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-brand-teal-medium mt-2"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 p-2 bg-muted rounded-lg text-center">
                      <span className="text-sm font-medium">
                        ${priceRange[0].toLocaleString()}
                      </span>
                    </div>
                    <span className="text-muted-foreground">-</span>
                    <div className="flex-1 p-2 bg-muted rounded-lg text-center">
                      <span className="text-sm font-medium">
                        ${priceRange[1].toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Rating */}
            <div className="border-b border-border pb-6">
              <button
                onClick={() => toggleSection("rating")}
                className="flex items-center justify-between w-full mb-3"
              >
                <h3 className="font-semibold">Minimum Rating</h3>
                {openSections.rating ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {openSections.rating && (
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleRatingClick(rating)}
                      className={`flex items-center gap-2 w-full p-2 rounded-lg transition-colors ${
                        minRating === rating
                          ? "bg-brand-teal-medium/10 border border-brand-teal-medium"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm">& Up</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Stock Status */}
            <div className="pb-6">
              <button
                onClick={() => toggleSection("stock")}
                className="flex items-center justify-between w-full mb-3"
              >
                <h3 className="font-semibold">Availability</h3>
                {openSections.stock ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {openSections.stock && (
                <label className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded border-border text-brand-teal-medium focus:ring-brand-teal-medium"
                  />
                  <span className="text-sm">In Stock Only</span>
                </label>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t border-border">
              <Button
                onClick={applyFilters}
                className="flex-1 bg-brand-teal-medium hover:bg-brand-teal-dark"
              >
                Apply Filters
              </Button>
              {hasActiveFilters && (
                <Button onClick={clearFilters} variant="outline" size="sm">
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
