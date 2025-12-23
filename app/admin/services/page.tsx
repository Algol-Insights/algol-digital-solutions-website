'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, EyeOff, Star } from 'lucide-react'
import { Button } from '@/components/ui-lib'
import { LoadingSpinner, TableSkeleton } from '@/components/loading-states'
import { useToast } from '@/components/toast'

interface Service {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  pricingType: string
  category: string | null
  featured: boolean
  active: boolean
  sortOrder: number
  createdAt: string
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const toast = useToast()

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/services?active=false')
      const data = await res.json()
      if (data.success) {
        setServices(data.services)
      }
    } catch (error) {
      console.error('Error loading services:', error)
      toast.error('Failed to load services')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return

    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Service deleted successfully')
        loadServices()
      } else {
        toast.error(data.error || 'Failed to delete service')
      }
    } catch (error) {
      console.error('Error deleting service:', error)
      toast.error('Failed to delete service')
    }
  }

  const toggleActive = async (service: Service) => {
    try {
      const res = await fetch(`/api/services/${service.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...service, active: !service.active }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success(`Service ${service.active ? 'deactivated' : 'activated'}`)
        loadServices()
      }
    } catch (error) {
      console.error('Error toggling service:', error)
      toast.error('Failed to update service')
    }
  }

  const toggleFeatured = async (service: Service) => {
    try {
      const res = await fetch(`/api/services/${service.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...service, featured: !service.featured }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success(`Service ${service.featured ? 'unfeatured' : 'featured'}`)
        loadServices()
      }
    } catch (error) {
      console.error('Error toggling featured:', error)
      toast.error('Failed to update service')
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Services Management</h1>
        <TableSkeleton rows={5} cols={6} />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Services Management</h1>
        <Button onClick={() => {
          setEditingService(null)
          setShowModal(true)
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-950 border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Price</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Status</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Featured</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium">{service.name}</div>
                      {service.description && (
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {service.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {service.category && (
                      <span className="inline-flex px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400">
                        {service.category}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      {service.pricingType === 'from' && 'From '}
                      ${service.price.toLocaleString()}
                      {service.pricingType === 'quote' && ' (Quote)'}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleActive(service)}
                      className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        service.active
                          ? 'bg-green-100 dark:bg-green-950/20 text-green-700 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-950/20 text-gray-700 dark:text-gray-400'
                      }`}
                    >
                      {service.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleFeatured(service)}
                      className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 ${
                        service.featured ? 'text-yellow-500' : 'text-gray-400'
                      }`}
                    >
                      <Star className={`h-5 w-5 ${service.featured ? 'fill-current' : ''}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingService(service)
                          setShowModal(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(service.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {services.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No services found. Click "Add Service" to create your first service.</p>
        </div>
      )}

      {showModal && (
        <ServiceModal
          service={editingService}
          onClose={() => {
            setShowModal(false)
            setEditingService(null)
          }}
          onSave={() => {
            setShowModal(false)
            setEditingService(null)
            loadServices()
          }}
        />
      )}
    </div>
  )
}

function ServiceModal({
  service,
  onClose,
  onSave,
}: {
  service: Service | null
  onClose: () => void
  onSave: () => void
}) {
  const [formData, setFormData] = useState({
    name: service?.name || '',
    slug: service?.slug || '',
    description: service?.description || '',
    longDescription: '',
    icon: service?.slug || '',
    price: service?.price || 0,
    pricingType: service?.pricingType || 'from',
    category: service?.category || '',
    featured: service?.featured || false,
    active: service?.active !== false,
    features: [] as string[],
    sortOrder: service?.sortOrder || 0,
  })
  const [saving, setSaving] = useState(false)
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = service ? `/api/services/${service.id}` : '/api/services'
      const method = service ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (data.success) {
        toast.success(`Service ${service ? 'updated' : 'created'} successfully`)
        onSave()
      } else {
        toast.error(data.error || 'Failed to save service')
      }
    } catch (error) {
      console.error('Error saving service:', error)
      toast.error('Failed to save service')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-950 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b sticky top-0 bg-white dark:bg-slate-950">
          <h2 className="text-2xl font-bold">
            {service ? 'Edit Service' : 'Add New Service'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                const name = e.target.value
                setFormData({ 
                  ...formData, 
                  name,
                  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                })
              }}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Slug *</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Price *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
                required
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Pricing Type</label>
              <select
                value={formData.pricingType}
                onChange={(e) => setFormData({ ...formData, pricingType: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="from">From (Starting at)</option>
                <option value="fixed">Fixed Price</option>
                <option value="quote">Request Quote</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="e.g., Web Services, IT Support, etc."
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm font-medium">Featured</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm font-medium">Active</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Service'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
