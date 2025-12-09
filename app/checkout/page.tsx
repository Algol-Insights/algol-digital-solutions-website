"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui-lib"
import { 
  ArrowLeft, 
  CheckCircle, 
  CreditCard, 
  Building2, 
  Truck, 
  MapPin,
  Phone,
  Mail,
  User,
  Loader2
} from "lucide-react"
import { useCartStore } from "@/lib/cart-store"

type PaymentMethod = "ecocash" | "bank" | "cod"
type DeliveryOption = "standard" | "express" | "pickup"

const deliveryOptions = [
  { id: "standard", name: "Standard Delivery", description: "3-5 business days", price: 25 },
  { id: "express", name: "Express Delivery", description: "1-2 business days", price: 50 },
  { id: "pickup", name: "Store Pickup", description: "Ready in 24 hours", price: 0 },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCartStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("ecocash")
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>("standard")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    notes: "",
  })

  const subtotal = getTotal()
  const selectedDelivery = deliveryOptions.find(d => d.id === deliveryOption)!
  const shipping = subtotal > 500 && deliveryOption === "standard" ? 0 : selectedDelivery.price
  const total = subtotal + shipping

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsProcessing(false)
    setOrderComplete(true)
    clearCart()
  }

  if (items.length === 0 && !orderComplete) {
    router.push("/cart")
    return null
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-950 mx-auto mb-6 flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Order Placed Successfully!</h1>
            <p className="text-muted-foreground mb-4">
              Thank you for your order. We&apos;ve sent a confirmation email to{" "}
              <span className="font-medium text-foreground">{formData.email}</span>
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Order ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
            <div className="space-y-3">
              <Button asChild className="w-full bg-violet-600 hover:bg-violet-700">
                <Link href="/products">Continue Shopping</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/account/orders">View Orders</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-700 text-white py-8">
        <div className="container mx-auto px-4">
          <Link href="/cart" className="inline-flex items-center text-white/80 hover:text-white mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Delivery Information */}
              <div className="p-6 rounded-xl border border-border bg-card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-950 text-violet-600">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-bold">Delivery Information</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="+263"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Street Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Province *</label>
                    <select
                      name="province"
                      value={formData.province}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                      <option value="">Select Province</option>
                      <option value="harare">Harare</option>
                      <option value="bulawayo">Bulawayo</option>
                      <option value="manicaland">Manicaland</option>
                      <option value="mashonaland-central">Mashonaland Central</option>
                      <option value="mashonaland-east">Mashonaland East</option>
                      <option value="mashonaland-west">Mashonaland West</option>
                      <option value="masvingo">Masvingo</option>
                      <option value="matabeleland-north">Matabeleland North</option>
                      <option value="matabeleland-south">Matabeleland South</option>
                      <option value="midlands">Midlands</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Delivery Options */}
              <div className="p-6 rounded-xl border border-border bg-card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-950 text-violet-600">
                    <Truck className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-bold">Delivery Options</h2>
                </div>

                <div className="space-y-3">
                  {deliveryOptions.map((option) => (
                    <label
                      key={option.id}
                      className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                        deliveryOption === option.id
                          ? "border-violet-500 bg-violet-50 dark:bg-violet-950/50"
                          : "border-border hover:border-violet-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="delivery"
                          value={option.id}
                          checked={deliveryOption === option.id}
                          onChange={() => setDeliveryOption(option.id as DeliveryOption)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          deliveryOption === option.id ? "border-violet-500" : "border-muted-foreground"
                        }`}>
                          {deliveryOption === option.id && (
                            <div className="w-3 h-3 rounded-full bg-violet-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{option.name}</p>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                      </div>
                      <span className="font-medium">
                        {option.price === 0 ? "FREE" : `$${option.price}`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="p-6 rounded-xl border border-border bg-card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-950 text-violet-600">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-bold">Payment Method</h2>
                </div>

                <div className="space-y-3">
                  <label
                    className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                      paymentMethod === "ecocash"
                        ? "border-violet-500 bg-violet-50 dark:bg-violet-950/50"
                        : "border-border hover:border-violet-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value="ecocash"
                        checked={paymentMethod === "ecocash"}
                        onChange={() => setPaymentMethod("ecocash")}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === "ecocash" ? "border-violet-500" : "border-muted-foreground"
                      }`}>
                        {paymentMethod === "ecocash" && (
                          <div className="w-3 h-3 rounded-full bg-violet-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">EcoCash</p>
                        <p className="text-sm text-muted-foreground">Pay via mobile money</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 text-xs font-medium">
                      Instant
                    </div>
                  </label>

                  <label
                    className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                      paymentMethod === "bank"
                        ? "border-violet-500 bg-violet-50 dark:bg-violet-950/50"
                        : "border-border hover:border-violet-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value="bank"
                        checked={paymentMethod === "bank"}
                        onChange={() => setPaymentMethod("bank")}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === "bank" ? "border-violet-500" : "border-muted-foreground"
                      }`}>
                        {paymentMethod === "bank" && (
                          <div className="w-3 h-3 rounded-full bg-violet-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">Bank Transfer</p>
                        <p className="text-sm text-muted-foreground">RTGS or USD transfer</p>
                      </div>
                    </div>
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                  </label>

                  <label
                    className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                      paymentMethod === "cod"
                        ? "border-violet-500 bg-violet-50 dark:bg-violet-950/50"
                        : "border-border hover:border-violet-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === "cod" ? "border-violet-500" : "border-muted-foreground"
                      }`}>
                        {paymentMethod === "cod" && (
                          <div className="w-3 h-3 rounded-full bg-violet-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">Cash on Delivery</p>
                        <p className="text-sm text-muted-foreground">Pay when you receive</p>
                      </div>
                    </div>
                    <Truck className="h-5 w-5 text-muted-foreground" />
                  </label>
                </div>
              </div>

              {/* Order Notes */}
              <div className="p-6 rounded-xl border border-border bg-card">
                <label className="block text-sm font-medium mb-2">Order Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Any special instructions for your order..."
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 p-6 rounded-xl border border-border bg-card">
                <h2 className="text-lg font-bold mb-4">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-16 h-16 bg-muted/50 rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-violet-600 text-white text-xs flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ${item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `$${shipping}`
                      )}
                    </span>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-xl">${total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full mt-6 bg-violet-600 hover:bg-violet-700"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Place Order - $${total.toLocaleString()}`
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  By placing this order, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
