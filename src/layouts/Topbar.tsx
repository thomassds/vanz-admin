import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { logout, selectCurrentUser } from '@/features/auth/store/authSlice'
import { toggleSidebar } from '@/shared/store/uiSlice'
import { cn } from '@/shared/utils/cn'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/clients': 'Clientes',
  '/contracts': 'Contratos',
  '/finances/receivables': 'Recebíveis',
}

function getPageTitle(pathname: string): string {
  const match = Object.keys(PAGE_TITLES).find((path) => pathname.startsWith(path))
  return match ? PAGE_TITLES[match] : ''
}

export function Topbar() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAppSelector(selectCurrentUser)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    void navigate('/login')
  }

  const initial = user?.name?.charAt(0).toUpperCase() ?? '?'

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Alternar menu de navegação"
          onClick={() => dispatch(toggleSidebar())}
          className="flex h-9 w-9 items-center justify-center rounded-md text-navy hover:bg-gray-100"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5">
            <path fill="currentColor" d="M3 6h18v2H3V6Zm0 5h18v2H3v-2Zm0 5h18v2H3v-2Z" />
          </svg>
        </button>
        <h1 className="font-['Montserrat',sans-serif] text-lg font-bold text-navy">
          {getPageTitle(location.pathname)}
        </h1>
      </div>

      <div ref={menuRef} className="relative">
        <button
          type="button"
          onClick={() => setIsMenuOpen((value) => !value)}
          className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-100"
        >
          <span className="hidden font-['Nunito',sans-serif] text-sm font-medium text-gray-900 sm:inline">
            {user?.name}
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-['Montserrat',sans-serif] text-sm font-bold text-white">
            {initial}
          </span>
        </button>

        <div
          className={cn(
            'absolute right-0 mt-2 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-md',
            isMenuOpen ? 'block' : 'hidden',
          )}
        >
          <button
            type="button"
            onClick={handleLogout}
            className="block w-full px-4 py-2 text-left font-['Nunito',sans-serif] text-sm text-gray-600 hover:bg-gray-100"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  )
}
