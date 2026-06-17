# Feature: Contract Renewal (Frontend)

## Objetivo

Permitir que o tenant renove um contrato ativo ou suspenso diretamente da página de detalhe, definindo o novo período de vigência e, opcionalmente, ajustando valores.

---

## Contexto

A renovação evita o recadastro completo quando um contrato precisa de um novo período de vigência. Os campos financeiros (valor, desconto, dia de vencimento) podem ser mantidos ou alterados. Após a renovação, novas parcelas são geradas automaticamente pelo backend e um evento `CONTRACT_RENEWED` é registrado no histórico.

---

## Regras de Negócio

- Contrato com status `canceled` **não pode** ser renovado — botão desabilitado.
- `endDate` deve ser posterior a `startDate`.
- `discount` não pode ser maior que `value`.
- Campos opcionais (`value`, `discount`, `durationMonths`, `firstPaymentDate`, `dueDay`) herdam os valores atuais do contrato se não informados.
- `endDate` é auto-calculado a partir de `startDate + durationMonths` (mesmo dia, mês avançado), mas pode ser editado manualmente.
- Após renovação bem-sucedida: histórico do contrato é atualizado, dados do contrato são recarregados.

---

## Fluxo

```
1. Usuário acessa /contracts/:id
2. Clica no botão "Renovar contrato" (desabilitado se status = canceled)
3. Modal de renovação abre com campos pré-preenchidos com dados atuais do contrato
4. Usuário ajusta startDate (obrigatório), endDate (auto-calculado ou manual) e demais campos
5. Usuário clica em "Renovar"
6. API POST /contracts/:id/renew
7. Modal fecha, toast de sucesso, dados do contrato recarregados
```

---

## Tela

### Botão "Renovar contrato" — `ContractDetailPage`

- Localizado no header da seção "Dados do contrato", ao lado do botão "Editar contrato"
- Desabilitado quando `contract.status === 'canceled'`
- Tooltip ou texto explicativo quando desabilitado: "Contratos cancelados não podem ser renovados"

### Modal de Renovação — `RenewContractModal`

Título: **Renovar contrato**

#### Campos

| Campo               | Tipo        | Obrigatório | Comportamento                                              |
|---------------------|-------------|-------------|-------------------------------------------------------------|
| Data de início      | texto (máscara dd/mm/aaaa) | Sim | Pré-preenchido com `contract.startDate`      |
| Duração (meses)     | número      | Não         | Pré-preenchido com `contract.durationMonths`; recalcula endDate |
| Vencimento (fim)    | texto (read-only) | —      | Auto-calculado: `startDate + durationMonths`               |
| Primeiro pagamento  | texto (máscara dd/mm/aaaa) | Não | Pré-preenchido com `contract.firstPaymentDate` |
| Valor mensal (R$)   | texto decimal | Não       | Pré-preenchido com `contract.value`                        |
| Desconto (R$)       | texto decimal | Não       | Pré-preenchido com `contract.discount`                     |
| Valor total         | read-only   | —           | Auto-calculado: `value - discount`                         |
| Dia de vencimento   | select 1–31 | Não         | Pré-preenchido com `contract.dueDay`                       |

#### Botões

- **Cancelar** — fecha o modal sem salvar
- **Renovar** — submete o formulário; desabilitado durante loading

---

## Integração com API

| Ação              | Endpoint                      | Método |
|-------------------|-------------------------------|--------|
| Renovar contrato  | `/contracts/:id/renew`        | POST   |

### Payload

```ts
interface RenewContractDTO {
  startDate: string        // yyyy-mm-dd — obrigatório
  endDate: string          // yyyy-mm-dd — obrigatório
  value?: number           // herda do contrato se omitido
  discount?: number        // herda do contrato se omitido
  durationMonths?: number  // herda do contrato se omitido
  firstPaymentDate?: string // yyyy-mm-dd — herda do contrato se omitido
  dueDay?: number          // herda do contrato se omitido
}
```

### Resposta de sucesso

Retorna o contrato renovado com todos os campos atualizados. Deve invalidar o cache do contrato (`getContractById`) e do histórico (`getContractHistory`).

---

## Validação (Zod)

```ts
const renewContractSchema = z.object({
  startDate: z.string().min(1, 'Data de início obrigatória'),
  endDate: z.string().min(1, 'Data de vencimento obrigatória'),
  durationMonths: z.string().optional()
    .transform(v => v ? parseInt(v, 10) : undefined)
    .refine(v => v === undefined || (v >= 1), { message: 'Duração inválida' }),
  firstPaymentDate: z.string().optional(),
  value: z.string().optional()
    .transform(v => v ? parseFloat(v.replace(',', '.')) : undefined)
    .refine(v => v === undefined || v >= 0, { message: 'Valor inválido' }),
  discount: z.string().optional()
    .transform(v => v ? parseFloat(v.replace(',', '.')) : 0)
    .refine(v => v >= 0, { message: 'Desconto inválido' }),
  dueDay: z.string().optional()
    .transform(v => v ? parseInt(v, 10) : undefined)
    .refine(v => v === undefined || (v >= 1 && v <= 31), { message: 'Dia inválido' }),
})
```

---

## Tipos TypeScript

```ts
interface RenewContractDTO {
  startDate: string
  endDate: string
  value?: number
  discount?: number
  durationMonths?: number
  firstPaymentDate?: string
  dueDay?: number
}
```

---

## Estados das Telas

| Estado                        | Comportamento                                                  |
|-------------------------------|----------------------------------------------------------------|
| Contrato cancelado            | Botão "Renovar contrato" desabilitado                         |
| Modal aberto                  | Campos pré-preenchidos com dados atuais do contrato           |
| Loading (renovando)           | Botão "Renovar" desabilitado com texto "Renovando..."         |
| Sucesso                       | Modal fecha, toast "Contrato renovado com sucesso.", cache invalidado |
| Erro `CONTRACT_CANCELED`      | Mensagem inline "Contratos cancelados não podem ser renovados" |
| Erro `INVALID_CONTRACT_PERIOD`| Mensagem inline "O período informado é inválido"              |
| Erro `INVALID_CONTRACT_DATA`  | Mensagem inline "Desconto não pode ser maior que o valor"     |

---

## Erros Esperados

| Código da API             | Mensagem para o usuário                              |
|---------------------------|------------------------------------------------------|
| `CONTRACT_NOT_FOUND`      | "Contrato não encontrado"                            |
| `CONTRACT_CANCELED`       | "Contratos cancelados não podem ser renovados"       |
| `INVALID_CONTRACT_PERIOD` | "O período informado é inválido"                     |
| `INVALID_CONTRACT_DATA`   | "Desconto não pode ser maior que o valor"            |
| `TENANT_ACCESS_DENIED`    | "Acesso negado"                                      |
| `UNAUTHORIZED`            | Redirect para /login                                 |

---

## Critérios de Aceite

- [ ] Botão "Renovar contrato" visível na `ContractDetailPage`
- [ ] Botão desabilitado quando `contract.status === 'canceled'`
- [ ] Modal abre com todos os campos pré-preenchidos com dados atuais do contrato
- [ ] `endDate` é auto-calculado ao alterar `startDate` ou `durationMonths`
- [ ] `totalValue` é auto-calculado como `value - discount`
- [ ] Datas exibidas no formato dd/mm/aaaa
- [ ] Submissão envia `startDate` e `endDate` em formato `yyyy-mm-dd`
- [ ] Toast de sucesso após renovação
- [ ] Cache do contrato e do histórico invalidados após renovação
- [ ] Erros da API exibidos com mensagem amigável no modal
- [ ] Botão "Renovar" desabilitado durante loading
