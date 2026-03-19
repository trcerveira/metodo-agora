# FYVR — Story Backlog
**Data:** 2026-03-19
**Status:** Draft
**PRD:** docs/prd/FYVR-PRD.md
**Arquitectura:** docs/architecture/FYVR-fullstack-architecture.md

---

## Visão Geral dos Epics

| Epic | Nome | Fase | Semanas | Stories |
|------|------|------|---------|---------|
| E0 | Project Setup | 0 | 1-2 | 3 |
| E1 | Auth & Onboarding | 1 | 3-4 | 4 |
| E2 | MaaS Engine & DISC | 1 | 3-5 | 4 |
| E3 | Daily Workout | 1 | 4-6 | 5 |
| E4 | Streaks & Gamification | 2 | 7-8 | 4 |
| E5 | Tribe / Community | 2 | 8-10 | 4 |
| E6 | Payments (Stripe) | 3 | 11 | 3 |
| E7 | Landing Page & Launch | 3 | 12 | 3 |
| **TOTAL** | | | **12 semanas** | **30 stories** |

---

## E0 — Project Setup (Semanas 1-2)

| Story | Título | Prioridade | Pontos |
|-------|--------|-----------|--------|
| 0.1 | Setup do repositório, Next.js 15, Tailwind, PWA | MUST | 3 |
| 0.2 | Setup Supabase (projecto, schema SQL, RLS) | MUST | 5 |
| 0.3 | Design System FYVR (cores, tipografia, componentes base) | MUST | 5 |

## E1 — Auth & Onboarding (Semanas 3-4)

| Story | Título | Prioridade | Pontos |
|-------|--------|-----------|--------|
| 1.1 | Auth com Supabase (email + Google login) | MUST | 5 |
| 1.2 | Onboarding DISC — 3 perguntas cenário | MUST | 5 |
| 1.3 | Criação de perfil (profile + DISC save) | MUST | 3 |
| 1.4 | Auth middleware + protected routes | MUST | 3 |

## E2 — MaaS Engine & DISC (Semanas 3-5)

| Story | Título | Prioridade | Pontos |
|-------|--------|-----------|--------|
| 2.1 | MaaS Engine — Edge Function + Claude API integration | MUST | 8 |
| 2.2 | DISC Communication Templates (4 perfis × mensagens) | MUST | 5 |
| 2.3 | Daily Check-in (mood 1-5) + state adjustment | MUST | 3 |
| 2.4 | DISC-Adaptive UI (temas, CTAs, layout por perfil) | MUST | 5 |

## E3 — Daily Workout (Semanas 4-6)

| Story | Título | Prioridade | Pontos |
|-------|--------|-----------|--------|
| 3.1 | Workout Generation (hybrid: run + strength por nível) | MUST | 8 |
| 3.2 | Workout Display (exercícios, séries, reps, duração) | MUST | 5 |
| 3.3 | Workout Timer + Tracking (em progresso → completo) | MUST | 5 |
| 3.4 | Post-Workout Flow (feedback, mood, save) | MUST | 3 |
| 3.5 | Tab "Hoje" — Ecrã principal completo | MUST | 5 |

## E4 — Streaks & Gamification (Semanas 7-8)

| Story | Título | Prioridade | Pontos |
|-------|--------|-----------|--------|
| 4.1 | Streak Counter (cálculo, update, exibição) | MUST | 5 |
| 4.2 | Milestones & Badges (7 dias, 30 dias, 90 dias, etc.) | SHOULD | 5 |
| 4.3 | Tab "Progresso" — Gráficos e métricas | MUST | 5 |
| 4.4 | Notificações Push adaptativas (OneSignal + DISC) | SHOULD | 5 |

## E5 — Tribe / Community (Semanas 8-10)

| Story | Título | Prioridade | Pontos |
|-------|--------|-----------|--------|
| 5.1 | Feed da Tribo (posts, actividade da comunidade) | MUST | 5 |
| 5.2 | Auto-post ao completar treino | MUST | 3 |
| 5.3 | Sistema de Likes | SHOULD | 2 |
| 5.4 | Tab "Tribo" — Ecrã completo com feed e stats | MUST | 5 |

## E6 — Payments / Stripe (Semana 11)

| Story | Título | Prioridade | Pontos |
|-------|--------|-----------|--------|
| 6.1 | Stripe Checkout integration (Pro plan) | MUST | 5 |
| 6.2 | Webhook handler (subscription management) | MUST | 5 |
| 6.3 | Feature gating (Free vs Pro) | MUST | 3 |

## E7 — Landing Page & Launch (Semana 12)

| Story | Título | Prioridade | Pontos |
|-------|--------|-----------|--------|
| 7.1 | Landing page FYVR (fyvr.app) | MUST | 5 |
| 7.2 | Beta launch setup (50 users, feedback form) | MUST | 3 |
| 7.3 | Analytics setup (Mixpanel events) | SHOULD | 3 |

---

## Resumo de Pontos

| Fase | Epics | Stories | Pontos | Semanas |
|------|-------|---------|--------|---------|
| Fase 0 | E0 | 3 | 13 | 2 |
| Fase 1 | E1, E2, E3 | 13 | 63 | 4 |
| Fase 2 | E4, E5 | 8 | 35 | 4 |
| Fase 3 | E6, E7 | 6 | 24 | 2 |
| **TOTAL** | **8** | **30** | **135** | **12** |

---

*Backlog criado por River (SM) — AIOS*
