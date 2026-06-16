# Styling Standards (SDD)

Este documento define os padrões de estilização do frontend.

---

# 1. Stack

**Tailwind CSS v3** — utility-first.

Sem CSS Modules, sem Styled Components, sem SASS.

---

# 2. Utilitário de Classes — `cn()`

Usar `cn()` para composição condicional de classes. Obrigatório em todo componente que aplica classes condicionais.

```ts
// shared/utils/cn.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

Uso:
```tsx
<button
  className={cn(
    'px-4 py-2 rounded font-medium transition-colors',
    variant === 'primary' && 'bg-primary text-white hover:bg-primary/90',
    variant === 'ghost' && 'text-gray-600 hover:bg-gray-100',
    disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
  )}
/>
```

---

# 3. Design Tokens — `tailwind.config.ts`

Definir os tokens da marca no config:

```ts
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: '#2563EB',
        foreground: '#FFFFFF',
      },
      danger: {
        DEFAULT: '#DC2626',
        foreground: '#FFFFFF',
      },
      success: {
        DEFAULT: '#16A34A',
        foreground: '#FFFFFF',
      },
      warning: {
        DEFAULT: '#D97706',
        foreground: '#FFFFFF',
      },
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
  },
}
```

---

# 4. Responsividade

- **Mobile-first**: estilos base para mobile, breakpoints para telas maiores
- Breakpoints padrão Tailwind: `sm`, `md`, `lg`, `xl`
- Sidebar colapsável em telas menores que `md`

---

# 5. Variantes de Componentes

Variantes via `cn()` — sem múltiplos arquivos CSS:

```tsx
const buttonVariants = {
  primary: 'bg-primary text-white hover:bg-primary/90',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
  danger: 'bg-danger text-white hover:bg-danger/90',
  ghost: 'text-gray-600 hover:bg-gray-100',
}

function Button({ variant = 'primary', className, ...props }) {
  return (
    <button
      className={cn('px-4 py-2 rounded font-medium', buttonVariants[variant], className)}
      {...props}
    />
  )
}
```

---

# 6. CSS Global

`style.css` apenas para:
- Import do Tailwind base
- Variáveis CSS custom quando necessário
- Reset mínimo

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

# 7. Regras

- Sem CSS inline (`style={{}}`) exceto valores dinâmicos impossíveis via Tailwind (ex: larguras calculadas)
- Sem arquivos `.css` separados por componente
- Sem `!important`
- Sem valores hardcoded de cor fora do `tailwind.config.ts`
- Espaçamento e tipografia sempre com as classes Tailwind padrão
