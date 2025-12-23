import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getInventorySummary } from '@/lib/inventory'
import { DashboardWidgets } from '@/components/admin/dashboard-widgets'
import { SavedFilters } from '@/components/admin/saved-filters'

export default async function AdminDashboard() {
  const summary = await getInventorySummary()
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-lg shadow-slate-950/40">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-slate-400">Mobile-first shell with fast shortcuts</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/orders">
              <Button className="bg-blue-600 hover:bg-blue-700">View Orders</Button>
            </Link>
            <Link href="/admin/products">
              <Button variant="outline" className="border-slate-700 text-white hover:border-blue-500">
                Add Product
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <DashboardWidgets inventorySummary={summary} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
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

          {/* Sales Management */}
          <Link href="/admin/sales" className="group">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/20 transition-all cursor-pointer">
              <div className="mb-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center group-hover:bg-emerald-500/30 transition">
                  <span className="text-2xl">💰</span>
                </div>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Sales</h2>
              <p className="text-slate-400 mb-4">Record transactions and view sales history</p>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                Manage Sales →
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
              <p className="text-slate-400 mb-2">View stock levels and inventory history</p>
              <div className="flex items-center gap-2 mb-3 text-xs">
                <span className="px-2 py-1 rounded-full bg-yellow-500/15 text-yellow-200 border border-yellow-500/30">Low: {summary.lowStockCount}</span>
                <span className="px-2 py-1 rounded-full bg-red-500/15 text-red-200 border border-red-500/30">Out: {summary.outOfStockCount}</span>
              </div>
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

      <SavedFilters />
    </div>
  )
}
