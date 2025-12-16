'use client'

import Link from 'next/link'
import { AlertCircle, ArrowLeft } from 'lucide-react'

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center space-y-6">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto" />
          <h1 className="text-4xl font-bold text-gray-900">Payment Failed</h1>
          <p className="text-gray-600 text-lg">
            Unfortunately, your payment could not be processed. Please try again.
          </p>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
            <h3 className="font-semibold text-red-900 mb-2">What went wrong?</h3>
            <ul className="list-disc list-inside text-red-800 text-sm space-y-1">
              <li>Card declined or expired</li>
              <li>Insufficient funds</li>
              <li>Incorrect card details</li>
              <li>Network connectivity issue</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-900 text-sm">
              💡 Tip: Check your card details and try again. If the problem persists,
              try using a different payment method.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex gap-3 justify-center">
              <Link
                href="/checkout"
                className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition flex items-center gap-2"
              >
                Try Another Payment
              </Link>
              <Link
                href="/cart"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Cart
              </Link>
            </div>
          </div>

          <div className="pt-6 border-t">
            <p className="text-sm text-gray-600 mb-3">Need help?</p>
            <Link
              href="/support"
              className="text-violet-600 hover:text-violet-700 font-semibold"
            >
              Contact Customer Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
