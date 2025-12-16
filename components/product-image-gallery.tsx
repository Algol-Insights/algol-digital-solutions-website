"use client"

import * as React from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react"

interface ProductImageGalleryProps {
  images: string[]
  productName: string
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [isZoomed, setIsZoomed] = React.useState(false)
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 })
  const imageRef = React.useRef<HTMLDivElement>(null)

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current || !isZoomed) return
    
    const rect = imageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    setMousePosition({ x, y })
  }

  const handleImageClick = () => {
    setIsZoomed(!isZoomed)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrevious()
    if (e.key === "ArrowRight") handleNext()
    if (e.key === "Escape") setIsZoomed(false)
  }

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-2xl overflow-hidden group">
        <motion.div
          ref={imageRef}
          className="relative w-full h-full cursor-zoom-in"
          onMouseMove={handleMouseMove}
          onClick={handleImageClick}
          animate={{
            scale: isZoomed ? 2 : 1,
          }}
          transition={{ duration: 0.3 }}
          style={{
            transformOrigin: isZoomed ? `${mousePosition.x}% ${mousePosition.y}%` : "center",
          }}
        >
          <Image
            src={images[selectedIndex]}
            alt={`${productName} - Image ${selectedIndex + 1}`}
            fill
            className="object-contain p-8"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </motion.div>

        {/* Zoom Indicator */}
        {!isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-2 rounded-lg flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ZoomIn className="h-4 w-4" />
            <span className="text-sm">Click to zoom</span>
          </motion.div>
        )}

        {/* Exit Zoom */}
        {isZoomed && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-black/90 transition-colors z-10"
          >
            <X className="h-5 w-5" />
          </motion.button>
        )}

        {/* Navigation Arrows */}
        {images.length > 1 && !isZoomed && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handlePrevious()
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-black/90 hover:bg-white dark:hover:bg-black p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleNext()
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-black/90 hover:bg-white dark:hover:bg-black p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-10"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <motion.button
              key={index}
              onClick={() => setSelectedIndex(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                index === selectedIndex
                  ? "border-brand-teal-medium shadow-lg shadow-brand-teal-medium/30"
                  : "border-transparent hover:border-gray-300 dark:hover:border-gray-700"
              }`}
            >
              <Image
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                className="object-contain p-2 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800"
                sizes="80px"
              />
              {index === selectedIndex && (
                <motion.div
                  layoutId="thumbnail-indicator"
                  className="absolute inset-0 ring-2 ring-inset ring-brand-teal-medium rounded-lg"
                />
              )}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  )
}
