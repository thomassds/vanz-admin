# Forms Standards (SDD)

Este documento define os padrões para criação e validação de formulários no frontend.

---

# 1. Stack

| Tecnologia          | Uso                                      |
| ------------------- | ---------------------------------------- |
| React Hook Form     | Gerenciamento de estado do formulário    |
| Zod                 | Validação de schema com tipagem          |
| @hookform/resolvers | Integração RHF + Zod via `zodResolver`   |

---

# 2. Padrão de Formulário

```tsx
// features/auth/schemas/login.schema.ts
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
})

export type LoginFormData = z.infer<typeof loginSchema>
```

```tsx
// features/auth/components/LoginForm.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormData } from '../schemas/login.schema'
import { useLoginMutation } from '../store/authApi'

export function LoginForm() {
  const [login, { isLoading }] = useLoginMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data).unwrap()
    } catch (error) {
      setError('root', { message: 'E-mail ou senha incorretos' })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} type="email" />
      {errors.email && <span>{errors.email.message}</span>}

      <input {...register('password')} type="password" />
      {errors.password && <span>{errors.password.message}</span>}

      {errors.root && <span>{errors.root.message}</span>}

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  )
}
```

---

# 3. Schemas Zod

- Ficam em `features/*/schemas/`
- Um arquivo por formulário: `login.schema.ts`, `create-client.schema.ts`
- Sempre exportar o schema e o tipo inferido

```ts
export const createClientSchema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  document: z.string().min(11, 'Documento inválido'),
  phone: z.string().optional(),
})

export type CreateClientFormData = z.infer<typeof createClientSchema>
```

---

# 4. Erros de API em Campos

Quando a API retorna erro de campo específico, usar `setError` do RHF:

```ts
} catch (error) {
  const apiError = error as { code: string }
  if (apiError.code === 'EMAIL_ALREADY_EXISTS') {
    setError('email', { message: 'Este e-mail já está cadastrado' })
  }
}
```

---

# 5. Formulários Multi-Step

Para formulários com múltiplos passos (ex: Onboarding):

- Usar um único `useForm` com o schema completo
- Validar apenas os campos do step atual com `trigger(['campo1', 'campo2'])`
- Manter dados do formulário no RHF até o submit final
- Estado do step atual via `useState`

---

# 6. Máscaras de Input

## Utilitário `formatTaxIdentifier`

```ts
// shared/utils/taxIdentifier.ts
import { formatTaxIdentifier } from '@/shared/utils/taxIdentifier'
```

Detecta automaticamente CPF (≤ 11 dígitos) ou CNPJ (12–14 dígitos) e aplica a máscara correta:

| Tipo | Máscara              | Exemplo              |
| ---- | -------------------- | -------------------- |
| CPF  | `000.000.000-00`     | `123.456.789-09`     |
| CNPJ | `00.000.000/0000-00` | `12.345.678/0001-95` |

A função aceita qualquer string (com ou sem máscara prévia) — strip de não-dígitos é feito internamente.
Pode ser usada tanto para formatação de exibição quanto como máscara de digitação.

## Utilitário `formatPhone`

```ts
// shared/utils/phone.ts
import { formatPhone } from '@/shared/utils/phone'
```

Detecta automaticamente fixo (10 dígitos) ou celular (11 dígitos):

| Tipo    | Máscara              | Exemplo            |
| ------- | -------------------- | ------------------ |
| Fixo    | `(00) 0000-0000`     | `(11) 3456-7890`   |
| Celular | `(00) 00000-0000`    | `(11) 99999-9999`  |

---

## Padrão com React Hook Form (`Controller`)

Campos com máscara não podem usar `register` diretamente porque o `onChange` nativo não formata o valor. Usar `Controller`:

```tsx
import { useForm, Controller } from 'react-hook-form'
import { formatTaxIdentifier } from '@/shared/utils/taxIdentifier'

const { control } = useForm<FormData>({ resolver: zodResolver(schema) })

<Controller
  name="taxIdentifier"
  control={control}
  render={({ field }) => (
    <input
      type="text"
      placeholder="000.000.000-00"
      value={field.value ?? ''}
      onChange={(e) => field.onChange(formatTaxIdentifier(e.target.value))}
      onBlur={field.onBlur}
    />
  )}
/>
```

## Schema Zod para `taxIdentifier`

O valor armazenado e submetido à API é a string **formatada** (com máscara). O mínimo do Zod deve refletir o tamanho mínimo formatado:

```ts
taxIdentifier: z.string().min(14, 'Documento inválido'),
// CPF formatado tem 14 chars: "000.000.000-00"
// CNPJ formatado tem 18 chars: "00.000.000/0000-00"
```

---

# 7. Regras

- Todo formulário usa React Hook Form + Zod — sem exceção
- Nunca validar campos manualmente com `if (!value)` — usar schema
- Schemas ficam sempre separados do componente
- Erros exibidos inline abaixo do campo correspondente
- Botão de submit desabilitado durante loading (`isLoading`)
- Reset do formulário após submit bem-sucedido via `reset()`
- Campos com máscara usam `Controller` (não `register`) — o valor formatado é enviado à API
- A formatação de `taxIdentifier` fica em `shared/utils/taxIdentifier.ts` — nunca inline no componente
