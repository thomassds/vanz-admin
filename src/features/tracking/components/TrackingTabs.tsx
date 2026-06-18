import { NavLink } from 'react-router-dom'
import { cn } from '@/shared/utils/cn'

export function TrackingTabs() {
  const base = 'rounded-md px-4 py-2 text-sm font-medium transition-colors'
  const active = 'bg-primary text-white'
  const inactive = 'border border-gray-200 text-gray-600 hover:bg-gray-100'

  return (
    <div className="mb-6 flex gap-2">
      <NavLink
        to="/tracking"
        end
        className={({ isActive }) => cn(base, isActive ? active : inactive)}
      >
        Dispositivos
      </NavLink>
      <NavLink
        to="/tracking/map"
        className={({ isActive }) => cn(base, isActive ? active : inactive)}
      >
        Mapa
      </NavLink>
    </div>
  )
}
