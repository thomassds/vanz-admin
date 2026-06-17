import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/shared/components/Modal'
import { cn } from '@/shared/utils/cn'
import { cancelContractSchema } from '../schemas/cancel-contract.schema'
import type { CancelContractFormData } from '../schemas/cancel-contract.schema'
import type { ApiError } from '@/shared/types/api.types'
import { getCancellationErrorMessage } from '../utils/contractCancellationErrors'
import { useCancelContractMutation } from '../store/contractsApi'

interface CancelContractModalProps {
  contractId: string
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const MAX_REASON = 500

export function CancelContractModal({ contractId, isOpen, onClose, onSuccess }: CancelContractModalProps) {
  const [cancelContract, { isLoading: isCanceling }] = useCancelContractMutation()

  const {
    register,
    handleSubmit,
    watch,
    setError,
    reset,
    formState: { errors },
  } = useForm<CancelContractFormData>({
    resolver: zodResolver(cancelContractSchema),
    defaultValues: { reason: '' },
  })

  useEffect(() => {
    if (!isOpen) return
    reset({ reason: '' })
  }, [isOpen, reset])

  const reasonValue = watch('reason') ?? ''
  const charCount = reasonValue.length

  async function handleFormSubmit(data: CancelContractFormData) {
    try {
      await cancelContract({ id: contractId, reason: data.reason }).unwrap()
      onClose()
      onSuccess()
    } catch (err) {
      const apiError = err as ApiError
      setError('root', { message: getCancellationErrorMessage(apiError.code) })
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cancelar contrato">
      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="grid gap-5">
        {/* Aviso de ação irreversível */}
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-700">
            <span className="font-semibold">Atenção:</span> Esta ação é irreversível. O contrato não
            poderá ser reativado após o cancelamento.
          </p>
        </div>

        {/* Motivo */}
        <div className="grid gap-1">
          <label className="text-xs font-semibold text-gray-600">
            Motivo do cancelamento <span className="text-danger">*</span>
          </label>
          <textarea
            {...register('reason')}
            rows={4}
            maxLength={MAX_REASON}
            placeholder="Descreva o motivo do cancelamento..."
            className={cn(
              'w-full resize-none rounded-md border bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-primary',
              errors.reason ? 'border-danger' : 'border-gray-200',
            )}
          />
          <div className="flex items-center justify-between">
            {errors.reason ? (
              <span className="text-xs text-danger">{errors.reason.message}</span>
            ) : (
              <span />
            )}
            <span className={cn('text-xs', charCount > MAX_REASON ? 'text-danger' : 'text-gray-400')}>
              {charCount}/{MAX_REASON}
            </span>
          </div>
        </div>

        {errors.root && (
          <p className="text-center text-xs text-danger">{errors.root.message}</p>
        )}

        <div className="mt-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isCanceling}
            className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            Voltar
          </button>
          <button
            type="submit"
            disabled={isCanceling}
            className="rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCanceling ? 'Cancelando...' : 'Confirmar cancelamento'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
