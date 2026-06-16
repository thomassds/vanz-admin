# Feature: Onboarding (Frontend)

## Objetivo

Permitir que o usuário crie sua conta e passe pelas etapas necessárias para configuração inicial do sistema, com fluxo diferente conforme o perfil de acesso.

---

## Contexto

O onboarding é um formulário multi-step. O fluxo tem 2 steps para todos os usuários e um 3º step exclusivo para o perfil Admin (dono da empresa). Após completar o onboarding, o usuário é autenticado e redirecionado para o dashboard. A principio o fluxo de onboarding só sera feito pelos administradores.

---

## Fluxo de Tela

### Step 1 — Criação de Conta

```
1. Usuário preenche nome, e-mail e senha
2. Clica em "Continuar"
3. API cria a conta e envia código de validação para o e-mail
4. Usuário é levado para a tela de validação de e-mail
5. Usuário informa o código de 6 dígitos recebido
6. API valida o código e marca o e-mail como validado
7. Usuário avança para o Step 2
```

### Step 2 — Dados Pessoais

```
1. Usuário preenche CPF/CNPJ, telefone (com código do país) e endereço
2. Clica em "Continuar"
3. API salva os dados e envia código de validação via SMS/WhatsApp
4. Usuário informa o código de 6 dígitos recebido
5. API valida o código e marca o telefone como validado
6. Se perfil for Admin → avança para Step 3
7. Se perfil não for Admin → onboarding concluído, redirect para /dashboard
```

### Step 3 — Dados da Empresa (somente Admin)

```
1. Usuário preenche nome da empresa, CNPJ da empresa e demais dados
2. Clica em "Finalizar"
3. API salva os dados e vincula o usuário ao tenant como Admin
4. Redirect para /dashboard
```

---

## Telas

### OnboardingPage — Container Multi-Step

- Controla o step atual via `useState`
- Exibe indicador de progresso (step 1 de 3, etc.)
- Mantém dados do formulário entre steps via React Hook Form

### Componentes por Step

| Step | Componente         | Descrição                                   |
| ---- | ------------------ | ------------------------------------------- |
| 1a   | `AccountForm`      | Nome, e-mail, senha                         |
| 1b   | `EmailCodeForm`    | Input do código de 6 dígitos (e-mail)       |
| 2a   | `PersonalDataForm` | CPF/CNPJ, telefone, endereço                |
| 2b   | `PhoneCodeForm`    | Input do código de 6 dígitos (SMS/WhatsApp) |
| 3    | `CompanyDataForm`  | Dados da empresa (apenas Admin)             |

---

## Integração com API

| Ação                          | Endpoint                     | Método |
| ----------------------------- | ---------------------------- | ------ |
| Criar conta                   | `/api/v1/auth/onboarding`    | POST   |
| Solicitar código (e-mail/SMS) | `/api/v1/auth/request-code`  | POST   |
| Validar código                | `/api/v1/auth/validate-code` | POST   |

---

## Validação (Zod)

### Step 1a — accountSchema

```ts
z.object({
  name: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});
```

### Step 1b / 2b — codeSchema

```ts
z.object({
  code: z.string().length(6, "Código deve ter 6 dígitos"),
});
```

### Step 2a — personalDataSchema

```ts
z.object({
  taxIdentifier: z.string().min(11, "CPF/CNPJ inválido"),
  phone: z.string().min(8, "Telefone inválido"),
  countryCode: z.string().min(1, "Código do país obrigatório"),
  address: z.string().min(5, "Endereço obrigatório"),
});
```

### Step 3 — companyDataSchema

```ts
z.object({
  companyName: z.string().min(2, "Nome da empresa obrigatório"),
  companyDocument: z.string().min(14, "CNPJ inválido"),
});
```

---

## Estados das Telas

| Estado          | Comportamento                                      |
| --------------- | -------------------------------------------------- |
| Loading         | Botão desabilitado com spinner                     |
| Erro de campo   | Mensagem inline abaixo do campo                    |
| Erro de API     | Mensagem acima do botão                            |
| Código enviado  | Mensagem de confirmação + timer para reenvio       |
| Reenviar código | Link "Reenviar código" habilitado após 60 segundos |

---

## Erros Esperados

| Código da API                | Mensagem para o usuário                                          |
| ---------------------------- | ---------------------------------------------------------------- |
| `EMAIL_ALREADY_EXISTS`       | "Este e-mail já está cadastrado"                                 |
| `PHONE_ALREADY_EXISTS`       | "Este telefone já está cadastrado"                               |
| `INVALID_CODE`               | "Código inválido"                                                |
| `CODE_EXPIRED`               | "Código expirado. Solicite um novo."                             |
| `CODE_MAX_ATTEMPTS_EXCEEDED` | "Número máximo de tentativas atingido. Solicite um novo código." |
| `WEAK_PASSWORD`              | "A senha não atende aos requisitos mínimos"                      |
| `INVALID_TAX_IDENTIFIER`     | "CPF/CNPJ inválido"                                              |
| `INVALID_COMPANY_DATA`       | "Dados da empresa inválidos ou incompletos"                      |

---

## Critérios de Aceite

- [ ] Formulário multi-step com indicador de progresso visível
- [ ] Dados preenchidos no step anterior são mantidos ao voltar
- [ ] Validação de cada step antes de avançar
- [ ] Código de e-mail é solicitado automaticamente após criar conta
- [ ] Código de telefone é solicitado automaticamente após salvar dados pessoais
- [ ] Link "Reenviar código" aparece após 60 segundos
- [ ] Step 3 (empresa) exibido apenas para perfil Admin
- [ ] Após onboarding completo: redirect para /dashboard autenticado
- [ ] Usuário já autenticado é redirecionado de /onboarding para /dashboard
