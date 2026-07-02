import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { accountSchema } from '../../schemas/onboarding.schema'
import type { AccountFormData } from '../../schemas/onboarding.schema'
import { useOnboardingMutation } from '../../store/authApi'
import { getAuthErrorMessage } from '../../utils/authErrorMessages'
import { cn } from '@/shared/utils/cn'
import type { ApiError } from '@/shared/types/api.types'

interface AccountFormProps {
  onSuccess: (data: { name: string; email: string; password: string; userId: string }) => void
}

export function AccountForm({ onSuccess }: AccountFormProps) {
  const [onboarding, { isLoading }] = useOnboardingMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
  })

  const handleAccount = async (values: AccountFormData) => {
    try {
      const { userId } = await onboarding({
        name: values.name,
        email: values.email,
        password: values.password,
      }).unwrap()
      onSuccess({ name: values.name, email: values.email, password: values.password, userId })
    } catch (err) {
      const apiError = err as ApiError
      setError('root', { message: getAuthErrorMessage(apiError.code) })
    }
  }

  return (
    <form onSubmit={handleSubmit(handleAccount)} className="mt-7 grid gap-4" noValidate>
      <div className="grid gap-1">
        <label htmlFor="name" className="text-xs font-bold uppercase tracking-wide text-text-muted">
          Nome
        </label>
        <input
          id="name"
          type="text"
          placeholder="Digite seu nome completo"
          autoComplete="name"
          className={cn(
            "h-11 w-full rounded-xl border bg-input px-4 text-sm text-text placeholder:text-text-subtle outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20",
            errors.name ? 'border-danger' : 'border-border',
          )}
          {...register('name')}
        />
        {errors.name && <span className="text-xs text-danger">{errors.name.message}</span>}
      </div>

      <div className="grid gap-1">
        <label htmlFor="email" className="text-xs font-bold uppercase tracking-wide text-text-muted">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Digite seu email de acesso"
          autoComplete="email"
          className={cn(
            "h-11 w-full rounded-xl border bg-input px-4 text-sm text-text placeholder:text-text-subtle outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20",
            errors.email ? 'border-danger' : 'border-border',
          )}
          {...register('email')}
        />
        {errors.email && <span className="text-xs text-danger">{errors.email.message}</span>}
      </div>

      <div className="grid gap-1">
        <label htmlFor="password" className="text-xs font-bold uppercase tracking-wide text-text-muted">
          Senha
        </label>
        <input
          id="password"
          type="password"
          placeholder="***************"
          autoComplete="new-password"
          className={cn(
            "h-11 w-full rounded-xl border bg-input px-4 text-sm text-text placeholder:text-text-subtle outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20",
            errors.password ? 'border-danger' : 'border-border',
          )}
          {...register('password')}
        />
        {errors.password && <span className="text-xs text-danger">{errors.password.message}</span>}
      </div>

      <div className="grid gap-1">
        <label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-wide text-text-muted">
          Confirmar senha
        </label>
        <input
          id="confirmPassword"
          type="password"
          placeholder="***************"
          autoComplete="new-password"
          className={cn(
            "h-11 w-full rounded-xl border bg-input px-4 text-sm text-text placeholder:text-text-subtle outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20",
            errors.confirmPassword ? 'border-danger' : 'border-border',
          )}
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <span className="text-xs text-danger">{errors.confirmPassword.message}</span>
        )}
      </div>

      {errors.root && <p className="text-center text-xs text-danger">{errors.root.message}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-4 h-11 w-full rounded-xl bg-primary font-heading text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover hover:shadow-primary/35 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? 'Enviando...' : 'Continuar'}
      </button>
    </form>
  )
}
