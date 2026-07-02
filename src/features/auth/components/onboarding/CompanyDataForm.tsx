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
  "h-11 w-full rounded-xl border bg-input px-4 text-sm text-text placeholder:text-text-subtle outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
const labelClass = "text-xs font-bold uppercase tracking-wide text-text-muted"

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
      className="mt-7 grid gap-4"
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
          className={cn(fieldClass, errors.companyName ? 'border-danger' : 'border-border')}
          {...register('companyName')}
        />
        {errors.companyName && (
          <span className="text-xs text-danger">{errors.companyName.message}</span>
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
          className={cn(fieldClass, errors.taxIdentifier ? 'border-danger' : 'border-border')}
          {...register('taxIdentifier')}
        />
        {errors.taxIdentifier && (
          <span className="text-xs text-danger">{errors.taxIdentifier.message}</span>
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
          className={cn(fieldClass, errors.email ? 'border-danger' : 'border-border')}
          {...register('email')}
        />
        {errors.email && <span className="text-xs text-danger">{errors.email.message}</span>}
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
            className={cn(fieldClass, errors.countryCode ? 'border-danger' : 'border-border')}
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

      {errors.root && <p className="text-center text-xs text-danger">{errors.root.message}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-4 h-11 w-full rounded-xl bg-primary font-heading text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover hover:shadow-primary/35 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? 'Enviando...' : 'Finalizar'}
      </button>
    </form>
  )
}
