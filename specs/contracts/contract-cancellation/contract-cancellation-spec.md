# Feature: Contract Cancellation (Frontend)

## Objetivo

Permitir que o tenant cancele um contrato diretamente da página de detalhe, informando obrigatoriamente um motivo. O cancelamento é irreversível — contratos cancelados não podem ser reativados nem renovados.

---

## Contexto

O cancelamento encerra definitivamente um contrato, independente do status atual (ativo, suspenso, pendente). Um motivo é obrigatório para rastreabilidade. Após o cancelamento, o evento `CONTRACT_CANCELED` é registrado no histórico com o motivo informado.

---

## Regras de Negócio

- Contrato com status `canceled` **não pode** ser cancelado novamente — botão desabilitado.
- `reason` é **obrigatório**, mínimo 3 caracteres e máximo 500 caracteres.
- O cancelamento é irreversível — não há desfazer no frontend.
- Após cancelamento bem-sucedido: status muda para `canceled`, dados do contrato são recarregados e histórico é atualizado.

---

## Fluxo

```
1. Usuário acessa /contracts/:id
2. Clica no botão "Cancelar contrato" (desabilitado se status = canceled)
3. Modal de confirmação abre com campo de motivo
4. Usuário digita o motivo (obrigatório, mín. 3 chars)
5. Usuário clica em "Confirmar cancelamento"
6. API POST /contracts/:id/cancel
7. Modal fecha, toast de sucesso, dados do contrato recarregados
```

---

## Tela

### Botão "Cancelar contrato" — `ContractDetailPage`

- Localizado no header da seção "Dados do contrato", ao lado dos botões "Renovar contrato" e "Editar contrato"
- Desabilitado quando `contract.status === 'canceled'`
- Tooltip: "Este contrato já foi cancelado" quando desabilitado
- Estilo diferenciado (borda vermelha / texto vermelho) para indicar ação destrutiva

### Modal de Cancelamento — `CancelContractModal`

Título: **Cancelar contrato**

#### Campos

| Campo   | Tipo     | Obrigatório | Comportamento                              |
|---------|----------|-------------|---------------------------------------------|
| Motivo  | textarea | Sim         | Mín. 3 / máx. 500 caracteres; contador de chars |

#### Aviso visual

Exibir bloco de alerta destacado informando que o cancelamento é irreversível:
> "Esta ação é irreversível. O contrato não poderá ser reativado após o cancelamento."

#### Botões

- **Voltar** — fecha o modal sem salvar
- **Confirmar cancelamento** — submete; estilo destrutivo (vermelho); desabilitado durante loading

---

## Integração com API

| Ação               | Endpoint                       | Método |
|--------------------|--------------------------------|--------|
| Cancelar contrato  | `/contracts/:id/cancel`        | POST   |

### Payload

```ts
interface CancelContractDTO {
  reason: string  // obrigatório, mín. 3, máx. 500 chars
}
```

### Resposta de sucesso (HTTP 200)

```ts
// axiosBaseQuery já desembrulha result.data.data
interface CancelContractResponse {
  contractId: string
  status: 'canceled'
  canceledAt: string  // ISO timestamp
  reason: string
}
```

### Invalidação de cache

Deve invalidar `[{ type: 'Contract', id }]` — recarrega `getContractById` e `getContractHistory`.

---

## Validação (Zod)

```ts
const cancelContractSchema = z.object({
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
interface CancelContractDTO {
  reason: string
}

interface CancelContractResponse {
  contractId: string
  status: 'canceled'
  canceledAt: string
  reason: string
}
```

---

## Estados da Tela

| Estado                           | Comportamento                                                           |
|----------------------------------|-------------------------------------------------------------------------|
| Contrato cancelado               | Botão "Cancelar contrato" desabilitado com tooltip                     |
| Modal aberto                     | Textarea de motivo vazia, foco automático                              |
| Loading (cancelando)             | Botão "Confirmar cancelamento" desabilitado com texto "Cancelando..."  |
| Sucesso                          | Modal fecha, toast "Contrato cancelado com sucesso.", cache invalidado |
| Erro `CONTRACT_ALREADY_CANCELED` | Mensagem inline "Este contrato já foi cancelado"                       |
| Erro `INVALID_CANCEL_REASON`     | Mensagem inline "Motivo deve ter entre 3 e 500 caracteres"            |
| Erro genérico                    | Mensagem inline "Algo deu errado. Tente novamente."                   |

---

## Erros Esperados

| Código da API               | Mensagem para o usuário                        |
|-----------------------------|------------------------------------------------|
| `CONTRACT_NOT_FOUND`        | "Contrato não encontrado."                     |
| `CONTRACT_ALREADY_CANCELED` | "Este contrato já foi cancelado."              |
| `INVALID_CANCEL_REASON`     | "Motivo deve ter entre 3 e 500 caracteres."    |
| `TENANT_ACCESS_DENIED`      | "Acesso negado."                               |
| `UNAUTHORIZED`              | Redirect para /login                           |

---

## Arquivos a Criar / Modificar

| Arquivo                                                              | Ação      |
|----------------------------------------------------------------------|-----------|
| `features/contracts/schemas/cancel-contract.schema.ts`              | Criar     |
| `features/contracts/utils/contractCancellationErrors.ts`            | Criar     |
| `features/contracts/components/CancelContractModal.tsx`             | Criar     |
| `features/contracts/types/contract.types.ts`                        | Modificar — adicionar `CancelContractDTO` e `CancelContractResponse` |
| `features/contracts/store/contractsApi.ts`                          | Modificar — adicionar mutation `cancelContract` |
| `features/contracts/pages/ContractDetailPage.tsx`                   | Modificar — botão + modal |

---

## Critérios de Aceite

- [ ] Botão "Cancelar contrato" visível na `ContractDetailPage`
- [ ] Botão desabilitado quando `contract.status === 'canceled'` com tooltip
- [ ] Modal abre com textarea de motivo vazia
- [ ] Aviso de ação irreversível visível no modal
- [ ] Validação: motivo obrigatório, mín. 3 chars, máx. 500 chars
- [ ] Contador de caracteres exibido no textarea
- [ ] Submissão envia `reason` no body
- [ ] Toast de sucesso após cancelamento: "Contrato cancelado com sucesso."
- [ ] Cache do contrato e do histórico invalidados após cancelamento
- [ ] Erros da API exibidos com mensagem amigável no modal
- [ ] Botão "Confirmar cancelamento" desabilitado durante loading
