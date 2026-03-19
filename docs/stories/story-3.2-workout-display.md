# Story 3.2 — Workout Display (Exercícios, Séries, Reps, Duração)

**Epic:** E3 — Daily Workout
**Prioridade:** MUST
**Pontos:** 5
**Fase:** 1 (Semana 5)
**Assignee:** @dev
**Status:** [ ] To Do

---

## Descrição

Como **utilizador**, quero ver o meu treino diário apresentado de forma clara e visualmente apelativa, com a lista de exercícios (séries, reps, peso), secção de corrida (distância, pace), e mensagem personalizada, para que saiba exactamente o que fazer quando começo a treinar.

## Contexto

O treino é gerado pela Story 3.1 (Edge Function + Claude API). Esta story foca-se em **apresentar** o treino no ecrã, usando o Design System da FYVR (Story 0.3) e adaptando a apresentação ao perfil DISC do utilizador. A UI deve ser mobile-first, com o princípio MaaS de "1 ecrã = 1 acção" — simples, sem ruído.

**Ref PRD:** Secção 4.2 — MaaS (Minimizar Ruído Lc_i + Lc_e), Secção 4.3 — DISC UI Focus
**Ref Arquitectura:** Secção 4.1 — `components/workout/`, Secção 4.3 — DISC-Adaptive UI

## Acceptance Criteria

- [ ] **AC1:** Componente `WorkoutCard.tsx` em `components/workout/` que mostra:
  - Saudação MaaS personalizada (greeting do Claude)
  - Tipo de treino (Hybrid / Run / Strength / Recovery)
  - Duração estimada total (ex: "45 min")
  - Nível do treino (ex: "Nível 3")
  - Número total de exercícios de força
  - Distância de corrida (ex: "3.5 km")
  - Botão CTA adaptado ao DISC para iniciar treino
  - Visual: card escuro (`fyvr-dark`), border subtle, accent cor DISC
- [ ] **AC2:** Componente `ExerciseItem.tsx` em `components/workout/` que mostra cada exercício:
  - Nome do exercício (ex: "Push-ups")
  - Grupo muscular (ex: "Peito")
  - Séries × Reps (ex: "3 × 12") ou duração (ex: "3 × 30s" para isométricos)
  - Sugestão de peso quando aplicável (ex: "Bodyweight", "Light dumbbell")
  - Tempo de descanso (ex: "60s rest")
  - Notas opcionais (ex: "Manter core contraído")
  - Checkbox/indicador visual para marcar como completo (estado visual, tracking na Story 3.3)
  - Visual: compacto, fácil de ler durante treino, font size legível
- [ ] **AC3:** Componente `RunningSection.tsx` em `components/workout/` que mostra secção de corrida:
  - Tipo de corrida (ex: "Easy Run", "Intervals", "Tempo Run")
  - Distância alvo (ex: "3.5 km")
  - Duração estimada (ex: "25 min")
  - Pace target quando aplicável (ex: "6:00/km")
  - Para intervalos: lista de segmentos (ex: "Run 3 min → Walk 1 min × 5")
  - Ícone de corrida/running
  - Visual: secção distinta da força, com cor accent
- [ ] **AC4:** Componente `WarmupCooldown.tsx` em `components/workout/` que mostra:
  - Secção de aquecimento (warmup): duração + lista de exercícios
  - Secção de alongamentos (cooldown): duração + lista de exercícios
  - Visual: collapsible/accordion — expandido por defeito no warmup, colapsado no cooldown
  - Texto mais subtil que a secção principal (cor `fyvr-muted`)
- [ ] **AC5:** Layout completo do WorkoutCard com secções ordenadas:
  ```
  ┌─────────────────────────────────┐
  │  "Bom dia, guerreiro! 🔥"       │  ← MaaS greeting (DISC)
  │  Hybrid Workout · Nível 3       │
  │  ⏱ 45 min · 6 exercícios · 3km  │  ← Resumo
  ├─────────────────────────────────┤
  │  🔥 AQUECIMENTO (5 min)          │  ← Warmup (collapsible)
  │  · Arm circles · Leg swings...   │
  ├─────────────────────────────────┤
  │  💪 FORÇA                        │  ← Exercícios de força
  │  ┌───────────────────────┐       │
  │  │ Push-ups               │      │
  │  │ Peito · 3×12 · BW     │      │
  │  │ Rest: 60s              │      │
  │  └───────────────────────┘       │
  │  ┌───────────────────────┐       │
  │  │ Goblet Squats          │      │
  │  │ Pernas · 3×10 · DB    │      │
  │  │ Rest: 90s              │      │
  │  └───────────────────────┘       │
  │  ... (mais exercícios)           │
  ├─────────────────────────────────┤
  │  🏃 CORRIDA                      │  ← Running section
  │  Easy Run · 3 km · ~20 min      │
  │  Pace: 6:30/km                   │
  ├─────────────────────────────────┤
  │  🧘 COOLDOWN (5 min)             │  ← Cooldown (collapsible)
  │  · Hamstring stretch · ...       │
  ├─────────────────────────────────┤
  │                                  │
  │  [      DOMINA 💥      ]         │  ← CTA DISC-adaptive
  │                                  │
  └─────────────────────────────────┘
  ```
- [ ] **AC6:** Adaptação DISC na apresentação:
  - **D (Dominância):** CTA "DOMINA", cor vermelha, mostrar "Supera o teu último treino", foco em performance
  - **I (Influência):** CTA "BORA COM TUDO", cor amarela, mostrar "X amigos já treinaram hoje", tom entusiasta
  - **S (Estabilidade):** CTA "CONTINUAR", cor verde, mostrar "Mais um passo na tua jornada", tom calmo
  - **C (Conformidade):** CTA "INICIAR PROTOCOLO", cor azul, mostrar tempo estimado exacto + calorias estimadas, tom analítico
- [ ] **AC7:** Estado vazio: quando não há treino gerado para hoje:
  - Mostrar mensagem: "O teu treino de hoje está quase pronto"
  - Botão para gerar treino (trigger check-in → geração)
  - Skeleton/loading state enquanto gera
- [ ] **AC8:** Animações com Framer Motion:
  - Entrada do WorkoutCard: slide up + fade in
  - Cada ExerciseItem: stagger animation (aparecem um a um)
  - CTA button: pulse animation subtil
  - Collapsible warmup/cooldown: smooth height transition
- [ ] **AC9:** Responsivo:
  - Mobile-first (375px-428px)
  - ScrollView vertical para treinos longos
  - Exercícios empilhados verticalmente (sem grid)
  - CTA button sempre visível (sticky bottom ou dentro do scroll)

## Technical Notes

- Usar dados do `workout_data` JSONB retornado pela Edge Function (Story 3.1)
- Componentes recebem `discProfile` prop para adaptação visual
- `ExerciseItem` deve ter prop `onComplete` (preparar para Story 3.3 — timer/tracking)
- Usar Tailwind classes do Design System (Story 0.3): `fyvr-dark`, `fyvr-text`, `disc-d`, etc.
- Para o collapsible, usar Framer Motion `AnimatePresence` + `motion.div` com height auto
- Dados de exercícios em Inglês; labels da UI em Português
- Instalar `framer-motion` se ainda não estiver instalado

## Definition of Done

- [ ] Código commitado no branch `feature/3.2-workout-display`
- [ ] WorkoutCard renderiza treino completo com todas as secções
- [ ] ExerciseItem mostra todos os detalhes de cada exercício
- [ ] RunningSection mostra target de corrida e intervalos
- [ ] WarmupCooldown funciona em modo collapsible
- [ ] Adaptação DISC funcional (4 variantes visuais)
- [ ] Estado vazio e loading tratados
- [ ] Animações funcionais
- [ ] Responsivo em 375px-428px

## Dependencies

- **Story 0.3** — Design System (componentes base, cores, tipografia)
- **Story 3.1** — Workout Generation (dados do treino para renderizar)

## Blocked By

- Story 0.3, Story 3.1

## Next Story

→ **Story 3.3** — Workout Timer + Tracking

---

*Story criada por River (SM) — AIOS*
