import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/shared/components/Modal'
import { cn } from '@/shared/utils/cn'
import { suspendContractSchema } from '../schemas/suspend-contract.schema'
import type { SuspendContractFormData } from '../schemas/suspend-contract.schema'
import type { ApiError } from '@/shared/types/api.types'
import { getSuspensionErrorMessage } from '../utils/contractSuspensionErrors'
import { useSuspendContractMutation } from '../store/contractsApi'

interface SuspendContractModalProps {
  contractId: string
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const MAX_REASON = 500

export function SuspendContractModal({ contractId, isOpen, onClose, onSuccess }: SuspendContractModalProps) {
  const [suspendContract, { isLoading: isSuspending }] = useSuspendContractMutation()
  const [confirmed, setConfirmed] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setError,
    reset,
    formState: { errors, isValid },
  } = useForm<SuspendContractFormData>({
    resolver: zodResolver(suspendContractSchema),
    defaultValues: { reason: '' },
    mode: 'onChange',
  })

  useEffect(() => {
    if (!isOpen) return
    reset({ reason: '' })
    setConfirmed(false)
  }, [isOpen, reset])

  const reasonValue = watch('reason') ?? ''
  const charCount = reasonValue.length

  async function handleFormSubmit(data: SuspendContractFormData) {
    try {
      await suspendContract({ id: contractId, reason: data.reason }).unwrap()
      onClose()
      onSuccess()
    } catch (err) {
      const apiError = err as ApiError
      setError('root', { message: getSuspensionErrorMessage(apiError.code) })
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Suspender contrato">
      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="grid gap-5">
        {/* Aviso sobre cancelamento de recebíveis */}
        <div className="rounded-xl border border-warning/40 bg-warning-soft px-4 py-3">
          <p className="text-sm text-warning">
            <span className="font-semibold">Atenção:</span> todos os recebíveis em aberto deste
            contrato serão cancelados. Se o contrato for reativado no futuro, novos recebíveis serão
            gerados a partir da reativação — os anteriores não serão restaurados.
          </p>
        </div>

        {/* Motivo */}
        <div className="grid gap-1">
          <label className="text-xs font-semibold text-text-muted">
            Motivo da suspensão <span className="text-danger">*</span>
          </label>
          <textarea
            {...register('reason')}
            rows={4}
            maxLength={MAX_REASON}
            placeholder="Descreva o motivo da suspensão..."
            className={cn(
              'w-full resize-none rounded-xl border bg-input px-3 py-2 text-sm text-text outline-none transition-all placeholder:text-text-subtle focus:border-primary focus:ring-2 focus:ring-primary/20',
              errors.reason ? 'border-danger' : 'border-border',
            )}
          />
          <div className="flex items-center justify-between">
            {errors.reason ? (
              <span className="text-xs text-danger">{errors.reason.message}</span>
            ) : (
              <span />
            )}
            <span className={cn('text-xs', charCount > MAX_REASON ? 'text-danger' : 'text-text-subtle')}>
              {charCount}/{MAX_REASON}
            </span>
          </div>
        </div>

        {/* Checkbox de confirmação */}
        <label className="flex cursor-pointer items-start gap-2.5">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-warning"
          />
          <span className="text-sm text-text">
            Entendo que os recebíveis em aberto serão cancelados e não poderão ser restaurados.
          </span>
        </label>

        {errors.root && (
          <p className="text-center text-xs text-danger">{errors.root.message}</p>
        )}

        <div className="mt-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSuspending}
            className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-card-hover disabled:opacity-50"
          >
            Voltar
          </button>
          <button
            type="submit"
            disabled={!confirmed || !isValid || isSuspending}
            className="rounded-xl bg-warning px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSuspending ? 'Suspendendo...' : 'Confirmar suspensão'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
