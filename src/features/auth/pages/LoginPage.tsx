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
        <h2 className="m-0 font-heading text-3xl font-extrabold tracking-tight text-text">
          Bem-vindo
        </h2>
        <p className="mt-2 text-sm text-text-muted">
          Faça login para continuar
        </p>
      </header>

      {successMessage && (
        <p className="mt-4 rounded-xl bg-success-soft px-4 py-3 text-xs font-semibold text-success">
          {successMessage}
        </p>
      )}

      <LoginForm />

      <footer className="mt-8 space-y-4">
        <p className="text-center text-sm text-text-muted">
          Não tem conta?{' '}
          <Link
            to="/onboarding"
            className="font-bold text-primary transition-colors hover:text-primary-hover"
          >
            Criar conta
          </Link>
        </p>

        <div className="flex items-center justify-center gap-2 text-text-subtle">
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0">
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
