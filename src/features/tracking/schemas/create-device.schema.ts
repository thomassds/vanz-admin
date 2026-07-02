import { z } from 'zod'

export const createDeviceSchema = z.object({
  vehicleId: z.string().min(1, 'Veículo obrigatório'),
  userId: z.string().optional(),
  name: z.string().max(100).optional(),
  uniqueId: z.string().max(100).optional(),
  type: z.number().int().min(0).max(1).optional(),
})

export type CreateDeviceFormData = z.infer<typeof createDeviceSchema>
