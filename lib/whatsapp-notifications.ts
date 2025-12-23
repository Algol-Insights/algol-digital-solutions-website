/**
 * WhatsApp notification utilities for sending order details to sales team
 */

export interface OrderItem {
  name: string
  quantity: number
  price: number
  variant?: string
}

export interface OrderDetails {
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
  paymentMethod: string
  deliveryAddress: {
    address: string
    city: string
    province: string
  }
  notes?: string
}

/**
 * Format order details as WhatsApp message
 */
export function formatOrderForWhatsApp(order: OrderDetails): string {
  const itemsList = order.items
    .map(
      (item) =>
        `• ${item.name}${item.variant ? ` (${item.variant})` : ""}\n  Qty: ${item.quantity} × $${item.price.toFixed(2)} = $${(item.quantity * item.price).toFixed(2)}`
    )
    .join('\n\n')

  const message = `🛒 *NEW ORDER RECEIVED*

📋 *Order #${order.orderNumber}*

👤 *Customer Details:*
Name: ${order.customerName}
Email: ${order.customerEmail}
Phone: ${order.customerPhone}

📦 *Order Items:*
${itemsList}

📍 *Delivery Address:*
${order.deliveryAddress.address}
${order.deliveryAddress.city}, ${order.deliveryAddress.province}
Zimbabwe

💰 *Payment Summary:*
Subtotal: $${order.subtotal.toFixed(2)}
Delivery: ${order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}
*Total: $${order.total.toFixed(2)}*

💳 *Payment Method:* ${order.paymentMethod.toUpperCase()}
${order.notes ? `\n📝 *Notes:* ${order.notes}` : ''}

---
Please process this order promptly.`

  return message
}

/**
 * Send order notification via WhatsApp web link
 * Opens WhatsApp with pre-filled message to sales team
 */
export function sendOrderToWhatsApp(order: OrderDetails): void {
  const SALES_WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_SALES_WHATSAPP_NUMBER || "263788663313"
  const message = formatOrderForWhatsApp(order)
  const encodedMessage = encodeURIComponent(message)
  const whatsappUrl = `https://wa.me/${SALES_WHATSAPP_NUMBER}?text=${encodedMessage}`
  
  // Open WhatsApp in new window
  window.open(whatsappUrl, "_blank", "noopener,noreferrer")
}

/**
 * Get formatted payment method display name
 */
export function getPaymentMethodName(method: string): string {
  const names: Record<string, string> = {
    ecocash: 'EcoCash',
    innbucks: 'InnBucks',
    bank: 'Bank Transfer',
    cod: 'Cash on Delivery',
    other: 'Other Payment Method',
  }
  return names[method] || method
}
