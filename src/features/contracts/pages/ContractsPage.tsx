import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ContractFilters } from '../components/ContractFilters'
import { ContractsTable } from '../components/ContractsTable'
import { useGetContractsQuery } from '../store/contractsApi'

const LIMIT = 10

interface Filters {
  status: string
  clientId: string
  dueDateFrom: string
  dueDateTo: string
}

export default function ContractsPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<Filters>({
    status: '',
    clientId: '',
    dueDateFrom: '',
    dueDateTo: '',
  })

  const { data, isLoading, isFetching, isError, refetch } = useGetContractsQuery({
    page,
    limit: LIMIT,
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.clientId ? { clientId: filters.clientId } : {}),
    ...(filters.dueDateFrom ? { dueDateFrom: filters.dueDateFrom } : {}),
    ...(filters.dueDateTo ? { dueDateTo: filters.dueDateTo } : {}),
  })

  function handleSearch(newFilters: Filters) {
    setFilters(newFilters)
    setPage(1)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <header>
          <h2 className="font-heading text-2xl font-bold text-text">Contratos</h2>
          <p className="mt-1 text-sm text-text-muted">
            Acompanhe os contratos de transporte e seus vencimentos
          </p>
        </header>
        <button
          type="button"
          onClick={() => void navigate('/contracts/new')}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-primary/25 transition-all hover:bg-primary-hover"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4">
            <path fill="currentColor" d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z" />
          </svg>
          Novo contrato
        </button>
      </div>

      <div className="mb-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
        <ContractFilters onSearch={handleSearch} />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <ContractsTable
          contracts={data?.items}
          total={data?.total ?? 0}
          page={page}
          limit={LIMIT}
          isLoading={isLoading || isFetching}
          isError={isError}
          onRefetch={refetch}
          onPageChange={setPage}
        />
      </div>
    </div>
  )
}
