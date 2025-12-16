'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui-lib'
import {
  ArrowLeft,
  Send,
  Loader2,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Shield,
} from 'lucide-react'
import Link from 'next/link'

interface Message {
  id: string
  message: string
  isStaff: boolean
  createdAt: string
  user: {
    name: string
    email: string
    role: string
    image?: string
  }
}

interface Ticket {
  id: string
  ticketNumber: string
  subject: string
  category: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_CUSTOMER' | 'RESOLVED' | 'CLOSED'
  createdAt: string
  updatedAt: string
  user: {
    name: string
    email: string
  }
  messages: Message[]
}

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isAdmin = (session?.user as any)?.role === 'admin'

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    } else if (session?.user) {
      fetchTicket()
    }
  }, [status, session, router])

  useEffect(() => {
    scrollToBottom()
  }, [ticket?.messages])

  const fetchTicket = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/support/tickets/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setTicket(data.ticket)
      } else if (response.status === 404) {
        alert('Ticket not found')
        router.push('/support')
      } else if (response.status === 403) {
        alert('Access denied')
        router.push('/support')
      }
    } catch (error) {
      console.error('Failed to fetch ticket:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setIsSending(true)
    try {
      const response = await fetch(`/api/support/tickets/${params.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage }),
      })

      if (response.ok) {
        setNewMessage('')
        fetchTicket()
      } else {
        alert('Failed to send message')
      }
    } catch (error) {
      alert('Error sending message')
    } finally {
      setIsSending(false)
    }
  }

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/support/tickets/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchTicket()
      } else {
        alert('Failed to update status')
      }
    } catch (error) {
      alert('Error updating status')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'RESOLVED':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
      case 'CLOSED':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
      case 'HIGH':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'LOW':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Ticket not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Link href="/support">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Support
            </Button>
          </Link>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-2">{ticket.subject}</h1>
                <p className="text-sm text-muted-foreground mb-3">
                  Ticket #{ticket.ticketNumber} • Created{' '}
                  {new Date(ticket.createdAt).toLocaleString()}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      ticket.status
                    )}`}
                  >
                    {ticket.status.replace('_', ' ')}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                      ticket.priority
                    )}`}
                  >
                    {ticket.priority} Priority
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-muted">
                    {ticket.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Admin Controls */}
            {isAdmin && (
              <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateStatus('IN_PROGRESS')}
                  disabled={ticket.status === 'IN_PROGRESS'}
                >
                  Mark In Progress
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateStatus('RESOLVED')}
                  disabled={ticket.status === 'RESOLVED'}
                >
                  Mark Resolved
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateStatus('CLOSED')}
                  disabled={ticket.status === 'CLOSED'}
                >
                  Close Ticket
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Conversation</h2>
          
          <div className="space-y-4 max-h-[600px] overflow-y-auto mb-4">
            {ticket.messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.isStaff ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    message.isStaff
                      ? 'bg-blue-100 dark:bg-blue-900/20'
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                >
                  {message.isStaff ? (
                    <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  )}
                </div>

                <div className={`flex-1 ${message.isStaff ? 'text-right' : ''}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {message.isStaff ? (
                      <>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.createdAt).toLocaleString()}
                        </span>
                        <span className="text-sm font-medium">
                          {message.user.name} (Support Team)
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-sm font-medium">{message.user.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.createdAt).toLocaleString()}
                        </span>
                      </>
                    )}
                  </div>
                  <div
                    className={`inline-block p-3 rounded-lg ${
                      message.isStaff
                        ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          {ticket.status !== 'CLOSED' && (
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-background min-h-[80px] resize-none"
                disabled={isSending}
              />
              <Button type="submit" disabled={isSending || !newMessage.trim()}>
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          )}

          {ticket.status === 'CLOSED' && (
            <div className="bg-muted rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">
                This ticket is closed. Contact support to reopen it.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
