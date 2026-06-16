# Feature: Login (Frontend)

## Objetivo

Permitir que o usuário se autentique na plataforma e acesse a área protegida da aplicação.

---

## Contexto

Tela de entrada do sistema. Todo acesso à área autenticada exige login válido com e-mail e senha. Usuários já autenticados não devem ver esta tela — são redirecionados direto para o dashboard.

---

## Fluxo de Tela

### Step 1 — Formulário de Login

```
1. Usuário acessa /login
2. Preenche e-mail e senha
3. Clica em "Entrar"
4. Sistema desabilita o botão e exibe loading
5. Sucesso → salva credenciais no Redux + localStorage, redireciona para /dashboard
6. Erro de API → exibe mensagem de erro adequada ao usuário
7. Erro de validação → exibe erro inline abaixo do campo
```

---

## Tela: LoginPage

### Elementos da Tela

| Elemento                    | Tipo     | Obrigatório |
| --------------------------- | -------- | ----------- |
| Campo E-mail                | input email | Sim      |
| Campo Senha                 | input password | Sim  |
| Botão "Entrar"              | button submit | Sim    |
| Link "Esqueceu a senha?"    | link → /recovery-password | Não |
| Link "Criar conta"          | link → /onboarding | Não   |

### Estados da Tela

| Estado      | Comportamento                                              |
| ----------- | ---------------------------------------------------------- |
| Idle        | Formulário habilitado, botão ativo                         |
| Loading     | Botão com spinner e desabilitado, campos bloqueados        |
| Erro inline | Mensagem de validação abaixo do campo com borda vermelha   |
| Erro de API | Mensagem de erro acima do botão de submit                  |
| Sucesso     | Redirect para /dashboard sem flash de tela                 |

---

## Integração com API

| Ação  | Endpoint       | Método |
| ----- | -------------- | ------ |
| Login | `/api/v1/auth` | POST   |

### Payload enviado

```json
{
  "email": "string",
  "password": "string"
}
```

### Resposta de sucesso

```json
{
  "success": true,
  "data": {
    "token": "jwt_string",
    "user": {
      "id": "uuid",
      "name": "string",
      "email": "string"
    }
  }
}
```

---

## Estado Redux após login

```ts
// authSlice.setCredentials chamado com:
{
  user: { id, name, email },
  token: "jwt_string"
}

// Token também salvo no localStorage para persistência entre reloads
```

---

## Validação (Zod)

```ts
z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
})
```

---

## Erros Esperados

| Código da API         | Mensagem para o usuário                                          |
| --------------------- | ---------------------------------------------------------------- |
| `USER_NOT_FOUND`      | "E-mail não cadastrado na plataforma"                            |
| `INVALID_CREDENTIALS` | "Senha incorreta"                                                |
| `EMAIL_NOT_VALIDATED` | "Seu e-mail ainda não foi validado. Verifique sua caixa de entrada." |
| `VALIDATION_ERROR`    | Erros de campo exibidos inline                                   |
| Erro genérico (5xx)   | "Algo deu errado. Tente novamente."                              |

---

## Critérios de Aceite

- [ ] Formulário valida e-mail e senha antes de chamar a API
- [ ] Botão exibe loading e fica desabilitado durante a requisição
- [ ] Após sucesso: credenciais salvas no Redux e no localStorage
- [ ] Após sucesso: redirect para /dashboard
- [ ] Erros da API exibidos com mensagem amigável ao usuário
- [ ] Erros de validação exibidos inline abaixo do campo
- [ ] Link "Esqueceu a senha?" navega para /recovery-password
- [ ] Link "Criar conta" navega para /onboarding
- [ ] Usuário já autenticado é redirecionado de /login para /dashboard automaticamente
