'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui-lib/button'
import { ArrowLeft, Loader2, TrendingUp, Trophy, BarChart3 } from 'lucide-react'
import toast from 'react-hot-toast'

interface ABTestStats {
  id: string
  name: string
  status: string
  testingMetric: string
  startDate: string
  endDate: string
  winnerVariant?: string
  confidenceLevel: number
  controlName: string
  variantAName: string
  variantBName: string
  variantCName: string
  controlOpens: number
  variantAOpens: number
  variantBOpens: number
  variantCOpens: number
  controlClicks: number
  variantAClicks: number
  variantBClicks: number
  variantCClicks: number
  controlConversions: number
  variantAConversions: number
  variantBConversions: number
  variantCConversions: number
}

interface ABTestResultsProps {
  campaignId: string
  testId: string
  onBack: () => void
}

export function ABTestResults({ campaignId, testId, onBack }: ABTestResultsProps) {
  const [test, setTest] = useState<ABTestStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [declaring, setDeclaring] = useState(false)

  useEffect(() => {
    fetchTest()
  }, [testId])

  const fetchTest = async () => {
    try {
      const response = await fetch(
        `/api/admin/campaigns/${campaignId}/ab-tests/${testId}`
      )
      if (response.ok) {
        const data = await response.json()
        setTest(data)
      }
    } catch (error) {
      console.error('Failed to fetch test:', error)
      toast.error('Failed to load test')
    } finally {
      setLoading(false)
    }
  }

  const declareWinner = async (variant: string) => {
    if (!test) return
    setDeclaring(true)
    try {
      const response = await fetch(
        `/api/admin/campaigns/${campaignId}/ab-tests/${testId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'COMPLETED', winnerVariant: variant }),
        }
      )
      if (response.ok) {
        toast.success(`${variant} declared as winner`)
        fetchTest()
      } else {
        toast.error('Failed to declare winner')
      }
    } catch (error) {
      console.error('Failed to declare winner:', error)
      toast.error('Failed to declare winner')
    } finally {
      setDeclaring(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!test) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">Test not found</p>
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
    )
  }

  const variants = [
    {
      name: test.controlName || 'Control',
      key: 'control',
      opens: test.controlOpens,
      clicks: test.controlClicks,
      conversions: test.controlConversions,
    },
    {
      name: test.variantAName || 'Variant A',
      key: 'variantA',
      opens: test.variantAOpens,
      clicks: test.variantAClicks,
      conversions: test.variantAConversions,
    },
    {
      name: test.variantBName || 'Variant B',
      key: 'variantB',
      opens: test.variantBOpens,
      clicks: test.variantBClicks,
      conversions: test.variantBConversions,
    },
    {
      name: test.variantCName || 'Variant C',
      key: 'variantC',
      opens: test.variantCOpens,
      clicks: test.variantCClicks,
      conversions: test.variantCConversions,
    },
  ]

  const totalOpens = variants.reduce((sum, v) => sum + v.opens, 0)
  const totalClicks = variants.reduce((sum, v) => sum + v.clicks, 0)
  const totalConversions = variants.reduce((sum, v) => sum + v.conversions, 0)

  const calculateMetrics = (variant: typeof variants[0]) => {
    const openRate = variant.opens > 0 ? (variant.clicks / variant.opens) * 100 : 0
    const clickRate = variant.clicks > 0 ? (variant.conversions / variant.clicks) * 100 : 0
    const conversionRate = variant.opens > 0 ? (variant.conversions / variant.opens) * 100 : 0
    return { openRate, clickRate, conversionRate }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{test.name}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Testing: {test.testingMetric.replace('_', ' ').toUpperCase()}
          </p>
        </div>
        <Button onClick={onBack} variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Test Status */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Status</p>
            <p className="font-semibold capitalize">{test.status}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Confidence Level</p>
            <p className="font-semibold">{(test.confidenceLevel * 100).toFixed(0)}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Start Date</p>
            <p className="font-semibold">{new Date(test.startDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">End Date</p>
            <p className="font-semibold">{new Date(test.endDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <BarChart3 className="h-5 w-5 text-blue-500 mb-2" />
          <p className="text-xs text-muted-foreground mb-1">Total Opens</p>
          <p className="text-2xl font-bold">{totalOpens.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <TrendingUp className="h-5 w-5 text-green-500 mb-2" />
          <p className="text-xs text-muted-foreground mb-1">Total Clicks</p>
          <p className="text-2xl font-bold">{totalClicks.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <Trophy className="h-5 w-5 text-yellow-500 mb-2" />
          <p className="text-xs text-muted-foreground mb-1">Total Conversions</p>
          <p className="text-2xl font-bold">{totalConversions.toLocaleString()}</p>
        </div>
      </div>

      {/* Variants Comparison */}
      <div className="space-y-3">
        {variants.map((variant) => {
          const metrics = calculateMetrics(variant)
          const isWinner = test.winnerVariant && test.winnerVariant.toLowerCase() === variant.key.toLowerCase()

          return (
            <div
              key={variant.key}
              className={`bg-card border-2 rounded-lg p-4 ${
                isWinner ? 'border-yellow-500 bg-yellow-50/10' : 'border-border'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {isWinner && <Trophy className="h-5 w-5 text-yellow-500" />}
                  <div>
                    <h3 className="font-semibold">{variant.name}</h3>
                    {isWinner && (
                      <p className="text-xs text-yellow-700 font-medium">Winner Declared</p>
                    )}
                  </div>
                </div>
                {test.status === 'RUNNING' && !isWinner && (
                  <Button
                    onClick={() => declareWinner(variant.key)}
                    disabled={declaring}
                    size="sm"
                    variant="outline"
                  >
                    {declaring ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trophy className="h-4 w-4 mr-2" />}
                    Declare Winner
                  </Button>
                )}
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="bg-muted p-3 rounded">
                  <p className="text-xs text-muted-foreground mb-1">Opens</p>
                  <p className="font-bold text-lg">{variant.opens.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {totalOpens > 0 ? ((variant.opens / totalOpens) * 100).toFixed(1) : '0'}%
                  </p>
                </div>
                <div className="bg-muted p-3 rounded">
                  <p className="text-xs text-muted-foreground mb-1">Open Rate</p>
                  <p className="font-bold text-lg">{metrics.openRate.toFixed(2)}%</p>
                </div>
                <div className="bg-muted p-3 rounded">
                  <p className="text-xs text-muted-foreground mb-1">Clicks</p>
                  <p className="font-bold text-lg">{variant.clicks.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {totalClicks > 0 ? ((variant.clicks / totalClicks) * 100).toFixed(1) : '0'}%
                  </p>
                </div>
                <div className="bg-muted p-3 rounded">
                  <p className="text-xs text-muted-foreground mb-1">Click Rate</p>
                  <p className="font-bold text-lg">{metrics.clickRate.toFixed(2)}%</p>
                </div>
                <div className="bg-muted p-3 rounded">
                  <p className="text-xs text-muted-foreground mb-1">Conversions</p>
                  <p className="font-bold text-lg">{variant.conversions.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {totalConversions > 0 ? ((variant.conversions / totalConversions) * 100).toFixed(1) : '0'}%
                  </p>
                </div>
                <div className="bg-muted p-3 rounded">
                  <p className="text-xs text-muted-foreground mb-1">Conv. Rate</p>
                  <p className="font-bold text-lg">{metrics.conversionRate.toFixed(2)}%</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Info */}
      <div className="bg-blue-50/10 border border-blue-200/30 rounded-lg p-4 text-sm text-muted-foreground">
        <p>
          <strong>Note:</strong> This A/B test displays raw performance metrics for each variant. Statistical
          significance testing and confidence intervals are recommended for production decisions.
        </p>
      </div>
    </div>
  )
}
