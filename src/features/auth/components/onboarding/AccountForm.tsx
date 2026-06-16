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
    <form onSubmit={handleSubmit(handleAccount)} className="mt-6 grid gap-3 px-0 lg:px-6" noValidate>
      <div className="grid gap-1">
        <label htmlFor="name" className="font-['Noto_Sans',sans-serif] text-xs font-bold text-[#8994a9]">
          Nome
        </label>
        <input
          id="name"
          type="text"
          placeholder="Digite seu nome completo"
          autoComplete="name"
          className={cn(
            "h-[34px] w-full rounded-[4px] border bg-white px-[10px] font-['Noto_Sans',sans-serif] text-xs text-[#8994a9] outline-none transition-colors focus:border-[#70c9ec]",
            errors.name ? 'border-red-400' : 'border-[#8994a9]',
          )}
          {...register('name')}
        />
        {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
      </div>

      <div className="grid gap-1">
        <label htmlFor="email" className="font-['Noto_Sans',sans-serif] text-xs font-bold text-[#8994a9]">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Digite seu email de acesso"
          autoComplete="email"
          className={cn(
            "h-[34px] w-full rounded-[4px] border bg-white px-[10px] font-['Noto_Sans',sans-serif] text-xs text-[#8994a9] outline-none transition-colors focus:border-[#70c9ec]",
            errors.email ? 'border-red-400' : 'border-[#8994a9]',
          )}
          {...register('email')}
        />
        {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
      </div>

      <div className="grid gap-1">
        <label htmlFor="password" className="font-['Noto_Sans',sans-serif] text-xs font-bold text-[#8994a9]">
          Senha
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
        {isLoading ? 'Enviando...' : 'CONTINUAR'}
      </button>
    </form>
  )
}
