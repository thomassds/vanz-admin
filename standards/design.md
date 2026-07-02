# Design System (SDD)

Este documento define os tokens visuais do produto VANS — cores, tipografia, espaçamento, bordas e sombras.

É a fonte única de verdade para todo estilo da aplicação. Nenhum valor visual deve ser definido fora deste documento ou do `style.css` (`@theme`).

Referência visual: mockup da tela de login (Figma).

**Documentação viva:** acesse `/design-system` no app (`src/pages/DesignSystemPage.tsx`) para ver todos os tokens renderizados. Ao alterar tokens aqui ou no `style.css`, atualize a página também.

---

# 1. Cores

## 1.1 Marca

| Token           | Hex       | Uso                                          |
| --------------- | --------- | -------------------------------------------- |
| `primary`       | `#00B4E0` | Cor principal da marca: botões, links, ícones, destaques |
| `primary-hover` | `#009EC8` | Hover de elementos primários                 |
| `primary-light` | `#E0F7FC` | Fundo de badges, ícones e áreas de destaque leve |
| `navy`          | `#0D1B3E` | Títulos e textos de alto contraste           |
| `navy-light`    | `#1A2F5E` | Subtítulos e variação de navy                |

## 1.2 Neutros

| Token           | Hex       | Uso                                          |
| --------------- | --------- | -------------------------------------------- |
| `white`         | `#FFFFFF` | Fundo de cards, inputs, páginas              |
| `surface`       | `#F0F9FF` | Fundo de seções de marketing / painéis laterais |
| `gray-50`       | `#F8FAFC` | Fundo geral da aplicação (área logada)       |
| `gray-100`      | `#F1F5F9` | Bordas leves, fundos de hover                |
| `gray-200`      | `#E2E8F0` | Bordas de inputs e divisores                 |
| `gray-400`      | `#94A3B8` | Placeholders e textos secundários            |
| `gray-600`      | `#475569` | Textos de corpo e labels                     |
| `gray-900`      | `#0F172A` | Texto principal de corpo                     |

## 1.3 Status / Feedback

| Token              | Hex       | Uso                                   |
| ------------------ | --------- | ------------------------------------- |
| `success`          | `#16A34A` | Status ativo, pago, confirmado        |
| `success-light`    | `#DCFCE7` | Fundo de badge de sucesso             |
| `danger`           | `#DC2626` | Erros, status vencido, exclusão       |
| `danger-light`     | `#FEE2E2` | Fundo de badge de erro                |
| `warning`          | `#D97706` | Alertas, status pendente de atenção   |
| `warning-light`    | `#FEF3C7` | Fundo de badge de alerta              |
| `info`             | `#0EA5E9` | Informações, status cobrado           |
| `info-light`       | `#E0F2FE` | Fundo de badge informativo            |

---

# 1.4 Tokens Semânticos (temas claro/escuro)

Superfícies e textos usam tokens semânticos que mudam com o tema (classe `.dark` no `<html>`).
Componentes novos usam SEMPRE estes tokens. Definição: `src/style.css` (`:root` / `.dark`).

| Token          | Light     | Dark      | Uso                        |
| -------------- | --------- | --------- | -------------------------- |
| `app`          | `#F8FAFC` | `#0B1220` | Fundo geral                |
| `card`         | `#FFFFFF` | `#101A2E` | Cards, sidebar, topbar     |
| `card-hover`   | `#F1F5F9` | `#182338` | Hover de itens             |
| `text`         | `#0F172A` | `#E6EAF2` | Texto principal            |
| `text-muted`   | `#475569` | `#94A3B8` | Texto secundário           |
| `text-subtle`  | `#94A3B8` | `#5B6B85` | Placeholders               |
| `border`       | `#E2E8F0` | `#233049` | Bordas e divisores         |
| `input`        | `#FFFFFF` | `#0D1728` | Fundo de inputs            |
| `primary-soft` | `#E0F7FC` | `#0E2A38` | Destaque primário          |
| `*-soft` (status) | `*-light` | tons escuros | Fundos de badge      |

Spec completa do redesign: `specs/layout/layout-redesign-spec.md`.

---

# 2. Tipografia

## 2.1 Famílias

| Papel    | Fonte       | Pesos disponíveis | Uso                              |
| -------- | ----------- | ----------------- | -------------------------------- |
| Heading  | Montserrat  | 500, 600, 700, 800 | Títulos, headlines, logo        |
| Body     | Nunito      | 400, 500, 700     | Corpo de texto, labels, inputs   |

## 2.2 Escala Tipográfica

| Token      | Tamanho | Peso  | Família    | Uso                           |
| ---------- | ------- | ----- | ---------- | ----------------------------- |
| `text-xs`  | 12px    | 400   | Nunito     | Legendas, hints               |
| `text-sm`  | 14px    | 400   | Nunito     | Labels de input, textos auxiliares |
| `text-base`| 16px    | 400   | Nunito     | Corpo principal               |
| `text-lg`  | 18px    | 500   | Nunito     | Texto de destaque, subtítulo  |
| `text-xl`  | 20px    | 600   | Montserrat | Títulos de card/seção         |
| `text-2xl` | 24px    | 700   | Montserrat | Títulos de página             |
| `text-3xl` | 30px    | 700   | Montserrat | Títulos grandes               |
| `text-4xl` | 36px    | 800   | Montserrat | Headlines de marketing        |
| `text-5xl` | 48px    | 800   | Montserrat | Logo e hero text              |

---

# 3. Espaçamento

Usar a escala base do Tailwind (múltiplos de 4px). Referência dos espaçamentos mais usados:

| Token  | px  | Uso                                  |
| ------ | --- | ------------------------------------ |
| `1`    | 4px | Micro espaçamento                    |
| `2`    | 8px | Padding interno de badges e chips    |
| `3`    | 12px| Gap entre ícone e texto              |
| `4`    | 16px| Padding de inputs e botões           |
| `5`    | 20px| Espaçamento entre campos de formulário |
| `6`    | 24px| Padding de cards                     |
| `8`    | 32px| Espaçamento entre seções             |
| `10`   | 40px| Padding de layouts internos          |
| `12`   | 48px| Espaçamento de páginas               |
| `16`   | 64px| Espaçamento de seções grandes        |

---

# 4. Bordas e Arredondamentos

| Token       | Valor  | Uso                                        |
| ----------- | ------ | ------------------------------------------ |
| `rounded`   | 4px    | Inputs, badges pequenos                    |
| `rounded-md`| 6px    | Botões                                     |
| `rounded-lg`| 8px    | Cards, modais, dropdowns                   |
| `rounded-xl`| 12px   | Cards maiores, painéis                     |
| `rounded-2xl`| 16px  | Ícones de feature, elementos de destaque   |
| `rounded-full` | 9999px | Avatares, badges circulares, chips      |

---

# 5. Sombras

| Token          | Uso                                         |
| -------------- | ------------------------------------------- |
| `shadow-sm`    | Inputs em hover/focus leve                  |
| `shadow`       | Cards padrão                                |
| `shadow-md`    | Dropdowns, tooltips                         |
| `shadow-lg`    | Modais, drawers                             |
| `shadow-xl`    | Modais grandes, popovers                    |

---

# 6. Layout

## 6.1 Topbar (full-width, acima da sidebar)

| Propriedade | Valor              |
| ----------- | ------------------ |
| Altura      | 64px               |
| Background  | `card`             |
| Borda baixo | `border`           |
| Conteúdo    | Logo VANZ (primary) + toggle sidebar + título + busca + toggle tema + notificações + avatar |

## 6.2 Sidebar (abaixo da topbar)

| Propriedade   | Valor  |
| ------------- | ------ |
| Largura       | 240px  |
| Largura colapsada | 72px |
| Background    | `card` (branca no claro, escura no dark) |
| Texto         | `text-muted`          |
| Item ativo    | `bg-primary-soft text-primary` |

## 6.3 Conteúdo

| Propriedade   | Valor     |
| ------------- | --------- |
| Background    | `gray-50` |
| Padding       | `px-8 py-6` |
| Max-width     | sem limite (responsivo à sidebar) |

---

# 7. Componentes Visuais Padrão

## Botão Primário
- Background: `primary`
- Hover: `primary-hover`
- Texto: `white`
- Font: Montserrat 600
- Padding: `px-6 py-3`
- Radius: `rounded-md`

## Input
- Background: `white`
- Borda: `gray-200`
- Borda focus: `primary`
- Placeholder: `gray-400`
- Radius: `rounded`
- Padding: `px-4 py-3`

## Badge de Status
| Status    | Fundo            | Texto      |
| --------- | ---------------- | ---------- |
| Ativo/Pago   | `success-light` | `success` |
| Pendente  | `warning-light`  | `warning`  |
| Vencido   | `danger-light`   | `danger`   |
| Cobrado   | `info-light`     | `info`     |
| Cancelado | `gray-100`       | `gray-600` |
| Inativo   | `gray-100`       | `gray-600` |

---

# 8. Tela de Login — Referência de Layout

```
┌─────────────────────────────┬──────────────────────┐
│  Background: surface        │  Background: white   │
│                             │                      │
│  Logo VANS (primary, 5xl)   │  "BEM VINDO" (navy)  │
│  Tagline (gray-600, sm)     │                      │
│                             │  [Input Email]       │
│  Ilustração da van          │  [Input Senha]       │
│                             │                      │
│  Headline (navy + primary)  │  [Botão ENTRAR]      │
│                             │                      │
│  Features badges (3 ícones) │  "Seus dados estão   │
│                             │   protegidos"        │
│  Stats bar (branco, shadow) │                      │
└─────────────────────────────┴──────────────────────┘
```

- Split 55% / 45%
- Altura mínima: 100vh
- Mobile: empilhado (formulário primeiro, hero oculto)

---

# 9. Regras

- Nenhum valor de cor hardcoded no código — sempre via token (`text-primary`, `bg-navy`, etc.)
- Cores de status sempre via `Badge` component com variante semântica
- Texto sempre em `gray-900` ou `navy` — nunca preto puro `#000000`
- Fonte de heading sempre Montserrat, body sempre Nunito
- Gradientes usados apenas em áreas de marketing (AuthLayout) — nunca na área logada
