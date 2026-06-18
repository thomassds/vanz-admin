import { VehicleStatusBadge } from './VehicleStatusBadge'
import { getRevisionAlertLevel } from '../utils/vehicleRevision'
import { isoToBR } from '@/shared/utils/date'
import type { Vehicle } from '../types/vehicle.types'

interface VehiclesTableProps {
  vehicles: Vehicle[] | undefined
  total: number
  page: number
  limit: number
  isLoading: boolean
  isError: boolean
  onRefetch: () => void
  onPageChange: (page: number) => void
  onEdit: (vehicle: Vehicle) => void
}

const SKELETON_ROWS = 6

function RevisionCell({ date }: { date: string | null }) {
  if (!date) return <span className="text-gray-400">—</span>

  const level = getRevisionAlertLevel(date)
  const formatted = isoToBR(date)

  if (level === 'overdue') {
    return (
      <span className="inline-flex items-center gap-1 text-red-600">
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0">
          <path
            fillRule="evenodd"
            d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
        {formatted}
      </span>
    )
  }

  if (level === 'upcoming') {
    return (
      <span className="inline-flex items-center gap-1 text-yellow-600">
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0">
          <path
            fillRule="evenodd"
            d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
        {formatted}
      </span>
    )
  }

  return <span className="text-gray-600">{formatted}</span>
}

export function VehiclesTable({
  vehicles,
  total,
  page,
  limit,
  isLoading,
  isError,
  onRefetch,
  onPageChange,
  onEdit,
}: VehiclesTableProps) {
  const totalPages = Math.ceil(total / limit)

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-sm text-gray-600">Erro ao carregar veículos.</p>
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
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Placa</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Modelo</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Ano</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Capacidade</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Próx. Revisão</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading
              ? Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 animate-pulse rounded bg-gray-200" />
                      </td>
                    ))}
                  </tr>
                ))
              : vehicles?.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{v.plate}</td>
                    <td className="px-4 py-3 text-gray-900">{v.model}</td>
                    <td className="px-4 py-3 text-gray-600">{v.year ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{v.capacity} pax</td>
                    <td className="px-4 py-3">
                      <VehicleStatusBadge status={v.status} />
                    </td>
                    <td className="px-4 py-3">
                      <RevisionCell date={v.nextRevisionAt} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => onEdit(v)}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {!isLoading && vehicles?.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <p className="text-sm text-gray-600">Nenhum veículo encontrado.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
          <span className="text-xs text-gray-500">
            {total} veículo{total !== 1 ? 's' : ''}
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
