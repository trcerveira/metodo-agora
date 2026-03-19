# Story 3.1 — Workout Generation (Hybrid: Run + Strength por Nível)

**Epic:** E3 — Daily Workout
**Prioridade:** MUST
**Pontos:** 8
**Fase:** 1 (Semana 4-5)
**Assignee:** @dev
**Status:** [ ] To Do

---

## Descrição

Como **utilizador**, quero receber um treino diário híbrido (corrida + força) adaptado ao meu nível, humor e histórico, para que cada dia tenha um plano personalizado que me desafie na medida certa sem me desmotivar.

## Contexto

A FYVR é uma app de treino híbrido — cada treino combina corrida e força (bodyweight + equipamento opcional). O sistema MaaS Engine (Story 2.1) gera o treino via Claude API, mas esta story foca-se na **lógica de geração do workout**: base de dados de exercícios, 5 níveis de dificuldade, ajuste por mood e histórico, e estrutura do output.

**Ref PRD:** Secção 4.1 — Core Product (Treino Híbrido Diário), Secção 5.1 — F1 (Treino Híbrido Diário)
**Ref Arquitectura:** Secção 5.1 — Tabela `workouts`, Secção 5.2 — Edge Function `generate-workout`, Secção 5.3 — MaaS Engine

## Acceptance Criteria

- [ ] **AC1:** Edge Function `generate-workout` criada em `supabase/functions/generate-workout/` que:
  - Recebe: `user_id`, `pre_mood` (1-5), `date`
  - Busca na DB: perfil DISC, `training_level` (1-5), último treino (difficulty), treinos da semana, `equipment[]`
  - Chama Claude API (Haiku 4.5) com prompt MaaS para gerar treino
  - Guarda workout na tabela `workouts` com status `pending`
  - Retorna o workout completo ao frontend
- [ ] **AC2:** Base de exercícios de **força** definida em `lib/utils/exercises.ts`:
  - Mínimo 30 exercícios bodyweight (push-ups, squats, lunges, burpees, planks, etc.)
  - Mínimo 10 exercícios com halteres (dumbbell rows, shoulder press, goblet squats, etc.)
  - Mínimo 5 exercícios com barra (deadlift, back squat, bench press, etc.)
  - Cada exercício com: `id`, `name`, `muscle_group`, `equipment` (bodyweight/dumbbell/barbell/kettlebell), `difficulty` (1-5), `description`, `sets_default`, `reps_default`
- [ ] **AC3:** Base de **corrida** com targets por nível definida em `lib/utils/running.ts`:
  ```
  Nível 1 (Iniciante):    1-2 km ou 10-15 min walk/run
  Nível 2 (Básico):       2-3 km ou 15-20 min easy run
  Nível 3 (Intermédio):   3-5 km ou 20-30 min moderate run
  Nível 4 (Avançado):     5-8 km ou 30-40 min tempo run
  Nível 5 (Elite):        8-12 km ou 40-60 min intervals/long run
  ```
  - Cada nível com: `distance_min_km`, `distance_max_km`, `duration_min`, `duration_max`, `pace_target`, `type` (walk_run/easy/moderate/tempo/intervals)
- [ ] **AC4:** 5 níveis de dificuldade para **força** com parâmetros claros:
  ```
  Nível 1: 3-4 exercícios, 2 séries, 8-10 reps, bodyweight apenas
  Nível 2: 4-5 exercícios, 3 séries, 10-12 reps, bodyweight
  Nível 3: 5-6 exercícios, 3 séries, 10-15 reps, bodyweight + halteres
  Nível 4: 6-7 exercícios, 4 séries, 12-15 reps, todos os equipamentos
  Nível 5: 7-8 exercícios, 4-5 séries, 12-20 reps, todos os equipamentos, supersets
  ```
- [ ] **AC5:** Ajuste por mood implementado:
  - Mood 1-2 (baixo): reduzir volume em 30%, escolher exercícios mais simples, corrida mais curta
  - Mood 3 (normal): treino standard do nível
  - Mood 4-5 (alto): manter ou aumentar ligeiramente (+10%), desafio extra opcional
- [ ] **AC6:** Ajuste por histórico implementado:
  - Se último treino foi `difficulty: hard` → reduzir intensidade 20%
  - Se último treino foi `difficulty: easy` → aumentar intensidade 10%
  - Se 3+ treinos na semana → incluir dia de recovery (menos volume)
  - Se 0 treinos na semana → treino motivacional (mais acessível)
- [ ] **AC7:** Estrutura do workout gerado (JSONB para campo `workout_data`):
  ```typescript
  interface WorkoutData {
    type: 'hybrid' | 'run' | 'strength' | 'recovery'
    level: number                    // 1-5
    estimated_duration_min: number   // duração total estimada
    warmup: {
      duration_min: number
      exercises: string[]            // ["Arm circles", "Leg swings", ...]
    }
    strength: {
      exercises: Array<{
        id: string
        name: string
        muscle_group: string
        sets: number
        reps: number | string        // number ou "30s" para isométricos
        weight_suggestion?: string   // "bodyweight", "light", "moderate", "heavy"
        rest_seconds: number
        notes?: string
      }>
    }
    running: {
      type: string                   // walk_run, easy, moderate, tempo, intervals
      distance_km: number
      duration_min: number
      pace_target?: string           // "6:00/km"
      intervals?: Array<{
        type: 'run' | 'walk' | 'sprint'
        duration_min: number
      }>
    }
    cooldown: {
      duration_min: number
      exercises: string[]            // ["Hamstring stretch", "Quad stretch", ...]
    }
  }
  ```
- [ ] **AC8:** Prompt para Claude API estruturado com:
  - System prompt DISC (da Story 2.1 — `DISC_SYSTEM_PROMPTS`)
  - User prompt com: mood, nível, dia da semana, streak, última dificuldade, treinos da semana, equipamento disponível
  - Output format: JSON válido com `greeting`, `workout_data`, `cta_text`, `motivation`
  - Fallback: se Claude API falhar, gerar treino local a partir da base de exercícios
- [ ] **AC9:** API Route em `app/api/workout/generate/route.ts` que:
  - Verifica autenticação (Supabase Auth)
  - Verifica se já existe treino para hoje (evitar duplicados)
  - Chama a Edge Function `generate-workout`
  - Retorna workout ao frontend
- [ ] **AC10:** Tipo TypeScript `Workout` definido em `types/workout.ts`:
  ```typescript
  interface Workout {
    id: string
    user_id: string
    date: string
    type: 'hybrid' | 'run' | 'strength' | 'recovery'
    status: 'pending' | 'in_progress' | 'completed' | 'skipped'
    workout_data: WorkoutData
    maas_message: {
      greeting: string
      cta_text: string
      motivation: string
    }
    pre_mood: number | null
    post_mood: number | null
    post_difficulty: 'easy' | 'ideal' | 'hard' | null
    duration_minutes: number | null
    run_distance_km: number | null
    run_pace_min_km: number | null
    started_at: string | null
    completed_at: string | null
    created_at: string
  }
  ```
- [ ] **AC11:** Hook `useWorkout` em `hooks/useWorkout.ts`:
  - `generateWorkout(mood: number)` — gera treino do dia
  - `getTodayWorkout()` — busca treino de hoje (se já existir)
  - Estado: `loading`, `error`, `workout`
  - Cache local: guardar treino do dia em state para não refetch desnecessário

## Technical Notes

- Usar Claude Haiku 4.5 (rápido + barato) para geração real-time
- Implementar fallback local: se API falhar, gerar treino a partir do array de exercícios filtrado por nível e equipamento
- A Edge Function precisa de acesso ao `ANTHROPIC_API_KEY` (secret do Supabase)
- Exercícios devem ter nomes em Inglês (standard fitness) com tradução futura
- O campo `workout_data` é JSONB no Supabase — flexível para evoluir o schema
- Variação diária: o prompt deve instruir o Claude a nunca repetir o mesmo treino de ontem

## Definition of Done

- [ ] Código commitado no branch `feature/3.1-workout-generation`
- [ ] Edge Function `generate-workout` testada e funcional
- [ ] Base de exercícios com 45+ exercícios catalogados
- [ ] 5 níveis de running com targets definidos
- [ ] Ajuste por mood e histórico funcional
- [ ] Fallback local funciona quando Claude API está indisponível
- [ ] Tipo TypeScript `Workout` e `WorkoutData` exportados
- [ ] Hook `useWorkout` funcional

## Dependencies

- **Story 2.1** — MaaS Engine (Claude API integration + DISC prompts)

## Blocked By

- Story 2.1

## Next Story

→ **Story 3.2** — Workout Display (exercícios, séries, reps, duração)

---

*Story criada por River (SM) — AIOS*
