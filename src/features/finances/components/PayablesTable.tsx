import { PayableStatusBadge } from './PayableStatusBadge'
import { getPayableCategoryLabel } from '../utils/payableCategory'
import { isTerminalPayableStatus } from '../utils/payableStatus'
import { isoToBR } from '@/shared/utils/date'
import type { Payable } from '../types/payable.types'

interface PayablesTableProps {
  payables: Payable[] | undefined
  total: number
  page: number
  limit: number
  isLoading: boolean
  isError: boolean
  onRefetch: () => void
  onPageChange: (page: number) => void
  onEdit: (payable: Payable) => void
}

const SKELETON_ROWS = 6

function formatCurrency(value: string): string {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function PayablesTable({
  payables,
  total,
  page,
  limit,
  isLoading,
  isError,
  onRefetch,
  onPageChange,
  onEdit,
}: PayablesTableProps) {
  const totalPages = Math.ceil(total / limit)

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-sm text-gray-600">Erro ao carregar despesas.</p>
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
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Vencimento</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Categoria</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Descrição</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Valor</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Ações</th>
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
              : payables?.map((p) => {
                  const terminal = isTerminalPayableStatus(p.status)
                  return (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-600">{isoToBR(p.dueDate.slice(0, 10))}</td>
                      <td className="px-4 py-3 text-gray-900">{getPayableCategoryLabel(p.category)}</td>
                      <td className="max-w-[180px] truncate px-4 py-3 text-gray-500">
                        {p.description ?? '—'}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{formatCurrency(p.value)}</td>
                      <td className="px-4 py-3">
                        <PayableStatusBadge status={p.status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        {!terminal && (
                          <button
                            type="button"
                            onClick={() => onEdit(p)}
                            className="text-xs font-medium text-primary hover:underline"
                          >
                            Editar
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
          </tbody>
        </table>
      </div>

      {!isLoading && payables?.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <p className="text-sm text-gray-600">Nenhuma despesa encontrada.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
          <span className="text-xs text-gray-500">
            {total} despesa{total !== 1 ? 's' : ''}
          </span>
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
