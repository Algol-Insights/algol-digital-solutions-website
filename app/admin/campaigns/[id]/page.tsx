'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui-lib/button'
import { ArrowLeft, Loader2, Mail, TestTube, Calendar as CalendarIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { EmailAnalytics } from '@/components/email-analytics'
import { ABTestsList } from '@/components/ab-tests-list'
import { PromotionalCalendar } from '@/components/promotional-calendar'

interface CampaignDetail {
  id: string
  name: string
  description: string | null
  status: string
  targetingType: string
  targetSegment: string | null
  startDate: string
  endDate: string
  budget: number | null
  expectedROI: number | null
  impressions: number
  clicks: number
  conversions: number
  revenue: number
  emailsSent: number
  emailsOpened: number
  emailsClicked: number
  coupons: {
    id: string
    coupon: {
      id: string
      code: string
      type: string
    }
  }[]
}

export default function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [campaign, setCampaign] = useState<CampaignDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'email' | 'abtests' | 'calendar'>('overview')
  const [id, setId] = useState<string | null>(null)

  useEffect(() => {
    async function unwrapParams() {
      const { id: campaignId } = await params
      setId(campaignId)
    }
    unwrapParams()
  }, [params])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    } else if (status === 'authenticated') {
      if ((session?.user as any)?.role !== 'ADMIN') {
        router.push('/')
      } else if (id) {
        fetchCampaign()
      }
    }
  }, [status, session, router, id])

  const fetchCampaign = async () => {
    if (!id) return
    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/campaigns/${id}`)
      if (response.ok) {
        const data = await response.json()
        setCampaign(data)
      } else {
        toast.error('Campaign not found')
        router.push('/admin/campaigns')
      }
    } catch (error) {
      console.error('Failed to fetch campaign:', error)
      toast.error('Failed to load campaign')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="container py-8">
        <Button onClick={() => router.push('/admin/campaigns')} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Campaigns
        </Button>
        <div className="mt-4 text-center">
          <p className="text-muted-foreground">Campaign not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <Button onClick={() => router.push('/admin/campaigns')} variant="outline" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{campaign.name}</h1>
          <p className="text-muted-foreground mt-2">{campaign.description}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border mb-8">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
              activeTab === 'overview'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`pb-4 px-1 border-b-2 font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'email'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Mail className="h-4 w-4" />
            Email
          </button>
          <button
            onClick={() => setActiveTab('abtests')}
            className={`pb-4 px-1 border-b-2 font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'abtests'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <TestTube className="h-4 w-4" />
            A/B Tests
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`pb-4 px-1 border-b-2 font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'calendar'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <CalendarIcon className="h-4 w-4" />
            Calendar
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && (
          <div className="grid gap-6">
            {/* Campaign Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <p className="text-2xl font-bold capitalize">{campaign.status}</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Budget</p>
                <p className="text-2xl font-bold">${campaign.budget?.toLocaleString() || '0'}</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">ROI</p>
                <p className="text-2xl font-bold">{campaign.expectedROI?.toFixed(1) || '0'}%</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Revenue</p>
                <p className="text-2xl font-bold">${campaign.revenue?.toLocaleString() || '0'}</p>
              </div>
            </div>

            {/* Campaign Details */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">Campaign Details</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Start Date</p>
                  <p className="font-medium">{new Date(campaign.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">End Date</p>
                  <p className="font-medium">{new Date(campaign.endDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Targeting Type</p>
                  <p className="font-medium">{campaign.targetingType}</p>
                </div>
                {campaign.targetSegment && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Target Segment</p>
                    <p className="font-medium">{campaign.targetSegment}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">Performance Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Impressions</p>
                  <p className="text-2xl font-bold">{campaign.impressions.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Clicks</p>
                  <p className="text-2xl font-bold">{campaign.clicks.toLocaleString()}</p>
                  {campaign.impressions > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {((campaign.clicks / campaign.impressions) * 100).toFixed(2)}% CTR
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Conversions</p>
                  <p className="text-2xl font-bold">{campaign.conversions.toLocaleString()}</p>
                  {campaign.clicks > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {((campaign.conversions / campaign.clicks) * 100).toFixed(2)}% CR
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Associated Coupons */}
            {campaign.coupons.length > 0 && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-4">Associated Coupons</h3>
                <div className="space-y-2">
                  {campaign.coupons.map((cc) => (
                    <div key={cc.id} className="flex items-center justify-between p-3 bg-muted rounded">
                      <span className="font-mono font-bold">{cc.coupon.code}</span>
                      <span className="text-sm text-muted-foreground">{cc.coupon.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'email' && <EmailAnalytics campaignId={campaign.id} emailsSent={campaign.emailsSent} emailsOpened={campaign.emailsOpened} emailsClicked={campaign.emailsClicked} />}

        {activeTab === 'abtests' && <ABTestsList campaignId={campaign.id} />}

        {activeTab === 'calendar' && <PromotionalCalendar campaignId={campaign.id} />}
      </div>
    </div>
  )
}
