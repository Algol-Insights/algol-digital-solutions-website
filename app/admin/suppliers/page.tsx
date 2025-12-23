'use client'

import { useState } from 'react'
import SupplierList from '@/components/supplier-list'
import SupplierForm from '@/components/supplier-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-lib/card'
import { Button } from '@/components/ui/button'

export default function SuppliersPage() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [creating, setCreating] = useState(false)

  const refresh = () => setRefreshKey((k) => k + 1)

  const handleCreate = async (payload: any) => {
    setCreating(true)
    try {
      await fetch('/api/admin/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      refresh()
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Supplier Management</h1>
            <p className="text-slate-400 text-sm">Manage suppliers, costs, and lead times.</p>
          </div>
          <Button variant="outline" onClick={refresh}>Refresh</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SupplierList key={refreshKey} onRefresh={refresh} hideCreateLink />
          </div>
          <div className="lg:col-span-1">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg">Add Supplier</CardTitle>
              </CardHeader>
              <CardContent>
                <SupplierForm onSubmit={handleCreate} isLoading={creating} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
