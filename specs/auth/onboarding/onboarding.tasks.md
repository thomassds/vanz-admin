# Tasks: Onboarding (Frontend)

> Ref: `specs/auth/onboarding/onboarding-spec.md`

---

## Store

- [ ] Criar `features/auth/store/authApi.ts` endpoints: `onboarding`, `requestCode`, `validateCode`

---

## Schemas

- [ ] Criar `features/auth/schemas/onboarding.schema.ts`
  - [ ] `accountSchema` + `AccountFormData`
  - [ ] `codeSchema` + `CodeFormData`
  - [ ] `personalDataSchema` + `PersonalDataFormData`
  - [ ] `companyDataSchema` + `CompanyDataFormData`

---

## Componentes

- [ ] Criar `features/auth/components/onboarding/AccountForm.tsx` (nome, e-mail, senha, confirmar senha)
- [ ] Criar `features/auth/components/onboarding/EmailCodeForm.tsx` (input de código + timer de reenvio)
- [ ] Criar `features/auth/components/onboarding/PersonalDataForm.tsx` (CPF/CNPJ, telefone, endereço)
- [ ] Criar `features/auth/components/onboarding/PhoneCodeForm.tsx` (input de código + timer de reenvio)
- [ ] Criar `features/auth/components/onboarding/CompanyDataForm.tsx` (nome empresa, CNPJ empresa)
- [ ] Criar `features/auth/components/onboarding/StepIndicator.tsx` (indicador de progresso visual)

---

## Pages

- [ ] Criar `features/auth/pages/OnboardingPage.tsx`
  - [ ] Controle de step via `useState`
  - [ ] Passar dados acumulados entre steps
  - [ ] Lógica de exibir Step 3 apenas para Admin
  - [ ] Redirect para `/dashboard` após conclusão
  - [ ] Default export

---

## Utilitários

- [ ] Criar `features/auth/utils/authErrorMessages.ts` (se ainda não criado no login)
- [ ] Criar hook `features/auth/hooks/useCodeTimer.ts` para o countdown de reenvio de código

---

## Rotas

- [ ] Adicionar rota `/onboarding` dentro do `GuestRoute` em `routes/`

---

## Testes

- [ ] Teste: avança para próximo step após validação com sucesso
- [ ] Teste: não avança se campos do step atual forem inválidos
- [ ] Teste: erro `EMAIL_ALREADY_EXISTS` exibido corretamente
- [ ] Teste: erro `INVALID_CODE` exibido corretamente
- [ ] Teste: timer de reenvio de código funciona corretamente
- [ ] Teste: Step 3 exibido apenas para perfil Admin
