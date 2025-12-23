"use client"

import { useEffect, useState } from 'react'
import { PlusCircle, Trash2 } from 'lucide-react'

interface SavedFilter {
  id: string
  name: string
  resource: string
  query: any
  isDefault: boolean
  createdAt: string
}

interface SavedFiltersProps {
  defaultResource?: string
}

export function SavedFilters({ defaultResource }: SavedFiltersProps = { defaultResource: 'products' }) {
  const [filters, setFilters] = useState<SavedFilter[]>([])
  const [name, setName] = useState('')
  const [resource, setResource] = useState(defaultResource || 'products')
  const [query, setQuery] = useState('{"search":"","status":"all"}')
  const [loading, setLoading] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/search/filters?resource=${resource}`)
      const data = await res.json()
      setFilters(data.filters || [])
    } catch (err) {
      console.error('Failed to load filters', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource])

  async function saveFilter() {
    try {
      const res = await fetch('/api/admin/search/filters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, resource, query, isDefault: true }),
      })
      if (!res.ok) throw new Error('Save failed')
      setName('')
      await load()
    } catch (err) {
      console.error(err)
    }
  }

  async function deleteFilter(id: string) {
    try {
      const res = await fetch(`/api/admin/search/filters?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      await load()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-inner shadow-slate-950/50">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-sm uppercase tracking-wide text-slate-400">Saved Filters</div>
          <div className="text-lg font-semibold text-white">Advanced search presets</div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <input
          className="rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
          placeholder="Filter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
          placeholder="Resource (e.g. products)"
          value={resource}
          onChange={(e) => setResource(e.target.value)}
        />
        <textarea
          className="h-20 rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
          placeholder='{"status":"active"}'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="mt-3 flex justify-end">
        <button
          onClick={saveFilter}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <PlusCircle className="h-4 w-4" />
          Save & Set Default
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {loading && <div className="text-sm text-slate-400">Loading...</div>}
        {!loading && filters.length === 0 && <div className="text-sm text-slate-400">No saved filters yet.</div>}
        {filters.map((filter) => (
          <div
            key={filter.id}
            className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
          >
            <div>
              <div className="font-semibold text-white">{filter.name}</div>
              <div className="text-xs text-slate-400">{filter.resource}</div>
              <div className="text-xs text-slate-500">Default: {filter.isDefault ? 'Yes' : 'No'}</div>
            </div>
            <button
              className="text-slate-400 hover:text-red-400"
              onClick={() => deleteFilter(filter.id)}
              aria-label="Delete filter"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
