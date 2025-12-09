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
        </div>
      </div>
    </div>
  )
}
