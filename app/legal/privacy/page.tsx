import Link from "next/link"
import { Shield, Lock, Eye, Database, UserCheck, Bell } from "lucide-react"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-teal-medium/10 mb-6">
            <Shield className="w-10 h-10 text-brand-teal-medium" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-brand-teal-medium to-brand-golden bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-slate-400">Last updated: December 11, 2025</p>
        </div>

        {/* Introduction */}
        <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 mb-8">
          <p className="text-slate-300 leading-relaxed mb-4">
            At Algol Digital Solutions, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you visit our website or use our services.
          </p>
          <p className="text-slate-300 leading-relaxed">
            By using our website and services, you consent to the data practices described in this policy. If you do not agree with our policies and practices, please do not use our services.
          </p>
        </div>

        {/* Information We Collect */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Database className="w-8 h-8 text-brand-teal-medium" />
            Information We Collect
          </h2>
          
          <div className="space-y-6">
            <div className="bg-slate-800/30 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-bold mb-3">Personal Information</h3>
              <p className="text-slate-300 mb-3">We may collect personal information that you voluntarily provide to us, including:</p>
              <ul className="space-y-2 text-slate-300">
                <li className="flex gap-2"><span className="text-brand-teal-medium">•</span> Name, email address, and phone number</li>
                <li className="flex gap-2"><span className="text-brand-teal-medium">•</span> Billing and delivery addresses</li>
                <li className="flex gap-2"><span className="text-brand-teal-medium">•</span> Payment information (processed securely by payment providers)</li>
                <li className="flex gap-2"><span className="text-brand-teal-medium">•</span> Account credentials (username and password)</li>
                <li className="flex gap-2"><span className="text-brand-teal-medium">•</span> Communication preferences</li>
              </ul>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-bold mb-3">Automatically Collected Information</h3>
              <p className="text-slate-300 mb-3">When you access our website, we automatically collect certain information:</p>
              <ul className="space-y-2 text-slate-300">
                <li className="flex gap-2"><span className="text-brand-teal-medium">•</span> IP address and device information</li>
                <li className="flex gap-2"><span className="text-brand-teal-medium">•</span> Browser type and operating system</li>
                <li className="flex gap-2"><span className="text-brand-teal-medium">•</span> Pages visited and time spent on site</li>
                <li className="flex gap-2"><span className="text-brand-teal-medium">•</span> Referring website and search terms</li>
                <li className="flex gap-2"><span className="text-brand-teal-medium">•</span> Cookies and similar tracking technologies</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How We Use Your Information */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <UserCheck className="w-8 h-8 text-brand-teal-medium" />
            How We Use Your Information
          </h2>
          
          <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
            <p className="text-slate-300 mb-4">We use the information we collect for the following purposes:</p>
            <ul className="space-y-3 text-slate-300">
              <li className="flex gap-3">
                <span className="text-brand-teal-medium text-xl">✓</span>
                <span><strong>Order Processing:</strong> To process and fulfill your orders, including payment processing and delivery</span>
              </li>
              <li className="flex gap-3">
                <span className="text-brand-teal-medium text-xl">✓</span>
                <span><strong>Customer Service:</strong> To respond to inquiries, provide support, and communicate about your orders</span>
              </li>
              <li className="flex gap-3">
                <span className="text-brand-teal-medium text-xl">✓</span>
                <span><strong>Account Management:</strong> To create and manage your account, including authentication</span>
              </li>
              <li className="flex gap-3">
                <span className="text-brand-teal-medium text-xl">✓</span>
                <span><strong>Marketing:</strong> To send promotional emails, newsletters, and special offers (you can opt-out anytime)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-brand-teal-medium text-xl">✓</span>
                <span><strong>Analytics:</strong> To analyze website usage and improve our services</span>
              </li>
              <li className="flex gap-3">
                <span className="text-brand-teal-medium text-xl">✓</span>
                <span><strong>Security:</strong> To protect against fraud, unauthorized access, and security threats</span>
              </li>
              <li className="flex gap-3">
                <span className="text-brand-teal-medium text-xl">✓</span>
                <span><strong>Legal Compliance:</strong> To comply with legal obligations and enforce our terms</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Data Security */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Lock className="w-8 h-8 text-brand-teal-medium" />
            Data Security
          </h2>
          
          <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
            <p className="text-slate-300 leading-relaxed mb-4">
              We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="space-y-2 text-slate-300">
              <li className="flex gap-2"><span className="text-brand-teal-medium">•</span> SSL/TLS encryption for data transmission</li>
              <li className="flex gap-2"><span className="text-brand-teal-medium">•</span> Secure servers and databases</li>
              <li className="flex gap-2"><span className="text-brand-teal-medium">•</span> Access controls and authentication</li>
              <li className="flex gap-2"><span className="text-brand-teal-medium">•</span> Regular security audits and updates</li>
              <li className="flex gap-2"><span className="text-brand-teal-medium">•</span> Employee training on data protection</li>
            </ul>
            <p className="text-slate-400 text-sm mt-4">
              However, no method of transmission over the Internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
            </p>
          </div>
        </section>

        {/* Information Sharing */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Eye className="w-8 h-8 text-brand-teal-medium" />
            Information Sharing and Disclosure
          </h2>
          
          <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
            <p className="text-slate-300 mb-4">We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
            <ul className="space-y-3 text-slate-300">
              <li className="flex gap-3">
                <span className="text-brand-golden">→</span>
                <span><strong>Service Providers:</strong> With trusted third-party service providers who assist us (payment processors, delivery services, hosting providers)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-brand-golden">→</span>
                <span><strong>Legal Requirements:</strong> When required by law, court order, or governmental authority</span>
              </li>
              <li className="flex gap-3">
                <span className="text-brand-golden">→</span>
                <span><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</span>
              </li>
              <li className="flex gap-3">
                <span className="text-brand-golden">→</span>
                <span><strong>Protection:</strong> To protect our rights, property, or safety, and that of our users</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Your Rights */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Bell className="w-8 h-8 text-brand-teal-medium" />
            Your Rights and Choices
          </h2>
          
          <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
            <p className="text-slate-300 mb-4">You have the following rights regarding your personal information:</p>
            <ul className="space-y-3 text-slate-300">
              <li className="flex gap-3">
                <span className="text-brand-teal-medium">•</span>
                <span><strong>Access:</strong> Request a copy of the personal information we hold about you</span>
              </li>
              <li className="flex gap-3">
                <span className="text-brand-teal-medium">•</span>
                <span><strong>Correction:</strong> Request correction of inaccurate or incomplete information</span>
              </li>
              <li className="flex gap-3">
                <span className="text-brand-teal-medium">•</span>
                <span><strong>Deletion:</strong> Request deletion of your personal information (subject to legal obligations)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-brand-teal-medium">•</span>
                <span><strong>Opt-Out:</strong> Unsubscribe from marketing emails at any time</span>
              </li>
              <li className="flex gap-3">
                <span className="text-brand-teal-medium">•</span>
                <span><strong>Cookie Control:</strong> Manage cookie preferences through your browser settings</span>
              </li>
            </ul>
            <p className="text-slate-400 mt-4">
              To exercise these rights, contact us at <a href="mailto:privacy@algoldigital.com" className="text-brand-teal-medium hover:underline">privacy@algoldigital.com</a>
            </p>
          </div>
        </section>

        {/* Cookies */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Cookies and Tracking Technologies</h2>
          <div className="bg-slate-800/30 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
            <p className="text-slate-300 leading-relaxed">
              We use cookies and similar technologies to enhance your browsing experience, analyze website traffic, and personalize content. You can control cookie settings through your browser preferences. Disabling cookies may affect some website functionality.
            </p>
          </div>
        </section>

        {/* Children's Privacy */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Children's Privacy</h2>
          <div className="bg-slate-800/30 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
            <p className="text-slate-300 leading-relaxed">
              Our services are not intended for children under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </div>
        </section>

        {/* Updates to Policy */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Changes to This Privacy Policy</h2>
          <div className="bg-slate-800/30 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
            <p className="text-slate-300 leading-relaxed">
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last updated" date. We encourage you to review this policy periodically. Your continued use of our services after changes constitutes acceptance of the updated policy.
            </p>
          </div>
        </section>

        {/* Contact */}
        <div className="bg-gradient-to-br from-brand-teal-dark to-brand-teal-medium rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Questions About Our Privacy Policy?</h2>
          <p className="text-white/80 mb-6">Contact our privacy team for any inquiries</p>
          <a 
            href="mailto:privacy@algoldigital.com"
            className="inline-flex items-center gap-2 bg-white text-brand-teal-dark px-6 py-3 rounded-lg font-medium hover:bg-slate-100 transition-colors"
          >
            privacy@algoldigital.com
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
