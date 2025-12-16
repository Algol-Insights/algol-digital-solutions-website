"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, X, ZoomIn, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui-lib"

interface ProductImageGalleryProps {
  images: string[]
  productName: string
  className?: string
}

export function ProductImageGalleryEnhanced({ images, productName, className = "" }: ProductImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const validImages = images.length > 0 ? images : ["/placeholder-product.jpg"]

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % validImages.length)
    setIsZoomed(false)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length)
    setIsZoomed(false)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePosition({ x, y })
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isLightboxOpen) return
    if (e.key === "ArrowLeft") goToPrevious()
    if (e.key === "ArrowRight") goToNext()
    if (e.key === "Escape") setIsLightboxOpen(false)
  }

  // Keyboard navigation
  if (typeof window !== "undefined") {
    window.addEventListener("keydown", handleKeyDown)
  }

  return (
    <>
      {/* Main Gallery */}
      <div className={`space-y-4 ${className}`}>
        {/* Main Image */}
        <div className="relative">
          <div
            className="relative aspect-square bg-gradient-to-br from-muted/30 to-muted/50 rounded-2xl overflow-hidden group cursor-zoom-in"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onClick={() => setIsLightboxOpen(true)}
          >
            <Image
              src={validImages[currentIndex]}
              alt={`${productName} - Image ${currentIndex + 1}`}
              fill
              className={`object-cover transition-transform duration-300 ${
                isZoomed ? "scale-150" : "scale-100"
              }`}
              style={
                isZoomed
                  ? {
                      transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                    }
                  : {}
              }
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />

            {/* Zoom Indicator */}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-2 rounded-full text-white text-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="w-4 h-4" />
              <span>Click to enlarge</span>
            </div>

            {/* Navigation Arrows */}
            {validImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full p-2"
                  onClick={(e) => {
                    e.stopPropagation()
                    goToPrevious()
                  }}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full p-2"
                  onClick={(e) => {
                    e.stopPropagation()
                    goToNext()
                  }}
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </>
            )}

            {/* Image Counter */}
            {validImages.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
                {currentIndex + 1} / {validImages.length}
              </div>
            )}
          </div>

          {/* Fullscreen Button */}
          <Button
            variant="outline"
            size="sm"
            className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm hover:bg-white"
            onClick={() => setIsLightboxOpen(true)}
          >
            <Maximize2 className="w-4 h-4 mr-2" />
            Fullscreen
          </Button>
        </div>

        {/* Thumbnail Strip */}
        {validImages.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
            {validImages.map((image, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index)
                  setIsZoomed(false)
                }}
                className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  currentIndex === index
                    ? "border-brand-teal-medium ring-2 ring-brand-teal-medium/30 scale-105"
                    : "border-border hover:border-brand-teal-light"
                }`}
              >
                <Image
                  src={image}
                  alt={`${productName} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2"
              onClick={() => setIsLightboxOpen(false)}
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Image Counter */}
            {validImages.length > 1 && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white">
                {currentIndex + 1} / {validImages.length}
              </div>
            )}

            {/* Navigation */}
            {validImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full p-3"
                  onClick={(e) => {
                    e.stopPropagation()
                    goToPrevious()
                  }}
                >
                  <ChevronLeft className="w-8 h-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full p-3"
                  onClick={(e) => {
                    e.stopPropagation()
                    goToNext()
                  }}
                >
                  <ChevronRight className="w-8 h-8" />
                </Button>
              </>
            )}

            {/* Large Image */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-7xl max-h-[90vh] w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={validImages[currentIndex]}
                alt={`${productName} - Large view ${currentIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </motion.div>

            {/* Thumbnail Strip in Lightbox */}
            {validImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/60 backdrop-blur-sm p-2 rounded-full">
                {validImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation()
                      setCurrentIndex(index)
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentIndex === index
                        ? "bg-white w-8"
                        : "bg-white/50 hover:bg-white/75"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
