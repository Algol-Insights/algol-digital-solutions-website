import Link from "next/link"
import { Shield, Clock, CheckCircle, FileText, Phone, Mail } from "lucide-react"

export default function WarrantyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-teal-medium/10 mb-6">
            <Shield className="w-10 h-10 text-brand-teal-medium" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-brand-teal-medium to-brand-golden bg-clip-text text-transparent">
            Warranty Information
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            We stand behind our products with comprehensive warranty coverage
          </p>
        </div>

        {/* Coverage Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50 hover:border-brand-teal-medium/50 transition-all">
            <Clock className="w-8 h-8 text-brand-teal-medium mb-4" />
            <h3 className="text-xl font-bold mb-2">Standard Coverage</h3>
            <p className="text-3xl font-bold text-brand-teal-medium mb-2">1-3 Years</p>
            <p className="text-slate-400 text-sm">Manufacturer warranty on all products</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50 hover:border-brand-golden/50 transition-all">
            <CheckCircle className="w-8 h-8 text-brand-golden mb-4" />
            <h3 className="text-xl font-bold mb-2">Extended Options</h3>
            <p className="text-3xl font-bold text-brand-golden mb-2">Up to 5 Years</p>
            <p className="text-slate-400 text-sm">Additional protection available</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50 hover:border-brand-teal-medium/50 transition-all">
            <FileText className="w-8 h-8 text-brand-teal-medium mb-4" />
            <h3 className="text-xl font-bold mb-2">Easy Claims</h3>
            <p className="text-3xl font-bold text-brand-teal-medium mb-2">24-48h</p>
            <p className="text-slate-400 text-sm">Fast processing turnaround</p>
          </div>
        </div>

        {/* Warranty Details */}
        <div className="space-y-8 mb-16">
          <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-2 h-8 bg-gradient-to-b from-brand-teal-medium to-brand-golden rounded-full" />
              Standard Warranty Coverage
            </h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-brand-teal-medium flex-shrink-0 mt-1" />
                <div>
                  <strong className="text-white">Laptops & Computers:</strong>
                  <span className="text-slate-300"> 1-3 years manufacturer warranty covering hardware defects and malfunctions</span>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-brand-teal-medium flex-shrink-0 mt-1" />
                <div>
                  <strong className="text-white">Security Systems:</strong>
                  <span className="text-slate-300"> 2-5 years warranty with installation guarantee</span>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-brand-teal-medium flex-shrink-0 mt-1" />
                <div>
                  <strong className="text-white">Networking Equipment:</strong>
                  <span className="text-slate-300"> 1-3 years manufacturer warranty with firmware support</span>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-brand-teal-medium flex-shrink-0 mt-1" />
                <div>
                  <strong className="text-white">Accessories & Peripherals:</strong>
                  <span className="text-slate-300"> 6-12 months warranty coverage</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-2 h-8 bg-gradient-to-b from-brand-teal-medium to-brand-golden rounded-full" />
              What's Covered
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-brand-teal-medium flex-shrink-0 mt-1" />
                <span className="text-slate-300">Manufacturing defects</span>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-brand-teal-medium flex-shrink-0 mt-1" />
                <span className="text-slate-300">Hardware malfunctions</span>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-brand-teal-medium flex-shrink-0 mt-1" />
                <span className="text-slate-300">Component failures</span>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-brand-teal-medium flex-shrink-0 mt-1" />
                <span className="text-slate-300">Software issues (within 30 days)</span>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-brand-teal-medium flex-shrink-0 mt-1" />
                <span className="text-slate-300">Installation defects (security systems)</span>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-brand-teal-medium flex-shrink-0 mt-1" />
                <span className="text-slate-300">Parts replacement (authorized)</span>
              </div>
            </div>
          </div>

          <div className="bg-red-900/20 backdrop-blur-xl rounded-2xl p-8 border border-red-700/50">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-red-400">
              <span className="w-2 h-8 bg-gradient-to-b from-red-500 to-red-700 rounded-full" />
              Not Covered
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex gap-3">
                <span className="text-red-400 text-xl">×</span>
                <span className="text-slate-300">Physical damage (drops, liquid damage)</span>
              </div>
              <div className="flex gap-3">
                <span className="text-red-400 text-xl">×</span>
                <span className="text-slate-300">Unauthorized repairs or modifications</span>
              </div>
              <div className="flex gap-3">
                <span className="text-red-400 text-xl">×</span>
                <span className="text-slate-300">Normal wear and tear</span>
              </div>
              <div className="flex gap-3">
                <span className="text-red-400 text-xl">×</span>
                <span className="text-slate-300">Software viruses or corruption</span>
              </div>
              <div className="flex gap-3">
                <span className="text-red-400 text-xl">×</span>
                <span className="text-slate-300">Theft or loss</span>
              </div>
              <div className="flex gap-3">
                <span className="text-red-400 text-xl">×</span>
                <span className="text-slate-300">Power surge damage (without surge protection)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Claim Process */}
        <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 mb-16">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <span className="w-2 h-8 bg-gradient-to-b from-brand-teal-medium to-brand-golden rounded-full" />
            How to File a Warranty Claim
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-brand-teal-medium/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-brand-teal-medium">1</span>
              </div>
              <h3 className="font-bold mb-2">Contact Us</h3>
              <p className="text-sm text-slate-400">Reach out via phone or email with your purchase details</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-brand-teal-medium/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-brand-teal-medium">2</span>
              </div>
              <h3 className="font-bold mb-2">Assessment</h3>
              <p className="text-sm text-slate-400">Our team evaluates your claim and confirms coverage</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-brand-teal-medium/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-brand-teal-medium">3</span>
              </div>
              <h3 className="font-bold mb-2">Service</h3>
              <p className="text-sm text-slate-400">Product is repaired, replaced, or serviced</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-brand-golden/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-brand-golden">4</span>
              </div>
              <h3 className="font-bold mb-2">Resolution</h3>
              <p className="text-sm text-slate-400">Receive your repaired/replacement product</p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-br from-brand-teal-dark to-brand-teal-medium rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Need Help with a Warranty Claim?</h2>
          <p className="text-white/80 mb-6">Our support team is ready to assist you</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:+263788663313"
              className="inline-flex items-center gap-2 bg-white text-brand-teal-dark px-6 py-3 rounded-lg font-medium hover:bg-slate-100 transition-colors"
            >
              <Phone className="w-5 h-5" />
              +263 788 663 313
            </a>
            <a 
              href="mailto:support@algoldigital.com"
              className="inline-flex items-center gap-2 bg-brand-teal-dark text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-teal-dark/80 transition-colors border border-white/20"
            >
              <Mail className="w-5 h-5" />
              Email Support
            </a>
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
