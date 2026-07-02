import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@/app/hooks'
import { loginSchema } from '../schemas/login.schema'
import type { LoginFormData } from '../schemas/login.schema'
import { useLoginMutation } from '../store/authApi'
import { setCredentials } from '../store/authSlice'
import { getAuthErrorMessage } from '../utils/authErrorMessages'
import { cn } from '@/shared/utils/cn'
import type { ApiError } from '@/shared/types/api.types'

export function LoginForm() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [login, { isLoading }] = useLoginMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const handleLogin = async (data: LoginFormData) => {
    try {
      const result = await login(data).unwrap()
      const { user } = result

      if (!user.validatedEmailAt) {
        void navigate('/onboarding', {
          state: {
            resumeStep: 'email-code',
            userId: user.id,
            email: data.email,
            password: data.password,
          },
        })
        return
      }

      if (!user.taxIdentifier) {
        void navigate('/onboarding', {
          state: {
            resumeStep: 'personal-data',
            userId: user.id,
            email: data.email,
            password: data.password,
          },
        })
        return
      }

      if (!user.validatedPhoneAt) {
        void navigate('/onboarding', {
          state: {
            resumeStep: 'phone-code',
            userId: user.id,
            email: data.email,
            password: data.password,
            phone: user.phone ?? undefined,
          },
        })
        return
      }

      if (!result.tenant) {
        void navigate('/onboarding', {
          state: {
            resumeStep: 'company-data',
            userId: user.id,
            email: data.email,
            password: data.password,
          },
        })
        return
      }

      dispatch(setCredentials(result))
      void navigate('/dashboard')
    } catch (err) {
      const apiError = err as ApiError
      setError('root', { message: getAuthErrorMessage(apiError.code) })
    }
  }

  return (
    <form
      onSubmit={handleSubmit(handleLogin)}
      className="mt-7 grid gap-4"
      noValidate
    >
      <div className="grid gap-1.5">
        <label
          htmlFor="email"
          className="text-xs font-bold uppercase tracking-wide text-text-muted"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Digite seu email de acesso"
          autoComplete="email"
          className={cn(
            'h-11 w-full rounded-xl border bg-input px-4 text-sm text-text placeholder:text-text-subtle outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20',
            errors.email ? 'border-danger' : 'border-border',
          )}
          {...register('email')}
        />
        {errors.email && (
          <span className="text-xs text-danger">{errors.email.message}</span>
        )}
      </div>

      <div className="grid gap-1.5">
        <label
          htmlFor="password"
          className="text-xs font-bold uppercase tracking-wide text-text-muted"
        >
          Senha
        </label>
        <input
          id="password"
          type="password"
          placeholder="Digite sua senha"
          autoComplete="current-password"
          className={cn(
            'h-11 w-full rounded-xl border bg-input px-4 text-sm text-text placeholder:text-text-subtle outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20',
            errors.password ? 'border-danger' : 'border-border',
          )}
          {...register('password')}
        />
        {errors.password && (
          <span className="text-xs text-danger">{errors.password.message}</span>
        )}
      </div>

      <div className="mt-0.5 flex items-center justify-between gap-2.5">
        <label
          htmlFor="remember"
          className="inline-flex items-center gap-2 text-xs font-medium text-text-muted"
        >
          <input
            id="remember"
            type="checkbox"
            className="h-4 w-4 rounded border border-border accent-primary"
          />
          <span>Lembrar de mim</span>
        </label>
        <Link
          to="/recovery-password"
          className="text-xs font-bold text-primary transition-colors hover:text-primary-hover"
        >
          Esqueci minha senha
        </Link>
      </div>

      {errors.root && (
        <p className="rounded-xl bg-danger-soft px-4 py-3 text-center text-xs font-semibold text-danger">
          {errors.root.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-3 h-11 w-full rounded-xl bg-primary font-heading text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover hover:shadow-primary/35 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  )
}
