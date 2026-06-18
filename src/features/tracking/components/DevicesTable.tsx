import { DeviceStatusBadge } from './DeviceStatusBadge'
import { DeviceTypeBadge } from './DeviceTypeBadge'
import type { Device } from '../types/device.types'
import type { Vehicle } from '@/features/vehicles/types/vehicle.types'

interface DevicesTableProps {
  devices: Device[] | undefined
  vehicles: Vehicle[] | undefined
  total: number
  page: number
  limit: number
  isLoading: boolean
  isError: boolean
  onRefetch: () => void
  onPageChange: (page: number) => void
  onDelete: (device: Device) => void
}

const SKELETON_ROWS = 5

function vehicleLabel(vehicleId: string, vehicles: Vehicle[] | undefined): string {
  const v = vehicles?.find((v) => v.id === vehicleId)
  return v ? `${v.plate} — ${v.model}` : vehicleId.slice(0, 8) + '…'
}

export function DevicesTable({
  devices,
  vehicles,
  total,
  page,
  limit,
  isLoading,
  isError,
  onRefetch,
  onPageChange,
  onDelete,
}: DevicesTableProps) {
  const totalPages = Math.ceil(total / limit)

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-sm text-gray-600">Erro ao carregar dispositivos.</p>
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
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Veículo</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Nome</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Tipo</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading
              ? Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 animate-pulse rounded bg-gray-200" />
                      </td>
                    ))}
                  </tr>
                ))
              : devices?.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {vehicleLabel(d.vehicleId, vehicles)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{d.name || '—'}</td>
                    <td className="px-4 py-3">
                      <DeviceTypeBadge type={d.type} />
                    </td>
                    <td className="px-4 py-3">
                      <DeviceStatusBadge status={d.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => onDelete(d)}
                        className="text-xs font-medium text-danger hover:underline"
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {!isLoading && devices?.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <p className="text-sm text-gray-600">Nenhum dispositivo encontrado.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
          <span className="text-xs text-gray-500">
            {total} dispositivo{total !== 1 ? 's' : ''}
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
