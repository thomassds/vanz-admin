import { useSearchParams } from 'react-router-dom'
import { cn } from '@/shared/utils/cn'
import {
  useCreateCheckoutMutation,
  useCreatePortalMutation,
  useGetPlansQuery,
  useGetSubscriptionQuery,
} from '../store/subscriptionApi'
import type { Plan, PlanKey, SubscriptionStatus } from '../types/subscription.types'

const STATUS_BADGE: Record<SubscriptionStatus, { label: string; className: string }> = {
  trialing: { label: 'Período de teste', className: 'bg-info-soft text-info' },
  active: { label: 'Ativo', className: 'bg-success-soft text-success' },
  past_due: { label: 'Pagamento pendente', className: 'bg-warning-soft text-warning' },
  canceled: { label: 'Cancelado', className: 'bg-danger-soft text-danger' },
}

const PLAN_FEATURES: Record<PlanKey, string[]> = {
  gestao: [
    'Clientes e contratos ilimitados',
    'Contas a receber e a pagar',
    'Dashboard financeiro',
    'Até 2 veículos',
  ],
  operacao: [
    'Tudo do plano Gestão',
    'Rastreamento em tempo real',
    'Mapa ao vivo da frota',
    'App do motorista',
    'Veículos ilimitados',
  ],
}

function formatPrice(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR')
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-success">
      <path
        fill="currentColor"
        d="M9.55 17.05 4.5 12l1.4-1.4 3.65 3.64 8.55-8.54L19.5 7.1l-9.95 9.95Z"
      />
    </svg>
  )
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="h-4 w-24 animate-pulse rounded bg-card-hover" />
      <div className="mt-3 h-8 w-32 animate-pulse rounded bg-card-hover" />
      <div className="mt-4 space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-3 w-full animate-pulse rounded bg-card-hover" />
        ))}
      </div>
    </div>
  )
}

export default function SubscriptionPage() {
  const [searchParams] = useSearchParams()
  const checkoutResult = searchParams.get('checkout')

  const {
    data: subscription,
    isLoading: subscriptionLoading,
  } = useGetSubscriptionQuery(undefined, {
    // Após o retorno do checkout a ativação chega via webhook — faz polling
    pollingInterval:
      checkoutResult === 'success' ? 3000 : 0,
    skipPollingIfUnfocused: true,
  })
  const { data: plansData, isLoading: plansLoading } = useGetPlansQuery()

  const [createCheckout, { isLoading: isCheckingOut }] = useCreateCheckoutMutation()
  const [createPortal, { isLoading: isOpeningPortal }] = useCreatePortalMutation()

  const isLoading = subscriptionLoading || plansLoading
  const plans = plansData?.plans ?? []
  const isSubscriber =
    subscription?.status === 'active' || subscription?.status === 'past_due'
  const waitingWebhook =
    checkoutResult === 'success' && subscription?.status !== 'active'

  const handleSubscribe = async (plan: PlanKey) => {
    const { url } = await createCheckout({ plan }).unwrap()
    window.location.href = url
  }

  const handlePortal = async () => {
    const { url } = await createPortal().unwrap()
    window.location.href = url
  }

  const badge = subscription ? STATUS_BADGE[subscription.status] : null

  return (
    <div className="mx-auto grid max-w-4xl gap-6">
      <header>
        <h2 className="font-heading text-2xl font-bold text-text">Assinatura</h2>
        <p className="mt-1 text-sm text-text-muted">
          Gerencie o plano da sua operação
        </p>
      </header>

      {waitingWebhook && (
        <div className="flex items-center gap-3 rounded-2xl border border-info/40 bg-info-soft px-4 py-3">
          <div className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-info border-t-transparent" />
          <p className="m-0 text-sm font-medium text-info">
            Pagamento em processamento — sua assinatura será ativada em instantes.
          </p>
        </div>
      )}

      {checkoutResult === 'success' && subscription?.status === 'active' && (
        <div className="rounded-2xl border border-success/40 bg-success-soft px-4 py-3">
          <p className="m-0 text-sm font-semibold text-success">
            Assinatura ativada com sucesso. Bom trabalho!
          </p>
        </div>
      )}

      {checkoutResult === 'canceled' && (
        <div className="rounded-2xl border border-border bg-card px-4 py-3">
          <p className="m-0 text-sm text-text-muted">
            Checkout cancelado. Você pode assinar quando quiser.
          </p>
        </div>
      )}

      {/* Status atual */}
      {subscriptionLoading ? (
        <SkeletonCard />
      ) : subscription ? (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="m-0 font-heading text-lg font-bold text-text">
                  Plano {subscription.planName}
                </h3>
                {badge && (
                  <span
                    className={cn(
                      'inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold',
                      badge.className,
                    )}
                  >
                    {badge.label}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-text-muted">
                {subscription.status === 'trialing' &&
                  subscription.trialDaysLeft !== null &&
                  (subscription.hasAccess
                    ? `${subscription.trialDaysLeft} ${subscription.trialDaysLeft === 1 ? 'dia restante' : 'dias restantes'} de teste com acesso total`
                    : 'Seu período de teste terminou — assine para continuar usando o sistema')}
                {subscription.status === 'active' &&
                  subscription.currentPeriodEnd &&
                  (subscription.cancelAtPeriodEnd
                    ? `Cancelamento agendado — acesso até ${formatDate(subscription.currentPeriodEnd)}`
                    : `Próxima renovação em ${formatDate(subscription.currentPeriodEnd)}`)}
                {subscription.status === 'past_due' &&
                  'Não conseguimos processar seu pagamento. Atualize os dados de cobrança para manter o acesso.'}
                {subscription.status === 'canceled' &&
                  'Sua assinatura foi encerrada — assine um plano para voltar a usar o sistema.'}
              </p>
            </div>

            {isSubscriber && (
              <button
                type="button"
                onClick={() => void handlePortal()}
                disabled={isOpeningPortal}
                className="rounded-xl border border-border px-4 py-2.5 text-sm font-bold text-text transition-colors hover:bg-card-hover disabled:opacity-60"
              >
                {isOpeningPortal ? 'Abrindo...' : 'Gerenciar assinatura'}
              </button>
            )}
          </div>
        </div>
      ) : null}

      {/* Planos */}
      <div className="grid gap-4 md:grid-cols-2">
        {isLoading
          ? Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />)
          : plans.map((plan: Plan) => {
              const isCurrent =
                subscription?.plan === plan.key && isSubscriber
              const highlighted = plan.key === 'operacao'

              return (
                <div
                  key={plan.key}
                  className={cn(
                    'relative flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition-all',
                    highlighted
                      ? 'border-primary/60 ring-1 ring-primary/40'
                      : 'border-border',
                  )}
                >
                  {highlighted && (
                    <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-0.5 text-xs font-bold text-white shadow-sm shadow-primary/25">
                      Recomendado
                    </span>
                  )}

                  <h3 className="m-0 font-heading text-base font-bold text-text">
                    {plan.name}
                  </h3>
                  <p className="mt-2 flex items-baseline gap-1">
                    <span className="font-heading text-3xl font-extrabold text-text">
                      {formatPrice(plan.priceMonthlyCents)}
                    </span>
                    <span className="text-sm text-text-muted">/mês</span>
                  </p>

                  <ul className="mt-4 grid flex-1 gap-2 p-0">
                    {(PLAN_FEATURES[plan.key] ?? plan.features).map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-text-muted">
                        <CheckIcon />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {isCurrent ? (
                    <button
                      type="button"
                      disabled
                      className="mt-6 h-11 w-full cursor-default rounded-xl border border-success/40 bg-success-soft text-sm font-bold text-success"
                    >
                      Plano atual
                    </button>
                  ) : isSubscriber ? (
                    <button
                      type="button"
                      onClick={() => void handlePortal()}
                      disabled={isOpeningPortal}
                      className="mt-6 h-11 w-full rounded-xl border border-border text-sm font-bold text-text transition-colors hover:bg-card-hover disabled:opacity-60"
                    >
                      Mudar para este plano
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void handleSubscribe(plan.key)}
                      disabled={isCheckingOut}
                      className={cn(
                        'mt-6 h-11 w-full rounded-xl text-sm font-bold transition-all disabled:opacity-60',
                        highlighted
                          ? 'bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary-hover'
                          : 'border border-primary/50 text-primary hover:bg-primary-soft',
                      )}
                    >
                      {isCheckingOut ? 'Redirecionando...' : 'Assinar'}
                    </button>
                  )}
                </div>
              )
            })}
      </div>

      <p className="text-center text-xs text-text-subtle">
        Pagamento processado em ambiente seguro do nosso parceiro — nós não
        armazenamos dados do seu cartão. Cancele quando quiser.
      </p>
    </div>
  )
}
