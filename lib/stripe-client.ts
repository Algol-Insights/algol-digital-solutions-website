/**
 * Stripe Client Configuration
 * Frontend initialization for Stripe Elements
 */

export function getStripePublishableKey(): string {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  if (!key) {
    throw new Error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable')
  }
  return key
}

export interface StripePaymentConfig {
  clientSecret: string
  amount: number
  currency: string
  customerEmail?: string
  customerName?: string
}

/**
 * Load Stripe.js dynamically
 */
export async function loadStripe(): Promise<any> {
  if (typeof window === 'undefined') {
    return null
  }
  
  const script = document.createElement('script')
  script.src = 'https://js.stripe.com/v3/'
  script.async = true

  return new Promise((resolve, reject) => {
    script.onload = () => {
      resolve((window as any).Stripe)
    }
    script.onerror = () => {
      reject(new Error('Failed to load Stripe.js'))
    }
    document.body.appendChild(script)
  })
}

/**
 * Handle Stripe payment confirmation
 */
export async function handleStripePayment(
  stripe: any,
  elements: any,
  clientSecret: string,
  options?: {
    returnUrl?: string
  }
) {
  try {
    // Get return URL safely for SSR
    const getReturnUrl = () => {
      if (typeof window === 'undefined') return '/order-confirmation'
      return options?.returnUrl || `${window.location.origin}/order-confirmation`
    }

    const result = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: getReturnUrl(),
      },
    })

    if (result.error) {
      return {
        success: false,
        error: result.error.message,
      }
    }

    return {
      success: true,
      paymentIntent: result.paymentIntent,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Payment processing failed',
    }
  }
}
