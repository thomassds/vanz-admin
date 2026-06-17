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
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-['Montserrat',sans-serif] text-2xl font-bold text-navy">Contratos</h2>
        <button
          type="button"
          onClick={() => void navigate('/contracts/new')}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          + Novo contrato
        </button>
      </div>

      <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <ContractFilters onSearch={handleSearch} />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
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
