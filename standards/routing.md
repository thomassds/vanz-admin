# Routing Standards (SDD)

Este documento define os padrões de roteamento do frontend.

---

# 1. Stack

React Router v6 com layout routes e lazy loading.

---

# 2. Mapa de Rotas

```
/                          → redirect para /dashboard (autenticado) ou /login
/login                     → Página de login
/onboarding                → Fluxo de cadastro (multi-step)
/recovery-password         → Solicitação de recuperação de senha
/dashboard                 → Home da área autenticada

/clients                   → Listagem de clientes
/clients/:id               → Detalhe e edição do cliente
/clients/:id/dependents    → Listagem de dependentes do cliente

/contracts                 → Listagem de contratos
/contracts/new             → Cadastro de contrato
/contracts/:id             → Detalhe e edição do contrato

/finances/receivables      → Listagem de recebíveis
```

---

# 3. Layouts

| Layout       | Rotas                                      |
| ------------ | ------------------------------------------ |
| `AuthLayout` | `/login`, `/onboarding`, `/recovery-password` |
| `AppLayout`  | Todas as rotas autenticadas                |

---

# 4. Proteção de Rotas

```tsx
// routes/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated } from '@/features/auth/store/authSlice'

export function ProtectedRoute() {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}
```

```tsx
// routes/GuestRoute.tsx — redireciona autenticado para fora do login
export function GuestRoute() {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />
}
```

---

# 5. Lazy Loading

Todas as pages devem usar lazy loading:

```tsx
const LoginPage = React.lazy(() => import('@/features/auth/pages/LoginPage'))
const ClientsPage = React.lazy(() => import('@/features/clients/pages/ClientsPage'))
```

Envolver o router em `<Suspense fallback={<PageLoader />}>`.

---

# 6. Convenções

- Rotas em kebab-case e plural para recursos: `/clients`, `/contracts`
- Parâmetros de detalhe sempre com `:id`
- Sub-recursos como sub-rotas: `/clients/:id/dependents`
- Rota de criação como sub-rota: `/contracts/new`

---

# 7. Navegação

- Sempre via `useNavigate` ou `<Link>` — nunca `window.location`
- Após login, redirecionar para a rota que o usuário tentou acessar (redirect state)
- Após logout, redirecionar para `/login` e limpar cache do RTK Query

---

# 8. Regras

- Rota 404 obrigatória com página de erro amigável
- Toda rota privada dentro do `ProtectedRoute`
- Toda rota pública (login, onboarding) dentro do `GuestRoute`
- Nenhuma página exposta sem verificação de autenticação
