# Tasks: Payables Management (Frontend)

> Ref: `specs/finances/payables/management-payables/management-payables-spec.md`

---

## Types

- [x] Criar `features/finances/types/payable.types.ts`:
  - [x] `PayableStatusValue = 0 | 1 | 2 | 3`
  - [x] `PayableCategoryValue = 1 | 2 | 3 | 4 | 5`
  - [x] `ALLOWED_PAYABLE_STATUS_TRANSITIONS` (0→[1,2,3], 1→[], 2→[1,3], 3→[])
  - [x] Interface `Payable` (id, tenantId, contractId, value: string, dueDate, paidAt, status, category, description, createdAt, updatedAt)
  - [x] Interface `PayableFilters` (page, limit, status?, category?, contractId?, dueDateFrom?, dueDateTo?)
  - [x] Interface `CreatePayableDTO` (value, dueDate, category, contractId?, description?)
  - [x] Interface `UpdatePayableDTO` (id, value?, dueDate?, status?, category?, description?)

---

## Schemas

- [x] Criar `features/finances/schemas/create-payable.schema.ts`:
  - [x] `createPayableSchema` com Zod (value, dueDate, category obrigatórios; contractId e description opcionais)
  - [x] Exportar `CreatePayableFormData` e `CreatePayableFormInput`

- [x] Criar `features/finances/schemas/update-payable.schema.ts`:
  - [x] `updatePayableSchema` com Zod (value, dueDate, category obrigatórios; status e description opcionais)
  - [x] Exportar `UpdatePayableFormData` e `UpdatePayableFormInput`

---

## Utils

- [x] Criar `features/finances/utils/payableStatus.ts`:
  - [x] `STATUS_LABELS`: mapa valor → label PT-BR (Pendente, Pago, Vencido, Cancelado)
  - [x] `STATUS_CLASSES`: mapa valor → classes Tailwind (badge)
  - [x] `isTerminalPayableStatus(status: number): boolean` — true para 1 (paid) e 3 (canceled)
  - [x] `getAllowedPayableTransitions(status: PayableStatusValue): PayableStatusValue[]`

- [x] Criar `features/finances/utils/payableErrors.ts`:
  - [x] Mapa de código de erro da API → mensagem amigável PT-BR
  - [x] `getPayableErrorMessage(code?: string): string` exportado

- [x] Criar `features/finances/utils/payableCategory.ts`:
  - [x] `CATEGORY_LABELS`: mapa valor → label PT-BR (Combustível, Salário, Manutenção, Seguro, Outros)
  - [x] `CATEGORY_OPTIONS`: array `{ value, label }` para uso em selects

---

## Store

- [x] Criar `features/finances/store/payablesApi.ts`:
  - [x] `getPayables` — query `GET /payables` com filtros e paginação, `providesTags: ['Payable']`
  - [x] `getPayableById` — query `GET /payables/:id`, `providesTags: [{ type: 'Payable', id }]`
  - [x] `createPayable` — mutation `POST /payables`, `invalidatesTags: ['Payable']`
  - [x] `updatePayable` — mutation `PUT /payables/:id`, `invalidatesTags: ['Payable']`
  - [x] Exportar `useGetPayablesQuery`, `useGetPayableByIdQuery`, `useCreatePayableMutation`, `useUpdatePayableMutation`

- [x] Registrar `payablesApi` em `app/store.ts` (reducer + middleware)

---

## Componentes

- [x] Criar `features/finances/components/PayableStatusBadge.tsx`

- [x] Criar `features/finances/components/PayablesTable.tsx`:
  - [x] Colunas: Vencimento, Categoria, Descrição, Valor, Status, Ações
  - [x] `value` convertido de string para número com `Number(value)`
  - [x] Ação "Editar" não renderizada para status terminal (paid/canceled)
  - [x] Skeleton de loading
  - [x] Estado vazio: "Nenhuma despesa encontrada."
  - [x] Paginação

- [x] Criar `features/finances/components/PayableFilters.tsx`:
  - [x] Select de status com label PT-BR
  - [x] Select de categoria com label PT-BR
  - [x] Date inputs vencimento de/até (com máscara BR)
  - [x] Select de contrato
  - [x] Botões Buscar e Limpar

- [x] Criar `features/finances/components/PayableFormModal.tsx`:
  - [x] Modo criação: value, dueDate, category, contractId (opcional com search), description (opcional + contador)
  - [x] Modo edição: value/dueDate (locked se terminal), category, status (allowed transitions), description
  - [x] Reset ao abrir (`useEffect` em `isOpen`)
  - [x] Erro de API exibido inline (`errors.root`)

---

## Pages

- [x] Criar `features/finances/pages/PayablesPage.tsx`:
  - [x] Título "Contas a pagar"
  - [x] Botão "+ Nova despesa"
  - [x] Compor `PayableFilters` + `PayablesTable`
  - [x] Toast de sucesso após criar/editar
  - [x] Default export

---

## Rotas

- [x] Adicionar rota `/finances/payables` → `PayablesPage` (lazy import)
- [x] Adicionar "Contas a pagar" no menu lateral com ícone receipt

---

## Testes

> Nota: testes ainda não escritos.

- [ ] Teste: listagem carrega e exibe payables corretamente
- [ ] Teste: filtros por status e categoria aplicados na query
- [ ] Teste: `isTerminalPayableStatus` retorna true para 1 e 3
- [ ] Teste: `getAllowedPayableTransitions` retorna transições corretas para cada status
- [ ] Teste: cadastro de payable com dados válidos
- [ ] Teste: edição bloqueada para status paid/canceled
- [ ] Teste: erro `INVALID_STATUS_TRANSITION` exibido corretamente
- [ ] Teste: `value` string numérica convertida corretamente para exibição
