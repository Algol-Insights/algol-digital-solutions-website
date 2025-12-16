import Link from "next/link"
import { Target, Eye, Award, Users, Building, Phone, Mail } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-brand-teal-medium to-brand-golden bg-clip-text text-transparent">
            About Algol Digital Solutions
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Zimbabwe's trusted partner for premium IT hardware, software, and digital solutions since our founding
          </p>
        </div>

        {/* Company Story */}
        <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-slate-700/50 mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Building className="w-8 h-8 text-brand-teal-medium" />
            Our Story
          </h2>
          <div className="space-y-4 text-slate-300 leading-relaxed">
            <p>
              Algol Digital Solutions was founded with a clear mission: to provide Zimbabwean businesses and individuals with world-class IT solutions that drive growth and innovation. What started as a small technology distribution company has evolved into one of Zimbabwe's most trusted IT partners.
            </p>
            <p>
              Based in Harare, we specialize in enterprise-grade IT hardware, security systems, networking equipment, and custom software development. Our partnerships with global technology leaders like Dell, HP, Lenovo, Cisco, and Hikvision enable us to deliver cutting-edge solutions backed by world-class support.
            </p>
            <p>
              Today, we serve hundreds of clients across Zimbabwe – from startups and SMEs to large corporations, NGOs, and government agencies. Our commitment to quality, reliability, and exceptional customer service has made us the go-to IT partner for organizations that demand excellence.
            </p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-brand-teal-dark/20 backdrop-blur-xl rounded-2xl p-8 border border-brand-teal-medium/30">
            <div className="w-16 h-16 rounded-full bg-brand-teal-medium/10 flex items-center justify-center mb-6">
              <Target className="w-8 h-8 text-brand-teal-medium" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-slate-300 leading-relaxed">
              To empower Zimbabwean businesses and individuals with innovative technology solutions that enhance productivity, security, and digital transformation. We strive to be the most reliable and customer-focused IT partner in Zimbabwe.
            </p>
          </div>

          <div className="bg-brand-golden/10 backdrop-blur-xl rounded-2xl p-8 border border-brand-golden/30">
            <div className="w-16 h-16 rounded-full bg-brand-golden/10 flex items-center justify-center mb-6">
              <Eye className="w-8 h-8 text-brand-golden" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p className="text-slate-300 leading-relaxed">
              To be Zimbabwe's leading technology solutions provider, recognized for innovation, excellence, and transformative impact. We envision a digitally empowered Zimbabwe where technology accessibility drives economic growth and opportunity.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-slate-700/50 mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-brand-teal-medium/10 flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10 text-brand-teal-medium" />
              </div>
              <h3 className="text-xl font-bold mb-2">Excellence</h3>
              <p className="text-slate-400">
                We deliver only the highest quality products and services, backed by industry certifications and partnerships with leading global brands.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-brand-golden/10 flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-brand-golden" />
              </div>
              <h3 className="text-xl font-bold mb-2">Customer-First</h3>
              <p className="text-slate-400">
                Your success is our success. We go above and beyond to understand your needs and deliver solutions that exceed expectations.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-brand-teal-medium/10 flex items-center justify-center mx-auto mb-4">
                <Target className="w-10 h-10 text-brand-teal-medium" />
              </div>
              <h3 className="text-xl font-bold mb-2">Integrity</h3>
              <p className="text-slate-400">
                Honesty, transparency, and ethical business practices guide everything we do. We build lasting relationships based on trust.
              </p>
            </div>
          </div>
        </div>

        {/* What We Offer */}
        <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-slate-700/50 mb-12">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <span className="w-2 h-8 bg-gradient-to-b from-brand-teal-medium to-brand-golden rounded-full" />
            What We Offer
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-brand-teal-medium/10 flex items-center justify-center">
                <span className="text-2xl">💻</span>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">IT Hardware</h3>
                <p className="text-slate-400 text-sm">Laptops, desktops, servers, workstations, and peripherals from top global brands.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-brand-teal-medium/10 flex items-center justify-center">
                <span className="text-2xl">🔒</span>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Security Systems</h3>
                <p className="text-slate-400 text-sm">CCTV cameras, access control, alarm systems, and video surveillance solutions.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-brand-teal-medium/10 flex items-center justify-center">
                <span className="text-2xl">🌐</span>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Networking Solutions</h3>
                <p className="text-slate-400 text-sm">Routers, switches, access points, and complete network infrastructure design.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-brand-teal-medium/10 flex items-center justify-center">
                <span className="text-2xl">⚙️</span>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Software Development</h3>
                <p className="text-slate-400 text-sm">Custom web applications, mobile apps, and enterprise software solutions.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-brand-teal-medium/10 flex items-center justify-center">
                <span className="text-2xl">🛠️</span>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Installation & Support</h3>
                <p className="text-slate-400 text-sm">Professional installation, configuration, training, and ongoing technical support.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-brand-teal-medium/10 flex items-center justify-center">
                <span className="text-2xl">📱</span>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Mobile Devices</h3>
                <p className="text-slate-400 text-sm">Latest smartphones from Samsung, Apple, and Google, plus accessories.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-gradient-to-br from-brand-teal-dark via-brand-teal-medium to-brand-golden rounded-2xl p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Us?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-white/80">Genuine Products</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-white/80">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">5+</div>
              <div className="text-white/80">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-white/80">Support Available</div>
            </div>
          </div>
        </div>

        {/* Our Partners */}
        <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-slate-700/50 mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Authorized Partners</h2>
          <p className="text-center text-slate-400 mb-8">
            We partner with the world's leading technology brands to bring you the best products and support
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center text-slate-400">
            <div className="text-4xl font-bold">DELL</div>
            <div className="text-4xl font-bold">HP</div>
            <div className="text-4xl font-bold">LENOVO</div>
            <div className="text-4xl font-bold">CISCO</div>
            <div className="text-4xl font-bold">HIKVISION</div>
            <div className="text-4xl font-bold">MICROSOFT</div>
            <div className="text-4xl font-bold">ADOBE</div>
            <div className="text-4xl font-bold">ASUS</div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 text-center border border-slate-700/50">
          <h2 className="text-2xl font-bold mb-4">Ready to Work With Us?</h2>
          <p className="text-slate-400 mb-6">Get in touch and let's discuss how we can help your business thrive</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:+263788663313"
              className="inline-flex items-center gap-2 bg-brand-teal-medium text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-teal-dark transition-colors"
            >
              <Phone className="w-5 h-5" />
              +263 788 663 313
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-slate-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-600 transition-colors"
            >
              <Mail className="w-5 h-5" />
              Contact Us
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
