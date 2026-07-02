import type { MonthlyRevenueItem } from '../types/dashboard.types'
import { cn } from '@/shared/utils/cn'

interface MonthlyRevenueTableProps {
  data: MonthlyRevenueItem[] | undefined
  months: number
  isLoading: boolean
  isError: boolean
  onMonthsChange: (months: number) => void
  onRefetch: () => void
}

const PERIOD_OPTIONS = [3, 6, 12] as const

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatMonth(ym: string): string {
  const [year, month] = ym.split('-')
  if (!year || !month) return ym
  const date = new Date(parseInt(year), parseInt(month) - 1, 1)
  return date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
}

/** Percentual recebido sobre o previsto, limitado a 100% */
function receivedRatio(row: MonthlyRevenueItem): number {
  if (row.expected <= 0) return 0
  return Math.min(100, Math.round((row.received / row.expected) * 100))
}

export function MonthlyRevenueTable({
  data,
  months,
  isLoading,
  isError,
  onMonthsChange,
  onRefetch,
}: MonthlyRevenueTableProps) {
  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-heading text-sm font-bold text-text">Receita Mensal</h3>
          <p className="mt-0.5 text-xs text-text-subtle">Previsto × recebido por mês</p>
        </div>
        <div className="flex gap-1 rounded-xl border border-border bg-app p-1">
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onMonthsChange(opt)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                months === opt
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-text-muted hover:bg-card-hover hover:text-text',
              )}
            >
              {opt} meses
            </button>
          ))}
        </div>
      </div>

      {isError ? (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <p className="text-sm text-text-muted">Erro ao carregar histórico.</p>
          <button
            type="button"
            onClick={onRefetch}
            className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-card-hover"
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-subtle">Mês</th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-subtle md:table-cell">
                  Realizado
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-subtle">Previsto</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-subtle">Recebido</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-subtle">Em aberto</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-subtle">Vencido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading
                ? Array.from({ length: months }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 animate-pulse rounded bg-card-hover" />
                        </td>
                      ))}
                    </tr>
                  ))
                : data?.map((row) => {
                    const ratio = receivedRatio(row)
                    return (
                      <tr key={row.month} className="transition-colors hover:bg-card-hover">
                        <td className="px-4 py-3 font-medium capitalize text-text">
                          {formatMonth(row.month)}
                        </td>
                        <td className="hidden px-4 py-3 md:table-cell">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-28 overflow-hidden rounded-full bg-card-hover">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-primary to-success transition-all"
                                style={{ width: `${ratio}%` }}
                              />
                            </div>
                            <span className="w-9 text-right text-xs tabular-nums text-text-subtle">
                              {ratio}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-text-muted">
                          {formatCurrency(row.expected)}
                        </td>
                        <td className="px-4 py-3 text-right font-medium tabular-nums text-success">
                          {formatCurrency(row.received)}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-warning">
                          {formatCurrency(row.pending)}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-danger">
                          {formatCurrency(row.overdue)}
                        </td>
                      </tr>
                    )
                  })}
            </tbody>
          </table>

          {!isLoading && (!data || data.length === 0) && (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-text-subtle">Sem dados no período.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
