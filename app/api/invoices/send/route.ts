import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'
import { generateInvoicePDF, generateInvoiceNumber } from '@/lib/invoice-generator'
import { sendEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      )
    }

    const { orderId } = await request.json()

    if (!orderId) {
      return new Response(
        JSON.stringify({ error: 'Order ID is required' }),
        { status: 400 }
      )
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
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
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        { status: 404 }
      )
    }

    // Check if user owns this order
    const userId = (session.user as any).id
    if (order.userId !== userId && (session.user as any).role !== 'ADMIN') {
      return new Response(
        JSON.stringify({ error: 'Forbidden' }),
        { status: 403 }
      )
    }

    // Generate invoice
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

    const pdfBuffer = await generateInvoicePDF(invoiceData)

    // Send email with invoice attachment
    await sendEmail({
      to: order.user?.email || '',
      subject: `Invoice ${invoiceNumber} - Order ${order.orderNumber}`,
      text: `Dear ${order.user?.name || 'Customer'},\n\nThank you for your order! Please find your invoice attached.\n\nOrder Number: ${order.orderNumber}\nInvoice Number: ${invoiceNumber}\nTotal: $${order.total.toFixed(2)}\n\nBest regards,\nAlgol Digital Solutions`,
      html: `
        <h2>Invoice for Order ${order.orderNumber}</h2>
        <p>Dear ${order.user?.name || 'Customer'},</p>
        <p>Thank you for your order! Please find your invoice attached.</p>
        <ul>
          <li><strong>Order Number:</strong> ${order.orderNumber}</li>
          <li><strong>Invoice Number:</strong> ${invoiceNumber}</li>
          <li><strong>Total:</strong> $${order.total.toFixed(2)}</li>
        </ul>
        <p>Best regards,<br>Algol Digital Solutions</p>
      `,
      attachments: [
        {
          filename: `invoice-${invoiceNumber}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    })

    return Response.json({
      success: true,
      invoiceNumber,
      message: 'Invoice sent successfully',
    })
  } catch (error: any) {
    console.error('Send invoice error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to send invoice' }),
      { status: 500 }
    )
  }
}
