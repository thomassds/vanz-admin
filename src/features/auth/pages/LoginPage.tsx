import { Link, useLocation } from 'react-router-dom'
import { AuthLayout } from '@/layouts/AuthLayout'
import { LoginForm } from '../components/LoginForm'

interface LoginPageState {
  successMessage?: string
}

export default function LoginPage() {
  const location = useLocation()
  const { successMessage } = (location.state ?? {}) as LoginPageState

  return (
    <AuthLayout>
      <header>
        <h2 className="m-0 text-center font-['Noto_Sans',sans-serif] text-[2.35rem] font-bold text-[#00c8ff] lg:text-left lg:text-[52px]">
          BEM VINDO
        </h2>
        <p className="mt-1.5 text-center font-['Montserrat',sans-serif] text-[1.02rem] font-semibold text-[#708097] lg:text-left lg:text-base">
          Faça login para continuar
        </p>
      </header>

      {successMessage && (
        <p className="mt-4 text-center text-xs font-bold text-[#1aa15a] lg:text-left">
          {successMessage}
        </p>
      )}

      <LoginForm />

      <footer className="mt-8 space-y-3 lg:px-6">
        <p className="text-center text-xs text-[#708097] lg:text-left">
          Não tem conta?{' '}
          <Link
            to="/onboarding"
            className="font-bold text-[#00c8ff] hover:underline"
          >
            Criar conta
          </Link>
        </p>

        <div className="flex items-center justify-center gap-2 text-sm text-[#708097] lg:justify-start">
          <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0">
            <path
              fill="currentColor"
              d="M12 2 4 5v6c0 5.2 3.4 9.9 8 11 4.6-1.1 8-5.8 8-11V5l-8-3Zm0 4.2a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6Zm2 9h-4v-1.5h.8v-3H10V9.2h3v4.5h1V15.2Z"
            />
          </svg>
          <p className="text-xs">Seus dados estão protegidos</p>
        </div>
      </footer>
    </AuthLayout>
  )
}
