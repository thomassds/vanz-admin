# Tasks: Contract Change History (Frontend)

> Ref: `specs/contracts/contract-change-history/contract-change-history-spec.md`

---

## Types

- [ ] Adicionar em `features/contracts/types/contract.types.ts`:
  - [ ] `ContractEventType` (union dos 8 tipos de evento)
  - [ ] `ContractHistoryEvent` (id, tenantId, contractId, eventType, oldValue, newValue, metadata, createdAt)
  - [ ] `ContractHistoryResponse` (items, page, limit, total, totalPages)

---

## Store

- [ ] Adicionar endpoint `getContractHistory` em `features/contracts/store/contractsApi.ts`:
  - [ ] Query `GET /contracts/:id/history` com params `{ id, page, limit }`
  - [ ] `providesTags`: `[{ type: 'Contract', id }]`
  - [ ] `transformResponse` para desembrulhar `data` da resposta

---

## Componentes

- [ ] Criar `features/contracts/components/ContractHistorySection.tsx`
  - [ ] Aceita `contractId: string` como prop
  - [ ] Gerencia estado de `page` internamente
  - [ ] Chama `useGetContractHistoryQuery({ id: contractId, page, limit: 10 })`
  - [ ] Renderiza lista de eventos em ordem decrescente
  - [ ] Cada evento exibe:
    - [ ] Badge colorido com label PT-BR do tipo de evento
    - [ ] Data e hora formatados (`dd/mm/yyyy às HH:mm`)
    - [ ] Diff (oldValue → newValue) para `CONTRACT_UPDATED` e `CONTRACT_RENEWED`
    - [ ] Metadata: `reason` para `CONTRACT_SUSPENDED` e `CONTRACT_CANCELED`
    - [ ] Metadata: nome do dependente para `DEPENDENT_LINKED` e `DEPENDENT_UNLINKED`
  - [ ] Skeleton de 5 linhas durante loading
  - [ ] Estado vazio: "Nenhum evento registrado para este contrato."
  - [ ] Estado de erro: "Erro ao carregar histórico." + botão "Tentar novamente"
  - [ ] Paginação (Anterior / Próxima / indicador página / totalPages)

---

## Utils

- [ ] Criar `features/contracts/utils/contractHistory.ts`:
  - [ ] `EVENT_LABELS`: mapa `ContractEventType → string` (labels PT-BR)
  - [ ] `EVENT_BADGE_CLASS`: mapa `ContractEventType → string` (classes Tailwind de cor)
  - [ ] `FIELD_LABELS`: mapa de campo → label PT-BR (value, discount, dueDay, etc.)
  - [ ] `formatDiffValue(key, value)`: formata valor do diff (data → dd/mm/yyyy, número → R$, resto → string)
  - [ ] `getDiffEntries(oldValue, newValue)`: retorna apenas os campos que mudaram

---

## Page

- [ ] Adicionar `<ContractHistorySection contractId={id} />` na `ContractDetailPage.tsx`
  - [ ] Posição: abaixo da seção de recebíveis
  - [ ] Envolvida em card com título "Histórico"

---

## Testes

> Nota: testes ainda não escritos.

- [ ] Teste: eventos renderizados com label PT-BR correto
- [ ] Teste: diff exibido apenas para CONTRACT_UPDATED e CONTRACT_RENEWED
- [ ] Teste: metadata de reason exibida em suspensão/cancelamento
- [ ] Teste: skeleton exibido durante loading
- [ ] Teste: paginação navega corretamente
