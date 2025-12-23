import { NextAuthOptions, Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/db/prisma';
import bcrypt from 'bcryptjs';
import speakeasy from 'speakeasy';
import { normalizeRole } from '@/lib/rbac';
import { logAuditEvent } from '@/lib/audit';

interface ExtendedSession extends Session {
  user: Session['user'] & {
    id?: string;
    role?: string;
  };
}

interface ExtendedJWT extends JWT {
  id?: string;
  role?: string;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        token2fa: { label: '2FA Token', type: 'text', optional: true },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            role: true,
            password: true,
            twoFactorEnabled: true,
            twoFactorSecret: true,
          },
        });

        if (!user || !user.password) {
          throw new Error('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error('Invalid email or password');
        }

        // Check if 2FA is enabled
        if (user.twoFactorEnabled && user.twoFactorSecret) {
          // If 2FA is enabled but no token provided
          if (!credentials.token2fa) {
            throw new Error('2FA_REQUIRED');
          }

          // Verify 2FA token
          const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: credentials.token2fa,
            window: 2,
          });

          if (!verified) {
            throw new Error('Invalid 2FA code');
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        (token as ExtendedJWT).id = user.id;
        (token as ExtendedJWT).role = normalizeRole((user as any).role);
      }
      // Also handle session updates
      if (trigger === "update" && session) {
        (token as ExtendedJWT).role = normalizeRole((session as any).role);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session as ExtendedSession).user.id = (token as ExtendedJWT).id;
        (session as ExtendedSession).user.role = (token as ExtendedJWT).role;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Always return absolute URLs to avoid client-side `new URL()` errors
      try {
        const b = new URL(baseUrl);
        // Relative path → resolve against base
        if (url.startsWith('/')) {
          return `${b.origin}${url}`;
        }
        const target = new URL(url);
        // Same-origin absolute URL → return as-is
        if (target.origin === b.origin) {
          return target.toString();
        }
      } catch {
        // If anything goes wrong, fall back to base
      }
      // Fallback to base origin
      return baseUrl;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 4, // 4 hours session lifetime
    updateAge: 60 * 15, // refresh JWT every 15 minutes
  },
  jwt: {
    maxAge: 60 * 60 * 4,
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  events: {
    async signIn({ user, account }) {
      await logAuditEvent({
        userId: (user as any).id,
        action: 'AUTH_SIGN_IN',
        targetType: 'SESSION',
        targetId: account?.provider,
        status: 'SUCCESS',
      });
    },
    async signOut({ token }) {
      await logAuditEvent({
        userId: (token as any)?.id,
        action: 'AUTH_SIGN_OUT',
        targetType: 'SESSION',
        status: 'SUCCESS',
      });
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
