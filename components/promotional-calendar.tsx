'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui-lib/button'
import { ChevronLeft, ChevronRight, Plus, Trash2, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface CalendarEvent {
  id: string
  date: string
  eventType: string
  eventName: string
  description?: string
  color: string
}

interface PromotionalCalendarProps {
  campaignId: string
}

const COLOR_OPTIONS = [
  { value: 'blue', label: 'Blue', bgClass: 'bg-blue-100' },
  { value: 'red', label: 'Red', bgClass: 'bg-red-100' },
  { value: 'green', label: 'Green', bgClass: 'bg-green-100' },
  { value: 'yellow', label: 'Yellow', bgClass: 'bg-yellow-100' },
  { value: 'purple', label: 'Purple', bgClass: 'bg-purple-100' },
  { value: 'pink', label: 'Pink', bgClass: 'bg-pink-100' },
]

export function PromotionalCalendar({ campaignId }: PromotionalCalendarProps) {
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [formData, setFormData] = useState({
    eventName: '',
    eventType: 'custom',
    description: '',
    color: 'blue',
    reminderDays: 0,
  })

  useEffect(() => {
    fetchEvents()
  }, [month, year])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/admin/campaigns/${campaignId}/calendar?month=${month}&year=${year}`
      )
      if (response.ok) {
        const data = await response.json()
        setEvents(data.events)
      }
    } catch (error) {
      console.error('Failed to fetch calendar events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddEvent = async () => {
    if (!formData.eventName || !selectedDate) {
      toast.error('Please fill in required fields')
      return
    }

    try {
      const response = await fetch(`/api/admin/campaigns/${campaignId}/calendar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          ...formData,
        }),
      })

      if (response.ok) {
        toast.success('Event added')
        setShowForm(false)
        setFormData({ eventName: '', eventType: 'custom', description: '', color: 'blue', reminderDays: 0 })
        fetchEvents()
      } else {
        toast.error('Failed to add event')
      }
    } catch (error) {
      console.error('Failed to add event:', error)
      toast.error('Failed to add event')
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Delete this event?')) return

    try {
      const response = await fetch(
        `/api/admin/campaigns/${campaignId}/calendar/${eventId}`,
        { method: 'DELETE' }
      )

      if (response.ok) {
        toast.success('Event deleted')
        fetchEvents()
      } else {
        toast.error('Failed to delete event')
      }
    } catch (error) {
      console.error('Failed to delete event:', error)
      toast.error('Failed to delete event')
    }
  }

  const getDaysInMonth = (m: number, y: number) => new Date(y, m, 0).getDate()
  const getFirstDayOfMonth = (m: number, y: number) => new Date(y, m - 1, 1).getDay()

  const days = []
  const firstDay = getFirstDayOfMonth(month, year)
  const daysInMonth = getDaysInMonth(month, year)

  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return events.filter((e) => e.date.split('T')[0] === dateStr)
  }

  const getColorBg = (color: string) => {
    const option = COLOR_OPTIONS.find((c) => c.value === color)
    return option?.bgClass || 'bg-blue-100'
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg">Promotional Calendar</h3>
        <Button onClick={() => setShowForm(!showForm)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
        <button
          onClick={() => {
            if (month === 1) {
              setMonth(12)
              setYear(year - 1)
            } else {
              setMonth(month - 1)
            }
          }}
          className="p-1 hover:bg-muted rounded"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h4 className="font-semibold">
          {new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h4>
        <button
          onClick={() => {
            if (month === 12) {
              setMonth(1)
              setYear(year + 1)
            } else {
              setMonth(month + 1)
            }
          }}
          className="p-1 hover:bg-muted rounded"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Event Form */}
      {showForm && (
        <div className="mb-6 p-4 bg-muted rounded-lg space-y-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded bg-background"
          />
          <input
            type="text"
            placeholder="Event name"
            value={formData.eventName}
            onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
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
              value={formData.eventType}
              onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
              className="px-3 py-2 border border-border rounded bg-background text-sm"
            >
              <option value="custom">Custom</option>
              <option value="campaign_start">Campaign Start</option>
              <option value="campaign_end">Campaign End</option>
              <option value="milestone">Milestone</option>
              <option value="holiday">Holiday</option>
            </select>
            <select
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="px-3 py-2 border border-border rounded bg-background text-sm"
            >
              {COLOR_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowForm(false)}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button onClick={handleAddEvent} className="flex-1">
              Add Event
            </Button>
          </div>
        </div>
      )}

      {/* Calendar Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Day Labels */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayLabels.map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, idx) => (
              <div
                key={idx}
                className={`aspect-square border border-border rounded-lg p-1 text-xs ${
                  day ? 'bg-card' : 'bg-muted'
                } hover:border-primary/50 cursor-pointer`}
              >
                {day && (
                  <div className="h-full flex flex-col">
                    <span className="font-semibold">{day}</span>
                    <div className="flex-1 overflow-y-auto">
                      {getEventsForDay(day).map((event) => (
                        <div
                          key={event.id}
                          className={`${getColorBg(event.color)} text-xs p-0.5 rounded mb-0.5 truncate relative group`}
                        >
                          {event.eventName}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteEvent(event.id)
                            }}
                            className="absolute right-0 top-0 hidden group-hover:block"
                          >
                            <Trash2 className="h-2 w-2" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
