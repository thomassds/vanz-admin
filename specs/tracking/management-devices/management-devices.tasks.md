# Tasks: Device Management

## 1. Tipos e constantes
- [x] Criar `features/tracking/types/device.types.ts`
  - `DeviceTypeValue = 0 | 1`
  - `DeviceStatusValue = 0 | 1`
  - Interfaces: `Device`, `DeviceFilters`, `CreateDeviceDTO`

## 2. Schema Zod
- [x] Criar `features/tracking/schemas/create-device.schema.ts`
  - `vehicleId`: obrigatório
  - `name`, `uniqueId`, `type`: opcionais

## 3. Utils
- [x] Criar `features/tracking/utils/deviceType.ts`
  - `getDeviceTypeLabel(type)` — "App Mobile" / "Rastreador GPS"
  - `DEVICE_TYPE_OPTIONS`
- [x] Criar `features/tracking/utils/deviceStatus.ts`
  - `getDeviceStatusLabel(status)` — "Ativo" / "Inativo"
  - `getDeviceStatusBadgeClass(status)`
- [x] Criar `features/tracking/utils/deviceErrors.ts`
  - `getDeviceErrorMessage(code)` — mapear todos os erros esperados

## 4. API Slice (RTK Query)
- [x] Criar `features/tracking/store/trackingApi.ts`
  - `getDevices` — GET `/tracking/devices`
  - `createDevice` — POST `/tracking/devices`, invalida `['Device']`
  - `deleteDevice` — DELETE `/tracking/devices/:id`, invalida `['Device']`
- [x] Registrar em `app/store.ts`

## 5. Componentes
- [x] Criar `features/tracking/components/DeviceTypeBadge.tsx`
  - Roxo (App Mobile) / Azul (Rastreador GPS)
- [x] Criar `features/tracking/components/DeviceStatusBadge.tsx`
  - Verde (Ativo) / Cinza (Inativo)
- [x] Criar `features/tracking/components/DevicesTable.tsx`
  - Colunas: Veículo, Nome, Tipo, Status, Ações
  - Veículo resolvido via lookup local na lista de veículos
  - Botão "Remover" abre ConfirmDialog
  - Skeleton + empty state + erro + paginação
- [x] Criar `features/tracking/components/CreateDeviceModal.tsx`
  - Select de veículo (obrigatório)
  - Select de tipo (padrão: App Mobile)
  - Inputs nome e identificador (opcionais)
  - Erro de API exibido no modal

## 6. Página
- [x] Criar `features/tracking/pages/TrackingPage.tsx`
  - Título "Rastreamento", botão "+ Novo dispositivo"
  - Filtro por veículo
  - Compõe: `DevicesTable` + `CreateDeviceModal` + `ConfirmDialog`
  - Toast de sucesso/erro nas operações

## 7. Roteamento e Sidebar
- [x] Adicionar rota `/tracking` em `routes/index.tsx`
- [x] Adicionar item "Rastreamento" com ícone de localização em `layouts/Sidebar.tsx`
