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
