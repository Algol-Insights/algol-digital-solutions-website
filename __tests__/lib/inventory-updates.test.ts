import { updateInventoryStock, bulkUpdateInventoryStock } from '@/lib/api'

describe('lib/api inventory update helpers', () => {
  beforeEach(() => {
    ;(fetch as jest.Mock).mockReset()
  })

  describe('updateInventoryStock', () => {
    it('posts inventory update with correct payload', async () => {
      const payload = { success: true, newStock: 15 }
      ;(fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => payload })

      const input = {
        productId: 'prod-1',
        quantity: 5,
        type: 'RESTOCK' as const,
        reason: 'Incoming shipment',
      }

      const result = await updateInventoryStock(input)

      expect(fetch).toHaveBeenCalledWith(
        '/api/admin/inventory/update',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        })
      )
      expect(result.newStock).toBe(15)
      expect(result.success).toBe(true)
    })

    it('throws on failed response', async () => {
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Failed to update' }),
      })

      await expect(
        updateInventoryStock({
          productId: 'prod-1',
          quantity: -2,
          type: 'SALE',
        })
      ).rejects.toThrow('Failed to update')
    })
  })

  describe('bulkUpdateInventoryStock', () => {
    it('posts bulk updates with multiple product changes', async () => {
      const payload = { results: [{ productId: 'p1', success: true }, { productId: 'p2', success: true }] }
      ;(fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => payload })

      const input = {
        updates: [
          { productId: 'p1', quantity: 10 },
          { productId: 'p2', quantity: -3 },
        ],
        type: 'ADJUSTMENT' as const,
        reason: 'Monthly reconciliation',
      }

      const result = await bulkUpdateInventoryStock(input)

      expect(fetch).toHaveBeenCalledWith(
        '/api/admin/inventory/update',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ ...input, bulk: true }),
        })
      )
      expect(result.results).toHaveLength(2)
    })

    it('handles mixed successful and failed updates', async () => {
      const payload = {
        results: [
          { productId: 'p1', success: true },
          { productId: 'p2', success: false, error: 'Out of range' },
        ],
      }
      ;(fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => payload })

      const result = await bulkUpdateInventoryStock({
        updates: [
          { productId: 'p1', quantity: 5 },
          { productId: 'p2', quantity: 5 },
        ],
        type: 'ADJUSTMENT',
      })

      expect(result.results).toHaveLength(2)
      expect(result.results[0].success).toBe(true)
      expect(result.results[1].success).toBe(false)
    })
  })
})
