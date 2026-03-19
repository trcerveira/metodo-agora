# Story 3.3 — Workout Timer + Tracking

**Epic:** E3 — Daily Workout
**Prioridade:** MUST
**Pontos:** 5
**Fase:** 1 (Semana 5-6)
**Assignee:** @dev
**Status:** [ ] To Do

---

## Descrição

Como **utilizador**, quero ter um timer activo durante o treino que acompanhe o meu progresso exercício a exercício, marque exercícios como concluídos, e rastreie o tempo total e distância de corrida, para que possa focar-me no treino sem me preocupar em contar séries ou tempo.

## Contexto

Depois de ver o treino (Story 3.2), o utilizador carrega no CTA para começar. Esta story implementa o **modo treino activo**: timer, tracking de exercícios, transição entre exercícios, e gestão do estado do workout (pending → in_progress → completed).

**Ref PRD:** Secção 4.1 — Core Product (Timer + Tracking)
**Ref Arquitectura:** Secção 4.1 — `components/workout/Timer.tsx`, Secção 5.1 — Tabela `workouts` (campos started_at, completed_at, duration_minutes, status)

## Acceptance Criteria

- [ ] **AC1:** Componente `WorkoutTimer.tsx` em `components/workout/` com:
  - Timer principal que conta o tempo total do treino (formato: MM:SS ou H:MM:SS)
  - Timer inicia quando utilizador carrega no CTA "Iniciar Treino"
  - Timer pausa quando utilizador carrega em "Pausar"
  - Timer continua quando utilizador carrega em "Retomar"
  - Display grande e legível durante exercício (font size 48px+)
  - Visual: fundo escuro, timer em branco/accent, sempre visível no topo do ecrã
- [ ] **AC2:** Componente `ActiveExercise.tsx` em `components/workout/` que mostra o exercício actual:
  - Nome do exercício em destaque
  - Série actual / total (ex: "Série 2 de 3")
  - Reps ou duração da série (ex: "12 reps" ou "30 segundos")
  - Sugestão de peso (ex: "Bodyweight")
  - Botão "Série Concluída" — avança para a próxima série
  - Quando todas as séries estão feitas, botão "Próximo Exercício"
  - Animação de check/confetti quando série é concluída
- [ ] **AC3:** Timer de descanso entre séries:
  - Activa automaticamente após marcar série como concluída
  - Countdown visual (ex: 60s → 59s → ... → 0s)
  - Barra de progresso circular ou linear do descanso
  - Vibração/som (se suportado pelo browser) quando descanso termina
  - Botão "Skip Rest" para avançar o descanso
  - Tempo de descanso vem do `rest_seconds` do exercício
- [ ] **AC4:** Fluxo de progressão automática entre fases:
  ```
  [Warmup] → [Exercício 1] → [Rest] → [Exercício 1 série 2] → [Rest] →
  ... → [Último exercício] → [Running] → [Cooldown] → [Treino Completo]
  ```
  - Progress bar no topo mostrando progresso total (ex: "4/8 exercícios")
  - Auto-advance: quando exercício está completo, mostra "Próximo" com 3s delay
  - Utilizador pode navegar manualmente (avançar/recuar exercício)
- [ ] **AC5:** Secção de corrida activa (`ActiveRunning.tsx`):
  - Timer de corrida dedicado
  - Distância alvo exibida (ex: "Objectivo: 3 km")
  - Para intervalos: timer de intervalo (ex: "Run 3:00 → Walk 1:00")
  - Auto-transição entre segmentos de intervalo
  - Botão "Corrida Concluída" com campo opcional para distância real (input numérico)
  - Campo opcional para pace real (input numérico, formato M:SS/km)
- [ ] **AC6:** Gestão de estado do workout na DB:
  - Ao iniciar treino: `status = 'in_progress'`, `started_at = NOW()`
  - Durante treino: guardar progresso localmente (localStorage) como backup
  - Ao completar: `status = 'completed'`, `completed_at = NOW()`, `duration_minutes` calculado
  - Se utilizador fechar app durante treino: ao reabrir, recuperar estado e perguntar "Continuar treino?"
  - Botão "Desistir do Treino" com confirmação → `status = 'skipped'`
- [ ] **AC7:** Tracking de dados durante o treino:
  - Exercícios concluídos (quais e quantas séries)
  - Tempo total de treino (timer principal)
  - Tempo de corrida (se aplicável)
  - Distância de corrida reportada pelo utilizador (input manual)
  - Pace de corrida (calculado ou manual)
  - Guardar tudo no campo `workout_data` actualizado + campos dedicados da tabela `workouts`
- [ ] **AC8:** Hook `useActiveWorkout` em `hooks/useActiveWorkout.ts`:
  - `startWorkout(workoutId)` — inicia treino, actualiza status na DB
  - `completeSet(exerciseIndex, setIndex)` — marca série como feita
  - `completeExercise(exerciseIndex)` — marca exercício como feito
  - `completeRunning(distance?, pace?)` — marca corrida como feita
  - `pauseWorkout()` / `resumeWorkout()` — pausa/retoma timer
  - `skipWorkout()` — desistir (com confirmação)
  - `completeWorkout()` — finalizar treino (trigger post-workout, Story 3.4)
  - Estado: `currentExercise`, `currentSet`, `phase` (warmup/strength/running/cooldown/complete), `elapsed`, `isRunning`, `isPaused`
- [ ] **AC9:** Persistência local (backup contra perda de dados):
  - Guardar estado do treino activo em `localStorage` a cada mudança de estado
  - Ao abrir a app, verificar se existe treino em progresso guardado
  - Se existir: mostrar modal "Tens um treino em curso. Continuar?"
  - Limpar localStorage quando treino é completado ou saltado
- [ ] **AC10:** UI durante treino activo:
  - Fullscreen-like: esconder bottom navigation durante treino
  - Impedir swipe back / navegação acidental
  - Manter ecrã ligado (Wake Lock API se suportado)
  - Layout: timer no topo, exercício actual no centro, botões de acção em baixo
  ```
  ┌─────────────────────────────┐
  │  ⏱ 12:34         4/8 ████░░│  ← Timer + Progress
  ├─────────────────────────────┤
  │                             │
  │       Push-ups              │  ← Exercício actual
  │       Série 2 de 3          │
  │       12 reps · BW          │
  │                             │
  │  [   SÉRIE CONCLUÍDA ✓  ]  │  ← Acção principal
  │                             │
  │  ◀ Anterior    Próximo ▶   │  ← Navegação manual
  │  [Pausar]    [Desistir]    │
  └─────────────────────────────┘
  ```

## Technical Notes

- Usar `useRef` + `setInterval` para o timer (não `useState` directo — evitar re-renders)
- Wake Lock API: `navigator.wakeLock.request('screen')` — com fallback gracioso
- Vibration API: `navigator.vibrate(200)` — com check de suporte
- O localStorage backup deve incluir: `workoutId`, `currentPhase`, `currentExercise`, `currentSet`, `elapsedSeconds`, `completedExercises[]`, `startedAt`
- Actualizar DB apenas nos momentos-chave (start, complete, skip) — não a cada série (evitar chamadas excessivas)
- Para a secção de running, o utilizador reporta distância manualmente (sem GPS no MVP)
- Usar Framer Motion para transições entre exercícios (slide left/right)

## Definition of Done

- [ ] Código commitado no branch `feature/3.3-workout-timer`
- [ ] Timer principal funcional (start, pause, resume)
- [ ] Timer de descanso com countdown funcional
- [ ] Progressão entre exercícios e fases funcional
- [ ] Secção de corrida activa funcional
- [ ] Estado do workout actualizado na DB (pending → in_progress → completed/skipped)
- [ ] Persistência local funcional (recuperação de treino em progresso)
- [ ] Hook `useActiveWorkout` funcional com todos os métodos
- [ ] Wake Lock funcional (com fallback)
- [ ] UI fullscreen durante treino

## Dependencies

- **Story 3.2** — Workout Display (componentes de exercício para adaptar ao modo activo)

## Blocked By

- Story 3.2

## Next Story

→ **Story 3.4** — Post-Workout Flow (feedback, mood, save)

---

*Story criada por River (SM) — AIOS*
