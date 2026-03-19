# Story 4.1 — Streak Counter (cálculo, actualização, display)

**Epic:** E4 — Streaks & Gamification
**Prioridade:** MUST
**Pontos:** 5
**Fase:** 2 (Semana 7-8)
**Assignee:** @dev
**Status:** [ ] To Do

---

## Descrição

Como **utilizador**, quero ver o meu streak de dias consecutivos de treino actualizado automaticamente quando completo um workout, para que me sinta motivado a manter a consistência e nunca quebrar a sequência.

## Contexto

O streak counter é o pilar central da gamificação da FYVR. A lógica de streaks precisa de ser robusta: calcular dias consecutivos, fazer reset quando o utilizador falha um dia, e guardar o registo do longest streak de sempre. O componente visual deve ter animação para celebrar incrementos, reforçando o comportamento positivo.

A tabela `streaks` já existe no schema (Story 0.2) com campos `current_streak`, `longest_streak`, `total_workouts`, `last_workout_date`, e `streak_started_at`. Esta story implementa a Edge Function que actualiza esses dados e o componente React que os exibe.

**Ref PRD:** Secção 5.1 — Feature F5 (Streak Counter), Secção 4.1 — Pilar Gamificação
**Ref Arquitectura:** Secção 5.1 — Tabela `streaks`, Secção 5.2 — Edge Function `update-streak`

## Acceptance Criteria

- [ ] **AC1:** Edge Function `update-streak` criada no Supabase que:
  - Recebe `user_id` e `workout_id` como parâmetros
  - Busca o registo actual da tabela `streaks` para o utilizador
  - Calcula a diferença entre `last_workout_date` e a data actual
- [ ] **AC2:** Lógica de cálculo do streak implementada:
  - Se `last_workout_date` é ontem → incrementa `current_streak` em 1
  - Se `last_workout_date` é hoje → mantém `current_streak` (já treinou hoje, sem duplicação)
  - Se `last_workout_date` é há 2+ dias → faz reset do `current_streak` para 1 (novo streak)
  - Se `last_workout_date` é `null` (primeiro treino) → define `current_streak` como 1
- [ ] **AC3:** Campo `longest_streak` actualizado automaticamente:
  - Se `current_streak > longest_streak` → actualiza `longest_streak` com o valor actual
  - O longest streak nunca faz reset — é o recorde absoluto do utilizador
- [ ] **AC4:** Campos adicionais actualizados na Edge Function:
  - `total_workouts` incrementado em 1
  - `total_minutes` incrementado com a duração do workout
  - `total_run_km` incrementado com a distância de corrida (se aplicável)
  - `last_workout_date` actualizado para a data actual
  - `streak_started_at` actualizado quando um novo streak começa (reset)
- [ ] **AC5:** Edge Function chamada automaticamente quando um workout é marcado como `completed`:
  - Trigger via chamada da página de workout completion (após Story 3.4)
  - Retorna o objecto streak actualizado na resposta
- [ ] **AC6:** Componente `StreakCounter` criado em `src/components/progress/StreakCounter.tsx`:
  - Mostra o número do streak actual em destaque (tipografia bold, grande)
  - Texto adaptado: "1 dia" (singular) vs "X dias" (plural)
  - Mostra o ícone de fogo/chama ao lado do número
- [ ] **AC7:** Animação de incremento implementada no `StreakCounter`:
  - Quando o streak incrementa, o número faz uma animação de scale-up (pulse)
  - Animação via Framer Motion ou CSS transitions
  - Duração da animação: ~500ms
- [ ] **AC8:** Informação secundária exibida abaixo do streak:
  - "Melhor: X dias" (longest streak)
  - "Total: X treinos" (total_workouts)
- [ ] **AC9:** Hook `useStreak` criado em `src/hooks/useStreak.ts`:
  - Busca dados da tabela `streaks` para o utilizador autenticado
  - Retorna `{ currentStreak, longestStreak, totalWorkouts, isLoading, error }`
  - Suporta optimistic update quando o workout é completado
- [ ] **AC10:** Edge Function lida com edge cases:
  - Utilizador sem registo na tabela `streaks` → cria registo com `current_streak = 1`
  - Dois workouts no mesmo dia → não duplica o streak
  - Timezone do utilizador respeitado (usar `profiles.timezone` para calcular "dia")

## Technical Notes

- Edge Function em Deno (Supabase Edge Functions): `supabase/functions/update-streak/index.ts`
- Usar `date-fns` ou cálculo manual de datas para diferença de dias
- O cálculo de timezone é crítico — um utilizador em `Europe/Lisbon` que treina às 23h e às 01h do dia seguinte deve contar como 2 dias diferentes
- Componente `StreakCounter` será usado tanto na tab "Hoje" como na tab "Progresso"
- Para a animação, considerar `framer-motion` (já na stack) com `animate={{ scale: [1, 1.3, 1] }}`
- RLS: a Edge Function usa `service_role` key para escrever na tabela `streaks`

## Ficheiros a Criar/Modificar

```
supabase/functions/update-streak/index.ts   # Edge Function de actualização do streak
src/components/progress/StreakCounter.tsx    # Componente visual do streak
src/hooks/useStreak.ts                      # Hook para dados do streak
src/types/gamification.ts                   # Tipos TypeScript (Streak, Milestone)
```

## Definition of Done

- [ ] Código commitado no branch `feature/4.1-streak-counter`
- [ ] Edge Function deployed e funcional no Supabase
- [ ] Streak incrementa correctamente ao completar workout
- [ ] Streak faz reset após 1 dia sem treinar
- [ ] Longest streak nunca faz reset
- [ ] Componente StreakCounter renderiza com animação
- [ ] Hook useStreak retorna dados correctamente
- [ ] Edge cases testados (primeiro treino, dois treinos no dia, reset)
- [ ] `npm run build` passa sem erros

## Dependencies

- **Story 3.4** — Workout Completion (trigger para actualizar streak)
- **Story 0.2** — Supabase Setup (tabela `streaks` criada)

## Blocked By

- Story 3.4

## Next Story

→ **Story 4.2** — Milestones & Badges

---

*Story criada por River (SM) — AIOS*
