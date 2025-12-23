import { sendEmail, EmailTemplate } from './email'

export interface OrderEmailData {
  orderNumber: string
  orderId: string
  total: number
  subtotal: number
  tax: number
  shipping: number
  items: Array<{ 
    name: string
    quantity: number
    price: number
    image?: string
  }>
  shippingAddress?: string
  estimatedDelivery?: Date
}

export interface ShippingEmailData {
  orderNumber: string
  orderId?: string
  trackingNumber?: string
  carrier?: string
  estimatedDelivery?: Date
  trackingUrl?: string
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmationEmail(email: string, data: OrderEmailData) {
  const itemsHtml = data.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        ${item.name}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
        $${item.price.toFixed(2)}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">
        $${(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `).join('')

  const emailTemplate: EmailTemplate = {
    to: email,
    subject: `Order Confirmed - ${data.orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"></head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" style="padding: 20px;">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 8px; overflow: hidden;">
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
                      <h1 style="color: white; margin: 0;">Thank You For Your Order!</h1>
                      <p style="color: white; margin: 10px 0 0;">Order #${data.orderNumber}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 30px;">
                      <p style="margin: 0 0 20px;">We've received your order and are processing it now.</p>
                      
                      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <strong>Order Date:</strong> ${new Date().toLocaleDateString()}<br>
                        ${data.estimatedDelivery ? `<strong>Estimated Delivery:</strong> ${data.estimatedDelivery.toLocaleDateString()}` : ''}
                      </div>

                      <h2>Order Items</h2>
                      <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 4px;">
                        <thead>
                          <tr style="background: #f9fafb;">
                            <th style="padding: 12px; text-align: left;">Product</th>
                            <th style="padding: 12px; text-align: center;">Qty</th>
                            <th style="padding: 12px; text-align: right;">Price</th>
                            <th style="padding: 12px; text-align: right;">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${itemsHtml}
                        </tbody>
                      </table>

                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
                        <tr>
                          <td style="text-align: right; padding: 5px;">Subtotal:</td>
                          <td style="text-align: right; padding: 5px; width: 100px;">$${data.subtotal.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td style="text-align: right; padding: 5px;">Tax:</td>
                          <td style="text-align: right; padding: 5px;">$${data.tax.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td style="text-align: right; padding: 5px;">Shipping:</td>
                          <td style="text-align: right; padding: 5px;">$${data.shipping.toFixed(2)}</td>
                        </tr>
                        <tr style="border-top: 2px solid #667eea;">
                          <td style="text-align: right; padding: 10px; font-size: 18px; font-weight: bold;">Total:</td>
                          <td style="text-align: right; padding: 10px; font-size: 18px; font-weight: bold; color: #667eea;">$${data.total.toFixed(2)}</td>
                        </tr>
                      </table>

                      ${data.shippingAddress ? `
                      <div style="margin-top: 20px;">
                        <h3>Shipping Address</h3>
                        <p style="white-space: pre-line;">${data.shippingAddress}</p>
                      </div>
                      ` : ''}

                      <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3007'}/account" 
                           style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                          Track Your Order
                        </a>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0; color: #6b7280; font-size: 14px;">
                        Questions? Email us at support@algol-digital.com
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    text: `
Order Confirmed - ${data.orderNumber}

Thank you for your order!

Order Number: ${data.orderNumber}
Order Date: ${new Date().toLocaleDateString()}

Items:
${data.items.map(item => `${item.name} x${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`).join('\n')}

Subtotal: $${data.subtotal.toFixed(2)}
Tax: $${data.tax.toFixed(2)}
Shipping: $${data.shipping.toFixed(2)}
Total: $${data.total.toFixed(2)}

Track your order at: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3007'}/account
    `
  }

  return await sendEmail(emailTemplate)
}

/**
 * Send shipping notification email
 */
export async function sendShippingNotificationEmail(email: string, data: ShippingEmailData) {
  const emailTemplate: EmailTemplate = {
    to: email,
    subject: `Your Order ${data.orderNumber} is On Its Way! 📦`,
    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" style="padding: 20px;">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 8px;">
                  <tr>
                    <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px; text-align: center;">
                      <div style="font-size: 48px;">📦</div>
                      <h1 style="color: white; margin: 10px 0;">Your Order Has Shipped!</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px;">
                      <p>Good news! Your order <strong>${data.orderNumber}</strong> is on its way!</p>
                      
                      <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0;">
                        ${data.trackingNumber ? `<p><strong>Tracking Number:</strong> ${data.trackingNumber}</p>` : ''}
                        ${data.carrier ? `<p><strong>Carrier:</strong> ${data.carrier}</p>` : ''}
                        ${data.estimatedDelivery ? `<p><strong>Estimated Delivery:</strong> ${data.estimatedDelivery.toLocaleDateString()}</p>` : ''}
                      </div>

                      <div style="text-align: center; margin: 30px 0;">
                        <a href="${data.trackingUrl || `${process.env.NEXT_PUBLIC_APP_URL}/order-tracking`}" 
                           style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                          Track Shipment
                        </a>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    text: `
Your Order ${data.orderNumber} Has Shipped!

${data.trackingNumber ? `Tracking Number: ${data.trackingNumber}` : ''}
${data.carrier ? `Carrier: ${data.carrier}` : ''}
${data.estimatedDelivery ? `Estimated Delivery: ${data.estimatedDelivery.toLocaleDateString()}` : ''}

Track your shipment: ${data.trackingUrl || `${process.env.NEXT_PUBLIC_APP_URL}/order-tracking`}
    `
  }

  return await sendEmail(emailTemplate)
}

/**
 * Send stock alert notification
 */
export async function sendStockAlertEmail(
  email: string,
  productName: string,
  productId: string,
  productImage?: string
) {
  const emailTemplate: EmailTemplate = {
    to: email,
    subject: `${productName} is Back in Stock! 🔔`,
    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" style="padding: 20px;">
                <table width="600" cellpadding="0" cellspacing="0" style="background: white; border-radius: 8px;">
                  <tr>
                    <td style="padding: 40px; text-align: center;">
                      ${productImage ? `<img src="${productImage}" alt="${productName}" style="width: 200px; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 20px;">` : ''}
                      <h1>Back in Stock!</h1>
                      <p style="font-size: 18px;"><strong>${productName}</strong> is now available.</p>
                      <div style="margin: 20px 0;">
                        <a href="${process.env.NEXT_PUBLIC_APP_URL}/products/${productId}" 
                           style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                          Shop Now
                        </a>
                      </div>
                      <p style="color: #6b7280; font-size: 14px;">Hurry! Limited stock available.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    text: `
${productName} is Back in Stock!

This item is now available. Shop now: ${process.env.NEXT_PUBLIC_APP_URL}/products/${productId}

Hurry! Limited stock available.
    `
  }

  return await sendEmail(emailTemplate)
}
