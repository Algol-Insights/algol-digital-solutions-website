'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Check, AlertCircle } from 'lucide-react';

interface SaleItemInput {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export default function RecordSalePage() {
  const [saleItems, setSaleItems] = useState<SaleItemInput[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED'>('FIXED');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [customerId, setCustomerId] = useState('');
  const [notes, setNotes] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch products on mount
  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => setProducts(data.products || []))
      .catch(console.error);
  }, []);

  const addItem = () => {
    if (!selectedProduct || quantity <= 0) {
      setMessage('❌ Please select a product and quantity');
      return;
    }

    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    setSaleItems([...saleItems, {
      productId: selectedProduct,
      quantity,
      unitPrice: product.price,
    }]);

    setSelectedProduct('');
    setQuantity(1);
    setMessage('✅ Item added');
  };

  const removeItem = (index: number) => {
    setSaleItems(saleItems.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    let total = saleItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    
    if (discountType === 'PERCENTAGE') {
      total -= (total * discount) / 100;
    } else {
      total -= discount;
    }

    return Math.max(0, total);
  };

  const handleSubmit = async () => {
    if (saleItems.length === 0) {
      setMessage('❌ Add at least one item');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/sales/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: saleItems,
          customerId: customerId || null,
          discount,
          discountType,
          paymentMethod,
          notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(`❌ ${data.error}`);
        return;
      }

      setMessage(`✅ Sale recorded! Transaction: ${data.transactionNo}`);
      setSaleItems([]);
      setDiscount(0);
      setNotes('');
      setCustomerId('');

      // Reset after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Failed to record sale');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const total = calculateTotal();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Record Sale</h1>

      {message && (
        <div className={`p-3 rounded-lg mb-4 flex items-center gap-2 ${
          message.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.startsWith('✅') ? <Check className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          {message}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Add Items Section */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <h2 className="font-bold mb-4">Add Items</h2>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Product</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full mt-1 p-2 border border-border rounded-lg bg-background"
                >
                  <option value="">Select product...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (${p.price}) - {p.inStock ? 'In Stock' : 'Out of Stock'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full mt-1 p-2 border border-border rounded-lg bg-background"
                />
              </div>

              <button
                onClick={addItem}
                className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Item
              </button>
            </div>
          </div>

          {/* Sale Items List */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h2 className="font-bold mb-4">Sale Items</h2>
            {saleItems.length === 0 ? (
              <p className="text-muted-foreground">No items added yet</p>
            ) : (
              <div className="space-y-2">
                {saleItems.map((item, idx) => {
                  const product = products.find(p => p.id === item.productId);
                  return (
                    <div key={idx} className="flex justify-between items-center p-3 bg-accent rounded-lg">
                      <div>
                        <p className="font-medium">{product?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity}x @ ${item.unitPrice} = ${(item.quantity * item.unitPrice).toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(idx)}
                        className="p-2 hover:bg-red-100 rounded-lg text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Summary Section */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-4 space-y-4">
            <h2 className="font-bold">Sale Summary</h2>

            <div>
              <label className="text-sm font-medium">Customer (Optional)</label>
              <input
                type="text"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                placeholder="Customer ID"
                className="w-full mt-1 p-2 border border-border rounded-lg bg-background text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Discount</label>
              <div className="flex gap-2 mt-1">
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  className="flex-1 p-2 border border-border rounded-lg bg-background"
                />
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as any)}
                  className="px-3 p-2 border border-border rounded-lg bg-background"
                >
                  <option value="FIXED">$</option>
                  <option value="PERCENTAGE">%</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full mt-1 p-2 border border-border rounded-lg bg-background"
              >
                <option value="CASH">Cash</option>
                <option value="CARD">Card</option>
                <option value="MOBILE">Mobile Money</option>
                <option value="CHEQUE">Cheque</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes..."
                className="w-full mt-1 p-2 border border-border rounded-lg bg-background text-sm"
                rows={3}
              />
            </div>

            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>${saleItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0).toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-red-600">
                  <span>Discount ({discountType === 'PERCENTAGE' ? `${discount}%` : `$${discount}`}):</span>
                  <span>
                    -${(
                      discountType === 'PERCENTAGE'
                        ? (saleItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) * discount) / 100
                        : discount
                    ).toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg bg-primary/10 p-3 rounded-lg">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || saleItems.length === 0}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-bold flex items-center justify-center gap-2"
            >
              <Check className="h-4 w-4" />
              {loading ? 'Recording...' : 'Record Sale'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
