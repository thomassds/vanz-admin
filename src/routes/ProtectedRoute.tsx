import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import { selectIsAuthenticated } from '@/features/auth/store/authSlice'
import { SubscriptionGate } from '@/features/subscription/components/SubscriptionGate'

export function ProtectedRoute() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  if (!isAuthenticated) return <Navigate to="/login" replace />

  return (
    <SubscriptionGate>
      <Outlet />
    </SubscriptionGate>
  )
}
