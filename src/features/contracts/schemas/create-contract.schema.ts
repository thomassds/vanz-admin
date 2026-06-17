import { z } from 'zod'

export const createContractSchema = z.object({
  clientId: z.string().uuid('Cliente obrigatório'),
  dependentIds: z.array(z.string().uuid()).optional(),
  startDate: z.string().min(1, 'Data de início obrigatória'),
  endDate: z.string().min(1, 'Data de vencimento obrigatória'),
  firstPaymentDate: z.string().min(1, 'Data do primeiro pagamento obrigatória'),
  value: z
    .string()
    .min(1, 'Valor obrigatório')
    .transform((v) => parseFloat(v.replace(',', '.')))
    .refine((v) => !isNaN(v) && v > 0, { message: 'Valor deve ser maior que zero' }),
  discount: z
    .string()
    .optional()
    .transform((v) => {
      const n = parseFloat((v ?? '0').replace(',', '.'))
      return isNaN(n) ? 0 : n
    })
    .refine((v) => v >= 0, { message: 'Desconto inválido' }),
  totalValue: z.number().min(0),
  dueDay: z
    .string()
    .min(1, 'Dia de vencimento obrigatório')
    .transform((v) => parseInt(v, 10))
    .refine((v) => !isNaN(v) && v >= 1 && v <= 31, { message: 'Dia de vencimento inválido' }),
  durationMonths: z
    .string()
    .min(1, 'Duração obrigatória')
    .transform((v) => parseInt(v, 10))
    .refine((v) => !isNaN(v) && v >= 1, { message: 'Duração deve ser de pelo menos 1 mês' }),
})

export type CreateContractFormData = z.infer<typeof createContractSchema>
export type CreateContractFormInput = z.input<typeof createContractSchema>
