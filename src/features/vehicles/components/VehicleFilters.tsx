import { useState } from 'react'

interface VehicleFiltersProps {
  onSearch: (status: string) => void
}

export function VehicleFilters({ onSearch }: VehicleFiltersProps) {
  const [status, setStatus] = useState('')

  function handleChange(value: string) {
    setStatus(value)
    onSearch(value)
  }

  return (
    <div className="flex items-center gap-3">
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value)}
        className="h-9 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:border-primary"
      >
        <option value="">Todos os status</option>
        <option value="0">Ativo</option>
        <option value="1">Inativo</option>
        <option value="2">Manutenção</option>
      </select>
    </div>
  )
}
