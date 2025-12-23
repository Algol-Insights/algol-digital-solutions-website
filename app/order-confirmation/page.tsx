import Link from "next/link"
import { Button } from "@/components/ui-lib"
import { CheckCircle, Package, Truck, Mail, Phone, ArrowRight, Printer, Download } from "lucide-react"
import { notFound, redirect } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

interface Props {
  searchParams: { orderId?: string }
}

export default async function OrderConfirmationPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions)
  const orderId = searchParams.orderId

  if (!orderId) {
    redirect('/account/orders')
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      orderItems: {
        include: {
          product: true
        }
      },
      user: true
    }
  })

  if (!order) {
    notFound()
  }

  // Verify user owns this order
  if (session?.user?.email && session.user.email !== order.user?.email) {
    redirect('/account/orders')
  }

  const subtotal = order.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const delivery = order.shipping || 0
  const total = subtotal + delivery

  const mockOrder = {
    id: order.id,
    date: new Date(order.createdAt).toLocaleDateString('en-ZW', { year: 'numeric', month: 'long', day: 'numeric' }),
    email: order.user?.email || '',
    deliveryMethod: 'Standard Delivery',
    estimatedDelivery: order.status,
    paymentMethod: order.paymentMethod || 'N/A',
    subtotal,
    delivery,
    total,
    items: order.orderItems.map(item => ({
      name: item.product.name,
      qty: item.quantity,
      price: item.price
    })),
    address: {
      name: order.user?.name || '',
      address: order.shippingAddress || '',
      city: '',
      phone: order.user?.phone || '',
    }
  }
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order has been received.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden mb-8">
          {/* Order Header */}
          <div className="bg-violet-600 text-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-violet-200 text-sm">Order Number</p>
                <p className="text-xl font-bold">{mockOrder.id}</p>
              </div>
              <div className="text-right">
                <p className="text-violet-200 text-sm">Order Date</p>
                <p className="font-medium">{mockOrder.date}</p>
              </div>
            </div>
          </div>

          {/* Order Status */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-600">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold">{mockOrder.deliveryMethod}</p>
                <p className="text-sm text-muted-foreground">
                  Estimated delivery: {mockOrder.estimatedDelivery}
                </p>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="mt-6 flex items-center justify-between">
              {["Order Placed", "Processing", "Shipped", "Delivered"].map((step, i) => (
                <div key={step} className="flex-1 relative">
                  <div className={`flex flex-col items-center ${i === 0 ? 'text-violet-600' : 'text-muted-foreground'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      i === 0 
                        ? 'bg-violet-600 text-white' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {i + 1}
                    </div>
                    <span className="text-xs mt-2 text-center">{step}</span>
                  </div>
                  {i < 3 && (
                    <div className={`absolute top-4 left-1/2 w-full h-0.5 ${
                      i === 0 ? 'bg-violet-200' : 'bg-muted'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Items */}
          <div className="p-6 border-b border-border">
            <h3 className="font-semibold mb-4">Order Items</h3>
            <div className="space-y-4">
              {mockOrder.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.qty}</p>
                    </div>
                  </div>
                  <p className="font-medium">${item.price * item.qty}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Payment */}
          <div className="p-6 grid sm:grid-cols-2 gap-6 border-b border-border">
            <div>
              <h3 className="font-semibold mb-3">Delivery Address</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="text-foreground font-medium">{mockOrder.address.name}</p>
                <p>{mockOrder.address.address}</p>
                <p>{mockOrder.address.city}</p>
                <p>{mockOrder.address.phone}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Payment Method</h3>
              <p className="text-sm text-muted-foreground">{mockOrder.paymentMethod}</p>
              <div className="mt-4 p-3 rounded-lg bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                  ✓ Payment Confirmed
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="p-6">
            <h3 className="font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${mockOrder.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span>${mockOrder.delivery}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border text-base font-bold">
                <span>Total</span>
                <span>${mockOrder.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print Receipt
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Invoice
          </Button>
        </div>

        {/* Confirmation Email Notice */}
        <div className="bg-muted/50 rounded-xl p-6 text-center mb-10">
          <Mail className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
          <p className="font-medium mb-1">Confirmation email sent</p>
          <p className="text-sm text-muted-foreground">
            We&apos;ve sent order details and tracking information to{" "}
            <span className="font-medium text-foreground">{mockOrder.email}</span>
          </p>
        </div>

        {/* Help & Continue Shopping */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold mb-2">Need Help?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Our support team is here to help with any questions.
            </p>
            <div className="flex gap-3">
              <Link href="/support">
                <Button variant="outline" size="sm">
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Us
                </Button>
              </Link>
              <a href="tel:+263788663313">
                <Button variant="outline" size="sm">
                  <Phone className="mr-2 h-4 w-4" />
                  Call
                </Button>
              </a>
            </div>
          </div>
          <div className="bg-gradient-to-br from-violet-600 to-indigo-700 text-white rounded-xl p-6">
            <h3 className="font-semibold mb-2">Continue Shopping</h3>
            <p className="text-sm text-white/80 mb-4">
              Explore more great products for your business.
            </p>
            <Link href="/products">
              <Button className="bg-white text-violet-600 hover:bg-white/90">
                Browse Products <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
