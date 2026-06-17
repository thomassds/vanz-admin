# Tasks: Home Dashboard (Frontend)

> Ref: `specs/dashboard/home/home-dashboard-spec.md`

---

## Types

- [x] Criar `features/dashboard/types/dashboard.types.ts` com interfaces:
  - [x] `DashboardSummary` (clients, contracts, receivables)
  - [x] `UpcomingReceivable`
  - [x] `UpcomingReceivablesResponse`
  - [x] `MonthlyRevenueItem`
  - [x] `MonthlyRevenueResponse`

---

## Store

- [x] Criar `features/dashboard/store/dashboardApi.ts` com endpoints:
  - [x] `getSummary` (query)
  - [x] `getUpcoming` (query com page e limit)
  - [x] `getMonthlyRevenue` (query com months)
- [x] Registrar `dashboardApi` no `app/store.ts`

---

## Componentes

- [x] Criar `features/dashboard/components/SummaryKpis.tsx`
  - [x] Cards de clientes (total, ativos, novos no mês)
  - [x] Cards de contratos (ativos, pendentes, vencendo em 30 dias)
  - [x] Cards financeiros (previsto, recebido, em aberto, vencidos)
  - [x] Skeleton durante loading
- [x] Criar `features/dashboard/components/UpcomingReceivablesTable.tsx`
  - [x] Tabela com colunas: Cliente, Parcela, Vencimento, Valor, Status
  - [x] Link "Ver recebível" → `/finances/receivables?contractId=:id`
  - [x] Paginação
  - [x] Skeleton durante loading
- [x] Criar `features/dashboard/components/MonthlyRevenueTable.tsx`
  - [x] Tabela com colunas: Mês, Previsto, Recebido, Em aberto, Vencido
  - [x] Seletor de período (3 / 6 / 12 meses)
  - [x] Skeleton durante loading

---

## Page

- [x] Substituir `pages/DashboardPage.tsx` pela implementação real
  - [x] Compor `SummaryKpis` + `UpcomingReceivablesTable` + `MonthlyRevenueTable`
  - [x] Título "Dashboard"
  - [x] Seções com cards e tabelas independentes

---

## Testes

> Nota: testes ainda não escritos.

- [ ] Teste: KPIs renderizam valores corretamente
- [ ] Teste: skeleton exibido durante loading
- [ ] Teste: tabela de vencimentos paginada
- [ ] Teste: seletor de meses atualiza a query corretamente
