import Link from "next/link"
import { Phone, Mail, MapPin } from "lucide-react"
import { COMPANY_INFO } from "@/lib/shared"

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
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Contact */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center">
                <span className="text-white font-bold">Ⓐ</span>
              </div>
              <span className="text-xl font-bold">Algol Digital Solutions</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Zimbabwe's trusted IT hardware and software provider. Authorized partner for Dell, HP, Cisco, and Hikvision.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+263 XX XXX XXXX</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>sales@algolsolutions.co.zw</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Harare, Zimbabwe</span>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-violet-600 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-violet-600 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-violet-600 transition-colors">
                    {link.name}
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

        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
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
