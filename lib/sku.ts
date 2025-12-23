import { prisma } from '@/lib/db/prisma'

// Generate a short, human-friendly SKU: PREFIX-XXXX where prefix is derived from name/category
export async function generateSku(name: string, categorySlug?: string): Promise<string> {
  const base = slugify(name || 'SKU')
  const category = categorySlug ? slugify(categorySlug) : ''

  for (let i = 0; i < 5; i++) {
    const token = randomToken(4)
    const sku = [category || base, token].filter(Boolean).join('-').toUpperCase()
    const exists = await prisma.product.findFirst({ where: { sku } })
    if (!exists) return sku
  }

  // Fallback to timestamp token if collisions persist
  return `${base.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`
}

function slugify(value: string) {
  return value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 12) || 'SKU'
}

function randomToken(length: number) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let out = ''
  for (let i = 0; i < length; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return out
}
