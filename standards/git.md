# Git Standards (SDD)

Este documento define os padrões de uso do Git no projeto frontend.

Os padrões são idênticos aos do backend — fonte única de verdade para todo o projeto.

---

# 1. Princípios

- Histórico de commits deve ser legível e rastreável
- Cada commit representa uma unidade lógica de trabalho
- Branches têm propósito e ciclo de vida definidos
- `main` sempre deve estar estável e deployável

---

# 2. Branches

## Estrutura

| Branch      | Propósito                                 |
| ----------- | ----------------------------------------- |
| `main`      | Produção — sempre estável                 |
| `develop`   | Integração — base para novas features     |
| `feature/*` | Nova funcionalidade                       |
| `fix/*`     | Correção de bug                           |
| `hotfix/*`  | Correção urgente em produção              |
| `chore/*`   | Tarefas técnicas (deps, config, refactor) |

## Nomenclatura

```
feature/login-page
feature/client-management
fix/login-redirect-error
hotfix/token-persistence-bug
chore/update-dependencies
```

## Regras

- Nunca commitar diretamente em `main`
- Nunca commitar diretamente em `develop`
- Branch criada sempre a partir de `develop` (exceto `hotfix`, que parte de `main`)
- Branch removida após o merge

---

# 3. Commits — Conventional Commits

```
<tipo>(<escopo>): <descrição curta>
```

## Tipos

| Tipo       | Quando usar                              |
| ---------- | ---------------------------------------- |
| `feat`     | Nova funcionalidade                      |
| `fix`      | Correção de bug                          |
| `chore`    | Tarefas técnicas sem impacto no produto  |
| `docs`     | Alterações em documentação               |
| `test`     | Adição ou correção de testes             |
| `refactor` | Refatoração sem mudança de comportamento |
| `perf`     | Melhoria de performance                  |
| `style`    | Alterações de estilização (CSS/Tailwind) |

## Exemplos

```
feat(auth): add login page with form validation
fix(clients): fix pagination not resetting on filter change
chore(deps): update react-hook-form to v7
test(auth): add unit tests for login form
style(dashboard): adjust sidebar spacing for mobile
```

## Regras

- Descrição em **inglês**
- Letra minúscula no início
- Sem ponto final
- Máximo 72 caracteres na primeira linha
- Escopo deve referenciar a feature afetada

---

# 4. Pull Requests

## Regras

- PR deve ter título seguindo Conventional Commits
- PR deve ter descrição do que foi feito e por quê
- PR deve passar nos checks de CI antes do merge
- Ao menos **1 aprovação** obrigatória para merge em `develop`
- `main` exige ao menos **2 aprovações**

## Template de Descrição

```markdown
## O que foi feito

Descreva brevemente as alterações.

## Por quê

Contexto e motivação da mudança.

## Como testar

Passos para validar o que foi implementado.

## Checklist

- [ ] Componentes testados
- [ ] Responsividade verificada
- [ ] Sem console.log
- [ ] Sem secrets no código
```

---

# 5. Merge Strategy

- **Squash and Merge** para features e fixes em `develop`
- **Merge Commit** para releases de `develop` → `main`
- Nunca `git push --force` em branches compartilhadas

---

# 6. .gitignore Obrigatório

```
.env
.env.local
.env.*.local
node_modules/
dist/
build/
coverage/
*.log
```

---

# 7. Regra de Ouro

> `main` é sagrada — nunca deve quebrar.
> Commit pequeno e focado é melhor do que commit grande e genérico.
> Nunca commitar secrets, mesmo que acidentalmente — revogar imediatamente.
