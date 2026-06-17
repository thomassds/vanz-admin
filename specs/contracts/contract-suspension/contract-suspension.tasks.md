# Tasks: Contract Suspension (Frontend)

> Ref: `specs/contracts/contract-suspension/contract-suspension-spec.md`

---

## Types

- [x] Adicionar em `features/contracts/types/contract.types.ts`:
  - [x] `SuspendContractDTO` (reason: string)
  - [x] `SuspendContractResponse` (contractId, status: 'inactive', suspendedAt, reason)

---

## Schema

- [x] Criar `features/contracts/schemas/suspend-contract.schema.ts`:
  - [x] `suspendContractSchema` com Zod (reason: string, trim, mín. 3, máx. 500)
  - [x] `SuspendContractFormData` (tipo output — z.infer)

---

## Store

- [x] Adicionar mutation `suspendContract` em `features/contracts/store/contractsApi.ts`:
  - [x] `POST /contracts/:id/suspend` com body `SuspendContractDTO`
  - [x] `invalidatesTags`: `[{ type: 'Contract', id }]` — invalida contrato e histórico
  - [x] Exportar `useSuspendContractMutation`

---

## Utils

- [x] Criar `features/contracts/utils/contractSuspensionErrors.ts`:
  - [x] Mapa de código de erro da API → mensagem amigável PT-BR
  - [x] `getSuspensionErrorMessage(code?)` exportado

---

## Componentes

- [x] Criar `features/contracts/components/SuspendContractModal.tsx`
  - [x] Aceita `contractId: string`, `isOpen: boolean`, `onClose`, `onSuccess` como props
  - [x] Formulário com `useForm<SuspendContractFormData>`
  - [x] Reset do formulário e do checkbox ao abrir (useEffect em isOpen)
  - [x] Bloco de aviso destacado (fundo amarelo): "Atenção: todos os recebíveis em aberto deste contrato serão cancelados. Se o contrato for reativado no futuro, novos recebíveis serão gerados a partir da reativação — os anteriores não serão restaurados."
  - [x] Textarea para `reason` com contador de caracteres (charCount/500)
  - [x] Validação inline: mín. 3 / máx. 500 chars
  - [x] Checkbox de confirmação: "Entendo que os recebíveis em aberto serão cancelados e não poderão ser restaurados."
  - [x] Estado local `confirmed: boolean` controlado pelo checkbox
  - [x] Chama `useSuspendContractMutation` diretamente no modal
  - [x] Em sucesso: chama `onClose()` + `onSuccess()`
  - [x] Erro de API exibido inline (`errors.root`)
  - [x] Botão "Confirmar suspensão": desabilitado quando `!confirmed` ou motivo inválido ou durante loading; texto "Suspendendo..." durante loading
  - [x] Botão "Voltar": fecha o modal

---

## Page

- [x] Atualizar `features/contracts/pages/ContractDetailPage.tsx`:
  - [x] Importar `SuspendContractModal`
  - [x] Adicionar estado `suspendModalOpen: boolean`
  - [x] Botão "Suspender contrato" renderizado **apenas** quando `contract.status === 'active'`, dentro do bloco `contract.status !== 'canceled'`
    - [x] Estilo: `border-yellow-300 text-yellow-700 hover:bg-yellow-50`
  - [x] Renderizar `<SuspendContractModal>` condicionalmente
  - [x] Toast de sucesso após suspensão: "Contrato suspenso com sucesso."

---

## Testes

> Nota: testes ainda não escritos.

- [ ] Teste: botão visível apenas para status `active`
- [ ] Teste: botão não renderizado para `inactive`, `pending`, `suspended`, `canceled`
- [ ] Teste: modal abre com textarea vazia e checkbox desmarcado
- [ ] Teste: botão "Confirmar suspensão" desabilitado sem checkbox marcado
- [ ] Teste: botão habilita apenas com checkbox marcado e motivo válido
- [ ] Teste: erro `CONTRACT_ALREADY_SUSPENDED` exibido inline
- [ ] Teste: cache invalidado após suspensão bem-sucedida
