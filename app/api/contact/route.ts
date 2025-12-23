import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { sendEmail } from "@/lib/email"
import { encryptString, decryptString } from '@/lib/encryption'
import { requireAdmin, handleAdminError } from '@/lib/admin-auth'
import { logAuditEvent } from '@/lib/audit'

// Email template for admin notification
function adminNotificationEmail(inquiry: {
  name: string
  email: string
  phone?: string | null
  subject: string
  message: string
  service?: string | null
  id: string
}) {
  return {
    to: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'admin@algoldigital.com',
    subject: `New Contact Inquiry: ${inquiry.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0d9488;">New Contact Inquiry</h2>
        
        <div style="background: #f3f4f6; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <p><strong>From:</strong> ${inquiry.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${inquiry.email}">${inquiry.email}</a></p>
          ${inquiry.phone ? `<p><strong>Phone:</strong> ${inquiry.phone}</p>` : ''}
          ${inquiry.service ? `<p><strong>Service Interest:</strong> ${inquiry.service}</p>` : ''}
          <p><strong>Subject:</strong> ${inquiry.subject}</p>
        </div>

        <h3>Message:</h3>
        <div style="background: #fff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <p style="white-space: pre-wrap;">${inquiry.message}</p>
        </div>

        <div style="margin-top: 20px; padding: 15px; background: #ecfdf5; border-radius: 8px;">
          <p><strong>Inquiry ID:</strong> ${inquiry.id}</p>
          <p><a href="${process.env.NEXTAUTH_URL || 'http://localhost:3007'}/admin">View in Admin Panel</a></p>
        </div>
      </div>
    `,
    text: `
New Contact Inquiry

From: ${inquiry.name}
Email: ${inquiry.email}
${inquiry.phone ? `Phone: ${inquiry.phone}` : ''}
${inquiry.service ? `Service: ${inquiry.service}` : ''}
Subject: ${inquiry.subject}

Message:
${inquiry.message}

Inquiry ID: ${inquiry.id}
    `,
  }
}

// Email template for customer confirmation
function customerConfirmationEmail(inquiry: {
  name: string
  email: string
  subject: string
}) {
  return {
    to: inquiry.email,
    subject: `We received your inquiry - ${inquiry.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0d9488;">Thank You for Contacting Us!</h2>
        
        <p>Hi ${inquiry.name},</p>
        
        <p>We've received your inquiry regarding "<strong>${inquiry.subject}</strong>" and our team will review it shortly.</p>

        <div style="background: #f0fdfa; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #0d9488;">
          <p><strong>What happens next?</strong></p>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>Our team will review your inquiry within 24 hours</li>
            <li>We'll reach out via email or phone if we need more details</li>
            <li>Expect a detailed response within 1-2 business days</li>
          </ul>
        </div>

        <p>If your matter is urgent, please call us directly at <strong>+263 24 212 3456</strong>.</p>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #666; font-size: 12px;">
          <p>Best regards,<br>The Algol Digital Solutions Team</p>
          <p>
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3007'}">www.algoldigital.co.zw</a> | 
            <a href="tel:+263242123456">+263 24 212 3456</a>
          </p>
        </div>
      </div>
    `,
    text: `
Thank You for Contacting Us!

Hi ${inquiry.name},

We've received your inquiry regarding "${inquiry.subject}" and our team will review it shortly.

What happens next?
- Our team will review your inquiry within 24 hours
- We'll reach out via email or phone if we need more details
- Expect a detailed response within 1-2 business days

If your matter is urgent, please call us directly at +263 24 212 3456.

Best regards,
The Algol Digital Solutions Team
    `,
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message, service } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Name, email, subject, and message are required" },
        { status: 400 }
      )
    }

    // Store contact inquiry in database
    const inquiry = await prisma.contactInquiry.create({
      data: {
        name,
        email,
        phone: encryptString(phone) || null,
        subject,
        message: encryptString(message) || '',
        service: service || null,
        status: "NEW",
      },
    })

    // Send email notification to admin (don't wait, fire and forget)
    sendEmail(adminNotificationEmail({ ...inquiry, phone, service })).catch(err => {
      console.error('Failed to send admin notification:', err)
    })

    // Send confirmation email to customer
    sendEmail(customerConfirmationEmail({ name, email, subject })).catch(err => {
      console.error('Failed to send customer confirmation:', err)
    })

    return NextResponse.json(
      { 
        success: true, 
        message: "Your inquiry has been submitted successfully. We'll get back to you within 24 hours.",
        inquiryId: inquiry.id
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Contact inquiry error:", error)
    return NextResponse.json(
      { error: "Failed to submit inquiry. Please try again or contact us directly." },
      { status: 500 }
    )
  }
}

// GET /api/contact - List all contact inquiries (Admin only)
export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request, 'admin:access')
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    const where = status ? { status } : {}

    const inquiries = await prisma.contactInquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    const decrypted = inquiries.map((i) => ({
      ...i,
      phone: decryptString(i.phone),
      message: decryptString(i.message) || '',
    }))

    await logAuditEvent({
      userId: admin.userId,
      action: 'CONTACT_INQUIRY_LIST',
      targetType: 'CONTACT_INQUIRY',
      status: 'SUCCESS',
      ip: admin.ip,
      userAgent: admin.userAgent,
      metadata: { status: status || 'all' },
    })

    return NextResponse.json(decrypted)
  } catch (error) {
    console.error("Failed to fetch inquiries:", error)
    await logAuditEvent({
      action: 'CONTACT_INQUIRY_LIST',
      targetType: 'CONTACT_INQUIRY',
      status: 'FAIL',
      metadata: { message: error instanceof Error ? error.message : 'Unknown error' },
    })
    if ((error as any)?.status) {
      return handleAdminError(error)
    }
    return NextResponse.json(
      { error: "Failed to fetch inquiries" },
      { status: 500 }
    )
  }
}
