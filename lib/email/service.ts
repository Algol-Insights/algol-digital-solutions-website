// Email client using Resend (you can swap for SendGrid/Mailgun etc)
// Install: npm install resend

interface EmailTemplate {
  to: string | string[]
  subject: string
  html: string
  from?: string
}

interface CampaignEmailData {
  customerName: string
  campaignName: string
  couponCode: string
  discount: string
  validUntil: string
  minPurchase?: string
  ctaUrl: string
}

export class EmailService {
  private apiKey: string
  private fromEmail: string

  constructor() {
    this.apiKey = process.env.RESEND_API_KEY || ''
    this.fromEmail = process.env.EMAIL_FROM || 'noreply@algoldigitalsolutions.com'
  }

  async send(template: EmailTemplate): Promise<boolean> {
    if (!this.apiKey) {
      console.warn('Email API key not configured')
      return false
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: template.from || this.fromEmail,
          to: Array.isArray(template.to) ? template.to : [template.to],
          subject: template.subject,
          html: template.html,
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        console.error('Email send failed:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Email send error:', error)
      return false
    }
  }

  async sendCampaignEmail(to: string, data: CampaignEmailData): Promise<boolean> {
    const html = this.generateCampaignEmailHTML(data)
    
    return this.send({
      to,
      subject: `Special Offer: ${data.campaignName}`,
      html,
    })
  }

  async sendBulkCampaignEmails(recipients: string[], data: CampaignEmailData): Promise<number> {
    let successCount = 0
    
    for (const email of recipients) {
      const sent = await this.sendCampaignEmail(email, {
        ...data,
        customerName: email.split('@')[0], // Simple name extraction
      })
      if (sent) successCount++
      
      // Rate limiting - wait 100ms between emails
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    return successCount
  }

  private generateCampaignEmailHTML(data: CampaignEmailData): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.campaignName}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .container {
      background: #ffffff;
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #2563eb;
      margin-bottom: 10px;
    }
    .title {
      font-size: 28px;
      font-weight: bold;
      color: #1f2937;
      margin-bottom: 10px;
    }
    .discount {
      font-size: 48px;
      font-weight: bold;
      color: #2563eb;
      margin: 20px 0;
    }
    .coupon-code {
      background: #f3f4f6;
      border: 2px dashed #2563eb;
      padding: 15px;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      letter-spacing: 2px;
      margin: 20px 0;
      border-radius: 8px;
    }
    .details {
      background: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .detail-item {
      margin: 10px 0;
      font-size: 14px;
      color: #6b7280;
    }
    .cta-button {
      display: inline-block;
      background: #2563eb;
      color: #ffffff;
      text-decoration: none;
      padding: 15px 40px;
      border-radius: 8px;
      font-weight: bold;
      margin: 20px 0;
      text-align: center;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 12px;
      color: #9ca3af;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Algol Digital Solutions</div>
      <div class="title">${data.campaignName}</div>
    </div>

    <p>Hi ${data.customerName},</p>
    
    <p>We have an exclusive offer just for you!</p>

    <div class="discount">${data.discount}</div>

    <div class="coupon-code">
      ${data.couponCode}
    </div>

    <div class="details">
      <div class="detail-item">
        <strong>Valid Until:</strong> ${data.validUntil}
      </div>
      ${data.minPurchase ? `
      <div class="detail-item">
        <strong>Minimum Purchase:</strong> ${data.minPurchase}
      </div>
      ` : ''}
      <div class="detail-item">
        <strong>How to Use:</strong> Enter the coupon code at checkout
      </div>
    </div>

    <div style="text-align: center;">
      <a href="${data.ctaUrl}" class="cta-button">Shop Now</a>
    </div>

    <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
      Don't miss out on this special offer. Visit our store and use your coupon code before it expires!
    </p>

    <div class="footer">
      <p>You're receiving this email because you're a valued customer.</p>
      <p>© ${new Date().getFullYear()} Algol Digital Solutions. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `.trim()
  }
}

// Singleton instance
export const emailService = new EmailService()
