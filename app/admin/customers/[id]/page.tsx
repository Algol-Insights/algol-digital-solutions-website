'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Send,
  Trash2,
  Award,
  Heart,
  Clock,
  AlertTriangle,
  Zap,
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CustomerDetail {
  customer: {
    id: string
    name: string
    email: string
    phone: string | null
    city: string | null
    state: string | null
    postalCode: string | null
    country: string | null
    createdAt: string
    updatedAt: string
  }
  metrics: {
    totalOrders: number
    lifetimeValue: number
    averageOrderValue: number
    lastOrderDate: string | null
    segment: string
  }
  insights: {
    categoryPreferences: Array<[string, { count: number; spent: number }]>
    repeatPurchaseRate: number
    orderFrequency: number
    riskLevel: string
  }
}

const segmentConfig: Record<string, { icon: any; color: string }> = {
  VIP: { icon: Award, color: 'text-yellow-400' },
  LOYAL: { icon: Heart, color: 'text-red-400' },
  NEW: { icon: Zap, color: 'text-blue-400' },
  AT_RISK: { icon: AlertTriangle, color: 'text-orange-400' },
  INACTIVE: { icon: Clock, color: 'text-slate-400' },
  REGULAR: { icon: User, color: 'text-slate-300' },
}

interface Note {
  id: string
  content: string
  createdAt: string
  author: string
}

export default function CustomerDetailPage() {
  const params = useParams()
  const customerId = params.id as string

  const [customer, setCustomer] = useState<CustomerDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState('')
  const [savingNote, setSavingNote] = useState(false)

  useEffect(() => {
    loadCustomer()
    loadNotes()
  }, [customerId])

  const loadCustomer = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/customers/${customerId}`)
      if (!response.ok) throw new Error('Failed to load customer')
      const data = await response.json()
      setCustomer(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load customer')
    } finally {
      setLoading(false)
    }
  }

  const loadNotes = async () => {
    try {
      const response = await fetch(`/api/admin/customers/${customerId}/notes`)
      if (response.ok) {
        const data = await response.json()
        setNotes(data.notes || [])
      }
    } catch (err) {
      console.error('Failed to load notes:', err)
    }
  }

  const handleAddNote = async () => {
    if (!newNote.trim()) return

    setSavingNote(true)
    try {
      const response = await fetch(`/api/admin/customers/${customerId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newNote }),
      })

      if (!response.ok) throw new Error('Failed to save note')

      const note = await response.json()
      setNotes([note, ...notes])
      setNewNote('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save note')
    } finally {
      setSavingNote(false)
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    try {
      const response = await fetch(`/api/admin/customers/${customerId}/notes?noteId=${noteId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete note')

      setNotes(notes.filter((n) => n.id !== noteId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete note')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={32} className="animate-spin text-slate-400 mx-auto mb-4" />
          <p className="text-slate-300">Loading customer...</p>
        </div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-300 mb-4">{error || 'Customer not found'}</p>
          <Link href="/admin/customers">
            <Button>← Back to Customers</Button>
          </Link>
        </div>
      </div>
    )
  }

  const config = segmentConfig[customer.metrics.segment]
  const SegmentIcon = config.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-950 border-b border-slate-700 py-6 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <Link href="/admin/customers" className="flex items-center gap-2 text-slate-400 hover:text-white transition">
            <ArrowLeft size={20} />
            <span>Back to Customers</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">{customer.customer.name}</h1>
          <div className="w-20" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-200 text-sm flex items-center justify-between"
          >
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-300 hover:text-red-100">
              ×
            </button>
          </motion.div>
        )}

        {/* Customer Info & Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 space-y-4"
          >
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-lg bg-slate-800`}>
                  <SegmentIcon className={`w-6 h-6 ${config.color}`} />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Segment</p>
                  <p className={`text-lg font-bold ${config.color}`}>{customer.metrics.segment}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail size={16} className="text-slate-500" />
                  <a href={`mailto:${customer.customer.email}`} className="hover:text-white">
                    {customer.customer.email}
                  </a>
                </div>
                {customer.customer.phone && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <Phone size={16} className="text-slate-500" />
                    <a href={`tel:${customer.customer.phone}`} className="hover:text-white">
                      {customer.customer.phone}
                    </a>
                  </div>
                )}
                {(customer.customer.city || customer.customer.country) && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin size={16} className="text-slate-500" />
                    <span>
                      {customer.customer.city}
                      {customer.customer.city && customer.customer.country && ', '}
                      {customer.customer.country}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-slate-300">
                  <Calendar size={16} className="text-slate-500" />
                  <span>Joined {new Date(customer.customer.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Metrics Cards */}
            <div className="space-y-3">
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-white">{customer.metrics.totalOrders}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-1">Lifetime Value</p>
                <p className="text-2xl font-bold text-green-400">${(customer.metrics.lifetimeValue / 100).toFixed(2)}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-1">Avg Order Value</p>
                <p className="text-2xl font-bold text-blue-400">${(customer.metrics.averageOrderValue / 100).toFixed(2)}</p>
              </div>
            </div>
          </motion.div>

          {/* Insights & Analytics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Key Insights */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-2">Repeat Purchase Rate</p>
                <p className="text-2xl font-bold text-white">{customer.insights.repeatPurchaseRate.toFixed(0)}%</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-2">Order Frequency</p>
                <p className="text-2xl font-bold text-white">{customer.insights.orderFrequency.toFixed(2)}/mo</p>
              </div>
            </motion.div>

            {/* Category Preferences */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-900 border border-slate-800 rounded-lg p-6"
            >
              <h3 className="text-lg font-bold text-white mb-4">Top Categories</h3>
              <div className="space-y-3">
                {customer.insights.categoryPreferences.map(([category, data]) => (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-300">{category}</span>
                      <span className="text-sm text-slate-400">${(data.spent / 100).toFixed(0)}</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${
                            (data.spent /
                              customer.insights.categoryPreferences.reduce((sum, [, d]) => sum + d.spent, 0)) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Last Order */}
            {customer.metrics.lastOrderDate && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-slate-900 border border-slate-800 rounded-lg p-4"
              >
                <p className="text-slate-400 text-sm">Last Order</p>
                <p className="text-white">{new Date(customer.metrics.lastOrderDate).toLocaleDateString()}</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Notes Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-900 border border-slate-800 rounded-lg p-6"
        >
          <h3 className="text-lg font-bold text-white mb-4">Communication Notes</h3>

          <div className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && newNote.trim()) {
                    handleAddNote()
                  }
                }}
                className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100 placeholder-slate-500"
              />
              <Button onClick={handleAddNote} disabled={savingNote || !newNote.trim()} size="sm">
                <Send size={16} className="mr-1" />
                Add
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {notes.length === 0 ? (
              <p className="text-slate-400 text-sm">No notes yet</p>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="bg-slate-800 rounded p-3 flex justify-between items-start gap-3">
                  <div>
                    <p className="text-slate-100">{note.content}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {note.author} • {new Date(note.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-slate-500 hover:text-red-400 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
