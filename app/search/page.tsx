"use client"

import { Suspense, useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Search, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui-lib"
import { searchProducts, products } from "../../lib/products"
import { ProductCard } from "../../components/product-card"

function SearchContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  
  const results = useMemo(() => {
    if (!searchQuery.trim()) return []
    return searchProducts(searchQuery)
  }, [searchQuery])

  const popularSearches = ["laptop", "dell", "networking", "monitor", "security"]

  return (
    <div className="min-h-screen bg-background">
      {/* Search Header */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-700 text-white py-12">
        <div className="container mx-auto px-4">
          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4"
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
              onChange={(e) => setSearchQuery(e.target.value)}
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
                onClick={() => setSearchQuery(term)}
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
            <div className="mb-6">
              <h2 className="text-xl font-semibold">
                {results.length === 0 ? (
                  <>No results for &quot;{searchQuery}&quot;</>
                ) : (
                  <>{results.length} result{results.length !== 1 ? "s" : ""} for &quot;{searchQuery}&quot;</>
                )}
              </h2>
            </div>

            {results.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {results.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
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
              Search across {products.length} products in our catalog
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
