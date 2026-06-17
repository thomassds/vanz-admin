import { z } from 'zod'

export const createReceivableSchema = z.object({
  contractId: z.string().uuid('Contrato obrigatório'),
  installmentNumber: z
    .string()
    .min(1, 'Número de parcela obrigatório')
    .transform((v) => parseInt(v, 10))
    .refine((v) => !isNaN(v) && v >= 1, { message: 'Número de parcela inválido' }),
  dueDate: z.string().min(1, 'Vencimento obrigatório'),
  value: z
    .string()
    .min(1, 'Valor obrigatório')
    .transform((v) => parseFloat(v.replace(',', '.')))
    .refine((v) => !isNaN(v) && v > 0, { message: 'Valor deve ser maior que zero' }),
})

export type CreateReceivableFormData = z.infer<typeof createReceivableSchema>
