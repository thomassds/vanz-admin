# Tasks: Login (Frontend)

> Ref: `specs/auth/login/login-spec.md`

---

## Store

- [x] Criar `features/auth/store/authSlice.ts` com actions `setCredentials` e `logout` e selectors `selectAuth`, `selectIsAuthenticated`, `selectCurrentUser`
- [x] Criar `features/auth/store/authApi.ts` com endpoint `login` (RTK Query mutation)
- [x] Registrar `authSlice` e `authApi` no `app/store.ts`

---

## Schema e Tipos

- [x] Criar `features/auth/schemas/login.schema.ts` com `loginSchema` e `LoginFormData`
- [x] Criar `features/auth/types/auth.types.ts` com interfaces `User` e `AuthCredentials`

---

## Componentes

- [x] Criar `features/auth/components/LoginForm.tsx`
  - [x] Integrar React Hook Form + Zod (`loginSchema`)
  - [x] Chamar mutation `useLoginMutation` no submit
  - [x] Exibir erros inline por campo
  - [x] Exibir erro de API acima do botão
  - [x] Desabilitar botão durante loading
  - [x] Após sucesso: dispatch `setCredentials` e redirect para `/dashboard`
  - [x] Após sucesso, se `user.validatedEmailAt`/`taxIdentifier`/`validatedPhoneAt`/`tenant` indicarem onboarding incompleto, redirecionar para `/onboarding` no step correspondente em vez de autenticar:
    - `validatedEmailAt` é `null` → step `email-code`
    - `taxIdentifier` é `null` → step `personal-data` (CPF/CNPJ e telefone ainda não foram coletados)
    - `taxIdentifier` preenchido mas `validatedPhoneAt` é `null` → step `phone-code` (telefone já coletado, falta confirmar o código)
    - `tenant` é `null` → step `company-data` (usuário ainda não cadastrou a empresa)
    > Nota: a API de login passou a retornar `accessToken` (não `token`), os campos `taxIdentifier`/`phone` (mascarado/`null` se não cadastrado) e `validatedEmailAt`/`validatedPhoneAt` (`Date | null`) dentro de `user`, e um campo `tenant: { id, name } | null` no nível raiz da resposta. `authApi.ts` usa `transformResponse` para mapear `accessToken` → `token` e repassar `tenant` sem alterar o restante do app. `setCredentials` só é disparado quando todas as quatro condições indicam onboarding completo; caso contrário o usuário é enviado para `/onboarding` via `navigate(state)` (sem persistir nada no Redux/localStorage), evitando que o `GuestRoute` o redirecione de volta. A retomada em `phone-code` depende do `PhoneCodeForm` disparar o `requestCode` no mount (ver `specs/auth/onboarding/onboarding.tasks.md`). A checagem de `tenant` resolve o caso de borda antes documentado como não tratado ("telefone validado mas empresa não cadastrada").

---

## Pages

- [x] Criar `features/auth/pages/LoginPage.tsx`
  - [x] Usar `AuthLayout`
  - [x] Compor `LoginForm`
  - [x] Links para `/recovery-password` e `/onboarding`
  - [x] Default export (para React.lazy)

---

## Mapeamento de Erros

- [x] Criar `features/auth/utils/authErrorMessages.ts` com mapeamento de erros da API para mensagens amigáveis

---

## Rotas

- [x] Adicionar rota `/login` dentro do `GuestRoute` em `routes/`
- [x] Garantir que usuário autenticado seja redirecionado de `/login` → `/dashboard`

---

## Testes

- [x] Teste: submissão com dados válidos chama a mutation de login
- [x] Teste: erro `INVALID_CREDENTIALS` exibe mensagem correta
- [x] Teste: erro `EMAIL_NOT_VALIDATED` exibe mensagem correta
- [x] Teste: campos inválidos exibem erro de validação inline
- [x] Teste: botão fica desabilitado durante o loading
- [x] Teste: redireciona para onboarding no step de e-mail quando `validatedEmailAt` é `null`
- [x] Teste: redireciona para onboarding no step de dados pessoais quando `taxIdentifier` é `null`
- [x] Teste: redireciona para onboarding no step de validação de telefone quando `taxIdentifier` existe mas `validatedPhoneAt` é `null`
- [x] Teste: redireciona para onboarding no step de empresa quando `tenant` é `null`
