"use client"

import { useState, useEffect } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui-lib"

export interface ProductVariant {
  id: string
  productId?: string
  sku?: string
  name: string
  color?: string | null
  size?: string | null
  storage?: string | null
  price: number
  originalPrice?: number | null
  stock: number
  inStock?: boolean
  image?: string | null
  sortOrder?: number
}

interface VariantSelectorProps {
  variants: ProductVariant[]
  selectedVariant?: ProductVariant
  onVariantChange: (variant: ProductVariant) => void
  className?: string
}

export function VariantSelector({
  variants,
  selectedVariant,
  onVariantChange,
  className = "",
}: VariantSelectorProps) {
  const [localSelected, setLocalSelected] = useState<ProductVariant | undefined>(
    selectedVariant || variants[0]
  )

  useEffect(() => {
    if (selectedVariant) {
      setLocalSelected(selectedVariant)
    }
  }, [selectedVariant])

  // Group variants by type
  const colors = Array.from(new Set(variants.map((v) => v.color).filter(Boolean)))
  const sizes = Array.from(new Set(variants.map((v) => v.size).filter(Boolean)))
  const storages = Array.from(new Set(variants.map((v) => v.storage).filter(Boolean)))

  const handleSelection = (type: "color" | "size" | "storage", value: string) => {
    // Find variant matching the selection
    const newVariant = variants.find((v) => {
      const currentColor = localSelected?.color || colors[0]
      const currentSize = localSelected?.size || sizes[0]
      const currentStorage = localSelected?.storage || storages[0]

      if (type === "color") {
        return (
          v.color === value &&
          (sizes.length === 0 || v.size === currentSize) &&
          (storages.length === 0 || v.storage === currentStorage)
        )
      } else if (type === "size") {
        return (
          (colors.length === 0 || v.color === currentColor) &&
          v.size === value &&
          (storages.length === 0 || v.storage === currentStorage)
        )
      } else {
        return (
          (colors.length === 0 || v.color === currentColor) &&
          (sizes.length === 0 || v.size === currentSize) &&
          v.storage === value
        )
      }
    })

    if (newVariant) {
      setLocalSelected(newVariant)
      onVariantChange(newVariant)
    }
  }

  if (variants.length === 0) {
    return null
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Color Selection */}
      {colors.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-3">
            Color: <span className="font-semibold text-brand-teal-medium">{localSelected?.color}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const isSelected = localSelected?.color === color
              const isAvailable = variants.some((v) => v.color === color && v.inStock)

              return (
                <button
                  key={color}
                  onClick={() => handleSelection("color", color as string)}
                  disabled={!isAvailable}
                  className={`relative px-4 py-2 rounded-lg border-2 transition-all ${
                    isSelected
                      ? "border-brand-teal-medium bg-brand-teal-medium/10 text-brand-teal-medium font-semibold"
                      : isAvailable
                      ? "border-border hover:border-brand-teal-medium/50 hover:bg-muted"
                      : "border-border bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
                  }`}
                >
                  {color}
                  {isSelected && (
                    <Check className="absolute top-1 right-1 h-3 w-3" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Storage Selection */}
      {storages.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-3">
            Storage: <span className="font-semibold text-brand-teal-medium">{localSelected?.storage}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {storages.map((storage) => {
              const isSelected = localSelected?.storage === storage
              const isAvailable = variants.some((v) => v.storage === storage && v.inStock)

              return (
                <button
                  key={storage}
                  onClick={() => handleSelection("storage", storage as string)}
                  disabled={!isAvailable}
                  className={`relative px-4 py-2 rounded-lg border-2 transition-all ${
                    isSelected
                      ? "border-brand-teal-medium bg-brand-teal-medium/10 text-brand-teal-medium font-semibold"
                      : isAvailable
                      ? "border-border hover:border-brand-teal-medium/50 hover:bg-muted"
                      : "border-border bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
                  }`}
                >
                  {storage}
                  {isSelected && (
                    <Check className="absolute top-1 right-1 h-3 w-3" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {sizes.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-3">
            Size: <span className="font-semibold text-brand-teal-medium">{localSelected?.size}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const isSelected = localSelected?.size === size
              const isAvailable = variants.some((v) => v.size === size && v.inStock)

              return (
                <button
                  key={size}
                  onClick={() => handleSelection("size", size as string)}
                  disabled={!isAvailable}
                  className={`relative px-4 py-2 rounded-lg border-2 transition-all ${
                    isSelected
                      ? "border-brand-teal-medium bg-brand-teal-medium/10 text-brand-teal-medium font-semibold"
                      : isAvailable
                      ? "border-border hover:border-brand-teal-medium/50 hover:bg-muted"
                      : "border-border bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
                  }`}
                >
                  {size}
                  {isSelected && (
                    <Check className="absolute top-1 right-1 h-3 w-3" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Selected Variant Info */}
      {localSelected && (
        <div className="rounded-lg bg-muted/50 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Selected:</span>
            <span className="text-sm font-semibold">{localSelected.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Price:</span>
            <div className="flex items-center gap-2">
              {localSelected.originalPrice && localSelected.originalPrice > localSelected.price && (
                <span className="text-sm text-muted-foreground line-through">
                  ${localSelected.originalPrice.toFixed(2)}
                </span>
              )}
              <span className="text-lg font-bold text-brand-teal-medium">
                ${localSelected.price.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Availability:</span>
            <span className={`text-sm font-semibold ${localSelected.inStock ? "text-green-600" : "text-red-600"}`}>
              {localSelected.inStock ? `In Stock (${localSelected.stock} available)` : "Out of Stock"}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
