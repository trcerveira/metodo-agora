# Story 0.2 — Setup Supabase (Projecto, Schema SQL, RLS)

**Epic:** E0 — Project Setup
**Prioridade:** MUST
**Pontos:** 5
**Fase:** 0 (Semana 1)
**Assignee:** @dev
**Status:** [ ] To Do

---

## Descrição

Como **developer**, quero ter o Supabase configurado com todas as tabelas, RLS policies, e indexes definidos na arquitectura, para que o backend esteja pronto para receber as features de auth, workouts, streaks e community.

## Contexto

O Supabase é o BaaS (Backend as a Service) da FYVR. Inclui Auth, PostgreSQL, Edge Functions, Realtime, e Storage — tudo num só serviço no free tier.

**Ref Arquitectura:** Secção 5.1 — Schema da Base de Dados (schema SQL completo)

## Acceptance Criteria

- [ ] **AC1:** Projecto Supabase criado (free tier) em supabase.com
- [ ] **AC2:** Tabelas criadas conforme schema da arquitectura:
  - `profiles` — perfil do utilizador + DISC + subscription
  - `workouts` — treinos diários + MaaS messages
  - `streaks` — streak counter + milestones + badges
  - `tribe_posts` — feed da comunidade
  - `tribe_likes` — sistema de likes
  - `challenges` — desafios semanais/mensais
  - `challenge_participants` — participação em desafios
  - `disc_signals` — tracking comportamental DISC (Fase 2)
- [ ] **AC3:** Row Level Security (RLS) activado em TODAS as tabelas
- [ ] **AC4:** RLS Policies implementadas:
  - Users lêem/escrevem apenas os seus próprios dados (profiles, workouts, streaks)
  - Tribe posts são públicos para leitura, próprios para escrita
  - Likes são públicos para leitura, próprios para gestão
- [ ] **AC5:** Indexes criados:
  - `idx_workouts_user_date` em workouts(user_id, date)
  - `idx_tribe_posts_created` em tribe_posts(created_at DESC)
  - `idx_disc_signals_user` em disc_signals(user_id, created_at DESC)
- [ ] **AC6:** Supabase client configurado no Next.js:
  - `lib/supabase/client.ts` — browser client
  - `lib/supabase/server.ts` — server client (para Server Components)
  - `lib/supabase/middleware.ts` — auth middleware
- [ ] **AC7:** Variáveis de ambiente configuradas:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
- [ ] **AC8:** Ficheiro de migration SQL criado em `supabase/migrations/` para versionamento
- [ ] **AC9:** Conexão testada — `npm run dev` consegue fazer query à DB sem erros

## Technical Notes

- Instalar `@supabase/supabase-js` e `@supabase/ssr`
- Usar o schema SQL EXACTO da Arquitectura Secção 5.1 (copiar e executar no SQL Editor do Supabase)
- Para o middleware, seguir o padrão oficial Supabase + Next.js App Router
- Criar trigger para `profiles` auto-insert quando user se regista (via `auth.users`)
- O `disc_signals` table é para Fase 2 mas criar agora para não alterar schema depois

## SQL Trigger — Auto-create Profile

```sql
-- Trigger: quando user se regista, criar profile automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'FYVR User'));

  INSERT INTO public.streaks (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

## Definition of Done

- [ ] Código commitado no branch `feature/0.2-supabase-setup`
- [ ] Todas as 8 tabelas criadas com schema correcto
- [ ] RLS activo e policies testadas
- [ ] Supabase client funcional no Next.js
- [ ] Trigger de auto-create profile funcional
- [ ] Migration SQL versionado no repositório

## Dependencies

- **Story 0.1** — Project Setup (Next.js base necessária)

## Blocked By

- Story 0.1

## Next Story

→ **Story 0.3** — Design System FYVR

---

*Story criada por River (SM) — AIOS*
