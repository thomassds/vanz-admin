# Tasks: Contract Management (Frontend)

> Ref: `specs/contracts/management-contract/management-contract-spec.md`

---

## Store

- [ ] Criar `features/contracts/store/contractsApi.ts` com endpoints:
  - [ ] `getContracts` (query com filtros e paginação)
  - [ ] `getContractById` (query por id)
  - [ ] `createContract` (mutation)
  - [ ] `updateContract` (mutation)
- [ ] Registrar `contractsApi` no `app/store.ts`

---

## Types e Schemas

- [ ] Criar `features/contracts/types/contract.types.ts` com interfaces: `Contract`, `ContractFilters`, `CreateContractDTO`, `UpdateContractDTO`
- [ ] Criar `features/contracts/schemas/create-contract.schema.ts` com `createContractSchema` e `CreateContractFormData`
- [ ] Criar `features/contracts/utils/contractErrorMessages.ts`

---

## Componentes

- [ ] Criar `features/contracts/components/ContractsTable.tsx` (tabela com paginação)
- [ ] Criar `features/contracts/components/ContractFilters.tsx` (filtros de status, data, cliente)
- [ ] Criar `features/contracts/components/ContractStatusBadge.tsx` (badge de status com cores)
- [ ] Criar `features/contracts/components/ContractForm.tsx` (formulário de criação/edição)
  - [ ] Select de cliente com busca (reutiliza endpoint de clientes)
  - [ ] Multi-select de dependentes carregado ao selecionar cliente

---

## Pages

- [ ] Criar `features/contracts/pages/ContractsPage.tsx`
  - [ ] Compor `ContractFilters` + `ContractsTable`
  - [ ] Botão "Novo contrato" navega para `/contracts/new`
  - [ ] Default export

- [ ] Criar `features/contracts/pages/ContractFormPage.tsx`
  - [ ] Compor `ContractForm`
  - [ ] Após sucesso: redirect para `/contracts/:id`
  - [ ] Default export

- [ ] Criar `features/contracts/pages/ContractDetailPage.tsx`
  - [ ] Carregar contrato por id com `useGetContractByIdQuery`
  - [ ] Exibir `ContractStatusBadge`
  - [ ] Botão "Editar" habilita edição inline ou abre modal
  - [ ] Link para recebíveis do contrato
  - [ ] Default export

---

## Rotas

- [ ] Adicionar rota `/contracts` → `ContractsPage` (protegida)
- [ ] Adicionar rota `/contracts/new` → `ContractFormPage` (protegida)
- [ ] Adicionar rota `/contracts/:id` → `ContractDetailPage` (protegida)

---

## Testes

- [ ] Teste: listagem de contratos com sucesso
- [ ] Teste: filtros aplicados na query
- [ ] Teste: cadastro de contrato com dados válidos
- [ ] Teste: dependentes carregados ao selecionar cliente
- [ ] Teste: erro `CLIENT_NOT_FOUND` exibido corretamente
- [ ] Teste: redirect para detalhe após criação
- [ ] Teste: edição de contrato com sucesso
