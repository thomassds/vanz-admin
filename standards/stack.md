# Stack Standards (SDD)

Este documento define as tecnologias, bibliotecas e versões aprovadas para o frontend.

Serve como fonte única de verdade para desenvolvedores e ferramentas de IA (Copilot, Claude Code, etc).

---

# 1. Linguagem

| Tecnologia | Versão | Motivo                       |
| ---------- | ------ | ---------------------------- |
| TypeScript | 5.x    | Tipagem estática obrigatória |

---

# 2. Framework

| Tecnologia | Versão | Motivo                         |
| ---------- | ------ | ------------------------------ |
| React      | 19.x   | UI library principal           |
| Vite       | Latest | Build tool e dev server        |

---

# 3. Estado Global

| Tecnologia    | Versão | Motivo                                        |
| ------------- | ------ | --------------------------------------------- |
| Redux Toolkit | Latest | Estado global (sessão, UI) + RTK Query (cache de API) |

---

# 4. Server State / Requisições HTTP

| Tecnologia | Versão                      | Motivo                                           |
| ---------- | --------------------------- | ------------------------------------------------ |
| RTK Query  | (incluso no Redux Toolkit)  | Cache de API, loading states, invalidação automática |
| Axios      | Latest                      | HTTP client base para o axiosBaseQuery           |

---

# 5. Roteamento

| Tecnologia   | Versão | Motivo                                       |
| ------------ | ------ | -------------------------------------------- |
| React Router | v6     | Roteamento declarativo com suporte a layouts |

---

# 6. Formulários e Validação

| Tecnologia      | Versão | Motivo                                 |
| --------------- | ------ | -------------------------------------- |
| React Hook Form | Latest | Formulários performáticos e controlados |
| Zod             | Latest | Validação de schema com tipagem nativa |
| @hookform/resolvers | Latest | Integração RHF + Zod              |

---

# 7. Estilização

| Tecnologia  | Versão | Motivo                              |
| ----------- | ------ | ----------------------------------- |
| Tailwind CSS | v3.x  | Utility-first, rápido e consistente |
| clsx        | Latest | Composição condicional de classes   |
| tailwind-merge | Latest | Merge sem conflito de classes Tailwind |

---

# 8. Testes

| Tecnologia             | Versão | Uso                             |
| ---------------------- | ------ | ------------------------------- |
| Vitest                 | Latest | Framework de testes (Vite-native) |
| React Testing Library  | Latest | Testes de componentes           |
| Playwright             | Latest | Testes E2E                      |

---

# 9. Utilitários

| Tecnologia | Uso                              |
| ---------- | -------------------------------- |
| date-fns   | Manipulação e formatação de datas |

---

# 10. Regras Gerais

- Toda nova lib deve ser discutida antes de adicionada
- Evitar libs sem manutenção ativa (último commit > 1 ano)
- Preferir libs com tipagem TypeScript nativa
- Não instalar duas libs que fazem a mesma coisa
- Verificar bundle size antes de adicionar qualquer lib nova
