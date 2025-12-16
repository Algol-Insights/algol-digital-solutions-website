import Link from "next/link"
import { RefreshCw, Clock, CheckCircle, XCircle, Package, Phone } from "lucide-react"

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-golden/10 mb-6">
            <RefreshCw className="w-10 h-10 text-brand-golden" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-brand-teal-medium to-brand-golden bg-clip-text text-transparent">
            Returns & Refunds Policy
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Your satisfaction is our priority. Easy returns within 14 days.
          </p>
        </div>

        {/* Key Points */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50 hover:border-brand-teal-medium/50 transition-all">
            <Clock className="w-8 h-8 text-brand-teal-medium mb-4" />
            <h3 className="text-xl font-bold mb-2">14-Day Window</h3>
            <p className="text-slate-400 text-sm">Return unused items within 14 days of delivery</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50 hover:border-brand-golden/50 transition-all">
            <Package className="w-8 h-8 text-brand-golden mb-4" />
            <h3 className="text-xl font-bold mb-2">Original Packaging</h3>
            <p className="text-slate-400 text-sm">Items must be in original condition with all accessories</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50 hover:border-brand-teal-medium/50 transition-all">
            <RefreshCw className="w-8 h-8 text-brand-teal-medium mb-4" />
            <h3 className="text-xl font-bold mb-2">Full Refund</h3>
            <p className="text-slate-400 text-sm">100% refund for eligible returns</p>
          </div>
        </div>

        {/* Return Process */}
        <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 mb-12">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <span className="w-2 h-8 bg-gradient-to-b from-brand-teal-medium to-brand-golden rounded-full" />
            How to Return Your Purchase
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-teal-medium/10 flex items-center justify-center">
                <span className="text-xl font-bold text-brand-teal-medium">1</span>
              </div>
              <div>
                <h3 className="font-bold mb-1">Contact Us</h3>
                <p className="text-slate-400">Call +263 788 663 313 or email support@algoldigitalsolutions.co.zw to initiate your return. Provide your order number and reason for return.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-teal-medium/10 flex items-center justify-center">
                <span className="text-xl font-bold text-brand-teal-medium">2</span>
              </div>
              <div>
                <h3 className="font-bold mb-1">Get Return Authorization</h3>
                <p className="text-slate-400">We'll provide you with a Return Authorization (RA) number and return instructions.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-teal-medium/10 flex items-center justify-center">
                <span className="text-xl font-bold text-brand-teal-medium">3</span>
              </div>
              <div>
                <h3 className="font-bold mb-1">Pack Securely</h3>
                <p className="text-slate-400">Repack the item in its original packaging with all accessories, manuals, and proof of purchase. Include your RA number.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-teal-medium/10 flex items-center justify-center">
                <span className="text-xl font-bold text-brand-teal-medium">4</span>
              </div>
              <div>
                <h3 className="font-bold mb-1">Ship or Drop Off</h3>
                <p className="text-slate-400">Ship to our address or drop off at our Harare office. We'll arrange pickup for items within Harare city limits.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-golden/10 flex items-center justify-center">
                <span className="text-xl font-bold text-brand-golden">5</span>
              </div>
              <div>
                <h3 className="font-bold mb-1">Get Your Refund</h3>
                <p className="text-slate-400">Once we receive and inspect the item (2-5 business days), your refund will be processed to your original payment method.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Eligible vs Not Eligible */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-green-900/20 backdrop-blur-xl rounded-2xl p-8 border border-green-700/50">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-green-400">
              <CheckCircle className="w-6 h-6" />
              Eligible for Return
            </h2>
            <div className="space-y-3">
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                <span className="text-slate-300">Unopened products in original packaging</span>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                <span className="text-slate-300">Items with manufacturing defects (within 30 days)</span>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                <span className="text-slate-300">Wrong item delivered</span>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                <span className="text-slate-300">Changed mind (within 14 days, unused)</span>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                <span className="text-slate-300">Items with all accessories and documentation</span>
              </div>
            </div>
          </div>

          <div className="bg-red-900/20 backdrop-blur-xl rounded-2xl p-8 border border-red-700/50">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-red-400">
              <XCircle className="w-6 h-6" />
              Not Eligible for Return
            </h2>
            <div className="space-y-3">
              <div className="flex gap-3">
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
                <span className="text-slate-300">Software that has been opened or activated</span>
              </div>
              <div className="flex gap-3">
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
                <span className="text-slate-300">Items damaged by customer misuse</span>
              </div>
              <div className="flex gap-3">
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
                <span className="text-slate-300">Custom-configured or personalized products</span>
              </div>
              <div className="flex gap-3">
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
                <span className="text-slate-300">Items without original packaging or accessories</span>
              </div>
              <div className="flex gap-3">
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
                <span className="text-slate-300">Returns after 14 days (non-defective items)</span>
              </div>
              <div className="flex gap-3">
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
                <span className="text-slate-300">Clearance or final sale items</span>
              </div>
            </div>
          </div>
        </div>

        {/* Refund Information */}
        <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-2 h-8 bg-gradient-to-b from-brand-teal-medium to-brand-golden rounded-full" />
            Refund Processing
          </h2>
          <div className="space-y-4 text-slate-300">
            <p>
              <strong className="text-white">Timeline:</strong> Refunds are processed within 5-7 business days after we receive and inspect your return. The refund will appear in your account within 7-14 business days depending on your bank or payment provider.
            </p>
            <p>
              <strong className="text-white">Method:</strong> Refunds are issued to the original payment method. For cash purchases, we provide bank transfer or store credit.
            </p>
            <p>
              <strong className="text-white">Partial Refunds:</strong> In some cases (missing accessories, signs of use, opened software), we may issue a partial refund after assessment.
            </p>
            <p>
              <strong className="text-white">Shipping Costs:</strong> Original shipping charges are non-refundable unless the return is due to our error or a defective product.
            </p>
          </div>
        </div>

        {/* Exchange Information */}
        <div className="bg-brand-teal-dark/20 backdrop-blur-xl rounded-2xl p-8 border border-brand-teal-medium/50 mb-12">
          <h2 className="text-2xl font-bold mb-4">Exchanges</h2>
          <p className="text-slate-300 mb-4">
            If you'd like to exchange an item for a different model or specification, please contact us. We'll arrange the exchange subject to product availability and price differences.
          </p>
          <p className="text-slate-400 text-sm">
            Note: Exchanges follow the same conditions as returns. Items must be in original condition with all accessories.
          </p>
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-to-br from-brand-teal-dark to-brand-teal-medium rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Have Questions About Returns?</h2>
          <p className="text-white/80 mb-6">Our customer service team is here to help</p>
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
