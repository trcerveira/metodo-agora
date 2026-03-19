# Story 3.5 — Tab "Hoje" — Ecrã Principal Completo

**Epic:** E3 — Daily Workout
**Prioridade:** MUST
**Pontos:** 5
**Fase:** 1 (Semana 6)
**Assignee:** @dev
**Status:** [ ] To Do

---

## Descrição

Como **utilizador**, quero que o tab "Hoje" seja o meu ecrã principal completo — ao abrir a FYVR, vejo a minha streak, uma saudação personalizada, o treino do dia, e um resumo da actividade da tribo — tudo num fluxo contínuo que me leva do check-in ao treino ao resultado, para que a minha experiência diária seja simples, motivante e sem fricção.

## Contexto

Esta é a story de integração do Epic E3. Combina todos os componentes das Stories 3.1-3.4 (geração, display, timer, post-workout) com o check-in diário (Story 2.3) e a saudação MaaS (Story 2.1) num único ecrã coeso. O tab "Hoje" é o coração da FYVR — a primeira coisa que o utilizador vê. Deve seguir o princípio MaaS de "1 ecrã = 1 acção" e guiar o utilizador naturalmente pelo ciclo diário.

**Ref PRD:** Secção 5.1 — F1 (Treino Diário), F4 (Check-in), F5 (Streak)
**Ref Arquitectura:** Secção 4.1 — `app/(main)/today/page.tsx`, Secção 4.4 — Tab "Hoje", Secção 8.2 — Daily Loop

## Acceptance Criteria

- [ ] **AC1:** Página `app/(main)/today/page.tsx` implementada como Server Component com:
  - Fetch do perfil do utilizador (DISC, nível, nome)
  - Fetch do streak actual
  - Fetch do workout de hoje (se existir)
  - Fetch do número de membros da tribo que treinaram hoje
  - Pass de dados para Client Components via props
- [ ] **AC2:** Fluxo completo do dia integrado na página:
  ```
  Estado 1: SEM CHECK-IN (primeira visita do dia)
  → Mostra: saudação MaaS + streak + check-in mood
  → Acção: utilizador faz check-in (mood 1-5)

  Estado 2: CHECK-IN FEITO, SEM TREINO
  → Mostra: greeting + streak + loading/generating workout
  → Acção: sistema gera treino automaticamente após check-in

  Estado 3: TREINO GERADO (PENDING)
  → Mostra: greeting + streak + WorkoutCard completo + tribo count
  → Acção: utilizador carrega CTA para iniciar

  Estado 4: TREINO EM PROGRESSO
  → Mostra: timer + exercício activo (fullscreen mode)
  → Acção: utilizador treina (Story 3.3)

  Estado 5: TREINO CONCLUÍDO
  → Mostra: post-workout flow (Story 3.4)
  → Acção: utilizador dá feedback

  Estado 6: TUDO COMPLETO
  → Mostra: resumo do dia + streak actualizado + "Até amanhã!"
  → Mensagem DISC-adapted de encerramento
  ```
- [ ] **AC3:** Secção de header com streak e saudação:
  - Streak counter com animação (ícone de fogo + número)
  - Se streak > 0: "Streak: X dias" com cor `fyvr-success`
  - Se streak = 0: "Começa a tua streak hoje!" com cor `fyvr-accent`
  - Saudação contextual:
    - Manhã (6-12h): "Bom dia"
    - Tarde (12-18h): "Boa tarde"
    - Noite (18-24h): "Boa noite"
  - Nome do utilizador: "Bom dia, {display_name}"
  - Saudação MaaS personalizada (greeting do Claude) abaixo do nome
- [ ] **AC4:** Secção de check-in diário integrada:
  - Se utilizador ainda não fez check-in hoje → mostrar `MoodSelector` (da Story 2.3)
  - Após seleccionar mood → iniciar geração do treino (loading state)
  - Se utilizador já fez check-in → mostrar o treino directamente
  - Check-in guardado em `workouts.pre_mood`
- [ ] **AC5:** Secção do treino do dia:
  - Renderizar `WorkoutCard` completo (Story 3.2) quando treino está gerado
  - Mostrar estado de loading enquanto treino é gerado (skeleton + mensagem "A criar o teu treino...")
  - Se geração falhar: mostrar erro + botão "Tentar outra vez"
  - Se treino já foi concluído hoje: mostrar resumo em vez do card de treino
- [ ] **AC6:** Secção de actividade da tribo (mini-preview):
  - Mostrar contagem: "X membros da tribo já treinaram hoje"
  - Se X > 0: ícone de grupo + número, cor `fyvr-accent`
  - Se X = 0: "Sê o primeiro a treinar hoje!"
  - Tap leva para o tab "Tribo"
  - Query: `SELECT COUNT(DISTINCT user_id) FROM workouts WHERE date = TODAY AND status = 'completed'`
- [ ] **AC7:** Estado "Tudo Completo" (post-workout terminado):
  - Mostrar mensagem de encerramento DISC-adapted:
    - D: "Treino feito. Amanhã, mais forte."
    - I: "Dia incrível! Partilha com a tribo!"
    - S: "Mais um dia consistente. Descansa bem."
    - C: "Dados do dia registados. Análise disponível em Progresso."
  - Mostrar resumo compacto: duração + exercícios + distância + streak
  - Streak actualizado com animação de incremento
  - CTA secundário: "Ver Progresso" ou "Ver Tribo"
  - Visual: tom de "missão cumprida", cores suaves, sem urgência
- [ ] **AC8:** Pull-to-refresh:
  - Swipe down para refrescar dados (streak, workout, tribo count)
  - Loading indicator durante refresh
  - Útil se utilizador suspeita que dados não estão actualizados
- [ ] **AC9:** Layout completo do tab "Hoje":
  ```
  ┌─────────────────────────────────┐
  │  FYVR                   🔥 12   │  ← Logo + Streak
  ├─────────────────────────────────┤
  │                                  │
  │  Bom dia, Miguel!               │  ← Saudação + Nome
  │  "Hoje é dia de atacar. Sem     │  ← MaaS greeting (DISC)
  │   desculpas, sem limites."      │
  │                                  │
  ├─────────────────────────────────┤
  │  😊 Como te sentes hoje?        │  ← Check-in (se pendente)
  │  [1] [2] [3] [4] [5]           │
  ├─────────────────────────────────┤
  │                                  │
  │  ┌──────────────────────────┐   │
  │  │   WORKOUT DO DIA         │   │  ← WorkoutCard (Story 3.2)
  │  │   Hybrid · Nível 3       │   │
  │  │   ⏱ 45 min · 6 ex · 3km │   │
  │  │                          │   │
  │  │   💪 Força: 6 exercícios │   │
  │  │   🏃 Corrida: 3 km      │   │
  │  │                          │   │
  │  │   [    DOMINA 💥    ]    │   │  ← CTA DISC
  │  └──────────────────────────┘   │
  │                                  │
  ├─────────────────────────────────┤
  │  👥 8 membros treinaram hoje    │  ← Tribo preview
  ├─────────────────────────────────┤
  │  📅 Hoje  📊 Prog  👥 Tribo 👤 │  ← Bottom Nav
  └─────────────────────────────────┘
  ```
- [ ] **AC10:** Transições entre estados:
  - Check-in → Geração: fade out mood selector, skeleton in
  - Geração → Workout: slide up WorkoutCard com Framer Motion
  - Iniciar treino → Timer: fullscreen transition (expand from card)
  - Completar treino → Post-workout: slide in from right
  - Post-workout → Completo: fade transition
  - Todas as transições com Framer Motion AnimatePresence
- [ ] **AC11:** Performance e UX:
  - Tempo de carregamento da página < 2 segundos
  - Geração do treino: mostrar loading state com mensagem motivacional
  - Se treino já existe para hoje (cached), mostrar imediatamente sem loading
  - Se utilizador volta ao tab "Hoje" depois de navegar: manter estado (não refetch)
  - Scroll suave em toda a página

## Technical Notes

- `today/page.tsx` deve ser um Server Component que faz o fetch inicial
- Componentes interactivos (check-in, workout card, timer) devem ser Client Components importados
- Usar `useWorkout` hook (Story 3.1) para geração e fetch do treino
- Usar `useActiveWorkout` hook (Story 3.3) para o modo treino activo
- Usar `usePostWorkout` hook (Story 3.4) para o post-workout flow
- Usar `useStreak` hook para fetch e display da streak
- O estado do fluxo diário (qual passo o utilizador está) pode ser gerido com `useState` ou `useReducer`
- Para o tribo count: query simples ao Supabase, pode ser feita no Server Component
- Pull-to-refresh: implementar com `onTouchStart`/`onTouchMove` ou biblioteca como `react-pull-to-refresh`
- A saudação contextual (manhã/tarde/noite) deve usar a timezone do perfil do utilizador

## Definition of Done

- [ ] Código commitado no branch `feature/3.5-today-tab`
- [ ] Página `today/page.tsx` implementada com todos os 6 estados do fluxo
- [ ] Header com streak e saudação funcional
- [ ] Check-in integrado (trigger de geração de treino)
- [ ] WorkoutCard renderiza correctamente dentro do tab
- [ ] Transição para modo treino activo funcional
- [ ] Post-workout flow integrado
- [ ] Estado "Tudo Completo" com resumo e mensagem DISC
- [ ] Secção de tribo com contagem real
- [ ] Pull-to-refresh funcional
- [ ] Transições entre estados suaves com Framer Motion
- [ ] Performance: carregamento < 2 segundos
- [ ] Responsivo em 375px-428px

## Dependencies

- **Story 3.1** — Workout Generation (geração do treino)
- **Story 3.2** — Workout Display (componentes visuais do treino)
- **Story 3.3** — Workout Timer (modo treino activo)
- **Story 3.4** — Post-Workout Flow (feedback e save)
- **Story 2.3** — Daily Check-in (mood selector e state adjustment)

## Blocked By

- Stories 3.1, 3.2, 3.3, 3.4, 2.3

## Next Story

→ **Story 4.1** — Streak Counter (Epic E4 — Streaks & Gamification)

---

*Story criada por River (SM) — AIOS*
