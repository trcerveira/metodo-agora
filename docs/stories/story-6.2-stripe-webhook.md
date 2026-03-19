# Story 6.2 — Webhook Handler (gestão de subscrição)

**Epic:** E6 — Payments / Stripe
**Prioridade:** MUST
**Pontos:** 5
**Fase:** 3 (Semana 11)
**Assignee:** @dev
**Status:** [ ] To Do

---

## Descrição

Como **sistema**, quero processar automaticamente os webhooks do Stripe para actualizar o estado da subscrição do utilizador na base de dados, para que o acesso a features Pro/Premium seja activado ou desactivado conforme o estado do pagamento.

## Contexto

Os Stripe webhooks são o mecanismo que mantém a base de dados da FYVR sincronizada com o estado real dos pagamentos. Quando um utilizador paga, cancela, ou tem um pagamento falhado, o Stripe envia um evento à nossa Edge Function. Esta função processa o evento e actualiza os campos `subscription_tier` e `subscription_expires_at` na tabela `profiles`. Sem este webhook, a app não saberia se o utilizador realmente pagou.

**Ref PRD:** Secção 5.1 — Feature F10 (Subscrição Stripe), Secção 7.1 — Pricing
**Ref Arquitectura:** Secção 5.2 — Edge Function `stripe-webhook`, Secção 8.3 — Payment Flow

## Acceptance Criteria

- [ ] **AC1:** Edge Function `stripe-webhook` criada no Supabase:
  - Endpoint público (sem auth do Supabase — o Stripe não envia JWT)
  - Recebe o body do webhook como raw (não JSON parsed)
  - Verifica a assinatura do webhook usando `STRIPE_WEBHOOK_SECRET`
  - Se assinatura inválida → retorna 400 e loga o erro
- [ ] **AC2:** Evento `checkout.session.completed` processado:
  - Extrair `customer` (Stripe Customer ID) do evento
  - Extrair `subscription` (Stripe Subscription ID) do evento
  - Extrair `metadata.user_id` para identificar o utilizador na tabela `profiles`
  - Buscar o Subscription do Stripe para obter o `price_id`
  - Determinar o tier baseado no `price_id`:
    - `STRIPE_PRO_PRICE_ID` → `subscription_tier = 'pro'`
    - `STRIPE_PREMIUM_PRICE_ID` → `subscription_tier = 'premium'`
  - Actualizar na tabela `profiles`:
    - `subscription_tier` → 'pro' ou 'premium'
    - `stripe_customer_id` → confirmação/actualização
    - `subscription_expires_at` → `current_period_end` da subscrição
- [ ] **AC3:** Evento `customer.subscription.updated` processado:
  - Detectar mudanças no estado da subscrição:
    - `status: 'active'` → manter tier actual
    - `status: 'past_due'` → manter tier (dar período de graça)
    - `status: 'canceled'` → marcar para downgrade no final do período
  - Detectar mudanças de plano (upgrade/downgrade):
    - Se o `price_id` mudou → actualizar `subscription_tier` correspondente
  - Actualizar `subscription_expires_at` com o novo `current_period_end`
- [ ] **AC4:** Evento `customer.subscription.deleted` processado:
  - Quando a subscrição é definitivamente cancelada
  - Actualizar na tabela `profiles`:
    - `subscription_tier` → 'free'
    - `subscription_expires_at` → NULL
  - Loga o evento para análise de churn
- [ ] **AC5:** Evento `invoice.payment_failed` processado:
  - Quando um pagamento recorrente falha
  - Não faz downgrade imediato (o Stripe faz retry automático)
  - Loga o evento para monitorização
  - Opcional (futuro): enviar notificação ao utilizador sobre o problema de pagamento
- [ ] **AC6:** Idempotência implementada:
  - Cada evento do Stripe tem um `event.id` único
  - Verificar se o evento já foi processado (guardar IDs processados ou usar lógica idempotente)
  - Se o evento já foi processado → retornar 200 sem fazer nada
  - Previne duplicação se o Stripe enviar o mesmo evento múltiplas vezes
- [ ] **AC7:** Resposta correcta ao Stripe:
  - Retornar status 200 para eventos processados com sucesso
  - Retornar status 200 para eventos ignorados (tipos não tratados)
  - Retornar status 400 apenas para assinatura inválida
  - NUNCA retornar 500 — o Stripe faz retry e pode sobrecarregar
  - Processar rapidamente (< 5 segundos) para evitar timeout do Stripe
- [ ] **AC8:** Webhook endpoint configurado no Stripe Dashboard:
  - URL: `https://<supabase-project>.supabase.co/functions/v1/stripe-webhook`
  - Eventos subscritos: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
  - Webhook secret copiado para variável de ambiente `STRIPE_WEBHOOK_SECRET`
- [ ] **AC9:** Logging estruturado para debugging:
  - Log do tipo de evento recebido
  - Log do user_id e tier actualizados
  - Log de erros com contexto suficiente para debugging
  - Sem logar dados sensíveis (cartão, etc.)

## Technical Notes

- A verificação de assinatura do Stripe em Deno: usar `stripe.webhooks.constructEvent(body, sig, secret)`
- O body deve ser lido como raw text (não JSON parsed) para a verificação de assinatura funcionar
- Em Supabase Edge Functions: `const body = await req.text()` e `const sig = req.headers.get('stripe-signature')`
- O webhook usa `service_role` key do Supabase para escrever na tabela `profiles` (bypass RLS)
- Para teste local, usar `stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook` (Stripe CLI)
- O Stripe pode enviar eventos fora de ordem — a lógica deve ser tolerante (usar timestamps, não ordem)
- Considerar criar tabela `webhook_events` para auditoria (opcional no MVP)

## Ficheiros a Criar/Modificar

```
supabase/functions/stripe-webhook/index.ts    # Edge Function do webhook
src/types/stripe.ts                          # Tipos TypeScript para eventos Stripe
```

## Definition of Done

- [ ] Código commitado no branch `feature/6.2-stripe-webhook`
- [ ] Webhook endpoint configurado no Stripe Dashboard
- [ ] Assinatura do webhook verificada correctamente
- [ ] `checkout.session.completed` actualiza `subscription_tier` na tabela `profiles`
- [ ] `customer.subscription.deleted` faz downgrade para 'free'
- [ ] `customer.subscription.updated` detecta mudanças de plano
- [ ] Idempotência funcional (mesmo evento processado 2x não causa problemas)
- [ ] Retorna 200 para todos os eventos (processados ou ignorados)
- [ ] Testado com Stripe CLI em modo teste
- [ ] Logs estruturados para debugging
- [ ] `npm run build` passa sem erros

## Dependencies

- **Story 6.1** — Stripe Checkout (produtos criados, Stripe Customer ID guardado)

## Blocked By

- Story 6.1

## Next Story

→ **Story 6.3** — Feature gating (Free vs Pro)

---

*Story criada por River (SM) — AIOS*
