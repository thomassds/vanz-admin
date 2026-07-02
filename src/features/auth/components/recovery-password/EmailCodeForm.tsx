import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { codeSchema } from '../../schemas/onboarding.schema'
import type { CodeFormData } from '../../schemas/onboarding.schema'
import { useValidateCodeMutation, useRequestCodeMutation } from '../../store/authApi'
import { getAuthErrorMessage } from '../../utils/authErrorMessages'
import { useCodeTimer } from '../../hooks/useCodeTimer'
import { cn } from '@/shared/utils/cn'
import type { ApiError } from '@/shared/types/api.types'

interface EmailCodeFormProps {
  userId: string
  email: string
  onSuccess: (code: string) => void
}

export function EmailCodeForm({ userId, email, onSuccess }: EmailCodeFormProps) {
  const [validateCode, { isLoading }] = useValidateCodeMutation()
  const [requestCode, { isLoading: isResending }] = useRequestCodeMutation()
  const { secondsLeft, canResend, restart } = useCodeTimer(60)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<CodeFormData>({
    resolver: zodResolver(codeSchema),
  })

  const handleCode = async (values: CodeFormData) => {
    try {
      await validateCode({ userId, type: 'email', code: values.code, justCheck: true }).unwrap()
      onSuccess(values.code)
    } catch (err) {
      const apiError = err as ApiError
      setError('root', { message: getAuthErrorMessage(apiError.code) })
    }
  }

  const handleResend = async () => {
    try {
      await requestCode({ userId, email, channel: 'email' }).unwrap()
      restart()
    } catch (err) {
      const apiError = err as ApiError
      setError('root', { message: getAuthErrorMessage(apiError.code) })
    }
  }

  return (
    <form onSubmit={handleSubmit(handleCode)} className="mt-7 grid gap-4" noValidate>
      <p className="text-xs font-medium text-text-muted">
        Enviamos um código de 6 dígitos para <strong>{email}</strong>
      </p>

      <div className="grid gap-1">
        <label htmlFor="code" className="text-xs font-bold uppercase tracking-wide text-text-muted">
          Código de verificação
        </label>
        <input
          id="code"
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="000000"
          className={cn(
            "h-11 w-full rounded-xl border bg-input px-4 text-sm text-text placeholder:text-text-subtle outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20",
            errors.code ? 'border-danger' : 'border-border',
          )}
          {...register('code')}
        />
        {errors.code && <span className="text-xs text-danger">{errors.code.message}</span>}
      </div>

      {errors.root && <p className="text-center text-xs text-danger">{errors.root.message}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-4 h-11 w-full rounded-xl bg-primary font-heading text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover hover:shadow-primary/35 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? 'Validando...' : 'Confirmar'}
      </button>

      <div className="text-center">
        {canResend ? (
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="text-xs font-bold text-primary transition-colors hover:text-primary-hover disabled:opacity-60"
          >
            Reenviar código
          </button>
        ) : (
          <span className="text-xs text-text-subtle">
            Reenviar código em {secondsLeft}s
          </span>
        )}
      </div>
    </form>
  )
}
