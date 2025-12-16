import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "@/components/session-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CartProvider } from "@/components/cart-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "Algol Digital Solutions - IT Hardware & Software Store",
    template: "%s | Algol Digital Solutions",
  },
  description: "Shop laptops, computers, networking equipment, and software. Professional IT solutions with delivery across Zimbabwe. Dell, HP, Cisco authorized partner.",
  metadataBase: new URL("https://solutions.algolinsights.com"),
  keywords: ["laptops Zimbabwe", "computers Harare", "IT equipment", "Dell", "HP", "Cisco", "networking", "software"],
  authors: [{ name: "Algol Insights" }],
  robots: "index, follow",
  icons: {
    icon: "/digital-solutions-logo.png",
    apple: "/digital-solutions-logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Algol Digital Solutions",
    images: ["/digital-solutions-logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@algolinsights",
    images: ["/digital-solutions-logo.png"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <CartProvider>
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </CartProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
