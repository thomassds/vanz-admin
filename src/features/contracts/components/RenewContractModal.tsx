import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/shared/components/Modal'
import { cn } from '@/shared/utils/cn'
import { maskDateBR, brToISO, isoToBR } from '@/shared/utils/date'
import { renewContractSchema } from '../schemas/renew-contract.schema'
import type { RenewContractFormData, RenewContractFormInput } from '../schemas/renew-contract.schema'
import type { Contract } from '../types/contract.types'
import type { ApiError } from '@/shared/types/api.types'
import { getRenewalErrorMessage } from '../utils/contractRenewalErrors'
import { useRenewContractMutation } from '../store/contractsApi'

interface RenewContractModalProps {
  contract: Contract
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function RenewContractModal({ contract, isOpen, onClose, onSuccess }: RenewContractModalProps) {
  const [renewContract, { isLoading: isRenewing }] = useRenewContractMutation()

  const [startDateDisplay, setStartDateDisplay] = useState('')
  const [firstPaymentDisplay, setFirstPaymentDisplay] = useState('')

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    setError,
    reset,
    register,
    formState: { errors },
  } = useForm<RenewContractFormInput, unknown, RenewContractFormData>({
    resolver: zodResolver(renewContractSchema),
    defaultValues: {
      startDate: '',
      endDate: '',
      durationMonths: '',
      firstPaymentDate: '',
      value: '',
      discount: '',
      dueDay: '',
    },
  })

  useEffect(() => {
    if (!isOpen) return
    const startISO = contract.startDate?.slice(0, 10) ?? ''
    const firstPayISO = contract.firstPaymentDate?.slice(0, 10) ?? ''
    setStartDateDisplay(startISO ? isoToBR(startISO) : '')
    setFirstPaymentDisplay(firstPayISO ? isoToBR(firstPayISO) : '')
    reset({
      startDate: startISO,
      endDate: contract.endDate?.slice(0, 10) ?? '',
      durationMonths: contract.durationMonths?.toString() ?? '',
      firstPaymentDate: firstPayISO,
      value: contract.value?.toString() ?? '',
      discount: contract.discount ? contract.discount.toString() : '',
      dueDay: contract.dueDay?.toString() ?? '',
    })
  }, [isOpen, contract, reset])

  const watchedStartDate = watch('startDate')
  const watchedDurationMonths = watch('durationMonths')
  const watchedValue = watch('value')
  const watchedDiscount = watch('discount')

  useEffect(() => {
    const months = parseInt(String(watchedDurationMonths), 10)
    if (!watchedStartDate || isNaN(months) || months < 1) return
    const start = new Date(watchedStartDate)
    if (isNaN(start.getTime())) return
    const end = new Date(start)
    end.setMonth(end.getMonth() + months)
    setValue('endDate', end.toISOString().slice(0, 10))
  }, [watchedStartDate, watchedDurationMonths, setValue])

  const computedEndDate = watch('endDate')

  const computedTotalValue = (() => {
    const v = parseFloat(String(watchedValue).replace(',', '.'))
    const d = parseFloat(String(watchedDiscount ?? '0').replace(',', '.'))
    if (isNaN(v)) return null
    return Math.max(0, v - (isNaN(d) ? 0 : d))
  })()

  async function handleFormSubmit(data: RenewContractFormData) {
    try {
      await renewContract({
        id: contract.id,
        startDate: data.startDate,
        endDate: data.endDate,
        ...(data.value !== undefined && { value: data.value }),
        ...(data.discount !== undefined && { discount: data.discount }),
        ...(data.durationMonths !== undefined && { durationMonths: data.durationMonths }),
        ...(data.firstPaymentDate && { firstPaymentDate: data.firstPaymentDate }),
        ...(data.dueDay !== undefined && { dueDay: data.dueDay }),
      }).unwrap()
      onClose()
      onSuccess()
    } catch (err) {
      const apiError = err as ApiError
      setError('root', { message: getRenewalErrorMessage(apiError.code) })
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Renovar contrato">
      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="grid gap-5">
        <div className="grid grid-cols-2 gap-4">
          {/* Data de início */}
          <div className="grid gap-1">
            <label className="text-xs font-semibold text-gray-600">
              Data de início <span className="text-danger">*</span>
            </label>
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  placeholder="dd/mm/aaaa"
                  value={startDateDisplay}
                  onChange={(e) => {
                    const masked = maskDateBR(e.target.value)
                    setStartDateDisplay(masked)
                    field.onChange(masked.length === 10 ? brToISO(masked) : '')
                  }}
                  onBlur={field.onBlur}
                  className={cn(
                    'h-9 w-full rounded-md border bg-white px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-primary',
                    errors.startDate ? 'border-danger' : 'border-gray-200',
                  )}
                />
              )}
            />
            {errors.startDate && (
              <span className="text-xs text-danger">{errors.startDate.message}</span>
            )}
          </div>

          {/* Duração */}
          <div className="grid gap-1">
            <label className="text-xs font-semibold text-gray-600">Duração (meses)</label>
            <Controller
              name="durationMonths"
              control={control}
              render={({ field }) => (
                <input
                  type="number"
                  min={1}
                  placeholder="12"
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  className={cn(
                    'h-9 w-full rounded-md border bg-white px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-primary',
                    errors.durationMonths ? 'border-danger' : 'border-gray-200',
                  )}
                />
              )}
            />
            {errors.durationMonths && (
              <span className="text-xs text-danger">{errors.durationMonths.message}</span>
            )}
          </div>

          {/* Vencimento (automático) */}
          <div className="grid gap-1">
            <label className="text-xs font-semibold text-gray-600">Vencimento (automático)</label>
            <input
              type="text"
              disabled
              value={computedEndDate ? isoToBR(computedEndDate) : ''}
              placeholder="Calculado automaticamente"
              className="h-9 w-full rounded-md border border-gray-200 bg-gray-50 px-3 text-sm text-gray-500 outline-none placeholder:text-gray-300"
            />
            <input type="hidden" {...register('endDate')} />
          </div>

          {/* Primeiro pagamento */}
          <div className="grid gap-1">
            <label className="text-xs font-semibold text-gray-600">Primeiro pagamento</label>
            <Controller
              name="firstPaymentDate"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  placeholder="dd/mm/aaaa"
                  value={firstPaymentDisplay}
                  onChange={(e) => {
                    const masked = maskDateBR(e.target.value)
                    setFirstPaymentDisplay(masked)
                    field.onChange(masked.length === 10 ? brToISO(masked) : '')
                  }}
                  onBlur={field.onBlur}
                  className="h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-primary"
                />
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Valor mensal */}
          <div className="grid gap-1">
            <label className="text-xs font-semibold text-gray-600">Valor mensal (R$)</label>
            <Controller
              name="value"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="0,00"
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  className={cn(
                    'h-9 w-full rounded-md border bg-white px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-primary',
                    errors.value ? 'border-danger' : 'border-gray-200',
                  )}
                />
              )}
            />
            {errors.value && (
              <span className="text-xs text-danger">{errors.value.message}</span>
            )}
          </div>

          {/* Desconto */}
          <div className="grid gap-1">
            <label className="text-xs font-semibold text-gray-600">Desconto (R$)</label>
            <Controller
              name="discount"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="0,00"
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  className={cn(
                    'h-9 w-full rounded-md border bg-white px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-primary',
                    errors.discount ? 'border-danger' : 'border-gray-200',
                  )}
                />
              )}
            />
            {errors.discount && (
              <span className="text-xs text-danger">{errors.discount.message}</span>
            )}
          </div>

          {/* Dia de vencimento */}
          <div className="grid gap-1">
            <label className="text-xs font-semibold text-gray-600">Dia de vencimento</label>
            <Controller
              name="dueDay"
              control={control}
              render={({ field }) => (
                <select
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  className={cn(
                    'h-9 w-full rounded-md border bg-white px-3 text-sm text-gray-900 outline-none focus:border-primary',
                    errors.dueDay ? 'border-danger' : 'border-gray-200',
                  )}
                >
                  <option value="">Selecione</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>
                      Dia {d}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.dueDay && (
              <span className="text-xs text-danger">{errors.dueDay.message}</span>
            )}
          </div>

          {/* Valor total (automático) */}
          <div className="grid gap-1">
            <label className="text-xs font-semibold text-gray-600">Valor total (automático)</label>
            <div className="flex h-9 items-center rounded-md border border-gray-200 bg-gray-50 px-3 text-sm font-semibold text-gray-700">
              {computedTotalValue !== null ? formatCurrency(computedTotalValue) : '—'}
            </div>
          </div>
        </div>

        {errors.root && (
          <p className="text-center text-xs text-danger">{errors.root.message}</p>
        )}

        <div className="mt-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isRenewing}
            className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isRenewing}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRenewing ? 'Renovando...' : 'Renovar'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
