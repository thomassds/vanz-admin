import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Toast } from '@/shared/components/Toast'
import { useToast } from '@/shared/hooks/useToast'
import { ReceivableFilters } from '../components/ReceivableFilters'
import { ReceivablesTable } from '../components/ReceivablesTable'
import { ReceivableFormModal } from '../components/ReceivableFormModal'
import { useGetReceivablesQuery } from '../store/receivablesApi'
import type { Receivable } from '../types/receivable.types'

const LIMIT = 10

interface Filters {
  contractId: string
  status: string
  dueDateFrom: string
  dueDateTo: string
}

function getCurrentMonthRange(): { firstDay: string; lastDay: string } {
  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  const toISO = (d: Date) => d.toISOString().slice(0, 10)
  return { firstDay: toISO(firstDay), lastDay: toISO(lastDay) }
}

export default function ReceivablesPage() {
  const [searchParams] = useSearchParams()
  const initialContractId = searchParams.get('contractId') ?? ''

  const { firstDay, lastDay } = getCurrentMonthRange()

  const { toast, showToast, dismissToast } = useToast()
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<Filters>({
    contractId: initialContractId,
    status: '',
    dueDateFrom: firstDay,
    dueDateTo: lastDay,
  })
  const [modal, setModal] = useState<{ isOpen: boolean; receivable?: Receivable }>({
    isOpen: false,
  })

  const { data, isLoading, isFetching, isError, refetch } = useGetReceivablesQuery({
    page,
    limit: LIMIT,
    ...(filters.contractId ? { contractId: filters.contractId } : {}),
    ...(filters.status !== '' ? { status: parseInt(filters.status, 10) } : {}),
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
          Recebíveis
        </h2>
        <button
          type="button"
          onClick={() => setModal({ isOpen: true })}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          + Novo recebível
        </button>
      </div>

      <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <ReceivableFilters
          initialContractId={initialContractId}
          initialDueDateFrom={firstDay}
          initialDueDateTo={lastDay}
          onSearch={handleSearch}
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <ReceivablesTable
          receivables={data?.items}
          total={data?.total ?? 0}
          page={page}
          limit={LIMIT}
          isLoading={isLoading || isFetching}
          isError={isError}
          onRefetch={refetch}
          onPageChange={setPage}
          onEdit={(r) => setModal({ isOpen: true, receivable: r })}
          onSuccess={(msg) => showToast(msg, 'success')}
        />
      </div>

      <ReceivableFormModal
        isOpen={modal.isOpen}
        receivable={modal.receivable}
        onClose={() => setModal({ isOpen: false })}
        onSuccess={(msg) => {
          setModal({ isOpen: false })
          showToast(msg, 'success')
        }}
      />
    </div>
  )
}
