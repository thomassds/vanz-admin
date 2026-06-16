import { z } from 'zod'

export const createClientSchema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  taxIdentifier: z.string().min(14, 'Documento inválido'),
  phone: z.string().optional(),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
})

export type CreateClientFormData = z.infer<typeof createClientSchema>
