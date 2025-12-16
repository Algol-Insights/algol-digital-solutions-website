import PDFDocument from 'pdfkit'

export interface InvoiceData {
  invoiceNumber: string
  orderNumber: string
  date: Date
  customer: {
    name: string
    email: string
    address?: string
    phone?: string
  }
  items: Array<{
    name: string
    description?: string
    quantity: number
    unitPrice: number
    total: number
  }>
  subtotal: number
  tax: number
  shipping: number
  total: number
  paymentMethod?: string
  transactionId?: string
}

export async function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 })
      const chunks: Buffer[] = []

      doc.on('data', (chunk) => chunks.push(chunk))
      doc.on('end', () => resolve(Buffer.concat(chunks)))
      doc.on('error', reject)

      // Header
      doc
        .fontSize(20)
        .text('INVOICE', 50, 50, { align: 'center' })
        .moveDown()

      // Company Info
      doc
        .fontSize(10)
        .text('Algol Digital Solutions', 50, 100)
        .text('Digital Solutions & E-commerce', 50, 115)
        .text('Email: info@algol-digital.com', 50, 130)
        .text('Phone: +263 123 456 789', 50, 145)

      // Invoice Details
      doc
        .fontSize(10)
        .text(`Invoice Number: ${data.invoiceNumber}`, 350, 100, { align: 'right' })
        .text(`Order Number: ${data.orderNumber}`, 350, 115, { align: 'right' })
        .text(`Date: ${data.date.toLocaleDateString()}`, 350, 130, { align: 'right' })

      // Customer Info
      doc
        .moveDown()
        .fontSize(12)
        .text('Bill To:', 50, 180)
        .fontSize(10)
        .text(data.customer.name, 50, 200)
        .text(data.customer.email, 50, 215)

      if (data.customer.address) {
        doc.text(data.customer.address, 50, 230)
      }
      if (data.customer.phone) {
        doc.text(data.customer.phone, 50, 245)
      }

      // Items Table
      const tableTop = 300
      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('Item', 50, tableTop)
        .text('Qty', 300, tableTop)
        .text('Unit Price', 350, tableTop)
        .text('Total', 450, tableTop, { align: 'right' })
        .font('Helvetica')

      doc
        .moveTo(50, tableTop + 15)
        .lineTo(550, tableTop + 15)
        .stroke()

      let yPosition = tableTop + 25
      data.items.forEach((item, index) => {
        doc
          .fontSize(9)
          .text(item.name, 50, yPosition, { width: 240 })
          .text(item.quantity.toString(), 300, yPosition)
          .text(`$${item.unitPrice.toFixed(2)}`, 350, yPosition)
          .text(`$${item.total.toFixed(2)}`, 450, yPosition, { align: 'right' })

        if (item.description) {
          yPosition += 15
          doc
            .fontSize(8)
            .fillColor('#666666')
            .text(item.description, 50, yPosition, { width: 240 })
            .fillColor('#000000')
        }

        yPosition += 25
      })

      // Totals
      yPosition += 20
      doc
        .moveTo(350, yPosition)
        .lineTo(550, yPosition)
        .stroke()

      yPosition += 15
      doc
        .fontSize(10)
        .text('Subtotal:', 350, yPosition)
        .text(`$${data.subtotal.toFixed(2)}`, 450, yPosition, { align: 'right' })

      yPosition += 20
      doc
        .text('Tax:', 350, yPosition)
        .text(`$${data.tax.toFixed(2)}`, 450, yPosition, { align: 'right' })

      yPosition += 20
      doc
        .text('Shipping:', 350, yPosition)
        .text(`$${data.shipping.toFixed(2)}`, 450, yPosition, { align: 'right' })

      yPosition += 20
      doc
        .moveTo(350, yPosition)
        .lineTo(550, yPosition)
        .stroke()

      yPosition += 15
      doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Total:', 350, yPosition)
        .text(`$${data.total.toFixed(2)}`, 450, yPosition, { align: 'right' })
        .font('Helvetica')

      // Payment Info
      if (data.paymentMethod) {
        yPosition += 40
        doc
          .fontSize(10)
          .text('Payment Information', 50, yPosition)
          .fontSize(9)
          .text(`Method: ${data.paymentMethod}`, 50, yPosition + 20)

        if (data.transactionId) {
          doc.text(`Transaction ID: ${data.transactionId}`, 50, yPosition + 35)
        }
      }

      // Footer
      doc
        .fontSize(8)
        .fillColor('#666666')
        .text(
          'Thank you for your business!',
          50,
          750,
          { align: 'center', width: 500 }
        )
        .text(
          'For support, contact us at support@algol-digital.com',
          50,
          765,
          { align: 'center', width: 500 }
        )

      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}

export function generateInvoiceNumber(orderId: string): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `INV-${year}${month}-${random}`
}
