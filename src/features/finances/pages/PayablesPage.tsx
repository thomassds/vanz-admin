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

      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-['Montserrat',sans-serif] text-2xl font-bold text-navy">
          Contas a pagar
        </h2>
        <button
          type="button"
          onClick={() => setModal({ isOpen: true })}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          + Nova despesa
        </button>
      </div>

      <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <PayableFilters onSearch={handleSearch} />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
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
