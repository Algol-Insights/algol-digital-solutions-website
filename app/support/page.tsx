import Link from "next/link"
import { Button } from "@/components/ui-lib"
import { WhatsAppChannel } from "@/components/whatsapp-channel"
import { SocialFollow } from "@/components/social-follow"
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  FileText, 
  Truck, 
  CreditCard,
  Shield,
  HelpCircle,
  ChevronRight
} from "lucide-react"

const faqs = [
  {
    question: "What payment methods do you accept?",
    answer: "We accept EcoCash, InnBucks, bank transfers (RTGS and USD), cash on delivery, and other payment arrangements. Contact us for payment assistance."
  },
  {
    question: "How long does delivery take?",
    answer: "Standard delivery takes 3-5 business days nationwide. Express delivery (1-2 days) is available for an additional fee. Store pickup is ready within 24 hours."
  },
  {
    question: "Do you offer warranties on products?",
    answer: "Yes, all products come with manufacturer warranties. Laptops and desktops typically have 1-3 year warranties. We also offer extended warranty options."
  },
  {
    question: "Can I return a product?",
    answer: "Yes, we have a 14-day return policy for unopened products in original packaging. Opened products may be returned if defective within warranty period."
  },
  {
    question: "Do you provide installation services?",
    answer: "Yes, we offer professional installation for networking equipment, security systems, and enterprise software. Contact us for a quote."
  },
  {
    question: "Can I get a bulk order discount?",
    answer: "Absolutely! We offer competitive pricing for bulk and enterprise orders. Contact our sales team for custom quotes."
  },
]

const contactMethods = [
  {
    icon: Phone,
    title: "Phone Support",
    description: "Speak with our team",
    value: "+263 242 123 456",
    action: "tel:+263242123456",
    available: "Mon-Sat 8AM-5PM"
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Get help via email",
    value: "support@algoldigital.com",
    action: "mailto:support@algoldigital.com",
    available: "24/7 Response"
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    description: "Quick chat support",
    value: "+263 788 663 313",
    action: "https://wa.me/263788663313",
    available: "Mon-Sat 8AM-8PM"
  },
  {
    icon: MapPin,
    title: "Visit Us",
    description: "Our showroom",
    value: "123 Samora Machel Ave, Harare",
    action: "#",
    available: "Mon-Sat 8AM-5PM"
  },
]

const supportTopics = [
  { icon: Truck, title: "Delivery", description: "Track orders, delivery times within Zimbabwe", href: "/delivery" },
  { icon: CreditCard, title: "Payments & Billing", description: "Payment methods, invoices, refunds", href: "/support/payments" },
  { icon: Shield, title: "Warranty & Returns", description: "Return policy, warranty claims, repairs", href: "/support/warranty" },
  { icon: FileText, title: "Product Information", description: "Specifications, compatibility, manuals", href: "/support/products" },
]

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">How Can We Help?</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Our support team is here to assist you with any questions about products, orders, or technical support.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Contact Methods */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Contact Us</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method) => (
              <a
                key={method.title}
                href={method.action}
                className="p-6 rounded-xl border border-border bg-card hover:border-violet-500/50 hover:shadow-lg transition-all group"
              >
                <div className="p-3 rounded-lg bg-violet-100 dark:bg-violet-950 text-violet-600 w-fit mb-4 group-hover:scale-110 transition-transform">
                  <method.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-1">{method.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{method.description}</p>
                <p className="font-medium text-violet-600">{method.value}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  <Clock className="h-3 w-3 inline mr-1" />
                  {method.available}
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* Support Topics */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Support Topics</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {supportTopics.map((topic) => (
              <Link
                key={topic.title}
                href={topic.href}
                className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-violet-500/50 transition-all group"
              >
                <div className="p-2 rounded-lg bg-muted text-muted-foreground group-hover:bg-violet-100 group-hover:text-violet-600 dark:group-hover:bg-violet-950 transition-colors">
                  <topic.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{topic.title}</h3>
                  <p className="text-xs text-muted-foreground">{topic.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-violet-600" />
              </Link>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group p-4 rounded-xl border border-border bg-card"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="font-medium pr-4">{faq.question}</span>
                  <div className="p-1 rounded bg-muted group-open:bg-violet-100 dark:group-open:bg-violet-950 transition-colors">
                    <HelpCircle className="h-4 w-4 text-muted-foreground group-open:text-violet-600" />
                  </div>
                </summary>
                <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Business Hours */}
        <section className="mb-16">
          <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/50 dark:to-indigo-950/50 border border-violet-200 dark:border-violet-800">
            <h2 className="text-xl font-bold mb-6 text-center">Business Hours</h2>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between p-3 rounded-lg bg-background/50">
                <span className="text-muted-foreground">Monday - Saturday</span>
                <span className="font-medium">8:00 AM - 5:00 PM</span>
              </div>
              <div className="flex justify-between p-3 rounded-lg bg-background/50">
                <span className="text-muted-foreground">Sunday</span>
                <span className="font-medium">Closed</span>
              </div>
              <div className="flex justify-between p-3 rounded-lg bg-background/50">
                <span className="text-muted-foreground">Public Holidays</span>
                <span className="font-medium">Closed</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        {/* Still Need Help */}
        <section className="text-center">
          <div className="p-8 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-700 text-white">
            <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-white/80 mb-6 max-w-xl mx-auto">
              Our dedicated support team is ready to assist you with any questions or concerns.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="mailto:support@algoldigital.com">
                <Button className="bg-white text-violet-600 hover:bg-white/90">
                  <Mail className="mr-2 h-4 w-4" />
                  Email Us
                </Button>
              </a>
              <a href="https://wa.me/263771234567" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* WhatsApp Channel & Social Media */}
        <section className="grid md:grid-cols-2 gap-8">
          <WhatsAppChannel />
          <div className="p-6 rounded-2xl border border-border bg-card">
            <h3 className="text-xl font-bold mb-4">Follow Us on Social Media</h3>
            <p className="text-muted-foreground mb-6">
              Stay connected and get the latest updates, tech tips, and exclusive offers.
            </p>
            <SocialFollow variant="default" />
          </div>
        </section>
      </div>
    </div>
  )
}
