# Arquitectura Full-Stack — FYVR
**Versão:** 1.0
**Data:** 2026-03-19
**Autor:** Aria (Architect)
**PRD Ref:** docs/prd/FYVR-PRD.md

---

## 1. Visão Arquitectural

### 1.1 Princípios de Design

| # | Princípio | Aplicação |
|---|-----------|-----------|
| 1 | **Budget-First** | Tudo deve funcionar em free tiers. 300€ cobre 6+ meses |
| 2 | **Progressive Complexity** | Simples no dia 1, escalável no dia 365 |
| 3 | **Solo-Founder Friendly** | 1 pessoa deve conseguir operar e manter |
| 4 | **PWA-First** | Web app que funciona como app nativa, sem App Store |
| 5 | **Serverless** | Zero servers para gerir. BaaS + Edge Functions |
| 6 | **AI-Augmented** | Claude API para MaaS engine, não para tudo |

### 1.2 Constraints Arquitecturais

| Constraint | Valor | Impacto na Arquitectura |
|-----------|-------|------------------------|
| Budget | 300€ | Free tiers obrigatórios, PWA em vez de native |
| Founder skill | Iniciante | Next.js (já tem base), Supabase (low-code backend) |
| Faceless | Obrigatório | Sem video hosting pesado, conteúdo texto/áudio |
| Solo | 1 pessoa | Mínimo de serviços, máximo de automação |

---

## 2. Stack Tecnológico

### 2.1 Stack Seleccionado

```
┌─────────────────────────────────────────────────────────┐
│                     FYVR Tech Stack                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  FRONTEND          BACKEND           SERVICES            │
│  ─────────         ────────          ────────             │
│  Next.js 15        Supabase          Claude API           │
│  React 19          ├─ Auth           (MaaS Engine)        │
│  Tailwind CSS      ├─ PostgreSQL                          │
│  PWA (SW)          ├─ Edge Functions  Stripe              │
│  Framer Motion     ├─ Realtime       (Pagamentos)         │
│                    ├─ Storage                              │
│  HOSTING           └─ RLS            OneSignal            │
│  ─────────                           (Push Notifications)  │
│  Vercel                                                    │
│  (Free tier)       ANALYTICS         Mixpanel              │
│                    ──────────        (Free tier)            │
│                                                            │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Justificação de Cada Escolha

| Tecnologia | Porquê | Alternativas Rejeitadas | Custo |
|-----------|--------|------------------------|-------|
| **Next.js 15** | Telmo já tem base Next.js, SSR, PWA support, Vercel deploy | React Native (caro), Flutter (novo stack) | Free |
| **Supabase** | Auth + DB + Realtime + Edge Functions num só serviço. Free tier generoso | Firebase (vendor lock-in), PlanetScale (sem auth) | Free (até 500MB, 50K MAU) |
| **Tailwind CSS** | Já configurado no projecto, utility-first, rápido | Styled Components (mais complexo) | Free |
| **Claude API** | Melhor LLM para comunicação natural, MaaS engine | OpenAI (mais caro), Gemini (menos natural) | ~0.01€/request |
| **Stripe** | Standard para subscrições, Checkout hosted | Paddle (menos flexível), LemonSqueezy | 2.9% + 0.30€/tx |
| **Vercel** | Deploy automático com Next.js, edge network, free tier | Netlify (menos Next.js), Railway (mais complexo) | Free (100GB bandwidth) |
| **OneSignal** | Push notifications, free até 10K subscribers | Firebase FCM (mais setup) | Free |
| **Mixpanel** | Analytics de engagement, funnels, retenção. Free tier | Amplitude (similar), PostHog (self-hosted) | Free (até 20M events) |

### 2.3 Custos Mensais Estimados

| Serviço | Free Tier | Quando Pagar | Custo Pago |
|---------|-----------|-------------|------------|
| Vercel | 100GB bandwidth, 100h builds | >1000 users | $20/mês |
| Supabase | 500MB DB, 1GB storage, 50K MAU | >500 users | $25/mês |
| Claude API | Pay-per-use | Desde dia 1 | ~$5-20/mês (MVP) |
| Stripe | Free (cobra por transação) | Desde dia 1 | 2.9% + 0.30€ |
| OneSignal | 10K subscribers | >10K users | $9/mês |
| Mixpanel | 20M events/mês | Raro exceder | Free |
| **TOTAL MVP** | | | **~$10-25/mês** |

---

## 3. Arquitectura do Sistema

### 3.1 Diagrama de Alto Nível

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Browser    │     │   Vercel     │     │   Supabase   │
│   (PWA)      │────▶│   Edge       │────▶│   Backend    │
│              │     │   Network    │     │              │
│  Next.js 15  │     │  SSR + API   │     │  PostgreSQL  │
│  React 19    │     │  Routes      │     │  Auth        │
│  Tailwind    │     │              │     │  Realtime    │
│  SW (offline)│     │              │     │  Edge Funcs  │
└──────┬───────┘     └──────────────┘     └──────┬───────┘
       │                                         │
       │              ┌──────────────┐           │
       │              │  Claude API  │           │
       └─────────────▶│  (MaaS       │◀──────────┘
                      │   Engine)    │
                      └──────────────┘

       ┌──────────────┐     ┌──────────────┐
       │   Stripe     │     │  OneSignal   │
       │  (Payments)  │     │  (Push)      │
       └──────────────┘     └──────────────┘
```

### 3.2 Fluxo de Dados Principal

```
User abre FYVR (PWA)
    │
    ▼
[Auth Check] ──── Não logado ──── ▶ Login/Register (Supabase Auth)
    │
    ▼ Logado
[Fetch User Profile] ──── Supabase DB
    │
    ├── DISC Profile (D/I/S/C)
    ├── Training Level (1-5)
    ├── Streak Count
    ├── Training History
    └── Preferences
    │
    ▼
[Daily Check-in] ──── "Como te sentes?" (1-5)
    │
    ▼
[MaaS Engine] ──── Supabase Edge Function → Claude API
    │
    ├── Input: DISC + mood + history + day + level
    ├── Process: Generate personalized workout + message
    └── Output: Adapted workout + communication
    │
    ▼
[Render Workout] ──── Next.js UI (DISC-adapted)
    │
    ▼
[User Trains] ──── Timer + tracking
    │
    ▼
[Post-Workout] ──── Save to DB + Update streak + Community feed
    │
    ▼
[Notifications] ──── OneSignal (DISC-adapted push)
```

---

## 4. Arquitectura Frontend

### 4.1 Estrutura de Pastas

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth pages (login, register)
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── onboarding/page.tsx   # DISC questionnaire
│   ├── (main)/                   # Main app (authenticated)
│   │   ├── today/page.tsx        # Daily workout (home)
│   │   ├── progress/page.tsx     # Progress & metrics
│   │   ├── tribe/page.tsx        # Community feed
│   │   └── profile/page.tsx      # User profile & settings
│   ├── layout.tsx                # Root layout + PWA meta
│   ├── manifest.json             # PWA manifest
│   └── sw.ts                     # Service Worker
│
├── components/
│   ├── ui/                       # Design system (buttons, cards, etc.)
│   ├── workout/                  # Workout components
│   │   ├── WorkoutCard.tsx       # Daily workout display
│   │   ├── ExerciseItem.tsx      # Single exercise
│   │   ├── Timer.tsx             # Workout timer
│   │   └── CheckIn.tsx           # Daily mood check-in
│   ├── tribe/                    # Community components
│   │   ├── FeedPost.tsx
│   │   ├── StreakBadge.tsx
│   │   └── Challenge.tsx
│   ├── progress/                 # Progress components
│   │   ├── StreakCounter.tsx
│   │   ├── ProgressChart.tsx
│   │   └── MilestoneCard.tsx
│   └── maas/                     # MaaS-specific components
│       ├── DISCMessage.tsx        # DISC-adapted messages
│       └── AdaptiveButton.tsx     # CTA buttons by profile
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Supabase browser client
│   │   ├── server.ts             # Supabase server client
│   │   └── middleware.ts         # Auth middleware
│   ├── maas/
│   │   ├── engine.ts             # MaaS communication engine
│   │   ├── disc.ts               # DISC profile utilities
│   │   └── templates.ts          # Message templates per DISC
│   ├── stripe/
│   │   └── client.ts             # Stripe checkout
│   └── utils/
│       ├── workouts.ts           # Workout generation logic
│       └── gamification.ts       # Streaks, badges, milestones
│
├── hooks/
│   ├── useUser.ts                # User profile + DISC
│   ├── useWorkout.ts             # Today's workout
│   ├── useStreak.ts              # Streak management
│   └── useTribe.ts               # Community feed
│
├── types/
│   ├── user.ts                   # User, DISCProfile types
│   ├── workout.ts                # Workout, Exercise types
│   └── tribe.ts                  # Post, Challenge types
│
└── styles/
    └── globals.css               # Tailwind + FYVR theme
```

### 4.2 PWA Configuration

```json
// manifest.json
{
  "name": "FYVR",
  "short_name": "FYVR",
  "description": "Catch the FYVR. Hybrid training that never lets you quit.",
  "start_url": "/today",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#FF4500",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### 4.3 Design System — DISC-Adaptive UI

```typescript
// lib/maas/disc.ts
export type DISCProfile = 'D' | 'I' | 'S' | 'C';

export const DISC_THEMES = {
  D: {
    ctaText: 'DOMINA',
    ctaColor: 'bg-red-600',
    tone: 'competitive',
    showLeaderboard: true,
    showStreak: true,
    showSocialFeed: false,
  },
  I: {
    ctaText: 'BORA COM TUDO',
    ctaColor: 'bg-yellow-500',
    tone: 'enthusiastic',
    showLeaderboard: false,
    showStreak: true,
    showSocialFeed: true,
  },
  S: {
    ctaText: 'CONTINUAR',
    ctaColor: 'bg-green-600',
    tone: 'supportive',
    showLeaderboard: false,
    showStreak: true,
    showSocialFeed: false,
  },
  C: {
    ctaText: 'INICIAR PROTOCOLO',
    ctaColor: 'bg-blue-600',
    tone: 'analytical',
    showLeaderboard: false,
    showStreak: true,
    showSocialFeed: false,
  },
} as const;
```

### 4.4 Ecrãs Principais (3 tabs + Profile)

| Tab | Rota | Função | Prioridade |
|-----|------|--------|-----------|
| **Hoje** | `/today` | Treino diário + check-in + MaaS message | MVP |
| **Progresso** | `/progress` | Streaks, gráficos, milestones, badges | MVP |
| **Tribo** | `/tribe` | Feed da comunidade, desafios | MVP |
| **Perfil** | `/profile` | Settings, DISC, subscrição, conta | MVP |

---

## 5. Arquitectura Backend (Supabase)

### 5.1 Schema da Base de Dados

```sql
-- ==========================================
-- USERS & PROFILES
-- ==========================================

CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  display_name TEXT NOT NULL,
  avatar_url TEXT,

  -- DISC Profile
  disc_profile CHAR(1) CHECK (disc_profile IN ('D', 'I', 'S', 'C')),
  disc_scores JSONB DEFAULT '{}',        -- {D: 2, I: 0, S: 1, C: 0}
  disc_detected_at TIMESTAMPTZ,

  -- Training Profile
  training_level INTEGER DEFAULT 1 CHECK (training_level BETWEEN 1 AND 5),
  preferred_time TEXT DEFAULT 'morning',  -- morning, afternoon, evening
  equipment TEXT[] DEFAULT '{}',          -- bodyweight, dumbbells, barbell, etc.
  goals TEXT[] DEFAULT '{}',              -- endurance, strength, hybrid, weight_loss

  -- Subscription
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'premium')),
  stripe_customer_id TEXT,
  subscription_expires_at TIMESTAMPTZ,

  -- Metadata
  timezone TEXT DEFAULT 'Europe/Lisbon',
  locale TEXT DEFAULT 'pt',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- WORKOUTS & TRAINING
-- ==========================================

CREATE TABLE public.workouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,

  -- Workout Details
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  type TEXT NOT NULL CHECK (type IN ('hybrid', 'run', 'strength', 'recovery')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')),

  -- Content (generated by MaaS engine)
  workout_data JSONB NOT NULL,            -- exercises, sets, reps, duration
  maas_message JSONB,                     -- personalized message + tone

  -- Check-in
  pre_mood INTEGER CHECK (pre_mood BETWEEN 1 AND 5),
  post_mood INTEGER CHECK (post_mood BETWEEN 1 AND 5),
  post_difficulty TEXT CHECK (post_difficulty IN ('easy', 'ideal', 'hard')),

  -- Performance
  duration_minutes INTEGER,
  calories_estimated INTEGER,
  run_distance_km DECIMAL(5,2),
  run_pace_min_km DECIMAL(5,2),

  -- Timestamps
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- STREAKS & GAMIFICATION
-- ==========================================

CREATE TABLE public.streaks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL UNIQUE,

  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_workouts INTEGER DEFAULT 0,
  total_minutes INTEGER DEFAULT 0,
  total_run_km DECIMAL(7,2) DEFAULT 0,

  last_workout_date DATE,
  streak_started_at DATE,

  -- Milestones reached
  milestones JSONB DEFAULT '[]',          -- [{type: "streak_7", reached_at: "..."}]
  badges JSONB DEFAULT '[]',              -- [{badge: "first_week", earned_at: "..."}]

  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- COMMUNITY / TRIBE
-- ==========================================

CREATE TABLE public.tribe_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,

  type TEXT NOT NULL CHECK (type IN ('workout_complete', 'milestone', 'challenge_complete', 'message')),
  content TEXT,
  metadata JSONB DEFAULT '{}',            -- workout_id, milestone_type, etc.

  likes_count INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.tribe_likes (
  user_id UUID REFERENCES public.profiles(id),
  post_id UUID REFERENCES public.tribe_posts(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, post_id)
);

-- ==========================================
-- CHALLENGES
-- ==========================================

CREATE TABLE public.challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('weekly', 'monthly', 'special')),
  target JSONB NOT NULL,                  -- {workouts: 3, in_days: 7}

  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,

  participants_count INTEGER DEFAULT 0,
  completions_count INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.challenge_participants (
  user_id UUID REFERENCES public.profiles(id),
  challenge_id UUID REFERENCES public.challenges(id),
  progress JSONB DEFAULT '{}',
  completed_at TIMESTAMPTZ,
  PRIMARY KEY (user_id, challenge_id)
);

-- ==========================================
-- DISC BEHAVIORAL TRACKING (Phase 2)
-- ==========================================

CREATE TABLE public.disc_signals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,

  signal_type TEXT NOT NULL,              -- 'leaderboard_view', 'social_share', 'data_view', 'routine_consistency'
  signal_value JSONB DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- ROW LEVEL SECURITY
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tribe_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tribe_likes ENABLE ROW LEVEL SECURITY;

-- Users can only read/write their own data
CREATE POLICY "Users read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users manage own workouts" ON public.workouts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own streaks" ON public.streaks
  FOR ALL USING (auth.uid() = user_id);

-- Tribe posts are public to read, own to write
CREATE POLICY "Anyone reads tribe posts" ON public.tribe_posts
  FOR SELECT USING (true);
CREATE POLICY "Users create own posts" ON public.tribe_posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Likes
CREATE POLICY "Anyone reads likes" ON public.tribe_likes
  FOR SELECT USING (true);
CREATE POLICY "Users manage own likes" ON public.tribe_likes
  FOR ALL USING (auth.uid() = user_id);

-- ==========================================
-- INDEXES
-- ==========================================

CREATE INDEX idx_workouts_user_date ON public.workouts(user_id, date);
CREATE INDEX idx_tribe_posts_created ON public.tribe_posts(created_at DESC);
CREATE INDEX idx_disc_signals_user ON public.disc_signals(user_id, created_at DESC);
```

### 5.2 Edge Functions (Supabase)

| Function | Trigger | Propósito |
|----------|---------|-----------|
| `generate-workout` | API call | Gera treino diário via MaaS engine (Claude API) |
| `update-streak` | After workout complete | Actualiza streak + verifica milestones |
| `create-tribe-post` | After workout complete | Auto-posta actividade no feed |
| `send-notification` | Cron (diário) | Push notification adaptada via OneSignal |
| `stripe-webhook` | Stripe event | Processa pagamentos + actualiza subscription |

### 5.3 MaaS Engine — Edge Function

```typescript
// supabase/functions/generate-workout/index.ts

import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic()

interface MaaSInput {
  discProfile: 'D' | 'I' | 'S' | 'C'
  mood: number           // 1-5
  trainingLevel: number  // 1-5
  dayOfWeek: string
  streakDays: number
  lastWorkoutDifficulty: string | null
  weeklyWorkouts: number
}

const DISC_SYSTEM_PROMPTS = {
  D: `You are a competitive, direct fitness coach. Challenge the user.
     Use short, powerful sentences. Focus on records, rankings, and performance.
     Never be soft. Push them. Use words like "dominate", "crush", "beat".`,

  I: `You are an enthusiastic, social fitness coach. Be energetic and fun.
     Use emojis, exclamation marks, and celebrate everything.
     Focus on community, friends, sharing. Make it a party, not a chore.`,

  S: `You are a calm, supportive fitness coach. Be gentle and encouraging.
     Never pressure. Focus on consistency, routine, small wins.
     Use words like "steady", "your pace", "no rush", "keep going".`,

  C: `You are an analytical, data-driven fitness coach. Be precise and factual.
     Provide numbers, percentages, comparisons. Focus on technique and metrics.
     Use words like "data shows", "your metrics", "optimal", "protocol".`,
}

export async function generateWorkout(input: MaaSInput) {
  const systemPrompt = DISC_SYSTEM_PROMPTS[input.discProfile]

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',  // Fast + cheap for real-time
    max_tokens: 500,
    system: systemPrompt,
    messages: [{
      role: 'user',
      content: `Generate today's hybrid workout.
        User mood: ${input.mood}/5
        Level: ${input.trainingLevel}/5
        Day: ${input.dayOfWeek}
        Streak: ${input.streakDays} days
        Last difficulty: ${input.lastWorkoutDifficulty || 'first time'}
        Workouts this week: ${input.weeklyWorkouts}

        Return JSON with:
        1. greeting (personalized message, max 2 sentences)
        2. workout (array of exercises with sets/reps/duration)
        3. cta_text (call-to-action button text)
        4. motivation (post-workout message, max 1 sentence)`
    }]
  })

  return JSON.parse(response.content[0].text)
}
```

---

## 6. Arquitectura de Segurança

### 6.1 Camadas de Segurança

| Camada | Implementação |
|--------|-------------|
| **Auth** | Supabase Auth (email + social login) |
| **Authorization** | Row Level Security (RLS) em TODAS as tabelas |
| **API** | Supabase auto-generated API com RLS enforcement |
| **Payments** | Stripe Checkout (hosted) — zero dados de cartão no nosso servidor |
| **Secrets** | Environment variables (Vercel + Supabase) |
| **HTTPS** | Automático via Vercel + Supabase |
| **Rate Limiting** | Supabase Edge Functions rate limiting built-in |

### 6.2 Dados Sensíveis

| Dado | Onde guardado | Acesso |
|------|-------------|--------|
| Password | Supabase Auth (hashed) | Nunca acessível |
| Email | Supabase Auth | Apenas próprio user (RLS) |
| DISC Profile | profiles table | Apenas próprio user (RLS) |
| Stripe Customer ID | profiles table | Apenas backend (RLS) |
| Claude API Key | Supabase Edge Function env | Nunca exposto ao frontend |
| Stripe Secret Key | Supabase Edge Function env | Nunca exposto ao frontend |

---

## 7. Arquitectura de Performance

### 7.1 Estratégia de Cache

| Dado | Cache | TTL | Justificação |
|------|-------|-----|-------------|
| Treino do dia | LocalStorage + React state | 24h | Não muda durante o dia |
| Perfil do user | React Query cache | 5min | Raramente muda |
| Feed da tribo | React Query + refetch on focus | 30s | Dados sociais frescos |
| Streak | Optimistic update + DB sync | Realtime | UX imediato |
| MaaS messages | Cache por DISC+mood combo | 1h | Evita API calls repetidas |

### 7.2 Optimização Claude API (Custo)

| Estratégia | Economia Estimada |
|-----------|-------------------|
| Usar Haiku (não Opus/Sonnet) para real-time | 10x mais barato |
| Cache de templates por DISC + mood + level | -60% calls |
| Pre-gerar mensagens para combinações comuns | -40% calls |
| Batch generate para notificações (1x/dia) | -80% vs individual |

**Custo estimado Claude API:**
- 100 users × 1 call/dia × $0.001/call = $3/mês
- 1000 users × 1 call/dia = $30/mês
- Com cache: ~50% menos = $15/mês

---

## 8. Fluxos Críticos

### 8.1 Onboarding (DISC Detection)

```
Register (email/Google)
    │
    ▼
Welcome Screen → "Vamos conhecer-te em 30 segundos"
    │
    ▼
Pergunta 1 (cenário pós-treino) → score D/I/S/C
    │
    ▼
Pergunta 2 (motivação diária) → score D/I/S/C
    │
    ▼
Pergunta 3 (perda de motivação) → score D/I/S/C
    │
    ▼
Calculate DISC → 2+ respostas iguais = perfil primário
    │
    ▼
Save to profiles.disc_profile
    │
    ▼
First Workout (adaptado ao DISC) → "Hoje" screen
```

### 8.2 Daily Loop (Core Experience)

```
User abre FYVR
    │
    ▼
Auth check (Supabase middleware)
    │
    ▼
Fetch: profile + streak + today's workout
    │
    ├── Workout já existe para hoje? → Mostrar
    └── Não existe → Check-in mood → Generate via MaaS → Mostrar
    │
    ▼
User treina (timer + tracking)
    │
    ▼
Workout complete:
    ├── Save workout (status: completed)
    ├── Update streak (Edge Function)
    ├── Check milestones (Edge Function)
    ├── Auto-post tribe feed (Edge Function)
    └── Post-workout message (DISC adapted)
    │
    ▼
User vê feed / progresso / fecha app
```

### 8.3 Payment Flow

```
User toca "Upgrade to Pro"
    │
    ▼
Create Stripe Checkout Session (Edge Function)
    │
    ▼
Redirect to Stripe Checkout (hosted page)
    │
    ▼
User paga → Stripe webhook → Edge Function
    │
    ▼
Update profiles.subscription_tier = 'pro'
Update profiles.subscription_expires_at
    │
    ▼
User regressa → features Pro desbloqueadas
```

---

## 9. Deployment & DevOps

### 9.1 Ambientes

| Ambiente | URL | Propósito |
|----------|-----|-----------|
| **Development** | localhost:3000 | Desenvolvimento local |
| **Preview** | *.vercel.app (auto) | Preview de cada branch/PR |
| **Production** | fyvr.app (custom domain) | Produção |

### 9.2 CI/CD Pipeline

```
git push → Vercel auto-deploy
    │
    ├── Preview Deploy (branches)
    └── Production Deploy (main branch)
    │
    ▼
Supabase migrations → via CLI (manual no MVP)
```

### 9.3 Monitorização

| O quê | Ferramenta | Custo |
|-------|-----------|-------|
| Erros frontend | Vercel Analytics (built-in) | Free |
| Engagement | Mixpanel | Free |
| DB performance | Supabase Dashboard | Free |
| API usage | Claude API Dashboard | Free |
| Uptime | Vercel (built-in) | Free |

---

## 10. Plano de Implementação por Fases

### Fase 0: Setup (Semana 1-2)

```
[ ] Criar repo Git
[ ] Setup Next.js 15 + Tailwind + PWA
[ ] Criar projecto Supabase (free tier)
[ ] Configurar Vercel deployment
[ ] Aplicar schema SQL (todas as tabelas)
[ ] Configurar variáveis de ambiente
[ ] Design system básico (cores, fonts, componentes base)
```

### Fase 1: Core MVP (Semana 3-6)

```
[ ] Auth (Supabase Auth — email + Google)
[ ] Onboarding DISC (3 perguntas)
[ ] Profile creation + DISC save
[ ] Workout generation (Edge Function + Claude API)
[ ] Daily check-in (mood 1-5)
[ ] Workout display (DISC-adapted UI)
[ ] Workout completion + timer
[ ] Streak counter + update logic
```

### Fase 2: Community + Gamification (Semana 7-10)

```
[ ] Tribe feed (Supabase Realtime)
[ ] Auto-post on workout complete
[ ] Likes system
[ ] Progress charts (streak, distance, consistency)
[ ] Milestones + badges
[ ] Push notifications (OneSignal — DISC adapted)
```

### Fase 3: Payment + Launch (Semana 11-12)

```
[ ] Stripe integration (Checkout + webhooks)
[ ] Free vs Pro feature gating
[ ] Landing page (fyvr.app)
[ ] Beta launch (50 users)
[ ] Feedback collection + iteration
```

---

## 11. Decisões Arquitecturais (ADRs)

### ADR-001: PWA em vez de App Nativa
- **Decisão:** PWA
- **Razão:** Budget 300€, solo founder, sem taxa App Store, cross-platform
- **Trade-off:** Sem acesso a HealthKit/Google Fit no MVP
- **Revisitar quando:** Revenue > 5.000€/mês → considerar React Native

### ADR-002: Supabase em vez de Firebase
- **Decisão:** Supabase
- **Razão:** PostgreSQL (relacional), RLS nativo, Edge Functions, open-source
- **Trade-off:** Menor community que Firebase
- **Revisitar quando:** Nunca (migrar de Firebase é muito mais difícil)

### ADR-003: Claude Haiku para MaaS Engine
- **Decisão:** Claude Haiku 4.5 para real-time, Sonnet para batch
- **Razão:** 10x mais barato que Sonnet/Opus, suficiente para mensagens curtas
- **Trade-off:** Menor qualidade literária (aceitável para fitness messages)
- **Revisitar quando:** Se qualidade das mensagens for queixa dos users

### ADR-004: Edge Functions para lógica de negócio
- **Decisão:** Supabase Edge Functions (Deno)
- **Razão:** Serverless, free tier, co-located com DB, TypeScript
- **Trade-off:** Cold starts (~200ms), limites de execução
- **Revisitar quando:** Se latência for problema → Vercel Edge Functions

---

## Aprovação

| Aprovador | Data | Status |
|-----------|------|--------|
| Telmo Cerveira (Founder) | Pendente | ⏳ |
| Aria (Architect) | 2026-03-19 | ✅ Aprovado |

---

*Arquitectura gerada por Aria (Architect) — AIOS*
*Produto: FYVR v1.0*
*Data: 2026-03-19*

— Aria, arquitetando o futuro 🏗️
