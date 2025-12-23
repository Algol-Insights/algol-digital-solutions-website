import crypto from 'crypto'
import { prisma } from '@/lib/db/prisma'

export type WebhookEvent = {
  id: string
  type: string
  createdAt: string
  data: Record<string, any>
}

export function signPayload(secret: string, payload: string) {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex')
}

export async function deliverWebhook(endpointId: string, event: WebhookEvent) {
  const endpoint = await prisma.webhookEndpoint.findUnique({ where: { id: endpointId } })
  if (!endpoint || !endpoint.isActive) return { status: 'skipped' as const }

  const body = JSON.stringify(event)
  const signature = signPayload(endpoint.secret, body)

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Webhook-Id': event.id,
    'X-Webhook-Type': event.type,
    'X-Webhook-Signature': signature,
  }

  if (endpoint.headers) {
    Object.entries(endpoint.headers as Record<string, string>).forEach(([key, value]) => {
      headers[key] = value
    })
  }

  const res = await fetch(endpoint.url, {
    method: 'POST',
    headers,
    body,
  })

  await prisma.webhookEndpoint.update({
    where: { id: endpointId },
    data: {
      lastDeliveryAt: new Date(),
      lastStatus: `${res.status}`,
    },
  })

  return { status: res.status, ok: res.ok }
}

export async function deliverEvent(type: string, data: Record<string, any>) {
  const event: WebhookEvent = {
    id: crypto.randomUUID(),
    type,
    createdAt: new Date().toISOString(),
    data,
  }

  const endpoints = await prisma.webhookEndpoint.findMany({ where: { isActive: true, events: { has: type } } })

  const results = await Promise.allSettled(endpoints.map((endpoint) => deliverWebhook(endpoint.id, event)))

  return { eventId: event.id, delivered: results.length }
}
