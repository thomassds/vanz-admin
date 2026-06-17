# Tasks: Contract Activation (Frontend)

> Ref: `specs/contracts/contract-activation/contract-activation-spec.md`

---

## Types

- [x] Adicionar em `features/contracts/types/contract.types.ts`:
  - [x] `ActivateContractResponse` (contractId: string, status: 'active')

---

## Store

- [x] Adicionar mutation `activateContract` em `features/contracts/store/contractsApi.ts`:
  - [x] `POST /contracts/:id/activate` sem body
  - [x] `invalidatesTags`: `[{ type: 'Contract', id }]` — invalida contrato e histórico
  - [x] Exportar `useActivateContractMutation`

---

## Utils

- [x] Criar `features/contracts/utils/contractActivationErrors.ts`:
  - [x] Mapa de código de erro da API → mensagem amigável PT-BR
  - [x] `getActivationErrorMessage(code?)` exportado

---

## Page

- [x] Atualizar `features/contracts/pages/ContractDetailPage.tsx`:
  - [x] Importar `useActivateContractMutation` e `getActivationErrorMessage`
  - [x] Chamar o hook e obter `[activateContract, { isLoading: isActivating }]`
  - [x] Handler `handleActivate`: chama `activateContract({ id }).unwrap()`, em caso de erro exibe toast com `getActivationErrorMessage`
  - [x] Botão "Ativar contrato" renderizado dentro do bloco `contract.status !== 'canceled'`
    - [x] Visível apenas quando `contract.status !== 'active'`
    - [x] Estilo: `border-green-300 text-green-700 hover:bg-green-50`
    - [x] Desabilitado quando `isActivating`, texto "Ativando..."
  - [x] Toast de sucesso após ativação: "Contrato ativado com sucesso."
  - [x] Toast de erro com mensagem amigável em caso de falha

---

## Testes

> Nota: testes ainda não escritos.

- [ ] Teste: botão não renderizado para status `active`
- [ ] Teste: botão não renderizado para status `canceled`
- [ ] Teste: botão visível para status `pending`, `inactive` e `suspended`
- [ ] Teste: clique chama `POST /contracts/:id/activate` sem body
- [ ] Teste: cache invalidado após ativação bem-sucedida
- [ ] Teste: erro `INVALID_CONTRACT_STATUS` exibido com mensagem amigável
