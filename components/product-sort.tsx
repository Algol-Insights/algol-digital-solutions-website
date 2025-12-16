"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ArrowUpDown, TrendingUp, Star, Clock, Zap } from "lucide-react"
import { Button } from "@/components/ui-lib"

const sortOptions = [
  {
    value: "newest",
    label: "Newest First",
    icon: Clock,
    description: "Recently added products"
  },
  {
    value: "popular",
    label: "Most Popular",
    icon: Zap,
    description: "Based on reviews"
  },
  {
    value: "rating",
    label: "Highest Rated",
    icon: Star,
    description: "Best customer ratings"
  },
  {
    value: "price-asc",
    label: "Price: Low to High",
    icon: TrendingUp,
    description: "Budget friendly first"
  },
  {
    value: "price-desc",
    label: "Price: High to Low",
    icon: TrendingUp,
    description: "Premium products first"
  },
]

export function ProductSort() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSort = searchParams.get("sortBy") || "newest"

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value === "newest") {
      params.delete("sortBy") // Default, no need to add to URL
    } else {
      params.set("sortBy", value)
    }
    
    router.push(`/products?${params.toString()}`)
  }

  const currentOption = sortOptions.find(opt => opt.value === currentSort) || sortOptions[0]
  const Icon = currentOption.icon

  return (
    <div className="relative group">
      <Button
        variant="outline"
        className="flex items-center gap-2 min-w-[200px] justify-between bg-card hover:bg-accent"
      >
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-brand-teal-medium" />
          <span className="font-medium">{currentOption.label}</span>
        </div>
        <svg
          className="w-4 h-4 transition-transform group-hover:rotate-180"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Button>

      {/* Dropdown Menu */}
      <div className="absolute right-0 mt-2 w-72 bg-card border border-border rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
        <div className="p-2">
          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border mb-2">
            Sort By
          </div>
          {sortOptions.map((option) => {
            const OptionIcon = option.icon
            const isActive = currentSort === option.value
            
            return (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={`w-full text-left px-3 py-3 rounded-lg transition-all group/item hover:bg-accent ${
                  isActive ? "bg-brand-teal-medium/10 border border-brand-teal-medium/30" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 p-2 rounded-lg transition-colors ${
                    isActive 
                      ? "bg-brand-teal-medium text-white" 
                      : "bg-muted group-hover/item:bg-brand-teal-medium/20"
                  }`}>
                    <OptionIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`font-medium text-sm ${
                        isActive ? "text-brand-teal-medium" : "text-foreground"
                      }`}>
                        {option.label}
                      </span>
                      {isActive && (
                        <svg className="w-4 h-4 text-brand-teal-medium" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {option.description}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
