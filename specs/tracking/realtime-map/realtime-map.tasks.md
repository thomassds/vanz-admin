# Tasks: Realtime Map

## 1. Dependências
- [ ] Instalar `socket.io-client`
- [ ] Instalar `leaflet`, `react-leaflet`, `@types/leaflet`

## 2. Tipos
- [ ] Criar `features/tracking/types/position.types.ts`
  - `VehiclePositionEvent` — payload do evento WS `vehicle:position`
  - `VehicleMarker` — estado local de um marcador no mapa
  - `ConnectionStatus = 'connecting' | 'connected' | 'reconnecting' | 'disconnected'`

## 3. API REST — posição inicial
- [ ] Adicionar `getVehiclePosition` em `features/tracking/store/trackingApi.ts`
  - GET `/tracking/vehicles/:vehicleId/position`
  - Retorna `VehiclePositionResult` ou 404 (ignorar silenciosamente)

## 4. Hook WebSocket
- [ ] Criar `features/tracking/hooks/useTrackingSocket.ts`
  - Conecta ao namespace `/tracking` com `Authorization` + `x-tenant-id`
  - Escuta evento `vehicle:position` → atualiza mapa de markers
  - Escuta evento `error` → se `WS_UNAUTHORIZED`, para reconexão
  - Expõe `{ markers: Map<string, VehicleMarker>, status: ConnectionStatus }`
  - Conecta ao montar, desconecta ao desmontar
  - Lê `token` e `tenantId` do Redux auth state

## 5. Componentes
- [ ] Criar `features/tracking/components/ConnectionStatus.tsx`
  - Indicador visual: 🟢 Conectado / 🟡 Reconectando / 🔴 Desconectado
  - Posicionado no canto superior direito do mapa
- [ ] Criar `features/tracking/components/VehicleMarker.tsx`
  - Marcador customizado com cor por staleness:
    - Azul: < 5 min
    - Amarelo: 5–15 min
    - Cinza: > 15 min
  - Popup com: placa, modelo, velocidade (km/h), tempo desde última atualização
- [ ] Criar `features/tracking/components/TrackingTabs.tsx`
  - Tabs "Dispositivos" (`/tracking`) e "Mapa" (`/tracking/map`)
  - Tab ativa destacada

## 6. Página
- [ ] Criar `features/tracking/pages/TrackingMapPage.tsx`
  - Mapa Leaflet fullscreen com tiles OpenStreetMap
  - Usa `useTrackingSocket` para receber posições em tempo real
  - Carga inicial via REST para cada veículo com device ativo
  - Renderiza `VehicleMarker` para cada entrada em `markers`
  - Renderiza `ConnectionStatus` sobreposto ao mapa
  - Estado vazio: mensagem "Nenhum veículo com posição disponível"

## 7. Roteamento e navegação
- [ ] Adicionar rota `/tracking/map` em `routes/index.tsx`
  - Lazy import de `TrackingMapPage`
- [ ] Adicionar `<TrackingTabs />` no topo de `TrackingPage.tsx`
- [ ] Adicionar `<TrackingTabs />` no topo de `TrackingMapPage.tsx`
