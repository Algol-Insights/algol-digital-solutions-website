import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';

// POST /api/stock-alerts - Subscribe to stock alert
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { email, productId, variantId } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!productId && !variantId) {
      return NextResponse.json(
        { error: 'Either productId or variantId is required' },
        { status: 400 }
      );
    }

    // Check if product exists
    if (productId) {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
    }

    // Check if variant exists
    if (variantId) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: variantId },
      });

      if (!variant) {
        return NextResponse.json(
          { error: 'Variant not found' },
          { status: 404 }
        );
      }
    }

    // Check if alert already exists
    const existingAlert = await prisma.stockAlert.findFirst({
      where: {
        email,
        productId: productId || null,
        variantId: variantId || null,
        notified: false, // Only check for alerts that haven't been sent yet
      },
    });

    if (existingAlert) {
      return NextResponse.json(
        { message: 'You are already subscribed to this stock alert', alert: existingAlert },
        { status: 200 }
      );
    }

    // Create stock alert
    const stockAlert = await prisma.stockAlert.create({
      data: {
        email,
        productId: productId || null,
        variantId: variantId || null,
        userId: (session?.user as any)?.id || null,
        notified: false,
      },
      include: {
        product: true,
        variant: true,
      },
    });

    return NextResponse.json(
      { message: 'Stock alert created successfully', alert: stockAlert },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating stock alert:', error);
    return NextResponse.json(
      { error: 'Failed to create stock alert' },
      { status: 500 }
    );
  }
}

// GET /api/stock-alerts - Get user's stock alerts (requires authentication)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const stockAlerts = await prisma.stockAlert.findMany({
      where: {
        email: session.user.email,
        notified: false, // Only show active alerts
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            image: true,
            images: true,
            price: true,
            inStock: true,
            stock: true,
          },
        },
        variant: {
          select: {
            id: true,
            name: true,
            color: true,
            size: true,
            storage: true,
            price: true,
            inStock: true,
            stock: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ alerts: stockAlerts });
  } catch (error) {
    console.error('Error fetching stock alerts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock alerts' },
      { status: 500 }
    );
  }
}
