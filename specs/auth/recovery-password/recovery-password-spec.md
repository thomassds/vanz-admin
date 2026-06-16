# Feature: Recovery Password (Frontend)

## Objetivo

Permitir que o usuário recupere o acesso à conta caso tenha esquecido a senha.

---

## Contexto

Fluxo de 2 etapas: o usuário informa o e-mail, recebe um código de recuperação e em seguida define uma nova senha.

---

## Fluxo de Tela

### Step 1 — Solicitar Recuperação

```
1. Usuário acessa /recovery-password
2. Informa o e-mail cadastrado
3. Clica em "Enviar código"
4. API envia código para o e-mail informado
5. Usuário é levado para o Step 2
```

### Step 2 — Validar Código e Nova Senha

```
1. Usuário informa o código de 6 dígitos recebido por e-mail
2. Usuário informa a nova senha e confirmação
3. Clica em "Redefinir senha"
4. API valida o código e atualiza a senha
5. Usuário é redirecionado para /login com mensagem de sucesso
```

---

## Telas

### RecoveryPasswordPage — Container Multi-Step

| Step | Componente              | Descrição                             |
| ---- | ----------------------- | ------------------------------------- |
| 1    | `RequestCodeForm`       | Input de e-mail + botão enviar        |
| 2    | `ResetPasswordForm`     | Código + nova senha + confirmação     |

---

## Integração com API

| Ação              | Endpoint                        | Método |
| ----------------- | ------------------------------- | ------ |
| Solicitar código  | `/api/v1/auth/request-code`     | POST   |
| Redefinir senha   | `/api/v1/auth/recovery-password`| POST   |

---

## Validação (Zod)

### Step 1 — requestCodeSchema
```ts
z.object({
  email: z.string().email('E-mail inválido'),
})
```

### Step 2 — resetPasswordSchema
```ts
z.object({
  code: z.string().length(6, 'Código deve ter 6 dígitos'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})
```

---

## Estados das Telas

| Estado          | Comportamento                                      |
| --------------- | -------------------------------------------------- |
| Loading         | Botão desabilitado com spinner                     |
| Erro de campo   | Mensagem inline abaixo do campo                    |
| Erro de API     | Mensagem acima do botão                            |
| Sucesso Step 1  | Avança para Step 2 com mensagem de confirmação     |
| Sucesso Step 2  | Redirect para /login com toast de sucesso          |
| Reenviar código | Link habilitado após 60 segundos                   |

---

## Erros Esperados

| Código da API    | Mensagem para o usuário                              |
| ---------------- | ---------------------------------------------------- |
| `USER_NOT_FOUND` | "E-mail não cadastrado na plataforma"                |
| `INVALID_CODE`   | "Código inválido"                                    |
| `CODE_EXPIRED`   | "Código expirado. Solicite um novo."                 |
| `WEAK_PASSWORD`  | "A nova senha não atende aos requisitos mínimos"     |

---

## Critérios de Aceite

- [ ] Usuário pode solicitar recuperação informando apenas o e-mail
- [ ] Feedback visual após envio do código ("Verifique seu e-mail")
- [ ] Link de reenvio de código habilitado após 60 segundos
- [ ] Validação de nova senha e confirmação antes de submeter
- [ ] Após redefinição com sucesso: redirect para /login com toast de sucesso
- [ ] Erros da API exibidos com mensagem amigável
