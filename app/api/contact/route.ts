import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

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
        phone: phone || null,
        subject,
        message,
        service: service || null,
        status: "NEW",
      },
    })

    // TODO: Send email notification to admin
    // TODO: Send confirmation email to customer

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
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    const where = status ? { status } : {}

    const inquiries = await prisma.contactInquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(inquiries)
  } catch (error) {
    console.error("Failed to fetch inquiries:", error)
    return NextResponse.json(
      { error: "Failed to fetch inquiries" },
      { status: 500 }
    )
  }
}
