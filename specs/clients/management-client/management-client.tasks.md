# Tasks: Client Management (Frontend)

> Ref: `specs/clients/management-client/management-client-spec.md`

---

## Store

- [ ] Criar `features/clients/store/clientsApi.ts` com endpoints:
  - [ ] `getClients` (query com filtros e paginação)
  - [ ] `createClient` (mutation)
  - [ ] `updateClient` (mutation)
  - [ ] `disableClient` (mutation)
  - [ ] `getDependents` (query com filtro por clientId)
  - [ ] `createDependent` (mutation)
  - [ ] `updateDependent` (mutation)
  - [ ] `deleteDependent` (mutation)
- [ ] Registrar `clientsApi` no `app/store.ts`

---

## Types e Schemas

- [ ] Criar `features/clients/types/client.types.ts` com interfaces: `Client`, `Dependent`, `ClientFilters`, `CreateClientDTO`, `CreateDependentDTO`
- [ ] Criar `features/clients/schemas/create-client.schema.ts`
- [ ] Criar `features/clients/schemas/create-dependent.schema.ts`
- [ ] Criar `features/clients/utils/clientErrorMessages.ts`

---

## Componentes

- [ ] Criar `features/clients/components/ClientsTable.tsx` (tabela com paginação e ações)
- [ ] Criar `features/clients/components/ClientFilters.tsx` (inputs de busca e select de status)
- [ ] Criar `features/clients/components/ClientFormModal.tsx` (modal de criar/editar cliente)
- [ ] Criar `features/clients/components/DisableClientDialog.tsx` (confirmação de desativação)
- [ ] Criar `features/clients/components/DependentsTable.tsx` (tabela de dependentes)
- [ ] Criar `features/clients/components/DependentFormModal.tsx` (modal de criar/editar dependente)
- [ ] Criar `features/clients/components/DeleteDependentDialog.tsx` (confirmação de exclusão)

---

## Pages

- [ ] Criar `features/clients/pages/ClientsPage.tsx`
  - [ ] Compor `ClientFilters` + `ClientsTable`
  - [ ] Botão "Novo cliente" abre `ClientFormModal`
  - [ ] Default export

- [ ] Criar `features/clients/pages/ClientDetailPage.tsx`
  - [ ] Card com dados do cliente
  - [ ] Botão "Editar" abre `ClientFormModal` em modo edição
  - [ ] Seção de dependentes com `DependentsTable`
  - [ ] Default export

---

## Rotas

- [ ] Adicionar rota `/clients` → `ClientsPage` (protegida)
- [ ] Adicionar rota `/clients/:id` → `ClientDetailPage` (protegida)

---

## Testes

- [ ] Teste: listagem de clientes com sucesso
- [ ] Teste: filtros aplicados na query
- [ ] Teste: modal abre ao clicar em "Novo cliente"
- [ ] Teste: cadastro de cliente com dados válidos
- [ ] Teste: erro `CLIENT_ALREADY_EXISTS` exibido corretamente
- [ ] Teste: dialog de confirmação antes de desativar
- [ ] Teste: listagem atualizada após cadastro (invalidação RTK Query)
- [ ] Teste: cadastro de dependente vinculado ao cliente
