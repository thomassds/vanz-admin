# Frontend Standards (SDD)

Este documento define todos os padrões obrigatórios para desenvolvimento do frontend da aplicação.

Serve como fonte única de verdade para desenvolvedores e ferramentas de IA (Copilot, Claude Code, etc).

---

# 1. Princípios

- **Single Responsibility**: cada componente tem um único propósito
- **DRY**: sem duplicação de lógica entre componentes ou hooks
- **KISS**: solução mais simples que resolve o problema
- **Separation of Concerns**: UI, lógica e estado são separados
- **Composition over Inheritance**: composição de componentes ao invés de herança

---

# 2. Regras de Ouro

- Pages não contêm lógica de negócio
- UI Components são stateless quando possível
- Lógica de negócio fica em custom hooks ou no Redux
- Nenhum componente faz chamada HTTP diretamente — usar RTK Query
- Formulários sempre validados com Zod antes de submeter
- `tenantId` nunca enviado manualmente — vem do token JWT no backend

---

# 3. TypeScript

- Tipagem explícita obrigatória — sem `any`
- `interface` para objetos de domínio e props de componentes
- `type` para unions, intersections e utility types
- Enums apenas para valores fixos de domínio (ex: status de contrato)
- Sem casting desnecessário com `as` — preferir type guards

---

# 4. Convenções de Nomenclatura

| Item                  | Convenção   | Exemplo                      |
| --------------------- | ----------- | ---------------------------- |
| Componentes           | PascalCase  | `LoginForm`, `ClientTable`   |
| Arquivos de componente | PascalCase | `LoginForm.tsx`              |
| Hooks customizados    | use + camelCase | `useAuth`, `usePagination` |
| Utilitários           | camelCase   | `formatDate.ts`              |
| Redux Slices          | camelCase + Slice | `authSlice.ts`          |
| RTK Query APIs        | camelCase + Api | `clientsApi.ts`           |
| Schemas Zod           | camelCase + Schema | `loginSchema.ts`       |
| Constantes            | UPPER_SNAKE_CASE | `MAX_PAGE_SIZE`          |
| Pastas de feature     | kebab-case  | `management-client/`         |

---

# 5. Exports

- Named exports para componentes, hooks e utilitários
- Default export apenas para pages (necessário para React.lazy)
- Barrel exports obrigatórios via `index.ts` em cada feature

```ts
// features/auth/index.ts
export { LoginForm } from './components/LoginForm'
export { useAuth } from './hooks/useAuth'
export { authSlice } from './store/authSlice'
```

---

# 6. Qualidade de Código

- Componentes com mais de 150 linhas devem ser divididos
- Evitar prop drilling além de 2 níveis — usar Redux ou Context
- Sem `console.log` em produção
- Sem efeitos colaterais fora de `useEffect`
- Funções de handler prefixadas com `handle`: `handleSubmit`, `handleClose`

---

# 7. Acessibilidade

- Usar elementos HTML semânticos: `button`, `nav`, `main`, `section`, `header`
- Inputs sempre associados a `label` via `htmlFor`
- Imagens com atributo `alt` descritivo
- Foco gerenciado em modais (trap focus) e retornado ao elemento trigger ao fechar

---

# 8. Performance

- Lazy loading em todas as pages via `React.lazy()`
- `useMemo` e `useCallback` apenas quando o custo de re-render for comprovado
- Não otimizar prematuramente — medir antes

---

# 9. Objetivo deste Padrão

Garantir que:

- Código seja previsível e consistente entre features
- IA consiga gerar código de qualidade sem ambiguidade
- Time trabalhe com baixo retrabalho
- Produto escale sem refactor constante
