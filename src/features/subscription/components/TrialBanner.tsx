import { Link, useLocation } from 'react-router-dom'
import {
  useCreatePortalMutation,
  useGetSubscriptionQuery,
} from '../store/subscriptionApi'

/**
 * Faixa global de status da assinatura (trial em andamento / pagamento
 * pendente), exibida no AppLayout. Some na própria página de assinatura.
 */
export function TrialBanner() {
  const location = useLocation()
  const { data: subscription } = useGetSubscriptionQuery()
  const [createPortal, { isLoading }] = useCreatePortalMutation()

  if (!subscription || location.pathname === '/subscription') return null

  if (subscription.status === 'trialing' && subscription.hasAccess) {
    const days = subscription.trialDaysLeft ?? 0
    return (
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 border-b border-info/30 bg-info-soft px-4 py-2 text-center">
        <p className="m-0 text-xs font-medium text-info">
          Período de teste: {days} {days === 1 ? 'dia restante' : 'dias restantes'} com acesso total.
        </p>
        <Link
          to="/subscription"
          className="text-xs font-bold text-info underline underline-offset-2 hover:opacity-80"
        >
          Assinar agora
        </Link>
      </div>
    )
  }

  if (subscription.status === 'past_due') {
    return (
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 border-b border-warning/30 bg-warning-soft px-4 py-2 text-center">
        <p className="m-0 text-xs font-medium text-warning">
          Não conseguimos processar seu pagamento — atualize os dados de cobrança para manter o acesso.
        </p>
        <button
          type="button"
          disabled={isLoading}
          onClick={() => {
            void createPortal()
              .unwrap()
              .then(({ url }) => {
                window.location.href = url
              })
          }}
          className="text-xs font-bold text-warning underline underline-offset-2 hover:opacity-80 disabled:opacity-60"
        >
          {isLoading ? 'Abrindo...' : 'Atualizar pagamento'}
        </button>
      </div>
    )
  }

  return null
}
