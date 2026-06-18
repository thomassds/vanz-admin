# Feature: Vehicle Management (Frontend)

## Objetivo

Permitir que o tenant gerencie sua frota de veículos: cadastrar, listar, filtrar e atualizar veículos, com suporte a controle de revisões preventivas.

---

## Contexto

Veículos são os ativos operacionais do tenant. Cada veículo tem placa, modelo, capacidade de passageiros, ano de fabricação, status e datas de revisão. O status é alterado livremente (sem máquina de estados restritiva). Veículos com revisão próxima (≤ 30 dias) ou vencida devem ser sinalizados visualmente para facilitar a gestão preventiva.

---

## Status de Veículos

| Valor | Chave       | Label PT-BR  | Cor sugerida |
|-------|-------------|--------------|--------------|
| 0     | active      | Ativo        | Verde        |
| 1     | inactive    | Inativo      | Cinza        |
| 2     | maintenance | Manutenção   | Amarelo      |

> Qualquer transição entre status é permitida — não há restrição de máquina de estados.

---

## Fluxo: Gestão de Veículos

### Listagem

```
1. Usuário acessa /vehicles
2. Sistema carrega lista paginada de veículos
3. Usuário pode filtrar por status
4. Usuário pode editar um veículo pela ação na linha
5. Usuário pode cadastrar novo veículo via botão "+ Novo veículo"
6. Veículos com revisão vencida ou próxima (≤ 30 dias) exibem ícone de alerta na coluna de revisão
```

### Cadastro

```
1. Usuário clica em "+ Novo veículo"
2. Modal abre com campos obrigatórios (placa, modelo, capacidade) e opcionais (ano, última revisão, próxima revisão)
3. Status não é informado no cadastro — padrão "Ativo" (0)
4. Usuário preenche e salva
5. Toast de sucesso, lista atualizada
```

### Edição

```
1. Usuário clica em "Editar" na linha do veículo
2. Modal abre com todos os campos pré-preenchidos
3. Todos os campos são editáveis, incluindo status
4. Usuário altera e salva
5. Toast de sucesso, lista atualizada
```

---

## Telas

### VehiclesPage — `/vehicles`

Elementos:
- Título "Veículos"
- Botão "+ Novo veículo"
- Filtro por status (select: Todos / Ativo / Inativo / Manutenção)
- Tabela com colunas: Placa, Modelo, Ano, Capacidade, Status, Próx. Revisão, Ações
- Coluna "Próx. Revisão": exibir data formatada + ícone de alerta se vencida ou ≤ 30 dias no futuro
- Ações por linha: botão "Editar"
- Paginação

### VehicleFormModal — Modal de Cadastro / Edição

**Campos de criação:**

| Campo           | Tipo         | Obrigatório | Notas                                        |
|-----------------|--------------|-------------|----------------------------------------------|
| plate           | text input   | Sim         | Máx. 20 chars, uppercase automático          |
| model           | text input   | Sim         | Máx. 100 chars                               |
| capacity        | number input | Sim         | Inteiro positivo                             |
| year            | number input | Não         | 1900 a ano atual + 1                         |
| lastRevisionAt  | date input   | Não         | Formato BR com máscara (dd/mm/yyyy)          |
| nextRevisionAt  | date input   | Não         | Formato BR com máscara; deve ser ≥ lastRevisionAt se ambos informados |

**Campos de edição** (mesmos + status):

| Campo  | Tipo   | Notas                               |
|--------|--------|-------------------------------------|
| status | select | 3 opções: Ativo / Inativo / Manutenção |

> No cadastro, `status` não é enviado — o backend assume `active` (0) por padrão.

---

## Integração com API

| Ação              | Endpoint          | Método |
|-------------------|-------------------|--------|
| Listar veículos   | `/vehicles`       | GET    |
| Cadastrar veículo | `/vehicles`       | POST   |
| Atualizar veículo | `/vehicles/:id`   | PUT    |
| Detalhe veículo   | `/vehicles/:id`   | GET    |

### Payload de criação

```ts
interface CreateVehicleDTO {
  plate: string       // obrigatório, máx. 20 chars
  model: string       // obrigatório, máx. 100 chars
  capacity: number    // obrigatório, inteiro positivo
  year?: number       // opcional, 1900–(anoAtual+1)
  lastRevisionAt?: string  // opcional, ISO date (yyyy-mm-dd)
  nextRevisionAt?: string  // opcional, ISO date; deve ser >= lastRevisionAt
}
```

### Payload de atualização

```ts
interface UpdateVehicleDTO {
  plate?: string
  model?: string
  capacity?: number
  year?: number
  status?: number        // 0=active, 1=inactive, 2=maintenance
  lastRevisionAt?: string
  nextRevisionAt?: string
}
```

### Resposta (entidade)

```ts
// axiosBaseQuery já desembrulha result.data.data
interface Vehicle {
  id: string
  tenantId: string
  plate: string
  model: string
  year: number | null
  capacity: number
  status: VehicleStatusValue  // 0 | 1 | 2
  lastRevisionAt: string | null  // ISO date "yyyy-mm-dd"
  nextRevisionAt: string | null  // ISO date "yyyy-mm-dd"
  createdAt: string
  updatedAt: string
}
```

### Filtros de listagem

| Parâmetro | Tipo | Obrigatório |
|-----------|------|-------------|
| `page`    | int  | Sim (default 1) |
| `limit`   | int  | Sim (default 10) |
| `status`  | int  | Não (0, 1, ou 2) |

### Invalidação de cache

Após criar ou atualizar: invalidar `['Vehicle']`.

---

## Validação (Zod)

```ts
// createVehicleSchema
const currentYear = new Date().getFullYear()

z.object({
  plate: z.string().min(1, 'Placa obrigatória').max(20),
  model: z.string().min(1, 'Modelo obrigatório').max(100),
  capacity: z.coerce.number().int().positive('Capacidade deve ser maior que zero'),
  year: z.coerce.number().int().min(1900).max(currentYear + 1).optional(),
  lastRevisionAt: z.string().optional(),   // convertido para ISO antes de enviar
  nextRevisionAt: z.string().optional(),   // convertido para ISO antes de enviar
}).refine(
  (data) => {
    if (data.lastRevisionAt && data.nextRevisionAt) {
      return data.nextRevisionAt >= data.lastRevisionAt
    }
    return true
  },
  { message: 'A próxima revisão deve ser igual ou posterior à última revisão', path: ['nextRevisionAt'] }
)

// updateVehicleSchema — mesmos campos, todos opcionais, + status
z.object({
  plate: z.string().min(1).max(20).optional(),
  model: z.string().min(1).max(100).optional(),
  capacity: z.coerce.number().int().positive().optional(),
  year: z.coerce.number().int().min(1900).max(currentYear + 1).optional(),
  status: z.number().int().min(0).max(2).optional(),
  lastRevisionAt: z.string().optional(),
  nextRevisionAt: z.string().optional(),
}).refine(/* mesma validação de datas */)
```

---

## Tipos TypeScript

```ts
export type VehicleStatusValue = 0 | 1 | 2

export interface Vehicle {
  id: string
  tenantId: string
  plate: string
  model: string
  year: number | null
  capacity: number
  status: VehicleStatusValue
  lastRevisionAt: string | null
  nextRevisionAt: string | null
  createdAt: string
  updatedAt: string
}

export interface VehicleFilters {
  page: number
  limit: number
  status?: VehicleStatusValue
}

export interface CreateVehicleDTO {
  plate: string
  model: string
  capacity: number
  year?: number
  lastRevisionAt?: string
  nextRevisionAt?: string
}

export interface UpdateVehicleDTO {
  plate?: string
  model?: string
  capacity?: number
  year?: number
  status?: number
  lastRevisionAt?: string
  nextRevisionAt?: string
}
```

---

## Lógica de Alertas de Revisão

```ts
// Próxima revisão vencida ou dentro de 30 dias → exibir ícone de alerta
export function getRevisionAlertLevel(nextRevisionAt: string | null): 'overdue' | 'upcoming' | null {
  if (!nextRevisionAt) return null
  const [y, m, d] = nextRevisionAt.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diffDays = Math.ceil((date.getTime() - today.getTime()) / 86_400_000)
  if (diffDays < 0) return 'overdue'
  if (diffDays <= 30) return 'upcoming'
  return null
}
```

> Usar `split('-')` + `new Date(y, m-1, d)` para evitar problemas de fuso horário (padrão do projeto).

---

## Estados da Tela

| Estado                      | Comportamento                                         |
|-----------------------------|-------------------------------------------------------|
| Loading lista               | Skeleton na tabela                                    |
| Lista vazia                 | Mensagem "Nenhum veículo encontrado"                  |
| Erro de listagem            | Mensagem de erro + botão "Tentar novamente"           |
| Modal aberto (criação)      | Campos vazios, status não exibido                     |
| Modal aberto (edição)       | Todos os campos pré-preenchidos, status editável      |
| Revisão vencida             | Ícone vermelho na coluna + data em vermelho           |
| Revisão próxima (≤ 30 dias) | Ícone amarelo na coluna + data em amarelo             |
| Loading (salvando)          | Botão salvar desabilitado com texto "Salvando..."     |
| Sucesso                     | Toast de sucesso + lista atualizada                   |
| Erro de API                 | Mensagem amigável exibida no modal                    |

---

## Erros Esperados

| Código da API                  | Mensagem para o usuário                           |
|--------------------------------|---------------------------------------------------|
| `VEHICLE_NOT_FOUND`            | "Veículo não encontrado."                         |
| `VEHICLE_PLATE_ALREADY_EXISTS` | "Já existe um veículo com esta placa."            |
| `INVALID_VEHICLE_DATA`         | "Dados inválidos. Verifique os campos."           |
| `TENANT_ACCESS_DENIED`         | "Acesso negado."                                  |
| `UNAUTHORIZED`                 | "Sessão expirada. Faça login novamente."          |

---

## Arquivos a Criar

| Arquivo | Ação |
|---------|------|
| `features/vehicles/types/vehicle.types.ts` | Criar |
| `features/vehicles/schemas/create-vehicle.schema.ts` | Criar |
| `features/vehicles/schemas/update-vehicle.schema.ts` | Criar |
| `features/vehicles/utils/vehicleStatus.ts` | Criar |
| `features/vehicles/utils/vehicleRevision.ts` | Criar |
| `features/vehicles/utils/vehicleErrors.ts` | Criar |
| `features/vehicles/store/vehiclesApi.ts` | Criar |
| `features/vehicles/components/VehicleStatusBadge.tsx` | Criar |
| `features/vehicles/components/VehicleFormModal.tsx` | Criar |
| `features/vehicles/components/VehiclesTable.tsx` | Criar |
| `features/vehicles/components/VehicleFilters.tsx` | Criar |
| `features/vehicles/pages/VehiclesPage.tsx` | Criar |
| `app/store.ts` | Modificar — registrar `vehiclesApi` |
| `routes/index.tsx` | Modificar — rota `/vehicles` |
| `layouts/Sidebar.tsx` | Modificar — item "Veículos" com ícone de van |

---

## Critérios de Aceite

- [ ] Listagem carrega veículos com paginação
- [ ] Filtro por status funciona (Todos / Ativo / Inativo / Manutenção)
- [ ] Novo veículo pode ser cadastrado via modal (sem campo de status)
- [ ] Veículo existente pode ser editado com todos os campos, incluindo status
- [ ] Placa enviada em uppercase para a API
- [ ] Datas de revisão validadas: nextRevisionAt ≥ lastRevisionAt
- [ ] Datas de revisão exibidas em formato BR (dd/mm/yyyy)
- [ ] Revisão vencida exibe ícone/cor vermelhos
- [ ] Revisão próxima (≤ 30 dias) exibe ícone/cor amarelos
- [ ] Status exibido com badge colorido (verde / cinza / amarelo)
- [ ] Toast de sucesso após cada operação
- [ ] Erros da API exibidos com mensagem amigável no modal
- [ ] Listagem atualizada automaticamente após qualquer operação
- [ ] "Veículos" acessível pelo menu lateral
