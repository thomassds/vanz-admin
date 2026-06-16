# Architecture Standard (SDD)

Este documento define a arquitetura base do frontend com foco em modularidade, escalabilidade e separação de responsabilidades.

---

# 1. Visão Geral

O frontend segue uma **Feature-Based Architecture** — o código é organizado por domínio de negócio, não por tipo de arquivo.

Fluxo padrão:

```
Page → Feature Component → UI Component
            ↕
    RTK Query (server state)
            ↕
      Redux Store (client state)
            ↕
    Axios (HTTP client base)
```

---

# 2. Estrutura de Pastas

```
src/
  app/              ← Store Redux, providers, router root
  features/         ← Módulos por domínio de negócio
  shared/           ← Código reutilizável entre features
  pages/            ← Páginas da aplicação (thin)
  routes/           ← Definição e proteção de rotas
```

---

# 3. Estrutura de uma Feature

Cada feature segue a mesma estrutura interna:

```
features/auth/
  components/       ← Componentes específicos da feature
  hooks/            ← Custom hooks da feature
  pages/            ← Pages da feature (usadas no router)
  store/
    authSlice.ts    ← Redux slice (estado client-side)
    authApi.ts      ← RTK Query endpoints
  types/            ← Interfaces e types do domínio
  schemas/          ← Schemas Zod de validação
  index.ts          ← Barrel export da feature
```

---

# 4. Responsabilidade de Cada Camada

### Page
- Composição de Feature Components
- Define o título e layout da página
- Sem lógica de negócio
- Thin: apenas monta a tela

### Feature Component
- Orquestra a lógica de uma feature
- Conectado ao Redux via `useSelector` / `useDispatch`
- Usa RTK Query hooks para chamadas de API
- Compõe UI Components com dados e handlers reais

### UI Component (`shared/components`)
- Stateless — recebe apenas props
- Sem acesso ao Redux
- Sem conhecimento de domínio de negócio
- Genérico e reutilizável: `Button`, `Input`, `Modal`, `Table`, `Badge`

### Store
- **Redux Slice**: estado client-side (sessão, UI global)
- **RTK Query API**: cache de dados remotos, loading, erro, mutações

---

# 5. Shared

```
shared/
  components/     ← UI Kit: Button, Input, Modal, Table, Badge, Spinner, Toast
  hooks/          ← Hooks globais: useToast, usePagination, useDebounce
  utils/          ← Funções puras: formatDate, formatCurrency, cn
  types/          ← Tipos globais: ApiResponse<T>, PaginatedResponse<T>
  api/            ← Instância do Axios e axiosBaseQuery para RTK Query
  constants/      ← Constantes globais: STATUS_LABELS, PAGE_SIZE_OPTIONS
```

---

# 6. Regra de Dependência

## Proibido

- Feature acessar store interno de outra feature diretamente
- UI Component importar de uma feature específica
- Page conter lógica de negócio ou chamadas de API

## Permitido

- Feature consumir tipos exportados por `shared/types`
- Feature consumir hooks expostos pelo barrel export de outra feature
- Feature consumir componentes de `shared/components`

---

# 7. App

```
app/
  store.ts          ← Configuração do Redux store (combineReducers + middleware RTK Query)
  store.types.ts    ← RootState, AppDispatch
  providers.tsx     ← Provider do Redux, BrowserRouter, etc.
```

---

# 8. Regra de Ouro

> Pages são finas — apenas compõem.
> Feature Components orquestram — lógica e estado.
> UI Components apenas renderizam — recebem props.
>
> Cada camada só sabe o que precisa saber.
