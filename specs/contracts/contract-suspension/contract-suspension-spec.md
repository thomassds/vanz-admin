# Feature: Contract Suspension (Frontend)

## Objetivo

Permitir que o tenant suspenda um contrato ativo, informando obrigatoriamente um motivo. A suspensão cancela todos os recebíveis em aberto — sendo uma ação com impacto financeiro significativo, exige confirmação explícita do usuário antes de ser executada.

---

## Contexto

A suspensão interrompe um contrato indefinidamente (ex.: inadimplência, solicitação do cliente). **Todos os recebíveis pendentes/vencidos são cancelados** no momento da suspensão. Se o contrato for reativado posteriormente, novos recebíveis são gerados a partir da reativação — os anteriores não são restaurados.

O backend registra o motivo em `suspendReason` e a data em `suspendedAt`. O status resultante no banco é `inactive` (valor 1), exibido no frontend como "Suspenso".

Um evento `CONTRACT_SUSPENDED` é registrado no histórico com o motivo informado.

---

## Regras de Negócio

- Somente contratos com status `active` podem ser suspensos — botão visível **apenas** para `status === 'active'`.
- `reason` é **obrigatório**, mínimo 3 caracteres e máximo 500 caracteres.
- **Todos os recebíveis em aberto (pendentes e vencidos) são cancelados** no momento da suspensão — ação com impacto financeiro irreversível nos recebíveis.
- O contrato em si pode ser reativado via "Ativar contrato", mas os recebíveis cancelados **não são restaurados** — novos recebíveis são gerados a partir da reativação.
- O modal deve exibir aviso claro sobre o cancelamento dos recebíveis e solicitar confirmação explícita antes de prosseguir.
- Após suspensão bem-sucedida: status muda para `inactive`, dados do contrato e histórico são recarregados.

---

## Fluxo

```
1. Usuário acessa /contracts/:id com status active
2. Clica no botão "Suspender contrato"
3. Modal de suspensão abre com textarea de motivo
4. Usuário digita o motivo (obrigatório, mín. 3 chars)
5. Usuário clica em "Confirmar suspensão"
6. API POST /contracts/:id/suspend
7. Modal fecha, toast de sucesso, dados do contrato recarregados
```

---

## Tela

### Botão "Suspender contrato" — `ContractDetailPage`

- Localizado no header da seção "Dados do contrato", ao lado dos demais botões de ação
- Renderizado **somente** quando `contract.status === 'active'`
- Estilo: borda amarela / texto amarelo (`border-yellow-300 text-yellow-700`) — ação de aviso
- Sem tooltip especial (o botão já some quando não aplicável)

### Modal de Suspensão — `SuspendContractModal`

Título: **Suspender contrato**

#### Aviso visual (bloco de alerta destacado — obrigatório)

Exibir antes do campo de motivo, com destaque visual (fundo amarelo/laranja):
> "Atenção: todos os recebíveis em aberto deste contrato serão cancelados. Se o contrato for reativado no futuro, novos recebíveis serão gerados a partir da reativação — os anteriores não serão restaurados."

#### Campos

| Campo   | Tipo     | Obrigatório | Comportamento                               |
|---------|----------|-------------|----------------------------------------------|
| Motivo  | textarea | Sim         | Mín. 3 / máx. 500 caracteres; contador de chars |

#### Confirmação explícita

Exibir checkbox obrigatório abaixo do motivo:
> `[ ] Entendo que os recebíveis em aberto serão cancelados e não poderão ser restaurados.`

O botão "Confirmar suspensão" só fica habilitado quando o checkbox estiver marcado **e** o motivo válido.

#### Botões

- **Voltar** — fecha o modal sem salvar
- **Confirmar suspensão** — submete; desabilitado se checkbox não marcado ou durante loading, texto "Suspendendo..."

---

## Integração com API

| Ação               | Endpoint                        | Método |
|--------------------|---------------------------------|--------|
| Suspender contrato | `/contracts/:id/suspend`        | POST   |

### Payload

```ts
interface SuspendContractDTO {
  reason: string  // obrigatório, mín. 3, máx. 500 chars
}
```

### Resposta de sucesso (HTTP 200)

```ts
// axiosBaseQuery já desembrulha result.data.data
interface SuspendContractResponse {
  contractId: string
  status: 'inactive'   // o backend usa 'inactive' para representar suspenso
  suspendedAt: string  // ISO timestamp
  reason: string
}
```

### Invalidação de cache

Deve invalidar `[{ type: 'Contract', id }]` — recarrega `getContractById` e `getContractHistory`.

---

## Validação (Zod)

```ts
const suspendContractSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(3, 'Motivo deve ter no mínimo 3 caracteres')
    .max(500, 'Motivo deve ter no máximo 500 caracteres'),
})
```

---

## Tipos TypeScript

```ts
interface SuspendContractDTO {
  reason: string
}

interface SuspendContractResponse {
  contractId: string
  status: 'inactive'
  suspendedAt: string
  reason: string
}
```

---

## Estados da Tela

| Estado                            | Comportamento                                                                          |
|-----------------------------------|----------------------------------------------------------------------------------------|
| Status diferente de `active`      | Botão "Suspender contrato" não renderizado                                            |
| Status `active`                   | Botão "Suspender contrato" visível                                                    |
| Modal aberto                      | Aviso destacado visível, textarea vazia, checkbox desmarcado                          |
| Checkbox desmarcado               | Botão "Confirmar suspensão" desabilitado                                              |
| Motivo inválido + checkbox marcado| Botão "Confirmar suspensão" desabilitado                                              |
| Motivo válido + checkbox marcado  | Botão "Confirmar suspensão" habilitado                                                |
| Loading (suspendendo)             | Botão "Confirmar suspensão" desabilitado com texto "Suspendendo..."                   |
| Sucesso                           | Modal fecha, toast "Contrato suspenso com sucesso.", cache invalidado                 |
| Erro `CONTRACT_ALREADY_SUSPENDED` | Mensagem inline "Este contrato já está suspenso."                                     |
| Erro `INVALID_CONTRACT_STATUS`    | Mensagem inline "Apenas contratos ativos podem ser suspensos."                        |
| Erro genérico                     | Mensagem inline "Algo deu errado. Tente novamente."                                   |

---

## Erros Esperados

| Código da API                | Mensagem para o usuário                            |
|------------------------------|----------------------------------------------------|
| `CONTRACT_NOT_FOUND`         | "Contrato não encontrado."                         |
| `CONTRACT_ALREADY_SUSPENDED` | "Este contrato já está suspenso."                  |
| `INVALID_CONTRACT_STATUS`    | "Apenas contratos ativos podem ser suspensos."     |
| `VALIDATION_ERROR`           | "Motivo deve ter entre 3 e 500 caracteres."        |
| `TENANT_ACCESS_DENIED`       | "Acesso negado."                                   |
| `UNAUTHORIZED`               | Redirect para /login                               |

---

## Arquivos a Criar / Modificar

| Arquivo                                                              | Ação      |
|----------------------------------------------------------------------|-----------|
| `features/contracts/schemas/suspend-contract.schema.ts`             | Criar     |
| `features/contracts/utils/contractSuspensionErrors.ts`              | Criar     |
| `features/contracts/components/SuspendContractModal.tsx`            | Criar     |
| `features/contracts/types/contract.types.ts`                        | Modificar — adicionar `SuspendContractDTO` e `SuspendContractResponse` |
| `features/contracts/store/contractsApi.ts`                          | Modificar — adicionar mutation `suspendContract` |
| `features/contracts/pages/ContractDetailPage.tsx`                   | Modificar — botão condicional + estado do modal + toast |

---

## Critérios de Aceite

- [ ] Botão "Suspender contrato" visível apenas quando `contract.status === 'active'`
- [ ] Botão não renderizado para qualquer outro status
- [ ] Modal abre com aviso destacado sobre cancelamento dos recebíveis
- [ ] Modal abre com textarea vazia e checkbox desmarcado
- [ ] Botão "Confirmar suspensão" desabilitado até checkbox marcado e motivo válido
- [ ] Validação: motivo obrigatório, mín. 3 chars, máx. 500 chars
- [ ] Contador de caracteres exibido no textarea
- [ ] Submissão envia `reason` no body
- [ ] Toast de sucesso após suspensão: "Contrato suspenso com sucesso."
- [ ] Cache do contrato e do histórico invalidados após suspensão
- [ ] Erros da API exibidos com mensagem amigável no modal
- [ ] Botão "Confirmar suspensão" desabilitado durante loading
