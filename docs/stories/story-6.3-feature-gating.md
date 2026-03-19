# Story 6.3 — Feature Gating (Free vs Pro)

**Epic:** E6 — Payments / Stripe
**Prioridade:** MUST
**Pontos:** 3
**Fase:** 3 (Semana 11)
**Assignee:** @dev
**Status:** [ ] To Do

---

## Descrição

Como **sistema**, quero controlar o acesso a funcionalidades com base no plano de subscrição do utilizador (Free, Pro, Premium), mostrando prompts de upgrade para features bloqueadas, para que os utilizadores Free tenham motivação para fazer upgrade e os Pro/Premium tenham o valor completo do seu pagamento.

## Contexto

O feature gating é o que torna o modelo freemium sustentável. O plano Free dá acesso limitado para o utilizador experimentar e perceber o valor da FYVR, mas bloqueia funcionalidades suficientes para que o upgrade valha a pena. O segredo é que o Free deve ser útil o suficiente para criar o hábito, mas limitado o suficiente para que o utilizador sinta a falta — sem frustrar.

**Ref PRD:** Secção 7.1 — Pricing (Free: 1 treino/semana, Pro: treinos diários, Premium: tudo)
**Ref Arquitectura:** Secção 5.1 — Campo `subscription_tier` na tabela `profiles`

## Acceptance Criteria

- [ ] **AC1:** Definição de features por tier implementada como constante:
  ```
  Free:
  - 1 treino por semana (máximo)
  - Feed da tribo em modo read-only (sem like, sem post)
  - Streak counter básico (sem milestones/badges)
  - Check-in diário

  Pro (12.99€/mês):
  - Treinos diários personalizados (sem limite)
  - Comunidade completa (likes, posts, desafios)
  - Gamificação completa (streaks, milestones, badges)
  - Push notifications DISC-adaptadas
  - Gráficos de progresso completos

  Premium (24.99€/mês):
  - Tudo do Pro
  - Planos para provas (HYROX, meias-maratonas) — futuro
  - Áudio coaching durante corrida — futuro
  - Nutrição básica — futuro
  - Desafios exclusivos — futuro
  ```
- [ ] **AC2:** Hook `useSubscription` criado em `src/hooks/useSubscription.ts`:
  - Retorna `{ tier, isPro, isPremium, isFree, canAccess(feature), isExpired }`
  - `canAccess(feature)` verifica se o tier actual tem acesso à feature pedida
  - Verifica `subscription_expires_at` — se expirada, tratar como Free
  - Cache do resultado para evitar queries repetidas
- [ ] **AC3:** Limite de 1 treino por semana implementado para Free:
  - Na página `/today`, verificar quantos workouts o utilizador Free completou esta semana
  - Query: `SELECT COUNT(*) FROM workouts WHERE user_id = X AND status = 'completed' AND date >= (início da semana)`
  - Se `count >= 1` → mostrar modal de upgrade em vez do treino
  - Mensagem: "Já usaste o teu treino gratuito esta semana. Faz upgrade para treinar todos os dias!"
- [ ] **AC4:** Feed da tribo em modo read-only para Free:
  - Utilizador Free pode ver posts no feed
  - Botão de like desactivado com tooltip "Faz upgrade para interagir"
  - Auto-post desactivado (workouts do Free não geram posts no feed)
  - Indicador visual subtil: ícone de cadeado nos botões de interacção
- [ ] **AC5:** Gamificação limitada para Free:
  - Streak counter funciona (incentiva consistência)
  - Milestones e badges bloqueados — mostrados com ícone de cadeado
  - Tab "Progresso" mostra apenas streak e total de treinos (gráficos bloqueados)
  - Mensagem: "Desbloqueia gráficos e badges com o plano Pro"
- [ ] **AC6:** Componente `UpgradePrompt` criado:
  - Modal/bottom-sheet que aparece quando o utilizador tenta aceder a feature bloqueada
  - Mostra a feature que tentou aceder
  - Benefícios do upgrade em lista
  - Botão "Ver Planos" que leva à secção de pricing (`/profile`)
  - Botão "Agora não" para fechar
  - Design apelativo, não agressivo
- [ ] **AC7:** Indicadores de feature bloqueada nos ecrãs:
  - Ícone de cadeado (🔒) em features Pro/Premium para utilizadores Free
  - Cor atenuada (opacidade 50%) em secções bloqueadas
  - Texto curto: "Pro" ou "Premium" junto ao cadeado
  - Ao clicar em feature bloqueada → abre `UpgradePrompt`
- [ ] **AC8:** Gating implementado no backend (Edge Functions):
  - Edge Function `generate-workout` verifica o tier antes de gerar treino:
    - Free: máximo 1 por semana
    - Pro/Premium: sem limite
  - Edge Function `create-tribe-post` verifica o tier:
    - Free: não cria post
    - Pro/Premium: cria normalmente
  - Gating no backend impede bypass via API directa
- [ ] **AC9:** Transição suave ao fazer upgrade:
  - Quando o webhook do Stripe actualiza o tier para 'pro' ou 'premium':
    - Ao reabrir/refresh a app, features desbloqueiam imediatamente
    - Cadeados desaparecem
    - Mensagem de boas-vindas: "Bem-vindo ao FYVR Pro! Tudo desbloqueado."
  - Hook `useSubscription` refaz query ao perfil para detectar mudança de tier

## Technical Notes

- O mapeamento feature → tier deve ser uma constante centralizada (`lib/utils/features.ts`) para fácil manutenção
- O gating no frontend é para UX (mostrar/esconder), o gating no backend é para segurança (impedir acesso)
- Ambos são necessários — nunca confiar apenas no frontend
- Para verificar expiração: `if (subscription_expires_at && new Date(subscription_expires_at) < new Date()) → treat as free`
- O limite de 1 treino/semana para Free usa a semana ISO (segunda a domingo)
- Considerar um período de "trial" futuro (3 dias Pro grátis) — não implementar agora, mas estruturar o código para suportar

## Ficheiros a Criar/Modificar

```
src/hooks/useSubscription.ts                 # Hook de verificação de tier
src/lib/utils/features.ts                   # Mapeamento feature → tier
src/components/ui/UpgradePrompt.tsx          # Modal/prompt de upgrade
src/components/ui/LockedFeature.tsx          # Wrapper para features bloqueadas
src/app/(main)/today/page.tsx               # Modificar — gating de treino semanal
src/app/(main)/tribe/page.tsx               # Modificar — read-only para Free
src/app/(main)/progress/page.tsx            # Modificar — gating de gráficos/badges
supabase/functions/generate-workout/index.ts # Modificar — verificar tier
supabase/functions/create-tribe-post/index.ts # Modificar — verificar tier
```

## Definition of Done

- [ ] Código commitado no branch `feature/6.3-feature-gating`
- [ ] Utilizador Free limitado a 1 treino por semana
- [ ] Feed em read-only para Free (sem like, sem post)
- [ ] Gamificação limitada para Free (streak sim, badges/gráficos não)
- [ ] Componente UpgradePrompt funcional e apelativo
- [ ] Indicadores de cadeado visíveis em features bloqueadas
- [ ] Gating implementado no backend (Edge Functions)
- [ ] Transição suave após upgrade (features desbloqueiam)
- [ ] Hook useSubscription retorna dados correctos
- [ ] `npm run build` passa sem erros

## Dependencies

- **Story 6.2** — Stripe Webhook (subscription_tier actualizado via webhook)

## Blocked By

- Story 6.2

## Next Story

→ **Story 7.1** — Landing Page FYVR

---

*Story criada por River (SM) — AIOS*
