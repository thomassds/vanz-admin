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
      className="mt-7 grid gap-4"
      noValidate
    >
      <div className="grid gap-1">
        <label htmlFor="email" className="text-xs font-bold uppercase tracking-wide text-text-muted">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Digite seu email cadastrado"
          autoComplete="email"
          className={cn(
            "h-11 w-full rounded-xl border bg-input px-4 text-sm text-text placeholder:text-text-subtle outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20",
            errors.email ? 'border-danger' : 'border-border',
          )}
          {...register('email')}
        />
        {errors.email && <span className="text-xs text-danger">{errors.email.message}</span>}
      </div>

      {errors.root && <p className="text-center text-xs text-danger">{errors.root.message}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-4 h-11 w-full rounded-xl bg-primary font-heading text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover hover:shadow-primary/35 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? 'Enviando...' : 'Enviar código'}
      </button>
    </form>
  )
}
