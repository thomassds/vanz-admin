# Feature: Client Management (Frontend)

## Objetivo

Permitir que o tenant gerencie clientes e seus dependentes através de uma interface completa de CRUD com listagem, cadastro, edição, desativação e gestão de dependentes.

---

## Contexto

Clientes são os responsáveis (ex: pais de alunos). Cada cliente pode ter um ou mais dependentes (ex: filhos). Toda a listagem é isolada por tenant — o usuário só vê os dados da própria empresa.

---

## Fluxo: Gestão de Clientes

### Listagem de Clientes

```
1. Usuário acessa /clients
2. Sistema carrega lista paginada de clientes do tenant
3. Usuário pode filtrar por nome, documento ou status
4. Usuário pode clicar em um cliente para ver o detalhe
5. Usuário pode criar novo cliente via botão "Novo cliente"
6. Usuário pode desativar um cliente pela ação na linha da tabela
```

### Cadastro / Edição de Cliente

```
1. Usuário abre modal/drawer de cadastro ou edição
2. Preenche os dados do cliente
3. Clica em "Salvar"
4. API valida e persiste os dados
5. Lista é atualizada automaticamente (invalidação RTK Query)
6. Modal é fechado com toast de sucesso
```

### Desativação de Cliente

```
1. Usuário clica em "Desativar" na linha do cliente
2. Sistema exibe confirmação antes de prosseguir
3. Usuário confirma
4. API desativa o cliente (status → inativo)
5. Lista atualizada com novo status
```

---

## Fluxo: Gestão de Dependentes

### Listagem de Dependentes (dentro do detalhe do cliente)

```
1. Usuário acessa /clients/:id
2. Sistema exibe dados do cliente + lista de dependentes
3. Usuário pode adicionar novo dependente
4. Usuário pode editar ou excluir dependente existente
```

---

## Telas

### ClientsPage — `/clients`

Elementos:
- Barra de filtros: input de busca (nome/documento), select de status (Ativo/Inativo)
- Botão "Novo cliente"
- Tabela de clientes com colunas: Nome, Documento, Status, Ações
- Ações por linha: Editar, Desativar
- Paginação

### ClientDetailPage — `/clients/:id`

Elementos:
- Card com dados do cliente
- Botão "Editar cliente"
- Seção de dependentes com lista e botão "Adicionar dependente"
- Ações por dependente: Editar, Excluir

### ClientFormModal

- Modal com formulário de criação/edição de cliente
- Campos: Nome, Documento (CPF/CNPJ), Telefone (opcional), E-mail (opcional)
- Botões: Cancelar / Salvar

### DependentFormModal

- Modal com formulário de criação/edição de dependente
- Campos: Nome, Documento, Data de nascimento (opcional)
- Botões: Cancelar / Salvar

---

## Integração com API

| Ação                  | Endpoint                           | Método   |
| --------------------- | ---------------------------------- | -------- |
| Listar clientes       | `/api/v1/clients`                  | GET      |
| Criar cliente         | `/api/v1/clients`                  | POST     |
| Atualizar cliente     | `/api/v1/clients/:id`              | PUT      |
| Desativar cliente     | `/api/v1/clients/:id/disable`      | PUT      |
| Listar dependentes    | `/api/v1/clients/dependents`       | GET      |
| Criar dependente      | `/api/v1/clients/dependents`       | POST     |
| Atualizar dependente  | `/api/v1/clients/dependents/:id`   | PUT      |
| Excluir dependente    | `/api/v1/clients/dependents/:id`   | DELETE   |

### Parâmetros de listagem de clientes

| Parâmetro | Tipo   | Obrigatório |
| --------- | ------ | ----------- |
| `page`    | int    | Sim         |
| `limit`   | int    | Sim         |
| `name`    | string | Não         |
| `document`| string | Não         |
| `status`  | string | Não         |

---

## Estados das Telas

| Estado          | Comportamento                                                  |
| --------------- | -------------------------------------------------------------- |
| Loading lista   | Skeleton na tabela                                             |
| Lista vazia     | Ilustração + mensagem "Nenhum cliente cadastrado" + CTA        |
| Erro de listagem| Mensagem de erro + botão "Tentar novamente"                    |
| Loading modal   | Botão de salvar com spinner e desabilitado                     |
| Sucesso cadastro| Toast "Cliente cadastrado com sucesso" + fechar modal          |
| Confirmação exclusão | Dialog de confirmação antes de excluir/desativar         |

---

## Validação (Zod)

```ts
// createClientSchema
z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  document: z.string().min(11, 'Documento inválido'),
  phone: z.string().optional(),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
})

// createDependentSchema
z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  document: z.string().min(11, 'Documento inválido'),
  birthDate: z.string().optional(),
})
```

---

## Erros Esperados

| Código da API              | Mensagem para o usuário                               |
| -------------------------- | ----------------------------------------------------- |
| `CLIENT_ALREADY_EXISTS`    | "Já existe um cliente com este documento"             |
| `CLIENT_NOT_FOUND`         | "Cliente não encontrado"                              |
| `DEPENDENT_ALREADY_EXISTS` | "Já existe um dependente com este documento"          |
| `DEPENDENT_NOT_FOUND`      | "Dependente não encontrado"                           |
| `TENANT_ACCESS_DENIED`     | "Acesso negado"                                       |
| `INVALID_CLIENT_DATA`      | Erros de campo exibidos inline                        |
| `UNAUTHORIZED`             | Redirect para /login                                  |

---

## Critérios de Aceite

- [ ] Listagem carrega clientes do tenant com paginação
- [ ] Filtros por nome, documento e status funcionam
- [ ] Novo cliente pode ser cadastrado via modal
- [ ] Cliente pode ser editado via modal
- [ ] Desativação exige confirmação e não remove histórico
- [ ] Toast de sucesso após cada operação de CRUD
- [ ] Erros da API exibidos com mensagem amigável
- [ ] Listagem atualizada automaticamente após cadastro/edição/desativação
- [ ] Dependentes são listados na página de detalhe do cliente
- [ ] Dependente pode ser criado, editado e excluído
- [ ] Exclusão de dependente exige confirmação
