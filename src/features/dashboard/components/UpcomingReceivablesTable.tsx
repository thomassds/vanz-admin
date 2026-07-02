import { useNavigate } from 'react-router-dom'
import { isoToBR } from '@/shared/utils/date'
import type { UpcomingReceivable } from '../types/dashboard.types'

interface UpcomingReceivablesTableProps {
  data: UpcomingReceivable[] | undefined
  total: number
  page: number
  totalPages: number
  isLoading: boolean
  isError: boolean
  onPageChange: (page: number) => void
  onRefetch: () => void
}

const SKELETON_ROWS = 5

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendente',
  charged: 'Cobrado',
  overdue: 'Vencido',
}

const STATUS_CLASS: Record<string, string> = {
  pending: 'bg-card-hover text-text-muted',
  charged: 'bg-info-soft text-info',
  overdue: 'bg-danger-soft text-danger',
}

export function UpcomingReceivablesTable({
  data,
  total,
  page,
  totalPages,
  isLoading,
  isError,
  onPageChange,
  onRefetch,
}: UpcomingReceivablesTableProps) {
  const navigate = useNavigate()

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <p className="text-sm text-text-muted">Erro ao carregar próximos vencimentos.</p>
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
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-subtle">Cliente</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-subtle sm:table-cell">
                Parcela
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-subtle">Vencimento</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-subtle">Valor</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-subtle sm:table-cell">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-subtle">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading
              ? Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 animate-pulse rounded bg-card-hover" />
                      </td>
                    ))}
                  </tr>
                ))
              : data?.map((r) => (
                  <tr key={r.id} className="transition-colors hover:bg-card-hover">
                    <td className="px-4 py-3">
                      <span className="font-medium text-text">{r.clientName}</span>
                      <span className="mt-0.5 block text-xs text-text-subtle sm:hidden">
                        {STATUS_LABELS[r.status] ?? r.status}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 text-text-muted sm:table-cell">
                      #{r.installmentNumber}
                    </td>
                    <td className="px-4 py-3 text-text-muted">{isoToBR(r.dueDate.slice(0, 10))}</td>
                    <td className="px-4 py-3 tabular-nums text-text-muted">{formatCurrency(r.value)}</td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_CLASS[r.status] ?? 'bg-card-hover text-text-muted'}`}
                      >
                        {STATUS_LABELS[r.status] ?? r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          void navigate(`/finances/receivables?contractId=${r.contractId}`)
                        }
                        className="text-xs font-bold text-primary transition-colors hover:text-primary-hover"
                      >
                        Ver →
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {!isLoading && (!data || data.length === 0) && (
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-text-subtle">Nenhum vencimento nos próximos 30 dias.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <span className="text-xs text-text-subtle">{total} recebível{total !== 1 ? 'is' : ''}</span>
          <div className="flex gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:bg-card-hover disabled:opacity-40"
            >
              Anterior
            </button>
            <span className="flex items-center px-3 text-xs text-text-muted">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:bg-card-hover disabled:opacity-40"
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
