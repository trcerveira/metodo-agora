# Story 5.3 — Sistema de Likes

**Epic:** E5 — Tribe / Community
**Prioridade:** MUST
**Pontos:** 2
**Fase:** 2 (Semana 8-10)
**Assignee:** @dev
**Status:** [ ] To Do

---

## Descrição

Como **utilizador**, quero poder dar like nos posts da tribo e ver quantos likes cada post tem, para que possa apoiar e reconhecer o esforço dos outros membros da comunidade.

## Contexto

O sistema de likes é a forma mais simples de interacção social no feed. Cada like é um micro-acto de accountability — dizer "vi que treinaste, bom trabalho" sem precisar de escrever uma mensagem. Os likes reforçam o comportamento positivo de quem posta e incentivam mais pessoas a completar treinos. A implementação usa optimistic UI para que o like pareça instantâneo.

A tabela `tribe_likes` já existe no schema (Story 0.2) com chave primária composta `(user_id, post_id)` e o campo `likes_count` na tabela `tribe_posts` serve como cache do total.

**Ref PRD:** Secção 4.1 — Pilar Tribo (comunidade), Secção 5.1 — Feature F6 (Feed da Tribo)
**Ref Arquitectura:** Secção 5.1 — Tabelas `tribe_posts` (likes_count), `tribe_likes`

## Acceptance Criteria

- [ ] **AC1:** Botão de like no componente `FeedPost`:
  - Ícone de coração (vazio quando não tem like, preenchido quando tem)
  - Contador numérico de likes ao lado do ícone
  - Ícone muda de cor ao dar like (ex: cinzento → vermelho #FF4500)
- [ ] **AC2:** Funcionalidade de dar like implementada:
  - Ao clicar no botão, insere registo na tabela `tribe_likes` com `(user_id, post_id)`
  - Incrementa `likes_count` na tabela `tribe_posts` em +1
  - Utilizador só pode dar 1 like por post (chave primária composta impede duplicação)
- [ ] **AC3:** Funcionalidade de remover like implementada:
  - Ao clicar novamente no botão (toggle), remove o registo da tabela `tribe_likes`
  - Decrementa `likes_count` na tabela `tribe_posts` em -1
  - Botão volta ao estado original (coração vazio, cor cinzenta)
- [ ] **AC4:** Optimistic UI implementado para resposta instantânea:
  - Ao clicar, o estado visual muda imediatamente (sem esperar pela resposta do servidor)
  - Contador incrementa/decrementa localmente
  - Se o pedido ao Supabase falhar → reverte o estado visual para o anterior
  - Mostrar feedback subtil de erro se falhar (ex: toast "Erro ao dar like, tenta novamente")
- [ ] **AC5:** Estado de like do utilizador actual carregado no feed:
  - Ao carregar posts, verificar quais posts o utilizador actual já deu like
  - Query: `tribe_likes` filtrado por `user_id = currentUser.id` para os posts visíveis
  - Ícone de coração preenchido nos posts com like do utilizador
- [ ] **AC6:** Animação no botão de like:
  - Ao dar like: micro-animação de scale (pulse) no ícone do coração
  - Duração: ~300ms
  - Via CSS transition ou Framer Motion
- [ ] **AC7:** Actualização do `likes_count` via Supabase RPC ou trigger:
  - Opção A: Supabase Database Function (trigger) que incrementa/decrementa automaticamente
  - Opção B: RPC call que faz INSERT + UPDATE numa transacção
  - Garantir atomicidade (o count nunca fica dessincronizado)
- [ ] **AC8:** Likes respeitam RLS:
  - Qualquer utilizador autenticado pode ler likes (policy já existe)
  - Utilizador só pode inserir/remover os seus próprios likes (policy já existe)
  - Não é possível dar like nos próprios posts (validação no frontend)

## Technical Notes

- Para o optimistic update, usar `useState` local que muda imediatamente e `useMutation` (React Query ou manual) que sincroniza com o servidor
- O `likes_count` na tabela `tribe_posts` é um campo de cache — o source of truth é a tabela `tribe_likes`
- Considerar criar um Database Trigger: `AFTER INSERT OR DELETE ON tribe_likes → UPDATE tribe_posts SET likes_count = (SELECT COUNT(*) FROM tribe_likes WHERE post_id = NEW.post_id)`
- Para verificar se o utilizador deu like, fazer LEFT JOIN ou subquery na query de posts: `tribe_posts LEFT JOIN tribe_likes ON tribe_likes.post_id = tribe_posts.id AND tribe_likes.user_id = currentUser`
- O botão de like não deve ser clicável durante o pedido (debounce de 500ms para evitar spam)

## Ficheiros a Criar/Modificar

```
src/components/tribe/LikeButton.tsx         # Componente do botão de like
src/components/tribe/FeedPost.tsx           # Modificar — integrar LikeButton
src/hooks/useLike.ts                       # Hook para dar/remover like com optimistic update
supabase/migrations/xxx_likes_trigger.sql  # Trigger para actualizar likes_count
```

## Definition of Done

- [ ] Código commitado no branch `feature/5.3-likes`
- [ ] Dar like insere registo na tabela `tribe_likes`
- [ ] Remover like remove registo da tabela `tribe_likes`
- [ ] `likes_count` actualizado correctamente na tabela `tribe_posts`
- [ ] Optimistic UI funciona (like visual instantâneo)
- [ ] Rollback visual se o pedido falhar
- [ ] Estado de like carregado correctamente ao abrir o feed
- [ ] Animação no botão de like funcional
- [ ] Sem duplicação de likes (chave primária composta)
- [ ] `npm run build` passa sem erros

## Dependencies

- **Story 5.1** — Feed da Tribo (componente FeedPost, tabela tribe_posts)

## Blocked By

- Story 5.1

## Next Story

→ **Story 5.4** — Tab "Tribo" — Ecrã completo

---

*Story criada por River (SM) — AIOS*
