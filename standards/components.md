# Components Standards (SDD)

Este documento define os padrões para criação, estrutura e uso de componentes no frontend.

---

# 1. Categorias de Componentes

## UI Components — `shared/components/`

- Stateless (estado local apenas para interação de UI pura)
- Sem conhecimento de domínio de negócio
- Sem acesso ao Redux
- Genéricos e reutilizáveis em qualquer feature
- Exemplos: `Button`, `Input`, `Modal`, `Table`, `Badge`, `Spinner`, `Toast`, `Pagination`

## Feature Components — `features/*/components/`

- Conectados ao Redux quando necessário
- Conhecem o domínio da feature
- Usam RTK Query hooks para dados
- Compostos de UI Components
- Exemplos: `LoginForm`, `ClientTable`, `ContractCard`, `ReceivableStatusBadge`

## Pages — `features/*/pages/` ou `pages/`

- Thin — apenas composição de Feature Components
- Default export (obrigatório para `React.lazy`)
- Definem título e layout da tela

---

# 2. Padrão de Componente

```tsx
interface ClientTableProps {
  tenantId: string
  onClientSelect: (clientId: string) => void
}

export function ClientTable({ tenantId, onClientSelect }: ClientTableProps) {
  const { data, isLoading } = useGetClientsQuery({ tenantId })

  if (isLoading) return <Spinner />

  return (
    <Table
      data={data?.items ?? []}
      onRowClick={(row) => onClientSelect(row.id)}
    />
  )
}
```

---

# 3. Props

- Sempre tipadas com `interface`, nunca com objeto inline
- Nomes em inglês e descritivos
- Callbacks prefixadas com `on`: `onClick`, `onSuccess`, `onClose`, `onChange`
- Boolean flags sem valor explícito: `<Button disabled />` ao invés de `disabled={true}`
- Sem props desnecessárias — não passar o que não é usado

---

# 4. Estrutura Interna do Componente

Ordem obrigatória dentro do componente:

```tsx
export function MyComponent({ prop }: Props) {
  // 1. Hooks (useState, useSelector, RTK Query, custom hooks)
  // 2. Derived state / computed values
  // 3. Handlers (handle + ação: handleSubmit, handleClose)
  // 4. useEffect (apenas quando necessário)
  // 5. Early returns (loading, error, empty)
  // 6. return JSX principal
}
```

---

# 5. Composição vs Props Booleanas

Preferir composição via children a props booleanas que alteram o comportamento interno:

**Evitar:**
```tsx
<Modal showHeader showFooter type="confirm" title="Título" />
```

**Preferir:**
```tsx
<Modal>
  <Modal.Header>Título</Modal.Header>
  <Modal.Body>Conteúdo</Modal.Body>
  <Modal.Footer>
    <Button variant="ghost" onClick={onClose}>Cancelar</Button>
    <Button onClick={onConfirm}>Confirmar</Button>
  </Modal.Footer>
</Modal>
```

---

# 6. Regras

- Um componente, uma responsabilidade
- Mais de 150 linhas: dividir em subcomponentes
- Extrair lógica complexa para custom hooks
- Sem chamadas HTTP diretamente no componente — usar RTK Query hooks
- Sem `console.log` em componentes
- Sem efeitos colaterais fora de `useEffect`
- Sem mutação de props
