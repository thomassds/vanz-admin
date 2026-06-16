import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { requestCodeSchema } from '../../schemas/recovery-password.schema'
import type { RequestCodeFormData } from '../../schemas/recovery-password.schema'
import { useRequestCodeMutation } from '../../store/authApi'
import { getAuthErrorMessage } from '../../utils/authErrorMessages'
import { cn } from '@/shared/utils/cn'
import type { ApiError } from '@/shared/types/api.types'

interface RequestCodeFormProps {
  onSuccess: (data: { email: string; userId: string }) => void
}

export function RequestCodeForm({ onSuccess }: RequestCodeFormProps) {
  const [requestCode, { isLoading }] = useRequestCodeMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RequestCodeFormData>({
    resolver: zodResolver(requestCodeSchema),
  })

  const handleRequestCode = async (values: RequestCodeFormData) => {
    try {
      const { userId } = await requestCode({ email: values.email, channel: 'email' }).unwrap()
      onSuccess({ email: values.email, userId })
    } catch (err) {
      const apiError = err as ApiError
      setError('root', { message: getAuthErrorMessage(apiError.code) })
    }
  }

  return (
    <form
      onSubmit={handleSubmit(handleRequestCode)}
      className="mt-6 grid gap-3 px-0 lg:px-6"
      noValidate
    >
      <div className="grid gap-1">
        <label htmlFor="email" className="font-['Noto_Sans',sans-serif] text-xs font-bold text-[#8994a9]">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Digite seu email cadastrado"
          autoComplete="email"
          className={cn(
            "h-[34px] w-full rounded-[4px] border bg-white px-[10px] font-['Noto_Sans',sans-serif] text-xs text-[#8994a9] outline-none transition-colors focus:border-[#70c9ec]",
            errors.email ? 'border-red-400' : 'border-[#8994a9]',
          )}
          {...register('email')}
        />
        {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
      </div>

      {errors.root && <p className="text-center text-xs text-red-500">{errors.root.message}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-6 h-10 w-[150px] justify-self-center rounded-[5px] bg-[#00c8ff] font-['Noto_Sans',sans-serif] text-xs font-bold tracking-[0.03em] text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? 'Enviando...' : 'ENVIAR CÓDIGO'}
      </button>
    </form>
  )
}
