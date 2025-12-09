// API service for fetching real data from the backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3007'

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

// Products API
export async function getProducts(params?: {
  category?: string
  search?: string
  page?: number
  limit?: number
}): Promise<{ data: ApiProduct[]; pagination: PaginationMeta }> {
  const searchParams = new URLSearchParams()
  
  if (params?.category) searchParams.append('category', params.category)
  if (params?.search) searchParams.append('search', params.search)
  if (params?.page) searchParams.append('page', params.page.toString())
  if (params?.limit) searchParams.append('limit', params.limit.toString())

  const response = await fetch(`${API_BASE_URL}/api/products?${searchParams}`)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`)
  }
  
  return response.json()
}

export async function getProductById(id: string): Promise<ApiProduct> {
  const response = await fetch(`${API_BASE_URL}/api/products/${id}`)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.statusText}`)
  }
  
  return response.json()
}

// Categories API
export async function getCategories(): Promise<ApiCategory[]> {
  const response = await fetch(`${API_BASE_URL}/api/admin/categories`)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.statusText}`)
  }
  
  return response.json()
}

// Admin: Create Product
export async function createProduct(data: Omit<ApiProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiProduct> {
  const response = await fetch(`${API_BASE_URL}/api/admin/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create product')
  }
  
  return response.json()
}

// Admin: Update Product
export async function updateProduct(id: string, data: Partial<ApiProduct>): Promise<ApiProduct> {
  const response = await fetch(`${API_BASE_URL}/api/admin/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update product')
  }
  
  return response.json()
}

// Admin: Delete Product
export async function deleteProduct(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/admin/products/${id}`, {
    method: 'DELETE',
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete product')
  }
}

// Admin: Create Category
export async function createCategory(data: Omit<ApiCategory, 'id'>): Promise<ApiCategory> {
  const response = await fetch(`${API_BASE_URL}/api/admin/categories`, {
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
  const response = await fetch(`${API_BASE_URL}/api/admin/categories/${id}`, {
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
  const response = await fetch(`${API_BASE_URL}/api/admin/categories/${id}`, {
    method: 'DELETE',
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete category')
  }
}
