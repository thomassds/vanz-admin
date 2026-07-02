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
        <p className="text-sm text-text-muted">Erro ao carregar dispositivos.</p>
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
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-subtle">Veículo</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-subtle">Nome</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-subtle">Tipo</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-subtle">Status</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-subtle">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading
              ? Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 animate-pulse rounded bg-card-hover" />
                      </td>
                    ))}
                  </tr>
                ))
              : devices?.map((d) => (
                  <tr key={d.id} className="transition-colors hover:bg-card-hover">
                    <td className="px-4 py-3 font-medium text-text">
                      {vehicleLabel(d.vehicleId, vehicles)}
                    </td>
                    <td className="px-4 py-3 text-text-muted">{d.name || '—'}</td>
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
          <p className="text-sm text-text-muted">Nenhum dispositivo encontrado.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <span className="text-xs text-text-subtle">
            {total} dispositivo{total !== 1 ? 's' : ''}
          </span>
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
