import { useEffect, useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/shared/components/Modal'
import { cn } from '@/shared/utils/cn'
import { maskDateBR, brToISO, isoToBR } from '@/shared/utils/date'
import { useGetContractsQuery } from '@/features/contracts/store/contractsApi'
import { useGetVehiclesQuery } from '@/features/vehicles/store/vehiclesApi'
import { useCreatePayableMutation, useUpdatePayableMutation } from '../store/payablesApi'
import { createPayableSchema } from '../schemas/create-payable.schema'
import { updatePayableSchema } from '../schemas/update-payable.schema'
import type { CreatePayableFormData, CreatePayableFormInput } from '../schemas/create-payable.schema'
import type { UpdatePayableFormData, UpdatePayableFormInput } from '../schemas/update-payable.schema'
import { getPayableErrorMessage } from '../utils/payableErrors'
import { isTerminalPayableStatus, getAllowedPayableTransitions, getPayableStatusLabel } from '../utils/payableStatus'
import { CATEGORY_OPTIONS } from '../utils/payableCategory'
import type { ApiError } from '@/shared/types/api.types'
import type { Payable } from '../types/payable.types'

interface PayableFormModalProps {
  isOpen: boolean
  payable?: Payable
  onClose: () => void
  onSuccess: (msg: string) => void
}

const MAX_DESC = 500

export function PayableFormModal({ isOpen, payable, onClose, onSuccess }: PayableFormModalProps) {
  const isEditing = !!payable
  const locked = isEditing && isTerminalPayableStatus(payable.status)

  const [contractSearch, setContractSearch] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [vehicleSearch, setVehicleSearch] = useState('')
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false)
  const vehicleDropdownRef = useRef<HTMLDivElement>(null)
  const [dueDateDisplay, setDueDateDisplay] = useState('')

  const [createPayable, { isLoading: isCreating }] = useCreatePayableMutation()
  const [updatePayable, { isLoading: isUpdating }] = useUpdatePayableMutation()
  const isLoading = isCreating || isUpdating

  const { data: contractsData } = useGetContractsQuery(
    { page: 1, limit: 100 },
    { skip: !isOpen || isEditing },
  )

  const { data: vehiclesData } = useGetVehiclesQuery(
    { page: 1, limit: 100 },
    { skip: !isOpen },
  )

  const createForm = useForm<CreatePayableFormInput, unknown, CreatePayableFormData>({
    resolver: zodResolver(createPayableSchema),
  })

  const updateForm = useForm<UpdatePayableFormInput, unknown, UpdatePayableFormData>({
    resolver: zodResolver(updatePayableSchema),
  })

  useEffect(() => {
    if (!isOpen) return

    if (isEditing && payable) {
      const iso = payable.dueDate?.slice(0, 10) ?? ''
      setDueDateDisplay(iso ? isoToBR(iso) : '')
      updateForm.reset({
        value: Number(payable.value).toFixed(2).replace('.', ','),
        dueDate: iso,
        category: payable.category,
        status: payable.status,
        vehicleId: payable.vehicleId,
        description: payable.description ?? '',
      })
    } else {
      setContractSearch('')
      setVehicleSearch('')
      setDueDateDisplay('')
      createForm.reset({
        value: '',
        dueDate: '',
        category: '' as unknown as number,
        status: 0,
        contractId: '',
        vehicleId: '',
        description: '',
      })
    }
  }, [isOpen, isEditing, payable, createForm, updateForm])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
      if (vehicleDropdownRef.current && !vehicleDropdownRef.current.contains(e.target as Node)) {
        setShowVehicleDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleCreate(data: CreatePayableFormData) {
    try {
      await createPayable({
        value: data.value,
        dueDate: data.dueDate,
        category: data.category,
        ...(data.status !== undefined ? { status: data.status } : {}),
        ...(data.contractId ? { contractId: data.contractId } : {}),
        ...(data.vehicleId ? { vehicleId: data.vehicleId } : {}),
        ...(data.description ? { description: data.description } : {}),
      }).unwrap()
      onSuccess('Despesa cadastrada com sucesso.')
    } catch (err) {
      createForm.setError('root', { message: getPayableErrorMessage((err as ApiError).code) })
    }
  }

  async function handleUpdate(data: UpdatePayableFormData) {
    try {
      await updatePayable({
        id: payable!.id,
        value: data.value,
        dueDate: data.dueDate,
        category: data.category,
        ...(data.status !== undefined ? { status: data.status } : {}),
        vehicleId: data.vehicleId !== undefined ? data.vehicleId : undefined,
        ...(data.description !== undefined ? { description: data.description } : {}),
      }).unwrap()
      onSuccess('Despesa atualizada com sucesso.')
    } catch (err) {
      updateForm.setError('root', { message: getPayableErrorMessage((err as ApiError).code) })
    }
  }

  const inputClass = (hasError: boolean, disabled = false) =>
    cn(
      'h-9 w-full rounded-md border bg-white px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-primary',
      hasError ? 'border-danger' : 'border-gray-200',
      disabled && 'cursor-not-allowed bg-gray-50 text-gray-500',
    )

  const descriptionValue = isEditing
    ? (updateForm.watch('description') ?? '')
    : (createForm.watch('description') ?? '')
  const allowedTransitions = isEditing ? getAllowedPayableTransitions(payable.status) : []

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Editar despesa' : 'Nova despesa'}>
      {/* ── CREATE MODE ── */}
      {!isEditing && (
        <form onSubmit={createForm.handleSubmit(handleCreate)} noValidate className="grid gap-4">
          {/* Valor + Vencimento */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1">
              <label className="text-xs font-semibold text-gray-600">
                Valor (R$) <span className="text-danger">*</span>
              </label>
              <Controller
                name="value"
                control={createForm.control}
                render={({ field }) => (
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="0,00"
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    className={inputClass(!!createForm.formState.errors.value)}
                  />
                )}
              />
              {createForm.formState.errors.value && (
                <span className="text-xs text-danger">{createForm.formState.errors.value.message}</span>
              )}
            </div>

            <div className="grid gap-1">
              <label className="text-xs font-semibold text-gray-600">
                Vencimento <span className="text-danger">*</span>
              </label>
              <Controller
                name="dueDate"
                control={createForm.control}
                render={({ field }) => (
                  <input
                    type="text"
                    placeholder="dd/mm/aaaa"
                    value={dueDateDisplay}
                    onChange={(e) => {
                      const masked = maskDateBR(e.target.value)
                      setDueDateDisplay(masked)
                      field.onChange(masked.length === 10 ? brToISO(masked) : '')
                    }}
                    onBlur={field.onBlur}
                    className={inputClass(!!createForm.formState.errors.dueDate)}
                  />
                )}
              />
              {createForm.formState.errors.dueDate && (
                <span className="text-xs text-danger">{createForm.formState.errors.dueDate.message}</span>
              )}
            </div>
          </div>

          {/* Categoria */}
          <div className="grid gap-1">
            <label className="text-xs font-semibold text-gray-600">
              Categoria <span className="text-danger">*</span>
            </label>
            <Controller
              name="category"
              control={createForm.control}
              render={({ field }) => (
                <select
                  value={(field.value as number | undefined) ?? ''}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  onBlur={field.onBlur}
                  className={cn(
                    'h-9 w-full rounded-md border bg-white px-3 text-sm text-gray-900 outline-none focus:border-primary',
                    createForm.formState.errors.category ? 'border-danger' : 'border-gray-200',
                  )}
                >
                  <option value="">Selecione a categoria</option>
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}
            />
            {createForm.formState.errors.category && (
              <span className="text-xs text-danger">{createForm.formState.errors.category.message}</span>
            )}
          </div>

          {/* Status */}
          <div className="grid gap-1">
            <label className="text-xs font-semibold text-gray-600">Status</label>
            <Controller
              name="status"
              control={createForm.control}
              render={({ field }) => (
                <select
                  value={field.value ?? 0}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  onBlur={field.onBlur}
                  className="h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:border-primary"
                >
                  <option value={0}>Pendente</option>
                  <option value={1}>Pago</option>
                  <option value={2}>Vencido</option>
                  <option value={3}>Cancelado</option>
                </select>
              )}
            />
          </div>

          {/* Contrato (opcional) */}
          <div className="grid gap-1">
            <label className="text-xs font-semibold text-gray-600">Contrato (opcional)</label>
            <div className="relative" ref={dropdownRef}>
              <input
                type="text"
                placeholder="Selecionar contrato..."
                value={contractSearch}
                onChange={(e) => {
                  setContractSearch(e.target.value)
                  setShowDropdown(true)
                  if (!e.target.value) createForm.setValue('contractId', '')
                }}
                onFocus={() => setShowDropdown(true)}
                className={inputClass(false)}
              />
              {showDropdown && contractsData && contractsData.items.length > 0 && (
                <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-md">
                  {contractsData.items
                    .filter(
                      (c) =>
                        contractSearch.length < 2 ||
                        c.client?.name?.toLowerCase().includes(contractSearch.toLowerCase()),
                    )
                    .map((c) => (
                      <li key={c.id}>
                        <button
                          type="button"
                          onMouseDown={() => {
                            createForm.setValue('contractId', c.id)
                            setContractSearch(c.client?.name ?? c.id)
                            setShowDropdown(false)
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-gray-900 hover:bg-gray-50"
                        >
                          {c.client?.name ?? c.id}
                        </button>
                      </li>
                    ))}
                </ul>
              )}
            </div>
            <input type="hidden" {...createForm.register('contractId')} />
          </div>

          {/* Veículo (opcional) */}
          <div className="grid gap-1">
            <label className="text-xs font-semibold text-gray-600">Veículo (opcional)</label>
            <div className="relative" ref={vehicleDropdownRef}>
              <input
                type="text"
                placeholder="Selecionar veículo..."
                value={vehicleSearch}
                onChange={(e) => {
                  setVehicleSearch(e.target.value)
                  setShowVehicleDropdown(true)
                  if (!e.target.value) createForm.setValue('vehicleId', '')
                }}
                onFocus={() => setShowVehicleDropdown(true)}
                className={inputClass(false)}
              />
              {showVehicleDropdown && vehiclesData && vehiclesData.items.length > 0 && (
                <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-md">
                  {vehiclesData.items
                    .filter(
                      (v) =>
                        vehicleSearch.length < 2 ||
                        v.plate.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
                        v.model.toLowerCase().includes(vehicleSearch.toLowerCase()),
                    )
                    .map((v) => (
                      <li key={v.id}>
                        <button
                          type="button"
                          onMouseDown={() => {
                            createForm.setValue('vehicleId', v.id)
                            setVehicleSearch(`${v.plate} — ${v.model}`)
                            setShowVehicleDropdown(false)
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-gray-900 hover:bg-gray-50"
                        >
                          <span className="font-medium">{v.plate}</span>
                          <span className="ml-2 text-gray-500">{v.model}</span>
                        </button>
                      </li>
                    ))}
                </ul>
              )}
            </div>
            <input type="hidden" {...createForm.register('vehicleId')} />
          </div>

          {/* Descrição */}
          <div className="grid gap-1">
            <label className="text-xs font-semibold text-gray-600">Descrição (opcional)</label>
            <textarea
              {...createForm.register('description')}
              rows={3}
              maxLength={MAX_DESC}
              placeholder="Descreva a despesa..."
              className="w-full resize-none rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-primary"
            />
            <div className="flex justify-end">
              <span className="text-xs text-gray-400">{descriptionValue.length}/{MAX_DESC}</span>
            </div>
          </div>

          {createForm.formState.errors.root && (
            <p className="text-center text-xs text-danger">{createForm.formState.errors.root.message}</p>
          )}

          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
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
              {isLoading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      )}

      {/* ── EDIT MODE ── */}
      {isEditing && (
        <form onSubmit={updateForm.handleSubmit(handleUpdate)} noValidate className="grid gap-4">
          {locked && (
            <p className="rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-500">
              Despesas com status <strong>Pago</strong> ou <strong>Cancelado</strong> não podem ser
              alteradas.
            </p>
          )}

          {/* Valor + Vencimento */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1">
              <label className="text-xs font-semibold text-gray-600">Valor (R$)</label>
              <Controller
                name="value"
                control={updateForm.control}
                render={({ field }) => (
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="0,00"
                    disabled={locked}
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    className={inputClass(!!updateForm.formState.errors.value, locked)}
                  />
                )}
              />
              {updateForm.formState.errors.value && (
                <span className="text-xs text-danger">{updateForm.formState.errors.value.message}</span>
              )}
            </div>

            <div className="grid gap-1">
              <label className="text-xs font-semibold text-gray-600">Vencimento</label>
              <Controller
                name="dueDate"
                control={updateForm.control}
                render={({ field }) => (
                  <input
                    type="text"
                    placeholder="dd/mm/aaaa"
                    disabled={locked}
                    value={dueDateDisplay}
                    onChange={(e) => {
                      const masked = maskDateBR(e.target.value)
                      setDueDateDisplay(masked)
                      field.onChange(masked.length === 10 ? brToISO(masked) : '')
                    }}
                    onBlur={field.onBlur}
                    className={inputClass(!!updateForm.formState.errors.dueDate, locked)}
                  />
                )}
              />
              {updateForm.formState.errors.dueDate && (
                <span className="text-xs text-danger">{updateForm.formState.errors.dueDate.message}</span>
              )}
            </div>
          </div>

          {/* Categoria */}
          <div className="grid gap-1">
            <label className="text-xs font-semibold text-gray-600">Categoria</label>
            <Controller
              name="category"
              control={updateForm.control}
              render={({ field }) => (
                <select
                  disabled={locked}
                  value={(field.value as number | undefined) ?? ''}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  onBlur={field.onBlur}
                  className={cn(
                    'h-9 w-full rounded-md border bg-white px-3 text-sm text-gray-900 outline-none focus:border-primary',
                    updateForm.formState.errors.category ? 'border-danger' : 'border-gray-200',
                    locked && 'cursor-not-allowed bg-gray-50 text-gray-500',
                  )}
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>

          {/* Status */}
          {!locked && (
            <div className="grid gap-1">
              <label className="text-xs font-semibold text-gray-600">Status</label>
              <Controller
                name="status"
                control={updateForm.control}
                render={({ field }) => (
                  <select
                    value={field.value ?? payable.status}
                    onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                    onBlur={field.onBlur}
                    className="h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:border-primary"
                  >
                    <option value={payable.status}>{getPayableStatusLabel(payable.status)} (atual)</option>
                    {allowedTransitions.map((s) => (
                      <option key={s} value={s}>
                        {getPayableStatusLabel(s)}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>
          )}

          {/* Veículo (opcional) */}
          <div className="grid gap-1">
            <label className="text-xs font-semibold text-gray-600">Veículo (opcional)</label>
            <Controller
              name="vehicleId"
              control={updateForm.control}
              render={({ field }) => (
                <select
                  disabled={locked}
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value || null)}
                  onBlur={field.onBlur}
                  className={cn(
                    'h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:border-primary',
                    locked && 'cursor-not-allowed bg-gray-50 text-gray-500',
                  )}
                >
                  <option value="">Nenhum</option>
                  {vehiclesData?.items.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.plate} — {v.model}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>

          {/* Descrição */}
          <div className="grid gap-1">
            <label className="text-xs font-semibold text-gray-600">Descrição (opcional)</label>
            <textarea
              {...updateForm.register('description')}
              rows={3}
              maxLength={MAX_DESC}
              disabled={locked}
              placeholder="Descreva a despesa..."
              className={cn(
                'w-full resize-none rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-primary',
                locked && 'cursor-not-allowed bg-gray-50 text-gray-500',
              )}
            />
            <div className="flex justify-end">
              <span className="text-xs text-gray-400">{descriptionValue.length}/{MAX_DESC}</span>
            </div>
          </div>

          {updateForm.formState.errors.root && (
            <p className="text-center text-xs text-danger">{updateForm.formState.errors.root.message}</p>
          )}

          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              {locked ? 'Fechar' : 'Cancelar'}
            </button>
            {!locked && (
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? 'Salvando...' : 'Salvar'}
              </button>
            )}
          </div>
        </form>
      )}
    </Modal>
  )
}
