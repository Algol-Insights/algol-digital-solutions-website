import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'
import { updateInventory, bulkUpdateInventory } from '@/lib/inventory'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { updates, type, reason, bulk } = body

    if (bulk && Array.isArray(updates)) {
      // Bulk update
      const results = await bulkUpdateInventory(updates, type, reason, user.id)
      return NextResponse.json({ results })
    } else {
      // Single update
      const { productId, variantId, quantity } = body
      
      const result = await updateInventory({
        productId,
        variantId,
        quantity,
        type,
        reason,
        userId: user.id,
      })

      return NextResponse.json(result)
    }
  } catch (error) {
    console.error('Inventory update error:', error)
    return NextResponse.json(
      { error: 'Failed to update inventory' },
      { status: 500 }
    )
  }
}
