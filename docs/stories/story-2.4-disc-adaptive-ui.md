# Story 2.4 — DISC-Adaptive UI (Temas, CTAs, Layout por Perfil)

**Epic:** E2 — MaaS Engine & DISC
**Prioridade:** MUST
**Pontos:** 5
**Fase:** 1 (Semana 3-5)
**Assignee:** @dev
**Status:** [ ] To Do

---

## Descrição

Como **utilizador da FYVR**, quero que a interface da app se adapte automaticamente ao meu perfil DISC — desde as cores dos botões ao tipo de conteúdo que vejo primeiro — para que a experiência reflicta quem eu sou e me motive da forma certa.

## Contexto

A UI adaptativa é a camada visível do sistema MaaS + DISC. Não basta adaptar as mensagens — a própria interface deve mudar. Um utilizador D (competitivo) quer ver leaderboards e métricas de performance. Um utilizador I (social) quer ver o feed da comunidade e celebrações. Um utilizador S (estável) quer ver o seu streak e progresso calmo. Um utilizador C (analítico) quer ver gráficos e dados detalhados.

Esta adaptação acontece a nível de: texto dos botões CTA, cores de destaque, secções visíveis/ocultas, ordem dos elementos, e tom geral da interface.

**Ref PRD:** Secção 4.3 — Perfil DISC (tabela UI Focus por perfil)
**Ref Arquitectura:** Secção 4.3 — Design System DISC-Adaptive UI (`DISC_THEMES` object)

## Acceptance Criteria

- [ ] **AC1:** Objecto `DISC_THEMES` implementado em `lib/maas/disc.ts` conforme arquitectura:
  ```typescript
  export type DISCProfile = 'D' | 'I' | 'S' | 'C'

  export interface DISCTheme {
    ctaText: string
    ctaColor: string           // classe Tailwind
    ctaHoverColor: string      // classe Tailwind hover
    accentColor: string        // cor de destaque
    tone: 'competitive' | 'enthusiastic' | 'supportive' | 'analytical'
    showLeaderboard: boolean
    showSocialFeed: boolean
    showDetailedMetrics: boolean
    showStreakFocus: boolean
    greeting: string           // saudação genérica no header
  }

  export const DISC_THEMES: Record<DISCProfile, DISCTheme> = {
    D: {
      ctaText: 'DOMINA',
      ctaColor: 'bg-disc-d',           // vermelho (#EF4444)
      ctaHoverColor: 'hover:bg-red-700',
      accentColor: 'text-disc-d',
      tone: 'competitive',
      showLeaderboard: true,
      showSocialFeed: false,
      showDetailedMetrics: true,
      showStreakFocus: true,
      greeting: 'Preparado para dominar?'
    },
    I: {
      ctaText: 'BORA COM TUDO!',
      ctaColor: 'bg-disc-i',           // amarelo (#EAB308)
      ctaHoverColor: 'hover:bg-yellow-600',
      accentColor: 'text-disc-i',
      tone: 'enthusiastic',
      showLeaderboard: false,
      showSocialFeed: true,
      showDetailedMetrics: false,
      showStreakFocus: true,
      greeting: 'O squad está contigo!'
    },
    S: {
      ctaText: 'CONTINUAR',
      ctaColor: 'bg-disc-s',           // verde (#22C55E)
      ctaHoverColor: 'hover:bg-green-700',
      accentColor: 'text-disc-s',
      tone: 'supportive',
      showLeaderboard: false,
      showSocialFeed: false,
      showDetailedMetrics: false,
      showStreakFocus: true,
      greeting: 'Bom ver-te de volta.'
    },
    C: {
      ctaText: 'INICIAR PROTOCOLO',
      ctaColor: 'bg-disc-c',           // azul (#3B82F6)
      ctaHoverColor: 'hover:bg-blue-700',
      accentColor: 'text-disc-c',
      tone: 'analytical',
      showLeaderboard: false,
      showSocialFeed: false,
      showDetailedMetrics: true,
      showStreakFocus: true,
      greeting: 'Protocolo do dia carregado.'
    }
  }
  ```

- [ ] **AC2:** Hook `useDISCTheme` criado em `hooks/useDISCTheme.ts`:
  ```typescript
  export function useDISCTheme() {
    return {
      profile: DISCProfile,       // perfil DISC do utilizador
      theme: DISCTheme,           // tema completo do perfil
      isLoading: boolean
    }
  }
  ```

- [ ] **AC3:** Componente `AdaptiveButton` criado em `components/maas/AdaptiveButton.tsx`:
  - Usa automaticamente o `ctaText` e `ctaColor` do perfil DISC do utilizador
  - Aceita prop `override` para texto custom quando necessário
  - Animação de press com Framer Motion (scale down + up)
  ```typescript
  interface AdaptiveButtonProps {
    onClick: () => void
    override?: string          // texto custom (ignora DISC ctaText)
    size?: 'sm' | 'md' | 'lg'
    fullWidth?: boolean
    disabled?: boolean
  }
  ```

- [ ] **AC4:** Componente `DISCMessage` criado em `components/maas/DISCMessage.tsx`:
  - Renderiza mensagens do MaaS Engine com estilo adaptado ao DISC
  - Cor de destaque muda conforme perfil
  - Ícone/emoji contextual por perfil:
    - D: icone de troféu/fogo
    - I: icone de estrela/festa
    - S: icone de coração/abraço
    - C: icone de gráfico/alvo

- [ ] **AC5:** Layout da tab "Hoje" (`/today`) adapta-se ao perfil DISC:

  **Perfil D (Dominância):**
  ```
  ┌─────────────────────────────────┐
  │ FYVR              🔥 12 dias    │
  │─────────────────────────────────│
  │ "Preparado para dominar?"       │
  │                                 │
  │ ┌─────────────────────────┐     │
  │ │ 📊 RANKING: #4 / 150    │     │  ← Leaderboard visível
  │ └─────────────────────────┘     │
  │                                 │
  │ ┌─ TREINO DO DIA ────────┐     │
  │ │  Hybrid Power           │     │
  │ │  45 min · 6 exercícios  │     │
  │ └─────────────────────────┘     │
  │                                 │
  │    [ DOMINA ]                   │  ← CTA vermelho
  │─────────────────────────────────│
  │ 📅 Hoje  📊 Prog  👥 Tribo  👤  │
  └─────────────────────────────────┘
  ```

  **Perfil I (Influência):**
  ```
  ┌─────────────────────────────────┐
  │ FYVR              🔥 12 dias    │
  │─────────────────────────────────│
  │ "O squad está contigo! 🎉"      │
  │                                 │
  │ ┌─────────────────────────┐     │
  │ │ 👥 3 amigos já treinaram │    │  ← Feed social visível
  │ │    hoje! Junta-te!       │    │
  │ └─────────────────────────┘     │
  │                                 │
  │ ┌─ TREINO DO DIA ────────┐     │
  │ │  Fun Hybrid 🎊          │     │
  │ │  40 min · 5 exercícios  │     │
  │ └─────────────────────────┘     │
  │                                 │
  │    [ BORA COM TUDO! ]           │  ← CTA amarelo
  │─────────────────────────────────│
  │ 📅 Hoje  📊 Prog  👥 Tribo  👤  │
  └─────────────────────────────────┘
  ```

  **Perfil S (Estabilidade):**
  ```
  ┌─────────────────────────────────┐
  │ FYVR              🔥 12 dias    │
  │─────────────────────────────────│
  │ "Bom ver-te de volta."          │
  │                                 │
  │ ┌─────────────────────────┐     │
  │ │ 🔥 12 dias seguidos!     │    │  ← Streak em destaque
  │ │    A tua melhor série    │    │
  │ └─────────────────────────┘     │
  │                                 │
  │ ┌─ TREINO DO DIA ────────┐     │
  │ │  Steady Hybrid          │     │
  │ │  35 min · 5 exercícios  │     │
  │ └─────────────────────────┘     │
  │                                 │
  │    [ CONTINUAR ]                │  ← CTA verde
  │─────────────────────────────────│
  │ 📅 Hoje  📊 Prog  👥 Tribo  👤  │
  └─────────────────────────────────┘
  ```

  **Perfil C (Conformidade):**
  ```
  ┌─────────────────────────────────┐
  │ FYVR              🔥 12 dias    │
  │─────────────────────────────────│
  │ "Protocolo do dia carregado."   │
  │                                 │
  │ ┌─────────────────────────┐     │
  │ │ 📈 Progresso semanal:    │    │  ← Métricas detalhadas
  │ │    Volume: +8% vs média  │    │
  │ │    Consistência: 92%     │    │
  │ └─────────────────────────┘     │
  │                                 │
  │ ┌─ TREINO DO DIA ────────┐     │
  │ │  Protocol #47            │    │
  │ │  42 min · 6 exercícios  │     │
  │ │  Volume: 4.200kg est.   │     │
  │ └─────────────────────────┘     │
  │                                 │
  │    [ INICIAR PROTOCOLO ]        │  ← CTA azul
  │─────────────────────────────────│
  │ 📅 Hoje  📊 Prog  👥 Tribo  👤  │
  └─────────────────────────────────┘
  ```

- [ ] **AC6:** Secções condicionais renderizam-se baseadas nos flags do `DISC_THEMES`:
  ```typescript
  // Na página /today
  const { theme } = useDISCTheme()

  return (
    <>
      {theme.showLeaderboard && <LeaderboardPreview />}
      {theme.showSocialFeed && <TribeFeedPreview />}
      {theme.showStreakFocus && <StreakHighlight />}
      {theme.showDetailedMetrics && <MetricsPreview />}

      <WorkoutCard />

      <AdaptiveButton onClick={startWorkout} />
    </>
  )
  ```

- [ ] **AC7:** CSS variables dinâmicas aplicadas ao body/container baseadas no perfil DISC:
  ```typescript
  // Aplicar tema DISC via CSS custom properties
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--disc-accent', DISC_COLORS[profile])
    root.style.setProperty('--disc-cta-bg', DISC_CTA_COLORS[profile])
  }, [profile])
  ```

- [ ] **AC8:** Transição suave quando o perfil DISC muda (ex: após recalcular no onboarding):
  - Fade out → aplicar novo tema → fade in
  - Duração: 300ms

- [ ] **AC9:** Componente `StreakHighlight` criado (visível para S e D):
  - Mostra streak actual com animação de contador
  - Mensagem motivacional adaptada ao DISC

- [ ] **AC10:** Componente `MetricsPreview` criado (visível para C e D):
  - Mini-dashboard com 3 métricas chave
  - Volume semanal, consistência %, progressão

- [ ] **AC11:** Componente `TribeFeedPreview` criado (visível para I):
  - Mini-feed com 2-3 actividades recentes do squad
  - Link "Ver mais" para tab Tribo

- [ ] **AC12:** Componente `LeaderboardPreview` criado (visível para D):
  - Posição do utilizador no ranking
  - Top 3 da semana
  - Link "Ver ranking completo"

- [ ] **AC13:** Fallback visual quando perfil DISC não está definido (novo utilizador que ainda não fez onboarding):
  - Usa tema neutro (accent laranja FYVR padrão)
  - CTA text: "TREINAR"
  - Todas as secções visíveis

## Technical Notes

- As cores DISC já foram definidas na Story 0.3 (Design System):
  - disc-d: #EF4444, disc-i: #EAB308, disc-s: #22C55E, disc-c: #3B82F6
- O perfil DISC vem da tabela `profiles.disc_profile` (definida na Story 0.2)
- O hook `useDISCTheme` deve ler o perfil via `useUser()` (Story 1.1) e mapear para o tema
- Os componentes de preview (Leaderboard, Metrics, TribeFeed, Streak) são versões simplificadas — os componentes completos são implementados nas respectivas stories (E4, E5)
- Para o MVP, o LeaderboardPreview pode mostrar dados mock (leaderboard real vem na Story 4.x)
- Usar CSS custom properties permite que componentes de terceiros (gráficos, etc.) também se adaptem ao DISC
- O componente `AdaptiveButton` substitui o uso directo de `Button` em contextos MaaS

## Estrutura de Ficheiros

```
src/
├── components/
│   ├── maas/
│   │   ├── AdaptiveButton.tsx     # Botão CTA adaptativo por DISC
│   │   ├── DISCMessage.tsx        # Mensagem estilizada por DISC
│   │   ├── StreakHighlight.tsx     # Destaque de streak (S, D)
│   │   ├── MetricsPreview.tsx     # Mini-dashboard métricas (C, D)
│   │   ├── TribeFeedPreview.tsx   # Mini-feed da tribo (I)
│   │   └── LeaderboardPreview.tsx # Mini-leaderboard (D)
│   └── ui/
│       └── Button.tsx             # (já existe — AC da Story 0.3)
├── hooks/
│   └── useDISCTheme.ts            # Hook para tema DISC
└── lib/
    └── maas/
        └── disc.ts                # DISC_THEMES, tipos, utilidades
```

## Definition of Done

- [ ] Código commitado no branch `feature/2.4-disc-adaptive-ui`
- [ ] 4 variações de layout visualmente distintas para cada perfil DISC
- [ ] Botão CTA muda texto e cor conforme perfil
- [ ] Secções condicionais (leaderboard, feed, metrics, streak) aparecem/ocultam correctamente
- [ ] CSS custom properties aplicadas dinamicamente
- [ ] Fallback funciona para utilizador sem perfil DISC
- [ ] Responsivo em mobile (375px-428px)
- [ ] Transições suaves entre estados (Framer Motion)
- [ ] Componentes de preview renderizam sem erros (dados mock aceitáveis)

## Dependencies

- **Story 0.3** — Design System (cores DISC, componente Button, Framer Motion)
- **Story 1.2** — Onboarding DISC (perfil DISC guardado no profile)

## Blocked By

- Story 0.3
- Story 1.2

## Next Story

→ **Story 3.1** — Workout Generation (hybrid: run + strength por nível)

---

*Story criada por River (SM) — AIOS*