'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui-lib/input';

interface SupplierFormProps {
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
  isLoading?: boolean;
}

export default function SupplierForm({
  onSubmit,
  initialData,
  isLoading = false,
}: SupplierFormProps) {
  const [data, setData] = useState(initialData || {
    name: '',
    email: '',
    phone: '',
    address: '',
    leadTime: 7,
    minOrderQuantity: 1,
    costPerUnit: 0,
    maxOrderQuantity: undefined,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setData((prev: any) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Supplier Name</label>
          <Input
            type="text"
            name="name"
            value={data.name}
            onChange={handleChange}
            placeholder="ABC Suppliers Inc."
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            type="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            placeholder="contact@supplier.com"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <Input
            type="tel"
            name="phone"
            value={data.phone}
            onChange={handleChange}
            placeholder="+1 (555) 123-4567"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Lead Time (days)</label>
          <Input
            type="number"
            name="leadTime"
            value={data.leadTime}
            onChange={handleChange}
            min="1"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Min Order Qty</label>
          <Input
            type="number"
            name="minOrderQuantity"
            value={data.minOrderQuantity}
            onChange={handleChange}
            min="1"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Cost per Unit ($)</label>
          <Input
            type="number"
            name="costPerUnit"
            value={data.costPerUnit}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Max Order Qty</label>
          <Input
            type="number"
            name="maxOrderQuantity"
            value={data.maxOrderQuantity || ''}
            onChange={handleChange}
            min="1"
            placeholder="Leave empty for unlimited"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Address</label>
        <textarea
          name="address"
          value={data.address}
          onChange={handleChange}
          placeholder="Supplier address"
          rows={3}
          className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : initialData ? 'Update Supplier' : 'Create Supplier'}
        </Button>
      </div>
    </form>
  );
}
