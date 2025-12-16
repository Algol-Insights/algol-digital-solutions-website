"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Search, ArrowLeft, Loader2, Filter } from "lucide-react"
import { Button } from "@/components/ui-lib"
import { ProductCard } from "@/components/product-card"
import { Pagination } from "@/components/pagination"
import { Product } from "@/lib/cart-store"

interface SearchResponse {
  success: boolean
  data: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  query: string
}

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get("q") || ""
  const initialPage = parseInt(searchParams.get("page") || "1")
  const initialSortBy = searchParams.get("sortBy") || "relevance"
  
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [results, setResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: 12,
    total: 0,
    totalPages: 0,
  })
  const [sortBy, setSortBy] = useState(initialSortBy)

  const popularSearches = ["laptop", "dell", "networking", "monitor", "security", "apple", "hp"]

  // Fetch search results
  useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery.trim()) {
        setResults([])
        setPagination({ page: 1, limit: 12, total: 0, totalPages: 0 })
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(searchQuery)}&page=${pagination.page}&limit=12&sortBy=${sortBy}`
        )
        const data: SearchResponse = await response.json()

        if (data.success) {
          setResults(data.data)
          setPagination(data.pagination)
        } else {
          setResults([])
          setPagination({ page: 1, limit: 12, total: 0, totalPages: 0 })
        }
      } catch (error) {
        console.error("Search error:", error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [searchQuery, pagination.page, sortBy])

  // Update query when searchParams change
  useEffect(() => {
    const newQuery = searchParams.get("q") || ""
    const newPage = parseInt(searchParams.get("page") || "1")
    const newSortBy = searchParams.get("sortBy") || "relevance"
    
    setSearchQuery(newQuery)
    setPagination((prev) => ({ ...prev, page: newPage }))
    setSortBy(newSortBy)
  }, [searchParams])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`/search?${params.toString()}`)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy)
    const params = new URLSearchParams(searchParams.toString())
    params.set("sortBy", newSortBy)
    params.set("page", "1") // Reset to first page on sort change
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Search Header */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-700 text-white py-12">
        <div className="container mx-auto px-4">
          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>
          <h1 className="text-3xl font-bold mb-6">Search Products</h1>
          
          {/* Search Input */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search for laptops, monitors, networking equipment..."
              className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-white/30"
              autoFocus
            />
          </div>

          {/* Popular Searches */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-white/60 text-sm">Popular:</span>
            {popularSearches.map((term) => (
              <button
                key={term}
                onClick={() => handleSearch(term)}
                className="px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-sm transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Results */}
        {searchQuery.trim() ? (
          <>
            {/* Results Header with Sort */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl font-semibold">
                {isLoading ? (
                  <>Searching...</>
                ) : pagination.total === 0 ? (
                  <>No results for &quot;{searchQuery}&quot;</>
                ) : (
                  <>
                    {pagination.total} result{pagination.total !== 1 ? "s" : ""} for &quot;{searchQuery}&quot;
                  </>
                )}
              </h2>

              {/* Sort Dropdown */}
              {pagination.total > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal-medium"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="popular">Most Popular</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>
              )}
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-brand-teal-medium" />
              </div>
            )}

            {/* Results Grid */}
            {!isLoading && results.length > 0 && (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {results.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                  className="mt-8"
                />
              </>
            )}

            {/* No Results */}
            {!isLoading && results.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                  <Search className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">
                  Try different keywords or browse our categories
                </p>
                <Link href="/products">
                  <Button>
                    Browse All Products
                  </Button>
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-violet-100 dark:bg-violet-950 flex items-center justify-center">
              <Search className="h-10 w-10 text-violet-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">Start typing to search</h3>
            <p className="text-muted-foreground mb-6">
              Search across our product catalog
            </p>
            
            {/* Featured Categories */}
            <div className="mt-8 max-w-2xl mx-auto">
              <h4 className="text-sm font-medium text-muted-foreground mb-4">Or browse by category</h4>
              <div className="flex flex-wrap justify-center gap-2">
                {["Laptops", "Desktops", "Networking", "Monitors", "Accessories"].map((cat) => (
                  <Link key={cat} href={`/products?category=${cat}`}>
                    <Button variant="outline" size="sm">
                      {cat}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
