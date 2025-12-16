"use client"

import * as React from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ProductVideoPlayerProps {
  videoUrl: string
  thumbnailUrl?: string
  title?: string
  autoplay?: boolean
  className?: string
}

export function ProductVideoPlayer({
  videoUrl,
  thumbnailUrl,
  title = "Product Video",
  autoplay = false,
  className = "",
}: ProductVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = React.useState(autoplay)
  const [isMuted, setIsMuted] = React.useState(true)
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const [showControls, setShowControls] = React.useState(true)
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 3000)
  }

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative group rounded-2xl overflow-hidden bg-black ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        poster={thumbnailUrl}
        muted={isMuted}
        autoPlay={autoplay}
        loop
        playsInline
        onClick={togglePlay}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Play Overlay (when paused) */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm cursor-pointer"
          >
            <div className="p-6 bg-white/90 dark:bg-black/90 rounded-full hover:scale-110 transition-transform">
              <Play className="h-12 w-12 text-brand-teal-medium fill-brand-teal-medium" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
          >
            <div className="flex items-center gap-3">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5 text-white" />
                ) : (
                  <Play className="h-5 w-5 text-white" />
                )}
              </button>

              {/* Volume */}
              <button
                onClick={toggleMute}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5 text-white" />
                ) : (
                  <Volume2 className="h-5 w-5 text-white" />
                )}
              </button>

              {/* Title */}
              <div className="flex-1 text-white text-sm font-medium truncate">
                {title}
              </div>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                {isFullscreen ? (
                  <X className="h-5 w-5 text-white" />
                ) : (
                  <Maximize className="h-5 w-5 text-white" />
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Grid of product videos
interface ProductVideosGridProps {
  videos: Array<{ url: string; thumbnail?: string; title: string }>
}

export function ProductVideosGrid({ videos }: ProductVideosGridProps) {
  const [selectedVideo, setSelectedVideo] = React.useState<number | null>(null)

  if (videos.length === 0) return null

  return (
    <div className="space-y-6">
      {/* Main Video */}
      <div className="aspect-video">
        <ProductVideoPlayer
          videoUrl={videos[selectedVideo || 0].url}
          thumbnailUrl={videos[selectedVideo || 0].thumbnail}
          title={videos[selectedVideo || 0].title}
        />
      </div>

      {/* Video Thumbnails */}
      {videos.length > 1 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {videos.map((video, index) => (
            <button
              key={index}
              onClick={() => setSelectedVideo(index)}
              className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                (selectedVideo || 0) === index
                  ? "border-brand-teal-medium shadow-lg"
                  : "border-transparent hover:border-gray-300 dark:hover:border-gray-700"
              }`}
            >
              {video.thumbnail ? (
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
                  <Play className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Play className="h-8 w-8 text-white" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// 360° Product View Component (using images)
interface Product360ViewProps {
  images: string[]
  className?: string
}

export function Product360View({ images, className = "" }: Product360ViewProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [isDragging, setIsDragging] = React.useState(false)
  const [startX, setStartX] = React.useState(0)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    const diff = e.clientX - startX
    const sensitivity = 10
    const steps = Math.floor(Math.abs(diff) / sensitivity)

    if (steps > 0) {
      const direction = diff > 0 ? 1 : -1
      const newIndex = (currentIndex + direction * steps + images.length) % images.length
      setCurrentIndex(newIndex)
      setStartX(e.clientX)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  return (
    <div
      ref={containerRef}
      className={`relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 cursor-grab active:cursor-grabbing ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <img
        src={images[currentIndex]}
        alt={`360° view - frame ${currentIndex + 1}`}
        className="w-full h-full object-contain p-8 select-none"
        draggable={false}
      />

      {/* 360 Indicator */}
      <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/70 backdrop-blur-sm text-white text-sm rounded-lg flex items-center gap-2">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
        </motion.div>
        360° View
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/70 backdrop-blur-sm text-white text-sm rounded-lg">
        Drag to rotate
      </div>
    </div>
  )
}
