'use client'

import { useState } from 'react'
import { Button } from '@/components/ui-lib/button'
import { Mail, Send, TestTube, Users, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface SendCampaignEmailProps {
  campaignId: string
  campaignName: string
  onClose?: () => void
}

export function SendCampaignEmail({ campaignId, campaignName, onClose }: SendCampaignEmailProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [testEmail, setTestEmail] = useState('')
  const [selectedRecipients, setSelectedRecipients] = useState<'all' | 'segment'>('all')

  const handleClose = () => {
    setIsOpen(false)
    onClose?.()
  }

  const handleSendTest = async () => {
    if (!testEmail) {
      toast.error('Please enter a test email address')
      return
    }

    setIsSending(true)
    try {
      const response = await fetch(`/api/admin/campaigns/${campaignId}/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testMode: true,
          testEmail,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success(`Test email sent to ${testEmail}`)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to send test email')
      }
    } catch (error) {
      console.error('Failed to send test email:', error)
      toast.error('Failed to send test email')
    } finally {
      setIsSending(false)
    }
  }

  const handleSendCampaign = async () => {
    if (!confirm(`Send campaign emails to ${selectedRecipients === 'all' ? 'all customers' : 'targeted segment'}?`)) {
      return
    }

    setIsSending(true)
    try {
      const response = await fetch(`/api/admin/campaigns/${campaignId}/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients: selectedRecipients,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success(`Campaign sent to ${data.sent} recipients`)
        handleClose()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to send campaign')
      }
    } catch (error) {
      console.error('Failed to send campaign:', error)
      toast.error('Failed to send campaign')
    } finally {
      setIsSending(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg p-6 max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Send Email Campaign</h2>
              <button
                onClick={handleClose}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              Campaign: <span className="font-semibold">{campaignName}</span>
            </p>

            {/* Test Email Section */}
            <div className="mb-6 p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <TestTube className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">Test Email</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Send a test email to verify the campaign looks correct
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="flex-1 px-3 py-2 rounded border border-border bg-background"
                />
                <Button
                  onClick={handleSendTest}
                  disabled={isSending}
                  variant="outline"
                >
                  {isSending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Test
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Recipients Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">Select Recipients</label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted">
                  <input
                    type="radio"
                    name="recipients"
                    value="all"
                    checked={selectedRecipients === 'all'}
                    onChange={(e) => setSelectedRecipients(e.target.value as 'all')}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span className="font-medium">All Customers</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Send to all customers in your database
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted">
                  <input
                    type="radio"
                    name="recipients"
                    value="segment"
                    checked={selectedRecipients === 'segment'}
                    onChange={(e) => setSelectedRecipients(e.target.value as 'segment')}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span className="font-medium">Targeted Segment</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Send to customers matching campaign targeting rules
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Warning */}
            <div className="mb-6 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                ⚠️ This will send real emails. Make sure you've tested the campaign first.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleClose}
                variant="outline"
                className="flex-1"
                disabled={isSending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendCampaign}
                disabled={isSending}
                className="flex-1"
              >
                {isSending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Send Campaign
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
