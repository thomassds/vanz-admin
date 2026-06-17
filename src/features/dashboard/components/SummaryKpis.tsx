import type { DashboardSummary } from '../types/dashboard.types'

interface SummaryKpisProps {
  summary: DashboardSummary | undefined
  isLoading: boolean
  isError: boolean
  onRefetch: () => void
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function KpiCard({
  label,
  value,
  accent,
}: {
  label: string
  value: string | number
  accent?: 'green' | 'red' | 'yellow' | 'blue'
}) {
  const accentClass =
    accent === 'green'
      ? 'text-green-600'
      : accent === 'red'
        ? 'text-red-500'
        : accent === 'yellow'
          ? 'text-yellow-600'
          : accent === 'blue'
            ? 'text-blue-600'
            : 'text-navy'

  return (
    <div className="flex flex-col gap-1 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <span className="text-xs font-semibold text-gray-400">{label}</span>
      <span className={`text-xl font-bold ${accentClass}`}>{value}</span>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
      <div className="h-6 w-16 animate-pulse rounded bg-gray-200" />
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 font-['Montserrat',sans-serif] text-sm font-bold text-navy">
      {children}
    </h3>
  )
}

export function SummaryKpis({ summary, isLoading, isError, onRefetch }: SummaryKpisProps) {
  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white py-10 text-center shadow-sm">
        <p className="text-sm text-gray-600">Erro ao carregar indicadores.</p>
        <button
          type="button"
          onClick={onRefetch}
          className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      {/* Clientes */}
      <div>
        <SectionTitle>Clientes</SectionTitle>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            <>
              <KpiCard label="Total" value={summary?.clients.total ?? 0} />
              <KpiCard label="Ativos" value={summary?.clients.active ?? 0} accent="green" />
              <KpiCard label="Inativos" value={summary?.clients.inactive ?? 0} />
              <KpiCard label="Novos no mês" value={summary?.clients.newThisMonth ?? 0} accent="blue" />
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
              <KpiCard label="Ativos" value={summary?.contracts.active ?? 0} accent="green" />
              <KpiCard label="Pendentes" value={summary?.contracts.pending ?? 0} accent="yellow" />
              <KpiCard
                label="Vencendo em 30 dias"
                value={summary?.contracts.expiringIn30Days ?? 0}
                accent={(summary?.contracts.expiringIn30Days ?? 0) > 0 ? 'yellow' : undefined}
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
                accent="green"
              />
              <KpiCard
                label="Em aberto no mês"
                value={formatCurrency(summary?.receivables.pendingThisMonth ?? 0)}
                accent="yellow"
              />
              <KpiCard
                label="Total vencido"
                value={formatCurrency(summary?.receivables.overdueTotal ?? 0)}
                accent={(summary?.receivables.overdueTotal ?? 0) > 0 ? 'red' : undefined}
              />
              <KpiCard
                label="Qtd. vencidos"
                value={summary?.receivables.overdueCount ?? 0}
                accent={(summary?.receivables.overdueCount ?? 0) > 0 ? 'red' : undefined}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
