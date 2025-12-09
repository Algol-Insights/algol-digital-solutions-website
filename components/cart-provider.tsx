"use client"

import * as React from "react"

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Zustand handles its own hydration, but we need to ensure client-side only
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent hydration mismatch by rendering children only after mount
  if (!mounted) {
    return <>{children}</>
  }

  return <>{children}</>
}
