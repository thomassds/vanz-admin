# Feature: Realtime Map (Frontend)

## Objetivo

Exibir um mapa interativo com a posição em tempo real de todos os veículos da frota que possuem dispositivo ativo, atualizando os marcadores automaticamente conforme o backend emite eventos via WebSocket.

---

## Contexto

O backend usa Socket.IO para emitir eventos `vehicle:position` sempre que um dispositivo envia uma nova posição. O frontend se conecta ao namespace `/tracking`, autentica via JWT e `x-tenant-id`, e escuta esses eventos para atualizar os marcadores no mapa. O usuário não precisa saber nada sobre o protocolo — apenas vê os veículos se movendo no mapa.

---

## Dependências a instalar

| Pacote | Finalidade |
|--------|-----------|
| `socket.io-client` | Cliente WebSocket (mesma lib do backend) |
| `leaflet` | Engine de mapa (OpenStreetMap, sem API key) |
| `react-leaflet` | Bindings React para Leaflet |
| `@types/leaflet` | Tipos TypeScript para Leaflet |

---

## Fluxo

### Conexão WebSocket

```
1. Página monta → conecta ao namespace /tracking
2. Auth: header Authorization: Bearer {jwt} + x-tenant-id: {tenantId}
3. Backend valida e adiciona socket à sala tenant:{tenantId}
4. Frontend escuta evento "vehicle:position"
5. Página desmonta → desconecta socket
```

### Carga inicial de posições

```
1. Carregar lista de veículos com devices ativos (GET /tracking/devices?status=0)
2. Para cada vehicleId, chamar GET /tracking/vehicles/:vehicleId/position
3. Renderizar marcador para cada veículo com posição disponível
4. Erros individuais (DEVICE_POSITION_UNAVAILABLE) são ignorados silenciosamente
```

### Update em tempo real

```
1. Evento "vehicle:position" chega com { vehicleId, latitude, longitude, speed, capturedAt }
2. Se já existe marcador para o vehicleId → atualizar posição
3. Se é novo vehicleId → criar marcador
4. Atualizar timestamp "Última atualização" no popup do marcador
```

---

## Tela

### TrackingMapPage — `/tracking/map`

Elementos:
- Mapa OpenStreetMap fullscreen (ocupa toda a área de conteúdo)
- Marcador por veículo com posição conhecida
- **Popup do marcador** ao clicar:
  - Placa e modelo do veículo
  - Velocidade atual (km/h)
  - Última atualização (tempo relativo: "há 2 min")
- **Indicador de conexão** (canto superior direito):
  - 🟢 Conectado
  - 🟡 Reconectando...
  - 🔴 Desconectado
- **Marcador com cor por staleness** (dados desatualizados):
  - Azul: posição recente (< 5 min)
  - Amarelo: posição antiga (5–15 min)
  - Cinza: posição muito antiga (> 15 min) ou sem posição recente

### Navegação entre telas de tracking

Adicionar alternância entre as duas telas de tracking:
- Tab/botão "Dispositivos" → `/tracking`
- Tab/botão "Mapa" → `/tracking/map`

---

## WebSocket — Detalhes de Conexão

```ts
import { io } from 'socket.io-client'

const socket = io(`${BACKEND_URL}/tracking`, {
  extraHeaders: {
    Authorization: `Bearer ${token}`,
    'x-tenant-id': tenantId,
  },
  transports: ['websocket'],
  autoConnect: false,
})
```

### Evento recebido

```ts
// Evento: "vehicle:position"
interface VehiclePositionEvent {
  vehicleId: string
  deviceId: string
  latitude: number
  longitude: number
  speed: number          // km/h
  capturedAt: string     // ISO date-time
}
```

### Evento de erro do servidor

```ts
// Evento: "error"
interface WsError {
  code: 'WS_UNAUTHORIZED'
}
// Ao receber WS_UNAUTHORIZED → mostrar toast de erro e não tentar reconectar
```

---

## Estado da Tela

```ts
interface VehicleMarker {
  vehicleId: string
  plate: string
  model: string
  latitude: number
  longitude: number
  speed: number
  capturedAt: string
  updatedAt: Date        // timestamp local do último update recebido
}

type ConnectionStatus = 'connecting' | 'connected' | 'reconnecting' | 'disconnected'
```

| Estado | Comportamento |
|--------|---------------|
| Conectando | Indicador amarelo "Conectando..." |
| Conectado, sem veículos | Mapa vazio + mensagem "Nenhum veículo com posição disponível" |
| Conectado, com veículos | Marcadores no mapa, atualizados em tempo real |
| Reconectando | Indicador amarelo "Reconectando...", marcadores congelados |
| Desconectado | Indicador vermelho, toast de aviso |
| WS_UNAUTHORIZED | Toast de erro "Sessão expirada", sem reconexão |

---

## Hook Proposto — `useTrackingSocket`

Encapsular toda a lógica de conexão em um hook:

```ts
function useTrackingSocket(): {
  markers: Map<string, VehicleMarker>
  status: ConnectionStatus
}
```

- Conecta ao montar, desconecta ao desmontar
- Atualiza `markers` a cada evento `vehicle:position`
- Expõe `status` da conexão
- Lê `token` e `tenantId` do Redux auth state

---

## Integração com API REST (carga inicial)

| Ação | Endpoint | Método |
|------|----------|--------|
| Listar devices ativos | `/tracking/devices?status=0` | GET |
| Posição de um veículo | `/tracking/vehicles/:vehicleId/position` | GET |

> O endpoint de posição retorna erro 404 se o veículo não tiver posição — ignorar silenciosamente.

Adicionar ao `trackingApi.ts`:
```ts
getVehiclePosition: builder.query<VehiclePositionResult, string>({
  query: (vehicleId) => ({ url: `/tracking/vehicles/${vehicleId}/position`, method: 'GET' }),
})
```

---

## Arquivos a Criar

| Arquivo | Tipo |
|---------|------|
| `features/tracking/types/position.types.ts` | Tipos de posição e conexão |
| `features/tracking/hooks/useTrackingSocket.ts` | Hook de conexão WebSocket |
| `features/tracking/pages/TrackingMapPage.tsx` | Página do mapa |
| `features/tracking/components/VehicleMarker.tsx` | Marcador customizado no mapa |
| `features/tracking/components/ConnectionStatus.tsx` | Indicador de status da conexão |
| `features/tracking/components/TrackingTabs.tsx` | Tabs Dispositivos / Mapa |

## Arquivos a Modificar

| Arquivo | Mudança |
|---------|---------|
| `features/tracking/store/trackingApi.ts` | Adicionar `getVehiclePosition` |
| `features/tracking/pages/TrackingPage.tsx` | Adicionar `TrackingTabs` no topo |
| `routes/index.tsx` | Adicionar rota `/tracking/map` |

---

## Critérios de Aceite

- [ ] Mapa carrega com tiles OpenStreetMap
- [ ] Conexão WebSocket estabelecida ao entrar na página
- [ ] Socket desconecta ao sair da página
- [ ] Posições iniciais carregadas via REST antes do primeiro evento WS
- [ ] Marcadores atualizam em tempo real sem reload
- [ ] Popup exibe placa, modelo, velocidade e tempo desde última atualização
- [ ] Indicador de conexão visível e preciso
- [ ] Marcador muda de cor conforme desatualização dos dados
- [ ] Erro `WS_UNAUTHORIZED` exibe toast e interrompe reconexão
- [ ] Tabs "Dispositivos" / "Mapa" funcionam
- [ ] Nenhuma referência a provedores externos na interface
