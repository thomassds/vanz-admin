# Tasks: Contract Cancellation (Frontend)

> Ref: `specs/contracts/contract-cancellation/contract-cancellation-spec.md`

---

## Types

- [x] Adicionar em `features/contracts/types/contract.types.ts`:
  - [x] `CancelContractDTO` (reason: string)
  - [x] `CancelContractResponse` (contractId, status: 'canceled', canceledAt, reason)

---

## Schema

- [x] Criar `features/contracts/schemas/cancel-contract.schema.ts`:
  - [x] `cancelContractSchema` com Zod (reason: string, trim, mín. 3, máx. 500)
  - [x] `CancelContractFormData` (tipo output — z.infer)

---

## Store

- [x] Adicionar mutation `cancelContract` em `features/contracts/store/contractsApi.ts`:
  - [x] `POST /contracts/:id/cancel` com body `CancelContractDTO`
  - [x] `invalidatesTags`: `[{ type: 'Contract', id }]` — invalida contrato e histórico
  - [x] Exportar `useCancelContractMutation`

---

## Utils

- [x] Criar `features/contracts/utils/contractCancellationErrors.ts`:
  - [x] Mapa de código de erro da API → mensagem amigável PT-BR
  - [x] `getCancellationErrorMessage(code?)` exportado

---

## Componentes

- [x] Criar `features/contracts/components/CancelContractModal.tsx`
  - [x] Aceita `contractId: string`, `isOpen: boolean`, `onClose`, `onSuccess` como props
  - [x] Formulário com `useForm<CancelContractFormData>`
  - [x] Reset do formulário ao abrir (useEffect em isOpen)
  - [x] Bloco de aviso destacado: "Esta ação é irreversível. O contrato não poderá ser reativado após o cancelamento."
  - [x] Textarea para `reason` com contador de caracteres (charCount/500)
  - [x] Validação inline: mín. 3 / máx. 500 chars
  - [x] Chama `useCancelContractMutation` diretamente no modal
  - [x] Em sucesso: chama `onClose()` + `onSuccess()`
  - [x] Erro de API exibido inline (`errors.root`)
  - [x] Botões: Voltar / Confirmar cancelamento (estilo destrutivo vermelho, desabilitado durante loading, texto "Cancelando...")

---

## Page

- [x] Atualizar `features/contracts/pages/ContractDetailPage.tsx`:
  - [x] Importar `CancelContractModal`
  - [x] Adicionar estado `cancelModalOpen: boolean`
  - [x] Botão "Cancelar contrato" no header da seção "Dados do contrato" (ao lado de "Renovar" e "Editar")
    - [x] Estilo destrutivo: borda vermelha / texto vermelho
    - [x] Desabilitado quando `contract.status === 'canceled'`
    - [x] `title`: "Este contrato já foi cancelado" quando desabilitado
  - [x] Renderizar `<CancelContractModal>` condicionalmente
  - [x] Toast de sucesso após cancelamento: "Contrato cancelado com sucesso."

---

## Testes

> Nota: testes ainda não escritos.

- [ ] Teste: botão desabilitado para contrato já cancelado
- [ ] Teste: modal abre com textarea vazia
- [ ] Teste: validação de motivo (mín. 3 chars)
- [ ] Teste: erro `CONTRACT_ALREADY_CANCELED` exibido inline
- [ ] Teste: cache invalidado após cancelamento bem-sucedido
