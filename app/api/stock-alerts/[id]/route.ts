import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';

// DELETE /api/stock-alerts/[id] - Unsubscribe from stock alert
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id: alertId } = await params;

    // Find the alert
    const alert = await prisma.stockAlert.findUnique({
      where: { id: alertId },
    });

    if (!alert) {
      return NextResponse.json(
        { error: 'Stock alert not found' },
        { status: 404 }
      );
    }

    // Verify ownership (can delete if email matches or user owns it)
    if (session?.user?.email !== alert.email && (session?.user as any)?.id !== alert.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Delete the alert
    await prisma.stockAlert.delete({
      where: { id: alertId },
    });

    return NextResponse.json(
      { message: 'Stock alert deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting stock alert:', error);
    return NextResponse.json(
      { error: 'Failed to delete stock alert' },
      { status: 500 }
    );
  }
}
