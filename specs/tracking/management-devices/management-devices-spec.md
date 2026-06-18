# Feature: Device Management (Frontend)

## Objetivo

Permitir que o tenant gerencie os dispositivos de rastreamento vinculados à sua frota: cadastrar novos dispositivos, visualizar os cadastrados e removê-los.

---

## Contexto

O módulo de rastreamento da Vanz opera com **dispositivos** vinculados a veículos. Um dispositivo pode ser um app mobile instalado no smartphone do motorista ou um rastreador GPS físico instalado no veículo. O tenant não precisa saber nada sobre o provedor de rastreamento subjacente — toda comunicação com serviços externos é transparente.

> O frontend conhece apenas "Vanz" e "dispositivos de rastreamento". Nenhuma referência a provedores externos deve aparecer na interface.

---

## Tipos de Dispositivo

| Valor | Chave       | Label           | Cor sugerida |
|-------|-------------|-----------------|--------------|
| 0     | mobile_app  | App Mobile      | Roxo         |
| 1     | gps_tracker | Rastreador GPS  | Azul         |

---

## Status de Dispositivo

| Valor | Chave    | Label   | Cor sugerida |
|-------|----------|---------|--------------|
| 0     | active   | Ativo   | Verde        |
| 1     | inactive | Inativo | Cinza        |

> O status é gerenciado pelo backend. O frontend não altera status diretamente.

---

## Fluxo: Gestão de Dispositivos

### Listagem

```
1. Usuário acessa /tracking
2. Sistema carrega lista paginada de dispositivos
3. Usuário pode filtrar por veículo
4. Cada linha exibe: Veículo (placa — modelo), Nome, Tipo, Status, ação Remover
5. Usuário pode cadastrar novo dispositivo via "+ Novo dispositivo"
```

### Cadastro

```
1. Usuário clica em "+ Novo dispositivo"
2. Modal abre com campos: veículo (obrigatório), tipo, nome, identificador (opcionais)
3. Usuário preenche e clica em "Cadastrar"
4. Toast de sucesso, lista atualizada
```

### Remoção

```
1. Usuário clica em "Remover" na linha do dispositivo
2. ConfirmDialog exibe mensagem de confirmação
3. Usuário confirma
4. Toast de sucesso, lista atualizada
```

---

## Telas

### TrackingPage — `/tracking`

Elementos:
- Título "Rastreamento"
- Botão "+ Novo dispositivo"
- Filtro por veículo (select: Todos / lista de veículos por placa — modelo)
- Tabela com colunas: Veículo, Nome, Tipo, Status, Ações
- Ação por linha: "Remover" (abre ConfirmDialog)
- Paginação

### CreateDeviceModal — Modal de Cadastro

| Campo       | Tipo   | Obrigatório | Notas                              |
|-------------|--------|-------------|------------------------------------|
| vehicleId   | select | Sim         | Lista de veículos: placa — modelo  |
| type        | select | Não         | App Mobile / Rastreador GPS        |
| name        | text   | Não         | Máx. 100 chars                     |
| uniqueId    | text   | Não         | Identificador único do dispositivo |

> Não existe tela de edição — dispositivos não podem ser atualizados, apenas removidos e recriados.

---

## Integração com API

| Ação              | Endpoint                              | Método   |
|-------------------|---------------------------------------|----------|
| Listar devices    | `/tracking/devices`                   | GET      |
| Cadastrar device  | `/tracking/devices`                   | POST     |
| Remover device    | `/tracking/devices/:id`               | DELETE   |

### Payload de criação

```ts
interface CreateDeviceDTO {
  vehicleId: string   // obrigatório, uuid
  uniqueId?: string   // opcional, máx. 100 chars
  name?: string       // opcional, máx. 100 chars
  type?: number       // 0=mobile_app, 1=gps_tracker
}
```

### Resposta (entidade)

```ts
interface Device {
  id: string
  tenantId: string
  vehicleId: string
  externalDeviceId: number   // ID interno — não exibir ao usuário
  uniqueId: string
  name: string
  type: DeviceTypeValue      // 0 | 1
  status: DeviceStatusValue  // 0 | 1
  createdAt: string
  updatedAt: string
}
```

> `externalDeviceId` é um detalhe de infraestrutura — nunca exibir na UI.

### Filtros de listagem

| Parâmetro   | Tipo   | Obrigatório |
|-------------|--------|-------------|
| `page`      | int    | Sim         |
| `limit`     | int    | Sim         |
| `vehicleId` | uuid   | Não         |
| `type`      | int    | Não         |
| `status`    | int    | Não         |

### Invalidação de cache

Após criar ou remover: invalidar `['Device']`.

---

## Exibição do Veículo na Tabela

A entidade `Device` retorna apenas `vehicleId`. Para exibir a placa e modelo na tabela, a página carrega todos os veículos em paralelo e faz o mapeamento local:

```ts
vehicles.find(v => v.id === device.vehicleId)?.plate ?? vehicleId.slice(0, 8) + '…'
```

---

## Estados da Tela

| Estado                  | Comportamento                                       |
|-------------------------|-----------------------------------------------------|
| Loading lista           | Skeleton na tabela                                  |
| Lista vazia             | Mensagem "Nenhum dispositivo encontrado."           |
| Erro de listagem        | Mensagem de erro + botão "Tentar novamente"         |
| Modal aberto            | Campos vazios, veículo não selecionado              |
| Loading (cadastrando)   | Botão "Cadastrar" desabilitado com "Cadastrando..." |
| Confirmação de remoção  | ConfirmDialog com nome/ID do dispositivo            |
| Loading (removendo)     | Botão "Remover" do dialog desabilitado              |
| Sucesso                 | Toast de sucesso + lista atualizada                 |
| Erro de API             | Mensagem amigável no modal ou toast                 |

---

## Erros Esperados

| Código da API                    | Mensagem para o usuário                                          |
|----------------------------------|------------------------------------------------------------------|
| `DEVICE_NOT_FOUND`               | "Dispositivo não encontrado."                                    |
| `DEVICE_ALREADY_EXISTS`          | "Este veículo já possui um dispositivo cadastrado."              |
| `DEVICE_UNIQUE_ID_ALREADY_EXISTS`| "Este identificador já está em uso por outro dispositivo."       |
| `VEHICLE_NOT_FOUND`              | "Veículo não encontrado."                                        |
| `TRACKING_PROVIDER_ERROR`        | "Erro ao comunicar com o serviço de rastreamento. Tente novamente." |
| `UNAUTHORIZED`                   | "Sessão expirada. Faça login novamente."                         |

---

## Arquivos Criados

| Arquivo | Tipo |
|---------|------|
| `features/tracking/types/device.types.ts` | Tipos |
| `features/tracking/schemas/create-device.schema.ts` | Schema Zod |
| `features/tracking/utils/deviceType.ts` | Labels de tipo |
| `features/tracking/utils/deviceStatus.ts` | Labels de status |
| `features/tracking/utils/deviceErrors.ts` | Mensagens de erro |
| `features/tracking/store/trackingApi.ts` | RTK Query |
| `features/tracking/components/DeviceTypeBadge.tsx` | Badge de tipo |
| `features/tracking/components/DeviceStatusBadge.tsx` | Badge de status |
| `features/tracking/components/DevicesTable.tsx` | Tabela |
| `features/tracking/components/CreateDeviceModal.tsx` | Modal de cadastro |
| `features/tracking/pages/TrackingPage.tsx` | Página |

---

## Critérios de Aceite

- [ ] Listagem carrega dispositivos com paginação
- [ ] Filtro por veículo funciona
- [ ] Veículo exibido na tabela como "PLACA — Modelo" (não como UUID)
- [ ] Tipo exibido com badge colorido (App Mobile / Rastreador GPS)
- [ ] Status exibido com badge colorido (Ativo / Inativo)
- [ ] Nenhuma referência a provedores externos na interface
- [ ] `externalDeviceId` nunca exibido ao usuário
- [ ] Novo dispositivo cadastrado via modal
- [ ] Remoção exige confirmação via ConfirmDialog
- [ ] Toast de sucesso após cada operação
- [ ] Erros da API exibidos com mensagem amigável
- [ ] Listagem atualizada automaticamente após qualquer operação
- [ ] "Rastreamento" acessível pelo menu lateral
