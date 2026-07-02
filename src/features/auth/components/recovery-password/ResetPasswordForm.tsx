import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { resetPasswordSchema } from '../../schemas/recovery-password.schema'
import type { ResetPasswordFormData } from '../../schemas/recovery-password.schema'
import { useRecoveryPasswordMutation } from '../../store/authApi'
import { getAuthErrorMessage } from '../../utils/authErrorMessages'
import { cn } from '@/shared/utils/cn'
import type { ApiError } from '@/shared/types/api.types'

interface ResetPasswordFormProps {
  userId: string
  code: string
  onSuccess: () => void
}

export function ResetPasswordForm({ userId, code, onSuccess }: ResetPasswordFormProps) {
  const [recoveryPassword, { isLoading }] = useRecoveryPasswordMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const handleResetPassword = async (values: ResetPasswordFormData) => {
    try {
      await recoveryPassword({ userId, type: 'email', code, password: values.password }).unwrap()
      onSuccess()
    } catch (err) {
      const apiError = err as ApiError
      setError('root', { message: getAuthErrorMessage(apiError.code) })
    }
  }

  return (
    <form
      onSubmit={handleSubmit(handleResetPassword)}
      className="mt-7 grid gap-4"
      noValidate
    >
      <div className="grid gap-1">
        <label htmlFor="password" className="text-xs font-bold uppercase tracking-wide text-text-muted">
          Nova senha
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
        {isLoading ? 'Salvando...' : 'Redefinir senha'}
      </button>
    </form>
  )
}
