"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

// Category can be a string or object with category details
type Category = string | { id: string; name: string; slug: string }

export interface WishlistItem {
  id: string | number
  name: string
  category: Category
  price: number
  originalPrice?: number
  rating?: number
  reviews?: number
  image: string
  inStock: boolean
  addedAt: Date
  priceHistory: { date: Date; price: number }[]
}

interface WishlistStore {
  items: WishlistItem[]
  wishlistCount: number
  setWishlistCount: (count: number) => void
  incrementCount: () => void
  decrementCount: () => void
  addItem: (item: Omit<WishlistItem, "addedAt" | "priceHistory">) => void
  removeItem: (id: string | number) => void
  addToWishlist: (item: Omit<WishlistItem, "addedAt" | "priceHistory">) => void
  removeFromWishlist: (id: string | number) => void
  clearWishlist: () => void
  isInWishlist: (id: string | number) => boolean
  moveToCart: (id: string | number) => void
  getPriceDrops: () => WishlistItem[]
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      wishlistCount: 0,

      setWishlistCount: (count) => {
        set({ wishlistCount: count })
      },

      incrementCount: () => {
        set((state) => ({ wishlistCount: state.wishlistCount + 1 }))
      },

      decrementCount: () => {
        set((state) => ({ wishlistCount: Math.max(0, state.wishlistCount - 1) }))
      },

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

      // Aliases for convenience
      addToWishlist: (item) => get().addItem(item),
      removeFromWishlist: (id) => get().removeItem(id),

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

// Export alias for backwards compatibility
export const useWishlist = useWishlistStore
