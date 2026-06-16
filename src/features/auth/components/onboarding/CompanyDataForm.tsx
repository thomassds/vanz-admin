import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { companyDataSchema } from '../../schemas/onboarding.schema'
import type { CompanyDataFormData } from '../../schemas/onboarding.schema'
import { useCreateCompanyMutation } from '../../store/authApi'
import { getAuthErrorMessage } from '../../utils/authErrorMessages'
import { cn } from '@/shared/utils/cn'
import type { ApiError } from '@/shared/types/api.types'

interface CompanyDataFormProps {
  userId: string
  onSuccess: () => void
}

const fieldClass =
  "h-[34px] w-full rounded-[4px] border bg-white px-[10px] font-['Noto_Sans',sans-serif] text-xs text-[#8994a9] outline-none transition-colors focus:border-[#70c9ec]"
const labelClass = "font-['Noto_Sans',sans-serif] text-xs font-bold text-[#8994a9]"

export function CompanyDataForm({ userId, onSuccess }: CompanyDataFormProps) {
  const [createCompany, { isLoading }] = useCreateCompanyMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<CompanyDataFormData>({
    resolver: zodResolver(companyDataSchema),
  })

  const handleCompanyData = async (values: CompanyDataFormData) => {
    try {
      await createCompany({ userId, ...values }).unwrap()
      onSuccess()
    } catch (err) {
      const apiError = err as ApiError
      setError('root', { message: getAuthErrorMessage(apiError.code) })
    }
  }

  return (
    <form
      onSubmit={handleSubmit(handleCompanyData)}
      className="mt-6 grid gap-3 px-0 lg:px-6"
      noValidate
    >
      <div className="grid gap-1">
        <label htmlFor="companyName" className={labelClass}>
          Nome da empresa
        </label>
        <input
          id="companyName"
          type="text"
          placeholder="Vanz Transportes LTDA"
          className={cn(fieldClass, errors.companyName ? 'border-red-400' : 'border-[#8994a9]')}
          {...register('companyName')}
        />
        {errors.companyName && (
          <span className="text-xs text-red-500">{errors.companyName.message}</span>
        )}
      </div>

      <div className="grid gap-1">
        <label htmlFor="companyTaxIdentifier" className={labelClass}>
          CNPJ
        </label>
        <input
          id="companyTaxIdentifier"
          type="text"
          placeholder="00.000.000/0000-00"
          className={cn(fieldClass, errors.taxIdentifier ? 'border-red-400' : 'border-[#8994a9]')}
          {...register('taxIdentifier')}
        />
        {errors.taxIdentifier && (
          <span className="text-xs text-red-500">{errors.taxIdentifier.message}</span>
        )}
      </div>

      <div className="grid gap-1">
        <label htmlFor="companyEmail" className={labelClass}>
          E-mail da empresa
        </label>
        <input
          id="companyEmail"
          type="email"
          placeholder="contato@vanz.com"
          className={cn(fieldClass, errors.email ? 'border-red-400' : 'border-[#8994a9]')}
          {...register('email')}
        />
        {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
      </div>

      <div className="grid grid-cols-[80px_1fr] gap-2">
        <div className="grid gap-1">
          <label htmlFor="companyCountryCode" className={labelClass}>
            País
          </label>
          <input
            id="companyCountryCode"
            type="text"
            placeholder="55"
            className={cn(fieldClass, errors.countryCode ? 'border-red-400' : 'border-[#8994a9]')}
            {...register('countryCode')}
          />
        </div>
        <div className="grid gap-1">
          <label htmlFor="companyPhone" className={labelClass}>
            Telefone
          </label>
          <input
            id="companyPhone"
            type="text"
            placeholder="11988888888"
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

      {errors.root && <p className="text-center text-xs text-red-500">{errors.root.message}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-6 h-10 w-[150px] justify-self-center rounded-[5px] bg-[#00c8ff] font-['Noto_Sans',sans-serif] text-xs font-bold tracking-[0.03em] text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? 'Enviando...' : 'FINALIZAR'}
      </button>
    </form>
  )
}
