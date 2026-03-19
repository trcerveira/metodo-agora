# Story 4.2 — Milestones & Badges

**Epic:** E4 — Streaks & Gamification
**Prioridade:** SHOULD
**Pontos:** 5
**Fase:** 2 (Semana 7-8)
**Assignee:** @dev
**Status:** [ ] To Do

---

## Descrição

Como **utilizador**, quero ganhar badges e milestones quando atinjo marcos importantes no meu treino, para que sinta uma recompensa tangível pelo meu esforço e progresso ao longo do tempo.

## Contexto

Os milestones e badges são o segundo nível da gamificação da FYVR. Enquanto o streak counter reforça o hábito diário, os milestones celebram conquistas de longo prazo — passando a barreira dos 3 meses onde 50% das pessoas desistem. Cada milestone ganho gera uma celebração visual que reforça emocionalmente o comportamento.

A tabela `streaks` já contém campos `milestones` (JSONB array) e `badges` (JSONB array) para guardar as conquistas. Esta story implementa a lógica de triggers, o sistema de verificação, e os componentes visuais.

**Ref PRD:** Secção 5.2 — Feature F13 (Badges & Milestones), Secção 2.1 — Problema #2 (Sem progresso visível)
**Ref Arquitectura:** Secção 5.1 — Tabela `streaks` (campos milestones, badges), Secção 5.2 — Edge Function `update-streak`

## Acceptance Criteria

- [ ] **AC1:** Sistema de milestones definido com os seguintes triggers:
  - `streak_7` — 7 dias consecutivos de treino
  - `streak_30` — 30 dias consecutivos de treino
  - `streak_90` — 90 dias consecutivos de treino (anti-desistência!)
  - `streak_365` — 1 ano de streak
  - `workouts_10` — 10 treinos completados no total
  - `workouts_50` — 50 treinos completados
  - `workouts_100` — 100 treinos completados
  - `first_5k` — primeira corrida de 5km ou mais
  - `first_10k` — primeira corrida de 10km ou mais
  - `total_100km` — 100km de corrida acumulados
- [ ] **AC2:** Lógica de verificação de milestones integrada na Edge Function `update-streak`:
  - Após actualizar o streak, verifica se algum milestone novo foi atingido
  - Compara valores actuais (`current_streak`, `total_workouts`, `total_run_km`) com os thresholds
  - Verifica se o milestone ainda não foi ganho (evita duplicação)
  - Se milestone novo → adiciona ao array `milestones` com `{ type, reached_at }`
- [ ] **AC3:** Sistema de badges implementado com os seguintes badges:
  - `first_workout` — "Primeiro Passo" — completou o primeiro treino
  - `first_week` — "Semana de Fogo" — 7 dias de streak
  - `month_warrior` — "Guerreiro do Mês" — 30 dias de streak
  - `quarter_legend` — "Lenda dos 90 Dias" — 90 dias de streak (top 12%!)
  - `century` — "Centurião" — 100 treinos completados
  - `runner_5k` — "Corredor 5K" — primeira corrida de 5km
  - `distance_100` — "100km Club" — 100km acumulados
- [ ] **AC4:** Cada badge tem metadados definidos:
  - `id` — identificador único (string)
  - `name` — nome em português
  - `description` — descrição curta da conquista
  - `icon` — emoji ou referência a ícone
  - `rarity` — `common`, `rare`, `epic`, `legendary`
- [ ] **AC5:** Componente `BadgeCard` criado em `src/components/progress/BadgeCard.tsx`:
  - Mostra o ícone/emoji do badge
  - Nome do badge em destaque
  - Descrição da conquista
  - Data em que foi ganho
  - Badges não ganhos aparecem em cinzento/bloqueado com progresso (ex: "5/7 dias")
- [ ] **AC6:** Componente `BadgesList` criado em `src/components/progress/BadgesList.tsx`:
  - Lista todos os badges disponíveis em grid (2 colunas mobile)
  - Badges ganhos aparecem primeiro, com cor e destaque
  - Badges por ganhar aparecem em modo locked com barra de progresso
  - Contador: "X de Y badges conquistados"
- [ ] **AC7:** Animação de celebração quando um badge é ganho:
  - Modal/overlay com o badge em grande no centro
  - Animação de entrada: scale de 0 → 1 com bounce
  - Partículas/confetti simples (CSS ou biblioteca leve)
  - Texto de parabéns adaptado ao DISC do utilizador:
    - D: "Dominaste! Badge desbloqueado."
    - I: "Incrível! Olha o que conquistaste!"
    - S: "Consistência premiada. Continua assim."
    - C: "Milestone atingido. Dados confirmam o teu progresso."
  - Botão "Continuar" para fechar o modal
- [ ] **AC8:** Edge Function retorna na resposta quais milestones/badges foram ganhos nesta sessão:
  - Campo `new_milestones: string[]` na resposta
  - Campo `new_badges: string[]` na resposta
  - O frontend usa esta informação para mostrar a animação de celebração
- [ ] **AC9:** Dados de badges acessíveis via hook `useStreak` (ou hook separado `useBadges`):
  - Retorna lista de badges ganhos com datas
  - Retorna lista de badges disponíveis com progresso actual
  - Suporta refetch após completar workout

## Technical Notes

- A lógica de verificação de milestones deve correr na Edge Function `update-streak` (extensão da Story 4.1), não numa função separada — para evitar race conditions
- Os badges são definidos como constante no código (`lib/utils/gamification.ts`), os dados de quem ganhou ficam no JSONB da tabela `streaks`
- Para a animação de confetti, considerar `canvas-confetti` (~3KB) ou CSS puro
- Os textos adaptados ao DISC usam `profiles.disc_profile` para seleccionar a mensagem
- Rarity dos badges pode ser usada futuramente para leaderboards e perfil social

## Ficheiros a Criar/Modificar

```
supabase/functions/update-streak/index.ts   # Modificar — adicionar verificação de milestones
src/components/progress/BadgeCard.tsx       # Componente de badge individual
src/components/progress/BadgesList.tsx      # Lista/grid de badges
src/components/progress/CelebrationModal.tsx # Modal de celebração com animação
src/lib/utils/gamification.ts              # Definição de badges, milestones, thresholds
src/types/gamification.ts                  # Modificar — adicionar tipos Badge, Milestone
```

## Definition of Done

- [ ] Código commitado no branch `feature/4.2-milestones-badges`
- [ ] Milestones verificados correctamente após cada workout
- [ ] Badges ganhos guardados na tabela `streaks` (campo JSONB)
- [ ] Componente BadgesList mostra badges ganhos vs por ganhar
- [ ] Animação de celebração aparece ao ganhar novo badge
- [ ] Texto de celebração adaptado ao perfil DISC
- [ ] Sem duplicação de badges (ganhar o mesmo badge duas vezes)
- [ ] `npm run build` passa sem erros

## Dependencies

- **Story 4.1** — Streak Counter (Edge Function base, tabela streaks)
- **Story 0.2** — Supabase Setup (tabela streaks com campos milestones/badges)

## Blocked By

- Story 4.1

## Next Story

→ **Story 4.3** — Tab "Progresso" (charts + metrics)

---

*Story criada por River (SM) — AIOS*
