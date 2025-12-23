import Link from "next/link"
import { Phone, Mail, MapPin } from "lucide-react"
import { COMPANY_INFO } from "@/lib/shared"
import { SocialFollow } from "@/components/social-follow"

const footerLinks = {
  shop: [
    { name: "All Products", href: "/products" },
    { name: "Laptops", href: "/products?category=laptops" },
    { name: "Desktops", href: "/products?category=desktops" },
    { name: "Networking", href: "/products?category=networking" },
    { name: "Software", href: "/products?category=software" },
  ],
  support: [
    { name: "Contact Us", href: "/contact" },
    { name: "Warranty Info", href: "/warranty" },
    { name: "Returns", href: "/returns" },
    { name: "Delivery", href: "/delivery" },
    { name: "FAQs", href: "/faqs" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Algol Insights", href: "https://algolinsights.com" },
    { name: "Privacy Policy", href: "/legal/privacy" },
    { name: "Terms of Service", href: "/legal/terms" },
  ],
}

export function Footer() {
  return (
    <footer className="relative border-t border-border/50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-300 overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
      
      {/* Animated background orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-teal-medium/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-golden/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}} />
      
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand & Contact */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-3 mb-6 group">
              <div className="relative">
                <div className="w-24 h-24 rounded-xl flex items-center justify-center shadow-lg shadow-brand-teal-medium/30 group-hover:shadow-xl group-hover:shadow-brand-teal-medium/50 transition-all duration-300 group-hover:scale-110 overflow-hidden bg-gradient-to-br from-brand-teal-dark via-brand-teal-medium to-brand-golden p-2">
                  <img 
                    src="/digital-solutions-logo.png" 
                    alt="Algol Digital Solutions" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand-teal-medium to-brand-golden opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white">Algol Digital</span>
                <span className="text-xs text-slate-400">Premium IT Solutions</span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Zimbabwe's trusted IT hardware and software provider. Authorized partner for Dell, HP, Cisco, and Hikvision.
            </p>
            <div className="space-y-3 text-sm">
              <a href="tel:+263788663313" className="flex items-center gap-3 text-slate-400 hover:text-brand-teal-medium transition-colors group">
                <div className="p-2 rounded-lg bg-slate-800/50 group-hover:bg-brand-teal-medium/10 transition-colors">
                  <Phone className="h-4 w-4" />
                </div>
                <span>+263 788 663 313</span>
              </a>
              <a href="mailto:info@algoldigital.com" className="flex items-center gap-3 text-slate-400 hover:text-brand-teal-medium transition-colors group">
                <div className="p-2 rounded-lg bg-slate-800/50 group-hover:bg-brand-teal-medium/10 transition-colors">
                  <Mail className="h-4 w-4" />
                </div>
                <span>info@algoldigital.com</span>
              </a>
              <div className="flex items-center gap-3 text-slate-400">
                <div className="p-2 rounded-lg bg-slate-800/50">
                  <MapPin className="h-4 w-4" />
                </div>
                <span>Harare, Zimbabwe</span>
              </div>
            </div>
            
            {/* Social Media Links */}
            <div className="mt-6 pt-6 border-t border-slate-800">
              <h4 className="text-sm font-semibold text-white mb-4">Connect With Us</h4>
              <SocialFollow variant="compact" showWhatsApp={true} />
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-bold text-white mb-6 text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-brand-teal-medium to-brand-golden rounded-full" />
              Shop
            </h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-brand-teal-medium hover:translate-x-1 transition-all inline-block group">
                    <span className="inline-flex items-center gap-2">
                      <span className="w-0 h-px bg-brand-teal-medium group-hover:w-4 transition-all" />
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-bold text-white mb-6 text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-brand-teal-medium to-brand-golden rounded-full" />
              Support
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-brand-teal-medium hover:translate-x-1 transition-all inline-block group">
                    <span className="inline-flex items-center gap-2">
                      <span className="w-0 h-px bg-brand-teal-medium group-hover:w-4 transition-all" />
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-bold text-white mb-6 text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-brand-teal-medium to-brand-golden rounded-full" />
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-slate-400 hover:text-brand-teal-medium hover:translate-x-1 transition-all inline-block group"
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    <span className="inline-flex items-center gap-2">
                      <span className="w-0 h-px bg-brand-teal-medium group-hover:w-4 transition-all" />
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payment & Delivery Info */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-wrap gap-4 justify-center text-sm text-muted-foreground mb-4">
            <span>✓ Cash on Delivery</span>
            <span>✓ EcoCash Accepted</span>
            <span>✓ Bank Transfer</span>
            <span>✓ Nationwide Delivery</span>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Algol Digital Solutions. A subsidiary of {COMPANY_INFO.name}. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            CDPA Compliant • Zimbabwe Cyber and Data Protection Act
          </p>
        </div>
      </div>
    </footer>
  )
}
