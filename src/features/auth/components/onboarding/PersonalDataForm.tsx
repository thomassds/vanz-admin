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
  "h-[34px] w-full rounded-[4px] border bg-white px-[10px] font-['Noto_Sans',sans-serif] text-xs text-[#8994a9] outline-none transition-colors focus:border-[#70c9ec]"
const labelClass = "font-['Noto_Sans',sans-serif] text-xs font-bold text-[#8994a9]"

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
      className="mt-6 grid gap-3 px-0 lg:px-6"
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
          className={cn(fieldClass, errors.taxIdentifier ? 'border-red-400' : 'border-[#8994a9]')}
          {...register('taxIdentifier')}
        />
        {errors.taxIdentifier && (
          <span className="text-xs text-red-500">{errors.taxIdentifier.message}</span>
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
            className={cn(fieldClass, errors.countryCode ? 'border-red-400' : 'border-[#8994a9]')}
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
            className={cn(fieldClass, errors.phone ? 'border-red-400' : 'border-[#8994a9]')}
            {...register('phone')}
          />
        </div>
      </div>
      {(errors.countryCode ?? errors.phone) && (
        <span className="text-xs text-red-500">
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
          className={cn(fieldClass, errors.zipCode ? 'border-red-400' : 'border-[#8994a9]')}
          {...register('zipCode')}
        />
        {errors.zipCode && <span className="text-xs text-red-500">{errors.zipCode.message}</span>}
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
            className={cn(fieldClass, errors.street ? 'border-red-400' : 'border-[#8994a9]')}
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
            className={cn(fieldClass, errors.number ? 'border-red-400' : 'border-[#8994a9]')}
            {...register('number')}
          />
        </div>
      </div>
      {(errors.street ?? errors.number) && (
        <span className="text-xs text-red-500">{errors.street?.message ?? errors.number?.message}</span>
      )}

      <div className="grid gap-1">
        <label htmlFor="neighborhood" className={labelClass}>
          Bairro
        </label>
        <input
          id="neighborhood"
          type="text"
          placeholder="Bela Vista"
          className={cn(fieldClass, errors.neighborhood ? 'border-red-400' : 'border-[#8994a9]')}
          {...register('neighborhood')}
        />
        {errors.neighborhood && (
          <span className="text-xs text-red-500">{errors.neighborhood.message}</span>
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
            className={cn(fieldClass, errors.city ? 'border-red-400' : 'border-[#8994a9]')}
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
            className={cn(fieldClass, errors.state ? 'border-red-400' : 'border-[#8994a9]')}
            {...register('state')}
          />
        </div>
      </div>
      {(errors.city ?? errors.state) && (
        <span className="text-xs text-red-500">{errors.city?.message ?? errors.state?.message}</span>
      )}

      <div className="grid gap-1">
        <label htmlFor="complement" className={labelClass}>
          Complemento (opcional)
        </label>
        <input
          id="complement"
          type="text"
          placeholder="Apto 101"
          className={cn(fieldClass, 'border-[#8994a9]')}
          {...register('complement')}
        />
      </div>

      {errors.root && <p className="text-center text-xs text-red-500">{errors.root.message}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-6 h-10 w-[150px] justify-self-center rounded-[5px] bg-[#00c8ff] font-['Noto_Sans',sans-serif] text-xs font-bold tracking-[0.03em] text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? 'Enviando...' : 'CONTINUAR'}
      </button>
    </form>
  )
}
