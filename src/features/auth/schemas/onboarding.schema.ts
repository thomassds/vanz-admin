import { z } from 'zod'

export const accountSchema = z
  .object({
    name: z.string().min(2, 'Nome obrigatório'),
    email: z.string().email('E-mail inválido'),
    password: z
      .string()
      .min(8, 'Mínimo 8 caracteres')
      .regex(/[A-Z]/, 'Deve conter ao menos uma letra maiúscula')
      .regex(/[0-9]/, 'Deve conter ao menos um número'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

export type AccountFormData = z.infer<typeof accountSchema>

export const codeSchema = z.object({
  code: z.string().length(6, 'Código deve ter 6 dígitos'),
})

export type CodeFormData = z.infer<typeof codeSchema>

export const personalDataSchema = z.object({
  taxIdentifier: z.string().min(11, 'CPF/CNPJ inválido').max(18),
  phone: z.string().min(10, 'Telefone inválido').max(20),
  countryCode: z.string().min(2, 'Código do país obrigatório').max(10),
  zipCode: z.string().min(8, 'CEP inválido').max(20),
  street: z.string().min(2, 'Endereço obrigatório'),
  neighborhood: z.string().min(2, 'Bairro obrigatório'),
  city: z.string().min(2, 'Cidade obrigatória'),
  state: z.string().length(2, 'UF inválida'),
  number: z.string().min(1, 'Número obrigatório'),
  complement: z.string().optional(),
})

export type PersonalDataFormData = z.infer<typeof personalDataSchema>

export const companyDataSchema = z.object({
  companyName: z.string().min(2, 'Nome da empresa obrigatório'),
  taxIdentifier: z.string().min(14, 'CNPJ inválido').max(18),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(10, 'Telefone inválido').max(20),
  countryCode: z.string().min(2, 'Código do país obrigatório').max(10),
})

export type CompanyDataFormData = z.infer<typeof companyDataSchema>
