import Link from "next/link"
import { Truck, MapPin, Clock, DollarSign, Package, CheckCircle, Phone } from "lucide-react"

export default function DeliveryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-teal-medium/10 mb-6">
            <Truck className="w-10 h-10 text-brand-teal-medium" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-brand-teal-medium to-brand-golden bg-clip-text text-transparent">
            Delivery Information
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Fast, reliable delivery across Zimbabwe
          </p>
        </div>

        {/* Key Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50 hover:border-brand-teal-medium/50 transition-all">
            <Truck className="w-8 h-8 text-brand-teal-medium mb-4" />
            <h3 className="text-xl font-bold mb-2">Free in Harare</h3>
            <p className="text-slate-400 text-sm">Complimentary delivery within Harare, affordable rates elsewhere</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50 hover:border-brand-golden/50 transition-all">
            <Clock className="w-8 h-8 text-brand-golden mb-4" />
            <h3 className="text-xl font-bold mb-2">Same-Day Option</h3>
            <p className="text-slate-400 text-sm">Available for orders placed before 2 PM in Harare</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50 hover:border-brand-teal-medium/50 transition-all">
            <Package className="w-8 h-8 text-brand-teal-medium mb-4" />
            <h3 className="text-xl font-bold mb-2">Secure Packaging</h3>
            <p className="text-slate-400 text-sm">All items carefully packed and insured</p>
          </div>
        </div>

        {/* Delivery Zones & Times */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <MapPin className="w-6 h-6 text-brand-teal-medium" />
              Delivery Zones
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-start p-4 bg-slate-700/30 rounded-lg">
                <div>
                  <h3 className="font-bold text-lg mb-1">Harare</h3>
                  <p className="text-sm text-slate-400">All suburbs within city limits</p>
                </div>
                <div className="text-right">
                  <div className="text-brand-teal-medium font-bold text-lg">FREE</div>
                  <div className="text-xs text-slate-400">1-2 business days</div>
                </div>
              </div>
              <div className="flex justify-between items-start p-4 bg-slate-700/30 rounded-lg">
                <div>
                  <h3 className="font-bold text-lg mb-1">Bulawayo</h3>
                  <p className="text-sm text-slate-400">City and surrounding areas</p>
                </div>
                <div className="text-right">
                  <div className="text-brand-golden font-bold text-lg">$10</div>
                  <div className="text-xs text-slate-400">2-3 business days</div>
                </div>
              </div>
              <div className="flex justify-between items-start p-4 bg-slate-700/30 rounded-lg">
                <div>
                  <h3 className="font-bold text-lg mb-1">Gweru & Mutare</h3>
                  <p className="text-sm text-slate-400">Major urban areas</p>
                </div>
                <div className="text-right">
                  <div className="text-brand-golden font-bold text-lg">$12</div>
                  <div className="text-xs text-slate-400">3-4 business days</div>
                </div>
              </div>
              <div className="flex justify-between items-start p-4 bg-slate-700/30 rounded-lg">
                <div>
                  <h3 className="font-bold text-lg mb-1">Other Cities</h3>
                  <p className="text-sm text-slate-400">Masvingo, Kwekwe, Chinhoyi, etc.</p>
                </div>
                <div className="text-right">
                  <div className="text-brand-golden font-bold text-lg">$15</div>
                  <div className="text-xs text-slate-400">4-5 business days</div>
                </div>
              </div>
              <div className="flex justify-between items-start p-4 bg-slate-700/30 rounded-lg">
                <div>
                  <h3 className="font-bold text-lg mb-1">Rural Areas</h3>
                  <p className="text-sm text-slate-400">Contact for quote</p>
                </div>
                <div className="text-right">
                  <div className="text-brand-golden font-bold text-lg">$15+</div>
                  <div className="text-xs text-slate-400">5-7 business days</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Clock className="w-6 h-6 text-brand-teal-medium" />
              Delivery Options
            </h2>
            <div className="space-y-6">
              <div className="p-4 bg-brand-teal-dark/20 rounded-lg border border-brand-teal-medium/30">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-lg">Standard Delivery</h3>
                  <span className="text-brand-teal-medium font-bold">FREE*</span>
                </div>
                <p className="text-sm text-slate-400 mb-3">
                  Delivery within 1-2 business days for Harare orders. Other areas 2-5 business days.
                </p>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-teal-medium" />
                    Track your order online
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-teal-medium" />
                    SMS & email notifications
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-teal-medium" />
                    Free in Harare
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-brand-golden/10 rounded-lg border border-brand-golden/30">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-lg">Express Delivery</h3>
                  <span className="text-brand-golden font-bold">+$10</span>
                </div>
                <p className="text-sm text-slate-400 mb-3">
                  Same-day delivery for Harare orders placed before 2 PM. Next-day for other cities.
                </p>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-golden" />
                    Priority processing
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-golden" />
                    Real-time tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-golden" />
                    SMS delivery notification
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-lg">Store Pickup</h3>
                  <span className="text-brand-teal-medium font-bold">FREE</span>
                </div>
                <p className="text-sm text-slate-400 mb-3">
                  Collect from our Harare office. Ready within 2-4 hours during business hours.
                </p>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-teal-medium" />
                    No delivery charges
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-teal-medium" />
                    Immediate product inspection
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-teal-medium" />
                    Mon-Sat: 8AM-5PM
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Installation Services */}
        <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-2 h-8 bg-gradient-to-b from-brand-teal-medium to-brand-golden rounded-full" />
            Professional Installation Available
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-slate-700/30 rounded-lg">
              <h3 className="font-bold mb-2">Security Systems</h3>
              <p className="text-slate-400 text-sm mb-3">Professional CCTV & alarm installation</p>
              <div className="text-brand-golden font-bold">From $50</div>
            </div>
            <div className="p-4 bg-slate-700/30 rounded-lg">
              <h3 className="font-bold mb-2">Network Setup</h3>
              <p className="text-slate-400 text-sm mb-3">Router & network equipment configuration</p>
              <div className="text-brand-golden font-bold">From $30</div>
            </div>
            <div className="p-4 bg-slate-700/30 rounded-lg">
              <h3 className="font-bold mb-2">Software Setup</h3>
              <p className="text-slate-400 text-sm mb-3">OS installation & software configuration</p>
              <div className="text-brand-golden font-bold">From $20</div>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-blue-900/20 backdrop-blur-xl rounded-2xl p-8 border border-blue-700/50 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-blue-300">Important Delivery Information</h2>
          <div className="space-y-3 text-slate-300">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-2 h-2 bg-brand-teal-medium rounded-full mt-2" />
              <p><strong>Delivery Times:</strong> Monday to Friday, 8 AM - 5 PM. Saturday deliveries available in Harare (9 AM - 1 PM) for an additional $5.</p>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-2 h-2 bg-brand-teal-medium rounded-full mt-2" />
              <p><strong>Tracking:</strong> You'll receive a tracking number via SMS and email once your order is dispatched. Track online at <Link href="/order-tracking" className="text-brand-teal-medium hover:underline">Order Tracking</Link>.</p>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-2 h-2 bg-brand-teal-medium rounded-full mt-2" />
              <p><strong>Proof of Delivery:</strong> A signature is required upon delivery. Please ensure someone is available to receive the package.</p>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-2 h-2 bg-brand-teal-medium rounded-full mt-2" />
              <p><strong>Bulk Orders:</strong> For corporate or bulk orders (10+ items), contact us for special delivery arrangements and discounts.</p>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-2 h-2 bg-brand-teal-medium rounded-full mt-2" />
              <p><strong>Failed Delivery:</strong> If delivery fails, we'll contact you to reschedule. After 3 failed attempts, the order will be held for collection.</p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-to-br from-brand-teal-dark to-brand-teal-medium rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Need Custom Delivery Arrangements?</h2>
          <p className="text-white/80 mb-6">Contact us for special requests or bulk order delivery</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:+263788663313"
              className="inline-flex items-center gap-2 bg-white text-brand-teal-dark px-6 py-3 rounded-lg font-medium hover:bg-slate-100 transition-colors"
            >
              <Phone className="w-5 h-5" />
              +263 788 663 313
            </a>
            <Link
              href="/support"
              className="inline-flex items-center gap-2 bg-brand-teal-dark text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-teal-dark/80 transition-colors border border-white/20"
            >
              Contact Support
            </Link>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-12">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-brand-teal-medium hover:text-brand-golden transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
