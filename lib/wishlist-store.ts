"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface WishlistItem {
  id: number
  name: string
  category: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  image: string
  inStock: boolean
  addedAt: Date
  priceHistory: { date: Date; price: number }[]
}

interface WishlistStore {
  items: WishlistItem[]
  addItem: (item: Omit<WishlistItem, "addedAt" | "priceHistory">) => void
  removeItem: (id: number) => void
  clearWishlist: () => void
  isInWishlist: (id: number) => boolean
  moveToCart: (id: number) => void
  getPriceDrops: () => WishlistItem[]
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const existingItem = get().items.find((i) => i.id === item.id)
        if (existingItem) return

        set((state) => ({
          items: [
            ...state.items,
            {
              ...item,
              addedAt: new Date(),
              priceHistory: [{ date: new Date(), price: item.price }]
            }
          ]
        }))
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id)
        }))
      },

      clearWishlist: () => {
        set({ items: [] })
      },

      isInWishlist: (id) => {
        return get().items.some((item) => item.id === id)
      },

      moveToCart: (id) => {
        // This will be implemented with the cart store
        const item = get().items.find((i) => i.id === id)
        if (item) {
          // Add to cart logic here
          get().removeItem(id)
        }
      },

      getPriceDrops: () => {
        return get().items.filter((item) => {
          const history = item.priceHistory
          if (history.length < 2) return false
          const initialPrice = history[0].price
          const currentPrice = item.price
          return currentPrice < initialPrice
        })
      }
    }),
    {
      name: "wishlist-storage"
    }
  )
)
