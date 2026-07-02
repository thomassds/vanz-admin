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

      <div className="mb-6 flex items-center justify-between gap-3">
        <header>
          <h2 className="font-heading text-2xl font-bold text-text">Contas a receber</h2>
          <p className="mt-1 text-sm text-text-muted">
            Acompanhe as parcelas e cobranças dos contratos
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
          Novo recebível
        </button>
      </div>

      <div className="mb-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
        <ReceivableFilters
          initialContractId={initialContractId}
          initialDueDateFrom={firstDay}
          initialDueDateTo={lastDay}
          onSearch={handleSearch}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
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
