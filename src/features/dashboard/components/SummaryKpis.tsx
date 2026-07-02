import type { ReactNode } from 'react'
import type { DashboardSummary } from '../types/dashboard.types'

interface SummaryKpisProps {
  summary: DashboardSummary | undefined
  isLoading: boolean
  isError: boolean
  onRefetch: () => void
}

type Accent = 'success' | 'danger' | 'warning' | 'info' | 'neutral'

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const VALUE_CLASS: Record<Accent, string> = {
  neutral: 'text-text',
  success: 'text-success',
  danger: 'text-danger',
  warning: 'text-warning',
  info: 'text-info',
}

const DOT_CLASS: Record<Accent, string> = {
  neutral: 'bg-text-subtle',
  success: 'bg-success',
  danger: 'bg-danger',
  warning: 'bg-warning',
  info: 'bg-info',
}

function KpiCard({
  label,
  value,
  accent = 'neutral',
}: {
  label: string
  value: string | number
  accent?: Accent
}) {
  return (
    <div className="group flex flex-col gap-1.5 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <span className="flex items-center gap-1.5 text-xs font-semibold leading-tight text-text-muted">
        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${DOT_CLASS[accent]}`} />
        {label}
      </span>
      <span className={`font-heading text-xl font-bold sm:text-2xl ${VALUE_CLASS[accent]}`}>
        {value}
      </span>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="h-3 w-20 animate-pulse rounded bg-card-hover" />
      <div className="h-6 w-16 animate-pulse rounded bg-card-hover" />
    </div>
  )
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-2 font-heading text-sm font-bold text-text sm:mb-3">
      {children}
    </h3>
  )
}

export function SummaryKpis({ summary, isLoading, isError, onRefetch }: SummaryKpisProps) {
  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card py-10 text-center shadow-sm">
        <p className="text-sm text-text-muted">Erro ao carregar indicadores.</p>
        <button
          type="button"
          onClick={onRefetch}
          className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-card-hover"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:gap-6">
      {/* Clientes */}
      <div>
        <SectionTitle>Clientes</SectionTitle>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            <>
              <KpiCard label="Total" value={summary?.clients.total ?? 0} />
              <KpiCard label="Ativos" value={summary?.clients.active ?? 0} accent="success" />
              <KpiCard label="Inativos" value={summary?.clients.inactive ?? 0} />
              <KpiCard label="Novos no mês" value={summary?.clients.newThisMonth ?? 0} accent="info" />
            </>
          )}
        </div>
      </div>

      {/* Contratos */}
      <div>
        <SectionTitle>Contratos</SectionTitle>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            <>
              <KpiCard label="Ativos" value={summary?.contracts.active ?? 0} accent="success" />
              <KpiCard label="Pendentes" value={summary?.contracts.pending ?? 0} accent="warning" />
              <KpiCard
                label="Vencendo em 30 dias"
                value={summary?.contracts.expiringIn30Days ?? 0}
                accent={(summary?.contracts.expiringIn30Days ?? 0) > 0 ? 'warning' : 'neutral'}
              />
            </>
          )}
        </div>
      </div>

      {/* Financeiro */}
      <div>
        <SectionTitle>Financeiro — mês corrente</SectionTitle>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            <>
              <KpiCard
                label="Previsto no mês"
                value={formatCurrency(summary?.receivables.expectedThisMonth ?? 0)}
              />
              <KpiCard
                label="Recebido no mês"
                value={formatCurrency(summary?.receivables.receivedThisMonth ?? 0)}
                accent="success"
              />
              <KpiCard
                label="Em aberto no mês"
                value={formatCurrency(summary?.receivables.pendingThisMonth ?? 0)}
                accent="warning"
              />
              <KpiCard
                label="Total vencido"
                value={formatCurrency(summary?.receivables.overdueTotal ?? 0)}
                accent={(summary?.receivables.overdueTotal ?? 0) > 0 ? 'danger' : 'neutral'}
              />
              <KpiCard
                label="Qtd. vencidos"
                value={summary?.receivables.overdueCount ?? 0}
                accent={(summary?.receivables.overdueCount ?? 0) > 0 ? 'danger' : 'neutral'}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
