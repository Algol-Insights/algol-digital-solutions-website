import { NextRequest } from 'next/server'
import { requireAdmin, handleAdminError } from '@/lib/admin-auth'
import { subscribe } from '@/lib/notifications'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request, 'admin:access')

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        const send = (data: any) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
        }

        const unsubscribe = subscribe((notification) => send(notification))
        const keepAlive = setInterval(() => send({ type: 'keepalive', ts: Date.now() }), 25000)

        controller.enqueue(encoder.encode('retry: 5000\n\n'))

        return () => {
          clearInterval(keepAlive)
          unsubscribe()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    if ((error as any)?.status) return handleAdminError(error)
    return new Response('Unauthorized', { status: 401 })
  }
}
