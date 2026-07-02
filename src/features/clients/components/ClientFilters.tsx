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
      className="flex flex-wrap items-end gap-3 border-b border-border px-4 py-4"
    >
      <div className="flex min-w-[160px] flex-1 flex-col gap-1">
        <label className="text-xs font-semibold text-text-muted">Nome</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Buscar por nome..."
          className="h-9 rounded-xl border border-border bg-input px-3 text-sm text-text outline-none transition-all placeholder:text-text-subtle focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="flex min-w-[160px] flex-1 flex-col gap-1">
        <label className="text-xs font-semibold text-text-muted">CPF / CNPJ</label>
        <input
          type="text"
          value={taxIdentifier}
          onChange={(e) => setTaxIdentifier(formatTaxIdentifier(e.target.value))}
          placeholder="000.000.000-00"
          className="h-9 rounded-xl border border-border bg-input px-3 text-sm text-text outline-none transition-all placeholder:text-text-subtle focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-text-muted">Status</label>
        <select
          value={status}
          onChange={handleStatusChange}
          className="h-9 rounded-xl border border-border bg-input px-3 text-sm text-text outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="">Todos</option>
          <option value="active">Ativo</option>
          <option value="inactive">Inativo</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="h-9 rounded-xl bg-primary px-4 text-sm font-bold text-white shadow-sm shadow-primary/25 transition-all hover:bg-primary-hover"
        >
          Buscar
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="h-9 rounded-md border border-border px-4 text-sm font-medium text-text-muted hover:bg-card-hover"
        >
          Limpar
        </button>
      </div>
    </form>
  )
}
