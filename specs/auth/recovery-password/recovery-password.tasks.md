# Tasks: Recovery Password (Frontend)

> Ref: `specs/auth/recovery-password/recovery-password-spec.md`

---

## Store

- [x] Adicionar endpoint `recoveryPassword` em `features/auth/store/authApi.ts` (`POST /auth/recovery-password`, recebe `userId` + `type` + `code` + `password`)
  > Nota: o DTO real do backend (`RecoveryPasswordDtoSchema`) exige `userId`/`type`, não apenas `email` — o `userId` é obtido na resposta do `requestCode` do Step 1 e carregado entre steps via state da página.
- [x] Reutilizar endpoint `requestCode` já criado no onboarding (`POST /auth/request-code`)
  > Nota: `userId` foi tornado opcional em `RequestCodeRequest` — no fluxo de recuperação o usuário só tem o e-mail, e o backend resolve o usuário por e-mail quando `channel: 'email'`.
- [x] Reutilizar endpoint `validateCode` já criado no onboarding (`POST /auth/validate-code`)
  - [x] Adicionar campo opcional `justCheck` ao `ValidateCodeRequest`, usado no Step 2 para validar o código sem consumi-lo (a senha só é redefinida de fato no Step 3, via `recoveryPassword`)

---

## Schemas

- [x] Criar `features/auth/schemas/recovery-password.schema.ts`
  - [x] `requestCodeSchema` + `RequestCodeFormData` (Step 1 — apenas `email`)
  - [x] `resetPasswordSchema` + `ResetPasswordFormData` (Step 3 — `password` + `confirmPassword`, com `refine` garantindo que as senhas coincidam)
    > Nota: o `code` não faz parte do schema do formulário — é um dado já validado no Step 2 e carregado via prop/state da página, no mesmo padrão usado por `userId` nos formulários do onboarding.
- [x] Reutilizar `codeSchema` do onboarding (`features/auth/schemas/onboarding.schema.ts`) para o input do código no Step 2

---

## Componentes

- [x] Criar `features/auth/components/recovery-password/RequestCodeForm.tsx` (Step 1 — input de e-mail)
- [x] Criar `features/auth/components/recovery-password/EmailCodeForm.tsx` (Step 2 — chama `validateCode` com `justCheck: true`, sem auto-envio no mount)
  > Nota: não foi reutilizado o `EmailCodeForm` do onboarding (`components/onboarding/EmailCodeForm.tsx`) — ele dispara `requestCode` automaticamente no mount e valida sem `justCheck`, comportamento incompatível com este fluxo (o código aqui já foi enviado pelo `RequestCodeForm` do Step 1, e não deve ser consumido até o Step 3). Foi criado um componente próprio em `components/recovery-password/`, reaproveitando apenas `codeSchema` e o hook `useCodeTimer`.
- [x] Criar `features/auth/components/recovery-password/ResetPasswordForm.tsx` (Step 3 — nova senha + confirmação; `code` recebido via prop)
- [x] Reutilizar `useCodeTimer` hook já criado no onboarding (reenvio de código habilitado após 60s)

---

## Pages

- [x] Criar `features/auth/pages/RecoveryPasswordPage.tsx`
  - [x] Controle de step via `useState` (3 steps: `request-code` → `email-code` → `reset-password`)
  - [x] Manter e-mail, `userId` e código validado entre steps
  - [x] Após sucesso no Step 3: redirect para `/login` com mensagem de sucesso
    > Nota: o projeto não tem biblioteca de toast — a mensagem é passada via `navigate('/login', { state: { successMessage } })` e exibida pela `LoginPage` como um banner inline, no mesmo padrão de `location.state` já usado pelo `OnboardingPage`/`LoginForm` para retomada de fluxo.
  - [x] Default export

---

## Rotas

- [x] Adicionar rota `/recovery-password` dentro do `GuestRoute` em `routes/`

---

## Mapeamento de Erros

- [x] Reutilizar `features/auth/utils/authErrorMessages.ts` já existente — `USER_NOT_FOUND`, `INVALID_CODE`, `CODE_EXPIRED` e `WEAK_PASSWORD` já estão mapeados, não foi necessário criar novas entradas

---

## Testes

- [x] Teste: Step 1 envia código para o e-mail informado
- [x] Teste: erro `USER_NOT_FOUND` exibido corretamente no Step 1
- [x] Teste: Step 2 valida o código (`justCheck: true`) e avança para o Step 3 sem redefinir a senha
- [x] Teste: erro `INVALID_CODE` exibido corretamente no Step 2
- [x] Teste: Step 3 valida se senhas coincidem antes de submeter
- [x] Teste: erro `WEAK_PASSWORD` exibido corretamente no Step 3
- [x] Teste: redirect para `/login` após sucesso no Step 3, com a mensagem de sucesso exibida
- [x] Teste: link de reenvio de código habilitado após 60 segundos (cobre componente isolado em `EmailCodeForm.test.tsx`, e o estado inicial do timer em `RecoveryPasswordPage.test.tsx`)
- [x] Teste: `EmailCodeForm` chama `validateCode` com `justCheck: true` e propaga o código validado para o Step 3
