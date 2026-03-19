# Story 7.2 — Beta Launch Setup

**Epic:** E7 — Landing Page & Launch
**Prioridade:** MUST
**Pontos:** 3
**Fase:** 3 (Semana 12)
**Assignee:** @dev
**Status:** [ ] To Do

---

## Descrição

Como **founder**, quero ter um sistema de beta launch que permita convidar 50 utilizadores iniciais, recolher feedback estruturado, e enviar uma sequência de emails de onboarding, para que o lançamento da FYVR seja controlado e gere dados suficientes para iterar.

## Contexto

O beta launch é o momento de validação da FYVR com utilizadores reais. Os primeiros 50 utilizadores vão testar tudo: onboarding DISC, treinos, streaks, comunidade, e pagamentos. O sistema precisa de um mecanismo de convite (para controlar quem entra), um formulário de feedback (para recolher impressões), e uma sequência de emails de boas-vindas (para guiar os beta testers). O Go/No-Go criteria do PRD define: 50 beta users registados, 20 activos semanais, 5 Pro subscribers.

**Ref PRD:** Secção 10 — Roadmap Fase 3 (Beta launch com 50 utilizadores), Secção 13 — Success Criteria Go/No-Go
**Ref Arquitectura:** Secção 9.1 — Vercel (hosting), Secção 2.1 — Supabase (Auth, DB)

## Acceptance Criteria

- [ ] **AC1:** Sistema de convite por código implementado:
  - Tabela `beta_invites` criada no Supabase:
    - `id` (UUID), `code` (TEXT UNIQUE), `email` (TEXT), `used_at` (TIMESTAMPTZ), `created_at` (TIMESTAMPTZ)
  - 50 códigos únicos gerados (formato: `FYVR-XXXX` onde XXXX são 4 caracteres alfanuméricos)
  - Página de registo (`/register`) aceita código de convite como campo opcional
  - Se código válido e não usado → permitir registo e marcar código como usado
  - Se código inválido ou já usado → mostrar erro "Código de convite inválido ou já utilizado"
  - Se sem código → registo normal (sem restrição no MVP — o código é opcional para tracking)
- [ ] **AC2:** Tracking de beta users implementado:
  - Campo `is_beta_user BOOLEAN DEFAULT false` adicionado à tabela `profiles`
  - Quando registo com código válido → `is_beta_user = true`
  - Campo `beta_invite_code TEXT` para saber qual código foi usado
  - Dashboard query: `SELECT COUNT(*) FROM profiles WHERE is_beta_user = true`
- [ ] **AC3:** Formulário de feedback criado:
  - Página `/feedback` acessível por utilizadores autenticados
  - Link no menu do perfil: "Dar Feedback (Beta)"
  - Campos do formulário:
    - "O que mais gostaste na FYVR?" (textarea)
    - "O que melhorarias?" (textarea)
    - "De 1 a 10, quão provável é recomendares a FYVR?" (NPS slider)
    - "Qual feature mais usas?" (select: Treinos, Streaks, Tribo, Progresso)
    - "Comentário adicional" (textarea, opcional)
  - Submit guarda na tabela `beta_feedback` no Supabase
- [ ] **AC4:** Tabela `beta_feedback` criada:
  - `id` (UUID), `user_id` (UUID FK profiles), `liked` (TEXT), `improve` (TEXT), `nps_score` (INTEGER 1-10), `most_used_feature` (TEXT), `additional_comments` (TEXT), `created_at` (TIMESTAMPTZ)
  - RLS: utilizador pode inserir o seu próprio feedback, mas não ler feedback de outros
- [ ] **AC5:** Sequência de emails de onboarding configurada via Supabase:
  - **Email 1 — Boas-vindas** (imediato após registo):
    - Subject: "Bem-vindo à FYVR! O teu primeiro treino espera-te."
    - Conteúdo: boas-vindas, link para a app, instruções básicas
  - **Email 2 — Dia 3** (3 dias após registo):
    - Subject: "Como estão os teus primeiros treinos?"
    - Conteúdo: dicas, encorajamento, link para o feedback
  - **Email 3 — Dia 7** (7 dias após registo):
    - Subject: "1 semana de FYVR! Vê o teu progresso."
    - Conteúdo: recap da semana, link para tab Progresso, CTA para upgrade se Free
  - Emails enviados via Supabase Auth emails ou Edge Function com cron
- [ ] **AC6:** Sistema simples de envio de emails:
  - Opção A (recomendada para MVP): Edge Function com cron que verifica utilizadores por `created_at` e envia emails via Supabase Auth custom email ou SMTP
  - Opção B: usar Supabase Hooks (Database Webhooks) para trigger on insert na tabela `profiles`
  - Guardar registo de emails enviados para evitar duplicação
  - Tabela `email_log`: `id`, `user_id`, `email_type` ('welcome', 'day3', 'day7'), `sent_at`
- [ ] **AC7:** Banner/badge de beta na app:
  - Utilizadores beta vêem badge "Beta Tester" no perfil
  - Banner discreto no topo da app: "Versão Beta — O teu feedback é essencial!"
  - Link no banner para `/feedback`
- [ ] **AC8:** Métricas de beta tracking acessíveis:
  - Query para dashboard do founder (pode ser via Supabase Dashboard SQL Editor):
    - Total de beta users registados
    - Beta users activos esta semana (com workout completo)
    - NPS médio do feedback
    - Distribuição de features mais usadas
    - Conversão Free → Pro entre beta users

## Technical Notes

- Os códigos de convite podem ser gerados com um script SQL: `INSERT INTO beta_invites (code) SELECT 'FYVR-' || upper(substr(md5(random()::text), 1, 4)) FROM generate_series(1, 50)`
- Para emails no MVP, a solução mais simples é uma Edge Function com cron que corre 1x por dia e verifica quem precisa de receber email
- Alternativa: usar serviço externo como Resend (free tier: 100 emails/dia) se o Supabase SMTP for limitado
- Os emails devem ser em HTML simples — sem templates complexos no MVP
- O formulário de feedback pode usar React Hook Form para validação
- O banner de beta deve ser facilmente removível (flag ou variável de ambiente `NEXT_PUBLIC_IS_BETA=true`)

## Ficheiros a Criar/Modificar

```
src/app/(main)/feedback/page.tsx            # Página de feedback
src/components/profile/BetaBadge.tsx        # Badge de beta tester
src/components/ui/BetaBanner.tsx            # Banner de beta no topo
src/app/(auth)/register/page.tsx            # Modificar — campo de código de convite
supabase/migrations/xxx_beta_tables.sql     # Migração: tabelas beta_invites, beta_feedback, email_log
supabase/functions/send-onboarding-email/index.ts  # Edge Function de emails
```

## Definition of Done

- [ ] Código commitado no branch `feature/7.2-beta-launch`
- [ ] 50 códigos de convite gerados na tabela `beta_invites`
- [ ] Registo com código funciona e marca utilizador como beta
- [ ] Formulário de feedback funcional e guarda respostas
- [ ] Pelo menos Email 1 (boas-vindas) enviado automaticamente
- [ ] Badge "Beta Tester" visível no perfil de beta users
- [ ] Banner de beta visível na app
- [ ] Queries de métricas disponíveis para o founder
- [ ] `npm run build` passa sem erros

## Dependencies

- **Story 7.1** — Landing Page (página pública com CTA de registo)
- **Story 6.3** — Feature Gating (distinção Free vs Pro para emails de upsell)

## Blocked By

- Story 7.1, Story 6.3

## Next Story

→ **Story 7.3** — Analytics setup (Mixpanel)

---

*Story criada por River (SM) — AIOS*
