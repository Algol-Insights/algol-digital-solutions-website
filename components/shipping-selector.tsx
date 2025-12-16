'use client'

import { useState } from 'react'
import { SHIPPING_RATES, ShippingRate } from '@/lib/shipping'
import { CheckCircle, Truck } from 'lucide-react'

interface ShippingSelectorProps {
  onSelect: (rate: ShippingRate) => void
  selectedCarrier?: string
}

export function ShippingSelector({ onSelect, selectedCarrier }: ShippingSelectorProps) {
  const [selected, setSelected] = useState<string>(selectedCarrier || 'standard')

  const handleSelect = (rate: ShippingRate) => {
    setSelected(rate.carrier)
    onSelect(rate)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Truck className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Shipping Method</h3>
      </div>

      <div className="space-y-3">
        {SHIPPING_RATES.map((rate) => (
          <button
            key={rate.carrier}
            type="button"
            onClick={() => handleSelect(rate)}
            className={`w-full p-4 rounded-lg border-2 text-left transition ${
              selected === rate.carrier
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{rate.icon}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{rate.name}</p>
                    {selected === rate.carrier && (
                      <CheckCircle className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{rate.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Estimated: {rate.estimatedDays}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">
                  ${rate.price.toFixed(2)}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
