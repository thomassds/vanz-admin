import { NavLink } from 'react-router-dom'
import { cn } from '@/shared/utils/cn'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { closeSidebar, selectIsSidebarOpen } from '@/shared/store/uiSlice'

interface NavItem {
  label: string
  to: string
  icon: 'home' | 'users' | 'file' | 'wallet' | 'receipt' | 'truck' | 'location'
  end?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Mapa ao vivo', to: '/', icon: 'location', end: true },
  { label: 'Dashboard', to: '/dashboard', icon: 'home' },
  { label: 'Clientes', to: '/clients', icon: 'users' },
  { label: 'Contratos', to: '/contracts', icon: 'file' },
  { label: 'Veículos', to: '/vehicles', icon: 'truck' },
  { label: 'Rastreamento', to: '/tracking', icon: 'location' },
  { label: 'Contas a receber', to: '/finances/receivables', icon: 'wallet' },
  { label: 'Contas a pagar', to: '/finances/payables', icon: 'receipt' },
]

function NavIcon({ type }: { type: NavItem['icon'] }) {
  if (type === 'home') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0">
        <path fill="currentColor" d="M12 3 3 10v11h6v-6h6v6h6V10l-9-7Z" />
      </svg>
    )
  }
  if (type === 'users') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0">
        <path
          fill="currentColor"
          d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4 0-7 2-7 4.5V20h14v-2.5c0-2.5-3-4.5-7-4.5Zm9-3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 2c-1 0-1.94.18-2.78.49 1.71 1 2.78 2.45 2.78 4.01V20h5v-2.5c0-2.5-2.5-4.5-5-4.5Z"
        />
      </svg>
    )
  }
  if (type === 'file') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0">
        <path fill="currentColor" d="M6 2h9l5 5v15H6V2Zm8 1.5V8h4.5L14 3.5ZM8 12h8v1.5H8V12Zm0 4h8v1.5H8V16Z" />
      </svg>
    )
  }
  if (type === 'location') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0">
        <path
          fill="currentColor"
          d="M12 2a7 7 0 0 1 7 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 0 1 7-7Zm0 4.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"
        />
      </svg>
    )
  }
  if (type === 'truck') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0">
        <path
          fill="currentColor"
          d="M1 3h15v13H1V3Zm16 3h3.5L23 9.5V16h-6V6Zm-2 11a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm9 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
        />
      </svg>
    )
  }
  if (type === 'receipt') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0">
        <path
          fill="currentColor"
          d="M5 2h14v20l-3-2-2 2-2-2-2 2-2-2-3 2V2Zm2 4h10v1.5H7V6Zm0 4h10v1.5H7V10Zm0 4h6v1.5H7V14Z"
        />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0">
      <path
        fill="currentColor"
        d="M3 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1H3V6Zm0 3h18v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Zm12 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"
      />
    </svg>
  )
}

export function Sidebar() {
  const isOpen = useAppSelector(selectIsSidebarOpen)
  const dispatch = useAppDispatch()

  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      dispatch(closeSidebar())
    }
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => dispatch(closeSidebar())}
          aria-hidden="true"
        />
      )}

      <nav
        aria-label="Navegação principal"
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-border bg-card pt-16 transition-transform duration-200 md:static md:translate-x-0 md:pt-0 md:transition-[width]',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          isOpen ? 'md:w-60' : 'md:w-[72px]',
        )}
      >
        <ul className="mt-4 flex flex-col gap-1 px-3">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  cn(
                    'relative flex items-center gap-3 rounded-xl px-3 py-2.5 font-body text-sm font-medium text-text-muted transition-all hover:bg-card-hover hover:text-text',
                    isActive &&
                      'bg-primary-soft font-bold text-primary hover:bg-primary-soft hover:text-primary before:absolute before:left-0 before:top-1/2 before:h-5 before:w-1 before:-translate-y-1/2 before:rounded-r-full before:bg-primary',
                    !isOpen && 'md:justify-center md:before:hidden',
                  )
                }
              >
                <NavIcon type={item.icon} />
                <span className={cn(!isOpen && 'md:hidden')}>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="mt-auto px-3 pb-4">
          <div
            className={cn(
              'rounded-lg bg-primary-soft p-3 text-xs text-text-muted',
              !isOpen && 'md:hidden',
            )}
          >
            <p className="font-heading font-bold text-primary">Vanz</p>
            <p className="mt-0.5">Gestão de transporte escolar</p>
          </div>
        </div>
      </nav>
    </>
  )
}
