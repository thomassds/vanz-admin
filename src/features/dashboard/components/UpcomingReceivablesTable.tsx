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
  pending: 'bg-gray-100 text-gray-600',
  charged: 'bg-blue-100 text-blue-700',
  overdue: 'bg-red-100 text-red-600',
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
        <p className="text-sm text-gray-600">Erro ao carregar próximos vencimentos.</p>
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
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Cliente</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold text-gray-600 sm:table-cell">
                Parcela
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Vencimento</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Valor</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold text-gray-600 sm:table-cell">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading
              ? Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 animate-pulse rounded bg-gray-200" />
                      </td>
                    ))}
                  </tr>
                ))
              : data?.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-900">{r.clientName}</span>
                      <span className="mt-0.5 block text-xs text-gray-400 sm:hidden">
                        {STATUS_LABELS[r.status] ?? r.status}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 text-gray-600 sm:table-cell">
                      #{r.installmentNumber}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{isoToBR(r.dueDate.slice(0, 10))}</td>
                    <td className="px-4 py-3 text-gray-600">{formatCurrency(r.value)}</td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASS[r.status] ?? 'bg-gray-100 text-gray-600'}`}
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
                        className="text-xs font-medium text-primary hover:underline"
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
          <p className="text-sm text-gray-500">Nenhum vencimento nos próximos 30 dias.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
          <span className="text-xs text-gray-500">{total} recebível{total !== 1 ? 'is' : ''}</span>
          <div className="flex gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40"
            >
              Anterior
            </button>
            <span className="flex items-center px-3 text-xs text-gray-600">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40"
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
