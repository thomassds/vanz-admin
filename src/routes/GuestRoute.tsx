import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import { selectIsAuthenticated } from '@/features/auth/store/authSlice'

export function GuestRoute() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />
}
