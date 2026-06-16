# Tasks: Onboarding (Frontend)

> Ref: `specs/auth/onboarding/onboarding-spec.md`

---

## Store

- [x] Criar `features/auth/store/authApi.ts` endpoints: `onboarding`, `requestCode`, `validateCode`
  - Nota: adicionados também `savePersonalData` (`POST /auth/onboarding/personal`) e `createCompany` (`POST /auth/onboarding/company`), necessários porque o contrato real do backend separa esses payloads do endpoint `onboarding` (ver `auth.controller.ts`).

---

## Schemas

- [x] Criar `features/auth/schemas/onboarding.schema.ts`
  - [x] `accountSchema` + `AccountFormData`
  - [x] `codeSchema` + `CodeFormData`
  - [x] `personalDataSchema` + `PersonalDataFormData`
  - [x] `companyDataSchema` + `CompanyDataFormData`
  - Nota: campos de `personalDataSchema`/`companyDataSchema` foram ajustados para bater com `PersonalDataDtoSchema`/`CompanyDataDtoSchema` do backend (ex: `zipCode`, `street`, `neighborhood`, `city`, `state`, `number` em vez de um único campo `address`).

---

## Componentes

- [x] Criar `features/auth/components/onboarding/AccountForm.tsx` (nome, e-mail, senha, confirmar senha)
- [x] Criar `features/auth/components/onboarding/EmailCodeForm.tsx` (input de código + timer de reenvio)
  - Nota: o envio automático do código de e-mail ao entrar no step (`requestCode` no mount, com guarda via `useRef` contra o duplo-efeito do StrictMode) vive dentro do próprio `EmailCodeForm`, não no `AccountForm`. Isso é necessário porque o usuário pode chegar a este step por dois caminhos — fluxo normal de onboarding (após `AccountForm`) ou retomada após login com e-mail não validado (ver `specs/auth/login/login.tasks.md`) — e só o componente do step sabe, de forma independente da origem, que precisa disparar o envio.
- [x] Criar `features/auth/components/onboarding/PersonalDataForm.tsx` (CPF/CNPJ, telefone, endereço)
  - Nota: não dispara mais `requestCode` no submit — essa responsabilidade foi movida para o `PhoneCodeForm` (mesmo motivo do `EmailCodeForm`, ver nota abaixo).
- [x] Criar `features/auth/components/onboarding/PhoneCodeForm.tsx` (input de código + timer de reenvio)
  - Nota: assim como o `EmailCodeForm`, o envio automático do código (`requestCode` no mount, com guarda `useRef`) vive dentro do próprio `PhoneCodeForm`. É necessário porque o usuário pode chegar a este step retomando o login com `taxIdentifier` já cadastrado mas `validatedPhoneAt` ainda `null` (ver `specs/auth/login/login.tasks.md`), caso em que o `PersonalDataForm` nunca roda nesta sessão. A prop `phone` é opcional: no fluxo normal vem do `PersonalDataForm`; na retomada via login ela vem de `user.phone` (a API de login passou a retornar esse campo) — quando indisponível por algum motivo, o texto cai para "o telefone cadastrado". O backend resolve o destinatário do código por `userId` (`RequestCodeUseCase.resolveUser`), então o envio funciona mesmo sem o frontend conhecer o número.
- [x] Criar `features/auth/components/onboarding/CompanyDataForm.tsx` (nome empresa, CNPJ empresa)
- [x] Criar `features/auth/components/onboarding/StepIndicator.tsx` (indicador de progresso visual)

---

## Pages

- [x] Criar `features/auth/pages/OnboardingPage.tsx`
  - [x] Controle de step via `useState`
  - [x] Passar dados acumulados entre steps
  - [x] Lógica de exibir Step 3 apenas para Admin (`isAdmin` prop, default `true` — onboarding hoje só é feito por admins)
  - [x] Redirect para `/dashboard` após conclusão (login automático com email/senha do step 1 para obter token, já que os endpoints de onboarding não retornam credenciais)
  - [x] Default export
  - [x] Permitir retomar em um step específico via `location.state` (tipo `OnboardingResumeState` em `features/auth/types/onboarding.types.ts`), usado pelo `LoginForm` para reenviar o usuário ao step em que parou com base em `validatedEmailAt` (→ `email-code`), `taxIdentifier` (→ `personal-data`), `validatedPhoneAt` (→ `phone-code`) e `tenant` (→ `company-data`)

---

## Utilitários

- [x] Criar `features/auth/utils/authErrorMessages.ts` (se ainda não criado no login)
- [x] Criar hook `features/auth/hooks/useCodeTimer.ts` para o countdown de reenvio de código

---

## Rotas

- [x] Adicionar rota `/onboarding` dentro do `GuestRoute` em `routes/`

---

## Testes

- [x] Teste: avança para próximo step após validação com sucesso
- [x] Teste: não avança se campos do step atual forem inválidos
- [x] Teste: erro `EMAIL_ALREADY_EXISTS` exibido corretamente
- [x] Teste: erro `INVALID_CODE` exibido corretamente
- [x] Teste: timer de reenvio de código funciona corretamente
- [x] Teste: Step 3 exibido apenas para perfil Admin
