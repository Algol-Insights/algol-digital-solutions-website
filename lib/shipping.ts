/**
 * Shipping Integration
 * Support for multiple carriers and shipping methods
 */

export type ShippingCarrier = 'standard' | 'express' | 'overnight' | 'international'

export interface ShippingRate {
  carrier: ShippingCarrier
  name: string
  description: string
  estimatedDays: string
  price: number
  icon: string
}

export interface ShippingAddress {
  fullName: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
}

export interface TrackingInfo {
  trackingNumber: string
  carrier: ShippingCarrier
  status: 'pending' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed'
  estimatedDelivery: Date
  currentLocation?: string
  updates: Array<{
    timestamp: Date
    location: string
    status: string
    description: string
  }>
}

// Available shipping rates
export const SHIPPING_RATES: ShippingRate[] = [
  {
    carrier: 'standard',
    name: 'Standard Shipping',
    description: 'Delivered in 5-7 business days',
    estimatedDays: '5-7 days',
    price: 5.99,
    icon: '📦',
  },
  {
    carrier: 'express',
    name: 'Express Shipping',
    description: 'Delivered in 2-3 business days',
    estimatedDays: '2-3 days',
    price: 12.99,
    icon: '🚚',
  },
  {
    carrier: 'overnight',
    name: 'Overnight Delivery',
    description: 'Next business day delivery',
    estimatedDays: '1 day',
    price: 24.99,
    icon: '⚡',
  },
  {
    carrier: 'international',
    name: 'International Shipping',
    description: 'Delivered in 10-15 business days',
    estimatedDays: '10-15 days',
    price: 29.99,
    icon: '✈️',
  },
]

/**
 * Calculate shipping cost based on weight and destination
 */
export function calculateShippingCost(
  carrier: ShippingCarrier,
  weight: number,
  destination: string
): number {
  const baseRate = SHIPPING_RATES.find((r) => r.carrier === carrier)?.price || 0

  // Add weight-based charges (per kg)
  const weightCharge = Math.max(0, (weight - 5) * 2)

  // International shipping multiplier
  const internationalMultiplier = destination !== 'US' ? 1.5 : 1

  return (baseRate + weightCharge) * internationalMultiplier
}

/**
 * Estimate delivery date
 */
export function estimateDeliveryDate(carrier: ShippingCarrier): Date {
  const today = new Date()
  const days = {
    standard: 7,
    express: 3,
    overnight: 1,
    international: 15,
  }

  const deliveryDate = new Date(today)
  deliveryDate.setDate(today.getDate() + days[carrier])
  return deliveryDate
}

/**
 * Generate tracking number
 */
export function generateTrackingNumber(carrier: ShippingCarrier): string {
  const prefix = {
    standard: 'STD',
    express: 'EXP',
    overnight: 'OVN',
    international: 'INT',
  }

  const random = Math.random().toString(36).substring(2, 12).toUpperCase()
  return `${prefix[carrier]}-${random}`
}

/**
 * Validate shipping address
 */
export function validateShippingAddress(address: ShippingAddress): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!address.fullName || address.fullName.trim().length < 2) {
    errors.push('Full name is required')
  }

  if (!address.addressLine1 || address.addressLine1.trim().length < 5) {
    errors.push('Address line 1 is required')
  }

  if (!address.city || address.city.trim().length < 2) {
    errors.push('City is required')
  }

  if (!address.state || address.state.trim().length < 2) {
    errors.push('State/Province is required')
  }

  if (!address.postalCode || address.postalCode.trim().length < 3) {
    errors.push('Postal code is required')
  }

  if (!address.country || address.country.trim().length < 2) {
    errors.push('Country is required')
  }

  if (!address.phone || address.phone.trim().length < 10) {
    errors.push('Valid phone number is required')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Mock tracking API - simulate carrier tracking
 */
export async function getTrackingInfo(trackingNumber: string): Promise<TrackingInfo> {
  // In production, call real carrier API
  // For now, return mock data
  const carrierPrefix = trackingNumber.split('-')[0].toLowerCase()
  
  // Map carrier prefix to ShippingCarrier type
  const carrierMap: Record<string, ShippingCarrier> = {
    'std': 'standard',
    'standard': 'standard',
    'exp': 'express',
    'express': 'express',
    'ovn': 'overnight',
    'overnight': 'overnight',
    'int': 'international',
    'international': 'international',
  }
  
  const carrier: ShippingCarrier = carrierMap[carrierPrefix] || 'standard'

  return {
    trackingNumber,
    carrier,
    status: 'in_transit',
    estimatedDelivery: estimateDeliveryDate(carrier === 'standard' ? 'standard' : 'express'),
    currentLocation: 'Distribution Center, City',
    updates: [
      {
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        location: 'Origin Facility',
        status: 'Package received',
        description: 'Your package has been received at our facility',
      },
      {
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        location: 'In Transit',
        status: 'In transit',
        description: 'Package is on the way to destination',
      },
      {
        timestamp: new Date(),
        location: 'Distribution Center',
        status: 'In transit',
        description: 'Package arrived at distribution center',
      },
    ],
  }
}
