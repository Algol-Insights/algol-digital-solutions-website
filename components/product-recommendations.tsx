"use client"

import * as React from "react"
import { Product } from "@/lib/cart-store"
import { ProductCard } from "@/components/product-card"
import { Sparkles, Users, Zap, Package } from "lucide-react"

interface ProductRecommendationsProps {
  currentProduct: Product
  allProducts: Product[]
  type: "similar" | "bought-together" | "accessories"
  limit?: number
}

export function ProductRecommendations({
  currentProduct,
  allProducts,
  type,
  limit = 4,
}: ProductRecommendationsProps) {
  const getRecommendations = (): Product[] => {
    if (type === "similar") {
      // Find products in same category or same brand
      return allProducts
        .filter((p) => p.id !== currentProduct.id)
        .filter((p) => p.category === currentProduct.category || p.brand === currentProduct.brand)
        .sort((a, b) => {
          // Prioritize same category and brand
          const aScore = (a.category === currentProduct.category ? 2 : 0) + (a.brand === currentProduct.brand ? 1 : 0)
          const bScore = (b.category === currentProduct.category ? 2 : 0) + (b.brand === currentProduct.brand ? 1 : 0)
          return bScore - aScore
        })
        .slice(0, limit)
    }

    if (type === "bought-together") {
      // Simulate "frequently bought together" with complementary products
      // In real app, this would use purchase history data
      const getCategoryName = (cat: string | { id: string; name: string; slug: string } | undefined) => 
        typeof cat === 'string' ? cat : cat?.name || ''
      const currentCategoryName = getCategoryName(currentProduct.category)
      
      return allProducts
        .filter((p) => p.id !== currentProduct.id)
        .filter((p) => {
          const pCategoryName = getCategoryName(p.category)
          // Find complementary products (e.g., laptop with mouse, monitor with keyboard)
          if (currentCategoryName === "Laptops") {
            return ["Accessories", "Peripherals", "Storage"].includes(pCategoryName)
          }
          if (currentCategoryName === "Monitors") {
            return ["Accessories", "Peripherals"].includes(pCategoryName)
          }
          if (currentCategoryName === "Desktops") {
            return ["Monitors", "Peripherals", "Accessories"].includes(pCategoryName)
          }
          return pCategoryName !== currentCategoryName
        })
        .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        .slice(0, limit)
    }

    if (type === "accessories") {
      // Find accessories and lower-priced complementary items
      return allProducts
        .filter((p) => p.id !== currentProduct.id)
        .filter((p) => {
          const category = typeof p.category === 'string' ? p.category.toLowerCase() : p.category?.name?.toLowerCase() || ""
          return category.includes("accessories") || 
                 category.includes("peripheral") || 
                 p.price < currentProduct.price * 0.5
        })
        .slice(0, limit)
    }

    return []
  }

  const recommendations = getRecommendations()

  if (recommendations.length === 0) {
    return null
  }

  const config = {
    similar: {
      icon: Sparkles,
      title: "Similar Products",
      subtitle: "You might also like these",
      gradient: "from-purple-600 to-pink-600",
      bgGradient: "from-purple-500/10 to-pink-500/10",
    },
    "bought-together": {
      icon: Users,
      title: "Frequently Bought Together",
      subtitle: "Customers who bought this also bought",
      gradient: "from-blue-600 to-cyan-600",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
    },
    accessories: {
      icon: Package,
      title: "Complete Your Setup",
      subtitle: "Essential accessories and add-ons",
      gradient: "from-green-600 to-emerald-600",
      bgGradient: "from-green-500/10 to-emerald-500/10",
    },
  }

  const { icon: Icon, title, subtitle, gradient, bgGradient } = config[type]

  return (
    <section className="py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className={`p-3 bg-gradient-to-br ${bgGradient} rounded-xl`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h2 className={`text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
            {title}
          </h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </section>
  )
}

// Bundle component showing total savings when buying together
interface ProductBundleProps {
  mainProduct: Product
  bundleProducts: Product[]
}

export function ProductBundle({ mainProduct, bundleProducts }: ProductBundleProps) {
  const totalPrice = mainProduct.price + bundleProducts.reduce((sum, p) => sum + p.price, 0)
  const totalOriginalPrice = 
    (mainProduct.originalPrice || mainProduct.price) + 
    bundleProducts.reduce((sum, p) => sum + (p.originalPrice || p.price), 0)
  const savings = totalOriginalPrice - totalPrice

  return (
    <div className="p-6 bg-gradient-to-br from-brand-teal-medium/10 to-brand-golden/10 rounded-2xl border border-border">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="h-5 w-5 text-brand-teal-medium" />
        <h3 className="text-xl font-bold">Bundle & Save</h3>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span>{mainProduct.name}</span>
          <span className="font-medium">${mainProduct.price.toFixed(2)}</span>
        </div>
        {bundleProducts.map((product) => (
          <div key={product.id} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{product.name}</span>
            <span className="font-medium">${product.price.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold">Bundle Total:</span>
          <div className="text-right">
            {savings > 0 && (
              <div className="text-sm text-muted-foreground line-through">
                ${totalOriginalPrice.toFixed(2)}
              </div>
            )}
            <div className="text-2xl font-bold text-brand-teal-medium">
              ${totalPrice.toFixed(2)}
            </div>
          </div>
        </div>
        {savings > 0 && (
          <div className="text-sm text-green-600 dark:text-green-400 font-medium text-center">
            You save ${savings.toFixed(2)}!
          </div>
        )}
      </div>
    </div>
  )
}
