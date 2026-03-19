# Story 5.2 — Auto-post ao completar treino

**Epic:** E5 — Tribe / Community
**Prioridade:** MUST
**Pontos:** 3
**Fase:** 2 (Semana 8-10)
**Assignee:** @dev
**Status:** [ ] To Do

---

## Descrição

Como **utilizador**, quero que a minha actividade de treino seja automaticamente partilhada no feed da tribo quando completo um workout, para que a comunidade veja que estou activo e eu contribua para a energia colectiva — com opção de desactivar se preferir privacidade.

## Contexto

O auto-post é a mecânica que alimenta o feed da tribo com conteúdo orgânico. Sem ele, o feed ficaria vazio e a comunidade morreria. Quando um utilizador completa um treino, a Edge Function `create-tribe-post` cria automaticamente um post no feed com informações do treino. Isto cria accountability social passiva — o utilizador sabe que a tribo vai ver se ele treinou ou não.

**Ref PRD:** Secção 4.1 — Pilar Tribo (accountability), Secção 5.1 — Feature F6 (Feed da Tribo)
**Ref Arquitectura:** Secção 5.2 — Edge Function `create-tribe-post`, Secção 5.1 — Tabela `tribe_posts`

## Acceptance Criteria

- [ ] **AC1:** Edge Function `create-tribe-post` criada no Supabase:
  - Chamada automaticamente após o workout ser marcado como `completed`
  - Recebe `user_id` e `workout_id` como parâmetros
  - Busca dados do workout da tabela `workouts` (tipo, duração, distância)
  - Busca dados do streak da tabela `streaks` (current_streak)
- [ ] **AC2:** Post criado automaticamente na tabela `tribe_posts` com:
  - `type`: `'workout_complete'`
  - `user_id`: ID do utilizador
  - `content`: texto gerado automaticamente (ex: "Completou um treino híbrido de 45 min")
  - `metadata` (JSONB):
    - `workout_id`: referência ao workout
    - `workout_type`: 'hybrid', 'run', 'strength', ou 'recovery'
    - `duration_minutes`: duração do treino
    - `run_distance_km`: distância de corrida (se aplicável, senão null)
    - `current_streak`: streak actual do utilizador
- [ ] **AC3:** Texto do post gerado com base no tipo de treino:
  - Hybrid: "Completou um treino híbrido de X min"
  - Run: "Correu X km em Y min"
  - Strength: "Completou treino de força de X min"
  - Recovery: "Fez sessão de recuperação de X min"
  - Se streak > 1: adiciona " — X dias seguidos!" ao final do texto
- [ ] **AC4:** Post de milestone criado automaticamente quando um badge é ganho:
  - `type`: `'milestone'`
  - `content`: "Atingiu o milestone: [nome do badge]!"
  - `metadata`: `{ badge_id, badge_name, badge_rarity }`
  - Integração com a lógica de milestones da Story 4.2
- [ ] **AC5:** Utilizador pode desactivar auto-posting:
  - Toggle nas definições do perfil (`/profile`): "Partilhar actividade na tribo"
  - Default: activado (opt-out, não opt-in)
  - Preferência guardada na tabela `profiles` (campo `auto_post_enabled BOOLEAN DEFAULT true`)
  - Edge Function verifica esta preferência antes de criar o post
- [ ] **AC6:** Edge Function impede duplicação:
  - Verifica se já existe um post `workout_complete` para o mesmo `workout_id`
  - Se já existe, não cria novo post (idempotente)
- [ ] **AC7:** Post aparece no feed em tempo real (via Realtime da Story 5.1):
  - Após criação do post pela Edge Function, o Supabase Realtime notifica todos os clientes
  - O post aparece no feed de todos os utilizadores instantaneamente

## Technical Notes

- A Edge Function `create-tribe-post` pode ser chamada a partir da Edge Function `update-streak` (Story 4.1) para centralizar o fluxo pós-workout, ou como chamada separada do frontend
- Decisão recomendada: chamar `create-tribe-post` dentro de `update-streak` (pipeline: workout complete → update streak → check milestones → create post)
- Para o campo `auto_post_enabled`, adicionar ao schema: `ALTER TABLE profiles ADD COLUMN auto_post_enabled BOOLEAN DEFAULT true`
- O texto do post é simples e directo — não usa Claude API (seria demasiado caro para cada workout de cada utilizador)
- Posts automáticos devem ter um limite razoável — máximo 1 post de workout por dia por utilizador para não spammar o feed

## Ficheiros a Criar/Modificar

```
supabase/functions/create-tribe-post/index.ts  # Edge Function de auto-post
supabase/functions/update-streak/index.ts      # Modificar — chamar create-tribe-post
src/components/profile/PrivacySettings.tsx     # Toggle de auto-posting
src/app/(main)/profile/page.tsx               # Modificar — adicionar toggle
```

## Definition of Done

- [ ] Código commitado no branch `feature/5.2-auto-post`
- [ ] Post criado automaticamente ao completar workout
- [ ] Texto do post correcto para cada tipo de treino
- [ ] Streak incluído no post quando > 1
- [ ] Post de milestone criado quando badge é ganho
- [ ] Toggle de opt-out funcional nas definições
- [ ] Sem duplicação de posts para o mesmo workout
- [ ] Post aparece no feed em tempo real
- [ ] `npm run build` passa sem erros

## Dependencies

- **Story 5.1** — Feed da Tribo (tabela, feed component, Realtime)
- **Story 3.4** — Workout Completion (trigger para auto-post)

## Blocked By

- Story 5.1, Story 3.4

## Next Story

→ **Story 5.3** — Likes system

---

*Story criada por River (SM) — AIOS*
