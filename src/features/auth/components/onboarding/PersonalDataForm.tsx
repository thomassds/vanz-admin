import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { personalDataSchema } from '../../schemas/onboarding.schema'
import type { PersonalDataFormData } from '../../schemas/onboarding.schema'
import { useSavePersonalDataMutation } from '../../store/authApi'
import { getAuthErrorMessage } from '../../utils/authErrorMessages'
import { cn } from '@/shared/utils/cn'
import type { ApiError } from '@/shared/types/api.types'

interface PersonalDataFormProps {
  userId: string
  onSuccess: (phone: string) => void
}

const fieldClass =
  "h-11 w-full rounded-xl border bg-input px-4 text-sm text-text placeholder:text-text-subtle outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
const labelClass = "text-xs font-bold uppercase tracking-wide text-text-muted"

export function PersonalDataForm({ userId, onSuccess }: PersonalDataFormProps) {
  const [savePersonalData, { isLoading }] = useSavePersonalDataMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<PersonalDataFormData>({
    resolver: zodResolver(personalDataSchema),
  })

  const handlePersonalData = async (values: PersonalDataFormData) => {
    try {
      await savePersonalData({ userId, ...values }).unwrap()
      onSuccess(values.phone)
    } catch (err) {
      const apiError = err as ApiError
      setError('root', { message: getAuthErrorMessage(apiError.code) })
    }
  }

  return (
    <form
      onSubmit={handleSubmit(handlePersonalData)}
      className="mt-7 grid gap-4"
      noValidate
    >
      <div className="grid gap-1">
        <label htmlFor="taxIdentifier" className={labelClass}>
          CPF/CNPJ
        </label>
        <input
          id="taxIdentifier"
          type="text"
          placeholder="000.000.000-00"
          className={cn(fieldClass, errors.taxIdentifier ? 'border-danger' : 'border-border')}
          {...register('taxIdentifier')}
        />
        {errors.taxIdentifier && (
          <span className="text-xs text-danger">{errors.taxIdentifier.message}</span>
        )}
      </div>

      <div className="grid grid-cols-[80px_1fr] gap-2">
        <div className="grid gap-1">
          <label htmlFor="countryCode" className={labelClass}>
            País
          </label>
          <input
            id="countryCode"
            type="text"
            placeholder="55"
            className={cn(fieldClass, errors.countryCode ? 'border-danger' : 'border-border')}
            {...register('countryCode')}
          />
        </div>
        <div className="grid gap-1">
          <label htmlFor="phone" className={labelClass}>
            Telefone
          </label>
          <input
            id="phone"
            type="text"
            placeholder="11999999999"
            className={cn(fieldClass, errors.phone ? 'border-danger' : 'border-border')}
            {...register('phone')}
          />
        </div>
      </div>
      {(errors.countryCode ?? errors.phone) && (
        <span className="text-xs text-danger">
          {errors.countryCode?.message ?? errors.phone?.message}
        </span>
      )}

      <div className="grid gap-1">
        <label htmlFor="zipCode" className={labelClass}>
          CEP
        </label>
        <input
          id="zipCode"
          type="text"
          placeholder="00000000"
          className={cn(fieldClass, errors.zipCode ? 'border-danger' : 'border-border')}
          {...register('zipCode')}
        />
        {errors.zipCode && <span className="text-xs text-danger">{errors.zipCode.message}</span>}
      </div>

      <div className="grid grid-cols-[1fr_100px] gap-2">
        <div className="grid gap-1">
          <label htmlFor="street" className={labelClass}>
            Endereço
          </label>
          <input
            id="street"
            type="text"
            placeholder="Avenida Paulista"
            className={cn(fieldClass, errors.street ? 'border-danger' : 'border-border')}
            {...register('street')}
          />
        </div>
        <div className="grid gap-1">
          <label htmlFor="number" className={labelClass}>
            Número
          </label>
          <input
            id="number"
            type="text"
            placeholder="1000"
            className={cn(fieldClass, errors.number ? 'border-danger' : 'border-border')}
            {...register('number')}
          />
        </div>
      </div>
      {(errors.street ?? errors.number) && (
        <span className="text-xs text-danger">{errors.street?.message ?? errors.number?.message}</span>
      )}

      <div className="grid gap-1">
        <label htmlFor="neighborhood" className={labelClass}>
          Bairro
        </label>
        <input
          id="neighborhood"
          type="text"
          placeholder="Bela Vista"
          className={cn(fieldClass, errors.neighborhood ? 'border-danger' : 'border-border')}
          {...register('neighborhood')}
        />
        {errors.neighborhood && (
          <span className="text-xs text-danger">{errors.neighborhood.message}</span>
        )}
      </div>

      <div className="grid grid-cols-[1fr_70px] gap-2">
        <div className="grid gap-1">
          <label htmlFor="city" className={labelClass}>
            Cidade
          </label>
          <input
            id="city"
            type="text"
            placeholder="São Paulo"
            className={cn(fieldClass, errors.city ? 'border-danger' : 'border-border')}
            {...register('city')}
          />
        </div>
        <div className="grid gap-1">
          <label htmlFor="state" className={labelClass}>
            UF
          </label>
          <input
            id="state"
            type="text"
            placeholder="SP"
            maxLength={2}
            className={cn(fieldClass, errors.state ? 'border-danger' : 'border-border')}
            {...register('state')}
          />
        </div>
      </div>
      {(errors.city ?? errors.state) && (
        <span className="text-xs text-danger">{errors.city?.message ?? errors.state?.message}</span>
      )}

      <div className="grid gap-1">
        <label htmlFor="complement" className={labelClass}>
          Complemento (opcional)
        </label>
        <input
          id="complement"
          type="text"
          placeholder="Apto 101"
          className={cn(fieldClass, 'border-border')}
          {...register('complement')}
        />
      </div>

      {errors.root && <p className="text-center text-xs text-danger">{errors.root.message}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-4 h-11 w-full rounded-xl bg-primary font-heading text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover hover:shadow-primary/35 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? 'Enviando...' : 'Continuar'}
      </button>
    </form>
  )
}
