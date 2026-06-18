import { z } from 'zod'

const currentYear = new Date().getFullYear()

export const createVehicleSchema = z
  .object({
    plate: z.string().min(1, 'Placa obrigatória').max(20),
    model: z.string().min(1, 'Modelo obrigatório').max(100),
    capacity: z
      .number({ error: 'Capacidade obrigatória' })
      .int()
      .positive('Capacidade deve ser maior que zero'),
    year: z
      .number()
      .int()
      .min(1900, 'Ano inválido')
      .max(currentYear + 1, 'Ano inválido')
      .optional(),
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

export type CreateVehicleFormData = z.infer<typeof createVehicleSchema>
