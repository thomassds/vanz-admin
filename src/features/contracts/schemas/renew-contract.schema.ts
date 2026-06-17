import { z } from 'zod'

export const renewContractSchema = z.object({
  startDate: z.string().min(1, 'Data de início obrigatória'),
  endDate: z.string().min(1, 'Data de vencimento obrigatória'),
  durationMonths: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : undefined))
    .refine((v) => v === undefined || v >= 1, { message: 'Duração inválida' }),
  firstPaymentDate: z.string().optional(),
  value: z
    .string()
    .optional()
    .transform((v) => (v ? parseFloat(v.replace(',', '.')) : undefined))
    .refine((v) => v === undefined || v >= 0, { message: 'Valor inválido' }),
  discount: z
    .string()
    .optional()
    .transform((v) => (v ? parseFloat(v.replace(',', '.')) : 0))
    .refine((v) => v >= 0, { message: 'Desconto inválido' }),
  dueDay: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : undefined))
    .refine((v) => v === undefined || (v >= 1 && v <= 31), { message: 'Dia inválido' }),
})

export type RenewContractFormData = z.infer<typeof renewContractSchema>
export type RenewContractFormInput = z.input<typeof renewContractSchema>
