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

      <div className="mb-6 flex items-center justify-between gap-3">
        <header>
          <h2 className="font-heading text-2xl font-bold text-text">Veículos</h2>
          <p className="mt-1 text-sm text-text-muted">
            Gerencie a frota e as revisões
          </p>
        </header>
        <button
          type="button"
          onClick={() => setModal({ isOpen: true })}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-primary/25 transition-all hover:bg-primary-hover"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4">
            <path fill="currentColor" d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z" />
          </svg>
          Novo veículo
        </button>
      </div>

      <div className="mb-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
        <VehicleFilters onSearch={handleStatusChange} />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
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
