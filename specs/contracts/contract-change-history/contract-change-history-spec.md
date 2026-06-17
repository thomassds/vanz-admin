# Feature: Contract Change History (Frontend)

## Objetivo

Exibir na página de detalhe do contrato um histórico cronológico de todos os eventos que ocorreram no contrato: criação, edições, mudanças de status, renovações e vínculos de dependentes.

---

## Contexto

O histórico serve para auditoria e rastreabilidade da operação. Cada evento registra o tipo da ação, data/hora e os valores anterior e novo (quando aplicável). O histórico é somente-leitura — o usuário não pode editar nem excluir eventos.

O histórico fica como uma seção dentro da `ContractDetailPage` existente, não em rota separada.

---

## Tipos de Evento

| `eventType`           | Label PT-BR               | Exibe diff (old → new)? | Exibe metadata?     |
|-----------------------|---------------------------|-------------------------|---------------------|
| `CONTRACT_CREATED`    | Contrato criado           | Não                     | Não                 |
| `CONTRACT_UPDATED`    | Contrato atualizado       | Sim                     | Não                 |
| `CONTRACT_ACTIVATED`  | Contrato ativado          | Não                     | Não                 |
| `CONTRACT_SUSPENDED`  | Contrato suspenso         | Não                     | Sim (`reason`)      |
| `CONTRACT_CANCELED`   | Contrato cancelado        | Não                     | Sim (`reason`)      |
| `CONTRACT_RENEWED`    | Contrato renovado         | Sim                     | Não                 |
| `DEPENDENT_LINKED`    | Dependente vinculado      | Não                     | Sim (`dependentName`) |
| `DEPENDENT_UNLINKED`  | Dependente desvinculado   | Não                     | Sim (`dependentName`) |

---

## Fluxo

```
1. Usuário acessa /contracts/:id
2. Seção "Histórico" carrega automaticamente (page=1, limit=10)
3. Eventos exibidos em ordem cronológica decrescente (mais recente primeiro)
4. Usuário navega entre páginas da lista de eventos
5. Para eventos CONTRACT_UPDATED / CONTRACT_RENEWED: exibe campos alterados (oldValue → newValue)
6. Para eventos com metadata (suspenso, cancelado, dependente): exibe informação extra
```

---

## Tela

### Seção "Histórico" — dentro de `ContractDetailPage`

Localização: abaixo do card de dados do contrato e do link de recebíveis.

Elementos:
- Título "Histórico"
- Lista de eventos em ordem decrescente de `createdAt`
- Cada evento exibe:
  - **Ícone / badge** colorido conforme tipo
  - **Label** do tipo em PT-BR
  - **Data e hora** formatados (`dd/mm/yyyy às HH:mm`)
  - **Diff** (apenas para `CONTRACT_UPDATED` e `CONTRACT_RENEWED`): lista de campos alterados com valor anterior → novo valor
  - **Metadata extra** para eventos com `reason` ou `dependentName`
- Paginação (Anterior / Próxima)
- Skeleton durante loading
- Estado vazio: "Nenhum evento registrado para este contrato."
- Estado de erro: "Erro ao carregar histórico." + botão "Tentar novamente"

### Badge de evento por tipo

| Tipo              | Cor do badge       |
|-------------------|--------------------|
| `CONTRACT_CREATED` | Azul              |
| `CONTRACT_UPDATED` | Cinza/neutro      |
| `CONTRACT_ACTIVATED` | Verde           |
| `CONTRACT_SUSPENDED` | Amarelo/laranja |
| `CONTRACT_CANCELED` | Vermelho         |
| `CONTRACT_RENEWED` | Roxo/indigo       |
| `DEPENDENT_LINKED` | Ciano/teal        |
| `DEPENDENT_UNLINKED` | Cinza           |

---

## Integração com API

| Ação                      | Endpoint                          | Método |
|---------------------------|-----------------------------------|--------|
| Listar histórico do contrato | `/contracts/:id/history`       | GET    |

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Default | Max |
|-----------|------|-------------|---------|-----|
| `page`    | int  | Não         | 1       | —   |
| `limit`   | int  | Não         | 10      | 100 |

### Resposta

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "tenantId": "uuid",
        "contractId": "uuid",
        "eventType": "CONTRACT_UPDATED",
        "oldValue": { "value": 500, "dueDay": 5 },
        "newValue": { "value": 600, "dueDay": 10 },
        "metadata": null,
        "createdAt": "2026-06-17T14:30:00.000Z"
      }
    ],
    "page": 1,
    "limit": 10,
    "total": 4,
    "totalPages": 1
  }
}
```

---

## Tipos TypeScript

```ts
export type ContractEventType =
  | 'CONTRACT_CREATED'
  | 'CONTRACT_UPDATED'
  | 'CONTRACT_ACTIVATED'
  | 'CONTRACT_SUSPENDED'
  | 'CONTRACT_CANCELED'
  | 'CONTRACT_RENEWED'
  | 'DEPENDENT_LINKED'
  | 'DEPENDENT_UNLINKED'

export interface ContractHistoryEvent {
  id: string
  tenantId: string
  contractId: string
  eventType: ContractEventType
  oldValue: Record<string, unknown> | null
  newValue: Record<string, unknown> | null
  metadata: Record<string, unknown> | null
  createdAt: string
}

export interface ContractHistoryResponse {
  items: ContractHistoryEvent[]
  page: number
  limit: number
  total: number
  totalPages: number
}
```

---

## Renderização do Diff (`oldValue` → `newValue`)

Para eventos `CONTRACT_UPDATED` e `CONTRACT_RENEWED`, exibir somente os campos que mudaram:

```ts
// Campos com label legível para exibição no diff
const FIELD_LABELS: Record<string, string> = {
  value: 'Valor mensal',
  discount: 'Desconto',
  totalValue: 'Valor total',
  dueDay: 'Dia de vencimento',
  durationMonths: 'Duração (meses)',
  startDate: 'Data de início',
  endDate: 'Data de vencimento',
  firstPaymentDate: 'Primeiro pagamento',
  status: 'Status',
}
```

Campos de data (`startDate`, `endDate`, `firstPaymentDate`) devem ser formatados para `dd/mm/yyyy`.
Campos de valor (`value`, `discount`, `totalValue`) devem ser formatados em `R$`.

---

## Estados das Telas

| Estado             | Comportamento                                          |
|--------------------|--------------------------------------------------------|
| Loading inicial    | Skeleton de linhas na seção de histórico               |
| Lista vazia        | Mensagem "Nenhum evento registrado para este contrato." |
| Erro de listagem   | Mensagem de erro + botão "Tentar novamente"            |
| Paginação          | Botões Anterior / Próxima, exibe `página / totalPages` |

---

## Erros Esperados

| Código da API          | Situação                                         | Comportamento                        |
|------------------------|--------------------------------------------------|--------------------------------------|
| `CONTRACT_NOT_FOUND`   | Contrato não encontrado ou deletado              | Mensagem de erro na seção            |
| `TENANT_ACCESS_DENIED` | Contrato pertence a outro tenant                 | Mensagem de erro na seção            |
| `VALIDATION_ERROR`     | Parâmetros inválidos (`page` / `limit`)          | Nunca ocorre — UI controla os valores|
| `UNAUTHORIZED`         | Token inválido ou expirado                       | Redirect para /login                 |

---

## Critérios de Aceite

- [ ] Seção "Histórico" exibida na `ContractDetailPage` abaixo dos dados e recebíveis
- [ ] Eventos carregados via `GET /contracts/:id/history` com `page=1, limit=10`
- [ ] Eventos exibidos em ordem cronológica decrescente
- [ ] Label em PT-BR para cada tipo de evento
- [ ] Badge colorido conforme tipo de evento
- [ ] Data e hora formatados em `dd/mm/yyyy às HH:mm`
- [ ] Diff exibido para `CONTRACT_UPDATED` e `CONTRACT_RENEWED` mostrando apenas campos alterados
- [ ] Campos de data no diff formatados em `dd/mm/yyyy`
- [ ] Campos de valor no diff formatados em R$
- [ ] Metadata de `reason` exibida para eventos de suspensão e cancelamento
- [ ] Metadata de dependente exibida para `DEPENDENT_LINKED` / `DEPENDENT_UNLINKED`
- [ ] Paginação funcional
- [ ] Skeleton durante loading
- [ ] Estado vazio e de erro tratados
