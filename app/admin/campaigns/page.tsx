'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui-lib/button'
import {
  Plus,
  Edit2,
  Trash2,
  BarChart3,
  Play,
  Pause,
  Archive,
  Loader2,
  Calendar,
  DollarSign,
  Target,
  TrendingUp,
  Users,
  Mail,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { SendCampaignEmail } from '@/components/send-campaign-email'

interface Campaign {
  id: string
  name: string
  description: string | null
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ARCHIVED'
  targetingType: string
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
    coupon: {
      code: string
      type: string
    }
  }[]
}

export default function CampaignsPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'list' | 'analytics'>('list')
  const [sendEmailCampaign, setSendEmailCampaign] = useState<{id: string, name: string} | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    } else if (status === 'authenticated') {
      if ((session?.user as any)?.role !== 'ADMIN') {
        router.push('/')
      } else {
        fetchCampaigns()
      }
    }
  }, [status, session, router])

  const fetchCampaigns = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/campaigns')
      if (response.ok) {
        const data = await response.json()
        setCampaigns(data.campaigns)
      }
    } catch (error) {
      console.error('Failed to fetch campaigns:', error)
      toast.error('Failed to load campaigns')
    } finally {
      setIsLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/campaigns/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        const updated = await response.json()
        setCampaigns(campaigns.map((c) => (c.id === updated.id ? updated : c)))
        toast.success('Campaign updated')
      } else {
        toast.error('Failed to update campaign')
      }
    } catch (error) {
      console.error('Failed to update campaign:', error)
      toast.error('Failed to update campaign')
    }
  }

  const deleteCampaign = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return

    try {
      const response = await fetch(`/api/admin/campaigns/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setCampaigns(campaigns.filter((c) => c.id !== id))
        toast.success('Campaign deleted')
      } else {
        toast.error('Failed to delete campaign')
      }
    } catch (error) {
      console.error('Failed to delete campaign:', error)
      toast.error('Failed to delete campaign')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800'
      case 'PAUSED':
        return 'bg-yellow-100 text-yellow-800'
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800'
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800'
      case 'ARCHIVED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Campaign Builder</h1>
            <p className="text-muted-foreground">
              Create and manage marketing campaigns with targeting
            </p>
          </div>
          <Link href="/admin/campaigns/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Campaign
            </Button>
          </Link>
        </div>

        {/* Campaigns Grid */}
        {campaigns.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-lg">
            <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Campaigns Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first marketing campaign
            </p>
            <Link href="/admin/campaigns/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Campaign
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="bg-card border border-border rounded-lg p-6"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <Link href={`/admin/campaigns/${campaign.id}`} className="flex-1 hover:opacity-80 transition-opacity">
                    <h3 className="font-bold text-lg cursor-pointer">{campaign.name}</h3>
                    <span
                      className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${getStatusColor(campaign.status)}`}
                    >
                      {campaign.status}
                    </span>
                  </Link>
                </div>

                {/* Description */}
                {campaign.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {campaign.description}
                  </p>
                )}

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {new Date(campaign.startDate).toLocaleDateString()} -{' '}
                      {new Date(campaign.endDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Target className="h-3 w-3" />
                    <span>{campaign.targetingType.replace('_', ' ')}</span>
                  </div>

                  {campaign.budget && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <DollarSign className="h-3 w-3" />
                      <span>Budget: ${campaign.budget.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-muted rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Clicks</p>
                    <p className="text-sm font-bold">{campaign.clicks}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Conv.</p>
                    <p className="text-sm font-bold">{campaign.conversions}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                    <p className="text-sm font-bold">${campaign.revenue}</p>
                  </div>
                </div>

                {/* Email Stats */}
                {campaign.emailsSent > 0 && (
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <p className="text-xs text-blue-600 dark:text-blue-400 mb-2 font-medium">Email Performance</p>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="text-muted-foreground">Sent</p>
                        <p className="font-bold text-blue-600 dark:text-blue-400">{campaign.emailsSent}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Opens</p>
                        <p className="font-bold text-blue-600 dark:text-blue-400">
                          {campaign.emailsOpened} ({campaign.emailsSent > 0 ? Math.round((campaign.emailsOpened / campaign.emailsSent) * 100) : 0}%)
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Clicks</p>
                        <p className="font-bold text-blue-600 dark:text-blue-400">
                          {campaign.emailsClicked} ({campaign.emailsSent > 0 ? Math.round((campaign.emailsClicked / campaign.emailsSent) * 100) : 0}%)
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Coupons */}
                {campaign.coupons.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground mb-1">Coupons:</p>
                    <div className="flex flex-wrap gap-1">
                      {campaign.coupons.map((cc) => (
                        <span
                          key={cc.coupon.code}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded font-mono"
                        >
                          {cc.coupon.code}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-2 pt-4 border-t border-border">
                  <div className="flex gap-2">
                    {campaign.status === 'DRAFT' && (
                      <Button
                        size="sm"
                        onClick={() => updateStatus(campaign.id, 'ACTIVE')}
                        className="flex-1"
                      >
                        <Play className="mr-1 h-3 w-3" />
                        Activate
                      </Button>
                    )}
                    {campaign.status === 'ACTIVE' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(campaign.id, 'PAUSED')}
                        className="flex-1"
                      >
                        <Pause className="mr-1 h-3 w-3" />
                        Pause
                      </Button>
                    )}
                    {campaign.status === 'PAUSED' && (
                      <Button
                        size="sm"
                        onClick={() => updateStatus(campaign.id, 'ACTIVE')}
                        className="flex-1"
                      >
                        <Play className="mr-1 h-3 w-3" />
                        Resume
                      </Button>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/admin/campaigns/${campaign.id}`} className="flex-1">
                      <Button size="sm" variant="outline" className="w-full">
                        <Edit2 className="mr-2 h-3 w-3" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSendEmailCampaign({id: campaign.id, name: campaign.name})}
                      className="flex-1"
                    >
                      <Mail className="mr-2 h-3 w-3" />
                      Send Email
                    </Button>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => deleteCampaign(campaign.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Send Email Modal */}
      {sendEmailCampaign && (
        <SendCampaignEmail
          campaignId={sendEmailCampaign.id}
          campaignName={sendEmailCampaign.name}
          onClose={() => {
            setSendEmailCampaign(null)
            fetchCampaigns() // Refresh to show updated email stats
          }}
        />
      )}
    </div>
  )
}
