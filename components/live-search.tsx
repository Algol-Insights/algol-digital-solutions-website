"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Search, X, TrendingUp, Clock, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Product } from "@/lib/cart-store"

interface LiveSearchProps {
  products: Product[]
  className?: string
}

const RECENT_SEARCHES_KEY = "recent-searches"
const MAX_RECENT_SEARCHES = 5

export function LiveSearch({ products, className = "" }: LiveSearchProps) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<Product[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
      if (stored) {
        setRecentSearches(JSON.parse(stored))
      }
    }
  }, [])

  // Search products
  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([])
      return
    }

    const searchQuery = query.toLowerCase()
    const filtered = products
      .filter((product) => {
        const categoryName = typeof product.category === 'string' 
          ? product.category 
          : (product.category as any)?.name || ''
        return (
          product.name.toLowerCase().includes(searchQuery) ||
          product.description?.toLowerCase().includes(searchQuery) ||
          product.brand?.toLowerCase().includes(searchQuery) ||
          categoryName.toLowerCase().includes(searchQuery)
        )
      })
      .slice(0, 8)

    setResults(filtered)
  }, [query, products])

  // Handle clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (selectedIndex >= 0 && results[selectedIndex]) {
        handleProductClick(results[selectedIndex])
      } else if (query.trim()) {
        handleSearch()
      }
    } else if (e.key === "Escape") {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  const saveRecentSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return

    const updated = [searchTerm, ...recentSearches.filter((s) => s !== searchTerm)].slice(
      0,
      MAX_RECENT_SEARCHES
    )
    setRecentSearches(updated)
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
  }

  const handleSearch = () => {
    if (query.trim()) {
      saveRecentSearch(query)
      router.push(`/search?q=${encodeURIComponent(query)}`)
      setIsOpen(false)
      setQuery("")
    }
  }

  const handleProductClick = (product: Product) => {
    saveRecentSearch(query)
    router.push(`/products/${product.id}`)
    setIsOpen(false)
    setQuery("")
  }

  const handleRecentSearchClick = (search: string) => {
    setQuery(search)
    inputRef.current?.focus()
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem(RECENT_SEARCHES_KEY)
  }

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text

    const parts = text.split(new RegExp(`(${query})`, "gi"))
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-yellow-200 dark:bg-yellow-800 font-semibold">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    )
  }

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search products, brands, categories..."
          className="w-full pl-12 pr-12 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-teal-medium focus:border-transparent transition-all"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("")
              inputRef.current?.focus()
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 left-0 right-0 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50 max-h-[500px] overflow-y-auto"
          >
            {/* Search Results */}
            {query.trim() && results.length > 0 && (
              <div>
                <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
                  Products ({results.length})
                </div>
                {results.map((product, index) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductClick(product)}
                    className={`w-full flex items-center gap-3 p-3 hover:bg-muted transition-colors ${
                      index === selectedIndex ? "bg-muted" : ""
                    }`}
                  >
                    <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain p-1"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="font-medium text-sm line-clamp-1">
                        {highlightMatch(product.name, query)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {product.brand} • ${product.price}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </button>
                ))}
              </div>
            )}

            {/* No Results */}
            {query.trim() && results.length === 0 && (
              <div className="p-8 text-center">
                <div className="text-muted-foreground mb-2">No products found for "{query}"</div>
                <button
                  onClick={handleSearch}
                  className="text-sm text-brand-teal-medium hover:underline"
                >
                  Search anyway →
                </button>
              </div>
            )}

            {/* Recent Searches */}
            {!query.trim() && recentSearches.length > 0 && (
              <div>
                <div className="px-4 py-2 flex items-center justify-between border-b border-border">
                  <div className="text-xs font-semibold text-muted-foreground uppercase">
                    Recent Searches
                  </div>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear
                  </button>
                </div>
                {recentSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => handleRecentSearchClick(search)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-muted transition-colors group"
                  >
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1 text-left text-sm">{search}</span>
                    <X
                      className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        setRecentSearches((prev) => prev.filter((s) => s !== search))
                        localStorage.setItem(
                          RECENT_SEARCHES_KEY,
                          JSON.stringify(recentSearches.filter((s) => s !== search))
                        )
                      }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Trending/Popular (when no query) */}
            {!query.trim() && recentSearches.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <div className="text-sm">Start typing to search products</div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
