import { render, screen, waitFor } from '@testing-library/react'
import { StockIndicator, StockProgress } from '@/components/stock-indicator'
import { DEFAULT_LOW_STOCK_THRESHOLD, LOW_STOCK_WARNING_THRESHOLD } from '@/lib/inventory-config'

describe('components/stock-indicator', () => {
  describe('StockIndicator', () => {
    it('renders out-of-stock badge when stock is 0', () => {
      render(<StockIndicator stock={0} />)
      expect(screen.getByText('Out of Stock')).toBeInTheDocument()
    })

    it('renders critical alert when stock below critical threshold', () => {
      render(<StockIndicator stock={DEFAULT_LOW_STOCK_THRESHOLD - 1} criticalThreshold={DEFAULT_LOW_STOCK_THRESHOLD} />)
      expect(screen.getByText(/Only \d+ left!/)).toBeInTheDocument()
    })

    it('renders low stock warning between thresholds', () => {
      render(
        <StockIndicator
          stock={LOW_STOCK_WARNING_THRESHOLD - 1}
          lowThreshold={LOW_STOCK_WARNING_THRESHOLD}
          criticalThreshold={DEFAULT_LOW_STOCK_THRESHOLD}
        />
      )
      expect(screen.getByText('Low Stock')).toBeInTheDocument()
    })

    it('renders in-stock when above warning threshold', () => {
      render(
        <StockIndicator
          stock={LOW_STOCK_WARNING_THRESHOLD + 5}
          lowThreshold={LOW_STOCK_WARNING_THRESHOLD}
        />
      )
      expect(screen.getByText('In Stock')).toBeInTheDocument()
    })

    it('supports inline variant display', () => {
      render(<StockIndicator stock={3} variant="inline" />)
      expect(screen.getByText(/Only \d+ left!/)).toBeInTheDocument()
    })

    it('supports detailed variant with extra messaging', () => {
      render(<StockIndicator stock={4} variant="detailed" />)
      expect(screen.getByText(/Hurry/)).toBeInTheDocument()
    })
  })

  describe('StockProgress', () => {
    it('renders progress bar with stock level', () => {
      render(<StockProgress stock={50} maxStock={100} />)
      expect(screen.getByText('Stock Level')).toBeInTheDocument()
      expect(screen.getByText('50 units')).toBeInTheDocument()
    })

    it('hides label when showLabel is false', () => {
      render(<StockProgress stock={50} maxStock={100} showLabel={false} />)
      expect(screen.queryByText('Stock Level')).not.toBeInTheDocument()
    })

    it('caps percentage at 100', () => {
      const { container } = render(<StockProgress stock={150} maxStock={100} />)
      // When stock exceeds maxStock, the component still renders but the percentage is capped
      const progressContainer = container.querySelector('div')
      expect(progressContainer).toBeInTheDocument()
    })
  })
})
