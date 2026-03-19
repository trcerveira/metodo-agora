# Story 7.3 — Analytics Setup (Mixpanel)

**Epic:** E7 — Landing Page & Launch
**Prioridade:** MUST
**Pontos:** 3
**Fase:** 3 (Semana 12)
**Assignee:** @dev
**Status:** [ ] To Do

---

## Descrição

Como **founder**, quero ter o Mixpanel integrado na FYVR a rastrear eventos-chave (signup, onboarding, workouts, streaks, upgrades, churn), para que consiga medir os KPIs definidos no PRD e tomar decisões baseadas em dados.

## Contexto

Sem analytics, a FYVR voa às cegas. O Mixpanel é a ferramenta escolhida por ter free tier generoso (20M eventos/mês), funnels de conversão, e análise de retenção — exactamente o que a FYVR precisa para medir a sua North Star Metric ("utilizadores activos que treinam 3+ vezes por semana durante 90+ dias"). Cada evento rastreado responde a uma pergunta do negócio: "As pessoas completam o onboarding?" "Quantas desistem?" "O DISC funciona?"

**Ref PRD:** Secção 8 — Métricas de Sucesso (KPIs), Secção 8.1 — North Star Metric, Secção 9.1 — Mixpanel
**Ref Arquitectura:** Secção 2.1 — Mixpanel (free tier), Secção 9.3 — Monitorização

## Acceptance Criteria

- [ ] **AC1:** Mixpanel SDK integrado no projecto Next.js:
  - Package `mixpanel-browser` instalado
  - Inicialização no root layout com `NEXT_PUBLIC_MIXPANEL_TOKEN`
  - Mixpanel só carrega em produção (não em development, para não poluir dados)
  - Alternativa dev: flag `NEXT_PUBLIC_MIXPANEL_DEBUG=true` para ver eventos na consola
- [ ] **AC2:** Identificação do utilizador configurada:
  - Ao fazer login/registo → `mixpanel.identify(user_id)`
  - User Properties definidas: `disc_profile`, `subscription_tier`, `training_level`, `timezone`, `is_beta_user`
  - Ao fazer logout → `mixpanel.reset()`
  - Properties actualizadas quando o perfil muda (ex: upgrade de tier)
- [ ] **AC3:** Eventos de aquisição rastreados:
  - `page_view` — cada página visitada (com `page_name` como property)
  - `signup` — registo concluído, com properties: `method` ('email' ou 'google'), `has_beta_code` (boolean)
  - `login` — login concluído, com property: `method`
- [ ] **AC4:** Eventos de onboarding rastreados:
  - `onboarding_started` — utilizador entra na página de onboarding
  - `onboarding_question_answered` — cada pergunta DISC respondida, com: `question_number` (1-3), `answer`
  - `onboarding_complete` — onboarding finalizado com: `disc_profile` (D/I/S/C), `duration_seconds`
  - `onboarding_abandoned` — utilizador sai do onboarding sem completar, com: `last_question_seen`
- [ ] **AC5:** Eventos de treino rastreados:
  - `workout_viewed` — utilizador viu o treino do dia, com: `workout_type`, `disc_profile`
  - `workout_started` — utilizador iniciou o treino, com: `workout_type`
  - `workout_complete` — treino concluído, com: `workout_type`, `duration_minutes`, `run_distance_km`, `pre_mood`, `post_mood`, `post_difficulty`, `current_streak`
  - `workout_skipped` — utilizador saltou o treino do dia
  - `checkin_complete` — check-in diário feito, com: `mood` (1-5)
- [ ] **AC6:** Eventos de gamificação rastreados:
  - `streak_milestone` — quando o streak atinge um marco, com: `streak_days` (7, 30, 90, 365)
  - `badge_earned` — badge ganho, com: `badge_id`, `badge_name`, `badge_rarity`
  - `progress_viewed` — tab Progresso aberta, com: `period` ('week' ou 'month')
- [ ] **AC7:** Eventos de comunidade rastreados:
  - `tribe_feed_viewed` — tab Tribo aberta
  - `tribe_post_liked` — like num post, com: `post_type`
  - `tribe_post_unliked` — unlike num post
  - `challenge_joined` — participou num desafio, com: `challenge_title`
  - `challenge_completed` — completou o desafio
- [ ] **AC8:** Eventos de monetização rastreados:
  - `upgrade_prompt_shown` — prompt de upgrade mostrado, com: `trigger_feature` (que feature bloqueada)
  - `upgrade_clicked` — clicou em "Ver Planos" ou "Upgrade"
  - `checkout_started` — iniciou checkout Stripe, com: `plan` ('pro' ou 'premium')
  - `checkout_completed` — pagamento concluído (via webhook → server-side Mixpanel)
  - `subscription_cancelled` — subscrição cancelada (via webhook)
  - `churn` — utilizador não abre a app há 14+ dias (cron job semanal)
- [ ] **AC9:** Utilitário de tracking centralizado:
  - Ficheiro `lib/analytics/mixpanel.ts` com funções helper:
    - `trackEvent(name: string, properties?: object)`
    - `identifyUser(userId: string, properties: object)`
    - `setUserProperty(key: string, value: any)`
    - `resetUser()`
  - Todas as chamadas ao Mixpanel passam por este utilitário (nunca chamar `mixpanel` directamente nos componentes)
  - Verificação interna: se Mixpanel não está inicializado → não fazer nada (não crashar)
- [ ] **AC10:** Dashboard inicial configurado no Mixpanel:
  - Funnel "Onboarding": signup → onboarding_started → onboarding_complete
  - Funnel "Conversão": signup → workout_complete → upgrade_clicked → checkout_completed
  - Report "Retenção": retenção D1, D7, D30 baseada em `workout_complete`
  - Report "Streaks": distribuição de streak_days no evento `streak_milestone`
  - Report "NPS/Engagement": DAU/MAU ratio baseado em qualquer evento

## Technical Notes

- Mixpanel browser SDK: `import mixpanel from 'mixpanel-browser'` — funciona em Client Components
- Para eventos server-side (webhooks), usar Mixpanel HTTP API ou `mixpanel` Node.js package nas Edge Functions
- O token do Mixpanel é público (como o do Stripe publishable key) — pode ir em `NEXT_PUBLIC_`
- Em desenvolvimento, logar eventos na consola em vez de enviar ao Mixpanel: `if (isDev) console.log('[Analytics]', name, properties)`
- O evento `churn` requer um cron job semanal que verifica `profiles` onde `last_workout_date < NOW() - INTERVAL '14 days'`
- Para pages views automáticos, considerar `usePathname()` do Next.js com `useEffect` para track
- Não rastrear PII (email, nome completo) como event properties — usar apenas `user_id` e properties agregadas

## Ficheiros a Criar/Modificar

```
src/lib/analytics/mixpanel.ts               # Utilitário centralizado de tracking
src/lib/analytics/events.ts                 # Constantes com nomes de eventos
src/app/layout.tsx                          # Modificar — inicializar Mixpanel
src/app/(auth)/register/page.tsx            # Modificar — track signup
src/app/(auth)/login/page.tsx               # Modificar — track login
src/app/(auth)/onboarding/page.tsx          # Modificar — track onboarding events
src/app/(main)/today/page.tsx               # Modificar — track workout events
src/app/(main)/progress/page.tsx            # Modificar — track progress_viewed
src/app/(main)/tribe/page.tsx               # Modificar — track tribe events
src/components/ui/UpgradePrompt.tsx          # Modificar — track upgrade events
supabase/functions/stripe-webhook/index.ts   # Modificar — track checkout/churn server-side
```

## Definition of Done

- [ ] Código commitado no branch `feature/7.3-analytics`
- [ ] Mixpanel SDK integrado e inicializado
- [ ] Utilizador identificado no Mixpanel após login (com properties)
- [ ] Todos os eventos de aquisição rastreados (signup, login)
- [ ] Todos os eventos de onboarding rastreados
- [ ] Todos os eventos de treino rastreados (workout_complete com properties)
- [ ] Todos os eventos de gamificação rastreados (streak, badge)
- [ ] Todos os eventos de monetização rastreados (upgrade, checkout)
- [ ] Utilitário centralizado usado em todos os ficheiros (sem chamadas directas ao Mixpanel)
- [ ] Dashboard básico configurado no Mixpanel com funnels e retenção
- [ ] Sem tracking em modo development (ou log na consola)
- [ ] `npm run build` passa sem erros

## Dependencies

- **Story 0.1** — Project Setup (Next.js base para integrar SDK)

## Blocked By

- Story 0.1

## Next Story

→ Nenhuma — última story do roadmap MVP

---

*Story criada por River (SM) — AIOS*
