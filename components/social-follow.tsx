"use client"

import { Facebook, Instagram, Linkedin, MessageCircle, Music } from "lucide-react"
import { Button } from "@/components/ui-lib"

interface SocialFollowProps {
  variant?: "default" | "compact" | "inline"
  showWhatsApp?: boolean
  className?: string
}

const socialLinks = {
  facebook: "https://www.facebook.com/algoldigitalsolutions",
  instagram: "https://www.instagram.com/algoldigitalsolutions",
  linkedin: "https://www.linkedin.com/company/algol-digital-solutions",
  tiktok: "https://www.tiktok.com/@algoldigitalsolutions",
  whatsappGroup: "https://chat.whatsapp.com/your-group-invite-link",
}

export function SocialFollow({ variant = "default", showWhatsApp = false, className = "" }: SocialFollowProps) {
  const openLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <button
          onClick={() => openLink(socialLinks.facebook)}
          className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 transition-colors"
          aria-label="Follow us on Facebook"
        >
          <Facebook className="h-4 w-4" />
        </button>
        <button
          onClick={() => openLink(socialLinks.instagram)}
          className="p-2 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-500 transition-colors"
          aria-label="Follow us on Instagram"
        >
          <Instagram className="h-4 w-4" />
        </button>
        <button
          onClick={() => openLink(socialLinks.linkedin)}
          className="p-2 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 transition-colors"
          aria-label="Follow us on LinkedIn"
        >
          <Linkedin className="h-4 w-4" />
        </button>
        <button
          onClick={() => openLink(socialLinks.tiktok)}
          className="p-2 rounded-lg bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 text-foreground transition-colors"
          aria-label="Follow us on TikTok"
        >
          <Music className="h-4 w-4" />
        </button>
        {showWhatsApp && (
          <button
            onClick={() => openLink(socialLinks.whatsappGroup)}
            className="p-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-500 transition-colors"
            aria-label="Join our WhatsApp group"
          >
            <MessageCircle className="h-4 w-4" />
          </button>
        )}
      </div>
    )
  }

  if (variant === "inline") {
    return (
      <div className={`flex flex-wrap items-center gap-3 ${className}`}>
        <span className="text-sm font-medium text-muted-foreground">Follow us:</span>
        <div className="flex gap-2">
          <button
            onClick={() => openLink(socialLinks.facebook)}
            className="text-blue-500 hover:text-blue-600 transition-colors"
            aria-label="Facebook"
          >
            <Facebook className="h-5 w-5" />
          </button>
          <button
            onClick={() => openLink(socialLinks.instagram)}
            className="text-pink-500 hover:text-pink-600 transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="h-5 w-5" />
          </button>
          <button
            onClick={() => openLink(socialLinks.linkedin)}
            className="text-blue-600 hover:text-blue-700 transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-5 w-5" />
          </button>
          <button
            onClick={() => openLink(socialLinks.tiktok)}
            className="text-foreground hover:opacity-70 transition-opacity"
            aria-label="TikTok"
          >
            <Music className="h-5 w-5" />
          </button>
          {showWhatsApp && (
            <button
              onClick={() => openLink(socialLinks.whatsappGroup)}
              className="text-green-500 hover:text-green-600 transition-colors"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    )
  }

  // Default variant - full cards
  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
      <button
        onClick={() => openLink(socialLinks.facebook)}
        className="group p-4 rounded-xl border border-border hover:border-blue-500/50 bg-card hover:bg-blue-500/5 transition-all"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="p-3 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
            <Facebook className="h-6 w-6 text-blue-500" />
          </div>
          <span className="text-sm font-medium">Facebook</span>
        </div>
      </button>

      <button
        onClick={() => openLink(socialLinks.instagram)}
        className="group p-4 rounded-xl border border-border hover:border-pink-500/50 bg-card hover:bg-pink-500/5 transition-all"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="p-3 rounded-lg bg-pink-500/10 group-hover:bg-pink-500/20 transition-colors">
            <Instagram className="h-6 w-6 text-pink-500" />
          </div>
          <span className="text-sm font-medium">Instagram</span>
        </div>
      </button>

      <button
        onClick={() => openLink(socialLinks.linkedin)}
        className="group p-4 rounded-xl border border-border hover:border-blue-600/50 bg-card hover:bg-blue-600/5 transition-all"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="p-3 rounded-lg bg-blue-600/10 group-hover:bg-blue-600/20 transition-colors">
            <Linkedin className="h-6 w-6 text-blue-600" />
          </div>
          <span className="text-sm font-medium">LinkedIn</span>
        </div>
      </button>

      <button
        onClick={() => openLink(socialLinks.tiktok)}
        className="group p-4 rounded-xl border border-border hover:border-foreground/50 bg-card hover:bg-foreground/5 transition-all"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="p-3 rounded-lg bg-foreground/10 group-hover:bg-foreground/20 transition-colors">
            <Music className="h-6 w-6" />
          </div>
          <span className="text-sm font-medium">TikTok</span>
        </div>
      </button>
    </div>
  )
}
