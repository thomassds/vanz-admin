# Tasks: Receivables Management (Frontend)

> Ref: `specs/finances/receivables/management-receivables/management-receivables-spec.md`

---

## Store

- [ ] Criar `features/finances/store/receivablesApi.ts` com endpoints:
  - [ ] `getReceivables` (query com filtros e paginação)
  - [ ] `getReceivableById` (query por id)
  - [ ] `createReceivable` (mutation)
  - [ ] `updateReceivable` (mutation)
- [ ] Registrar `receivablesApi` no `app/store.ts`

---

## Types e Schemas

- [ ] Criar `features/finances/types/receivable.types.ts` com:
  - [ ] Interface `Receivable`
  - [ ] Interface `ReceivableFilters`
  - [ ] Interface `CreateReceivableDTO`
  - [ ] Interface `UpdateReceivableDTO`
  - [ ] Enum `ReceivableStatus` com valores 0-4 e labels
  - [ ] Constante `ALLOWED_STATUS_TRANSITIONS` com as transições permitidas
- [ ] Criar `features/finances/schemas/create-receivable.schema.ts`
- [ ] Criar `features/finances/schemas/update-receivable.schema.ts`
- [ ] Criar `features/finances/utils/receivableErrorMessages.ts`

---

## Utilitários

- [ ] Criar `features/finances/utils/receivableStatus.ts` com:
  - [ ] Função `getStatusLabel(status: number): string`
  - [ ] Função `getStatusColor(status: number): string`
  - [ ] Função `getAllowedTransitions(currentStatus: number): number[]`

---

## Componentes

- [ ] Criar `features/finances/components/ReceivablesTable.tsx` (tabela com paginação e ações)
  - [ ] Desabilitar ações de edição para status Pago (2) e Cancelado (4)
- [ ] Criar `features/finances/components/ReceivableFilters.tsx` (contrato, status, datas)
- [ ] Criar `features/finances/components/ReceivableStatusBadge.tsx` (badge com cor por status)
- [ ] Criar `features/finances/components/ReceivableFormModal.tsx` (cadastro e edição)
  - [ ] No modo edição: bloquear valor e vencimento se status = Pago
  - [ ] Select de status com apenas transições permitidas para o status atual

---

## Pages

- [ ] Criar `features/finances/pages/ReceivablesPage.tsx`
  - [ ] Compor `ReceivableFilters` + `ReceivablesTable`
  - [ ] Ler `?contractId=` da URL e pré-aplicar filtro ao carregar
  - [ ] Botão "Novo recebível" abre `ReceivableFormModal`
  - [ ] Default export

---

## Rotas

- [ ] Adicionar rota `/finances/receivables` → `ReceivablesPage` (protegida)

---

## Testes

- [ ] Teste: listagem de recebíveis com sucesso e ordenação por vencimento
- [ ] Teste: filtros aplicados corretamente na query
- [ ] Teste: `ALLOWED_STATUS_TRANSITIONS` retorna opções corretas para cada status
- [ ] Teste: cadastro de recebível com dados válidos
- [ ] Teste: erro `RECEIVABLE_DUPLICATE_DUE_DATE` exibido corretamente
- [ ] Teste: ações desabilitadas para status Pago e Cancelado
- [ ] Teste: select de novo status exibe apenas transições permitidas
- [ ] Teste: filtro de contrato pré-aplicado ao vir de query param `?contractId=`
