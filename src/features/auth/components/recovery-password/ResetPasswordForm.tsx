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
      className="mt-6 grid gap-3 px-0 lg:px-6"
      noValidate
    >
      <div className="grid gap-1">
        <label htmlFor="password" className="font-['Noto_Sans',sans-serif] text-xs font-bold text-[#8994a9]">
          Nova senha
        </label>
        <input
          id="password"
          type="password"
          placeholder="***************"
          autoComplete="new-password"
          className={cn(
            "h-[34px] w-full rounded-[4px] border bg-white px-[10px] font-['Noto_Sans',sans-serif] text-xs text-[#8994a9] outline-none transition-colors focus:border-[#70c9ec]",
            errors.password ? 'border-red-400' : 'border-[#8994a9]',
          )}
          {...register('password')}
        />
        {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
      </div>

      <div className="grid gap-1">
        <label htmlFor="confirmPassword" className="font-['Noto_Sans',sans-serif] text-xs font-bold text-[#8994a9]">
          Confirmar senha
        </label>
        <input
          id="confirmPassword"
          type="password"
          placeholder="***************"
          autoComplete="new-password"
          className={cn(
            "h-[34px] w-full rounded-[4px] border bg-white px-[10px] font-['Noto_Sans',sans-serif] text-xs text-[#8994a9] outline-none transition-colors focus:border-[#70c9ec]",
            errors.confirmPassword ? 'border-red-400' : 'border-[#8994a9]',
          )}
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <span className="text-xs text-red-500">{errors.confirmPassword.message}</span>
        )}
      </div>

      {errors.root && <p className="text-center text-xs text-red-500">{errors.root.message}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-6 h-10 w-[150px] justify-self-center rounded-[5px] bg-[#00c8ff] font-['Noto_Sans',sans-serif] text-xs font-bold tracking-[0.03em] text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? 'Salvando...' : 'REDEFINIR SENHA'}
      </button>
    </form>
  )
}
