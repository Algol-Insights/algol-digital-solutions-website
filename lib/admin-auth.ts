import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { hasPermission, normalizeRole, Permission } from '@/lib/rbac'

export interface AdminContext {
  userId?: string
  role: string
  ip: string
  userAgent: string
}

class AdminAccessError extends Error {
  status: number
  body: any

  constructor(status: number, body: any) {
    super(body?.error || 'Forbidden')
    this.status = status
    this.body = body
  }
}

function extractIp(request: Request | NextRequest) {
  const xff = request.headers.get('x-forwarded-for')
  if (xff) {
    return xff.split(',')[0]?.trim() || 'unknown'
  }
  // @ts-ignore - NextRequest has ip in some environments
  return (request as any).ip || 'unknown'
}

export async function requireAdmin(request: Request | NextRequest, permission: Permission = 'admin:access'): Promise<AdminContext> {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    throw new AdminAccessError(401, { error: 'Unauthorized' })
  }

  const role = normalizeRole((session.user as any).role)
  if (!hasPermission(role, permission)) {
    throw new AdminAccessError(403, { error: 'Forbidden' })
  }

  return {
    userId: (session.user as any).id,
    role,
    ip: extractIp(request),
    userAgent: request.headers.get('user-agent') || 'unknown',
  }
}

export function handleAdminError(error: unknown) {
  if (error instanceof AdminAccessError) {
    return NextResponse.json(error.body, { status: error.status })
  }
  throw error
}
