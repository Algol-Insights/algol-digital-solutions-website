'use client';

import { useEffect, useState } from 'react';
import { Eye, Download, Filter } from 'lucide-react';
import Link from 'next/link';

interface Sale {
  id: string;
  transactionNo: string;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  user: { name: string };
  items: Array<{ quantity: number; total: number }>;
}

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [stats, setStats] = useState({ totalSales: 0, totalRevenue: 0 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  useEffect(() => {
    fetchSales();
  }, [page]);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/sales/list?page=${page}`);
      const data = await res.json();
      setSales(data.sales);
      setPagination(data.pagination);
      setStats(data.stats);
    } catch (error) {
      console.error('Failed to fetch sales:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Sales</h1>
        <Link
          href="/admin/sales/record"
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          + Record Sale
        </Link>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">Total Sales</p>
          <p className="text-3xl font-bold">{stats.totalSales}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-3xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">Avg Transaction</p>
          <p className="text-3xl font-bold">
            ${(stats.totalSales > 0 ? stats.totalRevenue / stats.totalSales : 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-accent border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-bold">Transaction #</th>
                <th className="px-6 py-3 text-left text-sm font-bold">Items</th>
                <th className="px-6 py-3 text-left text-sm font-bold">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-bold">Payment</th>
                <th className="px-6 py-3 text-left text-sm font-bold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-bold">Recorded By</th>
                <th className="px-6 py-3 text-left text-sm font-bold">Date</th>
                <th className="px-6 py-3 text-left text-sm font-bold">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-muted-foreground">
                    Loading...
                  </td>
                </tr>
              ) : sales.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-muted-foreground">
                    No sales recorded yet
                  </td>
                </tr>
              ) : (
                sales.map(sale => (
                  <tr key={sale.id} className="border-b border-border hover:bg-accent/50">
                    <td className="px-6 py-4 font-mono text-sm">{sale.transactionNo}</td>
                    <td className="px-6 py-4">
                      {sale.items.reduce((sum, item) => sum + item.quantity, 0)} items
                    </td>
                    <td className="px-6 py-4 font-bold">${sale.total.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200">
                        {sale.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full ${
                        sale.paymentStatus === 'COMPLETED'
                          ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200'
                          : sale.paymentStatus === 'PENDING'
                          ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200'
                          : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200'
                      }`}>
                        {sale.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{sale.user.name}</td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(sale.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-2 hover:bg-blue-100 rounded-lg text-blue-600">
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-border rounded-lg hover:bg-accent disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {pagination.pages}
          </span>
          <button
            onClick={() => setPage(Math.min(pagination.pages, page + 1))}
            disabled={page === pagination.pages}
            className="px-4 py-2 border border-border rounded-lg hover:bg-accent disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
