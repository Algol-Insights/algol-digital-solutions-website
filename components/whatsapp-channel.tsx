"use client"

import { MessageCircle, Bell, Users } from "lucide-react"
import { Button } from "@/components/ui-lib"

interface WhatsAppChannelProps {
  variant?: "banner" | "card" | "button"
  className?: string
}

const WHATSAPP_CHANNEL_LINK = "https://whatsapp.com/channel/0029VarnlBhI8FUPoGBqE30C" // Update with your actual channel link

export function WhatsAppChannel({ variant = "card", className = "" }: WhatsAppChannelProps) {
  const openChannel = () => {
    window.open(WHATSAPP_CHANNEL_LINK, "_blank", "noopener,noreferrer")
  }

  if (variant === "button") {
    return (
      <Button
        onClick={openChannel}
        className={`bg-green-500 hover:bg-green-600 text-white ${className}`}
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        Join WhatsApp Channel
      </Button>
    )
  }

  if (variant === "banner") {
    return (
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 to-green-600 p-6 ${className}`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-full bg-white/20 backdrop-blur-sm">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
            <div className="text-white">
              <h3 className="text-xl font-bold mb-1">Join Our WhatsApp Channel</h3>
              <p className="text-white/90 text-sm">Get exclusive deals, product updates & tech tips instantly!</p>
            </div>
          </div>
          <Button
            onClick={openChannel}
            size="lg"
            className="bg-white text-green-600 hover:bg-white/90 font-semibold shadow-lg whitespace-nowrap"
          >
            <Bell className="h-5 w-5 mr-2" />
            Join Now
          </Button>
        </div>
      </div>
    )
  }

  // Default card variant
  return (
    <div className={`group relative overflow-hidden rounded-2xl border border-green-500/20 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-6 transition-all hover:border-green-500/40 hover:shadow-lg hover:shadow-green-500/10 ${className}`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl group-hover:bg-green-500/20 transition-colors" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
            <MessageCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground">WhatsApp Channel</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Users className="h-3 w-3" />
              Join thousands of subscribers
            </p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Stay updated with exclusive deals, new arrivals, and tech insights delivered straight to your WhatsApp!
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-700 dark:text-green-400 text-xs font-medium">
            🔔 Instant Notifications
          </span>
          <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-700 dark:text-green-400 text-xs font-medium">
            🎁 Exclusive Deals
          </span>
          <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-700 dark:text-green-400 text-xs font-medium">
            📱 Tech Tips
          </span>
        </div>

        <Button
          onClick={openChannel}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Join Channel
        </Button>
      </div>
    </div>
  )
}
