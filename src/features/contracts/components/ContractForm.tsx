import { useEffect, useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/shared/utils/cn'
import { useGetClientsQuery, useGetDependentsQuery } from '@/features/clients/store/clientsApi'
import { createContractSchema } from '../schemas/create-contract.schema'
import type { CreateContractFormData } from '../schemas/create-contract.schema'
import type { Contract } from '../types/contract.types'
import type { ApiError } from '@/shared/types/api.types'
import { getContractErrorMessage } from '../utils/contractErrorMessages'
import { maskDateBR, brToISO, isoToBR } from '@/shared/utils/date'

interface ContractFormProps {
  contract?: Contract
  isLoading: boolean
  onSubmit: (data: CreateContractFormData) => Promise<void>
  onCancel: () => void
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function ContractForm({ contract, isLoading, onSubmit, onCancel }: ContractFormProps) {
  const isEditing = !!contract

  const [clientSearch, setClientSearch] = useState(contract?.client?.name ?? '')
  const [showClientDropdown, setShowClientDropdown] = useState(false)
  const [startDateDisplay, setStartDateDisplay] = useState(
    contract?.startDate ? isoToBR(contract.startDate.slice(0, 10)) : '',
  )
  const [firstPaymentDisplay, setFirstPaymentDisplay] = useState(
    contract?.firstPaymentDate ? isoToBR(contract.firstPaymentDate.slice(0, 10)) : '',
  )
  const clientDropdownRef = useRef<HTMLDivElement>(null)
  const prevClientIdRef = useRef(contract?.clientId ?? '')

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm<CreateContractFormData>({
    resolver: zodResolver(createContractSchema),
    defaultValues: {
      clientId: contract?.clientId ?? '',
      dependentIds: contract?.dependents?.map((d) => d.id) ?? [],
      startDate: contract?.startDate?.slice(0, 10) ?? '',
      endDate: contract?.endDate?.slice(0, 10) ?? '',
      firstPaymentDate: contract?.firstPaymentDate?.slice(0, 10) ?? '',
      value: contract?.value?.toString() ?? '',
      discount: contract?.discount ? contract.discount.toString() : '',
      totalValue: contract?.totalValue ?? 0,
      dueDay: contract?.dueDay?.toString() ?? '',
      durationMonths: contract?.durationMonths?.toString() ?? '',
    },
  })

  const selectedClientId = watch('clientId')
  const selectedDependentIds = watch('dependentIds') ?? []
  const watchedStartDate = watch('startDate')
  const watchedDurationMonths = watch('durationMonths')
  const watchedValue = watch('value')
  const watchedDiscount = watch('discount')

  const { data: clientsData } = useGetClientsQuery(
    { page: 1, limit: 50, name: clientSearch },
    { skip: clientSearch.length < 2 },
  )

  const { data: dependents } = useGetDependentsQuery(
    { clientId: selectedClientId },
    { skip: !selectedClientId },
  )

  // Limpa dependentes apenas quando o cliente muda (não no primeiro render)
  useEffect(() => {
    if (prevClientIdRef.current === selectedClientId) return
    prevClientIdRef.current = selectedClientId
    setValue('dependentIds', [])
  }, [selectedClientId, setValue])

  // Auto-calcula endDate = startDate + durationMonths meses (mesmo dia, mês avançado)
  useEffect(() => {
    const months = parseInt(String(watchedDurationMonths), 10)
    if (!watchedStartDate || isNaN(months) || months < 1) return
    const start = new Date(watchedStartDate)
    if (isNaN(start.getTime())) return
    const end = new Date(start)
    end.setMonth(end.getMonth() + months)
    setValue('endDate', end.toISOString().slice(0, 10))
  }, [watchedStartDate, watchedDurationMonths, setValue])

  // Auto-calcula totalValue = value * durationMonths - discount
  useEffect(() => {
    const v = parseFloat(String(watchedValue).replace(',', '.'))
    const months = parseInt(String(watchedDurationMonths), 10)
    const d = parseFloat(String(watchedDiscount ?? '0').replace(',', '.'))
    if (isNaN(v) || isNaN(months)) return
    const total = v * months - (isNaN(d) ? 0 : d)
    setValue('totalValue', Math.max(0, total))
  }, [watchedValue, watchedDurationMonths, watchedDiscount, setValue])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (clientDropdownRef.current && !clientDropdownRef.current.contains(e.target as Node)) {
        setShowClientDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleClientSelect(id: string, name: string) {
    setValue('clientId', id, { shouldValidate: true })
    setClientSearch(name)
    setShowClientDropdown(false)
  }

  function toggleDependent(id: string) {
    const current = selectedDependentIds
    const next = current.includes(id) ? current.filter((d) => d !== id) : [...current, id]
    setValue('dependentIds', next)
  }

  async function handleFormSubmit(data: CreateContractFormData) {
    try {
      await onSubmit(data)
    } catch (err) {
      const apiError = err as ApiError
      setError('root', { message: getContractErrorMessage(apiError.code) })
    }
  }

  const computedTotalValue = watch('totalValue') ?? 0
  const computedEndDate = watch('endDate')

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="grid gap-5">
      {/* Cliente */}
      <div className="grid gap-1">
        <label className="text-xs font-semibold text-gray-600">
          Cliente <span className="text-danger">*</span>
        </label>
        <div className="relative" ref={clientDropdownRef}>
          <input
            type="text"
            placeholder="Buscar cliente por nome..."
            value={clientSearch}
            onChange={(e) => {
              setClientSearch(e.target.value)
              setShowClientDropdown(true)
              if (!e.target.value) setValue('clientId', '', { shouldValidate: false })
            }}
            onFocus={() => setShowClientDropdown(true)}
            className={cn(
              'h-9 w-full rounded-md border bg-white px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-primary',
              errors.clientId ? 'border-danger' : 'border-gray-200',
            )}
          />
          {showClientDropdown && clientsData && clientsData.items.length > 0 && (
            <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-md">
              {clientsData.items.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onMouseDown={() => handleClientSelect(c.id, c.name)}
                    className="w-full px-3 py-2 text-left text-sm text-gray-900 hover:bg-gray-50"
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <input type="hidden" {...register('clientId')} />
        {errors.clientId && (
          <span className="text-xs text-danger">{errors.clientId.message}</span>
        )}
      </div>

      {/* Dependentes */}
      {selectedClientId && (
        <div className="grid gap-1">
          <label className="text-xs font-semibold text-gray-600">Dependentes</label>
          {!dependents || dependents.length === 0 ? (
            <p className="text-xs text-gray-400">Nenhum dependente cadastrado para este cliente.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {dependents.map((dep) => {
                const checked = selectedDependentIds.includes(dep.id)
                return (
                  <button
                    key={dep.id}
                    type="button"
                    onClick={() => toggleDependent(dep.id)}
                    className={cn(
                      'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                      checked
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary',
                    )}
                  >
                    {dep.name}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Datas */}
      <div className="grid grid-cols-2 gap-4">
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

        <div className="grid gap-1">
          <label className="text-xs font-semibold text-gray-600">
            Primeiro pagamento <span className="text-danger">*</span>
          </label>
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
                className={cn(
                  'h-9 w-full rounded-md border bg-white px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-primary',
                  errors.firstPaymentDate ? 'border-danger' : 'border-gray-200',
                )}
              />
            )}
          />
          {errors.firstPaymentDate && (
            <span className="text-xs text-danger">{errors.firstPaymentDate.message}</span>
          )}
        </div>

        <div className="grid gap-1">
          <label className="text-xs font-semibold text-gray-600">Duração (meses) <span className="text-danger">*</span></label>
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
      </div>

      {/* Valor, desconto e dia de vencimento */}
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-1">
          <label className="text-xs font-semibold text-gray-600">
            Valor mensal (R$) <span className="text-danger">*</span>
          </label>
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

        <div className="grid gap-1">
          <label className="text-xs font-semibold text-gray-600">
            Dia de vencimento <span className="text-danger">*</span>
          </label>
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

        <div className="grid gap-1">
          <label className="text-xs font-semibold text-gray-600">Valor total (automático)</label>
          <div className="flex h-9 items-center rounded-md border border-gray-200 bg-gray-50 px-3 text-sm font-semibold text-gray-700">
            {formatCurrency(computedTotalValue)}
          </div>
          <input type="hidden" {...register('totalValue')} />
        </div>
      </div>

      {errors.root && (
        <p className="text-center text-xs text-danger">{errors.root.message}</p>
      )}

      <div className="mt-2 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Salvar'}
        </button>
      </div>
    </form>
  )
}
