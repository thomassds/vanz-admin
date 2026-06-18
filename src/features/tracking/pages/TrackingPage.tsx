import { useState } from 'react'
import { Toast } from '@/shared/components/Toast'
import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import { useToast } from '@/shared/hooks/useToast'
import { useGetVehiclesQuery } from '@/features/vehicles/store/vehiclesApi'
import { useGetDevicesQuery, useDeleteDeviceMutation } from '../store/trackingApi'
import { getDeviceErrorMessage } from '../utils/deviceErrors'
import { DevicesTable } from '../components/DevicesTable'
import { CreateDeviceModal } from '../components/CreateDeviceModal'
import { TrackingTabs } from '../components/TrackingTabs'
import type { Device } from '../types/device.types'
import type { ApiError } from '@/shared/types/api.types'

const LIMIT = 10

export default function TrackingPage() {
  const { toast, showToast, dismissToast } = useToast()
  const [page, setPage] = useState(1)
  const [vehicleFilter, setVehicleFilter] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Device | null>(null)

  const { data: vehiclesData } = useGetVehiclesQuery({ page: 1, limit: 100 })

  const { data, isLoading, isFetching, isError, refetch } = useGetDevicesQuery({
    page,
    limit: LIMIT,
    ...(vehicleFilter ? { vehicleId: vehicleFilter } : {}),
  })

  const [deleteDevice, { isLoading: isDeleting }] = useDeleteDeviceMutation()

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await deleteDevice(deleteTarget.id).unwrap()
      setDeleteTarget(null)
      showToast('Dispositivo removido com sucesso.', 'success')
    } catch (err) {
      setDeleteTarget(null)
      showToast(getDeviceErrorMessage((err as ApiError).code), 'error')
    }
  }

  return (
    <div>
      {toast && <Toast {...toast} onDismiss={dismissToast} />}

      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-['Montserrat',sans-serif] text-2xl font-bold text-navy">
          Rastreamento
        </h2>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          + Novo dispositivo
        </button>
      </div>

      <TrackingTabs />

      {/* Filtro */}
      <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="grid gap-1">
            <label className="text-xs font-semibold text-gray-600">Veículo</label>
            <select
              value={vehicleFilter}
              onChange={(e) => { setVehicleFilter(e.target.value); setPage(1) }}
              className="h-9 min-w-[200px] rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:border-primary"
            >
              <option value="">Todos os veículos</option>
              {vehiclesData?.items.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.plate} — {v.model}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <DevicesTable
          devices={data?.items}
          vehicles={vehiclesData?.items}
          total={data?.total ?? 0}
          page={page}
          limit={LIMIT}
          isLoading={isLoading || isFetching}
          isError={isError}
          onRefetch={refetch}
          onPageChange={setPage}
          onDelete={setDeleteTarget}
        />
      </div>

      <CreateDeviceModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={(msg) => {
          setCreateOpen(false)
          showToast(msg, 'success')
        }}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Remover dispositivo"
        description={`Tem certeza que deseja remover o dispositivo "${deleteTarget?.name || deleteTarget?.uniqueId || deleteTarget?.id.slice(0, 8)}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Remover"
        isLoading={isDeleting}
        isDanger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
