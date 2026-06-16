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
    <form onSubmit={handleSubmit(handleCode)} className="mt-6 grid gap-3 px-0 lg:px-6" noValidate>
      <p className="font-['Montserrat',sans-serif] text-xs font-medium text-[#708097]">
        Enviamos um código de 6 dígitos para <strong>{email}</strong>
      </p>

      <div className="grid gap-1">
        <label htmlFor="code" className="font-['Noto_Sans',sans-serif] text-xs font-bold text-[#8994a9]">
          Código de verificação
        </label>
        <input
          id="code"
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="000000"
          className={cn(
            "h-[34px] w-full rounded-[4px] border bg-white px-[10px] font-['Noto_Sans',sans-serif] text-xs text-[#8994a9] outline-none transition-colors focus:border-[#70c9ec]",
            errors.code ? 'border-red-400' : 'border-[#8994a9]',
          )}
          {...register('code')}
        />
        {errors.code && <span className="text-xs text-red-500">{errors.code.message}</span>}
      </div>

      {errors.root && <p className="text-center text-xs text-red-500">{errors.root.message}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-6 h-10 w-[150px] justify-self-center rounded-[5px] bg-[#00c8ff] font-['Noto_Sans',sans-serif] text-xs font-bold tracking-[0.03em] text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? 'Validando...' : 'CONFIRMAR'}
      </button>

      <div className="text-center">
        {canResend ? (
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="font-['Noto_Sans',sans-serif] text-xs font-bold text-[#00c8ff] hover:underline disabled:opacity-60"
          >
            Reenviar código
          </button>
        ) : (
          <span className="font-['Noto_Sans',sans-serif] text-xs text-[#8994a9]">
            Reenviar código em {secondsLeft}s
          </span>
        )}
      </div>
    </form>
  )
}
