"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui-lib"
import { Menu, X, Moon, Sun, ShoppingCart, Search, User, Phone, LogOut, LogIn, Package, Heart } from "lucide-react"
import { useTheme } from "next-themes"
import { useCartStore } from "@/lib/cart-store"
import { useWishlistStore } from "@/lib/wishlist-store"

const navItems = [
  { name: "All Products", href: "/products" },
  { name: "Laptops", href: "/products?category=Laptops" },
  { name: "Networking", href: "/products?category=Networking" },
  { name: "Security", href: "/products?category=Security" },
  { name: "Services", href: "/services" },
  { name: "Deals", href: "/deals" },
  { name: "Support", href: "/support" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [scrolled, setScrolled] = React.useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const itemCount = useCartStore((state) => state.getItemCount())
  const wishlistCount = useWishlistStore((state) => state.wishlistCount)
  const setWishlistCount = useWishlistStore((state) => state.setWishlistCount)
  const router = useRouter()
  const { data: session, status } = useSession()
  const [inventorySummary, setInventorySummary] = React.useState<{ low: number; out: number } | null>(null)
  const isAdmin = (session?.user as any)?.role?.toString().toLowerCase() === 'admin'

  React.useEffect(() => {
    setMounted(true)
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  React.useEffect(() => {
    if (!session?.user) return

    fetch('/api/wishlist')
      .then(res => res.json())
      .then(data => setWishlistCount(data.items?.length || 0))
      .catch(() => setWishlistCount(0))

    if (isAdmin) {
      fetch('/api/admin/inventory?type=summary')
        .then((res) => res.ok ? res.json() : null)
        .then((data) => {
          if (data && typeof data.lowStockCount === 'number' && typeof data.outOfStockCount === 'number') {
            setInventorySummary({ low: data.lowStockCount, out: data.outOfStockCount })
          }
        })
        .catch(() => setInventorySummary(null))
    } else {
      setInventorySummary(null)
    }
  }, [session, isAdmin, setWishlistCount])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchOpen(false)
      setSearchQuery("")
    }
  }

  return (
    <header className={`sticky top-0 z-50 border-b transition-all duration-300 ${
      scrolled 
        ? 'border-border/60 bg-background/98 backdrop-blur-xl shadow-lg shadow-brand-teal-medium/5' 
        : 'border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
    }`}>
      {/* Top bar */}
      <div className={`bg-gradient-to-r from-brand-teal-dark via-brand-teal-medium to-brand-teal-dark text-white transition-all duration-300 relative overflow-hidden ${
        scrolled ? 'py-1 text-[10px]' : 'py-1.5 text-[10px] md:text-xs'
      }`}>
        {/* Animated background shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3 md:gap-6">
            <a href="tel:+263788663313" className="flex items-center gap-1 md:gap-1.5 hover:text-brand-golden transition-all group">
              <Phone className="h-3 w-3 md:h-3.5 md:w-3.5 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-[10px] md:text-xs">+263 788 663 313</span>
            </a>
            <span className="hidden sm:inline text-white/90 text-[10px] md:text-xs">🚚 Free delivery in Harare</span>
          </div>
          <div className="flex items-center gap-3 md:gap-6 text-[10px] md:text-xs">
            <Link href="/support" className="hover:text-brand-golden transition-colors font-medium hidden sm:inline">💬 Help</Link>
            {session && (
              <Link href="/order-tracking" className="hover:text-brand-golden transition-colors font-medium">📦 Track Orders</Link>
            )}
            {isAdmin && inventorySummary && (
              <Link
                href="/admin/inventory"
                className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/70 border border-yellow-500/30 text-yellow-100 shadow-md hover:border-yellow-400/60 transition-colors"
              >
                <span className="text-[10px] md:text-xs font-semibold">Low {inventorySummary.low}</span>
                <span className="text-[10px] md:text-xs font-semibold text-red-200">Out {inventorySummary.out}</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-3 md:px-6 flex h-14 md:h-16 items-center justify-between gap-1">
        <Link href="/" className="flex items-center space-x-2 md:space-x-3 group flex-shrink-0">
          <div className="relative">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:shadow-brand-teal-medium/30 transition-all duration-300 group-hover:scale-105 overflow-hidden bg-gradient-to-br from-brand-teal-dark via-brand-teal-medium to-brand-golden p-1">
              <img 
                src="/digital-solutions-logo.png" 
                alt="Algol Digital Solutions" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-brand-teal-medium to-brand-golden opacity-0 group-hover:opacity-20 blur-lg transition-opacity" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm md:text-base lg:text-lg font-bold leading-none bg-gradient-to-r from-brand-teal-dark to-brand-teal-medium bg-clip-text text-transparent">Algol Digital</span>
            <span className="text-[9px] md:text-[10px] text-muted-foreground font-medium mt-0.5 hidden sm:block">Premium IT Solutions</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-brand-teal-dark transition-all duration-300 group"
            >
              {item.name}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-brand-teal-medium to-brand-golden group-hover:w-3/4 transition-all duration-300 rounded-full" />
            </Link>
          ))}
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <form onSubmit={handleSearch} className="relative w-full group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-brand-teal-medium transition-colors" />
            <input
              type="search"
              placeholder="Search products, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-border bg-background/50 backdrop-blur-sm focus:outline-none focus:border-brand-teal-medium focus:bg-background focus:ring-1 focus:ring-brand-teal-medium/20 transition-all duration-300 placeholder:text-muted-foreground/60"
            />
          </form>
        </div>

        <div className="flex items-center space-x-0.5 md:space-x-2">
          {/* Search Toggle - Mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Theme Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 md:h-10 md:w-10"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4 md:h-5 md:w-5" /> : <Moon className="h-4 w-4 md:h-5 md:w-5" />}
            </Button>
          )}

          {/* Account - Hidden on small mobile */}
          {session ? (
            <Link href="/account" className="hidden sm:inline-block">
              <Button variant="ghost" size="icon" className="h-9 w-9 md:h-10 md:w-10" aria-label="Account">
                <User className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </Link>
          ) : (
            <Link href="/auth/login" className="hidden sm:inline-block">
              <Button variant="ghost" className="h-9 md:h-10 px-3 md:px-4 text-xs md:text-sm font-medium">
                <LogIn className="h-4 w-4 mr-1.5" />
                Sign In
              </Button>
            </Link>
          )}

          {/* Wishlist */}
          <Link href="/wishlist" aria-label="Wishlist" className="relative">
            <Button variant="ghost" size="icon" className="relative h-9 w-9 md:h-10 md:w-10">
              <Heart className="h-4 w-4 md:h-5 md:w-5" />
              {mounted && wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 md:h-5 md:w-5 rounded-full bg-red-600 text-white text-[10px] md:text-xs flex items-center justify-center font-bold">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Button>
          </Link>

          {/* Cart */}
          <Link href="/cart" aria-label="Shopping cart" className="relative">
            <Button variant="ghost" size="icon" className="relative h-9 w-9 md:h-10 md:w-10">
              <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 md:h-5 md:w-5 rounded-full bg-violet-600 text-white text-[10px] md:text-xs flex items-center justify-center font-bold">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </Button>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-1.5 md:p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5 md:h-6 md:w-6" /> : <Menu className="h-5 w-5 md:h-6 md:w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Search */}
      {searchOpen && (
        <div className="md:hidden border-t border-border p-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              autoFocus
            />
          </form>
        </div>
      )}

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container py-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-sm font-medium text-muted-foreground hover:text-violet-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {session && (
              <>
                <Link
                  href="/order-tracking"
                  className="block text-sm font-medium text-muted-foreground hover:text-violet-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  My Orders
                </Link>
                <Link
                  href="/account"
                  className="block text-sm font-medium text-muted-foreground hover:text-violet-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  My Account
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    signOut({ callbackUrl: window.location.origin });
                  }}
                  className="block w-full text-left text-sm font-medium text-muted-foreground hover:text-violet-600 transition-colors"
                >
                  Sign Out
                </button>
              </>
            )}
            {!session && (
              <Link
                href="/auth/login"
                className="block text-sm font-medium text-muted-foreground hover:text-violet-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
