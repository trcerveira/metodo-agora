# Story 6.1 — Stripe Checkout Integration

**Epic:** E6 — Payments / Stripe
**Prioridade:** MUST
**Pontos:** 5
**Fase:** 3 (Semana 11)
**Assignee:** @dev
**Status:** [ ] To Do

---

## Descrição

Como **utilizador**, quero poder fazer upgrade para o plano Pro (12.99€/mês) ou Premium (24.99€/mês) através de uma página de pagamento segura do Stripe, para que consiga desbloquear todas as funcionalidades da FYVR.

## Contexto

A monetização da FYVR usa o Stripe Checkout (página hosted pelo Stripe) — isto significa que nunca tocamos em dados de cartão de crédito, reduzindo complexidade e risco. O fluxo é: utilizador clica "Upgrade" → Edge Function cria uma Checkout Session → redirect para Stripe → utilizador paga → Stripe envia webhook → Edge Function actualiza o perfil. Nesta story implementamos a primeira metade: criação dos produtos e o redirect para checkout.

**Ref PRD:** Secção 5.1 — Feature F10 (Subscrição Stripe), Secção 7.1 — Pricing (Free, Pro 12.99€, Premium 24.99€)
**Ref Arquitectura:** Secção 2.1 — Stripe, Secção 8.3 — Payment Flow

## Acceptance Criteria

- [ ] **AC1:** Produtos e preços criados no Stripe Dashboard:
  - Produto "FYVR Pro" com preço recorrente de 12.99€/mês
  - Produto "FYVR Premium" com preço recorrente de 24.99€/mês
  - Moeda: EUR
  - Billing cycle: mensal
  - IDs dos preços (`price_xxx`) guardados como variáveis de ambiente
- [ ] **AC2:** Variáveis de ambiente configuradas:
  - `STRIPE_SECRET_KEY` — chave secreta do Stripe (Supabase Edge Function env)
  - `STRIPE_WEBHOOK_SECRET` — secret do webhook (para Story 6.2)
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — chave pública (frontend)
  - `STRIPE_PRO_PRICE_ID` — ID do preço Pro
  - `STRIPE_PREMIUM_PRICE_ID` — ID do preço Premium
- [ ] **AC3:** Edge Function `create-checkout-session` criada no Supabase:
  - Recebe `price_id` e `user_id` como parâmetros
  - Verifica se o utilizador já tem um `stripe_customer_id` na tabela `profiles`:
    - Se sim → usa o customer existente
    - Se não → cria novo customer no Stripe com email do utilizador e guarda o `stripe_customer_id`
  - Cria uma Stripe Checkout Session com:
    - `mode: 'subscription'`
    - `line_items: [{ price: price_id, quantity: 1 }]`
    - `customer: stripe_customer_id`
    - `success_url: '{baseUrl}/profile?checkout=success'`
    - `cancel_url: '{baseUrl}/profile?checkout=cancelled'`
    - `metadata: { user_id }` (para o webhook identificar o utilizador)
  - Retorna o `session.url` para redirect
- [ ] **AC4:** Página de upgrade/pricing criada:
  - Acessível via `/profile` (secção "Plano") ou modal de upgrade
  - Mostra os 3 planos lado a lado (ou em cards empilhados no mobile):
    - **Free** (0€): 1 treino/semana, feed read-only, streak básico
    - **Pro** (12.99€/mês): treinos diários, comunidade completa, gamificação
    - **Premium** (24.99€/mês): tudo + planos para provas, áudio coaching, nutrição
  - Plano actual destacado com badge "Plano Actual"
  - Botão "Upgrade" nos planos superiores ao actual
  - Botão "Upgrade" desactivado no plano actual
- [ ] **AC5:** Fluxo de redirect para Stripe Checkout implementado:
  - Ao clicar "Upgrade para Pro/Premium":
    - Botão mostra loading spinner
    - Chamada à Edge Function `create-checkout-session`
    - Redirect para `session.url` (página hosted do Stripe)
  - Após pagamento no Stripe:
    - Sucesso: redirect para `/profile?checkout=success` com mensagem de boas-vindas
    - Cancelamento: redirect para `/profile?checkout=cancelled` com mensagem de encorajamento
- [ ] **AC6:** Feedback visual após checkout:
  - Sucesso (`?checkout=success`): toast/banner "Bem-vindo ao FYVR Pro! As tuas features estão desbloqueadas."
  - Cancelamento (`?checkout=cancelled`): toast/banner "Sem problema! Podes fazer upgrade quando quiseres."
  - Query params limpos do URL após mostrar a mensagem
- [ ] **AC7:** Tratamento de erros na Edge Function:
  - Utilizador não autenticado → erro 401
  - `price_id` inválido → erro 400 com mensagem descritiva
  - Erro do Stripe API → erro 500 com log detalhado (sem expor ao utilizador)
  - Frontend mostra mensagem genérica: "Erro ao processar pagamento. Tenta novamente."
- [ ] **AC8:** Segurança implementada:
  - Edge Function verifica que o `user_id` corresponde ao utilizador autenticado (JWT)
  - Stripe Secret Key nunca exposta ao frontend
  - Checkout Session expira após 30 minutos
  - Utilizador já Pro/Premium não pode fazer upgrade para o mesmo plano

## Technical Notes

- Usar o Stripe SDK oficial para Node.js/Deno: `stripe` npm package
- Em Supabase Edge Functions (Deno), importar via `import Stripe from 'https://esm.sh/stripe@latest'`
- O Stripe Checkout é uma página hosted — não precisamos de componentes de pagamento no frontend
- Para teste, usar o Stripe Test Mode com cartões de teste (4242 4242 4242 4242)
- Os `price_id` devem ser diferentes entre test mode e production — usar variáveis de ambiente
- O `stripe_customer_id` permite ao Stripe gerir o portal do cliente (futuro: gestão de subscrição)
- Não implementar portal de gestão de subscrição nesta story — apenas o checkout

## Ficheiros a Criar/Modificar

```
supabase/functions/create-checkout-session/index.ts  # Edge Function de checkout
src/components/profile/PricingCards.tsx              # Cards de planos Free/Pro/Premium
src/app/(main)/profile/page.tsx                    # Modificar — adicionar secção de plano
src/lib/stripe/client.ts                            # Configuração Stripe (publishable key)
```

## Definition of Done

- [ ] Código commitado no branch `feature/6.1-stripe-checkout`
- [ ] Produtos Pro e Premium criados no Stripe Dashboard (test mode)
- [ ] Edge Function cria Checkout Session correctamente
- [ ] Redirect para Stripe Checkout funciona
- [ ] Pagamento com cartão de teste 4242... funciona end-to-end
- [ ] Redirect de volta à app após sucesso/cancelamento
- [ ] Mensagens de feedback mostradas correctamente
- [ ] Stripe Customer ID guardado na tabela `profiles`
- [ ] Erros tratados sem expor informação sensível
- [ ] `npm run build` passa sem erros

## Dependencies

- **Story 0.2** — Supabase Setup (tabela profiles com campos stripe_customer_id, subscription_tier)

## Blocked By

- Story 0.2

## Next Story

→ **Story 6.2** — Webhook handler (subscription management)

---

*Story criada por River (SM) — AIOS*
