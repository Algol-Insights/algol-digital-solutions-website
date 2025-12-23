"use client"

import { useEffect, useState } from "react"

type HealthResponse = {
  status: "ok" | "error"
  timestamp?: string
  counts?: {
    products: number
    categories: number
    orders: number
    users: number
    reviews: number
    coupons: number
  }
  message?: string
}

export default function AdminHealthPage() {
  const [data, setData] = useState<HealthResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/health", { cache: "no-store" })
      const json: HealthResponse = await res.json()
      setData(json)
    } catch (e: any) {
      setError(e?.message || "Failed to load health data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    const id = setInterval(load, 15000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">System Health</h1>
      {loading && <div>Loading…</div>}
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded border border-red-200 mb-4">
          {error}
        </div>
      )}
      {data && data.status === "ok" && data.counts && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(data.counts).map(([key, value]) => (
            <div
              key={key}
              className="rounded-lg border border-gray-200 p-4 bg-white shadow-sm"
            >
              <div className="text-gray-600 text-sm capitalize">{key}</div>
              <div className="text-3xl font-bold mt-1">{value}</div>
            </div>
          ))}
        </div>
      )}
      {data && data.timestamp && (
        <div className="text-sm text-gray-500 mt-4">
          Last updated: {new Date(data.timestamp!).toLocaleString()}
        </div>
      )}
    </div>
  )}
