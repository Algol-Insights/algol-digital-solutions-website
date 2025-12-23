type CacheEntry<T> = { value: T; expiresAt: number }

export class TTLCache<T> {
  private store: Map<string, CacheEntry<T>>
  private maxEntries: number
  private defaultTtlMs: number

  constructor(maxEntries: number = 500, defaultTtlMs: number = 60_000) {
    this.store = new Map()
    this.maxEntries = maxEntries
    this.defaultTtlMs = defaultTtlMs
  }

  get(key: string): T | undefined {
    const entry = this.store.get(key)
    if (!entry) return undefined
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return undefined
    }
    return entry.value
  }

  set(key: string, value: T, ttlMs?: number) {
    if (this.store.size >= this.maxEntries) {
      const oldestKey = this.store.keys().next().value
      if (oldestKey) this.store.delete(oldestKey)
    }
    const expiresAt = Date.now() + (ttlMs ?? this.defaultTtlMs)
    this.store.set(key, { value, expiresAt })
  }

  delete(key: string) {
    this.store.delete(key)
  }

  clear() {
    this.store.clear()
  }
}

// Shared cache instances for hot-reload safety in dev
const globalAny = global as any
if (!globalAny.__TTL_PRODUCT_CACHE) {
  globalAny.__TTL_PRODUCT_CACHE = new TTLCache<any>(500, 30_000)
}

export const productCache: TTLCache<any> = globalAny.__TTL_PRODUCT_CACHE
