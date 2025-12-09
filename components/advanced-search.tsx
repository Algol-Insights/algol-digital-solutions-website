"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  TrendingUp,
  Clock,
  X,
  Filter,
  Star,
  Package
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface SearchResult {
  id: number
  name: string
  category: string
  price: number
  rating: number
  image: string
  inStock: boolean
}

interface SearchCategory {
  name: string
  count: number
  href: string
}

const mockSearchResults: SearchResult[] = [
  {
    id: 1,
    name: "Advanced Security Camera System Pro",
    category: "Security",
    price: 299.99,
    rating: 4.8,
    image: "/camera.jpg",
    inStock: true
  },
  {
    id: 2,
    name: "Enterprise Router Pro",
    category: "Networking",
    price: 189.99,
    rating: 4.6,
    image: "/router.jpg",
    inStock: true
  },
  {
    id: 3,
    name: "Business Laptop Ultra",
    category: "Laptops",
    price: 899.99,
    rating: 4.7,
    image: "/laptop.jpg",
    inStock: false
  }
]

const trendingSearches = [
  "Security Cameras",
  "Wi-Fi 6 Routers",
  "Gaming Laptops",
  "Mechanical Keyboards",
  "4K Monitors"
]

const recentSearches = [
  "camera system",
  "laptop business",
  "router enterprise"
]

export function AdvancedSearch() {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [categories, setCategories] = useState<SearchCategory[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    // Simulate search
    if (query.length > 1) {
      setIsLoading(true)
      const timer = setTimeout(() => {
        // Filter mock results
        const filtered = mockSearchResults.filter(
          (item) =>
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase())
        )
        setResults(filtered)

        // Get category counts
        const categoryMap = filtered.reduce((acc, item) => {
          acc[item.category] = (acc[item.category] || 0) + 1
          return acc
        }, {} as Record<string, number>)

        setCategories(
          Object.entries(categoryMap).map(([name, count]) => ({
            name,
            count,
            href: `/products?category=${name.toLowerCase()}`
          }))
        )

        setIsLoading(false)
      }, 300)

      return () => clearTimeout(timer)
    } else {
      setResults([])
      setCategories([])
    }
  }, [query])

  const clearSearch = () => {
    setQuery("")
    setResults([])
    setCategories([])
  }

  const saveRecentSearch = (searchQuery: string) => {
    // Save to localStorage
    const recent = JSON.parse(localStorage.getItem("recentSearches") || "[]")
    const updated = [searchQuery, ...recent.filter((q: string) => q !== searchQuery)].slice(0, 5)
    localStorage.setItem("recentSearches", JSON.stringify(updated))
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Search products, categories, brands..."
          className="w-full pl-12 pr-12 py-3 border-2 border-gray-300 rounded-xl focus:border-brand-teal-medium focus:outline-none focus:ring-2 focus:ring-brand-teal-medium/20 transition-all"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Search Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 max-h-[600px] overflow-y-auto"
          >
            {/* Loading State */}
            {isLoading && (
              <div className="p-8 text-center">
                <div className="w-8 h-8 border-4 border-brand-teal-medium border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm text-gray-600 mt-3">Searching...</p>
              </div>
            )}

            {/* No Query - Show Trending & Recent */}
            {!query && !isLoading && (
              <div className="grid md:grid-cols-2 gap-6 p-6">
                {/* Trending Searches */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-brand-teal-medium" />
                    <h3 className="font-semibold text-gray-900">Trending Searches</h3>
                  </div>
                  <div className="space-y-2">
                    {trendingSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setQuery(search)
                          saveRecentSearch(search)
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700 hover:text-brand-teal-medium"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent Searches */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-5 w-5 text-brand-teal-medium" />
                    <h3 className="font-semibold text-gray-900">Recent Searches</h3>
                  </div>
                  <div className="space-y-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => setQuery(search)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700 hover:text-brand-teal-medium"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Search Results */}
            {query && !isLoading && results.length > 0 && (
              <div>
                {/* Categories Filter */}
                {categories.length > 0 && (
                  <div className="border-b border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Filter className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-semibold text-gray-900">
                        Filter by Category
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <Link
                          key={cat.name}
                          href={cat.href}
                          className="px-3 py-1 bg-gray-100 hover:bg-brand-teal-medium hover:text-white rounded-full text-sm font-medium text-gray-700 transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          {cat.name} ({cat.count})
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Product Results */}
                <div className="p-4 space-y-2">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Products ({results.length})
                  </h3>
                  {results.map((result) => (
                    <Link
                      key={result.id}
                      href={`/products/${result.id}`}
                      onClick={() => {
                        saveRecentSearch(query)
                        setIsOpen(false)
                      }}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      {/* Product Image */}
                      <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="h-8 w-8 text-gray-300" />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 group-hover:text-brand-teal-medium transition-colors line-clamp-1">
                          {result.name}
                        </h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-brand-teal-medium font-semibold uppercase">
                            {result.category}
                          </span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-semibold">{result.rating}</span>
                          </div>
                          <span
                            className={`text-xs font-semibold ${
                              result.inStock ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {result.inStock ? "In Stock" : "Out of Stock"}
                          </span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          ${result.price.toFixed(2)}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* View All Results */}
                <div className="border-t border-gray-200 p-4">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-brand-teal-dark text-brand-teal-dark hover:bg-brand-teal-dark hover:text-white"
                  >
                    <Link
                      href={`/products?search=${encodeURIComponent(query)}`}
                      onClick={() => {
                        saveRecentSearch(query)
                        setIsOpen(false)
                      }}
                    >
                      View All Results for "{query}"
                    </Link>
                  </Button>
                </div>
              </div>
            )}

            {/* No Results */}
            {query && !isLoading && results.length === 0 && (
              <div className="p-8 text-center">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">No results found</h3>
                <p className="text-sm text-gray-600">
                  Try adjusting your search terms or browse our categories
                </p>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="mt-4"
                >
                  <Link href="/products" onClick={() => setIsOpen(false)}>
                    Browse All Products
                  </Link>
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
