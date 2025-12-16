/**
 * PayPal Commerce Platform Integration
 */

export interface PayPalOrderConfig {
  amount: number
  currency: string
  reference: string
  customerEmail: string
  customerName: string
  items?: Array<{
    name: string
    quantity: number
    unitAmount: number
  }>
}

export interface PayPalOrderResponse {
  id: string
  status: 'CREATED' | 'SAVED' | 'APPROVED' | 'VOIDED' | 'COMPLETED'
  links: Array<{
    rel: string
    href: string
    method?: string
  }>
}

/**
 * Create PayPal order
 */
export async function createPayPalOrder(
  config: PayPalOrderConfig
): Promise<PayPalOrderResponse> {
  try {
    const response = await fetch('/api/payments/paypal/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create PayPal order')
    }

    return await response.json()
  } catch (error: any) {
    throw new Error(error.message || 'PayPal order creation failed')
  }
}

/**
 * Capture PayPal order payment
 */
export async function capturePayPalOrder(orderId: string): Promise<any> {
  try {
    const response = await fetch('/api/payments/paypal/capture-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to capture PayPal order')
    }

    return await response.json()
  } catch (error: any) {
    throw new Error(error.message || 'PayPal capture failed')
  }
}
