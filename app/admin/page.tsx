import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-950 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-slate-400">Manage your e-commerce store</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Products Management */}
          <Link href="/admin/products" className="group">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all cursor-pointer">
              <div className="mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition">
                  <span className="text-2xl">📦</span>
                </div>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Products</h2>
              <p className="text-slate-400 mb-4">Add, edit, and manage your product inventory</p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Manage Products →
              </Button>
            </div>
          </Link>

          {/* Categories Management */}
          <Link href="/admin/categories" className="group">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/20 transition-all cursor-pointer">
              <div className="mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition">
                  <span className="text-2xl">🏷️</span>
                </div>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Categories</h2>
              <p className="text-slate-400 mb-4">Create and organize product categories</p>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Manage Categories →
              </Button>
            </div>
          </Link>

          {/* Orders Management */}
          <Link href="/admin/orders" className="group">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 hover:border-green-500 hover:shadow-lg hover:shadow-green-500/20 transition-all cursor-pointer">
              <div className="mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition">
                  <span className="text-2xl">📋</span>
                </div>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Orders</h2>
              <p className="text-slate-400 mb-4">Track and manage customer orders</p>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Manage Orders →
              </Button>
            </div>
          </Link>

          {/* Inventory Management */}
          <Link href="/admin/inventory" className="group">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/20 transition-all cursor-pointer">
              <div className="mb-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center group-hover:bg-orange-500/30 transition">
                  <span className="text-2xl">📊</span>
                </div>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Inventory</h2>
              <p className="text-slate-400 mb-4">View stock levels and inventory history</p>
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                View Inventory →
              </Button>
            </div>
          </Link>

          {/* Stock Alerts Management */}
          <Link href="/admin/stock-alerts" className="group">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 hover:border-teal-500 hover:shadow-lg hover:shadow-teal-500/20 transition-all cursor-pointer">
              <div className="mb-4">
                <div className="w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center group-hover:bg-teal-500/30 transition">
                  <span className="text-2xl">🔔</span>
                </div>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Stock Alerts</h2>
              <p className="text-slate-400 mb-4">Manage customer stock alerts and notifications</p>
              <Button className="w-full bg-teal-600 hover:bg-teal-700">
                Manage Alerts →
              </Button>
            </div>
          </Link>

          {/* Security Settings */}
          <Link href="/admin/security" className="group">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 hover:border-red-500 hover:shadow-lg hover:shadow-red-500/20 transition-all cursor-pointer">
              <div className="mb-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center group-hover:bg-red-500/30 transition">
                  <span className="text-2xl">🔒</span>
                </div>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Security</h2>
              <p className="text-slate-400 mb-4">Configure two-factor authentication and security settings</p>
              <Button className="w-full bg-red-600 hover:bg-red-700">
                Security Settings →
              </Button>
            </div>
          </Link>

          {/* Coupons Management */}
          <Link href="/admin/coupons" className="group">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/20 transition-all cursor-pointer">
              <div className="mb-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center group-hover:bg-yellow-500/30 transition">
                  <span className="text-2xl">🎟️</span>
                </div>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Coupons</h2>
              <p className="text-slate-400 mb-4">Create and manage discount coupons and promotions</p>
              <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                Manage Coupons →
              </Button>
            </div>
          </Link>

          {/* Analytics Dashboard */}
          <Link href="/admin/analytics" className="group">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 transition-all cursor-pointer">
              <div className="mb-4">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center group-hover:bg-indigo-500/30 transition">
                  <span className="text-2xl">📈</span>
                </div>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Analytics</h2>
              <p className="text-slate-400 mb-4">View sales reports, customer insights, and metrics</p>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                View Analytics →
              </Button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
