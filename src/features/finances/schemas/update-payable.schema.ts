import { z } from 'zod'

export const updatePayableSchema = z.object({
  value: z
    .string()
    .min(1, 'Valor obrigatório')
    .transform((v) => parseFloat(v.replace(',', '.')))
    .refine((v) => !isNaN(v) && v > 0, { message: 'Valor inválido' }),
  dueDate: z.string().min(1, 'Vencimento obrigatório'),
  category: z.coerce.number().int().min(1).max(5, { message: 'Categoria obrigatória' }),
  status: z.number().int().min(0).max(3).optional(),
  vehicleId: z.string().nullable().optional(),
  description: z.string().max(500, 'Máximo 500 caracteres').optional(),
})

export type UpdatePayableFormData = z.infer<typeof updatePayableSchema>
export type UpdatePayableFormInput = z.input<typeof updatePayableSchema>
