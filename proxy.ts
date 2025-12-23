import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { hasPermission, normalizeRole } from '@/lib/rbac'

const securityHeaders: Record<string, string> = {
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'X-XSS-Protection': '1; mode=block',
  'Content-Security-Policy': "default-src 'self'; img-src 'self' data: https:; media-src 'self' https:; font-src 'self' data: https:; connect-src 'self' https:; style-src 'self' 'unsafe-inline' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
}

function applySecurityHeaders(response: NextResponse) {
  Object.entries(securityHeaders).forEach(([key, value]) => response.headers.set(key, value))
}

function getClientIp(request: NextRequest) {
  const xff = request.headers.get('x-forwarded-for')
  if (xff) {
    return xff.split(',')[0]?.trim() || 'unknown'
  }
  return (request as any).ip || 'unknown'
}

// Proxy replaces the deprecated middleware entrypoint.
export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAdminArea = pathname.startsWith('/admin')
  const isAdminApi = pathname.startsWith('/api/admin')
  
  // Completely bypass auth for AI endpoints (testing only)
  const isAIEndpoint = pathname.startsWith('/api/admin/products/ai-')
  if (isAIEndpoint) {
    const res = NextResponse.next()
    applySecurityHeaders(res)
    return res
  }

  // Allow auth routes to pass through untouched
  if (!isAdminArea && !isAdminApi) {
    const res = NextResponse.next()
    applySecurityHeaders(res)
    return res
  }

  // IP Allowlist check - DISABLED for development
  // const allowlist = (process.env.ADMIN_IP_ALLOWLIST || '')
  //   .split(',')
  //   .map((ip) => ip.trim())
  //   .filter(Boolean)
  // const clientIp = getClientIp(request)

  // if (allowlist.length > 0 && !allowlist.includes(clientIp)) {
  //   const res = NextResponse.json({ error: 'Forbidden: IP not allowed' }, { status: 403 })
  //   applySecurityHeaders(res)
  //   return res
  // }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const role = normalizeRole((token as any)?.role)
  const allowed = token && hasPermission(role, 'admin:access')
  
  if (!allowed) {
    if (isAdminApi) {
      const res = NextResponse.json({ error: token ? 'Forbidden' : 'Unauthorized' }, { status: token ? 403 : 401 })
      applySecurityHeaders(res)
      return res
    }

    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    const res = NextResponse.redirect(loginUrl)
    applySecurityHeaders(res)
    return res
  }

  const res = NextResponse.next()
  applySecurityHeaders(res)
  res.headers.set('X-Admin-Role', role)
  return res
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
