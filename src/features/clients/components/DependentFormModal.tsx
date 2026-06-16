import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/shared/components/Modal'
import { cn } from '@/shared/utils/cn'
import { formatTaxIdentifier } from '@/shared/utils/taxIdentifier'
import { createDependentSchema } from '../schemas/create-dependent.schema'
import type { CreateDependentFormData } from '../schemas/create-dependent.schema'
import { useCreateDependentMutation, useUpdateDependentMutation } from '../store/clientsApi'
import { getClientErrorMessage } from '../utils/clientErrorMessages'
import type { Dependent } from '../types/client.types'
import type { ApiError } from '@/shared/types/api.types'

interface DependentFormModalProps {
  isOpen: boolean
  onClose: () => void
  clientId: string
  dependent?: Dependent
  onSuccess: (message: string) => void
}

export function DependentFormModal({
  isOpen,
  onClose,
  clientId,
  dependent,
  onSuccess,
}: DependentFormModalProps) {
  const isEditing = !!dependent
  const [createDependent, { isLoading: isCreating }] = useCreateDependentMutation()
  const [updateDependent, { isLoading: isUpdating }] = useUpdateDependentMutation()
  const isLoading = isCreating || isUpdating

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CreateDependentFormData>({
    resolver: zodResolver(createDependentSchema),
  })

  useEffect(() => {
    if (isOpen) {
      reset({
        name: dependent?.name ?? '',
        taxIdentifier: dependent?.taxIdentifier ? formatTaxIdentifier(dependent.taxIdentifier) : '',
        birthDate: dependent?.birthDate ?? '',
      })
    }
  }, [isOpen, dependent, reset])

  const onSubmit = async (values: CreateDependentFormData) => {
    try {
      if (isEditing) {
        await updateDependent({ id: dependent.id, ...values }).unwrap()
        onSuccess('Dependente atualizado com sucesso.')
      } else {
        await createDependent({ clientId, ...values }).unwrap()
        onSuccess('Dependente cadastrado com sucesso.')
      }
    } catch (err) {
      const apiError = err as ApiError
      setError('root', { message: getClientErrorMessage(apiError.code) })
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar dependente' : 'Novo dependente'}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4">
        <div className="grid gap-1">
          <label className="text-xs font-semibold text-gray-600">
            Nome <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            placeholder="Nome completo"
            className={cn(
              'h-9 w-full rounded-md border bg-white px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-primary',
              errors.name ? 'border-danger' : 'border-gray-200',
            )}
            {...register('name')}
          />
          {errors.name && <span className="text-xs text-danger">{errors.name.message}</span>}
        </div>

        <div className="grid gap-1">
          <label className="text-xs font-semibold text-gray-600">
            CPF <span className="text-danger">*</span>
          </label>
          <Controller
            name="taxIdentifier"
            control={control}
            render={({ field }) => (
              <input
                type="text"
                placeholder="000.000.000-00"
                value={field.value ?? ''}
                onChange={(e) => field.onChange(formatTaxIdentifier(e.target.value))}
                onBlur={field.onBlur}
                className={cn(
                  'h-9 w-full rounded-md border bg-white px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-primary',
                  errors.taxIdentifier ? 'border-danger' : 'border-gray-200',
                )}
              />
            )}
          />
          {errors.taxIdentifier && (
            <span className="text-xs text-danger">{errors.taxIdentifier.message}</span>
          )}
        </div>

        <div className="grid gap-1">
          <label className="text-xs font-semibold text-gray-600">Data de nascimento</label>
          <input
            type="date"
            className="h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:border-primary"
            {...register('birthDate')}
          />
        </div>

        {errors.root && (
          <p className="text-center text-xs text-danger">{errors.root.message}</p>
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
    </Modal>
  )
}
