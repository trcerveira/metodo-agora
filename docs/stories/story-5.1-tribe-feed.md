# Story 5.1 — Feed da Tribo

**Epic:** E5 — Tribe / Community
**Prioridade:** MUST
**Pontos:** 5
**Fase:** 2 (Semana 8-10)
**Assignee:** @dev
**Status:** [ ] To Do

---

## Descrição

Como **utilizador**, quero ver um feed em tempo real com a actividade da tribo FYVR — treinos completados, milestones atingidos, e desafios concluídos — para que sinta que faço parte de uma comunidade e nunca treine sozinho.

## Contexto

A tribo é o pilar anti-desistência mais poderoso da FYVR. O feed mostra que outras pessoas estão a treinar, criando accountability social passiva — o utilizador sente-se parte de algo maior. O Supabase Realtime permite que novos posts apareçam no feed sem refresh, criando uma experiência viva e dinâmica.

A tabela `tribe_posts` já existe no schema (Story 0.2) com campos `type` (workout_complete, milestone, challenge_complete, message), `content`, `metadata`, e `likes_count`. O RLS permite que todos leiam os posts mas só o próprio utilizador crie os seus.

**Ref PRD:** Secção 5.1 — Feature F6 (Feed da Tribo), Secção 4.1 — Pilar Tribo
**Ref Arquitectura:** Secção 5.1 — Tabelas `tribe_posts` e `tribe_likes`, Secção 3.1 — Supabase Realtime

## Acceptance Criteria

- [ ] **AC1:** Query ao Supabase para listar posts da tribo:
  - Busca os últimos 20 posts da tabela `tribe_posts` ordenados por `created_at DESC`
  - Join com `profiles` para obter `display_name` e `avatar_url` do autor
  - Paginação: carregar mais 20 posts ao fazer scroll down (infinite scroll)
  - Inclui informação de likes (se o utilizador actual deu like)
- [ ] **AC2:** Supabase Realtime configurado para a tabela `tribe_posts`:
  - Subscrição ao channel de `INSERT` na tabela `tribe_posts`
  - Novos posts aparecem automaticamente no topo do feed sem refresh
  - Animação suave de entrada para novos posts (slide-in de cima)
  - Unsubscribe ao sair da página (cleanup no useEffect)
- [ ] **AC3:** Componente `FeedPost` criado em `src/components/tribe/FeedPost.tsx`:
  - Avatar do utilizador (ou iniciais se sem avatar)
  - Nome do utilizador
  - Tipo de actividade com ícone visual:
    - `workout_complete` → ícone de treino + "completou um treino de [tipo]"
    - `milestone` → ícone de troféu + "atingiu o milestone [nome]!"
    - `challenge_complete` → ícone de desafio + "completou o desafio [nome]"
  - Detalhes do metadata (duração do treino, distância, streak count)
  - Timestamp relativo ("há 5 min", "há 2 horas", "ontem")
  - Botão de like com contador
- [ ] **AC4:** Componente `TribeFeed` criado em `src/components/tribe/TribeFeed.tsx`:
  - Lista de `FeedPost` components
  - Pull-to-refresh (ou botão de refresh no topo)
  - Loading skeleton enquanto carrega
  - Estado vazio: "A tribo ainda está silenciosa. Sê o primeiro a treinar hoje!"
- [ ] **AC5:** Hook `useTribe` criado em `src/hooks/useTribe.ts`:
  - Retorna `{ posts, isLoading, error, fetchMore, hasMore }`
  - Gere a subscrição Realtime internamente
  - Suporta infinite scroll com `fetchMore()`
  - Adiciona novos posts do Realtime ao topo da lista
- [ ] **AC6:** Timestamps relativos calculados correctamente:
  - "agora" — menos de 1 minuto
  - "há X min" — 1-59 minutos
  - "há X horas" — 1-23 horas
  - "ontem" — dia anterior
  - "há X dias" — 2-7 dias
  - Data formatada (ex: "12 Mar") — mais de 7 dias
- [ ] **AC7:** Feed respeita o RLS do Supabase:
  - Todos os utilizadores autenticados podem ler posts (policy já existe)
  - Posts de utilizadores que cancelaram a conta não aparecem (soft delete futuro)
  - Feed não mostra informação sensível (apenas display_name, avatar, actividade)
- [ ] **AC8:** Performance optimizada:
  - Posts carregados com query limitada (20 por página)
  - Imagens de avatar com lazy loading
  - Componentes virtualizados se a lista for grande (considerar `react-window` ou similar)
  - Cache de posts via React Query ou SWR

## Technical Notes

- Supabase Realtime: usar `supabase.channel('tribe-feed').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tribe_posts' }, callback).subscribe()`
- Para timestamps relativos, usar `date-fns/formatDistanceToNow` ou implementar manualmente
- O join com `profiles` pode ser feito via Supabase query: `supabase.from('tribe_posts').select('*, profiles(display_name, avatar_url)')`
- Considerar limitar o Realtime a posts das últimas 24h para reduzir carga
- Para infinite scroll, usar `IntersectionObserver` para detectar quando o utilizador chega ao fundo

## Ficheiros a Criar/Modificar

```
src/components/tribe/FeedPost.tsx           # Componente de post individual
src/components/tribe/TribeFeed.tsx          # Lista de posts com Realtime
src/hooks/useTribe.ts                      # Hook para dados da tribo
src/lib/utils/dates.ts                     # Utilitários de timestamps relativos
src/types/tribe.ts                         # Modificar — garantir tipos Post, TribePost
```

## Definition of Done

- [ ] Código commitado no branch `feature/5.1-tribe-feed`
- [ ] Feed carrega posts do Supabase correctamente
- [ ] Novos posts aparecem em tempo real via Supabase Realtime
- [ ] Componente FeedPost renderiza os 3 tipos de post (workout, milestone, challenge)
- [ ] Infinite scroll funcional (carrega mais 20 posts)
- [ ] Timestamps relativos correctos
- [ ] Loading states e estado vazio implementados
- [ ] Cleanup da subscrição Realtime ao sair da página
- [ ] `npm run build` passa sem erros

## Dependencies

- **Story 0.2** — Supabase Setup (tabelas `tribe_posts`, `tribe_likes`, RLS)
- **Story 1.1** — Auth (utilizador autenticado para aceder ao feed)

## Blocked By

- Story 0.2, Story 1.1

## Next Story

→ **Story 5.2** — Auto-post on workout complete

---

*Story criada por River (SM) — AIOS*
