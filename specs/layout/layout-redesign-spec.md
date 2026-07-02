# Feature: Redesign de Layout (v2)

## Objetivo

Reescrever o layout de toda a aplicação seguindo a referência visual `template_inspiration/` (estilo "Acara"), com suporte a tema claro/escuro e densidade balanceada.

## Decisões de Design

| Aspecto     | Decisão |
| ----------- | ------- |
| Navegação   | Topbar full-width (logo + título + busca + notificações + tema + avatar) e sidebar branca abaixo |
| Sidebar     | Branca (dark: superfície escura), item ativo `bg-primary-light text-primary`, colapsável (72px), drawer no mobile |
| Tema        | Claro + escuro, toggle na topbar, persistido em localStorage, classe `.dark` no `<html>` |
| Densidade   | Balanceada: cards arejados (`rounded-xl`, `p-6`), tabelas compactas (`py-2.5`, `text-sm`) |
| Escopo      | Shell + tokens + componentes padrão + AuthLayout + páginas internas + landing |

## Tokens Semânticos (novos)

Cores de superfície/texto passam a usar tokens semânticos que mudam com o tema.
Componentes novos usam SEMPRE os semânticos; a paleta bruta (`gray-*`, `navy`) permanece para compatibilidade e casos específicos.

| Token          | Light     | Dark      | Uso                        |
| -------------- | --------- | --------- | -------------------------- |
| `app`          | `#F8FAFC` | `#0B1220` | Fundo geral                |
| `card`         | `#FFFFFF` | `#101A2E` | Cards, sidebar, topbar     |
| `card-hover`   | `#F1F5F9` | `#182338` | Hover de itens             |
| `text`         | `#0F172A` | `#E6EAF2` | Texto principal            |
| `text-muted`   | `#475569` | `#94A3B8` | Texto secundário, labels   |
| `text-subtle`  | `#94A3B8` | `#5B6B85` | Placeholders, hints        |
| `border`       | `#E2E8F0` | `#233049` | Bordas e divisores         |
| `input`        | `#FFFFFF` | `#0D1728` | Fundo de inputs            |
| `primary-soft` | `#E0F7FC` | `#0E2A38` | Fundo de destaque primário |
| `success-soft` | `#DCFCE7` | `#0F2A1A` | Fundo badge sucesso        |
| `danger-soft`  | `#FEE2E2` | `#331416` | Fundo badge erro           |
| `warning-soft` | `#FEF3C7` | `#33260D` | Fundo badge alerta         |
| `info-soft`    | `#E0F2FE` | `#0C2536` | Fundo badge info           |

`primary`, `navy` e cores de status (tom forte) não mudam entre temas.

## Componentes Padrão (shared/components)

- `Button` — variantes: `primary`, `secondary`, `ghost`, `danger`; tamanhos `sm`/`md`
- `Card` — superfície padrão (`bg-card border-border rounded-xl`)
- `PageHeader` — título + descrição + ações à direita
- `Badge` — variantes semânticas: `success`, `warning`, `danger`, `info`, `neutral`
- `EmptyState` — ícone + título + descrição + ação

## Fases

1. Tokens + dark mode + uiSlice (theme)
2. Shell: Topbar, Sidebar, AppLayout
3. Componentes padrão
4. AuthLayout
5. Migração das páginas internas para os padrões
6. LandingPage

## Regras

- Componentes novos: apenas tokens semânticos (`bg-card`, `text-text-muted`, `border-border`)
- Nenhuma cor hardcoded
- Tema aplicado via classe `.dark` no html — nunca `prefers-color-scheme` direto em CSS
