import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Product } from "@/lib/cart-store"

interface SaveForLaterStore {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  clearAll: () => void
  isInSavedList: (productId: string) => boolean
}

export const useSaveForLaterStore = create<SaveForLaterStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const { items } = get()
        if (items.some((item) => item.id === product.id)) return
        set({ items: [...items, product] })
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.id !== productId) })
      },
      clearAll: () => set({ items: [] }),
      isInSavedList: (productId) => {
        return get().items.some((item) => item.id === productId)
      },
    }),
    {
      name: "save-for-later",
    }
  )
)
