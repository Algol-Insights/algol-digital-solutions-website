/**
 * Product filtering and faceted search system
 */

export interface FilterFacet {
  type: 'category' | 'price' | 'brand' | 'rating' | 'availability'
  label: string
  options: FilterOption[]
}

export interface FilterOption {
  value: string
  label: string
  count: number
}

export interface ProductFilters {
  categories: string[]
  priceRange: [number, number]
  brands: string[]
  minRating: number
  inStock: boolean
  search: string
  sortBy: 'popularity' | 'price-asc' | 'price-desc' | 'newest' | 'rating'
}

export interface ProductWithStats {
  id: string
  name: string
  price: number
  originalPrice?: number
  category: string
  brand: string
  description: string
  image: string
  rating: number
  reviewCount: number
  inStock: boolean
  stock: number
}

/**
 * Get available filter facets for products
 */
export async function getFilterFacets(products: ProductWithStats[]): Promise<FilterFacet[]> {
  const categories = new Map<string, number>()
  const brands = new Map<string, number>()
  const prices: number[] = []

  products.forEach((product) => {
    // Count categories
    categories.set(product.category, (categories.get(product.category) || 0) + 1)

    // Count brands
    brands.set(product.brand, (brands.get(product.brand) || 0) + 1)

    // Collect prices for range
    prices.push(product.price)
  })

  const minPrice = Math.floor(Math.min(...prices, 0))
  const maxPrice = Math.ceil(Math.max(...prices, 1000))

  return [
    {
      type: 'category',
      label: 'Category',
      options: Array.from(categories.entries()).map(([value, count]) => ({
        value,
        label: value,
        count,
      })),
    },
    {
      type: 'price',
      label: 'Price Range',
      options: [
        { value: '0-500', label: '$0 - $500', count: products.filter((p) => p.price <= 500).length },
        { value: '500-1000', label: '$500 - $1,000', count: products.filter((p) => p.price > 500 && p.price <= 1000).length },
        { value: '1000-2000', label: '$1,000 - $2,000', count: products.filter((p) => p.price > 1000 && p.price <= 2000).length },
        { value: '2000+', label: '$2,000+', count: products.filter((p) => p.price > 2000).length },
      ],
    },
    {
      type: 'brand',
      label: 'Brand',
      options: Array.from(brands.entries()).map(([value, count]) => ({
        value,
        label: value,
        count,
      })),
    },
    {
      type: 'rating',
      label: 'Rating',
      options: [
        { value: '4', label: '4★ & up', count: products.filter((p) => p.rating >= 4).length },
        { value: '3', label: '3★ & up', count: products.filter((p) => p.rating >= 3).length },
        { value: '2', label: '2★ & up', count: products.filter((p) => p.rating >= 2).length },
        { value: '1', label: '1★ & up', count: products.filter((p) => p.rating >= 1).length },
      ],
    },
    {
      type: 'availability',
      label: 'Availability',
      options: [
        { value: 'in-stock', label: 'In Stock', count: products.filter((p) => p.inStock).length },
        { value: 'out-of-stock', label: 'Out of Stock', count: products.filter((p) => !p.inStock).length },
      ],
    },
  ]
}

/**
 * Apply filters to products
 */
export function applyProductFilters(
  products: ProductWithStats[],
  filters: Partial<ProductFilters>,
): ProductWithStats[] {
  let filtered = [...products]

  // Category filter
  if (filters.categories && filters.categories.length > 0) {
    filtered = filtered.filter((p) => filters.categories!.includes(p.category))
  }

  // Price range filter
  if (filters.priceRange) {
    filtered = filtered.filter((p) => p.price >= filters.priceRange![0] && p.price <= filters.priceRange![1])
  }

  // Brand filter
  if (filters.brands && filters.brands.length > 0) {
    filtered = filtered.filter((p) => filters.brands!.includes(p.brand))
  }

  // Rating filter
  if (filters.minRating && filters.minRating > 0) {
    filtered = filtered.filter((p) => p.rating >= filters.minRating!)
  }

  // Stock filter
  if (filters.inStock !== undefined) {
    filtered = filtered.filter((p) => p.inStock === filters.inStock)
  }

  // Search filter
  if (filters.search && filters.search.trim()) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.brand.toLowerCase().includes(searchLower),
    )
  }

  // Sorting
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        // Assuming products with lower IDs are newer
        filtered.sort((a, b) => parseInt(b.id) - parseInt(a.id))
        break
      case 'popularity':
      default:
        filtered.sort((a, b) => b.reviewCount - a.reviewCount)
        break
    }
  }

  return filtered
}

/**
 * Generate filter URL params
 */
export function generateFilterParams(filters: Partial<ProductFilters>): URLSearchParams {
  const params = new URLSearchParams()

  if (filters.categories?.length) {
    params.set('categories', filters.categories.join(','))
  }

  if (filters.priceRange) {
    params.set('priceMin', filters.priceRange[0].toString())
    params.set('priceMax', filters.priceRange[1].toString())
  }

  if (filters.brands?.length) {
    params.set('brands', filters.brands.join(','))
  }

  if (filters.minRating) {
    params.set('rating', filters.minRating.toString())
  }

  if (filters.inStock) {
    params.set('inStock', 'true')
  }

  if (filters.search) {
    params.set('search', filters.search)
  }

  if (filters.sortBy) {
    params.set('sort', filters.sortBy)
  }

  return params
}

/**
 * Parse filter params from URL
 */
export function parseFilterParams(params: URLSearchParams): Partial<ProductFilters> {
  const filters: Partial<ProductFilters> = {}

  const categories = params.get('categories')
  if (categories) {
    filters.categories = categories.split(',')
  }

  const priceMin = params.get('priceMin')
  const priceMax = params.get('priceMax')
  if (priceMin && priceMax) {
    filters.priceRange = [parseInt(priceMin), parseInt(priceMax)]
  }

  const brands = params.get('brands')
  if (brands) {
    filters.brands = brands.split(',')
  }

  const rating = params.get('rating')
  if (rating) {
    filters.minRating = parseInt(rating)
  }

  const inStock = params.get('inStock')
  if (inStock === 'true') {
    filters.inStock = true
  }

  const search = params.get('search')
  if (search) {
    filters.search = search
  }

  const sort = params.get('sort')
  if (sort) {
    filters.sortBy = sort as ProductFilters['sortBy']
  }

  return filters
}
