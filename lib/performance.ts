/**
 * Performance optimization utilities for the e-commerce platform
 */

/**
 * Image optimization helper
 * Generates optimized image URLs with proper sizes and formats
 */
export function getOptimizedImageUrl(
  src: string | null | undefined,
  options: {
    width?: number
    height?: number
    quality?: number
    format?: 'webp' | 'avif' | 'jpeg' | 'png'
  } = {}
): string {
  if (!src) return '/placeholder-product.jpg'

  const { width, height, quality = 80, format = 'webp' } = options

  // If using Next.js Image Optimization
  if (src.startsWith('/') || src.startsWith('http')) {
    const params = new URLSearchParams()
    if (width) params.set('w', width.toString())
    if (height) params.set('h', height.toString())
    params.set('q', quality.toString())
    params.set('f', format)

    return src
  }

  return src
}

/**
 * Lazy load images with intersection observer
 */
export function setupLazyLoading(imageSelector: string = 'img[data-lazy]') {
  if (typeof window === 'undefined') return

  const images = document.querySelectorAll<HTMLImageElement>(imageSelector)

  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          const src = img.dataset.lazy

          if (src) {
            img.src = src
            img.removeAttribute('data-lazy')
            observer.unobserve(img)
          }
        }
      })
    },
    {
      rootMargin: '50px',
    }
  )

  images.forEach((img) => imageObserver.observe(img))

  return () => {
    images.forEach((img) => imageObserver.unobserve(img))
  }
}

/**
 * Cache management utilities
 */
export const cache = {
  /**
   * Get item from cache with TTL support
   */
  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null

    try {
      const item = localStorage.getItem(key)
      if (!item) return null

      const { value, expiry } = JSON.parse(item)
      
      if (expiry && Date.now() > expiry) {
        localStorage.removeItem(key)
        return null
      }

      return value as T
    } catch {
      return null
    }
  },

  /**
   * Set item in cache with optional TTL (in seconds)
   */
  set<T>(key: string, value: T, ttl?: number): void {
    if (typeof window === 'undefined') return

    try {
      const item = {
        value,
        expiry: ttl ? Date.now() + ttl * 1000 : null,
      }
      localStorage.setItem(key, JSON.stringify(item))
    } catch (error) {
      console.error('Cache set error:', error)
    }
  },

  /**
   * Remove item from cache
   */
  remove(key: string): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(key)
  },

  /**
   * Clear all cached items
   */
  clear(): void {
    if (typeof window === 'undefined') return
    localStorage.clear()
  },
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Preload critical resources
 */
export function preloadResources(resources: Array<{ href: string; as: string }>) {
  if (typeof window === 'undefined') return

  resources.forEach(({ href, as }) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = href
    link.as = as
    document.head.appendChild(link)
  })
}

/**
 * Prefetch next page resources
 */
export function prefetchPage(url: string) {
  if (typeof window === 'undefined') return

  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = url
  document.head.appendChild(link)
}

/**
 * Performance monitoring
 */
export const performance = {
  /**
   * Measure page load performance
   */
  measurePageLoad() {
    if (typeof window === 'undefined') return null

    const perfData = window.performance.timing
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart
    const connectTime = perfData.responseEnd - perfData.requestStart
    const renderTime = perfData.domComplete - perfData.domLoading

    return {
      pageLoadTime,
      connectTime,
      renderTime,
    }
  },

  /**
   * Mark a custom performance point
   */
  mark(name: string) {
    if (typeof window === 'undefined') return
    window.performance.mark(name)
  },

  /**
   * Measure between two performance marks
   */
  measure(name: string, startMark: string, endMark: string) {
    if (typeof window === 'undefined') return null

    try {
      window.performance.measure(name, startMark, endMark)
      const measures = window.performance.getEntriesByName(name)
      return measures[measures.length - 1]?.duration || null
    } catch {
      return null
    }
  },
}

/**
 * Bundle size optimization - dynamic imports helper
 */
export async function loadComponent<T>(
  importFn: () => Promise<{ default: T }>
): Promise<T> {
  const module = await importFn()
  return module.default
}

/**
 * Service Worker registration for PWA
 */
export function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('SW registered:', registration)
      })
      .catch((error) => {
        console.log('SW registration failed:', error)
      })
  })
}
