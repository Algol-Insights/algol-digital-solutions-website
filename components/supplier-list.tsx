'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui-lib/badge';
import { Loader2, Plus, Eye, Trash2 } from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  email: string;
  leadTime: number;
  costPerUnit: number;
  active: boolean;
  productCount?: number;
  pendingOrders?: number;
}

interface SupplierListProps {
  onRefresh?: () => void;
  suppliers?: Supplier[];
  hideCreateLink?: boolean;
}

export default function SupplierList({
  onRefresh,
  suppliers: initialSuppliers,
  hideCreateLink = false,
}: SupplierListProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers || []);
  const [loading, setLoading] = useState(!initialSuppliers);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/suppliers');
      const data = await response.json();
      setSuppliers(data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialSuppliers) {
      fetchSuppliers();
    }
  }, [initialSuppliers]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this supplier?')) return;
    try {
      await fetch(`/api/admin/suppliers/${id}`, { method: 'DELETE' });
      setSuppliers(suppliers.filter((s) => s.id !== id));
    } catch (error) {
      console.error('Error deleting supplier:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Suppliers</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchSuppliers}>Refresh</Button>
          {!hideCreateLink && (
            <Button size="sm" variant="secondary"><Plus className="w-4 h-4 mr-2" />New</Button>
          )}
        </div>
      </div>

      <div className="grid gap-4">
        {suppliers.length === 0 ? (
          <p className="text-gray-500 p-4">No suppliers found</p>
        ) : (
          suppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="border rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{supplier.name}</h3>
                  <p className="text-sm text-gray-600">{supplier.email}</p>
                  <div className="flex gap-3 mt-2 text-sm">
                    <span>Lead Time: <span className="font-semibold">{supplier.leadTime} days</span></span>
                    <span>Cost: <span className="font-semibold">${supplier.costPerUnit}</span></span>
                    <span>Products: <span className="font-semibold">{supplier.productCount || 0}</span></span>
                    {supplier.pendingOrders && supplier.pendingOrders > 0 && (
                      <span>Pending Orders: <Badge variant="outline">{supplier.pendingOrders}</Badge></span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/suppliers/${supplier.id}`}>
                    <Button size="sm" variant="outline"><Eye className="w-4 h-4" /></Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(supplier.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
