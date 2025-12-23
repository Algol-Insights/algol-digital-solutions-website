import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'
import { encryptString, decryptString } from '@/lib/encryption'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        addresses: {
          orderBy: { isDefault: 'desc' },
        },
      },
    })

    const decrypted = (user?.addresses || []).map((a) => ({
      ...a,
      fullName: decryptString(a.fullName),
      addressLine1: decryptString(a.addressLine1),
      addressLine2: decryptString(a.addressLine2),
      city: decryptString(a.city),
      state: decryptString(a.state),
      postalCode: decryptString(a.postalCode),
      country: decryptString(a.country),
      phone: decryptString(a.phone),
    }))

    return NextResponse.json({ addresses: decrypted })
  } catch (error) {
    console.error('Fetch addresses error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch addresses' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const data = await request.json()

    // If this address is being set as default, unset other defaults
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      })
    }

    const address = await prisma.address.create({
      data: {
        userId: user.id,
        label: data.label,
        fullName: encryptString(data.fullName) || '',
        addressLine1: encryptString(data.addressLine1) || '',
        addressLine2: encryptString(data.addressLine2) || null,
        city: encryptString(data.city) || '',
        state: encryptString(data.state) || '',
        postalCode: encryptString(data.postalCode) || '',
        country: encryptString(data.country || 'US') || '',
        phone: encryptString(data.phone) || '',
        isDefault: data.isDefault || false,
      },
    })

    const decrypted = {
      ...address,
      fullName: decryptString(address.fullName),
      addressLine1: decryptString(address.addressLine1),
      addressLine2: decryptString(address.addressLine2),
      city: decryptString(address.city),
      state: decryptString(address.state),
      postalCode: decryptString(address.postalCode),
      country: decryptString(address.country),
      phone: decryptString(address.phone),
    }

    return NextResponse.json({ address: decrypted })
  } catch (error) {
    console.error('Create address error:', error)
    return NextResponse.json(
      { error: 'Failed to create address' },
      { status: 500 }
    )
  }
}
