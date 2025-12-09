"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui-lib"
import { 
  User, 
  Package, 
  Heart, 
  MapPin, 
  CreditCard, 
  Settings, 
  LogOut,
  ChevronRight,
  Eye,
  EyeOff,
  Mail,
  Phone,
  ShoppingBag
} from "lucide-react"

// Mock user data (in real app, this would come from auth)
const mockUser = {
  name: "John Moyo",
  email: "john.moyo@example.com",
  phone: "+263 77 123 4567",
  memberSince: "2024",
}

const mockOrders = [
  {
    id: "ORD-2024-001",
    date: "2024-12-01",
    status: "Delivered",
    total: 1899,
    items: [
      { name: "Lenovo ThinkPad T14s Gen 4", qty: 1 },
    ]
  },
  {
    id: "ORD-2024-002",
    date: "2024-11-28",
    status: "Processing",
    total: 398,
    items: [
      { name: "Logitech MX Master 3S", qty: 1 },
      { name: "Logitech MX Keys S", qty: 1 },
    ]
  },
  {
    id: "ORD-2024-003",
    date: "2024-11-15",
    status: "Delivered",
    total: 799,
    items: [
      { name: "Dell UltraSharp U2723QE", qty: 1 },
    ]
  },
]

const mockAddresses = [
  {
    id: 1,
    type: "Home",
    name: "John Moyo",
    address: "45 Churchill Avenue",
    city: "Harare",
    phone: "+263 77 123 4567",
    isDefault: true,
  },
  {
    id: 2,
    type: "Office",
    name: "John Moyo",
    address: "Suite 201, Eastgate Mall",
    city: "Harare",
    phone: "+263 24 2123456",
    isDefault: false,
  },
]

type Tab = "orders" | "addresses" | "profile" | "security"

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<Tab>("orders")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })

  const tabs = [
    { id: "orders" as Tab, label: "My Orders", icon: Package },
    { id: "addresses" as Tab, label: "Addresses", icon: MapPin },
    { id: "profile" as Tab, label: "Profile", icon: User },
    { id: "security" as Tab, label: "Security", icon: Settings },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
      case "Processing": return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
      case "Shipped": return "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400"
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-950 flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-violet-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Sign In to Your Account</h1>
            <p className="text-muted-foreground">Access your orders, wishlist, and more</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Password</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 pr-10 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-border" />
                    <span>Remember me</span>
                  </label>
                  <a href="#" className="text-violet-600 hover:underline">Forgot password?</a>
                </div>
                <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700">
                  Sign In
                </Button>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground mb-4">Or continue with</p>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full">
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </Button>
                <Button variant="outline" className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  Phone
                </Button>
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <a href="#" className="text-violet-600 hover:underline font-medium">Create one</a>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
              {/* User Info */}
              <div className="text-center pb-6 border-b border-border mb-6">
                <div className="w-20 h-20 rounded-full bg-violet-100 dark:bg-violet-950 flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-violet-600" />
                </div>
                <h2 className="font-semibold text-lg">{mockUser.name}</h2>
                <p className="text-sm text-muted-foreground">{mockUser.email}</p>
                <p className="text-xs text-muted-foreground mt-1">Member since {mockUser.memberSince}</p>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? "bg-violet-100 dark:bg-violet-950 text-violet-600"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
                <Link
                  href="/wishlist"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <Heart className="h-5 w-5" />
                  <span className="font-medium">Wishlist</span>
                </Link>
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold">My Orders</h1>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/products">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Continue Shopping
                    </Link>
                  </Button>
                </div>

                {mockOrders.length === 0 ? (
                  <div className="text-center py-16 bg-card border border-border rounded-xl">
                    <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                    <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
                    <Button asChild>
                      <Link href="/products">Browse Products</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {mockOrders.map((order) => (
                      <div key={order.id} className="bg-card border border-border rounded-xl p-6">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                          <div>
                            <p className="font-semibold">{order.id}</p>
                            <p className="text-sm text-muted-foreground">Placed on {order.date}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                            <span className="font-bold text-lg">${order.total}</span>
                          </div>
                        </div>
                        <div className="border-t border-border pt-4">
                          <div className="space-y-2">
                            {order.items.map((item, i) => (
                              <div key={i} className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">{item.name}</span>
                                <span>x{item.qty}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 flex gap-3">
                            <Button variant="outline" size="sm">View Details</Button>
                            {order.status === "Delivered" && (
                              <Button variant="outline" size="sm">Leave Review</Button>
                            )}
                            {order.status === "Processing" && (
                              <Button variant="outline" size="sm">Track Order</Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold">Saved Addresses</h1>
                  <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
                    <MapPin className="mr-2 h-4 w-4" />
                    Add New Address
                  </Button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {mockAddresses.map((address) => (
                    <div 
                      key={address.id} 
                      className={`bg-card border rounded-xl p-6 relative ${
                        address.isDefault ? "border-violet-500" : "border-border"
                      }`}
                    >
                      {address.isDefault && (
                        <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-xs font-medium bg-violet-100 text-violet-600 dark:bg-violet-950">
                          Default
                        </span>
                      )}
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-muted">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{address.type}</p>
                          <p className="text-sm text-muted-foreground mt-1">{address.name}</p>
                          <p className="text-sm text-muted-foreground">{address.address}</p>
                          <p className="text-sm text-muted-foreground">{address.city}</p>
                          <p className="text-sm text-muted-foreground">{address.phone}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        {!address.isDefault && (
                          <Button variant="outline" size="sm">Set as Default</Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Profile Information</h1>
                <div className="bg-card border border-border rounded-xl p-6">
                  <form className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Full Name</label>
                        <input
                          type="text"
                          defaultValue={mockUser.name}
                          className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Phone Number</label>
                        <input
                          type="tel"
                          defaultValue={mockUser.phone}
                          className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address</label>
                      <input
                        type="email"
                        defaultValue={mockUser.email}
                        className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Date of Birth</label>
                      <input
                        type="date"
                        className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                      />
                    </div>
                    <Button className="bg-violet-600 hover:bg-violet-700">
                      Save Changes
                    </Button>
                  </form>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Security Settings</h1>
                <div className="space-y-6">
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="font-semibold mb-4">Change Password</h3>
                    <form className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Current Password</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">New Password</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                        />
                      </div>
                      <Button className="bg-violet-600 hover:bg-violet-700">
                        Update Password
                      </Button>
                    </form>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="font-semibold mb-4">Two-Factor Authentication</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add an extra layer of security to your account by enabling two-factor authentication.
                    </p>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="font-semibold mb-4 text-red-600">Delete Account</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
