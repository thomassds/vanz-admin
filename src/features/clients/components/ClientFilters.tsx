import { useState } from 'react'
import { formatTaxIdentifier } from '@/shared/utils/taxIdentifier'

interface FilterValues {
  name: string
  taxIdentifier: string
  status: string
}

interface ClientFiltersProps {
  onFilter: (filters: FilterValues) => void
}

export function ClientFilters({ onFilter }: ClientFiltersProps) {
  const [name, setName] = useState('')
  const [taxIdentifier, setTaxIdentifier] = useState('')
  const [status, setStatus] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFilter({ name, taxIdentifier, status })
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value)
    onFilter({ name, taxIdentifier, status: e.target.value })
  }

  const handleClear = () => {
    setName('')
    setTaxIdentifier('')
    setStatus('')
    onFilter({ name: '', taxIdentifier: '', status: '' })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-end gap-3 border-b border-gray-200 px-4 py-4"
    >
      <div className="flex min-w-[160px] flex-1 flex-col gap-1">
        <label className="text-xs font-semibold text-gray-600">Nome</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Buscar por nome..."
          className="h-9 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-primary"
        />
      </div>

      <div className="flex min-w-[160px] flex-1 flex-col gap-1">
        <label className="text-xs font-semibold text-gray-600">CPF / CNPJ</label>
        <input
          type="text"
          value={taxIdentifier}
          onChange={(e) => setTaxIdentifier(formatTaxIdentifier(e.target.value))}
          placeholder="000.000.000-00"
          className="h-9 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-primary"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-600">Status</label>
        <select
          value={status}
          onChange={handleStatusChange}
          className="h-9 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:border-primary"
        >
          <option value="">Todos</option>
          <option value="active">Ativo</option>
          <option value="inactive">Inativo</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
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
    </form>
  )
}
