# Tasks: Vehicle Management

## 1. Tipos e constantes
- [ ] Criar `features/vehicles/types/vehicle.types.ts`
  - `VehicleStatusValue = 0 | 1 | 2`
  - Interfaces: `Vehicle`, `VehicleFilters`, `CreateVehicleDTO`, `UpdateVehicleDTO`
  - Constante `VEHICLE_STATUS_LABELS: Record<VehicleStatusValue, string>`

## 2. Schemas Zod
- [ ] Criar `features/vehicles/schemas/create-vehicle.schema.ts`
  - Campos obrigatórios: `plate`, `model`, `capacity`
  - Campos opcionais: `year`, `lastRevisionAt`, `nextRevisionAt`
  - Refinement: `nextRevisionAt >= lastRevisionAt` se ambos informados
  - Transformar datas BR → ISO antes do submit
- [ ] Criar `features/vehicles/schemas/update-vehicle.schema.ts`
  - Todos os campos opcionais
  - Campo adicional: `status` (0 | 1 | 2)
  - Mesmo refinement de datas

## 3. Utils
- [ ] Criar `features/vehicles/utils/vehicleStatus.ts`
  - `getVehicleStatusLabel(status): string` — "Ativo" / "Inativo" / "Manutenção"
  - `getVehicleStatusColor(status): string` — classes Tailwind para badge
- [ ] Criar `features/vehicles/utils/vehicleRevision.ts`
  - `getRevisionAlertLevel(nextRevisionAt): 'overdue' | 'upcoming' | null`
  - Usar `split('-')` + `new Date(y, m-1, d)` para parse seguro de timezone
  - "overdue" = já passou; "upcoming" = dentro de 30 dias
- [ ] Criar `features/vehicles/utils/vehicleErrors.ts`
  - `getVehicleErrorMessage(code): string`
  - Mapear: `VEHICLE_NOT_FOUND`, `VEHICLE_PLATE_ALREADY_EXISTS`, `INVALID_VEHICLE_DATA`

## 4. API Slice (RTK Query)
- [ ] Criar `features/vehicles/store/vehiclesApi.ts`
  - `getVehicles` — GET `/vehicles` com filtros + paginação
  - `getVehicleById` — GET `/vehicles/:id`
  - `createVehicle` — POST `/vehicles`, invalida `['Vehicle']`
  - `updateVehicle` — PUT `/vehicles/:id`, invalida `['Vehicle', { type: 'Vehicle', id }]`
  - Usar `providesTags`/`invalidatesTags` com tag `'Vehicle'`
- [ ] Registrar em `app/store.ts`
  - Adicionar `[vehiclesApi.reducerPath]: vehiclesApi.reducer`
  - Adicionar `vehiclesApi.middleware` ao concat

## 5. Componentes
- [ ] Criar `features/vehicles/components/VehicleStatusBadge.tsx`
  - Badge colorido: verde (ativo) / cinza (inativo) / amarelo (manutenção)
- [ ] Criar `features/vehicles/components/VehicleFilters.tsx`
  - Select de status: "Todos", "Ativo", "Inativo", "Manutenção"
- [ ] Criar `features/vehicles/components/VehiclesTable.tsx`
  - Colunas: Placa, Modelo, Ano, Capacidade, Status, Próx. Revisão, Ações
  - Coluna "Próx. Revisão": data formatada BR + ícone de alerta (vermelho/amarelo)
  - Botão "Editar" em cada linha
  - Estado de loading (skeleton) e lista vazia
- [ ] Criar `features/vehicles/components/VehicleFormModal.tsx`
  - Modo criação: campos sem status; plate em uppercase automático
  - Modo edição: todos os campos + select de status
  - Campos de data com máscara BR (dd/mm/yyyy), conversão para ISO no submit
  - Validação client-side (Zod); erro de API exibido no modal
  - Botão "Salvar" desabilitado enquanto loading

## 6. Página
- [ ] Criar `features/vehicles/pages/VehiclesPage.tsx`
  - Título "Veículos", botão "+ Novo veículo"
  - Compõe: `VehicleFilters` + `VehiclesTable` + `VehicleFormModal`
  - Estado: `filters`, `page`, `modalOpen`, `selectedVehicle`

## 7. Roteamento e Sidebar
- [ ] Adicionar rota `/vehicles` em `routes/index.tsx`
  - Lazy import de `VehiclesPage`
  - Dentro do `ProtectedRoute` + `AppLayout`
- [ ] Adicionar item "Veículos" em `layouts/Sidebar.tsx`
  - Ícone de van (SVG)
  - Caminho `/vehicles`
  - Posicionar após "Contratos" (antes das finanças)
