# Story 4.4 — Push Notifications (OneSignal + DISC)

**Epic:** E4 — Streaks & Gamification
**Prioridade:** MUST
**Pontos:** 5
**Fase:** 2 (Semana 7-8)
**Assignee:** @dev
**Status:** [ ] To Do

---

## Descrição

Como **utilizador**, quero receber notificações push personalizadas ao meu perfil DISC — lembretes diários de treino, alertas de streak em risco, e celebrações de milestones — para que a app me mantenha accountable mesmo quando não estou a usá-la.

## Contexto

As push notifications são o braço da FYVR que alcança o utilizador fora da app. A maioria das apps de fitness envia notificações genéricas ("Hora de treinar!") — a FYVR diferencia-se com MaaS aplicado às notificações: cada mensagem é adaptada ao perfil DISC do utilizador. Um perfil D recebe "O teu streak de 12 dias está em risco. Vais deixar morrer?", enquanto um perfil S recebe "Hoje seria um bom dia para manter o ritmo. Sem pressão."

**Ref PRD:** Secção 5.1 — Feature F8 (Notificações Adaptativas), Secção 4.2 — MaaS
**Ref Arquitectura:** Secção 2.1 — OneSignal (Push Notifications), Secção 5.2 — Edge Function `send-notification`

## Acceptance Criteria

- [ ] **AC1:** OneSignal SDK integrado na PWA:
  - OneSignal Web Push SDK configurado no projecto Next.js
  - Service Worker do OneSignal registado (compatível com SW existente da PWA)
  - `ONESIGNAL_APP_ID` configurado via variável de ambiente
  - Prompt de permissão de notificações mostrado ao utilizador após onboarding (não no primeiro acesso)
- [ ] **AC2:** Registo do utilizador no OneSignal com tags:
  - Quando o utilizador aceita notificações → regista `player_id` no OneSignal
  - Tags enviadas ao OneSignal: `disc_profile`, `timezone`, `subscription_tier`
  - `player_id` guardado na tabela `profiles` (novo campo `onesignal_player_id`)
  - Tags actualizadas quando o perfil DISC ou subscrição mudam
- [ ] **AC3:** Edge Function `send-notification` criada para envio batch:
  - Cron job diário (configurado no Supabase) que corre 1x por dia
  - Busca todos os utilizadores com notificações activas
  - Agrupa por timezone para enviar à hora correcta (ex: 8h da manhã local)
  - Envia notificação via OneSignal REST API
- [ ] **AC4:** Notificação de lembrete diário implementada (DISC-adaptada):
  - **Perfil D:** "O teu streak é de X dias. Vais superar o recorde de Y? Treina agora."
  - **Perfil I:** "Bom dia! A tribo já está a treinar — junta-te a nós!"
  - **Perfil S:** "Bom dia. Hoje é mais um dia de consistência. O teu treino está pronto."
  - **Perfil C:** "Dados do dia: streak actual X dias, consistência Y%. Treino disponível."
  - Enviada à hora preferida do utilizador (`profiles.preferred_time`)
- [ ] **AC5:** Notificação de streak em risco implementada:
  - Disparada quando o utilizador não treinou hoje e são 18h+ no seu timezone
  - **Perfil D:** "O teu streak de X dias morre à meia-noite. Vais desistir?"
  - **Perfil I:** "Ei! Falta o treino de hoje — não deixes o streak acabar!"
  - **Perfil S:** "Ainda tens tempo para manter o ritmo hoje. Sem stress."
  - **Perfil C:** "Alerta: streak de X dias expira em Y horas. Probabilidade de manter: acção requerida."
  - Verificação: query `workouts` onde `user_id = X AND date = hoje AND status = 'completed'` — se não existe, enviar
- [ ] **AC6:** Notificação de milestone ganho implementada:
  - Enviada imediatamente quando um milestone/badge é ganho (trigger da Story 4.2)
  - **Perfil D:** "Badge desbloqueado: [nome]. Poucos chegam aqui."
  - **Perfil I:** "Parabéns! Ganhaste o badge [nome]! Partilha com a tribo!"
  - **Perfil S:** "Conquista desbloqueada: [nome]. A tua consistência trouxe-te aqui."
  - **Perfil C:** "Milestone [nome] atingido. Registado no teu histórico de conquistas."
- [ ] **AC7:** Utilizador pode desactivar notificações:
  - Toggle nas definições do perfil (`/profile`) para activar/desactivar cada tipo:
    - Lembrete diário de treino
    - Alerta de streak em risco
    - Notificações de milestones
  - Preferências guardadas na tabela `profiles` (novo campo JSONB `notification_preferences`)
- [ ] **AC8:** Edge Function lida com rate limiting e boas práticas:
  - Máximo 3 notificações por dia por utilizador
  - Não enviar lembrete se o utilizador já completou o treino do dia
  - Não enviar streak alert se o utilizador já treinou hoje
  - Respeitar opt-out do utilizador

## Technical Notes

- OneSignal Web Push: usar o SDK `@onesignal/onesignal-node` para envio server-side
- Para PWA, as push notifications Web requerem que o utilizador dê permissão explícita
- iOS Safari suporta Web Push desde 16.4+ — documentar limitação para utilizadores com versões mais antigas
- O cron job do Supabase pode ser configurado via `pg_cron` (extensão PostgreSQL) ou Supabase Dashboard
- Templates de mensagens DISC devem estar centralizados em `lib/maas/templates.ts` para reutilização
- A Edge Function `send-notification` deve processar utilizadores em batches de 100 para evitar timeouts
- OneSignal free tier suporta até 10.000 subscribers — mais que suficiente para MVP

## Ficheiros a Criar/Modificar

```
supabase/functions/send-notification/index.ts  # Edge Function de envio batch
src/lib/onesignal/client.ts                   # Setup do OneSignal SDK no frontend
src/lib/maas/templates.ts                     # Templates de mensagens DISC (notificações)
src/components/profile/NotificationSettings.tsx # Toggle de preferências de notificação
src/app/(main)/profile/page.tsx               # Modificar — adicionar secção de notificações
```

## Definition of Done

- [ ] Código commitado no branch `feature/4.4-push-notifications`
- [ ] OneSignal integrado e pedido de permissão funcional
- [ ] Lembrete diário enviado com tom DISC correcto
- [ ] Alerta de streak em risco funcional (só quando não treinou)
- [ ] Notificação de milestone ganho disparada correctamente
- [ ] Preferências de notificação respeitadas
- [ ] Rate limiting implementado (máx 3/dia)
- [ ] Cron job configurado e funcional no Supabase
- [ ] Testado em Android (Chrome) e iOS (Safari 16.4+)
- [ ] `npm run build` passa sem erros

## Dependencies

- **Story 2.2** — Onboarding DISC (perfil DISC definido para adaptar mensagens)
- **Story 4.1** — Streak Counter (dados de streak para mensagens e alertas)

## Blocked By

- Story 2.2, Story 4.1

## Next Story

→ **Story 5.1** — Feed da Tribo

---

*Story criada por River (SM) — AIOS*
