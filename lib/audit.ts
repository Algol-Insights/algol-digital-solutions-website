import { prisma } from '@/lib/db/prisma'

export type AuditStatus = 'SUCCESS' | 'FAIL'

export interface AuditLogInput {
  userId?: string
  action: string
  targetType?: string
  targetId?: string
  status?: AuditStatus
  ip?: string
  userAgent?: string
  metadata?: Record<string, any>
}

export async function logAuditEvent(entry: AuditLogInput) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: entry.userId,
        action: entry.action,
        targetType: entry.targetType,
        targetId: entry.targetId,
        status: entry.status || 'SUCCESS',
        ip: entry.ip?.slice(0, 128),
        userAgent: entry.userAgent?.slice(0, 256),
        metadata: entry.metadata || {},
      },
    })
  } catch (error) {
    console.error('[AUDIT] Failed to write audit log', error)
  }
}
