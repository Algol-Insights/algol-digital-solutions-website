"use client"

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu,
  X,
  Bell,
  Shield,
  Package,
  Home,
  BarChart3,
  ShoppingBag,
  Settings,
  Cpu,
  Activity,
} from 'lucide-react'
import type { AdminNotification } from '@/lib/notifications'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: Home },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Categories', href: '/admin/categories', icon: ShoppingBag },
  { label: 'Orders', href: '/admin/orders', icon: BarChart3 },
  { label: 'Sales', href: '/admin/sales', icon: BarChart3 },
  { label: 'Inventory', href: '/admin/inventory', icon: Activity },
  { label: 'Analytics', href: '/admin/analytics', icon: Cpu },
  { label: 'Security', href: '/admin/security', icon: Shield },
  { label: 'Settings', href: '/admin/health', icon: Settings },
]

function classNames(...classes: Array<string | boolean | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export function AdminShell({ children, userRole }: { children: React.ReactNode; userRole?: string | null }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<AdminNotification[]>([])

  const activeNav = useMemo(() => {
    return navItems.map((item) => ({
      ...item,
      active: pathname?.startsWith(item.href),
    }))
  }, [pathname])

  useEffect(() => {
    async function loadNotifications() {
      try {
        const res = await fetch('/api/admin/notifications')
        const data = await res.json()
        setNotifications(data.notifications || [])
      } catch (err) {
        console.error('Failed to load notifications', err)
      }
    }
    loadNotifications()

    const evtSource = new EventSource('/api/admin/notifications/stream')
    evtSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data)
        setNotifications((prev) => [parsed, ...prev].slice(0, 50))
      } catch (err) {
        console.error('Notification parse error', err)
      }
    }
    evtSource.onerror = () => {
      evtSource.close()
    }
    return () => {
      evtSource.close()
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              className="inline-flex items-center justify-center rounded-md border border-slate-700 p-2 text-slate-200 hover:border-blue-500 hover:text-blue-300 lg:hidden"
              onClick={() => setOpen(!open)}
              aria-label="Toggle navigation"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link href="/admin" className="text-lg font-semibold text-white">
              Algol Admin
            </Link>
            <span className="rounded-full border border-green-500/40 bg-green-500/10 px-2 py-0.5 text-xs text-green-200">
              {userRole || 'ADMIN'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="h-5 w-5 text-slate-300" />
              {notifications.some((n) => !n.read) && (
                <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-amber-400" />
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-1">
        <aside
          className={classNames(
            'fixed inset-y-0 left-0 z-20 w-64 transform border-r border-slate-800 bg-slate-950/95 backdrop-blur transition-transform lg:static lg:translate-x-0',
            open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          )}
        >
          <nav className="flex flex-col gap-1 p-4">
            {activeNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={classNames(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition',
                  item.active
                    ? 'bg-blue-600/20 text-blue-100 border border-blue-500/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                )}
                onClick={() => setOpen(false)}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="ml-0 flex-1 bg-slate-900 px-4 py-6 lg:ml-0">
          <div className="lg:ml-4">{children}</div>
        </main>
      </div>
    </div>
  )
}
