import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'
import { generateInvoicePDF, generateInvoiceNumber } from '@/lib/invoice-generator'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { id } = await params

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    })

    if (!order) {
      return new Response('Order not found', { status: 404 })
    }

    // Check if user owns this order
    const userId = (session.user as any).id
    if (order.userId !== userId && (session.user as any).role !== 'ADMIN') {
      return new Response('Forbidden', { status: 403 })
    }

    // Generate invoice data
    const invoiceNumber = generateInvoiceNumber(order.id)
    const invoiceData = {
      invoiceNumber,
      orderNumber: order.orderNumber,
      date: order.createdAt,
      customer: {
        name: order.user?.name || 'Guest',
        email: order.user?.email || '',
        address: order.shippingAddress || undefined,
      },
      items: order.orderItems.map((item) => ({
        name: item.product?.name || 'Unknown Product',
        description: item.product?.description || undefined,
        quantity: item.quantity,
        unitPrice: item.price,
        total: item.price * item.quantity,
      })),
      subtotal: order.subtotal,
      tax: order.tax,
      shipping: order.shipping,
      total: order.total,
      paymentMethod: order.paymentMethod || undefined,
      transactionId: order.transactionId || undefined,
    }

    // Generate PDF
    const pdfBuffer = await generateInvoicePDF(invoiceData)

    // Return PDF
    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${invoiceNumber}.pdf"`,
      },
    })
  } catch (error: any) {
    console.error('Invoice generation error:', error)
    return new Response(error.message || 'Failed to generate invoice', {
      status: 500,
    })
    }
  }
