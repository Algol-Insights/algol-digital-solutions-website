// API service for fetching real data from the backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3007'
import { DEFAULT_LOW_STOCK_THRESHOLD } from '@/lib/inventory-config'

function assert(condition: any, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

function ensureProductsResponse(json: any): asserts json is { data: ApiProduct[]; pagination: PaginationMeta } {
  assert(json && typeof json === 'object', 'Invalid products response: not an object')
  assert(Array.isArray(json.data), 'Invalid products response: data is not an array')
  const p = json.pagination
  assert(p && typeof p === 'object', 'Invalid products response: missing pagination')
  ;['page','limit','total','pages'].forEach((k) => {
    assert(typeof p[k] === 'number' && Number.isFinite(p[k]), `Invalid products response: pagination.${k}`)
  })
}

export interface ApiProduct {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  originalPrice?: number
  sku: string
  stock: number
  image?: string
  specs?: Record<string, any>
  featured?: boolean
  active?: boolean
  inStock?: boolean
  categoryId: string
  category?: {
    id: string
    name: string
    slug: string
  }
  createdAt?: string
  updatedAt?: string
}

export interface ApiCategory {
  id: string
  name: string
  slug: string
  description?: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  pages: number
}

export type InventoryUpdateType = 'ADJUSTMENT' | 'SALE' | 'RETURN' | 'RESTOCK' | 'DAMAGE' | 'CORRECTION'

export interface InventoryLogEntry {
  id: string
  productId: string
  previousStock: number
  newStock: number
  change: number
  reason: string
  createdAt: string
}

export interface InventoryUpdateResult {
  success: boolean
  newStock: number
}

export interface InventoryHistoryResponse {
  history: InventoryLogEntry[]
}

export interface InventorySummary {
  totalProducts: number
  lowStockCount: number
  outOfStockCount: number
  totalStock: number
  inventoryValue: number
}

export interface SalesAnalyticsResponse {
  revenue: { total: number; change: number; trend: 'up' | 'down' }
  gmv?: { total: number; change: number; trend: 'up' | 'down' }
  orders: { total: number; change: number; trend: 'up' | 'down' }
  units?: { total: number; change: number; trend: 'up' | 'down' }
  customers: { total: number; change: number; trend: 'up' | 'down' }
  avgOrderValue: { total: number; change: number; trend: 'up' | 'down' }
  topProducts: Array<{ id: string; name: string; sales: number; revenue: number; image?: string }>
  recentOrders: Array<{ id: string; orderNumber: string; customerName: string; total: number; status: string; createdAt: string }>
  salesByDay: Array<{ date: string; revenue: number; orders: number }>
  salesByCategory: Array<{ category: string; revenue: number; percentage: number }>
}

// Products API
export async function getProducts(params?: {
  category?: string
  search?: string
  page?: number
  limit?: number
  includeInactive?: boolean
}): Promise<{ data: ApiProduct[]; pagination: PaginationMeta }> {
  const searchParams = new URLSearchParams()
  
  if (params?.category) searchParams.append('category', params.category)
  if (params?.search) searchParams.append('search', params.search)
  if (params?.page) searchParams.append('page', params.page.toString())
  if (params?.limit) searchParams.append('limit', params.limit.toString())
  if (params?.includeInactive) searchParams.append('includeInactive', 'true')

  const url = `/api/products?${searchParams}`
  const response = await fetch(url, { cache: 'no-store' })
  
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`)
  }
  
  const json = await response.json()
  ensureProductsResponse(json)
  return json
}

export async function getProductById(id: string): Promise<ApiProduct> {
  const response = await fetch(`/api/products/${id}`, { cache: 'no-store' })
  
  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.statusText}`)
  }
  
  const json = await response.json()
  assert(json && typeof json === 'object', 'Invalid product response')
  assert(typeof json.id === 'string', 'Invalid product: id')
  assert(typeof json.name === 'string', 'Invalid product: name')
  assert(typeof json.price === 'number', 'Invalid product: price')
  return json as ApiProduct
}

// Categories API
export async function getCategories(): Promise<ApiCategory[]> {
  const response = await fetch(`/api/admin/categories`, { cache: 'no-store' })
  
  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.statusText}`)
  }
  
  const json = await response.json()
  assert(Array.isArray(json), 'Invalid categories response: not an array')
  return json as ApiCategory[]
}

// Admin: Create Product
export async function createProduct(data: Omit<ApiProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiProduct> {
  const response = await fetch(`/api/admin/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create product')
  }
  
  const json = await response.json()
  assert(json && typeof json === 'object', 'Invalid create product response')
  assert(typeof json.id === 'string', 'Invalid product: id')
  return json as ApiProduct
}

// Admin: Update Product
export async function updateProduct(id: string, data: Partial<ApiProduct>): Promise<ApiProduct> {
  const response = await fetch(`/api/admin/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update product')
  }
  
  const json = await response.json()
  assert(json && typeof json === 'object', 'Invalid update product response')
  assert(typeof json.id === 'string', 'Invalid product: id')
  return json as ApiProduct
}

// Admin: Delete Product
export async function deleteProduct(id: string): Promise<void> {
  const response = await fetch(`/api/admin/products/${id}`, {
    method: 'DELETE',
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete product')
  }
}

// Admin: Create Category
export async function createCategory(data: Omit<ApiCategory, 'id'>): Promise<ApiCategory> {
  const response = await fetch(`/api/admin/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create category')
  }
  
  return response.json()
}

// Admin: Update Category
export async function updateCategory(id: string, data: Partial<ApiCategory>): Promise<ApiCategory> {
  const response = await fetch(`/api/admin/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update category')
  }
  
  return response.json()
}

// Admin: Delete Category
export async function deleteCategory(id: string): Promise<void> {
  const response = await fetch(`/api/admin/categories/${id}`, {
    method: 'DELETE',
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete category')
  }
}

// Admin: Inventory update
export async function updateInventoryStock(input: {
  productId: string
  variantId?: string
  quantity: number
  type: InventoryUpdateType
  reason?: string
}): Promise<InventoryUpdateResult> {
  const response = await fetch('/api/admin/inventory/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update inventory')
  }

  const json = await response.json()
  assert(json && typeof json === 'object', 'Invalid inventory update response')
  assert(typeof (json as any).newStock === 'number', 'Invalid inventory update payload')
  return json as InventoryUpdateResult
}

// Admin: Bulk inventory update
export async function bulkUpdateInventoryStock(input: {
  updates: Array<{ productId: string; variantId?: string; quantity: number }>
  type: InventoryUpdateType
  reason?: string
}): Promise<{ results: Array<any> }> {
  const response = await fetch('/api/admin/inventory/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...input, bulk: true }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to bulk update inventory')
  }

  return response.json()
}

// Admin: Inventory history
export async function getInventoryHistory(productId: string, limit = 50): Promise<InventoryLogEntry[]> {
  const response = await fetch(`/api/admin/inventory/history/${productId}?limit=${limit}`, { cache: 'no-store' })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch inventory history')
  }

  const json = await response.json()
  assert(json && typeof json === 'object', 'Invalid inventory history response')
  assert(Array.isArray((json as InventoryHistoryResponse).history), 'History is not an array')
  return (json as InventoryHistoryResponse).history
}

// Admin: Low stock list
export async function getLowStockInventory(threshold = DEFAULT_LOW_STOCK_THRESHOLD): Promise<{ products: ApiProduct[]; variants: any[] }> {
  const response = await fetch(`/api/admin/inventory?type=low-stock&threshold=${encodeURIComponent(String(threshold))}`, { cache: 'no-store' })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch low stock inventory')
  }

  const json = await response.json()
  assert(json && typeof json === 'object', 'Invalid low stock response')
  return json as { products: ApiProduct[]; variants: any[] }
}

// Admin: Out of stock list
export async function getOutOfStockInventory(): Promise<{ products: ApiProduct[]; variants: any[] }> {
  const response = await fetch('/api/admin/inventory?type=out-of-stock', { cache: 'no-store' })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch out of stock inventory')
  }

  const json = await response.json()
  assert(json && typeof json === 'object', 'Invalid out of stock response')
  return json as { products: ApiProduct[]; variants: any[] }
}

// Admin: Inventory summary
export async function getInventorySummary(threshold?: number): Promise<InventorySummary> {
  const search = threshold !== undefined ? `?threshold=${encodeURIComponent(String(threshold))}` : ''
  const response = await fetch(`/api/admin/inventory${search}`, { cache: 'no-store' })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch inventory summary')
  }

  const json = await response.json()
  assert(json && typeof json === 'object', 'Invalid inventory summary response')
  return json as InventorySummary
}

// Admin: Sales/GMV/units analytics
export async function getSalesAnalytics(range: string = '30d'): Promise<SalesAnalyticsResponse> {
  const response = await fetch(`/api/admin/analytics?range=${encodeURIComponent(range)}`, { cache: 'no-store' })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch analytics')
  }

  const json = await response.json()
  assert(json && typeof json === 'object', 'Invalid analytics response')
  return json as SalesAnalyticsResponse
}
