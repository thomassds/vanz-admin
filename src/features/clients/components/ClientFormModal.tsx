import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/shared/components/Modal'
import { cn } from '@/shared/utils/cn'
import { formatTaxIdentifier } from '@/shared/utils/taxIdentifier'
import { formatPhone } from '@/shared/utils/phone'
import { createClientSchema } from '../schemas/create-client.schema'
import type { CreateClientFormData } from '../schemas/create-client.schema'
import { useCreateClientMutation, useUpdateClientMutation } from '../store/clientsApi'
import { getClientErrorMessage } from '../utils/clientErrorMessages'
import type { Client } from '../types/client.types'
import type { ApiError } from '@/shared/types/api.types'

interface ClientFormModalProps {
  isOpen: boolean
  onClose: () => void
  client?: Client
  onSuccess: (message: string) => void
}

export function ClientFormModal({ isOpen, onClose, client, onSuccess }: ClientFormModalProps) {
  const isEditing = !!client
  const [createClient, { isLoading: isCreating }] = useCreateClientMutation()
  const [updateClient, { isLoading: isUpdating }] = useUpdateClientMutation()
  const isLoading = isCreating || isUpdating

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CreateClientFormData>({
    resolver: zodResolver(createClientSchema),
  })

  useEffect(() => {
    if (isOpen) {
      reset({
        name: client?.name ?? '',
        taxIdentifier: client?.taxIdentifier ? formatTaxIdentifier(client.taxIdentifier) : '',
        phone: client?.phone ? formatPhone(client.phone) : '',
        email: client?.email ?? '',
      })
    }
  }, [isOpen, client, reset])

  const onSubmit = async (values: CreateClientFormData) => {
    try {
      if (isEditing) {
        await updateClient({ id: client.id, ...values }).unwrap()
        onSuccess('Cliente atualizado com sucesso.')
      } else {
        await createClient(values).unwrap()
        onSuccess('Cliente cadastrado com sucesso.')
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
      title={isEditing ? 'Editar cliente' : 'Novo cliente'}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4">
        <div className="grid gap-1">
          <label className="text-xs font-semibold text-text-muted">
            Nome <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            placeholder="Nome completo"
            className={cn(
              'h-9 w-full rounded-xl border bg-input px-3 text-sm text-text outline-none transition-all placeholder:text-text-subtle focus:border-primary focus:ring-2 focus:ring-primary/20',
              errors.name ? 'border-danger' : 'border-border',
            )}
            {...register('name')}
          />
          {errors.name && <span className="text-xs text-danger">{errors.name.message}</span>}
        </div>

        <div className="grid gap-1">
          <label className="text-xs font-semibold text-text-muted">
            CPF / CNPJ <span className="text-danger">*</span>
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
                  'h-9 w-full rounded-xl border bg-input px-3 text-sm text-text outline-none transition-all placeholder:text-text-subtle focus:border-primary focus:ring-2 focus:ring-primary/20',
                  errors.taxIdentifier ? 'border-danger' : 'border-border',
                )}
              />
            )}
          />
          {errors.taxIdentifier && (
            <span className="text-xs text-danger">{errors.taxIdentifier.message}</span>
          )}
        </div>

        <div className="grid gap-1">
          <label className="text-xs font-semibold text-text-muted">Telefone</label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <input
                type="tel"
                placeholder="(00) 00000-0000"
                value={field.value ?? ''}
                onChange={(e) => field.onChange(formatPhone(e.target.value))}
                onBlur={field.onBlur}
                className="h-9 w-full rounded-xl border border-border bg-input px-3 text-sm text-text outline-none transition-all placeholder:text-text-subtle focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            )}
          />
        </div>

        <div className="grid gap-1">
          <label className="text-xs font-semibold text-text-muted">E-mail</label>
          <input
            type="email"
            placeholder="email@exemplo.com"
            className={cn(
              'h-9 w-full rounded-xl border bg-input px-3 text-sm text-text outline-none transition-all placeholder:text-text-subtle focus:border-primary focus:ring-2 focus:ring-primary/20',
              errors.email ? 'border-danger' : 'border-border',
            )}
            {...register('email')}
          />
          {errors.email && <span className="text-xs text-danger">{errors.email.message}</span>}
        </div>

        {errors.root && (
          <p className="text-center text-xs text-danger">{errors.root.message}</p>
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
    </Modal>
  )
}
