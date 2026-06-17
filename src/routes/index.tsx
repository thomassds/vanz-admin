import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { GuestRoute } from './GuestRoute'
import { AppLayout } from '@/layouts/AppLayout'

const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))
const OnboardingPage = lazy(() => import('@/features/auth/pages/OnboardingPage'))
const RecoveryPasswordPage = lazy(() => import('@/features/auth/pages/RecoveryPasswordPage'))
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const ClientsPage = lazy(() => import('@/features/clients/pages/ClientsPage'))
const ClientDetailPage = lazy(() => import('@/features/clients/pages/ClientDetailPage'))
const ContractsPage = lazy(() => import('@/features/contracts/pages/ContractsPage'))
const ContractFormPage = lazy(() => import('@/features/contracts/pages/ContractFormPage'))
const ContractDetailPage = lazy(() => import('@/features/contracts/pages/ContractDetailPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

function PageLoader() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#00c8ff] border-t-transparent" />
    </div>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    element: <GuestRoute />,
    children: [
      {
        path: '/login',
        element: (
          <Suspense fallback={<PageLoader />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: '/onboarding',
        element: (
          <Suspense fallback={<PageLoader />}>
            <OnboardingPage />
          </Suspense>
        ),
      },
      {
        path: '/recovery-password',
        element: (
          <Suspense fallback={<PageLoader />}>
            <RecoveryPasswordPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: '/dashboard',
            element: (
              <Suspense fallback={<PageLoader />}>
                <DashboardPage />
              </Suspense>
            ),
          },
          {
            path: '/clients',
            element: (
              <Suspense fallback={<PageLoader />}>
                <ClientsPage />
              </Suspense>
            ),
          },
          {
            path: '/clients/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <ClientDetailPage />
              </Suspense>
            ),
          },
          {
            path: '/contracts',
            element: (
              <Suspense fallback={<PageLoader />}>
                <ContractsPage />
              </Suspense>
            ),
          },
          {
            path: '/contracts/new',
            element: (
              <Suspense fallback={<PageLoader />}>
                <ContractFormPage />
              </Suspense>
            ),
          },
          {
            path: '/contracts/:id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <ContractDetailPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<PageLoader />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
])
