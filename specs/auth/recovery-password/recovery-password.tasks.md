# Tasks: Recovery Password (Frontend)

> Ref: `specs/auth/recovery-password/recovery-password-spec.md`

---

## Store

- [ ] Adicionar endpoint `recoveryPassword` em `features/auth/store/authApi.ts`
- [ ] Reutilizar endpoint `requestCode` já criado no onboarding

---

## Schemas

- [ ] Criar `features/auth/schemas/recovery-password.schema.ts`
  - [ ] `requestCodeSchema` + `RequestCodeFormData`
  - [ ] `resetPasswordSchema` + `ResetPasswordFormData`

---

## Componentes

- [ ] Criar `features/auth/components/recovery-password/RequestCodeForm.tsx` (input de e-mail)
- [ ] Criar `features/auth/components/recovery-password/ResetPasswordForm.tsx` (código + nova senha + confirmação)
- [ ] Reutilizar `useCodeTimer` hook já criado no onboarding

---

## Pages

- [ ] Criar `features/auth/pages/RecoveryPasswordPage.tsx`
  - [ ] Controle de step via `useState`
  - [ ] Manter e-mail entre steps
  - [ ] Após sucesso: redirect para `/login`
  - [ ] Default export

---

## Rotas

- [ ] Adicionar rota `/recovery-password` dentro do `GuestRoute` em `routes/`

---

## Testes

- [ ] Teste: Step 1 envia código para o e-mail informado
- [ ] Teste: erro `USER_NOT_FOUND` exibido corretamente
- [ ] Teste: Step 2 valida se senhas coincidem antes de submeter
- [ ] Teste: erro `INVALID_CODE` exibido corretamente
- [ ] Teste: redirect para /login após sucesso
