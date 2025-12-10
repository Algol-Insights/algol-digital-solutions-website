'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { Search, Filter, Grid, List, ChevronDown, Star, ShoppingCart, Heart, Package, DollarSign } from 'lucide-react'

interface FilterState {
  category: string
  priceRange: [number, number]
  rating: number
  search: string
  inStock: boolean
}

const categories = ['All', 'Laptops', 'Desktops', 'Monitors', 'Storage', 'Networking', 'Accessories', 'Security', 'Smartphones', 'Gaming', 'Printers']
const maxPrice = 5000

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    priceRange: [0, maxPrice],
    rating: 0,
    search: '',
    inStock: true,
  })
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('popularity')

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/products?limit=200')
        const data = await response.json()
        setProducts(data.data || data)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    let result = products

    if (filters.category !== 'All') {
      result = result.filter(p => p.category?.name === filters.category || p.category === filters.category)
    }

    if (filters.search) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(filters.search.toLowerCase()))
      )
    }

    result = result.filter(p =>
      p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    )

    if (filters.rating > 0) {
      result = result.filter(p => (p.rating || 0) >= filters.rating)
    }

    if (filters.inStock) {
      result = result.filter(p => (p.stock ?? (p.inStock ? 1 : 0)) > 0)
    }

    // Sort
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    }

    return result
  }, [products, filters, sortBy])

  return (
    <div className="min-h-screen bg-background">
      {/* Premium Header with Gradient */}
      <div className="relative bg-gradient-to-br from-brand-teal-dark via-brand-teal-medium to-brand-golden py-16 overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20px 20px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
        
        {/* Floating orbs */}
        <div className="absolute top-10 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-brand-golden/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}} />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Link href="/" className="text-white/80 hover:text-white mb-6 inline-flex items-center gap-2 group transition-colors">
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
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
              <p className="text-3xl font-bold text-white">{filteredProducts.length}</p>
              <p className="text-white/80 text-sm">Products</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Premium Search Bar */}
        <div className="mb-8">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-muted-foreground group-focus-within:text-brand-teal-medium transition-colors" size={22} />
            <input
              type="text"
              placeholder="Search for hardware, software, or accessories..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-14 pr-6 py-4 glass-dark text-foreground rounded-2xl border-2 border-border focus:border-brand-teal-medium focus:outline-none transition-all placeholder:text-muted-foreground/60 text-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Premium Sidebar Filters */}
          <div className="space-y-6">
            {/* Category Filter */}
            <div className="glass-dark rounded-2xl p-6 border border-border/50 hover-lift">
              <h3 className="text-foreground font-semibold mb-4 flex items-center gap-2 text-lg">
                <div className="p-2 rounded-lg bg-brand-teal-medium/10">
                  <Filter size={18} className="text-brand-teal-medium" />
                </div>
                Category
              </h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group px-3 py-2 rounded-lg hover:bg-accent/50 transition-colors">
                    <input
                      type="radio"
                      name="category"
                      value={cat}
                      checked={filters.category === cat}
                      onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                      className="w-4 h-4 accent-brand-teal-medium"
                    />
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="glass-dark rounded-2xl p-6 border border-border/50 hover-lift">
              <h3 className="text-foreground font-semibold mb-4 flex items-center gap-2 text-lg">
                <div className="p-2 rounded-lg bg-brand-golden/10">
                  <DollarSign size={18} className="text-brand-golden" />
                </div>
                Price Range
              </h3>
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={filters.priceRange[1]}
                onChange={(e) => setFilters({ ...filters, priceRange: [filters.priceRange[0], Number(e.target.value)] })}
                className="w-full accent-brand-teal-medium cursor-pointer"
              />
              <div className="mt-4 px-3 py-2 rounded-lg bg-accent/30 text-center">
                <span className="text-lg font-semibold text-foreground">
                  $0 - ${filters.priceRange[1].toLocaleString()}
                </span>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="glass-dark rounded-2xl p-6 border border-border/50 hover-lift">
              <h3 className="text-foreground font-semibold mb-4 flex items-center gap-2 text-lg">
                <div className="p-2 rounded-lg bg-brand-golden/10">
                  <Star size={18} className="text-brand-golden fill-brand-golden" />
                </div>
                Rating
              </h3>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1, 0].map((rating) => (
                  <label key={rating} className="flex items-center gap-3 cursor-pointer group px-3 py-2 rounded-lg hover:bg-accent/50 transition-colors">
                    <input
                      type="radio"
                      name="rating"
                      value={rating}
                      checked={filters.rating === rating}
                      onChange={(e) => setFilters({ ...filters, rating: Number(e.target.value) })}
                      className="w-4 h-4 accent-brand-golden"
                    />
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                      {rating === 0 ? 'All Ratings' : `${rating}+ Stars`}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Stock Filter */}
            <div className="glass-dark rounded-2xl p-6 border border-border/50 hover-lift">
              <h3 className="text-foreground font-semibold mb-4 flex items-center gap-2 text-lg">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Package size={18} className="text-green-500" />
                </div>
                Availability
              </h3>
              <label className="flex items-center gap-3 cursor-pointer group px-3 py-2 rounded-lg hover:bg-accent/50 transition-colors">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
                  className="w-4 h-4 accent-green-500"
                />
                <span className="text-muted-foreground group-hover:text-foreground transition-colors font-medium">In Stock Only</span>
              </label>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Premium Top Controls */}
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <div className="glass-dark px-5 py-3 rounded-xl border border-border/50">
                <p className="text-foreground font-medium">
                  Showing <span className="text-brand-teal-medium font-bold">{filteredProducts.length}</span> products
                </p>
              </div>
              <div className="flex items-center gap-4">
                {/* View Mode Toggle */}
                <div className="flex gap-2 glass-dark border border-border/50 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2.5 rounded-lg transition-all ${
                      viewMode === 'grid' 
                        ? 'bg-brand-teal-medium text-white shadow-lg shadow-brand-teal-medium/30' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    }`}
                  >
                    <Grid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2.5 rounded-lg transition-all ${
                      viewMode === 'list' 
                        ? 'bg-brand-teal-medium text-white shadow-lg shadow-brand-teal-medium/30' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    }`}
                  >
                    <List size={18} />
                  </button>
                </div>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-5 py-2.5 glass-dark text-foreground rounded-xl border-2 border-border focus:border-brand-teal-medium focus:outline-none cursor-pointer transition-all font-medium"
                >
                  <option value="popularity">Popularity</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            {/* Premium Products Display */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="glass-dark rounded-2xl overflow-hidden border border-border/50 animate-pulse">
                    <div className="aspect-square bg-slate-800" />
                    <div className="p-6 space-y-4">
                      <div className="h-4 bg-slate-700 rounded w-3/4" />
                      <div className="h-3 bg-slate-700 rounded w-1/2" />
                      <div className="h-6 bg-slate-700 rounded w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="glass-dark rounded-2xl overflow-hidden border border-border/50 hover-lift hover:border-brand-teal-medium/50 transition-all group cursor-pointer"
                    >
                      <div className="aspect-square bg-gradient-to-br from-slate-800 via-slate-900 to-black relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground/50 font-semibold text-lg group-hover:scale-110 transition-transform duration-500">
                          {product.category?.name || product.category}
                        </div>
                        {(product.stock ?? (product.inStock ? 1 : 0)) === 0 && (
                          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                            <span className="text-white font-bold text-lg px-6 py-3 bg-red-500/90 rounded-xl">Out of Stock</span>
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="text-foreground font-bold text-lg mb-2 line-clamp-2 group-hover:text-brand-teal-medium transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-3xl font-bold text-gradient-teal">
                            ${product.price.toFixed(2)}
                          </span>
                          {product.rating && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-golden/10">
                              <Star size={16} className="text-brand-golden fill-brand-golden" />
                              <span className="text-sm font-semibold text-foreground">{product.rating}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button className="flex-1 bg-gradient-to-r from-brand-teal-medium to-brand-teal-dark hover:shadow-lg hover:shadow-brand-teal-medium/30 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover-lift">
                            <ShoppingCart size={18} />
                            Add to Cart
                          </button>
                          <button className="px-4 py-3 glass-dark hover:bg-accent border border-border/50 rounded-xl transition-all hover-scale">
                            <Heart size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4 animate-fade-in-up">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="glass-dark border border-border/50 rounded-2xl p-6 hover-lift hover:border-brand-teal-medium/50 transition-all flex gap-6 group"
                    >
                      <div className="w-32 h-32 bg-gradient-to-br from-slate-800 via-slate-900 to-black rounded-xl flex items-center justify-center text-muted-foreground/50 font-semibold flex-shrink-0 group-hover:scale-105 transition-transform overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="relative z-10">{product.category?.name || product.category}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-foreground font-bold text-xl mb-2 group-hover:text-brand-teal-medium transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center gap-6 flex-wrap">
                          <div>
                            <span className="text-3xl font-bold text-gradient-teal">
                              ${product.price.toFixed(2)}
                            </span>
                          </div>
                          {product.rating && (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-golden/10">
                              <Star size={18} className="text-brand-golden fill-brand-golden" />
                              <span className="text-foreground font-semibold">{product.rating} / 5</span>
                            </div>
                          )}
                          <div>
                            <span className={`text-sm font-semibold px-3 py-1.5 rounded-lg ${
                              (product.stock ?? (product.inStock ? 1 : 0)) > 0 
                                ? 'text-green-400 bg-green-500/10' 
                                : 'text-red-400 bg-red-500/10'
                            }`}>
                              {(product.stock ?? (product.inStock ? 1 : 0)) > 0 ? `${product.stock ?? 1} in stock` : 'Out of stock'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button className="bg-gradient-to-r from-brand-teal-medium to-brand-teal-dark hover:shadow-lg hover:shadow-brand-teal-medium/30 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all hover-lift">
                          <ShoppingCart size={18} />
                          Add
                        </button>
                        <button className="glass-dark hover:bg-accent border border-border/50 px-6 py-3 rounded-xl transition-all hover-scale">
                          <Heart size={18} className="text-brand-golden" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-16 glass-dark rounded-2xl border border-border/50">
                <div className="mb-6 inline-flex p-6 rounded-full bg-muted/30">
                  <Search size={48} className="text-muted-foreground" />
                </div>
                <p className="text-foreground text-xl font-semibold mb-2">No products found</p>
                <p className="text-muted-foreground mb-6">Try adjusting your filters or search terms</p>
                <button
                  onClick={() => setFilters({ category: 'All', priceRange: [0, maxPrice], rating: 0, search: '', inStock: true })}
                  className="bg-gradient-to-r from-brand-teal-medium to-brand-teal-dark hover:shadow-lg hover:shadow-brand-teal-medium/30 text-white px-8 py-3 rounded-xl font-semibold transition-all hover-lift"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
