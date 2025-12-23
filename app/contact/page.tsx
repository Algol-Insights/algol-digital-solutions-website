'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Send, CheckCircle2, Loader2 } from 'lucide-react'
import { WhatsAppChannel } from '@/components/whatsapp-channel'
import { SocialFollow } from '@/components/social-follow'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    service: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const services = [
    'General Inquiry',
    'IT Hardware & Software',
    'Cloud Productivity Services (Microsoft 365 / Google Workspace)',
    'Network Security & Firewalls',
    'CCTV Surveillance',
    'Network Installation',
    'IT Support & Maintenance',
    'Website Development',
    'Software Development',
    'Corporate & Bulk Orders',
    'Other'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitted(true)
        // Reset form after 3 seconds
        setTimeout(() => {
          setSubmitted(false)
          setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: '',
            service: ''
          })
        }, 3000)
      } else {
        alert(data.error || 'Failed to send message. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Failed to send message. Please try again or contact us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-teal-dark via-brand-teal-medium to-brand-golden py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20px 20px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
        
        <div className="absolute top-10 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-brand-golden/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}} />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Have a question or need assistance? Our team is here to help you with all your technology needs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Contact Info Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="glass-dark rounded-2xl p-6 border border-border/50 hover-lift"
            >
              <div className="inline-flex p-4 rounded-xl bg-brand-teal-medium/20 mb-4">
                <Phone className="h-6 w-6 text-brand-teal-medium" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Call Us</h3>
              <p className="text-muted-foreground mb-3">Mon-Sat, 8AM-8PM</p>
              <a href="tel:+263788663313" className="text-brand-teal-medium hover:text-brand-teal-dark font-medium">
                +263 788 663 313
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="glass-dark rounded-2xl p-6 border border-border/50 hover-lift"
            >
              <div className="inline-flex p-4 rounded-xl bg-brand-golden/20 mb-4">
                <Mail className="h-6 w-6 text-brand-golden" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Email Us</h3>
              <p className="text-muted-foreground mb-3">24/7 Response Time</p>
              <a href="mailto:info@algoldigital.com" className="text-brand-golden hover:text-brand-teal-medium font-medium">
                info@algoldigital.com
              </a>
              <br />
              <a href="mailto:support@algoldigital.com" className="text-brand-golden hover:text-brand-teal-medium font-medium">
                support@algoldigital.com
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="glass-dark rounded-2xl p-6 border border-border/50 hover-lift"
            >
              <div className="inline-flex p-4 rounded-xl bg-green-500/20 mb-4">
                <MapPin className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Visit Us</h3>
              <p className="text-muted-foreground mb-3">Mon-Sat 8AM-5PM</p>
              <p className="text-foreground font-medium">
                123 Samora Machel Avenue<br />
                Harare, Zimbabwe
              </p>
            </motion.div>
          </div>

          {/* Contact Form */}
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-4">Send Us a Message</h2>
              <p className="text-muted-foreground mb-8">
                Fill out the form below and our team will get back to you within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 glass-dark text-foreground rounded-xl border-2 border-border focus:border-brand-teal-medium focus:outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 glass-dark text-foreground rounded-xl border-2 border-border focus:border-brand-teal-medium focus:outline-none transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 glass-dark text-foreground rounded-xl border-2 border-border focus:border-brand-teal-medium focus:outline-none transition-all"
                      placeholder="+263 788 663 313"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Service Interested In
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3 glass-dark text-foreground rounded-xl border-2 border-border focus:border-brand-teal-medium focus:outline-none transition-all cursor-pointer"
                    >
                      <option value="">Select a service</option>
                      {services.map(service => (
                        <option key={service} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 glass-dark text-foreground rounded-xl border-2 border-border focus:border-brand-teal-medium focus:outline-none transition-all"
                    placeholder="How can we help you?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 glass-dark text-foreground rounded-xl border-2 border-border focus:border-brand-teal-medium focus:outline-none transition-all resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || submitted}
                  className="w-full bg-gradient-to-r from-brand-teal-medium to-brand-teal-dark hover:shadow-lg hover:shadow-brand-teal-medium/30 text-white px-8 py-4 rounded-xl font-semibold transition-all hover-lift flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Sending...
                    </>
                  ) : submitted ? (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Message Sent!
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:pl-8"
            >
              <h2 className="text-3xl font-bold text-foreground mb-6">Why Choose Us?</h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-brand-teal-medium/20 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-brand-teal-medium" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Expert Support</h3>
                    <p className="text-muted-foreground">
                      Our experienced team provides professional guidance for all your technology needs.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-brand-golden/20 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-brand-golden" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Fast Response</h3>
                    <p className="text-muted-foreground">
                      We respond to all inquiries within 24 hours, often much sooner.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Nationwide Service</h3>
                    <p className="text-muted-foreground">
                      We deliver and provide support across all provinces in Zimbabwe.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-brand-teal-medium/20 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-brand-teal-medium" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Quality Guaranteed</h3>
                    <p className="text-muted-foreground">
                      All our products come with warranty and after-sales support.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-brand-teal-medium/10 to-brand-golden/10 border border-border/50">
                <h3 className="text-lg font-semibold text-foreground mb-3">Business Hours</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Monday - Saturday:</span>
                    <span className="font-medium text-foreground">8:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span className="font-medium text-foreground">Closed</span>
                  </div>
                </div>
              </div>

              {/* Social Media Follow */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-foreground mb-4">Connect With Us</h3>
                <SocialFollow variant="inline" showWhatsApp={true} />
              </div>
            </motion.div>
          </div>

          {/* WhatsApp Channel Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <WhatsAppChannel variant="banner" />
          </motion.div>
        </div>
      </section>
    </div>
  )
}
