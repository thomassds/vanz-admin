import { z } from 'zod'

export const cancelContractSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(3, 'Motivo deve ter no mínimo 3 caracteres')
    .max(500, 'Motivo deve ter no máximo 500 caracteres'),
})

export type CancelContractFormData = z.infer<typeof cancelContractSchema>
