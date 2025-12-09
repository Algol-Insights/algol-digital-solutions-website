'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Package, AlertTriangle, DollarSign, Eye, Edit2, Trash2, Plus } from 'lucide-react'

interface InventoryItem {
  id: string
  product: string
  sku: string
  category: string
  stock: number
  minStock: number
  price: number
  status: 'ok' | 'low' | 'out'
}

const mockInventory: InventoryItem[] = [
  { id: '1', product: 'Premium Laptop Pro', sku: 'LPT-001', category: 'Laptops', stock: 12, minStock: 5, price: 1999.99, status: 'ok' },
  { id: '2', product: 'Gaming Monitor 4K', sku: 'MON-001', category: 'Monitors', stock: 3, minStock: 5, price: 599.99, status: 'low' },
  { id: '3', product: 'Wireless Headphones', sku: 'ACS-001', category: 'Accessories', stock: 0, minStock: 10, price: 199.99, status: 'out' },
  { id: '4', product: 'Professional Keyboard', sku: 'KBD-001', category: 'Accessories', stock: 28, minStock: 10, price: 149.99, status: 'ok' },
  { id: '5', product: 'Precision Mouse', sku: 'MOU-001', category: 'Accessories', stock: 45, minStock: 15, price: 79.99, status: 'ok' },
]

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory)
  const [filterStatus, setFilterStatus] = useState<'all' | 'ok' | 'low' | 'out'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: inventory.length,
    totalValue: inventory.reduce((sum, item) => sum + (item.stock * item.price), 0),
    lowStock: inventory.filter((item) => item.stock < item.minStock && item.stock > 0).length,
    outOfStock: inventory.filter((item) => item.stock === 0).length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-950 border-b border-slate-700 py-8 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <Link href="/" className="text-slate-400 hover:text-white mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            <ShoppingBag size={36} />
            Inventory Management
          </h1>
          <p className="text-slate-400 mt-1">Track and manage your product inventory</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm mb-1">Total Products</p>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
            <p className="text-slate-500 text-xs mt-2">SKUs</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm mb-1 flex items-center gap-2">
              <DollarSign size={16} className="text-green-400" />
              Inventory Value
            </p>
            <p className="text-3xl font-bold text-green-400">${(stats.totalValue / 1000).toFixed(1)}K</p>
            <p className="text-slate-500 text-xs mt-2">Total worth</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm mb-1 flex items-center gap-2">
              <AlertTriangle size={16} className="text-yellow-400" />
              Low Stock
            </p>
            <p className="text-3xl font-bold text-yellow-400">{stats.lowStock}</p>
            <p className="text-slate-500 text-xs mt-2">Below min level</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <p className="text-slate-400 text-sm mb-1 flex items-center gap-2">
              <Package size={16} className="text-red-400" />
              Out of Stock
            </p>
            <p className="text-3xl font-bold text-red-400">{stats.outOfStock}</p>
            <p className="text-slate-500 text-xs mt-2">Unavailable</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 text-sm font-semibold mb-2">Search Products</label>
              <input
                type="text"
                placeholder="Search by name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-semibold mb-2">Filter by Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Items</option>
                <option value="ok">In Stock</option>
                <option value="low">Low Stock</option>
                <option value="out">Out of Stock</option>
              </select>
            </div>

            <div className="flex items-end">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2">
                <Plus size={18} /> Add Product
              </button>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">SKU</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Stock</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => (
                  <tr key={item.id} className="border-b border-slate-700 hover:bg-slate-700/30 transition">
                    <td className="px-6 py-4">
                      <p className="text-white font-semibold">{item.product}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-300 font-mono text-sm">{item.sku}</td>
                    <td className="px-6 py-4 text-slate-300">{item.category}</td>
                    <td className="px-6 py-4">
                      <p className="text-white font-semibold">{item.stock}</p>
                      <p className="text-slate-500 text-xs">min: {item.minStock}</p>
                    </td>
                    <td className="px-6 py-4 text-right text-white font-semibold">${item.price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'ok' ? 'bg-green-500/20 text-green-400' :
                        item.status === 'low' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {item.status === 'ok' ? '✓ Ok' : item.status === 'low' ? '⚠ Low' : '✕ Out'}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button className="p-2 hover:bg-slate-700 text-slate-400 hover:text-blue-400 rounded transition">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 hover:bg-slate-700 text-slate-400 hover:text-amber-400 rounded transition">
                        <Edit2 size={18} />
                      </button>
                      <button className="p-2 hover:bg-slate-700 text-slate-400 hover:text-red-400 rounded transition">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
