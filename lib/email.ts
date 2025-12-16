import nodemailer from 'nodemailer'

// Configure your email service (Gmail, SendGrid, AWS SES, etc.)
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

export interface EmailTemplate {
  to: string
  subject: string
  html: string
  text?: string
  attachments?: Array<{
    filename: string
    content: Buffer
    contentType?: string
  }>
}

// Order confirmation email
export function orderConfirmationEmail(
  email: string,
  orderId: string,
  total: number,
  items: Array<{ name: string; quantity: number; price: number }>
): EmailTemplate {
  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        ${item.name}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        x${item.quantity}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        $${(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `
    )
    .join('')

  return {
    to: email,
    subject: `Order Confirmation - #${orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af;">Order Confirmation</h2>
        <p>Thank you for your order!</p>
        
        <div style="background: #f3f4f6; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <p><strong>Order ID:</strong> #${orderId}</p>
          <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>

        <h3>Order Items:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f3f4f6;">
              <th style="padding: 10px; text-align: left;">Product</th>
              <th style="padding: 10px; text-align: right;">Quantity</th>
              <th style="padding: 10px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="text-align: right; margin-top: 20px; padding-top: 20px; border-top: 2px solid #1e40af;">
          <h3 style="color: #1e40af;">Total: $${total.toFixed(2)}</h3>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
          <p>You'll receive a shipping notification once your order ships.</p>
          <p>Track your order at: <a href="http://localhost:3000/account">Your Account</a></p>
        </div>
      </div>
    `,
    text: `
Order Confirmation - #${orderId}

Thank you for your order!

Order ID: #${orderId}
Order Date: ${new Date().toLocaleDateString()}

Items:
${items.map((item) => `${item.name} x${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`).join('\n')}

Total: $${total.toFixed(2)}

Track your order at: http://localhost:3000/account
    `,
  }
}

// Shipping notification email
export function shippingNotificationEmail(
  email: string,
  orderId: string,
  trackingNumber: string,
  carrier: string
): EmailTemplate {
  return {
    to: email,
    subject: `Your Order #${orderId} Has Shipped!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Order Shipped!</h2>
        <p>Great news! Your order has been shipped.</p>
        
        <div style="background: #dcfce7; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #16a34a;">
          <p><strong>Order ID:</strong> #${orderId}</p>
          <p><strong>Carrier:</strong> ${carrier}</p>
          <p><strong>Tracking Number:</strong> <code style="background: #f3f4f6; padding: 2px 6px;">${trackingNumber}</code></p>
        </div>

        <p>You can track your shipment using the tracking number above on the ${carrier} website.</p>

        <div style="margin-top: 30px; padding: 20px; background: #f3f4f6; border-radius: 8px;">
          <a href="http://localhost:3000/account" style="display: inline-block; background: #1e40af; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Track Order</a>
        </div>
      </div>
    `,
    text: `
Order Shipped!

Great news! Your order has been shipped.

Order ID: #${orderId}
Carrier: ${carrier}
Tracking Number: ${trackingNumber}

Track your order at: http://localhost:3000/account
    `,
  }
}

// Account verification email
export function accountVerificationEmail(
  email: string,
  verificationLink: string
): EmailTemplate {
  return {
    to: email,
    subject: 'Verify Your Algol Insights Account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af;">Welcome to Algol Insights!</h2>
        <p>Thank you for creating an account. Please verify your email address to get started.</p>
        
        <div style="margin: 30px 0;">
          <a href="${verificationLink}" style="display: inline-block; background: #1e40af; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email</a>
        </div>

        <p>Or copy and paste this link:</p>
        <p style="word-break: break-all; color: #666;">${verificationLink}</p>

        <p style="margin-top: 30px; color: #666; font-size: 12px;">This link expires in 24 hours.</p>
      </div>
    `,
    text: `
Welcome to Algol Insights!

Thank you for creating an account. Please verify your email address to get started.

Verify your email: ${verificationLink}

This link expires in 24 hours.
    `,
  }
}

// Send email function
export async function sendEmail(emailTemplate: EmailTemplate): Promise<boolean> {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn('Email credentials not configured. Email not sent.')
      return false
    }

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      ...emailTemplate,
    })

    console.log(`Email sent to ${emailTemplate.to}`)
    return true
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}
