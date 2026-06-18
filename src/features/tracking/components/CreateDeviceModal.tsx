import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/shared/components/Modal'
import { cn } from '@/shared/utils/cn'
import { useGetVehiclesQuery } from '@/features/vehicles/store/vehiclesApi'
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
  const [createDevice, { isLoading }] = useCreateDeviceMutation()

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm<CreateDeviceFormData>({
    resolver: zodResolver(createDeviceSchema),
    defaultValues: { vehicleId: '', type: 0 },
  })

  useEffect(() => {
    if (!isOpen) return
    reset({ vehicleId: '', name: '', uniqueId: '', type: 0 })
  }, [isOpen, reset])

  async function onSubmit(data: CreateDeviceFormData) {
    try {
      await createDevice({
        vehicleId: data.vehicleId,
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
      'h-9 w-full rounded-md border bg-white px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-primary',
      hasError ? 'border-danger' : 'border-gray-200',
    )

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo dispositivo">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4">

        {/* Veículo */}
        <div className="grid gap-1">
          <label className="text-xs font-semibold text-gray-600">
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
                  'h-9 w-full rounded-md border bg-white px-3 text-sm text-gray-900 outline-none focus:border-primary',
                  errors.vehicleId ? 'border-danger' : 'border-gray-200',
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
          <label className="text-xs font-semibold text-gray-600">Tipo de dispositivo</label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <select
                value={field.value ?? 0}
                onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                onBlur={field.onBlur}
                className="h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:border-primary"
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

        {/* Nome + Identificador */}
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-1">
            <label className="text-xs font-semibold text-gray-600">Nome (opcional)</label>
            <input
              type="text"
              placeholder="ex: ABC1D23"
              {...register('name')}
              className={inputClass(!!errors.name)}
            />
          </div>

          <div className="grid gap-1">
            <label className="text-xs font-semibold text-gray-600">Identificador (opcional)</label>
            <input
              type="text"
              placeholder="ex: van-abc123"
              {...register('uniqueId')}
              className={inputClass(!!errors.uniqueId)}
            />
            <span className="text-xs text-gray-400">ID único do dispositivo</span>
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
            className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
