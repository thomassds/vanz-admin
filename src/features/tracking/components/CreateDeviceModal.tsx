import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/shared/components/Modal'
import { cn } from '@/shared/utils/cn'
import { useGetVehiclesQuery } from '@/features/vehicles/store/vehiclesApi'
import { useGetTenantUsersQuery } from '@/features/users/store/usersApi'
import { useCreateDeviceMutation } from '../store/trackingApi'
import { createDeviceSchema } from '../schemas/create-device.schema'
import type { CreateDeviceFormData } from '../schemas/create-device.schema'
import { getDeviceErrorMessage } from '../utils/deviceErrors'
import { DEVICE_TYPE_OPTIONS } from '../utils/deviceType'
import type { ApiError } from '@/shared/types/api.types'

interface CreateDeviceModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (msg: string) => void
}

export function CreateDeviceModal({ isOpen, onClose, onSuccess }: CreateDeviceModalProps) {
  const { data: vehiclesData } = useGetVehiclesQuery({ page: 1, limit: 100 }, { skip: !isOpen })
  const { data: driversData } = useGetTenantUsersQuery(
    { page: 1, limit: 100, role: 'driver' },
    { skip: !isOpen },
  )
  const [createDevice, { isLoading }] = useCreateDeviceMutation()

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
    setError,
  } = useForm<CreateDeviceFormData>({
    resolver: zodResolver(createDeviceSchema),
    defaultValues: { vehicleId: '', userId: '', type: 0 },
  })

  const selectedType = watch('type')

  useEffect(() => {
    if (!isOpen) return
    reset({ vehicleId: '', userId: '', name: '', uniqueId: '', type: 0 })
  }, [isOpen, reset])

  async function onSubmit(data: CreateDeviceFormData) {
    try {
      await createDevice({
        vehicleId: data.vehicleId,
        // Motorista só faz sentido para device do tipo app do motorista
        ...(data.userId && data.type === 0 ? { userId: data.userId } : {}),
        ...(data.name ? { name: data.name } : {}),
        ...(data.uniqueId ? { uniqueId: data.uniqueId } : {}),
        ...(data.type !== undefined ? { type: data.type } : {}),
      }).unwrap()
      onSuccess('Dispositivo cadastrado com sucesso.')
    } catch (err) {
      setError('root', { message: getDeviceErrorMessage((err as ApiError).code) })
    }
  }

  const inputClass = (hasError: boolean) =>
    cn(
      'h-9 w-full rounded-xl border bg-input px-3 text-sm text-text outline-none transition-all placeholder:text-text-subtle focus:border-primary focus:ring-2 focus:ring-primary/20',
      hasError ? 'border-danger' : 'border-border',
    )

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo dispositivo">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4">

        {/* Veículo */}
        <div className="grid gap-1">
          <label className="text-xs font-semibold text-text-muted">
            Veículo <span className="text-danger">*</span>
          </label>
          <Controller
            name="vehicleId"
            control={control}
            render={({ field }) => (
              <select
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={field.onBlur}
                className={cn(
                  'h-9 w-full rounded-xl border bg-input px-3 text-sm text-text outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20',
                  errors.vehicleId ? 'border-danger' : 'border-border',
                )}
              >
                <option value="">Selecione o veículo</option>
                {vehiclesData?.items.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.plate} — {v.model}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.vehicleId && (
            <span className="text-xs text-danger">{errors.vehicleId.message}</span>
          )}
        </div>

        {/* Tipo */}
        <div className="grid gap-1">
          <label className="text-xs font-semibold text-text-muted">Tipo de dispositivo</label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <select
                value={field.value ?? 0}
                onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                onBlur={field.onBlur}
                className="h-9 w-full rounded-xl border border-border bg-input px-3 text-sm text-text outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {DEVICE_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}
          />
        </div>

        {/* Motorista — apenas para device tipo app do motorista */}
        {selectedType === 0 && (
          <div className="grid gap-1">
            <label className="text-xs font-semibold text-text-muted">Motorista (opcional)</label>
            <Controller
              name="userId"
              control={control}
              render={({ field }) => (
                <select
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  className="h-9 w-full rounded-xl border border-border bg-input px-3 text-sm text-text outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Sem motorista vinculado</option>
                  {driversData?.items.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.email}
                    </option>
                  ))}
                </select>
              )}
            />
            <span className="text-xs text-text-subtle">
              Permite que o motorista use o app Vanz Motorista neste veículo
            </span>
          </div>
        )}

        {/* Nome + Identificador */}
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-1">
            <label className="text-xs font-semibold text-text-muted">Nome (opcional)</label>
            <input
              type="text"
              placeholder="ex: ABC1D23"
              {...register('name')}
              className={inputClass(!!errors.name)}
            />
          </div>

          <div className="grid gap-1">
            <label className="text-xs font-semibold text-text-muted">Identificador (opcional)</label>
            <input
              type="text"
              placeholder="ex: van-abc123"
              {...register('uniqueId')}
              className={inputClass(!!errors.uniqueId)}
            />
            <span className="text-xs text-text-subtle">ID único do dispositivo</span>
          </div>
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
            {isLoading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
