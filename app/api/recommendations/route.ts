import { NextRequest, NextResponse } from 'next/server'
import {
  getRelatedProducts,
  getCustomersAlsoBought,
  getTrendingProducts,
  getPersonalizedRecommendations,
} from '@/lib/recommendations'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'trending'
    const productId = searchParams.get('productId')
    const limit = parseInt(searchParams.get('limit') || '6')

    const session = await getServerSession(authOptions)
    const userId = session?.user ? (session.user as any).id : null

    let recommendations

    switch (type) {
      case 'related':
        if (!productId) {
          return NextResponse.json(
            { error: 'productId required for related products' },
            { status: 400 }
          )
        }
        recommendations = await getRelatedProducts(productId, { limit })
        break

      case 'also-bought':
        if (!productId) {
          return NextResponse.json(
            { error: 'productId required for also-bought products' },
            { status: 400 }
          )
        }
        recommendations = await getCustomersAlsoBought(productId, { limit })
        break

      case 'personalized':
        if (!userId) {
          // Fall back to trending for non-authenticated users
          recommendations = await getTrendingProducts({ limit })
        } else {
          recommendations = await getPersonalizedRecommendations(userId, { limit })
        }
        break

      case 'trending':
      default:
        recommendations = await getTrendingProducts({ limit })
        break
    }

    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error('Recommendations API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    )
  }
}
