import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SupplierService } from '@/lib/services/supplier.service';

/**
 * POST /api/admin/suppliers/[id]/products
 * Link product to supplier
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { productId, supplierSku, cost, leadTime, preferred } = await request.json();

    if (!productId || !supplierSku || cost === undefined) {
      return NextResponse.json(
        { error: 'productId, supplierSku and cost are required' },
        { status: 400 }
      );
    }

    const productSupplier = await SupplierService.linkProductToSupplier(
      productId,
      id,
      {
        supplierSku,
        cost: Number(cost),
        leadTime: leadTime ? Number(leadTime) : undefined,
        preferred: Boolean(preferred),
      }
    );

    return NextResponse.json(productSupplier, { status: 201 });
  } catch (error) {
    console.error('Error linking product to supplier:', error);
    return NextResponse.json(
      { error: 'Failed to link product' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/suppliers/[id]/products
 * Get products for supplier
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const supplier = await SupplierService.getSupplierById(id);

    if (!supplier) {
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 });
    }

    return NextResponse.json(supplier.productSuppliers);
  } catch (error) {
    console.error('Error fetching supplier products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/suppliers/[id]/products
 * Unlink product from supplier
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: 'productId is required' }, { status: 400 });
    }

    await SupplierService.unlinkProductFromSupplier(productId, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error unlinking product from supplier:', error);
    return NextResponse.json(
      { error: 'Failed to unlink product' },
      { status: 500 }
    );
  }
}
