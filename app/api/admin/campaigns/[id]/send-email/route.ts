import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { authOptions } from '@/lib/auth'
import { emailService } from '@/lib/email/service'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { recipients, testMode } = data

    // Get campaign with coupons
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        coupons: {
          include: {
            coupon: true,
          },
        },
      },
    })

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    if (campaign.coupons.length === 0) {
      return NextResponse.json(
        { error: 'Campaign must have at least one coupon' },
        { status: 400 }
      )
    }

    // Get the first coupon for the email
    const coupon = campaign.coupons[0].coupon

    // Get recipient list
    let emailList: string[] = []
    
    if (testMode && data.testEmail) {
      // Test mode: send to single email
      emailList = [data.testEmail]
    } else if (recipients === 'all') {
      // Send to all customers
      const customers = await prisma.customer.findMany({
        where: {
          email: { not: '' },
        },
        select: { email: true },
      })
      emailList = customers.map((c: any) => c.email).filter((e: any): e is string => e !== null)
    } else if (recipients === 'segment' && campaign.targetSegment) {
      // For now, send to all customers (segment filtering can be enhanced later)
      // In a real implementation, you'd maintain customer segments/tags
      const customers = await prisma.customer.findMany({
        where: {
          email: { not: '' },
        },
        select: { email: true },
      })
      emailList = customers.map((c: any) => c.email).filter((e: any): e is string => e !== null)
    } else if (Array.isArray(recipients)) {
      // Custom recipient list
      emailList = recipients
    }

    if (emailList.length === 0) {
      return NextResponse.json(
        { error: 'No recipients found' },
        { status: 400 }
      )
    }

    // Prepare email data
    const emailData = {
      customerName: 'Valued Customer',
      campaignName: campaign.name,
      couponCode: coupon.code,
      discount: coupon.type === 'PERCENTAGE' 
        ? `${coupon.value}% OFF`
        : coupon.type === 'FIXED_AMOUNT'
          ? `$${coupon.value} OFF`
          : 'FREE SHIPPING',
      validUntil: new Date(coupon.validUntil).toLocaleDateString(),
      minPurchase: coupon.minPurchase > 0 ? `$${coupon.minPurchase}` : undefined,
      ctaUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/products`,
    }

    // Send emails
    const successCount = await emailService.sendBulkCampaignEmails(emailList, emailData)

    // Track email sends in database
    if (!testMode) {
      for (const email of emailList) {
        await prisma.campaignEmail.create({
          data: {
            campaignId: campaign.id,
            email,
            status: 'SENT',
            sentAt: new Date(),
          },
        })
      }

      // Update campaign stats
      await prisma.campaign.update({
        where: { id: campaign.id },
        data: {
          emailsSent: campaign.emailsSent + successCount,
        },
      })
    }

    return NextResponse.json({
      success: true,
      sent: successCount,
      total: emailList.length,
      testMode,
    })
  } catch (error) {
    console.error('Failed to send campaign emails:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Track email opens
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const action = searchParams.get('action') // 'open' or 'click'

    if (!email || !action) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    const campaignEmail = await prisma.campaignEmail.findFirst({
      where: {
        campaignId: id,
        email,
      },
    })

    if (campaignEmail) {
      if (action === 'open' && !campaignEmail.openedAt) {
        await prisma.campaignEmail.update({
          where: { id: campaignEmail.id },
          data: {
            status: 'OPENED',
            openedAt: new Date(),
          },
        })

        await prisma.campaign.update({
          where: { id },
          data: {
            emailsOpened: { increment: 1 },
          },
        })
      } else if (action === 'click' && !campaignEmail.clickedAt) {
        await prisma.campaignEmail.update({
          where: { id: campaignEmail.id },
          data: {
            status: 'CLICKED',
            clickedAt: new Date(),
          },
        })

        await prisma.campaign.update({
          where: { id },
          data: {
            emailsClicked: { increment: 1 },
          },
        })
      }
    }

    // Return 1x1 transparent pixel for tracking
    if (action === 'open') {
      const pixel = Buffer.from(
        'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        'base64'
      )
      return new NextResponse(pixel, {
        headers: {
          'Content-Type': 'image/gif',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      })
    }

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/products`
    )
  } catch (error) {
    console.error('Failed to track email:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
