import { EventEmitter } from 'events'
import { randomUUID } from 'crypto'

export type AdminNotification = {
  id: string
  type: string
  message: string
  severity?: 'info' | 'success' | 'warning' | 'error'
  createdAt: number
  read?: boolean
  data?: Record<string, any>
}

const emitter = new EventEmitter()
const notifications: AdminNotification[] = []
const MAX_NOTIFICATIONS = 200

export function addNotification(input: Omit<AdminNotification, 'id' | 'createdAt'>) {
  const notification: AdminNotification = {
    id: randomUUID(),
    createdAt: Date.now(),
    severity: 'info',
    ...input,
  }
  notifications.unshift(notification)
  if (notifications.length > MAX_NOTIFICATIONS) {
    notifications.pop()
  }
  emitter.emit('notification', notification)
  return notification
}

export function listNotifications(limit = 50) {
  return notifications.slice(0, limit)
}

export function markRead(id: string) {
  const found = notifications.find((n) => n.id === id)
  if (found) {
    found.read = true
  }
}

export function subscribe(handler: (n: AdminNotification) => void) {
  emitter.on('notification', handler)
  return () => emitter.off('notification', handler)
}
