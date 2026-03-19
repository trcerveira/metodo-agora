# Story 5.4 — Tab "Tribo" — Ecrã completo

**Epic:** E5 — Tribe / Community
**Prioridade:** MUST
**Pontos:** 5
**Fase:** 2 (Semana 8-10)
**Assignee:** @dev
**Status:** [ ] To Do

---

## Descrição

Como **utilizador**, quero ter uma tab "Tribo" completa com o feed, likes, contagem de utilizadores activos, e desafio semanal, para que sinta que faço parte de uma comunidade vibrante e tenha motivos adicionais para treinar.

## Contexto

A tab "Tribo" (`/tribe`) é o terceiro ecrã principal da FYVR e o coração da experiência comunitária. Junta todos os componentes de comunidade numa experiência coesa: o feed com actividade em tempo real, o sistema de likes, um indicador de quantas pessoas estão activas "agora", e o desafio semanal da tribo. Este ecrã transforma a FYVR de uma app de treino individual numa experiência colectiva.

**Ref PRD:** Secção 5.1 — Feature F6 (Feed da Tribo), Secção 4.1 — Pilar Tribo
**Ref Arquitectura:** Secção 4.4 — Tab Tribo (`/tribe`), Secção 5.1 — Tabelas tribe_posts, challenges

## Acceptance Criteria

- [ ] **AC1:** Página `/tribe` criada com layout completo (mobile-first):
  - Header com título "Tribo" e indicador de utilizadores activos
  - Secção de desafio semanal no topo (card destacado)
  - Feed da tribo como conteúdo principal (scroll)
  - Bottom navigation bar com tab "Tribo" activa
- [ ] **AC2:** Indicador "X pessoas a treinar agora" implementado:
  - Mostra quantos utilizadores completaram um workout nas últimas 2 horas
  - Query: `SELECT COUNT(DISTINCT user_id) FROM workouts WHERE completed_at > NOW() - INTERVAL '2 hours'`
  - Actualização via Supabase Realtime (quando novos workouts são completados)
  - Ponto verde pulsante ao lado do número para indicar actividade em tempo real
  - Se 0 pessoas: "Sê o primeiro a treinar hoje!"
- [ ] **AC3:** Card de desafio semanal implementado:
  - Mostra o desafio activo da semana (tabela `challenges`)
  - Título do desafio (ex: "3 treinos esta semana")
  - Barra de progresso do utilizador (ex: "2 de 3 treinos feitos")
  - Número de participantes e quantos completaram
  - Se não há desafio activo → esconder secção
- [ ] **AC4:** Feed da tribo integrado (componente `TribeFeed` da Story 5.1):
  - Feed com posts em tempo real (Supabase Realtime)
  - Likes funcionais (Story 5.3)
  - Infinite scroll para carregar mais posts
  - Pull-to-refresh no mobile
- [ ] **AC5:** Criação de desafio semanal automático:
  - Edge Function ou Cron que cria um desafio novo a cada segunda-feira
  - Desafios pré-definidos (rotação): "3 treinos esta semana", "5 treinos esta semana", "30 min de corrida acumulados", "Treina 2 dias seguidos"
  - Target definido no campo JSONB `target` da tabela `challenges`
  - Datas `starts_at` (segunda) e `ends_at` (domingo 23:59)
- [ ] **AC6:** Participação automática no desafio semanal:
  - Quando um utilizador completa um workout, verificar se há desafio activo
  - Se sim, actualizar `challenge_participants.progress`
  - Se o utilizador atinge o target, marcar `completed_at`
  - Incrementar `challenges.completions_count`
  - Criar post automático no feed: "Completou o desafio: [título]!"
- [ ] **AC7:** Visual do desafio semanal com design apelativo:
  - Card com gradiente ou cor de destaque (diferente dos posts normais)
  - Ícone de troféu ou alvo
  - Barra de progresso animada
  - Quando completo: visual de "concluído" com check verde
- [ ] **AC8:** Estatísticas da tribo visíveis no header:
  - Número total de membros da tribo
  - Treinos completados esta semana pela tribo
  - Query: `SELECT COUNT(*) FROM workouts WHERE status = 'completed' AND date >= (inicio da semana)`
- [ ] **AC9:** Performance e UX optimizados:
  - Skeleton loading durante carregamento inicial
  - Feed virtualizado se necessário (muitos posts)
  - Transições suaves entre secções
  - Layout não salta ao carregar (heights definidos para skeletons)

## Technical Notes

- A página `/tribe` deve compor os componentes já criados nas stories 5.1-5.3
- O indicador de "pessoas a treinar agora" pode usar Supabase Realtime no channel de `workouts` (INSERT com status completed)
- Para os desafios semanais, o cron pode ser um pg_cron no Supabase: `SELECT cron.schedule('create-weekly-challenge', '0 0 * * 1', $$...$$)`
- Alternativa ao cron: criar desafios manualmente via Supabase Dashboard (MVP mais simples)
- A participação no desafio pode ser verificada dentro da Edge Function `update-streak` (pipeline unificado)
- Considerar que Free users vêem o feed em read-only (sem like, sem post) — a implementar na Story 6.3

## Ficheiros a Criar/Modificar

```
src/app/(main)/tribe/page.tsx               # Página principal da Tribo (composição)
src/components/tribe/ActiveUsersIndicator.tsx # Indicador de utilizadores activos
src/components/tribe/WeeklyChallengeCard.tsx  # Card do desafio semanal
src/components/tribe/TribeStats.tsx          # Estatísticas da tribo
src/hooks/useChallenge.ts                    # Hook para dados do desafio semanal
supabase/functions/create-weekly-challenge/index.ts # Edge Function/Cron para criar desafios
```

## Definition of Done

- [ ] Código commitado no branch `feature/5.4-tribe-tab`
- [ ] Tab "Tribo" renderiza com todas as secções (activos, desafio, feed)
- [ ] Indicador de utilizadores activos funciona em tempo real
- [ ] Desafio semanal exibido com progresso do utilizador
- [ ] Progresso do desafio actualiza ao completar workout
- [ ] Feed e likes integrados e funcionais
- [ ] Estatísticas da tribo visíveis
- [ ] Layout responsivo testado em mobile (320px-428px)
- [ ] Loading states e estados vazios implementados
- [ ] `npm run build` passa sem erros

## Dependencies

- **Story 5.1** — Feed da Tribo (componente TribeFeed)
- **Story 5.2** — Auto-post (posts automáticos no feed)
- **Story 5.3** — Likes (sistema de likes nos posts)

## Blocked By

- Story 5.1, Story 5.2, Story 5.3

## Next Story

→ **Story 6.1** — Stripe Checkout integration

---

*Story criada por River (SM) — AIOS*
