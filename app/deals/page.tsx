import Link from "next/link"
import { Button } from "@/components/ui-lib"
import { ArrowRight, Clock, Zap, Tag, Percent, Gift, TrendingDown } from "lucide-react"
import { products } from "@/lib/products"
import { ProductCard } from "@/components/product-card"

// Products on sale (have originalPrice)
const saleProducts = products.filter(p => p.originalPrice)

// Calculate savings
const calculateSavings = (price: number, originalPrice: number) => {
  return Math.round(((originalPrice - price) / originalPrice) * 100)
}

// Featured deals (highest discount)
const featuredDeals = [...saleProducts]
  .sort((a, b) => {
    const savingsA = a.originalPrice ? calculateSavings(a.price, a.originalPrice) : 0
    const savingsB = b.originalPrice ? calculateSavings(b.price, b.originalPrice) : 0
    return savingsB - savingsA
  })
  .slice(0, 3)

export default function DealsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 text-white py-16">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/20 text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              Limited Time Offers
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Hot Deals & Discounts
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Save up to 20% on selected laptops, monitors, storage and more. 
              Don&apos;t miss out on these exclusive deals!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-white/90">
                <a href="#all-deals">
                  View All Deals <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Countdown Banner */}
      <section className="bg-gray-900 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-4 text-center">
            <Clock className="h-5 w-5 text-orange-400" />
            <span className="font-medium">Sale ends in:</span>
            <div className="flex gap-2">
              {[
                { value: "02", label: "Days" },
                { value: "14", label: "Hours" },
                { value: "36", label: "Min" },
                { value: "22", label: "Sec" },
              ].map((item) => (
                <div key={item.label} className="bg-white/10 rounded px-3 py-1">
                  <span className="text-lg font-bold text-orange-400">{item.value}</span>
                  <span className="text-xs text-gray-400 ml-1">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Deals */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">🔥 Top Deals</h2>
            <p className="text-muted-foreground">Our biggest discounts on premium products</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredDeals.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group relative bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 rounded-2xl border border-orange-200 dark:border-orange-800 p-6 hover:shadow-xl transition-all"
              >
                {/* Discount Badge */}
                <div className="absolute top-4 right-4 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                  -{product.originalPrice ? calculateSavings(product.price, product.originalPrice) : 0}%
                </div>

                <div className="aspect-square bg-white dark:bg-gray-900 rounded-xl mb-4 flex items-center justify-center">
                  <Tag className="h-16 w-16 text-orange-400" />
                </div>

                <p className="text-sm text-muted-foreground mb-1">{product.brand}</p>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-orange-600 transition-colors">
                  {product.name}
                </h3>
                
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-orange-600">${product.price}</span>
                  <span className="text-lg text-muted-foreground line-through">${product.originalPrice}</span>
                </div>
                
                <p className="text-sm text-green-600 mt-2 font-medium">
                  Save ${product.originalPrice! - product.price}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Deal Categories */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Percent, title: "Up to 20% Off", subtitle: "Laptops", color: "bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400" },
              { icon: TrendingDown, title: "Price Drop", subtitle: "Monitors", color: "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400" },
              { icon: Gift, title: "Bundle Deals", subtitle: "Accessories", color: "bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400" },
              { icon: Zap, title: "Flash Sale", subtitle: "Storage", color: "bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400" },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-orange-500/50 transition-colors cursor-pointer"
              >
                <div className={`p-3 rounded-xl ${item.color}`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Deals */}
      <section id="all-deals" className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold">All Deals</h2>
              <p className="text-muted-foreground mt-2">{saleProducts.length} products on sale</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/products">View All Products</Link>
            </Button>
          </div>

          {saleProducts.length === 0 ? (
            <div className="text-center py-16 bg-card border border-border rounded-xl">
              <Tag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No deals available</h3>
              <p className="text-muted-foreground mb-6">Check back soon for new offers!</p>
              <Button asChild>
                <Link href="/products">Browse All Products</Link>
              </Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {saleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <Zap className="h-12 w-12 mx-auto text-orange-400 mb-6" />
          <h2 className="text-3xl font-bold mb-4">Never Miss a Deal</h2>
          <p className="text-gray-400 mb-8">
            Subscribe to our newsletter and be the first to know about exclusive offers and flash sales.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            />
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  )
}
