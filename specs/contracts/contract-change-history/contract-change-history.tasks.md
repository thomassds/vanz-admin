# Tasks: Contract Change History (Frontend)

> Ref: `specs/contracts/contract-change-history/contract-change-history-spec.md`

---

## Types

- [x] Adicionar em `features/contracts/types/contract.types.ts`:
  - [x] `ContractEventType` (union dos 8 tipos de evento)
  - [x] `ContractHistoryEvent` (id, tenantId, contractId, eventType, oldValue, newValue, metadata, createdAt)
  - [x] `ContractHistoryResponse` (items, page, limit, total, totalPages)

---

## Store

- [x] Adicionar endpoint `getContractHistory` em `features/contracts/store/contractsApi.ts`:
  - [x] Query `GET /contracts/:id/history` com params `{ id, page, limit }`
  - [x] `providesTags`: `[{ type: 'Contract', id }]`
  - [x] Sem `transformResponse` — `axiosBaseQuery` já desembrulha `result.data.data`

---

## Componentes

- [x] Criar `features/contracts/components/ContractHistorySection.tsx`
  - [x] Aceita `contractId: string` como prop
  - [x] Gerencia estado de `page` internamente
  - [x] Chama `useGetContractHistoryQuery({ id: contractId, page, limit: 10 })`
  - [x] Renderiza lista de eventos em ordem decrescente
  - [x] Cada evento exibe:
    - [x] Badge colorido com label PT-BR do tipo de evento
    - [x] Data e hora formatados (`dd/mm/yyyy às HH:mm`)
    - [x] Diff (oldValue → newValue) para `CONTRACT_UPDATED` e `CONTRACT_RENEWED`
    - [x] Metadata: `reason` para `CONTRACT_SUSPENDED` e `CONTRACT_CANCELED`
    - [x] Metadata: `dependentId` de `newValue` para `DEPENDENT_LINKED` e `DEPENDENT_UNLINKED`
  - [x] Skeleton de 5 linhas durante loading
  - [x] Estado vazio: "Nenhum evento registrado para este contrato."
  - [x] Estado de erro: "Erro ao carregar histórico." + botão "Tentar novamente"
  - [x] Paginação (Anterior / Próxima / indicador página / totalPages)

---

## Utils

- [x] Criar `features/contracts/utils/contractHistory.ts`:
  - [x] `EVENT_LABELS`: mapa `ContractEventType → string` (labels PT-BR)
  - [x] `EVENT_BADGE_CLASS`: mapa `ContractEventType → string` (classes Tailwind de cor)
  - [x] `FIELD_LABELS`: mapa de campo → label PT-BR (value, discount, dueDay, etc.)
  - [x] `formatDiffValue(key, value)`: formata valor do diff (data → dd/mm/yyyy, número → R$, resto → string)
  - [x] `normalizeForComparison(key, value)`: normaliza datas para `yyyy-mm-dd` antes de comparar (resolve divergência de formato entre `oldValue` e `newValue`)
  - [x] `getDiffEntries(oldValue, newValue)`: retorna apenas os campos cujos valores normalizados diferirem

---

## Page

- [x] Adicionar `<ContractHistorySection contractId={id} />` na `ContractDetailPage.tsx`
  - [x] Posição: abaixo da seção de recebíveis, com `mt-6`
  - [x] Card com título "Histórico" encapsulado no próprio componente

---

## Testes

> Nota: testes ainda não escritos.

- [ ] Teste: eventos renderizados com label PT-BR correto
- [ ] Teste: diff exibido apenas para CONTRACT_UPDATED e CONTRACT_RENEWED
- [ ] Teste: metadata de reason exibida em suspensão/cancelamento
- [ ] Teste: skeleton exibido durante loading
- [ ] Teste: paginação navega corretamente
