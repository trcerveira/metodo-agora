# Story 3.4 — Post-Workout Flow (Feedback, Mood, Save)

**Epic:** E3 — Daily Workout
**Prioridade:** MUST
**Pontos:** 3
**Fase:** 1 (Semana 6)
**Assignee:** @dev
**Status:** [ ] To Do

---

## Descrição

Como **utilizador**, quero que ao terminar o treino a app me peça feedback rápido (como me sinto e se foi fácil/ideal/difícil), me dê uma mensagem de parabéns personalizada, e guarde todos os dados, para que o meu progresso fique registado e os próximos treinos sejam ainda mais adaptados.

## Contexto

Este é o passo final do ciclo de treino diário. Depois do timer (Story 3.3), o utilizador conclui e entra no post-workout flow. Os dados recolhidos aqui (`post_mood`, `post_difficulty`) alimentam o algoritmo de ajuste da Story 3.1 para os próximos treinos. A mensagem de parabéns é adaptada ao perfil DISC via MaaS Engine (Story 2.1).

**Ref PRD:** Secção 5.1 — F4 (Check-in), F5 (Streak Counter)
**Ref Arquitectura:** Secção 5.1 — Tabela `workouts` (post_mood, post_difficulty, completed_at), Secção 5.2 — Edge Functions (update-streak, create-tribe-post), Secção 8.2 — Daily Loop

## Acceptance Criteria

- [ ] **AC1:** Ecrã de Post-Workout com fluxo sequencial:
  ```
  Passo 1: Mensagem de parabéns (DISC-adapted)
  Passo 2: Post-mood selector (1-5)
  Passo 3: Dificuldade percebida (easy/ideal/hard)
  Passo 4: Resumo do treino + CTA final
  ```
  - Transição suave entre passos (slide ou fade)
  - Máximo 15 segundos para completar todo o flow (rápido, sem fricção)
- [ ] **AC2:** Passo 1 — Mensagem de parabéns DISC-adapted:
  - **D (Dominância):** "Treino destruído. Mais uma vitória." — tom directo, foco em conquista
  - **I (Influência):** "ARRASASTE! A tribo vai adorar saber!" — tom entusiasta, foco em partilha
  - **S (Estabilidade):** "Mais um dia. Cada treino conta. Orgulho." — tom gentil, foco em consistência
  - **C (Conformidade):** "Treino concluído. Dados registados. Progresso actualizado." — tom analítico, foco em dados
  - Mensagem gerada pelo MaaS Engine (campo `motivation` do workout) ou template local como fallback
  - Animação celebratória: confetti subtil ou pulse animation no ecrã
- [ ] **AC3:** Passo 2 — `PostMoodSelector.tsx` em `components/workout/`:
  - Pergunta: "Como te sentes agora?" (post-treino)
  - Selector de 1 a 5 (mesmo estilo do MoodSelector da Story 0.3/2.3):
    ```
    1 = Exausto/Mal
    2 = Cansado
    3 = Normal
    4 = Bem
    5 = Fantástico/Energizado
    ```
  - Representação visual: emojis ou ícones expressivos
  - Tap para seleccionar → auto-avança para próximo passo (delay 500ms)
  - Guardar em `workouts.post_mood`
- [ ] **AC4:** Passo 3 — `DifficultySelector.tsx` em `components/workout/`:
  - Pergunta: "Como foi o treino?"
  - 3 opções com ícones:
    ```
    😴 Fácil — "Podia ter feito mais"
    ✅ Ideal — "Na medida certa"
    🔥 Difícil — "Foi puxado"
    ```
  - Tap para seleccionar → auto-avança
  - Guardar em `workouts.post_difficulty`
  - Este dado influencia o próximo treino (Story 3.1 — AC6: ajuste por histórico)
- [ ] **AC5:** Passo 4 — Resumo do treino (`WorkoutSummary.tsx`):
  - Tempo total (ex: "42 min")
  - Exercícios completados (ex: "6/6 exercícios")
  - Distância de corrida (ex: "3.2 km")
  - Streak actual actualizado (ex: "Streak: 12 dias")
  - Calorias estimadas (cálculo simples: ~8 cal/min força + ~10 cal/min corrida)
  - Botão CTA DISC-adapted:
    - D: "VER RANKING" → vai para progresso
    - I: "PARTILHAR NA TRIBO" → vai para feed
    - S: "VER PROGRESSO" → vai para progresso
    - C: "VER DADOS COMPLETOS" → vai para progresso
  - Botão secundário: "Voltar ao Início" → vai para tab Hoje
- [ ] **AC6:** Guardar dados completos na DB ao finalizar post-workout:
  - Actualizar registo na tabela `workouts`:
    - `post_mood` — valor seleccionado (1-5)
    - `post_difficulty` — valor seleccionado (easy/ideal/hard)
    - `completed_at` — timestamp de conclusão
    - `duration_minutes` — tempo total em minutos
    - `run_distance_km` — distância reportada
    - `run_pace_min_km` — pace calculado ou reportado
    - `calories_estimated` — calorias estimadas
  - Tudo numa única chamada DB (upsert/update)
- [ ] **AC7:** Trigger de actualização de streak via Edge Function `update-streak`:
  - Chamar Edge Function após save do workout completo
  - Edge Function deve:
    - Verificar se `last_workout_date` é ontem ou hoje
    - Se ontem → `current_streak += 1`
    - Se hoje (já treinou) → manter streak (não duplicar)
    - Se mais de 1 dia → `current_streak = 1` (reset)
    - Actualizar `longest_streak` se `current_streak > longest_streak`
    - Actualizar `total_workouts += 1`
    - Actualizar `total_minutes += duration_minutes`
    - Actualizar `total_run_km += run_distance_km`
    - Actualizar `last_workout_date = TODAY`
  - Retornar streak actualizado para mostrar no resumo
- [ ] **AC8:** Auto-post na tribo (preparação para Story 5.2):
  - Após workout completo, criar registo na tabela `tribe_posts`:
    - `type: 'workout_complete'`
    - `content: "{display_name} completou um treino híbrido de {duration} min"`
    - `metadata: { workout_id, duration_minutes, run_distance_km, streak }`
  - Pode ser feito via Edge Function `create-tribe-post` ou directamente do frontend
- [ ] **AC9:** Hook `usePostWorkout` em `hooks/usePostWorkout.ts`:
  - `submitFeedback(workoutId, postMood, difficulty)` — guarda feedback + trigger streak + tribe post
  - Estado: `step` (1-4), `isSaving`, `savedSuccessfully`, `updatedStreak`
  - Método `nextStep()` / `previousStep()` para navegação entre passos
  - Validação: não permite avançar sem seleccionar mood e difficulty

## Technical Notes

- O flow de 4 passos deve ser rápido — utilizador não deve sentir que está a preencher um formulário
- Usar Framer Motion para transições entre passos (slide left com AnimatePresence)
- Mensagem de parabéns: usar o campo `motivation` do `maas_message` gerado na Story 3.1
- Se `motivation` não existir, usar template local baseado no DISC profile
- O cálculo de calorias é uma estimativa simples (não precisa de ser preciso no MVP)
- A Edge Function `update-streak` deve ser idempotente (chamar 2x no mesmo dia não duplica)
- O auto-post na tribo é silencioso — utilizador não precisa de confirmar

## Definition of Done

- [ ] Código commitado no branch `feature/3.4-post-workout`
- [ ] Flow de 4 passos funcional com transições suaves
- [ ] Mensagem de parabéns adaptada aos 4 perfis DISC
- [ ] PostMoodSelector funcional (1-5)
- [ ] DifficultySelector funcional (easy/ideal/hard)
- [ ] WorkoutSummary mostra dados correctos do treino
- [ ] Dados guardados na DB (workout update)
- [ ] Edge Function `update-streak` funcional e idempotente
- [ ] Auto-post na tribo funcional
- [ ] Hook `usePostWorkout` funcional

## Dependencies

- **Story 3.3** — Workout Timer (dados de completion para processar)
- **Story 2.1** — MaaS Engine (mensagens DISC para parabéns)

## Blocked By

- Story 3.3, Story 2.1

## Next Story

→ **Story 3.5** — Tab "Hoje" — Ecrã principal completo

---

*Story criada por River (SM) — AIOS*
