import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/shared/components/Modal'
import { cn } from '@/shared/utils/cn'
import { maskDateBR, brToISO, isoToBR } from '@/shared/utils/date'
import { useCreateVehicleMutation, useUpdateVehicleMutation } from '../store/vehiclesApi'
import { createVehicleSchema } from '../schemas/create-vehicle.schema'
import { updateVehicleSchema } from '../schemas/update-vehicle.schema'
import type { CreateVehicleFormData } from '../schemas/create-vehicle.schema'
import type { UpdateVehicleFormData } from '../schemas/update-vehicle.schema'
import { getVehicleErrorMessage } from '../utils/vehicleErrors'
import type { ApiError } from '@/shared/types/api.types'
import type { Vehicle } from '../types/vehicle.types'

interface VehicleFormModalProps {
  isOpen: boolean
  vehicle?: Vehicle
  onClose: () => void
  onSuccess: (msg: string) => void
}

const STATUS_OPTIONS = [
  { value: 0, label: 'Ativo' },
  { value: 1, label: 'Inativo' },
  { value: 2, label: 'Manutenção' },
]

export function VehicleFormModal({ isOpen, vehicle, onClose, onSuccess }: VehicleFormModalProps) {
  const isEditing = !!vehicle

  const [lastRevisionDisplay, setLastRevisionDisplay] = useState('')
  const [nextRevisionDisplay, setNextRevisionDisplay] = useState('')

  const [createVehicle, { isLoading: isCreating }] = useCreateVehicleMutation()
  const [updateVehicle, { isLoading: isUpdating }] = useUpdateVehicleMutation()
  const isLoading = isCreating || isUpdating

  const createForm = useForm<CreateVehicleFormData>({
    resolver: zodResolver(createVehicleSchema),
  })

  const updateForm = useForm<UpdateVehicleFormData>({
    resolver: zodResolver(updateVehicleSchema),
  })

  useEffect(() => {
    if (!isOpen) return

    if (isEditing && vehicle) {
      setLastRevisionDisplay(vehicle.lastRevisionAt ? isoToBR(vehicle.lastRevisionAt) : '')
      setNextRevisionDisplay(vehicle.nextRevisionAt ? isoToBR(vehicle.nextRevisionAt) : '')
      updateForm.reset({
        plate: vehicle.plate,
        model: vehicle.model,
        capacity: vehicle.capacity,
        year: vehicle.year ?? undefined,
        status: vehicle.status,
        lastRevisionAt: vehicle.lastRevisionAt ?? '',
        nextRevisionAt: vehicle.nextRevisionAt ?? '',
      })
    } else {
      setLastRevisionDisplay('')
      setNextRevisionDisplay('')
      createForm.reset({
        plate: '',
        model: '',
        capacity: undefined,
        year: undefined,
        lastRevisionAt: '',
        nextRevisionAt: '',
      })
    }
  }, [isOpen, isEditing, vehicle, createForm, updateForm])

  async function handleCreate(data: CreateVehicleFormData) {
    try {
      await createVehicle({
        plate: data.plate.toUpperCase(),
        model: data.model,
        capacity: data.capacity,
        ...(data.year ? { year: data.year } : {}),
        ...(data.lastRevisionAt ? { lastRevisionAt: data.lastRevisionAt } : {}),
        ...(data.nextRevisionAt ? { nextRevisionAt: data.nextRevisionAt } : {}),
      }).unwrap()
      onSuccess('Veículo cadastrado com sucesso.')
    } catch (err) {
      createForm.setError('root', { message: getVehicleErrorMessage((err as ApiError).code) })
    }
  }

  async function handleUpdate(data: UpdateVehicleFormData) {
    try {
      await updateVehicle({
        id: vehicle!.id,
        plate: data.plate?.toUpperCase(),
        model: data.model,
        capacity: data.capacity,
        year: data.year,
        status: data.status,
        ...(data.lastRevisionAt !== undefined
          ? { lastRevisionAt: data.lastRevisionAt || undefined }
          : {}),
        ...(data.nextRevisionAt !== undefined
          ? { nextRevisionAt: data.nextRevisionAt || undefined }
          : {}),
      }).unwrap()
      onSuccess('Veículo atualizado com sucesso.')
    } catch (err) {
      updateForm.setError('root', { message: getVehicleErrorMessage((err as ApiError).code) })
    }
  }

  const inputClass = (hasError: boolean) =>
    cn(
      'h-9 w-full rounded-xl border bg-input px-3 text-sm text-text outline-none transition-all placeholder:text-text-subtle focus:border-primary focus:ring-2 focus:ring-primary/20',
      hasError ? 'border-danger' : 'border-border',
    )

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Editar veículo' : 'Novo veículo'}>
      {/* ── CREATE MODE ── */}
      {!isEditing && (
        <form onSubmit={createForm.handleSubmit(handleCreate)} noValidate className="grid gap-4">
          {/* Placa + Modelo */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1">
              <label className="text-xs font-semibold text-text-muted">
                Placa <span className="text-danger">*</span>
              </label>
              <Controller
                name="plate"
                control={createForm.control}
                render={({ field }) => (
                  <input
                    type="text"
                    placeholder="ABC1D23"
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    onBlur={field.onBlur}
                    className={inputClass(!!createForm.formState.errors.plate)}
                  />
                )}
              />
              {createForm.formState.errors.plate && (
                <span className="text-xs text-danger">{createForm.formState.errors.plate.message}</span>
              )}
            </div>

            <div className="grid gap-1">
              <label className="text-xs font-semibold text-text-muted">
                Modelo <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                placeholder="Mercedes Sprinter"
                {...createForm.register('model')}
                className={inputClass(!!createForm.formState.errors.model)}
              />
              {createForm.formState.errors.model && (
                <span className="text-xs text-danger">{createForm.formState.errors.model.message}</span>
              )}
            </div>
          </div>

          {/* Capacidade + Ano */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1">
              <label className="text-xs font-semibold text-text-muted">
                Capacidade (pax) <span className="text-danger">*</span>
              </label>
              <Controller
                name="capacity"
                control={createForm.control}
                render={({ field }) => (
                  <input
                    type="number"
                    min={1}
                    step={1}
                    placeholder="15"
                    value={field.value ?? ''}
                    onChange={(e) =>
                      field.onChange(e.target.value ? parseInt(e.target.value, 10) : undefined)
                    }
                    onBlur={field.onBlur}
                    className={inputClass(!!createForm.formState.errors.capacity)}
                  />
                )}
              />
              {createForm.formState.errors.capacity && (
                <span className="text-xs text-danger">
                  {createForm.formState.errors.capacity.message}
                </span>
              )}
            </div>

            <div className="grid gap-1">
              <label className="text-xs font-semibold text-text-muted">Ano</label>
              <Controller
                name="year"
                control={createForm.control}
                render={({ field }) => (
                  <input
                    type="number"
                    min={1900}
                    max={new Date().getFullYear() + 1}
                    placeholder="2021"
                    value={field.value ?? ''}
                    onChange={(e) =>
                      field.onChange(e.target.value ? parseInt(e.target.value, 10) : undefined)
                    }
                    onBlur={field.onBlur}
                    className={inputClass(!!createForm.formState.errors.year)}
                  />
                )}
              />
              {createForm.formState.errors.year && (
                <span className="text-xs text-danger">{createForm.formState.errors.year.message}</span>
              )}
            </div>
          </div>

          {/* Última Revisão + Próxima Revisão */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1">
              <label className="text-xs font-semibold text-text-muted">Última revisão</label>
              <Controller
                name="lastRevisionAt"
                control={createForm.control}
                render={({ field }) => (
                  <input
                    type="text"
                    placeholder="dd/mm/aaaa"
                    value={lastRevisionDisplay}
                    onChange={(e) => {
                      const masked = maskDateBR(e.target.value)
                      setLastRevisionDisplay(masked)
                      field.onChange(masked.length === 10 ? brToISO(masked) : '')
                    }}
                    onBlur={field.onBlur}
                    className={inputClass(!!createForm.formState.errors.lastRevisionAt)}
                  />
                )}
              />
            </div>

            <div className="grid gap-1">
              <label className="text-xs font-semibold text-text-muted">Próxima revisão</label>
              <Controller
                name="nextRevisionAt"
                control={createForm.control}
                render={({ field }) => (
                  <input
                    type="text"
                    placeholder="dd/mm/aaaa"
                    value={nextRevisionDisplay}
                    onChange={(e) => {
                      const masked = maskDateBR(e.target.value)
                      setNextRevisionDisplay(masked)
                      field.onChange(masked.length === 10 ? brToISO(masked) : '')
                    }}
                    onBlur={field.onBlur}
                    className={inputClass(!!createForm.formState.errors.nextRevisionAt)}
                  />
                )}
              />
              {createForm.formState.errors.nextRevisionAt && (
                <span className="text-xs text-danger">
                  {createForm.formState.errors.nextRevisionAt.message}
                </span>
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
        <form onSubmit={updateForm.handleSubmit(handleUpdate)} noValidate className="grid gap-4">
          {/* Placa + Modelo */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1">
              <label className="text-xs font-semibold text-text-muted">Placa</label>
              <Controller
                name="plate"
                control={updateForm.control}
                render={({ field }) => (
                  <input
                    type="text"
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    onBlur={field.onBlur}
                    className={inputClass(!!updateForm.formState.errors.plate)}
                  />
                )}
              />
              {updateForm.formState.errors.plate && (
                <span className="text-xs text-danger">{updateForm.formState.errors.plate.message}</span>
              )}
            </div>

            <div className="grid gap-1">
              <label className="text-xs font-semibold text-text-muted">Modelo</label>
              <input
                type="text"
                {...updateForm.register('model')}
                className={inputClass(!!updateForm.formState.errors.model)}
              />
              {updateForm.formState.errors.model && (
                <span className="text-xs text-danger">{updateForm.formState.errors.model.message}</span>
              )}
            </div>
          </div>

          {/* Capacidade + Ano */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1">
              <label className="text-xs font-semibold text-text-muted">Capacidade (pax)</label>
              <Controller
                name="capacity"
                control={updateForm.control}
                render={({ field }) => (
                  <input
                    type="number"
                    min={1}
                    step={1}
                    value={field.value ?? ''}
                    onChange={(e) =>
                      field.onChange(e.target.value ? parseInt(e.target.value, 10) : undefined)
                    }
                    onBlur={field.onBlur}
                    className={inputClass(!!updateForm.formState.errors.capacity)}
                  />
                )}
              />
              {updateForm.formState.errors.capacity && (
                <span className="text-xs text-danger">
                  {updateForm.formState.errors.capacity.message}
                </span>
              )}
            </div>

            <div className="grid gap-1">
              <label className="text-xs font-semibold text-text-muted">Ano</label>
              <Controller
                name="year"
                control={updateForm.control}
                render={({ field }) => (
                  <input
                    type="number"
                    min={1900}
                    max={new Date().getFullYear() + 1}
                    value={field.value ?? ''}
                    onChange={(e) =>
                      field.onChange(e.target.value ? parseInt(e.target.value, 10) : undefined)
                    }
                    onBlur={field.onBlur}
                    className={inputClass(!!updateForm.formState.errors.year)}
                  />
                )}
              />
              {updateForm.formState.errors.year && (
                <span className="text-xs text-danger">{updateForm.formState.errors.year.message}</span>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="grid gap-1">
            <label className="text-xs font-semibold text-text-muted">Status</label>
            <Controller
              name="status"
              control={updateForm.control}
              render={({ field }) => (
                <select
                  value={field.value ?? vehicle.status}
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                  onBlur={field.onBlur}
                  className="h-9 w-full rounded-xl border border-border bg-input px-3 text-sm text-text outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                      {opt.value === vehicle.status ? ' (atual)' : ''}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>

          {/* Última Revisão + Próxima Revisão */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1">
              <label className="text-xs font-semibold text-text-muted">Última revisão</label>
              <Controller
                name="lastRevisionAt"
                control={updateForm.control}
                render={({ field }) => (
                  <input
                    type="text"
                    placeholder="dd/mm/aaaa"
                    value={lastRevisionDisplay}
                    onChange={(e) => {
                      const masked = maskDateBR(e.target.value)
                      setLastRevisionDisplay(masked)
                      field.onChange(masked.length === 10 ? brToISO(masked) : '')
                    }}
                    onBlur={field.onBlur}
                    className={inputClass(!!updateForm.formState.errors.lastRevisionAt)}
                  />
                )}
              />
            </div>

            <div className="grid gap-1">
              <label className="text-xs font-semibold text-text-muted">Próxima revisão</label>
              <Controller
                name="nextRevisionAt"
                control={updateForm.control}
                render={({ field }) => (
                  <input
                    type="text"
                    placeholder="dd/mm/aaaa"
                    value={nextRevisionDisplay}
                    onChange={(e) => {
                      const masked = maskDateBR(e.target.value)
                      setNextRevisionDisplay(masked)
                      field.onChange(masked.length === 10 ? brToISO(masked) : '')
                    }}
                    onBlur={field.onBlur}
                    className={inputClass(!!updateForm.formState.errors.nextRevisionAt)}
                  />
                )}
              />
              {updateForm.formState.errors.nextRevisionAt && (
                <span className="text-xs text-danger">
                  {updateForm.formState.errors.nextRevisionAt.message}
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
    </Modal>
  )
}
