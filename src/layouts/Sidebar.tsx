import { NavLink } from 'react-router-dom'
import { cn } from '@/shared/utils/cn'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { closeSidebar, selectIsSidebarOpen } from '@/shared/store/uiSlice'

interface NavItem {
  label: string
  to: string
  icon: 'home' | 'users' | 'file' | 'wallet' | 'receipt'
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: 'home' },
  { label: 'Clientes', to: '/clients', icon: 'users' },
  { label: 'Contratos', to: '/contracts', icon: 'file' },
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
          'fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-navy transition-transform duration-200 md:static md:translate-x-0 md:transition-[width]',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          isOpen ? 'md:w-60' : 'md:w-16',
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-center px-4 font-['Montserrat',sans-serif] text-xl font-bold text-white">
          {isOpen ? 'VANS' : 'V'}
        </div>

        <ul className="mt-2 flex flex-col gap-1 px-3">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-md px-3 py-2.5 font-["Nunito",sans-serif] text-sm font-medium text-gray-400 transition-colors hover:bg-navy-light hover:text-white',
                    isActive && 'bg-navy-light text-primary',
                    !isOpen && 'md:justify-center',
                  )
                }
              >
                <NavIcon type={item.icon} />
                <span className={cn(!isOpen && 'md:hidden')}>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
