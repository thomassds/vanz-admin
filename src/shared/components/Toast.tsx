import { useEffect } from 'react'
import { cn } from '@/shared/utils/cn'

interface ToastProps {
  message: string
  type: 'success' | 'error'
  onDismiss: () => void
}

export function Toast({ message, type, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div
      role="alert"
      className={cn(
        'fixed right-4 top-4 z-[60] flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg',
        type === 'success' ? 'bg-success-light text-success' : 'bg-danger-light text-danger',
      )}
    >
      <span className="text-sm font-semibold">{message}</span>
      <button
        type="button"
        aria-label="Fechar"
        onClick={onDismiss}
        className="opacity-70 hover:opacity-100"
      >
        ✕
      </button>
    </div>
  )
}
