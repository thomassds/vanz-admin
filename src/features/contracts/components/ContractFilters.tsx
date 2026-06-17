import { useState } from 'react'
import { useGetClientsQuery } from '@/features/clients/store/clientsApi'
import { maskDateBR, brToISO } from '@/shared/utils/date'

interface FilterValues {
  status: string
  clientId: string
  dueDateFrom: string
  dueDateTo: string
}

interface ContractFiltersProps {
  onSearch: (filters: FilterValues) => void
}

export function ContractFilters({ onSearch }: ContractFiltersProps) {
  const [status, setStatus] = useState('')
  const [clientId, setClientId] = useState('')
  const [dueDateFrom, setDueDateFrom] = useState('')
  const [dueDateTo, setDueDateTo] = useState('')

  const { data: clientsData } = useGetClientsQuery({ page: 1, limit: 100 })

  function handleSearch() {
    onSearch({
      status,
      clientId,
      dueDateFrom: dueDateFrom.length === 10 ? brToISO(dueDateFrom) : '',
      dueDateTo: dueDateTo.length === 10 ? brToISO(dueDateTo) : '',
    })
  }

  function handleClear() {
    setStatus('')
    setClientId('')
    setDueDateFrom('')
    setDueDateTo('')
    onSearch({ status: '', clientId: '', dueDateFrom: '', dueDateTo: '' })
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="grid gap-1">
        <label className="text-xs font-semibold text-gray-600">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-9 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:border-primary"
        >
          <option value="">Todos</option>
          <option value="active">Ativo</option>
          <option value="inactive">Inativo</option>
          <option value="pending">Pendente</option>
        </select>
      </div>

      <div className="grid gap-1">
        <label className="text-xs font-semibold text-gray-600">Cliente</label>
        <select
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          className="h-9 min-w-[180px] rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:border-primary"
        >
          <option value="">Todos os clientes</option>
          {clientsData?.items.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
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
