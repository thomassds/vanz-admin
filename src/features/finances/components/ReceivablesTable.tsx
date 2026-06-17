import { useState } from 'react'
import { ReceivableStatusBadge } from './ReceivableStatusBadge'
import { useUpdateReceivableMutation } from '../store/receivablesApi'
import { getAllowedTransitions, getStatusLabel, isTerminalStatus } from '../utils/receivableStatus'
import { isoToBR } from '@/shared/utils/date'
import type { Receivable } from '../types/receivable.types'

interface ReceivablesTableProps {
  receivables: Receivable[] | undefined
  total: number
  page: number
  limit: number
  isLoading: boolean
  isError: boolean
  onRefetch: () => void
  onPageChange: (page: number) => void
  onEdit: (receivable: Receivable) => void
  onSuccess: (msg: string) => void
}

const SKELETON_ROWS = 6

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function ReceivablesTable({
  receivables,
  total,
  page,
  limit,
  isLoading,
  isError,
  onRefetch,
  onPageChange,
  onEdit,
  onSuccess,
}: ReceivablesTableProps) {
  const [changingStatusId, setChangingStatusId] = useState<string | null>(null)
  const [updateReceivable, { isLoading: isUpdating }] = useUpdateReceivableMutation()
  const totalPages = Math.ceil(total / limit)

  async function handleStatusChange(id: string, newStatus: number) {
    await updateReceivable({ id, status: newStatus }).unwrap()
    setChangingStatusId(null)
    onSuccess('Status atualizado com sucesso.')
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-sm text-gray-600">Erro ao carregar recebíveis.</p>
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
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Contrato</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Parcela</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Vencimento</th>
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
              : receivables?.map((r) => {
                  const terminal = isTerminalStatus(r.status)
                  const transitions = getAllowedTransitions(r.status)
                  const isChanging = changingStatusId === r.id

                  return (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {r.contract?.client?.name ?? r.contractId.slice(0, 8)}
                      </td>
                      <td className="px-4 py-3 text-gray-600">#{r.installmentNumber}</td>
                      <td className="px-4 py-3 text-gray-600">{isoToBR(r.dueDate.slice(0, 10))}</td>
                      <td className="px-4 py-3 text-gray-600">{formatCurrency(r.value)}</td>
                      <td className="px-4 py-3">
                        <ReceivableStatusBadge status={r.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {isChanging ? (
                            <div className="flex items-center gap-1">
                              <select
                                autoFocus
                                disabled={isUpdating}
                                defaultValue=""
                                onChange={(e) =>
                                  void handleStatusChange(r.id, parseInt(e.target.value, 10))
                                }
                                className="h-7 rounded border border-gray-200 bg-white px-2 text-xs text-gray-900 outline-none focus:border-primary"
                              >
                                <option value="" disabled>
                                  Selecione
                                </option>
                                {transitions.map((s) => (
                                  <option key={s} value={s}>
                                    {getStatusLabel(s)}
                                  </option>
                                ))}
                              </select>
                              <button
                                type="button"
                                onClick={() => setChangingStatusId(null)}
                                className="text-xs text-gray-400 hover:text-gray-600"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <>
                              <button
                                type="button"
                                disabled={terminal}
                                onClick={() => onEdit(r)}
                                className="text-xs font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                Editar
                              </button>
                              {!terminal && (
                                <button
                                  type="button"
                                  onClick={() => setChangingStatusId(r.id)}
                                  className="text-xs font-medium text-gray-500 hover:underline"
                                >
                                  Alterar status
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
          </tbody>
        </table>
      </div>

      {!isLoading && receivables?.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <p className="text-sm text-gray-600">Nenhum recebível encontrado.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
          <span className="text-xs text-gray-500">
            {total} recebível{total !== 1 ? 'is' : ''}
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
