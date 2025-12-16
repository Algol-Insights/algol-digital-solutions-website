/**
 * Discount & Coupon Management
 */

export type CouponType = 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING'

export interface Coupon {
  id: string
  code: string
  description?: string | null
  type: CouponType
  value: number
  minPurchase: number
  maxDiscount?: number | null
  usageLimit?: number | null
  usageCount: number
  validFrom: Date
  validUntil: Date
  isActive: boolean
}

export interface DiscountResult {
  valid: boolean
  discount: number
  message: string
  coupon?: Coupon
}

/**
 * Validate and calculate coupon discount
 */
export function calculateCouponDiscount(
  coupon: Coupon,
  subtotal: number,
  shippingCost: number
): DiscountResult {
  // Check if coupon is active
  if (!coupon.isActive) {
    return {
      valid: false,
      discount: 0,
      message: 'This coupon is not active',
    }
  }

  // Check validity period
  const now = new Date()
  if (now < coupon.validFrom || now > coupon.validUntil) {
    return {
      valid: false,
      discount: 0,
      message: 'This coupon has expired or is not yet valid',
    }
  }

  // Check usage limit
  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    return {
      valid: false,
      discount: 0,
      message: 'This coupon has reached its usage limit',
    }
  }

  // Check minimum purchase
  if (subtotal < coupon.minPurchase) {
    return {
      valid: false,
      discount: 0,
      message: `Minimum purchase of $${coupon.minPurchase.toFixed(2)} required`,
    }
  }

  // Calculate discount
  let discount = 0

  switch (coupon.type) {
    case 'PERCENTAGE':
      discount = subtotal * (coupon.value / 100)
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount)
      }
      break

    case 'FIXED_AMOUNT':
      discount = coupon.value
      break

    case 'FREE_SHIPPING':
      discount = shippingCost
      break

    default:
      return {
        valid: false,
        discount: 0,
        message: 'Invalid coupon type',
      }
  }

  // Ensure discount doesn't exceed subtotal
  discount = Math.min(discount, subtotal)

  return {
    valid: true,
    discount,
    message: `Coupon applied! You saved $${discount.toFixed(2)}`,
    coupon,
  }
}

/**
 * Generate random coupon code
 */
export function generateCouponCode(prefix: string = 'PROMO'): string {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `${prefix}${random}`
}

/**
 * Format coupon description for display
 */
export function formatCouponDescription(coupon: Coupon): string {
  switch (coupon.type) {
    case 'PERCENTAGE':
      return `${coupon.value}% off${coupon.maxDiscount ? ` (max $${coupon.maxDiscount})` : ''}`

    case 'FIXED_AMOUNT':
      return `$${coupon.value} off`

    case 'FREE_SHIPPING':
      return 'Free shipping'

    default:
      return coupon.description || 'Discount'
  }
}
