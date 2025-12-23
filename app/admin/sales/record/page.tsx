'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Check, AlertCircle, Search, X, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/toast'
import { LoadingSpinner } from '@/components/loading-states'

interface Product {
  id: string
  name: string
  price: number
  stock: number
  inStock: boolean
  brand?: string
  category?: { name: string }
}

interface SaleItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  serialNumber?: string
}

export default function RecordSalePage() {
  const router = useRouter()
  const toast = useToast()
  
  // Product search
  const [searchQuery, setSearchQuery] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  
  // Sale items
  const [saleItems, setSaleItems] = useState<SaleItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [customPrice, setCustomPrice] = useState('')
  const [serialNumber, setSerialNumber] = useState('')
  
  // Sale details
  const [discount, setDiscount] = useState(0)
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED'>('FIXED')
  const [paymentMethod, setPaymentMethod] = useState('CASH')
  const [paymentStatus, setPaymentStatus] = useState('COMPLETED')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [notes, setNotes] = useState('')
  
  const [submitting, setSubmitting] = useState(false)

  // Fetch products
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products?limit=1000')
      const data = await res.json()
      setProducts(data.data || data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    }
  }

  // Filter products based on search
  useEffect(() => {
    if (searchQuery.trim()) {
      setSearchLoading(true)
      const filtered = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 10)
      setFilteredProducts(filtered)
      setShowSearchResults(true)
      setSearchLoading(false)
    } else {
      setFilteredProducts([])
      setShowSearchResults(false)
    }
  }, [searchQuery, products])

  const selectProduct = (product: Product) => {
    setSelectedProduct(product)
    setCustomPrice(product.price.toString())
    setSearchQuery('')
    setShowSearchResults(false)
    setQuantity(1)
    setSerialNumber('')
  }

  const addItem = () => {
    if (!selectedProduct) {
      toast.error('Please select a product')
      return
    }

    if (quantity <= 0 || quantity > selectedProduct.stock) {
      toast.error(`Invalid quantity. Available stock: ${selectedProduct.stock}`)
      return
    }

    const price = parseFloat(customPrice) || selectedProduct.price

    // Check if product requires serial number (laptops, computers, etc.)
    const requiresSerial = selectedProduct.name.toLowerCase().includes('laptop') ||
                          selectedProduct.name.toLowerCase().includes('computer') ||
                          selectedProduct.name.toLowerCase().includes('desktop')

    if (requiresSerial && !serialNumber.trim()) {
      toast.error('Serial number required for this product')
      return
    }

    const newItem: SaleItem = {
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      quantity,
      unitPrice: price,
      serialNumber: serialNumber.trim() || undefined
    }

    setSaleItems([...saleItems, newItem])
    setSelectedProduct(null)
    setQuantity(1)
    setCustomPrice('')
    setSerialNumber('')
    toast.success('Item added to sale')
  }

  const removeItem = (index: number) => {
    setSaleItems(saleItems.filter((_, i) => i !== index))
    toast.success('Item removed')
  }

  const calculateSubtotal = () => {
    return saleItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
  }

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal()
    if (discountType === 'PERCENTAGE') {
      return (subtotal * discount) / 100
    }
    return discount
  }

  const calculateTotal = () => {
    return Math.max(0, calculateSubtotal() - calculateDiscount())
  }

  const handleSubmit = async () => {
    if (saleItems.length === 0) {
      toast.error('Add at least one item to the sale')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/admin/sales/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: saleItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            serialNumber: item.serialNumber
          })),
          discount,
          discountType,
          paymentMethod,
          paymentStatus,
          customerName: customerName.trim() || null,
          customerPhone: customerPhone.trim() || null,
          notes: notes.trim() || null,
          saleDate: new Date().toISOString()
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to record sale')
      }

      toast.success(`Sale recorded! Transaction: ${data.transactionNo}`)
      
      // Reset form
      setSaleItems([])
      setDiscount(0)
      setCustomerName('')
      setCustomerPhone('')
      setNotes('')
      
      // Redirect to sales list after 2 seconds
      setTimeout(() => {
        router.push('/admin/sales')
      }, 2000)

    } catch (error: any) {
      console.error('Error recording sale:', error)
      toast.error(error.message || 'Failed to record sale')
    } finally {
      setSubmitting(false)
    }
  }

  const subtotal = calculateSubtotal()
  const discountAmount = calculateDiscount()
  const total = calculateTotal()

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/sales">
          <button className="p-2 hover:bg-accent rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </button>
        </Link>
        <h1 className="text-3xl font-bold">Record New Sale</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Product Selection & Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Search */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Search Product</h2>
            
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by product name, brand, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute z-10 w-full mt-2 bg-background border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto">
                  {searchLoading ? (
                    <div className="p-4 text-center">
                      <LoadingSpinner className="h-6" />
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      No products found
                    </div>
                  ) : (
                    filteredProducts.map(product => (
                      <button
                        key={product.id}
                        onClick={() => selectProduct(product)}
                        className="w-full px-4 py-3 hover:bg-accent text-left border-b border-border last:border-0"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {product.brand} • {product.category?.name}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">${product.price}</p>
                            <p className="text-sm text-muted-foreground">
                              Stock: {product.stock}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Selected Product Details */}
            {selectedProduct && (
              <div className="mt-4 p-4 bg-accent rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{selectedProduct.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedProduct.brand} • Stock: {selectedProduct.stock}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="p-1 hover:bg-background rounded"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Quantity *</label>
                    <input
                      type="number"
                      min="1"
                      max={selectedProduct.stock}
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className="w-full mt-1 p-2 border border-border rounded-lg bg-background"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Price ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={customPrice}
                      onChange={(e) => setCustomPrice(e.target.value)}
                      className="w-full mt-1 p-2 border border-border rounded-lg bg-background"
                    />
                  </div>

                  {(selectedProduct.name.toLowerCase().includes('laptop') ||
                    selectedProduct.name.toLowerCase().includes('computer')) && (
                    <div className="col-span-2">
                      <label className="text-sm font-medium">Serial Number *</label>
                      <input
                        type="text"
                        value={serialNumber}
                        onChange={(e) => setSerialNumber(e.target.value)}
                        placeholder="Enter serial number..."
                        className="w-full mt-1 p-2 border border-border rounded-lg bg-background"
                      />
                    </div>
                  )}
                </div>

                <button
                  onClick={addItem}
                  className="w-full mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add to Sale
                </button>
              </div>
            )}
          </div>

          {/* Sale Items List */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">
              Sale Items ({saleItems.length})
            </h2>
            
            {saleItems.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No items added yet</p>
                <p className="text-sm mt-2">Search and select products to add them to the sale</p>
              </div>
            ) : (
              <div className="space-y-3">
                {saleItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start p-4 bg-accent rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{item.productName}</p>
                      <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                        <span>{item.quantity}x @ ${item.unitPrice}</span>
                        {item.serialNumber && (
                          <span>S/N: {item.serialNumber}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold">
                        ${(item.quantity * item.unitPrice).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeItem(idx)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Sale Summary */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Customer Info (Optional)</h2>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Customer Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer name..."
                  className="w-full mt-1 p-2 border border-border rounded-lg bg-background"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Phone Number</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+263..."
                  className="w-full mt-1 p-2 border border-border rounded-lg bg-background"
                />
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Payment Details</h2>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Payment Method *</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full mt-1 p-2 border border-border rounded-lg bg-background"
                >
                  <option value="CASH">Cash</option>
                  <option value="ECOCASH">EcoCash</option>
                  <option value="INNBUCKS">InnBucks</option>
                  <option value="BANK">Bank Transfer</option>
                  <option value="CARD">Card</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Payment Status *</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full mt-1 p-2 border border-border rounded-lg bg-background"
                >
                  <option value="COMPLETED">Completed</option>
                  <option value="PENDING">Pending</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm font-medium">Discount</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    className="w-full mt-1 p-2 border border-border rounded-lg bg-background"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full mt-1 p-2 border border-border rounded-lg bg-background"
                  >
                    <option value="FIXED">$ Fixed</option>
                    <option value="PERCENTAGE">% Percent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional notes..."
                  rows={3}
                  className="w-full mt-1 p-2 border border-border rounded-lg bg-background"
                />
              </div>
            </div>
          </div>

          {/* Sale Summary */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Sale Summary</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-sm text-red-600">
                  <span>Discount ({discountType === 'PERCENTAGE' ? `${discount}%` : `$${discount}`}):</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total:</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>

              <div className="text-xs text-muted-foreground pt-2">
                Date: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting || saleItems.length === 0}
              className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <LoadingSpinner className="h-5" />
                  Recording Sale...
                </>
              ) : (
                <>
                  <Check className="h-5 w-5" />
                  Record Sale
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
