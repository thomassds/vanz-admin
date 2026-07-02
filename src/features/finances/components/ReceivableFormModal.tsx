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
import type { CreateReceivableFormData, CreateReceivableFormInput } from '../schemas/create-receivable.schema'
import type { UpdateReceivableFormData, UpdateReceivableFormInput } from '../schemas/update-receivable.schema'
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
  const createForm = useForm<CreateReceivableFormInput, unknown, CreateReceivableFormData>({
    resolver: zodResolver(createReceivableSchema),
  })

  // — Update form —
  const updateForm = useForm<UpdateReceivableFormInput, unknown, UpdateReceivableFormData>({
    resolver: zodResolver(updateReceivableSchema),
  })

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
      'h-9 w-full rounded-xl border bg-input px-3 text-sm text-text outline-none transition-all placeholder:text-text-subtle focus:border-primary focus:ring-2 focus:ring-primary/20',
      hasError ? 'border-danger' : 'border-border',
      disabled && 'cursor-not-allowed bg-app text-text-subtle',
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
            <label className="text-xs font-semibold text-text-muted">
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
                className={inputClass(!!createForm.formState.errors.contractId)}
              />
              {showDropdown && contractsData && contractsData.items.length > 0 && (
                <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-md border border-border bg-card shadow-md">
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
                          className="w-full px-3 py-2 text-left text-sm text-text hover:bg-card-hover"
                        >
                          {c.client?.name ?? c.id}
                        </button>
                      </li>
                    ))}
                </ul>
              )}
            </div>
            <input type="hidden" {...createForm.register('contractId')} />
            {createForm.formState.errors.contractId && (
              <span className="text-xs text-danger">{createForm.formState.errors.contractId.message}</span>
            )}
          </div>

          {/* Parcela */}
          <div className="grid gap-1">
            <label className="text-xs font-semibold text-text-muted">
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
                  className={inputClass(!!createForm.formState.errors.installmentNumber)}
                />
              )}
            />
            {createForm.formState.errors.installmentNumber && (
              <span className="text-xs text-danger">{createForm.formState.errors.installmentNumber.message}</span>
            )}
          </div>

          {/* Vencimento + Valor */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1">
              <label className="text-xs font-semibold text-text-muted">
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

            <div className="grid gap-1">
              <label className="text-xs font-semibold text-text-muted">
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
              className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-card-hover disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm shadow-primary/25 transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
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
            <p className="rounded-md bg-app px-3 py-2 text-xs text-text-subtle">
              Recebíveis com status <strong>Pago</strong>, <strong>Cancelado</strong> ou{' '}
              <strong>Contrato pendente</strong> não podem ser alterados.
            </p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1">
              <label className="text-xs font-semibold text-text-muted">Valor (R$)</label>
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
              <label className="text-xs font-semibold text-text-muted">Vencimento</label>
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
              className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-card-hover disabled:opacity-50"
            >
              Cancelar
            </button>
            {!locked && (
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm shadow-primary/25 transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
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
