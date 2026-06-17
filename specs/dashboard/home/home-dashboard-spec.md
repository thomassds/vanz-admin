# Feature: Home Dashboard (Frontend)

## Objetivo

Exibir ao tenant uma visão consolidada da operação na tela inicial da plataforma: KPIs de clientes, contratos e financeiro do mês, lista de próximos vencimentos e histórico de receita mensal.

---

## Contexto

O Dashboard é a primeira tela que o usuário vê após o login. O objetivo é responder rapidamente às perguntas mais frequentes do gestor:

- Quantos clientes e contratos ativos tenho?
- Quanto preciso receber este mês? Quanto já recebi?
- Tenho recebimentos vencidos em aberto?
- Quais recebimentos vencem nos próximos dias?

Todos os dados são isolados por tenant — o usuário vê apenas os dados da própria empresa.

---

## Fluxo: Consulta do Dashboard

### Carregamento inicial

```
1. Usuário acessa a home do sistema (/)
2. Tela dispara 3 chamadas simultâneas:
   - GET /dashboard/summary  (KPIs)
   - GET /dashboard/upcoming (próximos vencimentos, page=1, limit=10)
   - GET /dashboard/monthly-revenue (histórico, months=6)
3. Cards de KPI e seções exibem skeleton enquanto carregam
4. Dados populam as seções ao resolver
```

### Próximos vencimentos — paginação

```
1. Usuário navega entre páginas da lista de próximos vencimentos
2. Tela faz nova chamada GET /dashboard/upcoming?page=N
3. Lista atualiza sem recarregar o restante da página
```

### Histórico mensal — troca de período

```
1. Usuário seleciona quantidade de meses (3, 6 ou 12)
2. Tela faz nova chamada GET /dashboard/monthly-revenue?months=N
3. Gráfico/tabela de receita atualiza
```

---

## Telas

### DashboardPage — `/`

#### Seção 1 — KPIs de Clientes

Cards:
- **Total de clientes** (`clients.total`)
- **Clientes ativos** (`clients.active`)
- **Novos este mês** (`clients.newThisMonth`)

#### Seção 2 — KPIs de Contratos

Cards:
- **Contratos ativos** (`contracts.active`)
- **Contratos pendentes** (`contracts.pending`)
- **Vencendo em 30 dias** (`contracts.expiringIn30Days`)

#### Seção 3 — KPIs Financeiros (mês corrente)

Cards:
- **Previsto no mês** (`receivables.expectedThisMonth`) — formatado em R$
- **Recebido no mês** (`receivables.receivedThisMonth`) — formatado em R$, destaque verde
- **Em aberto no mês** (`receivables.pendingThisMonth`) — formatado em R$, destaque amarelo/laranja
- **Vencidos (total)** (`receivables.overdueTotal`) — formatado em R$, destaque vermelho
- **Qtd. vencidos** (`receivables.overdueCount`) — número de recebimentos vencidos em aberto

#### Seção 4 — Próximos Vencimentos

Tabela paginada de recebimentos com `dueDate` nos próximos 30 dias:

| Coluna       | Dado                                     |
|--------------|------------------------------------------|
| Cliente      | `clientName`                             |
| Parcela      | `#installmentNumber`                     |
| Vencimento   | `dueDate` formatado em dd/mm/yyyy        |
| Valor        | `value` formatado em R$                  |
| Status       | Badge de status (Pendente / Cobrado)     |
| Ação         | Link "Ver recebível" → `/finances/receivables?contractId=:contractId` |

- Paginação (page / totalPages)
- Máximo de 10 itens por página

#### Seção 5 — Receita Mensal

Tabela ou gráfico de barras com série histórica:

| Coluna    | Dado                         |
|-----------|------------------------------|
| Mês       | `month` formatado (Jan/2026) |
| Previsto  | `expected` em R$             |
| Recebido  | `received` em R$             |
| Em aberto | `pending` em R$              |
| Vencido   | `overdue` em R$              |

- Seletor de período: 3, 6 ou 12 meses (default: 6)
- Ordenado do mês mais antigo para o mais recente

---

## Integração com API

| Ação                        | Endpoint                              | Método |
|-----------------------------|---------------------------------------|--------|
| KPIs consolidados           | `/dashboard/summary`                  | GET    |
| Próximos vencimentos        | `/dashboard/upcoming`                 | GET    |
| Histórico de receita mensal | `/dashboard/monthly-revenue`          | GET    |

### Parâmetros — `/dashboard/upcoming`

| Parâmetro | Tipo | Obrigatório | Default |
|-----------|------|-------------|---------|
| `page`    | int  | Não         | 1       |
| `limit`   | int  | Não         | 10      |

### Parâmetros — `/dashboard/monthly-revenue`

| Parâmetro | Tipo | Obrigatório | Default | Range |
|-----------|------|-------------|---------|-------|
| `months`  | int  | Não         | 6       | 1–12  |

---

## Tipos TypeScript

```ts
// GET /dashboard/summary
interface DashboardSummary {
  clients: {
    total: number
    active: number
    inactive: number
    newThisMonth: number
  }
  contracts: {
    active: number
    pending: number
    suspended: number
    canceled: number
    expiringIn30Days: number
  }
  receivables: {
    expectedThisMonth: number
    receivedThisMonth: number
    pendingThisMonth: number
    overdueTotal: number
    overdueCount: number
  }
}

// GET /dashboard/upcoming
interface UpcomingReceivable {
  id: string
  contractId: string
  clientName: string
  dueDate: string        // 'yyyy-mm-dd'
  value: number
  status: string         // 'pending' | 'charged'
  installmentNumber: number
}

interface UpcomingReceivablesResponse {
  data: UpcomingReceivable[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

// GET /dashboard/monthly-revenue
interface MonthlyRevenueItem {
  month: string          // 'yyyy-mm'
  expected: number
  received: number
  pending: number
  overdue: number
}

interface MonthlyRevenueResponse {
  data: MonthlyRevenueItem[]
}
```

---

## RTK Query — `dashboardApi`

```ts
// Endpoints a criar em src/features/dashboard/store/dashboardApi.ts
getSummary()           // providesTags: ['DashboardSummary']
getUpcoming(params)    // providesTags: ['DashboardUpcoming']
getMonthlyRevenue(months) // providesTags: ['DashboardRevenue']
```

---

## Estados das Telas

| Estado               | Comportamento                                          |
|----------------------|--------------------------------------------------------|
| Loading KPIs         | Skeleton em cada card de KPI                           |
| Loading upcoming     | Skeleton nas linhas da tabela                          |
| Loading revenue      | Skeleton nas linhas/gráfico                            |
| Erro KPIs            | Mensagem de erro + botão "Tentar novamente"            |
| Erro upcoming        | Mensagem de erro + botão "Tentar novamente"            |
| Upcoming vazio       | Mensagem "Nenhum vencimento nos próximos 30 dias"      |
| Revenue sem dados    | Mensagem "Sem dados no período"                        |
| Overdues = 0         | Card de vencidos sem destaque vermelho (neutro)        |

---

## Erros Esperados

| Código da API          | Situação                                               | Comportamento                     |
|------------------------|--------------------------------------------------------|-----------------------------------|
| `UNAUTHORIZED`         | Token ausente, inválido ou expirado                    | Redirect para /login              |
| `TENANT_ACCESS_DENIED` | Tentativa de acessar recurso de outro tenant           | Mensagem genérica de erro         |
| `VALIDATION_ERROR`     | Parâmetro `months` fora do range (ex: 0 ou 13)        | Nunca ocorre — UI restringe opções|

---

## Critérios de Aceite

- [ ] KPIs de clientes, contratos e financeiro carregam em chamada única ao `/summary`
- [ ] Valores financeiros são exibidos formatados em R$ (pt-BR)
- [ ] Datas de vencimento são exibidas no formato dd/mm/yyyy
- [ ] Tabela de próximos vencimentos é paginada (máx. 10/página)
- [ ] Clicar em "Ver recebível" redireciona para `/finances/receivables?contractId=:id`
- [ ] Seletor de período (3/6/12 meses) recarrega apenas o histórico mensal
- [ ] Skeleton é exibido em todas as seções durante o carregamento inicial
- [ ] Seções carregam de forma independente (falha em uma não bloqueia as outras)
- [ ] Card de "Vencidos" tem destaque visual vermelho quando `overdueCount > 0`
- [ ] Mês no histórico mensal é exibido no formato legível (ex: "Jun/2026")
