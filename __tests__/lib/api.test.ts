import { getInventorySummary, getProducts, getSalesAnalytics } from '@/lib/api'

describe('lib/api helpers', () => {
  beforeEach(() => {
    ;(fetch as jest.Mock).mockReset()
  })

  it('fetches inventory summary with threshold', async () => {
    const payload = { totalProducts: 3, lowStockCount: 2, outOfStockCount: 1, totalStock: 12, inventoryValue: 1000 }
    ;(fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => payload })

    const result = await getInventorySummary(7)

    expect(fetch).toHaveBeenCalledWith('/api/admin/inventory?threshold=7', { cache: 'no-store' })
    expect(result.lowStockCount).toBe(2)
  })

  it('passes includeInactive flag when fetching products', async () => {
    const payload = { data: [{ id: '1', name: 'Test', slug: 'test', price: 10, sku: 'SKU', stock: 5, categoryId: 'cat' }], pagination: { page: 1, limit: 10, total: 1, pages: 1 } }
    ;(fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => payload })

    await getProducts({ includeInactive: true })

    expect((fetch as jest.Mock).mock.calls[0][0]).toContain('includeInactive=true')
  })

  it('fetches analytics for the requested range', async () => {
    const payload = {
      revenue: { total: 1000, change: 10, trend: 'up' as const },
      orders: { total: 20, change: 5, trend: 'up' as const },
      customers: { total: 15, change: 3, trend: 'up' as const },
      avgOrderValue: { total: 50, change: 2, trend: 'up' as const },
      topProducts: [],
      recentOrders: [],
      salesByDay: [],
      salesByCategory: [],
      gmv: { total: 1100, change: 8, trend: 'up' as const },
      units: { total: 25, change: 4, trend: 'up' as const },
    }
    ;(fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => payload })

    const range = '7d'
    await getSalesAnalytics(range)

    expect(fetch).toHaveBeenCalledWith(`/api/admin/analytics?range=${encodeURIComponent(range)}`, { cache: 'no-store' })
  })
})
