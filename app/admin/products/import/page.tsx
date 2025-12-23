'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Upload, Wand2, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ParsedProduct {
  name: string
  description: string
  price: number
  stock: number
  brand: string
  category: string
  specs?: Record<string, any>
  imageUrl?: string
}

export default function AIProductImportPage() {
  const router = useRouter()
  const [priceList, setPriceList] = useState('')
  const [parsing, setParsing] = useState(false)
  const [importing, setImporting] = useState(false)
  const [parsedProducts, setParsedProducts] = useState<ParsedProduct[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleParse = async () => {
    if (!priceList.trim()) {
      setError('Please enter a price list')
      return
    }

    setParsing(true)
    setError(null)
    setSuccess(null)
    setParsedProducts([])

    try {
      const response = await fetch('/api/admin/products/ai-parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceList }),
        credentials: 'include', // Include cookies for authentication
      })

      // Log response details for debugging
      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)
      console.log('Response type:', response.type)
      
      // Check if response is ok before parsing
      if (!response.ok) {
        const text = await response.text()
        console.error('Error response:', text)
        let errorMessage = 'Failed to parse price list'
        
        if (response.status === 0 || text === '') {
          errorMessage = 'Network error or timeout. Please try again. If you are using a long price list, try with fewer items.'
        } else if (response.status === 401) {
          errorMessage = 'Unauthorized. Please refresh the page and try again.'
        } else {
          try {
            const data = JSON.parse(text)
            errorMessage = data.error || data.details || errorMessage
          } catch {
            errorMessage = text || errorMessage
          }
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log('Parsed data:', data)

      if (!data.products || data.products.length === 0) {
        throw new Error('No products found in the price list. Please check the format and try again.')
      }

      setParsedProducts(data.products)
      setSuccess(`Successfully parsed ${data.products.length} products`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to parse price list'
      setError(errorMessage)
      console.error('Parse error:', err)
    } finally {
      setParsing(false)
    }
  }

  const handleImport = async () => {
    if (parsedProducts.length === 0) {
      setError('No products to import')
      return
    }

    setImporting(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/admin/products/ai-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: parsedProducts }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to import products')
      }

      setSuccess(`Successfully imported ${data.imported} products`)
      setParsedProducts([])
      setPriceList('')
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/admin/products')
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import products')
    } finally {
      setImporting(false)
    }
  }

  const handleRemoveProduct = (index: number) => {
    setParsedProducts(prev => prev.filter((_, i) => i !== index))
  }

  const handleEditProduct = (index: number, field: keyof ParsedProduct, value: any) => {
    setParsedProducts(prev => prev.map((product, i) => 
      i === index ? { ...product, [field]: value } : product
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-950 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/admin/products" className="text-slate-400 hover:text-white mb-2 inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-purple-400" />
            AI Product Import
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Paste your price list and let AI extract product information automatically
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
            <div className="text-red-400">{error}</div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
            <div className="text-green-400">{success}</div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Price List Input</h2>
              <Upload className="w-5 h-5 text-slate-400" />
            </div>
            
            <div className="text-sm text-slate-400 space-y-2">
              <p>Paste your price list in any format. Examples:</p>
              <div className="bg-slate-900 p-3 rounded border border-slate-700 font-mono text-xs">
                <p>Dell Latitude 5420 - $850 - 10 units</p>
                <p>Intel i5, 8GB RAM, 256GB SSD</p>
                <p className="mt-2">HP ProBook 450 G8 | $920 | Stock: 5</p>
                <p>Specs: i7, 16GB, 512GB</p>
              </div>
            </div>

            <textarea
              value={priceList}
              onChange={(e) => setPriceList(e.target.value)}
              placeholder="Paste your price list here..."
              className="w-full h-96 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={parsing}
            />

            <Button
              onClick={handleParse}
              disabled={parsing || !priceList.trim()}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              {parsing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Parsing with AI...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Parse with AI
                </>
              )}
            </Button>
          </div>

          {/* Preview Section */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                Parsed Products ({parsedProducts.length})
              </h2>
              {parsedProducts.length > 0 && (
                <Button
                  onClick={handleImport}
                  disabled={importing}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  {importing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Import All
                    </>
                  )}
                </Button>
              )}
            </div>

            <div className="h-[600px] overflow-y-auto space-y-4">
              {parsedProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                  <Wand2 className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-center">
                    No products parsed yet.<br />
                    Paste your price list and click "Parse with AI"
                  </p>
                </div>
              ) : (
                parsedProducts.map((product, index) => (
                  <div
                    key={index}
                    className="bg-slate-900 border border-slate-700 rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="text-white font-medium">{product.name}</h3>
                      <button
                        onClick={() => handleRemoveProduct(index)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <label className="text-slate-400">Price</label>
                        <input
                          type="number"
                          value={product.price}
                          onChange={(e) => handleEditProduct(index, 'price', parseFloat(e.target.value))}
                          className="w-full px-2 py-1 bg-slate-800 border border-slate-700 rounded text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400">Stock</label>
                        <input
                          type="number"
                          value={product.stock}
                          onChange={(e) => handleEditProduct(index, 'stock', parseInt(e.target.value))}
                          className="w-full px-2 py-1 bg-slate-800 border border-slate-700 rounded text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400">Brand</label>
                        <input
                          type="text"
                          value={product.brand}
                          onChange={(e) => handleEditProduct(index, 'brand', e.target.value)}
                          className="w-full px-2 py-1 bg-slate-800 border border-slate-700 rounded text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400">Category</label>
                        <input
                          type="text"
                          value={product.category}
                          onChange={(e) => handleEditProduct(index, 'category', e.target.value)}
                          className="w-full px-2 py-1 bg-slate-800 border border-slate-700 rounded text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-400 text-sm">Description</label>
                      <textarea
                        value={product.description}
                        onChange={(e) => handleEditProduct(index, 'description', e.target.value)}
                        className="w-full px-2 py-1 bg-slate-800 border border-slate-700 rounded text-white text-sm resize-none"
                        rows={2}
                      />
                    </div>

                    {product.specs && Object.keys(product.specs).length > 0 && (
                      <div className="text-xs text-slate-400">
                        <span className="font-medium">Specs:</span>{' '}
                        {Object.entries(product.specs).map(([key, value]) => (
                          <span key={key} className="inline-block mr-2">
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
