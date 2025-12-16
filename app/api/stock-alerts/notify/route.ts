import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { sendEmail } from '@/lib/email';

// POST /api/stock-alerts/notify - Notify subscribers when product is restocked (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is admin
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { productId, variantId } = body;

    if (!productId && !variantId) {
      return NextResponse.json(
        { error: 'Either productId or variantId is required' },
        { status: 400 }
      );
    }

    // Find all pending stock alerts for this product/variant
    const alerts = await prisma.stockAlert.findMany({
      where: {
        productId: productId || null,
        variantId: variantId || null,
        notified: false,
      },
      include: {
        product: true,
        variant: {
          include: {
            product: true,
          },
        },
      },
    });

    if (alerts.length === 0) {
      return NextResponse.json(
        { message: 'No pending alerts found' },
        { status: 200 }
      );
    }

    const notificationResults = [];
    const now = new Date();

    // Send email notifications
    for (const alert of alerts) {
      try {
        const product = alert.variant ? alert.variant.product : alert.product;
        const variantInfo = alert.variant
          ? ` (${alert.variant.color || ''} ${alert.variant.size || ''} ${alert.variant.storage || ''})`.trim()
          : '';

        const subject = `Back in Stock: ${product?.name}${variantInfo}`;
        const productUrl = alert.variant
          ? `${process.env.NEXT_PUBLIC_API_URL}/products/${product?.id}?variant=${alert.variant.id}`
          : `${process.env.NEXT_PUBLIC_API_URL}/products/${product?.id}`;

        const html = `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
                .product-info { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
                .button { display: inline-block; background: #14b8a6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
                .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🎉 Good News!</h1>
                  <p>The item you were waiting for is back in stock!</p>
                </div>
                <div class="content">
                  <div class="product-info">
                    <h2>${product?.name}${variantInfo}</h2>
                    <p><strong>Price:</strong> $${(alert.variant?.price || product?.price)?.toFixed(2)}</p>
                    ${alert.variant ? `<p><strong>Variant:</strong> ${alert.variant.name}</p>` : ''}
                    <p>This item is now available and ready to order!</p>
                  </div>
                  <center>
                    <a href="${productUrl}" class="button">View Product</a>
                  </center>
                  <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
                    This is a one-time notification. If you'd like to be notified again when this product goes out of stock and comes back, you can subscribe again on the product page.
                  </p>
                </div>
                <div class="footer">
                  <p>Algol Digital Solutions</p>
                  <p>You received this email because you subscribed to stock alerts.</p>
                </div>
              </div>
            </body>
          </html>
        `;

        await sendEmail({
          to: alert.email,
          subject,
          html,
        });

        // Mark alert as notified
        await prisma.stockAlert.update({
          where: { id: alert.id },
          data: {
            notified: true,
            notifiedAt: now,
          },
        });

        notificationResults.push({
          email: alert.email,
          success: true,
        });
      } catch (error) {
        console.error(`Failed to send email to ${alert.email}:`, error);
        notificationResults.push({
          email: alert.email,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    const successCount = notificationResults.filter((r) => r.success).length;
    const failureCount = notificationResults.filter((r) => !r.success).length;

    return NextResponse.json({
      message: `Notifications sent: ${successCount} successful, ${failureCount} failed`,
      results: notificationResults,
      totalAlerts: alerts.length,
    });
  } catch (error) {
    console.error('Error notifying stock alerts:', error);
    return NextResponse.json(
      { error: 'Failed to send notifications' },
      { status: 500 }
    );
  }
}
