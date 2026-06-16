# Tasks: Client Management (Frontend)

> Ref: `specs/clients/management-client/management-client-spec.md`

---

## Store

- [x] Criar `features/clients/store/clientsApi.ts` com endpoints:
  - [x] `getClients` (query com filtros e paginação)
  - [x] `getClient` (query por ID — necessário para ClientDetailPage)
  - [x] `createClient` (mutation)
  - [x] `updateClient` (mutation)
  - [x] `disableClient` (mutation)
  - [x] `getDependents` (query com filtro por clientId)
  - [x] `createDependent` (mutation)
  - [x] `updateDependent` (mutation)
  - [x] `deleteDependent` (mutation)
- [x] Registrar `clientsApi` no `app/store.ts`

---

## Types e Schemas

- [x] Criar `features/clients/types/client.types.ts` com interfaces: `Client`, `Dependent`, `ClientFilters`, `CreateClientDTO`, `UpdateClientDTO`, `CreateDependentDTO`, `UpdateDependentDTO`
- [x] Criar `features/clients/schemas/create-client.schema.ts`
- [x] Criar `features/clients/schemas/create-dependent.schema.ts`
- [x] Criar `features/clients/utils/clientErrorMessages.ts`

---

## Componentes Compartilhados (criados em `shared/`)

- [x] Criar `shared/hooks/useToast.ts`
- [x] Criar `shared/components/Toast.tsx`
- [x] Criar `shared/components/Modal.tsx`
- [x] Criar `shared/components/ConfirmDialog.tsx`

---

## Componentes

- [x] Criar `features/clients/components/ClientsTable.tsx` (tabela com paginação e ações)
- [x] Criar `features/clients/components/ClientFilters.tsx` (inputs de busca e select de status)
- [x] Criar `features/clients/components/ClientFormModal.tsx` (modal de criar/editar cliente)
- [x] Criar `features/clients/components/DisableClientDialog.tsx` (confirmação de desativação)
- [x] Criar `features/clients/components/DependentsTable.tsx` (tabela de dependentes)
- [x] Criar `features/clients/components/DependentFormModal.tsx` (modal de criar/editar dependente)
- [x] Criar `features/clients/components/DeleteDependentDialog.tsx` (confirmação de exclusão)

---

## Pages

- [x] Criar `features/clients/pages/ClientsPage.tsx`
  - [x] Compor `ClientFilters` + `ClientsTable`
  - [x] Botão "Novo cliente" abre `ClientFormModal`
  - [x] Default export

- [x] Criar `features/clients/pages/ClientDetailPage.tsx`
  - [x] Card com dados do cliente
  - [x] Botão "Editar" abre `ClientFormModal` em modo edição
  - [x] Seção de dependentes com `DependentsTable`
  - [x] Default export

---

## Rotas

- [x] Adicionar rota `/clients` → `ClientsPage` (protegida)
- [x] Adicionar rota `/clients/:id` → `ClientDetailPage` (protegida)

---

## Testes

> Nota: os testes das APIs/componentes de clientes ainda não foram escritos.

- [ ] Teste: listagem de clientes com sucesso
- [ ] Teste: filtros aplicados na query
- [ ] Teste: modal abre ao clicar em "Novo cliente"
- [ ] Teste: cadastro de cliente com dados válidos
- [ ] Teste: erro `CLIENT_ALREADY_EXISTS` exibido corretamente
- [ ] Teste: dialog de confirmação antes de desativar
- [ ] Teste: listagem atualizada após cadastro (invalidação RTK Query)
- [ ] Teste: cadastro de dependente vinculado ao cliente
