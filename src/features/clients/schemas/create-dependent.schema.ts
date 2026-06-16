import { z } from 'zod'

export const createDependentSchema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  taxIdentifier: z.string().min(14, 'Documento inválido'),
  birthDate: z.string().optional(),
})

export type CreateDependentFormData = z.infer<typeof createDependentSchema>
