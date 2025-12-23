'use client'

import { useEffect, useState } from 'react'
import { Loader2, Mail, Eye, Hand, CheckCircle, AlertCircle } from 'lucide-react'

interface EmailStats {
  sent: number
  opened: number
  clicked: number
  openRate: number
  clickRate: number
}

interface EmailRecord {
  id: string
  email: string
  status: string
  sentAt: string | null
  openedAt: string | null
  clickedAt: string | null
}

interface EmailAnalyticsProps {
  campaignId: string
  emailsSent: number
  emailsOpened: number
  emailsClicked: number
}

export function EmailAnalytics({ campaignId, emailsSent, emailsOpened, emailsClicked }: EmailAnalyticsProps) {
  const [emails, setEmails] = useState<EmailRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [statusFilter, setStatusFilter] = useState<string>('')

  const openRate = emailsSent > 0 ? Math.round((emailsOpened / emailsSent) * 100) : 0
  const clickRate = emailsSent > 0 ? Math.round((emailsClicked / emailsSent) * 100) : 0

  useEffect(() => {
    fetchEmailHistory()
  }, [page, statusFilter])

  const fetchEmailHistory = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      })
      if (statusFilter) params.append('status', statusFilter)

      const response = await fetch(`/api/admin/campaigns/${campaignId}/email-history?${params}`)
      if (response.ok) {
        const data = await response.json()
        setEmails(data.emails)
        setTotal(data.pagination.total)
      }
    } catch (error) {
      console.error('Failed to fetch email history:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const baseClass = 'px-2 py-1 rounded text-xs font-medium'
    switch (status) {
      case 'SENT':
        return `${baseClass} bg-blue-100 text-blue-800`
      case 'OPENED':
        return `${baseClass} bg-green-100 text-green-800`
      case 'CLICKED':
        return `${baseClass} bg-purple-100 text-purple-800`
      case 'BOUNCED':
        return `${baseClass} bg-red-100 text-red-800`
      case 'FAILED':
        return `${baseClass} bg-gray-100 text-gray-800`
      default:
        return `${baseClass} bg-yellow-100 text-yellow-800`
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Emails Sent</p>
              <p className="text-2xl font-bold mt-1">{emailsSent}</p>
            </div>
            <Mail className="h-8 w-8 text-blue-500/50" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Open Rate</p>
              <p className="text-2xl font-bold mt-1">{openRate}%</p>
              <p className="text-xs text-muted-foreground mt-1">{emailsOpened} opened</p>
            </div>
            <Eye className="h-8 w-8 text-green-500/50" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Click Rate</p>
              <p className="text-2xl font-bold mt-1">{clickRate}%</p>
              <p className="text-xs text-muted-foreground mt-1">{emailsClicked} clicked</p>
            </div>
            <Hand className="h-8 w-8 text-purple-500/50" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div>
            <p className="text-xs text-muted-foreground">Engagement</p>
            <p className="text-2xl font-bold mt-1">{emailsSent > 0 ? Math.round(((emailsOpened + emailsClicked) / emailsSent) * 100) : 0}%</p>
            <p className="text-xs text-muted-foreground mt-1">interactions</p>
          </div>
        </div>
      </div>

      {/* Email History */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Email History</h3>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setPage(1)
            }}
            className="text-sm px-3 py-1 border border-border rounded bg-background"
          >
            <option value="">All Status</option>
            <option value="SENT">Sent</option>
            <option value="OPENED">Opened</option>
            <option value="CLICKED">Clicked</option>
            <option value="BOUNCED">Bounced</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : emails.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">No emails sent yet</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium">Email</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Sent</th>
                    <th className="text-left py-3 px-4 font-medium">Opened</th>
                    <th className="text-left py-3 px-4 font-medium">Clicked</th>
                  </tr>
                </thead>
                <tbody>
                  {emails.map((email) => (
                    <tr key={email.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 text-xs font-mono">{email.email}</td>
                      <td className="py-3 px-4">
                        <span className={getStatusBadge(email.status)}>{email.status}</span>
                      </td>
                      <td className="py-3 px-4 text-xs">
                        {email.sentAt ? new Date(email.sentAt).toLocaleString() : '-'}
                      </td>
                      <td className="py-3 px-4 text-xs">
                        {email.openedAt ? (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            {new Date(email.openedAt).toLocaleString()}
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="py-3 px-4 text-xs">
                        {email.clickedAt ? (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-purple-600" />
                            {new Date(email.clickedAt).toLocaleString()}
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Showing {emails.length} of {total} emails
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 text-sm border border-border rounded disabled:opacity-50"
                >
                  ← Previous
                </button>
                <span className="px-3 py-1 text-sm text-muted-foreground">
                  Page {page}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page * 10 >= total}
                  className="px-3 py-1 text-sm border border-border rounded disabled:opacity-50"
                >
                  Next →
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
