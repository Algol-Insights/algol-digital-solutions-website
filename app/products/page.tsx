"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Grid, ArrowLeft, Loader2 } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { ProductFilters } from "@/components/product-filters"
import { ProductSort } from "@/components/product-sort"
import { ComparisonBar } from "@/components/comparison-bar"
import { SearchBarEnhanced } from "@/components/search-bar-enhanced"
import { Button } from "@/components/ui-lib"
import { ErrorBoundary } from "@/components/error-boundary"
import { ProductsGridSkeleton } from "@/components/loading-states"

interface Product {
  id: string
  name: string
  description?: string
  price: number
  originalPrice?: number
  image: string
  images?: string[]
  category: {
    id: string
    name: string
    slug: string
  }
  brand: string
  rating: number
  inStock: boolean
  stock: number
}

interface Category {
  id: string
  name: string
  slug: string
}

function ProductsLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin mx-auto text-violet-600" />
        <p className="text-gray-600">Loading products...</p>
      </div>
    </div>
  )
}

function ProductsPageContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  })

  // Fetch filter metadata
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        // Fetch categories
        const catResponse = await fetch("/api/categories")
        const catData = await catResponse.json()
        // Ensure categories is always an array
        setCategories(Array.isArray(catData) ? catData : [])

        // Fetch all products to get unique brands (in production, this would be a separate endpoint)
        const allProductsResponse = await fetch("/api/products?limit=1000")
        const allProductsData = await allProductsResponse.json()
        const allProducts = Array.isArray(allProductsData.data) ? allProductsData.data : Array.isArray(allProductsData) ? allProductsData : []
        
        const uniqueBrands = Array.from(new Set(allProducts.map((p: Product) => p.brand).filter(Boolean))) as string[]
        setBrands(uniqueBrands.sort())
      } catch (error) {
        console.error("Error fetching metadata:", error)
      }
    }
    fetchMetadata()
  }, [])

  // Fetch products with filters
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        
        // Build query string from URL params
        const params = new URLSearchParams()
        searchParams.forEach((value, key) => {
          params.set(key, value)
        })
        
        const response = await fetch(`/api/products?${params.toString()}`)
        const data = await response.json()
        
        setProducts(data.data || [])
        if (data.pagination) {
          setPagination(data.pagination)
        }
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [searchParams])

  // Calculate price range from all products
  const priceRange = products.length > 0
    ? {
        min: Math.min(...products.map(p => p.price)),
        max: Math.max(...products.map(p => p.price))
      }
    : { min: 0, max: 10000 }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-brand-teal-dark via-brand-teal-medium to-brand-golden py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20px 20px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
        
        <div className="absolute top-10 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-brand-golden/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}} />
        
        <div className="container mx-auto px-6 relative z-10">
          <Link href="/" className="text-white/80 hover:text-white mb-6 inline-flex items-center gap-2 group transition-colors">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-5xl font-bold text-white flex items-center gap-4 mb-3">
                <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm">
                  <Grid className="h-10 w-10" />
                </div>
                Our Products
              </h1>
              <p className="text-xl text-white/90 max-w-2xl">
                Discover premium IT hardware & software solutions for your business
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/20">
              <p className="text-white/80 text-sm">Showing</p>
              <p className="text-3xl font-bold text-white">{pagination.total}</p>
              <p className="text-white/80 text-sm">Products</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Enhanced Search Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <SearchBarEnhanced />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div>
            <ProductFilters
              categories={categories}
              brands={brands}
              minPriceRange={priceRange.min}
              maxPriceRange={priceRange.max}
            />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3 space-y-6">
            {/* Sort Bar */}
            <div className="flex items-center justify-between bg-card border border-border rounded-xl p-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{products.length}</span> of{" "}
                  <span className="font-semibold text-foreground">{pagination.total}</span> products
                </p>
              </div>
              <ProductSort />
            </div>

            {loading ? (
              <ProductsGridSkeleton count={6} />
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <Grid className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters to see more results
                </p>
                <Button asChild>
                  <Link href="/products">Clear Filters</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    {[...Array(pagination.pages)].map((_, i) => (
                      <Button
                        key={i}
                        variant={pagination.page === i + 1 ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          const params = new URLSearchParams(searchParams.toString())
                          params.set("page", (i + 1).toString())
                          window.location.href = `/products?${params.toString()}`
                        }}
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <ComparisonBar />
    </div>
  )
}

export default function ProductsPageNew() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<ProductsLoadingFallback />}>
        <ProductsPageContent />
      </Suspense>
    </ErrorBoundary>
  )
}
