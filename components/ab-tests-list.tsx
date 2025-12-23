'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui-lib/button'
import { Plus, Loader2, TrendingUp, BarChart3, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import { ABTestResults } from './ab-test-results'

interface ABTest {
  id: string
  name: string
  status: string
  testingMetric: string
  startDate: string
  endDate: string
  controlOpens: number
  variantAOpens: number
  variantBOpens: number
  variantCOpens: number
}

interface ABTestsListProps {
  campaignId: string
  tests?: ABTest[]
  onRefresh?: () => void
}

export function ABTestsList({ campaignId, tests: initialTests, onRefresh }: ABTestsListProps) {
  const [tests, setTests] = useState<ABTest[]>(initialTests || [])
  const [loading, setLoading] = useState(!initialTests)
  const [creating, setCreating] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    testingMetric: 'open_rate',
    controlCouponId: '',
    variantACouponId: '',
    variantBCouponId: '',
    variantCCouponId: '',
    startDate: '',
    endDate: '',
  })

  useEffect(() => {
    if (!initialTests) {
      fetchTests()
    }
  }, [campaignId])

  const fetchTests = async () => {
    try {
      const response = await fetch(`/api/admin/campaigns/${campaignId}/ab-tests`)
      if (response.ok) {
        const data = await response.json()
        setTests(data.tests)
      }
    } catch (error) {
      console.error('Failed to fetch A/B tests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!formData.name || !formData.startDate || !formData.endDate) {
      toast.error('Please fill in all required fields')
      return
    }

    setCreating(true)
    try {
      const response = await fetch(`/api/admin/campaigns/${campaignId}/ab-tests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('A/B test created successfully')
        setShowForm(false)
        setFormData({
          name: '',
          description: '',
          testingMetric: 'open_rate',
          controlCouponId: '',
          variantACouponId: '',
          variantBCouponId: '',
          variantCCouponId: '',
          startDate: '',
          endDate: '',
        })
        fetchTests()
        onRefresh?.()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to create A/B test')
      }
    } catch (error) {
      console.error('Failed to create A/B test:', error)
      toast.error('Failed to create A/B test')
    } finally {
      setCreating(false)
    }
  }

  if (selectedTestId) {
    return (
      <ABTestResults
        campaignId={campaignId}
        testId={selectedTestId}
        onBack={() => {
          setSelectedTestId(null)
          fetchTests()
        }}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">A/B Tests</h3>
        <Button onClick={() => setShowForm(!showForm)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Create Test
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {showForm && (
            <div className="bg-muted p-4 rounded-lg space-y-3">
              <input
                type="text"
                placeholder="Test name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded bg-background"
              />
              <textarea
                placeholder="Description (optional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded bg-background text-sm"
                rows={2}
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={formData.testingMetric}
                  onChange={(e) => setFormData({ ...formData, testingMetric: e.target.value })}
                  className="px-3 py-2 border border-border rounded bg-background text-sm"
                >
                  <option value="open_rate">Open Rate</option>
                  <option value="click_rate">Click Rate</option>
                  <option value="conversion_rate">Conversion Rate</option>
            </select>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="px-3 py-2 border border-border rounded bg-background text-sm"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="flex-1 px-3 py-2 border border-border rounded bg-background text-sm"
            />
            <Button onClick={handleCreate} disabled={creating}>
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create'}
            </Button>
          </div>
            </div>
          )}

          <div className="space-y-3">
            {tests.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No A/B tests yet</p>
            ) : (
              tests.map((test) => (
                <div key={test.id} className="bg-card border border-border rounded-lg p-4 hover:border-primary/50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{test.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Metric: {test.testingMetric.replace('_', ' ').toUpperCase()}
                      </p>
                    </div>
                    <div className="flex gap-2 items-start">
                      <Button
                        onClick={() => setSelectedTestId(test.id)}
                        size="sm"
                        variant="outline"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        test.status === 'RUNNING'
                          ? 'bg-green-100 text-green-800'
                          : test.status === 'COMPLETED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {test.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div className="bg-muted p-2 rounded">
                      <p className="text-muted-foreground">Control</p>
                      <p className="font-bold text-sm">{test.controlOpens}</p>
                      <p className="text-muted-foreground">opens</p>
                    </div>
                    <div className="bg-muted p-2 rounded">
                      <p className="text-muted-foreground">Variant A</p>
                      <p className="font-bold text-sm">{test.variantAOpens}</p>
                      <p className="text-muted-foreground">opens</p>
                    </div>
                    <div className="bg-muted p-2 rounded">
                      <p className="text-muted-foreground">Variant B</p>
                      <p className="font-bold text-sm">{test.variantBOpens}</p>
                      <p className="text-muted-foreground">opens</p>
                    </div>
                    <div className="bg-muted p-2 rounded">
                      <p className="text-muted-foreground">Variant C</p>
                      <p className="font-bold text-sm">{test.variantCOpens}</p>
                      <p className="text-muted-foreground">opens</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}
