import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const userRole = (session.user as any).role;

    // Only admins can setup 2FA
    if (userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Only admins can enable 2FA' }, { status: 403 });
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `Algol Digital Solutions (${session.user.email})`,
      issuer: 'Algol Digital Solutions',
    });

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url || '');

    // Store secret temporarily (not enabled yet)
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: secret.base32,
        twoFactorEnabled: false, // Not enabled until verified
      },
    });

    return NextResponse.json({
      secret: secret.base32,
      qrCode: qrCodeUrl,
    });
  } catch (error) {
    console.error('2FA setup error:', error);
    return NextResponse.json(
      { error: 'Failed to setup 2FA' },
      { status: 500 }
    );
  }
}
