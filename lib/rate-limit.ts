type Bucket = { tokens: number; updatedAt: number }

export class TokenBucketLimiter {
  private buckets = new Map<string, Bucket>()
  private capacity: number
  private refillPerMs: number

  constructor(capacity: number, windowMs: number) {
    this.capacity = capacity
    this.refillPerMs = capacity / windowMs
  }

  consume(key: string, tokens: number = 1) {
    const now = Date.now()
    const bucket = this.buckets.get(key) || { tokens: this.capacity, updatedAt: now }
    const elapsed = now - bucket.updatedAt
    const refilled = Math.min(this.capacity, bucket.tokens + elapsed * this.refillPerMs)
    const remaining = refilled - tokens

    if (remaining < 0) {
      const retryAfterMs = Math.ceil(Math.abs(remaining) / this.refillPerMs)
      this.buckets.set(key, { tokens: refilled, updatedAt: now })
      return { ok: false, remaining: 0, retryAfterMs }
    }

    this.buckets.set(key, { tokens: remaining, updatedAt: now })
    return { ok: true, remaining }
  }
}

const globalAny = global as any
if (!globalAny.__TOKEN_BUCKET_PRODUCTS) {
  // 60 requests per minute default
  globalAny.__TOKEN_BUCKET_PRODUCTS = new TokenBucketLimiter(60, 60_000)
}

export const productRateLimiter: TokenBucketLimiter = globalAny.__TOKEN_BUCKET_PRODUCTS
