# Feature: Assinatura da Plataforma (Frontend)

## Objetivo

Permitir que o tenant veja seu plano/trial, assine um dos planos (Gestão R$ 29,90 ou Operação R$ 99,90), gerencie a assinatura e seja conduzido à regularização quando o acesso expirar.

---

## Contexto

O backend controla trial (14 dias, acesso total) e assinatura via gateway de pagamento com checkout/portal **hospedados** — o frontend nunca coleta cartão, apenas redireciona para as URLs retornadas pela API. A ativação real acontece por webhook; o retorno do checkout é apenas informativo.

---

## Fluxo de Tela

### Step 1 — Página de assinatura (`/subscription`)

```
1. Carrega GET /subscriptions/me e GET /subscriptions/plans
2. Exibe cartão de status (plano, badge de status, dias de trial restantes,
   próxima renovação, aviso de cancelamento agendado)
3. Exibe os cards dos planos com preço e features
4. "Assinar" → POST /subscriptions/checkout { plan } → redirect à url retornada
5. "Gerenciar assinatura" (assinantes) → POST /subscriptions/portal → redirect
6. Retorno do checkout (?checkout=success) → banner "processando pagamento"
   + polling do /me até o webhook ativar; (?checkout=canceled) → banner informativo
```

### Step 2 — Trial em andamento (todas as telas do app)

```
1. Banner no topo do AppLayout: "Período de teste: X dias restantes" + CTA Assinar
2. past_due: banner de atenção com CTA "Atualizar pagamento" (portal)
```

### Step 3 — Acesso bloqueado

```
1. GET /subscriptions/me com hasAccess=false → redirect automático para /subscription
   (área autenticada inteira, exceto a própria página de assinatura)
2. Qualquer resposta 402 da API redireciona para /subscription
```

---

## Tela: SubscriptionPage

| Elemento                       | Tipo              | Obrigatório |
| ------------------------------ | ----------------- | ----------- |
| Cartão de status da assinatura | card              | Sim         |
| Card plano Gestão (R$ 29,90)   | card + CTA        | Sim         |
| Card plano Operação (R$ 99,90) | card + CTA (destaque "Recomendado") | Sim |
| Botão "Gerenciar assinatura"   | button (portal)   | Se já assinante |
| Banner retorno de checkout     | banner            | Condicional |

### Estados da Tela

| Estado             | Comportamento                                                    |
| ------------------ | ---------------------------------------------------------------- |
| Carregando         | Skeletons nos cards                                              |
| Trial vigente      | Badge "Teste" + dias restantes; CTAs "Assinar"                   |
| Assinatura ativa   | Badge "Ativo"; plano atual marcado; troca de plano via portal    |
| Pagamento pendente | Badge "Pagamento pendente" + CTA portal                          |
| Bloqueado          | Aviso de acesso expirado + CTAs "Assinar"                        |
| checkout=success   | Banner "processando"; polling do /me a cada 3s até ativar        |

---

## Integração com API

| Ação      | Endpoint                        | Método |
| --------- | ------------------------------- | ------ |
| Status    | `/api/v1/subscriptions/me`      | GET    |
| Planos    | `/api/v1/subscriptions/plans`   | GET    |
| Checkout  | `/api/v1/subscriptions/checkout`| POST   |
| Portal    | `/api/v1/subscriptions/portal`  | POST   |

---

## Erros Esperados

| Código da API            | Comportamento                                     |
| ------------------------ | ------------------------------------------------- |
| `SUBSCRIPTION_REQUIRED` (402) | Redirect para /subscription                  |
| `PLAN_UPGRADE_REQUIRED` (403) | Mensagem sugerindo upgrade para Operação     |
| `SUBSCRIPTION_NOT_FOUND` | Ocultar botão de portal                           |
| `INVALID_PLAN`           | "Plano inválido. Recarregue a página."            |

---

## Critérios de Aceite

- [ ] Trial mostra banner global com dias restantes e CTA para assinar
- [ ] hasAccess=false redireciona qualquer rota autenticada para /subscription
- [ ] Assinar redireciona ao checkout hospedado retornado pela API
- [ ] Retorno com ?checkout=success faz polling até a ativação via webhook
- [ ] Assinante ativo gerencia plano/cartão/cancelamento pelo portal hospedado
- [ ] O frontend nunca coleta nem armazena dados de cartão
- [ ] Item "Assinatura" no menu do usuário (Topbar)
