# Feature: Payables Management (Frontend)

## Objetivo

Permitir que o tenant gerencie suas contas a pagar: visualizar, filtrar, cadastrar e atualizar despesas como combustível, salários, manutenção, seguros e outros custos operacionais.

---

## Contexto

Payables (contas a pagar) são as despesas do tenant. Diferente dos receivables (receitas de contratos), payables representam saídas financeiras. Podem ser opcionalmente vinculados a um contrato. Cada payable tem uma categoria e um status que segue uma máquina de estados bem definida.

---

## Status de Payables

| Valor | Status   | Label PT-BR | Cor sugerida |
|-------|----------|-------------|--------------|
| 0     | pending  | Pendente    | Cinza        |
| 1     | paid     | Pago        | Verde        |
| 2     | overdue  | Vencido     | Vermelho     |
| 3     | canceled | Cancelado   | Laranja      |

### Transições permitidas

| De        | Para                         | Permitido |
|-----------|------------------------------|-----------|
| pending   | paid, overdue, canceled      | ✅        |
| paid      | pending, overdue, canceled   | ✅        |
| overdue   | paid, canceled               | ✅        |
| canceled  | qualquer                     | ❌        |

> Como o cadastro é manual, payables pagos podem conter erros — por isso o status `paid` permite retornar a qualquer outro estado.

---

## Categorias

| Valor | Chave       | Label PT-BR  |
|-------|-------------|--------------|
| 1     | fuel        | Combustível  |
| 2     | salary      | Salário      |
| 3     | maintenance | Manutenção   |
| 4     | insurance   | Seguro       |
| 5     | other       | Outros       |

---

## Fluxo: Gestão de Payables

### Listagem

```
1. Usuário acessa /finances/payables
2. Sistema carrega lista paginada ordenada por data de vencimento (ASC)
3. Usuário pode filtrar por status, categoria, contrato e intervalo de vencimento
4. Usuário pode editar um payable pela ação na linha
5. Usuário pode cadastrar payable manual via botão "Nova despesa"
```

### Cadastro

```
1. Usuário clica em "Nova despesa"
2. Modal abre com campos: valor, vencimento, categoria (obrigatórios) + contrato e descrição (opcionais)
3. Usuário preenche e salva
4. Toast de sucesso, lista atualizada
```

### Edição

```
1. Usuário clica em "Editar" na linha
2. Modal abre com campos pré-preenchidos
3. Campos value/dueDate bloqueados se status = paid ou canceled
4. Select de status exibe apenas transições permitidas para o status atual
5. Usuário altera e salva
6. Toast de sucesso, lista atualizada
```

---

## Telas

### PayablesPage — `/finances/payables`

Elementos:
- Título "Contas a pagar"
- Botão "Nova despesa"
- Filtros: select de status, select de categoria, date pickers (vencimento de/até), select de contrato (com busca, opcional)
- Tabela com colunas: Vencimento, Categoria, Descrição, Valor, Status, Ações
- Ações por linha: Editar (desabilitado para status paid/canceled)
- Paginação

### PayableFormModal — Modal de Cadastro / Edição

**Campos de criação:**

| Campo       | Tipo          | Obrigatório | Notas                         |
|-------------|---------------|-------------|-------------------------------|
| value       | number input  | Sim         | Positivo                      |
| dueDate     | date input    | Sim         | Formato BR com máscara        |
| category    | select        | Sim         | 5 opções                      |
| contractId  | select        | Não         | Com busca por nome do cliente |
| description | textarea      | Não         | Máx. 500 chars, com contador  |

**Campos de edição** (mesmos campos de criação, mais):

| Campo  | Tipo   | Notas                                                         |
|--------|--------|---------------------------------------------------------------|
| status | select | Apenas transições permitidas para o status atual; oculto se terminal |

Campos bloqueados (read-only) apenas quando status = canceled (3). Payables pagos permanecem totalmente editáveis — como o cadastro é manual, erros são possíveis.

---

## Integração com API

| Ação              | Endpoint            | Método |
|-------------------|---------------------|--------|
| Listar payables   | `/payables`         | GET    |
| Criar payable     | `/payables`         | POST   |
| Atualizar payable | `/payables/:id`     | PUT    |
| Detalhe payable   | `/payables/:id`     | GET    |

### Payload de criação

```ts
interface CreatePayableDTO {
  value: number           // obrigatório, positivo
  dueDate: string         // obrigatório, formato ISO (yyyy-mm-dd)
  category: number        // obrigatório, 1–5
  contractId?: string     // opcional, uuid
  description?: string    // opcional, máx. 500 chars
}
```

### Payload de atualização

```ts
interface UpdatePayableDTO {
  id: string
  value?: number
  dueDate?: string
  status?: number         // apenas transições válidas
  category?: number       // 1–5
  description?: string    // máx. 500 chars
}
```

### Resposta (entidade)

```ts
// axiosBaseQuery já desembrulha result.data.data
interface Payable {
  id: string
  tenantId: string
  contractId: string | null
  value: string           // string numérica: "350.00"
  dueDate: string         // date ISO
  paidAt: string | null   // timestamp ISO
  status: PayableStatusValue
  category: PayableCategoryValue
  description: string | null
  createdAt: string
  updatedAt: string
}
```

> **Atenção:** `value` vem como string do backend (tipo `numeric` do Postgres). Converter para `Number(value)` ao exibir.

### Filtros de listagem

| Parâmetro    | Tipo | Obrigatório |
|--------------|------|-------------|
| `page`       | int  | Sim         |
| `limit`      | int  | Sim         |
| `status`     | int  | Não (0–3)   |
| `category`   | int  | Não (1–5)   |
| `contractId` | uuid | Não         |
| `dueDateFrom`| date | Não         |
| `dueDateTo`  | date | Não         |

### Invalidação de cache

Após criar ou atualizar: invalidar `['Payable']`.

---

## Validação (Zod)

```ts
// createPayableSchema
z.object({
  value: z.coerce.number().positive('Valor deve ser maior que zero'),
  dueDate: z.string().min(1, 'Vencimento obrigatório'),
  category: z.number().int().min(1).max(5, 'Categoria obrigatória'),
  contractId: z.string().uuid().optional().or(z.literal('')),
  description: z.string().max(500, 'Máximo 500 caracteres').optional(),
})

// updatePayableSchema
z.object({
  value: z.coerce.number().positive().optional(),
  dueDate: z.string().optional(),
  status: z.number().int().min(0).max(3).optional(),
  category: z.number().int().min(1).max(5).optional(),
  description: z.string().max(500).optional(),
})
```

---

## Tipos TypeScript

```ts
export type PayableStatusValue = 0 | 1 | 2 | 3
export type PayableCategoryValue = 1 | 2 | 3 | 4 | 5

export const ALLOWED_PAYABLE_STATUS_TRANSITIONS: Record<PayableStatusValue, PayableStatusValue[]> = {
  0: [1, 2, 3],
  1: [0, 2, 3],
  2: [1, 3],
  3: [],
}
```

---

## Estados da Tela

| Estado                        | Comportamento                                                   |
|-------------------------------|-----------------------------------------------------------------|
| Loading lista                 | Skeleton na tabela                                              |
| Lista vazia                   | Mensagem "Nenhuma despesa encontrada"                           |
| Erro de listagem              | Mensagem de erro + botão "Tentar novamente"                     |
| Status canceled               | Botão "Editar" não renderizado na linha                         |
| Modal aberto (criação)        | Campos vazios, status padrão Pendente                           |
| Modal aberto (edição, pago)   | Todos os campos editáveis; select de status com opções pending/overdue/canceled |
| Loading (salvando)            | Botão salvar desabilitado com texto "Salvando..."               |
| Sucesso                       | Toast de sucesso + lista atualizada                             |
| Erro de API                   | Mensagem amigável exibida no modal                              |

---

## Erros Esperados

| Código da API              | Mensagem para o usuário                          |
|----------------------------|--------------------------------------------------|
| `PAYABLE_NOT_FOUND`        | "Despesa não encontrada."                        |
| `CONTRACT_NOT_FOUND`       | "Contrato não encontrado."                       |
| `INVALID_PAYABLE_DATA`     | "Dados inválidos. Verifique os campos."          |
| `PAYABLE_ALREADY_PAID`     | "Despesas pagas não podem ser alteradas."        |
| `PAYABLE_ALREADY_CANCELED` | "Despesas canceladas não podem ser alteradas."   |
| `INVALID_STATUS_TRANSITION`| "Esta transição de status não é permitida."      |
| `TENANT_ACCESS_DENIED`     | "Acesso negado."                                 |
| `UNAUTHORIZED`             | "Sessão expirada. Faça login novamente."         |

---

## Arquivos a Criar

| Arquivo | Ação |
|---------|------|
| `features/finances/types/payable.types.ts` | Criar |
| `features/finances/schemas/create-payable.schema.ts` | Criar |
| `features/finances/schemas/update-payable.schema.ts` | Criar |
| `features/finances/utils/payableStatus.ts` | Criar |
| `features/finances/utils/payableErrors.ts` | Criar |
| `features/finances/store/payablesApi.ts` | Criar |
| `features/finances/components/PayableStatusBadge.tsx` | Criar |
| `features/finances/components/PayableFormModal.tsx` | Criar |
| `features/finances/components/PayablesTable.tsx` | Criar |
| `features/finances/components/PayableFilters.tsx` | Criar |
| `features/finances/pages/PayablesPage.tsx` | Criar |
| `app/store.ts` | Modificar — registrar `payablesApi` |
| `app/router.tsx` (ou equivalente) | Modificar — rota `/finances/payables` |

---

## Critérios de Aceite

- [ ] Listagem carrega payables com paginação, ordenados por vencimento ASC
- [ ] Filtros por status, categoria, contrato e intervalo de vencimento funcionam
- [ ] Nova despesa pode ser cadastrada via modal
- [ ] Categorias exibidas em PT-BR
- [ ] Status pode ser alterado respeitando as transições permitidas
- [ ] Opções de status no select limitadas às transições válidas para o status atual
- [ ] Campos bloqueados apenas para payables com status canceled
- [ ] Payables com status paid são totalmente editáveis (valor, vencimento, categoria, descrição e status)
- [ ] `value` recebido como string numérica é convertido corretamente para exibição
- [ ] Toast de sucesso após cada operação
- [ ] Erros da API exibidos com mensagem amigável no modal
- [ ] Listagem atualizada automaticamente após qualquer operação
