import { z } from 'zod'

export const createPayableSchema = z.object({
  value: z
    .string()
    .min(1, 'Valor obrigatório')
    .transform((v) => parseFloat(v.replace(',', '.')))
    .refine((v) => !isNaN(v) && v > 0, { message: 'Valor deve ser maior que zero' }),
  dueDate: z.string().min(1, 'Vencimento obrigatório'),
  category: z.coerce.number().int().min(1).max(5, { message: 'Categoria obrigatória' }),
  status: z.number().int().min(0).max(3).optional().default(0),
  contractId: z.string().optional(),
  vehicleId: z.string().optional(),
  description: z.string().max(500, 'Máximo 500 caracteres').optional(),
})

export type CreatePayableFormData = z.infer<typeof createPayableSchema>
export type CreatePayableFormInput = z.input<typeof createPayableSchema>
