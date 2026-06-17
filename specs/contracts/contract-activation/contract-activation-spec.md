# Feature: Contract Activation (Frontend)

## Objetivo

Permitir que o tenant ative um contrato a partir da página de detalhe. A ativação está disponível para contratos nos status `pending`, `inactive` e `suspended`. Contratos `active` ou `canceled` não exibem o botão.

---

## Contexto

A ativação muda o status do contrato para `active` e dispara a geração ou reativação de recebíveis no backend:

- **pending → active**: reativa os recebíveis existentes já gerados (status `contract_pending` → status de origem).
- **inactive / suspended → active**: publica um evento que gera novos recebíveis para o período restante.

Do ponto de vista do frontend, o fluxo é idêntico para todos os casos: um botão de ação, sem body, resposta imediata.

---

## Regras de Negócio

- Botão **não aparece** quando `contract.status === 'active'` ou `contract.status === 'canceled'`.
- Botão **aparece** quando `contract.status` é `'pending'`, `'inactive'` ou `'suspended'`.
- Nenhum dado adicional é exigido do usuário — a ativação não tem formulário.
- Após ativação bem-sucedida: status muda para `active`, histórico é atualizado, cache do contrato é invalidado.

---

## Fluxo

```
1. Usuário acessa /contracts/:id
2. Se status != active e != canceled: botão "Ativar contrato" aparece no header da seção "Dados do contrato"
3. Usuário clica no botão
4. API POST /contracts/:id/activate (sem body)
5. Toast de sucesso, dados do contrato recarregados
```

---

## Tela

### Botão "Ativar contrato" — `ContractDetailPage`

- Localizado no header da seção "Dados do contrato", ao lado dos demais botões de ação
- **Não renderizado** quando `contract.status === 'active'` ou `contract.status === 'canceled'`
- Estilo: borda verde / texto verde (ação positiva)
- Desabilitado durante o loading da ativação
- Sem modal de confirmação — ação direta

---

## Integração com API

| Ação              | Endpoint                        | Método |
|-------------------|---------------------------------|--------|
| Ativar contrato   | `/contracts/:id/activate`       | POST   |

### Payload

Nenhum body necessário.

### Resposta de sucesso (HTTP 200)

```ts
// axiosBaseQuery já desembrulha result.data.data
interface ActivateContractResponse {
  contractId: string
  status: 'active'
}
```

### Invalidação de cache

Deve invalidar `[{ type: 'Contract', id }]` — recarrega `getContractById` e `getContractHistory`.

---

## Tipos TypeScript

```ts
interface ActivateContractResponse {
  contractId: string
  status: 'active'
}
```

---

## Estados da Tela

| Estado                         | Comportamento                                                        |
|--------------------------------|----------------------------------------------------------------------|
| Status `active`                | Botão "Ativar contrato" não renderizado                             |
| Status `canceled`              | Botão "Ativar contrato" não renderizado                             |
| Status `pending` / `inactive` / `suspended` | Botão "Ativar contrato" visível                      |
| Loading (ativando)             | Botão desabilitado com texto "Ativando..."                          |
| Sucesso                        | Toast "Contrato ativado com sucesso.", cache invalidado             |
| Erro `CONTRACT_CANCELED`       | Toast ou erro inline "Contratos cancelados não podem ser ativados." |
| Erro `INVALID_CONTRACT_STATUS` | Toast ou erro inline "Este contrato já está ativo."                 |

---

## Erros Esperados

| Código da API             | Mensagem para o usuário                          |
|---------------------------|--------------------------------------------------|
| `CONTRACT_NOT_FOUND`      | "Contrato não encontrado."                       |
| `CONTRACT_CANCELED`       | "Contratos cancelados não podem ser ativados."   |
| `INVALID_CONTRACT_STATUS` | "Este contrato já está ativo."                   |
| `TENANT_ACCESS_DENIED`    | "Acesso negado."                                 |
| `UNAUTHORIZED`            | Redirect para /login                             |

---

## Arquivos a Criar / Modificar

| Arquivo                                                        | Ação      |
|----------------------------------------------------------------|-----------|
| `features/contracts/utils/contractActivationErrors.ts`        | Criar     |
| `features/contracts/types/contract.types.ts`                  | Modificar — adicionar `ActivateContractResponse` |
| `features/contracts/store/contractsApi.ts`                    | Modificar — adicionar mutation `activateContract` |
| `features/contracts/pages/ContractDetailPage.tsx`             | Modificar — botão condicional + toast de sucesso |

> Nota: por ser uma ação sem formulário, não é necessário modal, schema Zod nem componente separado.

---

## Critérios de Aceite

- [ ] Botão "Ativar contrato" visível para status `pending`, `inactive` e `suspended`
- [ ] Botão não renderizado para status `active` e `canceled`
- [ ] Clique chama `POST /contracts/:id/activate` sem body
- [ ] Toast de sucesso após ativação: "Contrato ativado com sucesso."
- [ ] Cache do contrato e do histórico invalidados após ativação
- [ ] Botão desabilitado durante loading com texto "Ativando..."
- [ ] Erros da API exibidos com mensagem amigável
