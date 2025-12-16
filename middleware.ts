import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for NextAuth routes
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Protect all /admin routes and /api/admin routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    console.log('[AUTH_MIDDLEWARE]', {
      pathname,
      hasToken: !!token,
      tokenRole: (token as any)?.role,
      tokenId: (token as any)?.id,
    });

    // Not authenticated - redirect to login
    if (!token) {
      const url = new URL('/auth/login', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }

    // Authenticated but not admin - deny access
    if ((token as any).role !== 'admin' && (token as any).role !== 'ADMIN') {
      console.log('[AUTH_DENIED] Non-admin user trying to access admin:', (token as any).role);
      // Return 403 Forbidden for API routes
      if (pathname.startsWith('/api/admin')) {
        return NextResponse.json(
          { error: 'Unauthorized - Admin access required' },
          { status: 403 }
        );
      }
      // Redirect to home for page routes
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Admin user - allow access
    console.log('[AUTH_ALLOWED] Admin access granted');
    return NextResponse.next();
  }


  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*'
  ]
};
