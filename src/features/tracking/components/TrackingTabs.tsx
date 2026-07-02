import { NavLink } from 'react-router-dom'
import { cn } from '@/shared/utils/cn'

export function TrackingTabs() {
  const base = 'rounded-xl px-4 py-2 text-sm font-semibold transition-colors'
  const active = 'bg-primary text-white shadow-sm shadow-primary/25'
  const inactive = 'border border-border text-text-muted hover:bg-card-hover hover:text-text'

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
