import { useState } from 'react'
import { Toast } from '@/shared/components/Toast'
import { useToast } from '@/shared/hooks/useToast'
import { PayableFilters } from '../components/PayableFilters'
import { PayablesTable } from '../components/PayablesTable'
import { PayableFormModal } from '../components/PayableFormModal'
import { useGetPayablesQuery } from '../store/payablesApi'
import type { Payable } from '../types/payable.types'

const LIMIT = 10

interface Filters {
  status: string
  category: string
  contractId: string
  vehicleId: string
  dueDateFrom: string
  dueDateTo: string
}

export default function PayablesPage() {
  const { toast, showToast, dismissToast } = useToast()
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<Filters>({
    status: '',
    category: '',
    contractId: '',
    vehicleId: '',
    dueDateFrom: '',
    dueDateTo: '',
  })
  const [modal, setModal] = useState<{ isOpen: boolean; payable?: Payable }>({
    isOpen: false,
  })

  const { data, isLoading, isFetching, isError, refetch } = useGetPayablesQuery({
    page,
    limit: LIMIT,
    ...(filters.status !== '' ? { status: parseInt(filters.status, 10) } : {}),
    ...(filters.category !== '' ? { category: parseInt(filters.category, 10) } : {}),
    ...(filters.contractId ? { contractId: filters.contractId } : {}),
    ...(filters.vehicleId ? { vehicleId: filters.vehicleId } : {}),
    ...(filters.dueDateFrom ? { dueDateFrom: filters.dueDateFrom } : {}),
    ...(filters.dueDateTo ? { dueDateTo: filters.dueDateTo } : {}),
  })

  function handleSearch(newFilters: Filters) {
    setFilters(newFilters)
    setPage(1)
  }

  return (
    <div>
      {toast && <Toast {...toast} onDismiss={dismissToast} />}

      <div className="mb-6 flex items-center justify-between gap-3">
        <header>
          <h2 className="font-heading text-2xl font-bold text-text">Contas a pagar</h2>
          <p className="mt-1 text-sm text-text-muted">
            Controle as despesas da operação
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
          Nova despesa
        </button>
      </div>

      <div className="mb-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
        <PayableFilters onSearch={handleSearch} />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <PayablesTable
          payables={data?.items}
          total={data?.total ?? 0}
          page={page}
          limit={LIMIT}
          isLoading={isLoading || isFetching}
          isError={isError}
          onRefetch={refetch}
          onPageChange={setPage}
          onEdit={(p) => setModal({ isOpen: true, payable: p })}
        />
      </div>

      <PayableFormModal
        isOpen={modal.isOpen}
        payable={modal.payable}
        onClose={() => setModal({ isOpen: false })}
        onSuccess={(msg) => {
          setModal({ isOpen: false })
          showToast(msg, 'success')
        }}
      />
    </div>
  )
}
