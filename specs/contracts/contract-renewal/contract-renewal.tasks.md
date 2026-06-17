# Tasks: Contract Renewal (Frontend)

> Ref: `specs/contracts/contract-renewal/contract-renewal-spec.md`

---

## Types

- [x] Adicionar em `features/contracts/types/contract.types.ts`:
  - [x] `RenewContractDTO` (startDate, endDate, value?, discount?, durationMonths?, firstPaymentDate?, dueDay?)
  - [x] `ContractStatus` atualizado com `'suspended'` e `'canceled'`

---

## Schema

- [x] Criar `features/contracts/schemas/renew-contract.schema.ts`:
  - [x] `renewContractSchema` com Zod (startDate e endDate obrigatórios, demais opcionais com transform)
  - [x] `RenewContractFormData` (tipo output — z.infer)
  - [x] `RenewContractFormInput` (tipo input — z.input)

---

## Store

- [x] Adicionar mutation `renewContract` em `features/contracts/store/contractsApi.ts`:
  - [x] `POST /contracts/:id/renew` com body `RenewContractDTO`
  - [x] `invalidatesTags`: `[{ type: 'Contract', id }]` — invalida contrato e histórico
  - [x] Exportado `useRenewContractMutation`

---

## Utils

- [x] Criar `features/contracts/utils/contractRenewalErrors.ts`:
  - [x] Mapa de código de erro da API → mensagem amigável PT-BR
  - [x] `getRenewalErrorMessage(code?)` exportado

---

## Componentes

- [x] Criar `features/contracts/components/RenewContractModal.tsx`
  - [x] Aceita `contract: Contract`, `isOpen: boolean`, `onClose`, `onSuccess` como props
  - [x] Formulário com `useForm<RenewContractFormInput, unknown, RenewContractFormData>`
  - [x] Campos pré-preenchidos com dados atuais do contrato ao abrir (reset via useEffect em isOpen)
  - [x] `startDate` — input texto com máscara dd/mm/aaaa (Controller + maskDateBR/brToISO)
  - [x] `durationMonths` — input número
  - [x] `endDate` — input texto read-only, auto-calculado via `useEffect` (startDate + durationMonths)
  - [x] `firstPaymentDate` — input texto com máscara dd/mm/aaaa (Controller + maskDateBR/brToISO), opcional
  - [x] `value` — input decimal (Controller), opcional, pré-preenchido
  - [x] `discount` — input decimal (Controller), opcional, pré-preenchido
  - [x] `totalValue` — div read-only auto-calculado (`value - discount`)
  - [x] `dueDay` — select 1–31, opcional, pré-preenchido
  - [x] Botões: Cancelar / Renovar (desabilitado durante loading, texto "Renovando...")
  - [x] Erro de API exibido inline (`errors.root`)
  - [x] `ContractStatusBadge` atualizado com `suspended` e `canceled`

---

## Page

- [x] Atualizar `features/contracts/pages/ContractDetailPage.tsx`:
  - [x] Importar `RenewContractModal`
  - [x] Adicionar estado `renewModalOpen: boolean`
  - [x] Botão "Renovar contrato" no header da seção "Dados do contrato", ao lado de "Editar contrato"
    - [x] Desabilitado quando `contract.status === 'canceled'`
    - [x] `title` com mensagem explicativa quando desabilitado
  - [x] Renderizar `<RenewContractModal>` condicionalmente
  - [x] Toast de sucesso após renovação: "Contrato renovado com sucesso."

---

## Testes

> Nota: testes ainda não escritos.

- [ ] Teste: botão desabilitado para contrato cancelado
- [ ] Teste: modal abre com campos pré-preenchidos
- [ ] Teste: endDate auto-calculado ao alterar startDate/durationMonths
- [ ] Teste: erro `INVALID_CONTRACT_PERIOD` exibido inline
- [ ] Teste: cache invalidado após renovação bem-sucedida
