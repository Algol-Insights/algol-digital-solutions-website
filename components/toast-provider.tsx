'use client'

import { useEffect, useState } from 'react'
import { Toast, ToastType } from './toast'

interface ToastData {
  id: string
  message: string
  type: ToastType
}

export function ToastProvider() {
  const [toasts, setToasts] = useState<ToastData[]>([])

  useEffect(() => {
    const handleToast = (event: CustomEvent<{ message: string; type: ToastType }>) => {
      const id = Math.random().toString(36).substring(7)
      const newToast = { id, ...event.detail }
      setToasts((prev) => [...prev, newToast])

      // Auto remove after 5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 5000)
    }

    window.addEventListener('show-toast' as any, handleToast)
    return () => window.removeEventListener('show-toast' as any, handleToast)
  }, [])

  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
        />
      ))}
    </>
  )
}
