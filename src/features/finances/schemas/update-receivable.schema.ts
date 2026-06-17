import { z } from 'zod'

export const updateReceivableSchema = z.object({
  value: z
    .string()
    .min(1, 'Valor obrigatório')
    .transform((v) => parseFloat(v.replace(',', '.')))
    .refine((v) => !isNaN(v) && v > 0, { message: 'Valor inválido' }),
  dueDate: z.string().min(1, 'Vencimento obrigatório'),
})

export type UpdateReceivableFormData = z.infer<typeof updateReceivableSchema>
