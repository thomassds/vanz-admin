import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { logout, selectCurrentUser } from '@/features/auth/store/authSlice'
import { selectTheme, toggleSidebar, toggleTheme } from '@/shared/store/uiSlice'
import { cn } from '@/shared/utils/cn'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/clients': 'Clientes',
  '/contracts': 'Contratos',
  '/vehicles': 'Veículos',
  '/tracking': 'Rastreamento',
  '/finances/receivables': 'Contas a receber',
  '/finances/payables': 'Contas a pagar',
  '/design-system': 'Design System',
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
  const theme = useAppSelector(selectTheme)
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
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur-md lg:px-6">
      {/* Logo */}
      <span className="hidden font-heading text-2xl font-extrabold text-primary md:block">
        VANZ
      </span>

      {/* Toggle sidebar */}
      <button
        type="button"
        aria-label="Alternar menu de navegação"
        onClick={() => dispatch(toggleSidebar())}
        className="flex h-9 w-9 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-card-hover md:ml-2"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5">
          <path fill="currentColor" d="M3 6h18v2H3V6Zm0 5h12v2H3v-2Zm0 5h18v2H3v-2Z" />
        </svg>
      </button>

      {/* Título da página */}
      <h1 className="min-w-0 truncate font-heading text-lg font-bold text-text">
        {getPageTitle(location.pathname)}
      </h1>

      <div className="flex-1" />

      {/* Busca (placeholder de feature) */}
      <div className="relative hidden lg:block">
        <svg
          viewBox="0 0 24 24"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle"
        >
          <path
            fill="currentColor"
            d="M10 2a8 8 0 1 0 4.9 14.3l5.4 5.4 1.4-1.4-5.4-5.4A8 8 0 0 0 10 2Zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12Z"
          />
        </svg>
        <input
          type="search"
          placeholder="Buscar..."
          className="h-9 w-56 rounded-full border border-border bg-app pl-9 pr-4 text-sm text-text transition-all placeholder:text-text-subtle focus:w-72 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Toggle de tema */}
      <button
        type="button"
        aria-label={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
        onClick={() => dispatch(toggleTheme())}
        className="flex h-9 w-9 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-card-hover"
      >
        {theme === 'dark' ? (
          <svg viewBox="0 0 24 24" className="h-5 w-5">
            <path
              fill="currentColor"
              d="M12 4V2m0 20v-2m8-8h2M2 12h2m13.66-5.66 1.41-1.41M4.93 19.07l1.41-1.41m0-11.32L4.93 4.93m14.14 14.14-1.41-1.41M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-5 w-5">
            <path
              fill="currentColor"
              d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"
            />
          </svg>
        )}
      </button>

      {/* Notificações (placeholder de feature) */}
      <button
        type="button"
        aria-label="Notificações"
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-card-hover"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5">
          <path
            fill="currentColor"
            d="M12 2a7 7 0 0 0-7 7v4l-2 3v1h18v-1l-2-3V9a7 7 0 0 0-7-7Zm0 20a3 3 0 0 0 3-3H9a3 3 0 0 0 3 3Z"
          />
        </svg>
      </button>

      {/* Menu do usuário */}
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          aria-label="Menu do usuário"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-info font-heading text-sm font-bold text-white shadow-md shadow-primary/25 transition-transform hover:scale-105"
        >
          {initial}
        </button>

        <div
          className={cn(
            'absolute right-0 top-11 z-50 w-56 overflow-hidden rounded-xl border border-border bg-card shadow-xl shadow-black/10',
            !isMenuOpen && 'hidden',
          )}
        >
          <div className="border-b border-border px-4 py-3">
            <p className="truncate text-sm font-bold text-text">{user?.name ?? 'Usuário'}</p>
            <p className="truncate text-xs text-text-muted">{user?.email ?? ''}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsMenuOpen(false)
              void navigate('/subscription')
            }}
            className="w-full border-b border-border px-4 py-3 text-left text-sm text-text transition-colors hover:bg-card-hover"
          >
            Assinatura
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full px-4 py-3 text-left text-sm text-danger transition-colors hover:bg-card-hover"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  )
}
