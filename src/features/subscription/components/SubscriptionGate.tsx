import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useGetSubscriptionQuery } from '../store/subscriptionApi'

/**
 * Bloqueio SaaS do lado do cliente: sem assinatura ativa nem trial
 * vigente, toda a área autenticada redireciona para /subscription.
 * (O backend aplica a mesma regra com 402 — isto é só UX.)
 */
export function SubscriptionGate({ children }: { children: ReactNode }) {
  const location = useLocation()
  const { data: subscription } = useGetSubscriptionQuery()

  if (
    subscription &&
    !subscription.hasAccess &&
    location.pathname !== '/subscription'
  ) {
    return <Navigate to="/subscription" replace />
  }

  return <>{children}</>
}
