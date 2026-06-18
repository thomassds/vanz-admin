import { z } from 'zod'

const currentYear = new Date().getFullYear()

export const updateVehicleSchema = z
  .object({
    plate: z.string().min(1).max(20).optional(),
    model: z.string().min(1).max(100).optional(),
    capacity: z
      .number({ invalid_type_error: 'Capacidade inválida' })
      .int()
      .positive('Capacidade deve ser maior que zero')
      .optional(),
    year: z
      .number({ invalid_type_error: 'Ano inválido' })
      .int()
      .min(1900, 'Ano inválido')
      .max(currentYear + 1, 'Ano inválido')
      .optional(),
    status: z.number().int().min(0).max(2).optional(),
    lastRevisionAt: z.string().optional(),
    nextRevisionAt: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.lastRevisionAt && data.nextRevisionAt) {
        return data.nextRevisionAt >= data.lastRevisionAt
      }
      return true
    },
    {
      message: 'A próxima revisão deve ser igual ou posterior à última revisão',
      path: ['nextRevisionAt'],
    },
  )

export type UpdateVehicleFormData = z.infer<typeof updateVehicleSchema>
