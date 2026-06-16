# Feature: Receivables Management (Frontend)

## Objetivo

Permitir que o tenant gerencie os recebíveis de forma manual: visualizar, filtrar, alterar status e cadastrar/editar recebíveis vinculados a contratos.

---

## Contexto

Recebíveis (receivables) são as parcelas financeiras geradas a partir de um contrato. Embora gerados automaticamente, o tenant precisa gerenciá-los manualmente para registrar pagamentos, fazer ajustes de valor ou alterar vencimentos.

Cada recebível tem um status que segue uma máquina de estados bem definida.

---

## Status de Recebíveis

| Valor | Status    | Cor sugerida |
| ----- | --------- | ------------ |
| 0     | Pendente  | Cinza        |
| 1     | Cobrado   | Azul         |
| 2     | Pago      | Verde        |
| 3     | Vencido   | Vermelho     |
| 4     | Cancelado | Laranja      |

### Transições permitidas

| De        | Para      | Permitido |
| --------- | --------- | --------- |
| Pendente  | Cobrado   | ✅        |
| Pendente  | Vencido   | ✅        |
| Pendente  | Cancelado | ✅        |
| Cobrado   | Pago      | ✅        |
| Cobrado   | Vencido   | ✅        |
| Cobrado   | Cancelado | ✅        |
| Vencido   | Pago      | ✅        |
| Vencido   | Cancelado | ✅        |
| Pago      | qualquer  | ❌        |
| Cancelado | qualquer  | ❌        |

---

## Fluxo: Gestão de Recebíveis

### Listagem de Recebíveis

```
1. Usuário acessa /finances/receivables
2. Sistema carrega lista paginada ordenada por data de vencimento (ASC)
3. Usuário filtra por contrato, status ou intervalo de vencimento
4. Usuário pode atualizar o status de um recebível pela ação na linha
5. Usuário pode editar valor e vencimento de recebíveis não pagos/cancelados
6. Usuário pode cadastrar recebível manual via botão "Novo recebível"
```

### Atualização de Status

```
1. Usuário clica em "Alterar status" na linha do recebível
2. Sistema exibe as transições permitidas para o status atual
3. Usuário seleciona o novo status
4. API valida a transição e persiste
5. Lista atualizada com novo status
```

### Edição de Recebível

```
1. Usuário clica em "Editar" na linha
2. Abre modal com campos editáveis (valor e vencimento)
3. Usuário altera os dados e salva
4. API valida (não permite alterar valor/data de recebível pago)
5. Toast de sucesso
```

---

## Telas

### ReceivablesPage — `/finances/receivables`

Elementos:
- Filtros: select de contrato (com busca), select de status, date pickers (vencimento de/até)
- Botão "Novo recebível"
- Tabela com colunas: Contrato, Parcela, Vencimento, Valor, Status, Ações
- Ações por linha: Editar, Alterar status
- Paginação

### ReceivableFormModal — Modal de Cadastro / Edição

Campos de criação:
- Select de contrato (obrigatório)
- Input de número da parcela
- Date picker de vencimento
- Input de valor

Campos de edição:
- Input de valor (bloqueado se status = Pago)
- Date picker de vencimento (bloqueado se status = Pago)
- Select de status (apenas transições permitidas)

---

## Integração com API

| Ação                    | Endpoint                    | Método |
| ----------------------- | --------------------------- | ------ |
| Listar recebíveis       | `/api/v1/receivables`       | GET    |
| Criar recebível manual  | `/api/v1/receivables`       | POST   |
| Atualizar recebível     | `/api/v1/receivables/:id`   | PUT    |
| Visualizar detalhe      | `/api/v1/receivables/:id`   | GET    |

### Parâmetros de listagem

| Parâmetro     | Tipo   | Obrigatório |
| ------------- | ------ | ----------- |
| `page`        | int    | Sim         |
| `limit`       | int    | Sim         |
| `contractId`  | uuid   | Não         |
| `status`      | int    | Não         |
| `dueDateFrom` | date   | Não         |
| `dueDateTo`   | date   | Não         |

---

## Estados das Telas

| Estado             | Comportamento                                                  |
| ------------------ | -------------------------------------------------------------- |
| Loading lista      | Skeleton na tabela                                             |
| Lista vazia        | Ilustração + mensagem "Nenhum recebível encontrado"            |
| Erro de listagem   | Mensagem de erro + botão "Tentar novamente"                    |
| Loading modal      | Botão salvar com spinner e desabilitado                        |
| Sucesso alteração  | Toast de sucesso + invalidação da lista                        |
| Status Pago/Cancelado | Ações de edição desabilitadas na linha                     |

---

## Validação (Zod)

```ts
// createReceivableSchema
z.object({
  contractId: z.string().uuid('Contrato obrigatório'),
  installmentNumber: z.number().min(1, 'Número de parcela obrigatório'),
  dueDate: z.string().min(1, 'Vencimento obrigatório'),
  value: z.number().positive('Valor deve ser maior que zero'),
})

// updateReceivableSchema
z.object({
  value: z.number().positive('Valor deve ser maior que zero').optional(),
  dueDate: z.string().optional(),
  status: z.number().min(0).max(4).optional(),
})
```

---

## Erros Esperados

| Código da API                   | Mensagem para o usuário                                 |
| ------------------------------- | ------------------------------------------------------- |
| `RECEIVABLE_NOT_FOUND`          | "Recebível não encontrado"                              |
| `CONTRACT_NOT_FOUND`            | "Contrato não encontrado"                               |
| `RECEIVABLE_DUPLICATE_DUE_DATE` | "Já existe um recebível com esta data de vencimento para este contrato" |
| `RECEIVABLE_ALREADY_PAID`       | "Recebíveis pagos não podem ser alterados"              |
| `RECEIVABLE_ALREADY_CANCELED`   | "Recebíveis cancelados não podem ser alterados"         |
| `INVALID_STATUS_TRANSITION`     | "Esta transição de status não é permitida"              |
| `TENANT_ACCESS_DENIED`          | "Acesso negado"                                         |

---

## Critérios de Aceite

- [ ] Listagem carrega recebíveis com paginação e ordenação por vencimento ASC
- [ ] Filtros por contrato, status e intervalo de vencimento funcionam
- [ ] Select de contrato tem busca por nome do cliente
- [ ] Novo recebível pode ser cadastrado via modal
- [ ] Status pode ser alterado respeitando as transições permitidas
- [ ] Opções de status no select limitadas às transições válidas para o status atual
- [ ] Campos de valor e vencimento bloqueados para recebíveis com status Pago
- [ ] Toast de sucesso após cada operação
- [ ] Erros da API exibidos com mensagem amigável
- [ ] Listagem atualizada automaticamente após qualquer operação
- [ ] Quando acessado via link do detalhe do contrato, filtro de contrato pré-aplicado
