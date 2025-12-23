import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// This endpoint is deprecated - search history is now stored in localStorage on the client
// Keeping the endpoint for backward compatibility

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Return empty history - client uses localStorage
    return NextResponse.json({ history: [] })
  } catch (error) {
    console.error('Search history error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch search history' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // Search history is now handled on the client with localStorage
  return NextResponse.json({ success: true })
}

export async function DELETE(request: NextRequest) {
  // Search history is now handled on the client with localStorage
  return NextResponse.json({ success: true })
}

