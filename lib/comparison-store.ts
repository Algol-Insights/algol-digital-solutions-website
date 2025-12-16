"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Product } from "@/lib/cart-store"

interface ComparisonStore {
  products: Product[]
  addProduct: (product: Product) => void
  removeProduct: (productId: string) => void
  clearAll: () => void
  isInComparison: (productId: string) => boolean
}

export const useComparisonStore = create<ComparisonStore>()(
  persist(
    (set, get) => ({
      products: [],
      addProduct: (product) => {
        const { products } = get()
        if (products.length >= 4) return // Max 4 products
        if (products.some((p) => p.id === product.id)) return
        set({ products: [...products, product] })
      },
      removeProduct: (productId) => {
        set({ products: get().products.filter((p) => p.id !== productId) })
      },
      clearAll: () => set({ products: [] }),
      isInComparison: (productId) => {
        return get().products.some((p) => p.id === productId)
      },
    }),
    {
      name: "product-comparison",
    }
  )
)
