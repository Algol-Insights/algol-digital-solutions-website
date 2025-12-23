/**
 * Email notification system for orders and payments
 */

import nodemailer from 'nodemailer'

export interface EmailConfig {
  service: string
  email: string
  password: string
  fromName?: string
}

export interface OrderEmailData {
  customerName: string
  customerEmail: string
  orderId: string
  orderDate: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  subtotal: number
  tax: number
  shipping: number
  total: number
  trackingUrl?: string
}

export interface PaymentEmailData {
  customerName: string
  customerEmail: string
  orderId: string
  transactionId: string
  amount: number
  currency: string
  paymentMethod: string
  date: string
}

export interface WelcomeEmailData {
  customerName: string
  customerEmail: string
  verificationLink: string
}

// Email transporter setup
let transporter: nodemailer.Transporter | null = null

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    const emailService = process.env.EMAIL_SERVICE || 'gmail'
    const emailUser = process.env.EMAIL_USER || 'noreply@algoldigital.com'
    const emailPassword = process.env.EMAIL_PASSWORD || ''

    transporter = nodemailer.createTransport({
      service: emailService,
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    })
  }
  return transporter
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmationEmail(data: OrderEmailData): Promise<boolean> {
  try {
    const transporter = getTransporter()

    const itemsHtml = data.items
      .map(
        (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <strong>${item.name}</strong><br>
          Qty: ${item.quantity}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
          $${(item.price * item.quantity).toFixed(2)}
        </td>
      </tr>
    `,
      )
      .join('')

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { background-color: #0066cc; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .order-details { background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; }
            table { width: 100%; border-collapse: collapse; }
            .summary { text-align: right; margin-top: 20px; }
            .button { display: inline-block; background-color: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Order Confirmation</h1>
            </div>
            <div class="content">
              <p>Hi ${data.customerName},</p>
              <p>Thank you for your order! We're preparing it for delivery.</p>
              
              <div class="order-details">
                <h2>Order Details</h2>
                <p><strong>Order ID:</strong> ${data.orderId}</p>
                <p><strong>Order Date:</strong> ${data.orderDate}</p>
                
                <h3>Items</h3>
                <table>
                  ${itemsHtml}
                </table>
                
                <div class="summary">
                  <p><strong>Subtotal:</strong> $${data.subtotal.toFixed(2)}</p>
                  <p><strong>Tax:</strong> $${data.tax.toFixed(2)}</p>
                  <p><strong>Delivery:</strong> ${data.shipping === 0 ? 'FREE (Harare)' : `$${data.shipping.toFixed(2)}`}</p>
                  <p style="font-size: 18px; border-top: 1px solid #ddd; padding-top: 10px;">
                    <strong>Total: $${data.total.toFixed(2)}</strong>
                  </p>
                </div>
              </div>
              
              ${data.trackingUrl ? `<a href="${data.trackingUrl}" class="button">Track Order</a>` : ''}
              
              <p style="margin-top: 30px; color: #666; font-size: 12px;">
                If you have any questions, please contact our support team.
              </p>
            </div>
          </div>
        </body>
      </html>
    `

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@algoldigital.com',
      to: data.customerEmail,
      subject: `Order Confirmation - ${data.orderId}`,
      html: htmlContent,
      text: `
Order Confirmation

Hi ${data.customerName},

Thank you for your order! Order ID: ${data.orderId}

Items:
${data.items.map((item) => `- ${item.name} x${item.quantity}: $${(item.price * item.quantity).toFixed(2)}`).join('\n')}

Total: $${data.total.toFixed(2)}

Track your order at: ${data.trackingUrl || 'https://algoldigitalsolutions.com/order-tracking'}
      `,
    })

    console.log(`[EMAIL] Order confirmation sent to ${data.customerEmail}`)
    return true
  } catch (error) {
    console.error('[EMAIL] Failed to send order confirmation:', error)
    return false
  }
}

/**
 * Send payment receipt email
 */
export async function sendPaymentReceiptEmail(data: PaymentEmailData): Promise<boolean> {
  try {
    const transporter = getTransporter()

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { background-color: #28a745; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .receipt { background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .success { color: #28a745; font-size: 18px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✓ Payment Successful</h1>
            </div>
            <div class="content">
              <p>Hi ${data.customerName},</p>
              <p class="success">Your payment has been received and confirmed!</p>
              
              <div class="receipt">
                <h2>Payment Receipt</h2>
                <p><strong>Order ID:</strong> ${data.orderId}</p>
                <p><strong>Transaction ID:</strong> ${data.transactionId}</p>
                <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>
                <p><strong>Date:</strong> ${data.date}</p>
                
                <div style="border-top: 1px solid #ddd; padding-top: 10px; margin-top: 10px;">
                  <p style="font-size: 18px;">
                    <strong>Amount Paid: ${data.currency} ${data.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                  </p>
                </div>
              </div>
              
              <p>Your order is being prepared for delivery. You can track your order <a href="https://algoldigitalsolutions.com/order-tracking">here</a>.</p>
              
              <p style="margin-top: 30px; color: #666; font-size: 12px;">
                Thank you for your business!
              </p>
            </div>
          </div>
        </body>
      </html>
    `

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@algoldigital.com',
      to: data.customerEmail,
      subject: `Payment Receipt - ${data.orderId}`,
      html: htmlContent,
      text: `
Payment Receipt

Hi ${data.customerName},

Your payment has been received!

Order ID: ${data.orderId}
Transaction ID: ${data.transactionId}
Amount: ${data.currency} ${data.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
Payment Method: ${data.paymentMethod}
Date: ${data.date}

Thank you for your purchase!
      `,
    })

    console.log(`[EMAIL] Payment receipt sent to ${data.customerEmail}`)
    return true
  } catch (error) {
    console.error('[EMAIL] Failed to send payment receipt:', error)
    return false
  }
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<boolean> {
  try {
    const transporter = getTransporter()

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { background-color: #0066cc; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .button { display: inline-block; background-color: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Algol Digital Solutions!</h1>
            </div>
            <div class="content">
              <p>Hi ${data.customerName},</p>
              <p>Welcome! We're excited to have you as part of our community.</p>
              
              <p>Please verify your email to get started:</p>
              <a href="${data.verificationLink}" class="button">Verify Email</a>
              
              <p style="margin-top: 30px; color: #666; font-size: 12px;">
                If you didn't sign up for this account, you can safely ignore this email.
              </p>
            </div>
          </div>
        </body>
      </html>
    `

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@algoldigital.com',
      to: data.customerEmail,
      subject: 'Welcome to Algol Digital Solutions!',
      html: htmlContent,
      text: `
Welcome to Algol Digital Solutions!

Hi ${data.customerName},

Please verify your email: ${data.verificationLink}
      `,
    })

    console.log(`[EMAIL] Welcome email sent to ${data.customerEmail}`)
    return true
  } catch (error) {
    console.error('[EMAIL] Failed to send welcome email:', error)
    return false
  }
}

/**
 * Send delivery notification
 */
export async function sendShippingNotificationEmail(data: {
  customerName: string
  customerEmail: string
  orderId: string
  trackingNumber: string
  carrier: string
  trackingUrl: string
  estimatedDelivery: string
}): Promise<boolean> {
  try {
    const transporter = getTransporter()

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { background-color: #ff9800; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .tracking-box { background-color: #fff3cd; border-left: 4px solid #ff9800; padding: 15px; margin: 20px 0; }
            .button { display: inline-block; background-color: #ff9800; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your Order is Out for Delivery!</h1>
            </div>
            <div class="content">
              <p>Hi ${data.customerName},</p>
              <p>Great news! Your order is on its way to you.</p>
              
              <div class="tracking-box">
                <h3 style="margin-top: 0;">Delivery Information</h3>
                <p><strong>Order ID:</strong> ${data.orderId}</p>
                <p><strong>Courier:</strong> ${data.carrier}</p>
                <p><strong>Tracking Number:</strong> <code>${data.trackingNumber}</code></p>
                <p><strong>Estimated Delivery:</strong> ${data.estimatedDelivery}</p>
              </div>
              
              <a href="${data.trackingUrl}" class="button">Track Your Order</a>
              
              <p style="margin-top: 30px; color: #666; font-size: 12px;">
                Thank you for your purchase!
              </p>
            </div>
          </div>
        </body>
      </html>
    `

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@algoldigital.com',
      to: data.customerEmail,
      subject: `Your Order is Out for Delivery - ${data.orderId}`,
      html: htmlContent,
    })

    console.log(`[EMAIL] Delivery notification sent to ${data.customerEmail}`)
    return true
  } catch (error) {
    console.error('[EMAIL] Failed to send delivery notification:', error)
    return false
  }
}
