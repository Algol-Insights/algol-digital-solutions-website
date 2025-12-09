'use client'

import { useState } from 'react'
import { PAYMENT_GATEWAYS, type PaymentGateway, calculateWithFees, getFeeDescription } from '@/lib/payment-gateways'
import { CheckCircle, AlertCircle } from 'lucide-react'

interface PaymentMethodSelectorProps {
  amount: number
  currency: string
  onSelect: (gateway: PaymentGateway, totalAmount: number) => void
  selectedGateway?: PaymentGateway
}

export function PaymentMethodSelector({
  amount,
  currency,
  onSelect,
  selectedGateway,
}: PaymentMethodSelectorProps) {
  const [selected, setSelected] = useState<PaymentGateway | null>(selectedGateway || null)

  const handleSelect = (gateway: PaymentGateway) => {
    setSelected(gateway)
    const totalAmount = calculateWithFees(amount, gateway)
    onSelect(gateway, totalAmount)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Payment Method</h2>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Order Total</p>
          <p className="text-2xl font-bold">
            {currency} {amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.values(PAYMENT_GATEWAYS).map((gateway) => {
          const totalWithFees = calculateWithFees(amount, gateway.gateway)
          const feeAmount = totalWithFees - amount
          const isSelected = selected === gateway.gateway

          return (
            <button
              key={gateway.gateway}
              onClick={() => handleSelect(gateway.gateway)}
              className={`relative p-6 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-violet-600 bg-violet-50 dark:bg-violet-950'
                  : 'border-border hover:border-violet-400 bg-card'
              } ${!gateway.supported ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              disabled={!gateway.supported}
            >
              {/* Selection Indicator */}
              <div className="absolute top-3 right-3">
                {isSelected && (
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-5 h-5 text-violet-600" />
                  </div>
                )}
              </div>

              {/* Gateway Icon & Name */}
              <div className="text-left mb-3">
                <div className="text-3xl mb-2">{gateway.icon}</div>
                <h3 className="font-semibold text-lg">{gateway.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{gateway.description}</p>
              </div>

              {/* Gateway Details */}
              <div className="space-y-2 text-sm">
                {/* Processing Time */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Processing:</span>
                  <span className="font-medium text-foreground">{gateway.processingTime}</span>
                </div>

                {/* Amount Limits */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Limits:</span>
                  <span className="font-medium text-foreground">
                    {currency} {gateway.minAmount} - {gateway.maxAmount.toLocaleString()}
                  </span>
                </div>

                {/* Fee Display */}
                <div className="pt-3 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{getFeeDescription(gateway.gateway)}</span>
                    <span className="font-semibold">
                      {currency} {feeAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                    <span className="font-semibold">Total:</span>
                    <span className="text-lg font-bold text-violet-600">
                      {currency} {totalWithFees.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Unavailable Badge */}
              {!gateway.supported && (
                <div className="absolute inset-0 rounded-lg flex items-center justify-center bg-black/5 dark:bg-black/20">
                  <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                    <AlertCircle className="w-4 h-4" />
                    Coming Soon
                  </div>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Selection Summary */}
      {selected && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-green-900 dark:text-green-100">
                Payment method selected: {PAYMENT_GATEWAYS[selected].name}
              </p>
              <p className="text-green-800 dark:text-green-200 mt-1">
                You'll be securely redirected to complete your payment.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
