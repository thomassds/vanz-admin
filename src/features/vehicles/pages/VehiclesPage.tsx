import { useState } from 'react'
import { Toast } from '@/shared/components/Toast'
import { useToast } from '@/shared/hooks/useToast'
import { VehicleFilters } from '../components/VehicleFilters'
import { VehiclesTable } from '../components/VehiclesTable'
import { VehicleFormModal } from '../components/VehicleFormModal'
import { useGetVehiclesQuery } from '../store/vehiclesApi'
import type { Vehicle } from '../types/vehicle.types'

const LIMIT = 10

export default function VehiclesPage() {
  const { toast, showToast, dismissToast } = useToast()
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [modal, setModal] = useState<{ isOpen: boolean; vehicle?: Vehicle }>({ isOpen: false })

  const { data, isLoading, isFetching, isError, refetch } = useGetVehiclesQuery({
    page,
    limit: LIMIT,
    ...(statusFilter !== '' ? { status: parseInt(statusFilter, 10) as 0 | 1 | 2 } : {}),
  })

  function handleStatusChange(value: string) {
    setStatusFilter(value)
    setPage(1)
  }

  return (
    <div>
      {toast && <Toast {...toast} onDismiss={dismissToast} />}

      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-['Montserrat',sans-serif] text-2xl font-bold text-navy">Veículos</h2>
        <button
          type="button"
          onClick={() => setModal({ isOpen: true })}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          + Novo veículo
        </button>
      </div>

      <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <VehicleFilters onSearch={handleStatusChange} />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <VehiclesTable
          vehicles={data?.items}
          total={data?.total ?? 0}
          page={page}
          limit={LIMIT}
          isLoading={isLoading || isFetching}
          isError={isError}
          onRefetch={refetch}
          onPageChange={setPage}
          onEdit={(v) => setModal({ isOpen: true, vehicle: v })}
        />
      </div>

      <VehicleFormModal
        isOpen={modal.isOpen}
        vehicle={modal.vehicle}
        onClose={() => setModal({ isOpen: false })}
        onSuccess={(msg) => {
          setModal({ isOpen: false })
          showToast(msg, 'success')
        }}
      />
    </div>
  )
}
