# Story 4.3 — Tab "Progresso" (charts + metrics)

**Epic:** E4 — Streaks & Gamification
**Prioridade:** MUST
**Pontos:** 5
**Fase:** 2 (Semana 7-8)
**Assignee:** @dev
**Status:** [ ] To Do

---

## Descrição

Como **utilizador**, quero ver o meu progresso de treino em gráficos e métricas visuais na tab "Progresso", para que tenha uma visão clara da minha evolução e me sinta motivado a continuar — com a informação adaptada ao meu perfil DISC.

## Contexto

A tab "Progresso" (`/progress`) é um dos 3 ecrãs principais da FYVR. O objectivo é resolver o problema #2 da desistência: "sem progresso visível". Cada utilizador precisa de VER que está a evoluir. A diferenciação FYVR está em adaptar o tipo de informação ao perfil DISC — um perfil D quer ver rankings e comparações, enquanto um perfil C quer gráficos detalhados com dados numéricos.

**Ref PRD:** Secção 5.1 — Feature F7 (Progresso Visual), Secção 4.3 — Perfil DISC (UI Focus)
**Ref Arquitectura:** Secção 4.4 — Tab Progresso (`/progress`), Secção 4.3 — DISC-Adaptive UI

## Acceptance Criteria

- [ ] **AC1:** Página `/progress` criada com layout responsivo (mobile-first):
  - Header com título "Progresso" e período seleccionável (semana/mês)
  - Secção de streak e badges no topo
  - Secção de gráficos no centro
  - Secção de métricas/estatísticas em baixo
- [ ] **AC2:** Componente `StreakCounter` (Story 4.1) integrado no topo da página:
  - Streak actual em destaque
  - Longest streak e total de treinos visíveis
- [ ] **AC3:** Gráfico de treinos por semana implementado:
  - Gráfico de barras mostrando treinos completados por dia (últimos 7 dias)
  - Cada dia mostra barra preenchida (treinou) ou vazia (não treinou)
  - Indicador visual de "meta semanal" (ex: linha tracejada em 3 treinos/semana)
  - Toggle para ver últimas 4 semanas (visão mensal com barras por semana)
- [ ] **AC4:** Gráfico de distância de corrida implementado:
  - Gráfico de linha mostrando km de corrida por sessão (últimas 4 semanas)
  - Eixo Y: quilómetros, Eixo X: datas dos treinos
  - Total de km no período visível
  - Só aparece se o utilizador tiver treinos com `run_distance_km > 0`
- [ ] **AC5:** Indicador de consistência (%) implementado:
  - Percentagem de dias treinados vs dias planeados no período
  - Cálculo: `(dias_treinados / dias_no_periodo) * 100`
  - Representação visual: círculo de progresso ou barra de progresso
  - Cor muda consoante a percentagem: verde (>70%), amarelo (40-70%), vermelho (<40%)
- [ ] **AC6:** Timeline de milestones implementada:
  - Lista cronológica dos milestones atingidos (do mais recente ao mais antigo)
  - Cada milestone mostra ícone, nome, e data
  - Se nenhum milestone atingido → mensagem motivacional: "O teu primeiro milestone está à espera!"
- [ ] **AC7:** Integração com `BadgesList` (Story 4.2):
  - Secção "Badges" com os badges ganhos e por ganhar
  - Link/botão para ver todos os badges (se lista for grande)
- [ ] **AC8:** UI adaptada ao perfil DISC do utilizador:
  - **Perfil D (Dominância):** Mostra ranking/posição comparativa ("Estás no top 15% de consistência"), métricas de performance, tom competitivo
  - **Perfil I (Influência):** Mostra comparações sociais ("A tribo treinou 342 vezes esta semana"), celebrações visuais, emojis
  - **Perfil S (Estabilidade):** Foco na consistência e rotina ("12 dias seguidos — consistência é o teu superpoder"), visual calmo, sem pressão
  - **Perfil C (Conformidade):** Dados detalhados com números exactos, percentagens, médias, gráficos com mais pontos de dados, tabelas
- [ ] **AC9:** Dados carregados do Supabase com loading states:
  - Query à tabela `workouts` filtrada por `user_id` e período
  - Query à tabela `streaks` para dados de streak e milestones
  - Skeleton loading enquanto os dados carregam
  - Estado vazio se o utilizador não tem treinos: "Completa o teu primeiro treino para ver o progresso!"
- [ ] **AC10:** Período seleccionável com toggle:
  - Opções: "Esta Semana" e "Este Mês"
  - Gráficos e métricas actualizam ao mudar o período
  - Default: "Esta Semana"

## Technical Notes

- Para gráficos, usar biblioteca leve compatível com React: `recharts` (~45KB) ou `chart.js` com `react-chartjs-2`
- Alternativa: gráficos com SVG/CSS puro para minimizar bundle size (barras simples)
- Os dados vêm de queries ao Supabase — considerar criar uma view ou RPC para agregar dados de progresso
- A adaptação DISC usa `profiles.disc_profile` para condicionar que secções e textos mostrar
- O componente de consistência (%) pode ser um `CircularProgress` custom com SVG
- Para mobile, o layout deve ser vertical (scroll) — não tabs dentro de tabs

## Ficheiros a Criar/Modificar

```
src/app/(main)/progress/page.tsx            # Página principal do Progresso
src/components/progress/WeeklyChart.tsx     # Gráfico de treinos por semana
src/components/progress/DistanceChart.tsx   # Gráfico de distância de corrida
src/components/progress/ConsistencyRing.tsx # Indicador de consistência circular
src/components/progress/MilestoneTimeline.tsx # Timeline de milestones
src/hooks/useProgress.ts                    # Hook para dados agregados de progresso
```

## Definition of Done

- [ ] Código commitado no branch `feature/4.3-progress-tab`
- [ ] Tab "Progresso" renderiza com todos os componentes
- [ ] Gráfico de treinos semanais funcional com dados reais
- [ ] Gráfico de distância funcional (condicional — só com dados de corrida)
- [ ] Indicador de consistência calcula e exibe correctamente
- [ ] UI adaptada ao perfil DISC (4 variações testadas)
- [ ] Loading states e estados vazios implementados
- [ ] Toggle semana/mês funcional
- [ ] Layout responsivo testado em mobile (320px-428px)
- [ ] `npm run build` passa sem erros

## Dependencies

- **Story 4.1** — Streak Counter (componente StreakCounter, hook useStreak)
- **Story 4.2** — Milestones & Badges (componente BadgesList, dados de milestones)
- **Story 2.4** — Perfil DISC (disc_profile para adaptação da UI)

## Blocked By

- Story 4.1, Story 2.4

## Next Story

→ **Story 4.4** — Push Notifications (OneSignal + DISC)

---

*Story criada por River (SM) — AIOS*
