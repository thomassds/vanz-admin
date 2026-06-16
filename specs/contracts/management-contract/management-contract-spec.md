# Feature: Contract Management (Frontend)

## Objetivo

Permitir que o tenant gerencie os contratos com os clientes, incluindo cadastro, edição, visualização detalhada e listagem com filtros.

---

## Contexto

Contratos representam o vínculo comercial entre o cliente e o serviço prestado pela empresa de transporte. Cada contrato pertence a um cliente do tenant e define valores, datas e dependentes incluídos.

---

## Fluxo: Gestão de Contratos

### Listagem de Contratos

```
1. Usuário acessa /contracts
2. Sistema carrega lista paginada de contratos do tenant
3. Usuário pode filtrar por status, data de vencimento e cliente
4. Usuário clica em um contrato para ver o detalhe
5. Usuário pode criar novo contrato via botão "Novo contrato"
```

### Cadastro de Contrato

```
1. Usuário acessa /contracts/new
2. Preenche dados do contrato (cliente, dependentes, datas, valor)
3. Clica em "Salvar"
4. API valida e cria o contrato
5. Redirect para o detalhe do contrato criado com toast de sucesso
```

### Edição de Contrato

```
1. Usuário acessa /contracts/:id
2. Clica em "Editar"
3. Campos editáveis são habilitados (ou abre modal de edição)
4. Usuário altera os dados
5. Clica em "Salvar alterações"
6. API atualiza e retorna os dados atualizados
7. Toast de sucesso
```

### Visualização Detalhada

```
1. Usuário acessa /contracts/:id
2. Sistema exibe todos os dados do contrato
3. Exibe o cliente responsável, dependentes incluídos, valores e datas
4. Exibe o status atual do contrato
```

---

## Telas

### ContractsPage — `/contracts`

Elementos:
- Filtros: select de status, date pickers (vencimento de/até), select de cliente
- Botão "Novo contrato"
- Tabela com colunas: Cliente, Valor, Status, Data de início, Vencimento, Ações
- Ações por linha: Ver detalhe
- Paginação

### ContractFormPage — `/contracts/new`

Elementos:
- Select de cliente (com busca)
- Multi-select de dependentes do cliente selecionado
- Date picker de data de início
- Date picker de data de vencimento
- Input de valor mensal
- Select de dia de vencimento (dueDay)
- Botões: Cancelar / Salvar

### ContractDetailPage — `/contracts/:id`

Elementos:
- Status badge (Ativo / Inativo / Pendente)
- Card com dados do contrato: cliente, valor, datas, dependentes
- Botão "Editar contrato"
- Seção de recebíveis vinculados (link para /finances/receivables?contractId=:id)

---

## Integração com API

| Ação                      | Endpoint                  | Método |
| ------------------------- | ------------------------- | ------ |
| Listar contratos          | `/api/v1/contracts`       | GET    |
| Criar contrato            | `/api/v1/contracts`       | POST   |
| Atualizar contrato        | `/api/v1/contracts/:id`   | PUT    |
| Visualizar detalhe        | `/api/v1/contracts/:id`   | GET    |

### Parâmetros de listagem

| Parâmetro   | Tipo   | Obrigatório |
| ----------- | ------ | ----------- |
| `page`      | int    | Sim         |
| `limit`     | int    | Sim         |
| `status`    | string | Não         |
| `clientId`  | uuid   | Não         |
| `dueDateFrom` | date | Não         |
| `dueDateTo` | date   | Não         |

---

## Estados das Telas

| Estado            | Comportamento                                                 |
| ----------------- | ------------------------------------------------------------- |
| Loading lista     | Skeleton na tabela                                            |
| Lista vazia       | Ilustração + mensagem "Nenhum contrato cadastrado" + CTA      |
| Erro de listagem  | Mensagem de erro + botão "Tentar novamente"                   |
| Loading formulário | Botão salvar com spinner e desabilitado                      |
| Sucesso cadastro  | Redirect para detalhe + toast "Contrato criado com sucesso"   |
| Sucesso edição    | Toast "Contrato atualizado" + dados recarregados              |

---

## Validação (Zod)

```ts
z.object({
  clientId: z.string().uuid('Cliente obrigatório'),
  dependentIds: z.array(z.string().uuid()).optional(),
  startDate: z.string().min(1, 'Data de início obrigatória'),
  endDate: z.string().min(1, 'Data de vencimento obrigatória'),
  value: z.number().positive('Valor deve ser maior que zero'),
  dueDay: z.number().min(1).max(31, 'Dia de vencimento inválido'),
})
```

---

## Erros Esperados

| Código da API           | Mensagem para o usuário                          |
| ----------------------- | ------------------------------------------------ |
| `CONTRACT_NOT_FOUND`    | "Contrato não encontrado"                        |
| `CLIENT_NOT_FOUND`      | "Cliente não encontrado"                         |
| `INVALID_CONTRACT_DATA` | Erros de campo exibidos inline                   |
| `TENANT_ACCESS_DENIED`  | "Acesso negado"                                  |
| `UNAUTHORIZED`          | Redirect para /login                             |

---

## Critérios de Aceite

- [ ] Listagem carrega contratos do tenant com paginação
- [ ] Filtros por status, vencimento e cliente funcionam
- [ ] Novo contrato pode ser cadastrado via página de formulário
- [ ] Select de cliente tem busca por nome
- [ ] Dependentes do cliente selecionado são carregados dinamicamente
- [ ] Contrato pode ser editado na página de detalhe
- [ ] Toast de sucesso após cada operação
- [ ] Erros da API exibidos com mensagem amigável
- [ ] Listagem atualizada automaticamente após cadastro/edição
- [ ] Detalhe exibe link para recebíveis do contrato
