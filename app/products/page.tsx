'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, Filter, Grid, List, ChevronDown, Star, ShoppingCart, Heart } from 'lucide-react'
import { products } from '@/lib/products'

interface FilterState {
  category: string
  priceRange: [number, number]
  rating: number
  search: string
  inStock: boolean
}

const categories = ['All', 'Laptops', 'Desktops', 'Monitors', 'Storage', 'Networking', 'Accessories', 'Security']
const maxPrice = 5000

export default function ProductsPage() {
  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    priceRange: [0, maxPrice],
    rating: 0,
    search: '',
    inStock: true,
  })
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('popularity')

  const filteredProducts = useMemo(() => {
    let result = products

    if (filters.category !== 'All') {
      result = result.filter(p => p.category === filters.category)
    }

    if (filters.search) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.description.toLowerCase().includes(filters.search.toLowerCase())
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
      result.sort((a, b) => (b.id || 0) - (a.id || 0))
    }

    return result
  }, [filters, sortBy])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-950 border-b border-slate-700 py-8 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <Link href="/" className="text-slate-400 hover:text-white mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            <Grid size={36} />
            Products
          </h1>
          <p className="text-slate-400 mt-1">Browse our comprehensive catalog</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="space-y-6">
            {/* Category Filter */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Filter size={18} /> Category
              </h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value={cat}
                      checked={filters.category === cat}
                      onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                      className="w-4 h-4"
                    />
                    <span className="text-slate-300 hover:text-white">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4">Price Range</h3>
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={filters.priceRange[1]}
                onChange={(e) => setFilters({ ...filters, priceRange: [filters.priceRange[0], Number(e.target.value)] })}
                className="w-full"
              />
              <div className="mt-4 text-slate-300">
                $0 - ${filters.priceRange[1].toLocaleString()}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4">Rating</h3>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1, 0].map((rating) => (
                  <label key={rating} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      value={rating}
                      checked={filters.rating === rating}
                      onChange={(e) => setFilters({ ...filters, rating: Number(e.target.value) })}
                      className="w-4 h-4"
                    />
                    <span className="text-slate-300 hover:text-white">
                      {rating === 0 ? 'All Ratings' : `${rating}+ Stars`}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Stock Filter */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-slate-300 hover:text-white">In Stock Only</span>
              </label>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Top Controls */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-slate-400">
                Showing {filteredProducts.length} products
              </p>
              <div className="flex items-center gap-4">
                {/* View Mode Toggle */}
                <div className="flex gap-2 border border-slate-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    <Grid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    <List size={18} />
                  </button>
                </div>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="popularity">Popularity</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            {/* Products Display */}
            {filteredProducts.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden hover:border-blue-500 transition group cursor-pointer"
                    >
                      <div className="aspect-square bg-gradient-to-br from-slate-700 to-slate-900 relative overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center text-slate-600 font-semibold">
                          {product.category}
                        </div>
                        {(product.stock ?? (product.inStock ? 1 : 0)) === 0 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white font-bold">Out of Stock</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-white font-bold mb-2 line-clamp-2 group-hover:text-blue-400">
                          {product.name}
                        </h3>
                        <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-2xl font-bold text-blue-400">
                            ${product.price.toFixed(2)}
                          </span>
                          {product.rating && (
                            <div className="flex items-center gap-1">
                              <Star size={16} className="text-amber-400 fill-amber-400" />
                              <span className="text-sm text-slate-300">{product.rating}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition">
                            <ShoppingCart size={18} />
                            Add to Cart
                          </button>
                          <button className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition">
                            <Heart size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition flex gap-6"
                    >
                      <div className="w-32 h-32 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg flex items-center justify-center text-slate-600 font-semibold flex-shrink-0">
                        {product.category}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg mb-2">
                          {product.name}
                        </h3>
                        <p className="text-slate-400 text-sm mb-4">
                          {product.description}
                        </p>
                        <div className="flex items-center gap-6">
                          <div>
                            <span className="text-2xl font-bold text-blue-400">
                              ${product.price.toFixed(2)}
                            </span>
                          </div>
                          {product.rating && (
                            <div className="flex items-center gap-2">
                              <Star size={18} className="text-amber-400 fill-amber-400" />
                              <span className="text-slate-300">{product.rating} / 5</span>
                            </div>
                          )}
                          <div>
                            <span className={`text-sm font-semibold ${(product.stock ?? (product.inStock ? 1 : 0)) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {(product.stock ?? (product.inStock ? 1 : 0)) > 0 ? `${product.stock ?? 1} in stock` : 'Out of stock'}
                              </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition">
                          <ShoppingCart size={18} />
                          Add
                        </button>
                        <button className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-lg transition">
                          <Heart size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-400 text-lg mb-4">No products found matching your filters</p>
                <button
                  onClick={() => setFilters({ category: 'All', priceRange: [0, maxPrice], rating: 0, search: '', inStock: true })}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
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
