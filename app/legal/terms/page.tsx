import Link from "next/link"
import { FileText, Scale, AlertCircle, CheckCircle2 } from "lucide-react"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-golden/10 mb-6">
            <FileText className="w-10 h-10 text-brand-golden" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-brand-teal-medium to-brand-golden bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-slate-400">Last updated: December 11, 2025</p>
        </div>

        {/* Introduction */}
        <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 mb-8">
          <p className="text-slate-300 leading-relaxed mb-4">
            Welcome to Algol Digital Solutions. These Terms of Service ("Terms") govern your use of our website and services. By accessing or using our website, you agree to be bound by these Terms.
          </p>
          <p className="text-slate-300 leading-relaxed">
            Please read these Terms carefully before using our services. If you do not agree with any part of these Terms, you may not access or use our services.
          </p>
        </div>

        {/* Acceptance of Terms */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-brand-teal-medium" />
            Acceptance of Terms
          </h2>
          
          <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
            <p className="text-slate-300 leading-relaxed mb-4">
              By creating an account, placing an order, or using any part of our website or services, you acknowledge that you have read, understood, and agree to be bound by these Terms, as well as our Privacy Policy.
            </p>
            <p className="text-slate-300 leading-relaxed">
              If you are using our services on behalf of a business or organization, you represent that you have the authority to bind that entity to these Terms.
            </p>
          </div>
        </section>

        {/* Use of Services */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Scale className="w-8 h-8 text-brand-teal-medium" />
            Use of Services
          </h2>
          
          <div className="space-y-6">
            <div className="bg-slate-800/30 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-bold mb-3">Permitted Use</h3>
              <p className="text-slate-300 mb-3">You may use our services for lawful purposes only. You agree to:</p>
              <ul className="space-y-2 text-slate-300">
                <li className="flex gap-2"><span className="text-brand-teal-medium">•</span> Provide accurate and complete information</li>
                <li className="flex gap-2"><span className="text-brand-teal-medium">•</span> Maintain the security of your account credentials</li>
                <li className="flex gap-2"><span className="text-brand-teal-medium">•</span> Comply with all applicable laws and regulations</li>
                <li className="flex gap-2"><span className="text-brand-teal-medium">•</span> Respect intellectual property rights</li>
              </ul>
            </div>

            <div className="bg-red-900/20 backdrop-blur-xl rounded-xl p-6 border border-red-700/50">
              <h3 className="text-xl font-bold mb-3 text-red-400">Prohibited Activities</h3>
              <p className="text-slate-300 mb-3">You may NOT:</p>
              <ul className="space-y-2 text-slate-300">
                <li className="flex gap-2"><span className="text-red-400">×</span> Use our services for fraudulent or illegal purposes</li>
                <li className="flex gap-2"><span className="text-red-400">×</span> Attempt to gain unauthorized access to our systems</li>
                <li className="flex gap-2"><span className="text-red-400">×</span> Interfere with or disrupt our services</li>
                <li className="flex gap-2"><span className="text-red-400">×</span> Copy, modify, or distribute our content without permission</li>
                <li className="flex gap-2"><span className="text-red-400">×</span> Use automated systems to access our website (scraping, bots)</li>
                <li className="flex gap-2"><span className="text-red-400">×</span> Impersonate others or provide false information</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Orders and Payments */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Orders and Payments</h2>
          
          <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 space-y-4 text-slate-300">
            <p>
              <strong className="text-white">Order Acceptance:</strong> All orders are subject to acceptance by Algol Digital Solutions. We reserve the right to refuse or cancel any order for any reason, including product availability, pricing errors, or suspected fraud.
            </p>
            <p>
              <strong className="text-white">Pricing:</strong> All prices are displayed in USD unless otherwise stated. Prices are subject to change without notice. We make every effort to ensure pricing accuracy, but errors may occur. In case of a pricing error, we will notify you and offer the option to proceed at the correct price or cancel your order.
            </p>
            <p>
              <strong className="text-white">Payment:</strong> Payment is due at the time of order unless other arrangements have been made. We accept EcoCash, Innbucks, bank transfers, Visa, Mastercard, and cash on delivery. Corporate clients may be eligible for credit terms upon approval.
            </p>
            <p>
              <strong className="text-white">Taxes:</strong> All applicable taxes and duties will be added to your order total where required by law.
            </p>
          </div>
        </section>

        {/* Delivery and Risk */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Delivery and Risk of Loss</h2>
          
          <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 space-y-4 text-slate-300">
            <p>
              <strong className="text-white">Delivery Times:</strong> Estimated delivery times are provided as guidance only and are not guaranteed. We are not liable for delays caused by circumstances beyond our control.
            </p>
            <p>
              <strong className="text-white">Risk of Loss:</strong> Risk of loss and title for products pass to you upon delivery to the carrier or upon pickup at our location.
            </p>
            <p>
              <strong className="text-white">Inspection:</strong> You must inspect products upon delivery and report any damage or discrepancies within 48 hours.
            </p>
          </div>
        </section>

        {/* Returns and Refunds */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Returns and Refunds</h2>
          
          <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
            <p className="text-slate-300 leading-relaxed mb-4">
              Our return and refund policy is detailed on our <Link href="/returns" className="text-brand-teal-medium hover:underline">Returns Policy page</Link>. By making a purchase, you agree to the terms outlined in that policy.
            </p>
            <p className="text-slate-300 leading-relaxed">
              Returns must be initiated within 14 days of delivery for non-defective items and within 30 days for defective items. All returns are subject to inspection and approval.
            </p>
          </div>
        </section>

        {/* Warranties */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Warranties and Disclaimers</h2>
          
          <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 space-y-4 text-slate-300">
            <p>
              <strong className="text-white">Product Warranties:</strong> Products are covered by manufacturer warranties as specified. Our <Link href="/warranty" className="text-brand-teal-medium hover:underline">Warranty Information page</Link> provides full details.
            </p>
            <p>
              <strong className="text-white">Service Warranty:</strong> Installation and configuration services are warranted to be performed in a professional manner consistent with industry standards.
            </p>
            <p className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4">
              <strong className="text-yellow-400 block mb-2">DISCLAIMER:</strong>
              Except as expressly stated, our services and products are provided "AS IS" without warranties of any kind, either express or implied. We disclaim all warranties, including merchantability, fitness for a particular purpose, and non-infringement.
            </p>
          </div>
        </section>

        {/* Limitation of Liability */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-brand-golden" />
            Limitation of Liability
          </h2>
          
          <div className="bg-red-900/10 backdrop-blur-xl rounded-2xl p-8 border border-red-700/30">
            <p className="text-slate-300 leading-relaxed mb-4">
              To the maximum extent permitted by law, Algol Digital Solutions shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of our services or products.
            </p>
            <p className="text-slate-300 leading-relaxed mb-4">
              Our total liability for any claim arising from these Terms or your use of our services shall not exceed the amount you paid for the product or service giving rise to the claim.
            </p>
            <p className="text-slate-400 text-sm">
              Some jurisdictions do not allow the exclusion or limitation of incidental or consequential damages, so the above limitations may not apply to you.
            </p>
          </div>
        </section>

        {/* Intellectual Property */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Intellectual Property</h2>
          
          <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
            <p className="text-slate-300 leading-relaxed mb-4">
              All content on our website, including text, graphics, logos, images, and software, is the property of Algol Digital Solutions or its licensors and is protected by copyright, trademark, and other intellectual property laws.
            </p>
            <p className="text-slate-300 leading-relaxed">
              You may not reproduce, distribute, modify, or create derivative works from any content without our express written permission.
            </p>
          </div>
        </section>

        {/* Indemnification */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Indemnification</h2>
          
          <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
            <p className="text-slate-300 leading-relaxed">
              You agree to indemnify, defend, and hold harmless Algol Digital Solutions, its officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses arising from your use of our services, violation of these Terms, or infringement of any rights of another party.
            </p>
          </div>
        </section>

        {/* Governing Law */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Governing Law and Dispute Resolution</h2>
          
          <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
            <p className="text-slate-300 leading-relaxed mb-4">
              These Terms shall be governed by and construed in accordance with the laws of Zimbabwe. Any disputes arising from these Terms or your use of our services shall be resolved in the courts of Zimbabwe.
            </p>
            <p className="text-slate-300 leading-relaxed">
              We encourage you to contact us first to resolve any disputes informally before pursuing legal action.
            </p>
          </div>
        </section>

        {/* Modifications */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Modifications to Terms</h2>
          
          <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
            <p className="text-slate-300 leading-relaxed">
              We reserve the right to modify these Terms at any time. Changes will be posted on this page with an updated "Last updated" date. Your continued use of our services after changes constitutes acceptance of the modified Terms.
            </p>
          </div>
        </section>

        {/* Severability */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Severability</h2>
          
          <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
            <p className="text-slate-300 leading-relaxed">
              If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.
            </p>
          </div>
        </section>

        {/* Contact */}
        <div className="bg-gradient-to-br from-brand-teal-dark to-brand-teal-medium rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Questions About These Terms?</h2>
          <p className="text-white/80 mb-6">Contact our legal team for clarification</p>
          <a 
            href="mailto:legal@algoldigitalsolutions.co.zw"
            className="inline-flex items-center gap-2 bg-white text-brand-teal-dark px-6 py-3 rounded-lg font-medium hover:bg-slate-100 transition-colors"
          >
            legal@algoldigitalsolutions.co.zw
          </a>
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
