"use client"

import * as React from "react"
import { User, UserCheck, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui-lib"
import { motion } from "framer-motion"

interface GuestCheckoutToggleProps {
  isGuest: boolean
  onToggle: (isGuest: boolean) => void
}

export function GuestCheckoutToggle({ isGuest, onToggle }: GuestCheckoutToggleProps) {
  return (
    <div className="mb-8">
      <div className="grid md:grid-cols-2 gap-4">
        {/* Guest Checkout Option */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onToggle(true)}
          className={`p-6 rounded-2xl border-2 transition-all ${
            isGuest
              ? "border-brand-teal-medium bg-gradient-to-br from-brand-teal-medium/10 to-brand-golden/10 shadow-lg"
              : "border-border hover:border-brand-teal-medium/50"
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-xl ${
                isGuest
                  ? "bg-brand-teal-medium text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <User className="h-6 w-6" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold mb-1">Guest Checkout</h3>
              <p className="text-sm text-muted-foreground">
                Quick checkout without creating an account
              </p>
              <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                <li>✓ Faster checkout process</li>
                <li>✓ No password required</li>
                <li>✓ Track order via email</li>
              </ul>
            </div>
          </div>
        </motion.button>

        {/* Member Checkout Option */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onToggle(false)}
          className={`p-6 rounded-2xl border-2 transition-all ${
            !isGuest
              ? "border-brand-teal-medium bg-gradient-to-br from-brand-teal-medium/10 to-brand-golden/10 shadow-lg"
              : "border-border hover:border-brand-teal-medium/50"
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-xl ${
                !isGuest
                  ? "bg-brand-teal-medium text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <UserCheck className="h-6 w-6" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold mb-1">Member Checkout</h3>
              <p className="text-sm text-muted-foreground">
                Sign in or create an account for benefits
              </p>
              <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                <li>✓ Save addresses & payment methods</li>
                <li>✓ View order history</li>
                <li>✓ Faster future checkouts</li>
              </ul>
            </div>
          </div>
        </motion.button>
      </div>
    </div>
  )
}

// Guest Checkout Form
interface GuestCheckoutFormProps {
  onSubmit: (data: GuestCheckoutData) => void
}

export interface GuestCheckoutData {
  email: string
  phone: string
  firstName: string
  lastName: string
  address: string
  city: string
  notes?: string
}

export function GuestCheckoutForm({ onSubmit }: GuestCheckoutFormProps) {
  const [formData, setFormData] = React.useState<GuestCheckoutData>({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "Harare",
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contact Information */}
      <div className="p-6 bg-card border border-border rounded-2xl">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Mail className="h-5 w-5 text-brand-teal-medium" />
          Contact Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your.email@example.com"
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal-medium bg-background"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Order confirmation will be sent here
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="+263 788 663 313"
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal-medium bg-background"
            />
            <p className="text-xs text-muted-foreground mt-1">
              For delivery coordination
            </p>
          </div>
        </div>
      </div>

      {/* Delivery Information */}
      <div className="p-6 bg-card border border-border rounded-2xl">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-brand-teal-medium" />
          Delivery Information
        </h3>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="John"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal-medium bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Doe"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal-medium bg-background"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Delivery Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="123 Main Street, Suburb"
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal-medium bg-background"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              City <span className="text-red-500">*</span>
            </label>
            <select
              name="city"
              value={formData.city}
              onChange={(e) => handleChange(e as any)}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal-medium bg-background"
            >
              <option value="Harare">Harare (Free Delivery)</option>
              <option value="Bulawayo">Bulawayo</option>
              <option value="Mutare">Mutare</option>
              <option value="Gweru">Gweru</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Delivery Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Any special instructions for delivery..."
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal-medium bg-background resize-none"
            />
          </div>
        </div>
      </div>

      {/* Guest Notice */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          <strong>Note:</strong> You'll receive order updates via email. No account will be created.
          You can track your order using the tracking link sent to your email.
        </p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full bg-gradient-to-r from-brand-teal-medium to-brand-teal-dark hover:from-brand-teal-dark hover:to-brand-teal-medium text-lg font-bold"
      >
        Continue to Payment
      </Button>
    </form>
  )
}
