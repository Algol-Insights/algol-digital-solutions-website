'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getCategories, deleteCategory, createCategory, updateCategory } from '@/lib/api'
import type { ApiCategory } from '@/lib/api'

export default function AdminCategories() {
  const [categories, setCategories] = useState<ApiCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newCategory, setNewCategory] = useState({ name: '', description: '' })
  const [editingCategory, setEditingCategory] = useState<ApiCategory | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const data = await getCategories()
      setCategories(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategory.name.trim()) return

    try {
      const slug = newCategory.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      const created = await createCategory({
        name: newCategory.name,
        slug,
        description: newCategory.description || undefined,
      })
      setCategories([...categories, created])
      setNewCategory({ name: '', description: '' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create category')
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCategory) return

    try {
      const updated = await updateCategory(editingCategory.id, {
        name: editingCategory.name,
        description: editingCategory.description,
      })
      setCategories(categories.map(c => c.id === updated.id ? updated : c))
      setEditingId(null)
      setEditingCategory(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update category')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return

    try {
      await deleteCategory(id)
      setCategories(categories.filter(c => c.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-950 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/admin" className="text-slate-400 hover:text-white mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-white">Manage Categories</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Add New Category Form */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Add New Category</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <input
              type="text"
              placeholder="Category Name"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
            <textarea
              placeholder="Description (optional)"
              value={newCategory.description}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              rows={3}
            />
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 w-full">
              Create Category
            </Button>
          </form>
        </div>

        {/* Categories List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-400">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">No categories yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.id} className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                {editingId === category.id ? (
                  <form onSubmit={handleUpdate} className="space-y-4">
                    <input
                      type="text"
                      value={editingCategory?.name || ''}
                      onChange={(e) => setEditingCategory(editingCategory ? { ...editingCategory, name: e.target.value } : null)}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    />
                    <textarea
                      value={editingCategory?.description || ''}
                      onChange={(e) => setEditingCategory(editingCategory ? { ...editingCategory, description: e.target.value } : null)}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button type="submit" className="bg-green-600 hover:bg-green-700">
                        Save
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          setEditingId(null)
                          setEditingCategory(null)
                        }}
                        className="bg-slate-700 hover:bg-slate-600"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                      {category.description && (
                        <p className="text-slate-400 mt-1">{category.description}</p>
                      )}
                      <p className="text-slate-500 text-sm mt-2">ID: {category.id}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          setEditingId(category.id)
                          setEditingCategory(category)
                        }}
                        variant="outline"
                        className="border-slate-600 text-slate-300"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(category.id)}
                        variant="destructive"
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-400"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
