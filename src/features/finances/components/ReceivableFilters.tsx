import { useState } from 'react'
import { useGetContractsQuery } from '@/features/contracts/store/contractsApi'
import { maskDateBR, brToISO, isoToBR } from '@/shared/utils/date'

interface FilterValues {
  contractId: string
  status: string
  dueDateFrom: string
  dueDateTo: string
}

interface ReceivableFiltersProps {
  initialContractId?: string
  initialDueDateFrom?: string
  initialDueDateTo?: string
  onSearch: (filters: FilterValues) => void
}

export function ReceivableFilters({
  initialContractId = '',
  initialDueDateFrom = '',
  initialDueDateTo = '',
  onSearch,
}: ReceivableFiltersProps) {
  const [contractId, setContractId] = useState(initialContractId)
  const [status, setStatus] = useState('')
  const [dueDateFrom, setDueDateFrom] = useState(initialDueDateFrom ? isoToBR(initialDueDateFrom) : '')
  const [dueDateTo, setDueDateTo] = useState(initialDueDateTo ? isoToBR(initialDueDateTo) : '')

  const { data: contractsData } = useGetContractsQuery({ page: 1, limit: 100 })


  function handleSearch() {
    onSearch({
      contractId,
      status,
      dueDateFrom: dueDateFrom.length === 10 ? brToISO(dueDateFrom) : '',
      dueDateTo: dueDateTo.length === 10 ? brToISO(dueDateTo) : '',
    })
  }

  function handleClear() {
    setContractId('')
    setStatus('')
    setDueDateFrom('')
    setDueDateTo('')
    onSearch({ contractId: '', status: '', dueDateFrom: '', dueDateTo: '' })
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="grid gap-1">
        <label className="text-xs font-semibold text-gray-600">Contrato</label>
        <select
          value={contractId}
          onChange={(e) => setContractId(e.target.value)}
          className="h-9 min-w-[200px] rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:border-primary"
        >
          <option value="">Todos os contratos</option>
          {contractsData?.items.map((c) => (
            <option key={c.id} value={c.id}>
              {c.client?.name ?? c.id}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-1">
        <label className="text-xs font-semibold text-gray-600">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-9 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:border-primary"
        >
          <option value="">Todos</option>
          <option value="0">Pendente</option>
          <option value="1">Cobrado</option>
          <option value="2">Pago</option>
          <option value="3">Vencido</option>
          <option value="4">Cancelado</option>
        </select>
      </div>

      <div className="grid gap-1">
        <label className="text-xs font-semibold text-gray-600">Vencimento de</label>
        <input
          type="text"
          placeholder="dd/mm/aaaa"
          value={dueDateFrom}
          onChange={(e) => setDueDateFrom(maskDateBR(e.target.value))}
          className="h-9 w-32 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-primary"
        />
      </div>

      <div className="grid gap-1">
        <label className="text-xs font-semibold text-gray-600">Vencimento até</label>
        <input
          type="text"
          placeholder="dd/mm/aaaa"
          value={dueDateTo}
          onChange={(e) => setDueDateTo(maskDateBR(e.target.value))}
          className="h-9 w-32 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-primary"
        />
      </div>

      <button
        type="button"
        onClick={handleSearch}
        className="h-9 rounded-md bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-hover"
      >
        Buscar
      </button>

      <button
        type="button"
        onClick={handleClear}
        className="h-9 rounded-md border border-gray-200 px-4 text-sm font-medium text-gray-600 hover:bg-gray-100"
      >
        Limpar
      </button>
    </div>
  )
}
