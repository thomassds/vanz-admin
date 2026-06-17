import { useEffect, useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/shared/components/Modal'
import { cn } from '@/shared/utils/cn'
import { maskDateBR, brToISO, isoToBR } from '@/shared/utils/date'
import { useGetContractsQuery } from '@/features/contracts/store/contractsApi'
import { useCreateReceivableMutation, useUpdateReceivableMutation } from '../store/receivablesApi'
import { createReceivableSchema } from '../schemas/create-receivable.schema'
import { updateReceivableSchema } from '../schemas/update-receivable.schema'
import type { CreateReceivableFormData } from '../schemas/create-receivable.schema'
import type { UpdateReceivableFormData } from '../schemas/update-receivable.schema'
import { getReceivableErrorMessage } from '../utils/receivableErrorMessages'
import { isTerminalStatus } from '../utils/receivableStatus'
import type { ApiError } from '@/shared/types/api.types'
import type { Receivable } from '../types/receivable.types'

interface ReceivableFormModalProps {
  isOpen: boolean
  receivable?: Receivable
  onClose: () => void
  onSuccess: (msg: string) => void
}

export function ReceivableFormModal({
  isOpen,
  receivable,
  onClose,
  onSuccess,
}: ReceivableFormModalProps) {
  const isEditing = !!receivable
  const locked = isEditing && isTerminalStatus(receivable.status)

  const [contractSearch, setContractSearch] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [dueDateDisplay, setDueDateDisplay] = useState('')

  const [createReceivable, { isLoading: isCreating }] = useCreateReceivableMutation()
  const [updateReceivable, { isLoading: isUpdating }] = useUpdateReceivableMutation()
  const isLoading = isCreating || isUpdating

  const { data: contractsData } = useGetContractsQuery(
    { page: 1, limit: 50, ...(contractSearch.length >= 2 ? {} : {}) },
    { skip: !isOpen || isEditing },
  )

  // — Create form —
  const createForm = useForm<CreateReceivableFormData>({
    resolver: zodResolver(createReceivableSchema),
  })

  // — Update form —
  const updateForm = useForm<UpdateReceivableFormData>({
    resolver: zodResolver(updateReceivableSchema),
  })

  const activeErrors = isEditing ? updateForm.formState.errors : createForm.formState.errors

  useEffect(() => {
    if (!isOpen) return

    if (isEditing && receivable) {
      const iso = receivable.dueDate?.slice(0, 10) ?? ''
      setDueDateDisplay(iso ? isoToBR(iso) : '')
      updateForm.reset({
        value: receivable.value?.toString() ?? '',
        dueDate: iso,
      })
    } else {
      setContractSearch('')
      setDueDateDisplay('')
      createForm.reset({
        contractId: '',
        installmentNumber: '',
        dueDate: '',
        value: '',
      })
    }
  }, [isOpen, isEditing, receivable, createForm, updateForm])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleCreate(data: CreateReceivableFormData) {
    try {
      await createReceivable(data).unwrap()
      onSuccess('Recebível cadastrado com sucesso.')
    } catch (err) {
      createForm.setError('root', {
        message: getReceivableErrorMessage((err as ApiError).code),
      })
    }
  }

  async function handleUpdate(data: UpdateReceivableFormData) {
    try {
      await updateReceivable({ id: receivable!.id, ...data }).unwrap()
      onSuccess('Recebível atualizado com sucesso.')
    } catch (err) {
      updateForm.setError('root', {
        message: getReceivableErrorMessage((err as ApiError).code),
      })
    }
  }

  const inputClass = (hasError: boolean, disabled = false) =>
    cn(
      'h-9 w-full rounded-md border bg-white px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-primary',
      hasError ? 'border-danger' : 'border-gray-200',
      disabled && 'cursor-not-allowed bg-gray-50 text-gray-500',
    )

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar recebível' : 'Novo recebível'}
    >
      {/* ── CREATE MODE ── */}
      {!isEditing && (
        <form
          onSubmit={createForm.handleSubmit(handleCreate)}
          noValidate
          className="grid gap-4"
        >
          {/* Contrato */}
          <div className="grid gap-1">
            <label className="text-xs font-semibold text-gray-600">
              Contrato <span className="text-danger">*</span>
            </label>
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
                className={inputClass(!!activeErrors.contractId)}
              />
              {showDropdown && contractsData && contractsData.items.length > 0 && (
                <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-md">
                  {contractsData.items
                    .filter((c) =>
                      contractSearch.length < 2 ||
                      c.client?.name?.toLowerCase().includes(contractSearch.toLowerCase()),
                    )
                    .map((c) => (
                      <li key={c.id}>
                        <button
                          type="button"
                          onMouseDown={() => {
                            createForm.setValue('contractId', c.id, { shouldValidate: true })
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
            {activeErrors.contractId && (
              <span className="text-xs text-danger">{activeErrors.contractId.message}</span>
            )}
          </div>

          {/* Parcela */}
          <div className="grid gap-1">
            <label className="text-xs font-semibold text-gray-600">
              Número da parcela <span className="text-danger">*</span>
            </label>
            <Controller
              name="installmentNumber"
              control={createForm.control}
              render={({ field }) => (
                <input
                  type="number"
                  min={1}
                  placeholder="1"
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  className={inputClass(!!activeErrors.installmentNumber)}
                />
              )}
            />
            {activeErrors.installmentNumber && (
              <span className="text-xs text-danger">{activeErrors.installmentNumber.message}</span>
            )}
          </div>

          {/* Vencimento + Valor */}
          <div className="grid grid-cols-2 gap-4">
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
                    className={inputClass(!!activeErrors.dueDate)}
                  />
                )}
              />
              {activeErrors.dueDate && (
                <span className="text-xs text-danger">{activeErrors.dueDate.message}</span>
              )}
            </div>

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
                    className={inputClass(!!activeErrors.value)}
                  />
                )}
              />
              {activeErrors.value && (
                <span className="text-xs text-danger">{activeErrors.value.message}</span>
              )}
            </div>
          </div>

          {createForm.formState.errors.root && (
            <p className="text-center text-xs text-danger">
              {createForm.formState.errors.root.message}
            </p>
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
        <form
          onSubmit={updateForm.handleSubmit(handleUpdate)}
          noValidate
          className="grid gap-4"
        >
          {locked && (
            <p className="rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-500">
              Recebíveis com status <strong>Pago</strong> ou <strong>Cancelado</strong> não podem ser alterados.
            </p>
          )}

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
                <span className="text-xs text-danger">
                  {updateForm.formState.errors.value.message}
                </span>
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
                <span className="text-xs text-danger">
                  {updateForm.formState.errors.dueDate.message}
                </span>
              )}
            </div>
          </div>

          {updateForm.formState.errors.root && (
            <p className="text-center text-xs text-danger">
              {updateForm.formState.errors.root.message}
            </p>
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
