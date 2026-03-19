# Story 0.3 — Design System FYVR (Cores, Tipografia, Componentes Base)

**Epic:** E0 — Project Setup
**Prioridade:** MUST
**Pontos:** 5
**Fase:** 0 (Semana 2)
**Assignee:** @dev
**Status:** [ ] To Do

---

## Descrição

Como **designer/developer**, quero ter o design system da FYVR definido e implementado em componentes reutilizáveis, para que toda a app tenha consistência visual e a identidade da marca esteja presente desde o primeiro ecrã.

## Contexto

A FYVR é uma marca faceless inspirada na Nike. Visual bold, minimal, energético. Fundo escuro, accent em laranja/vermelho. O design system deve suportar 4 variações DISC (cores de CTA e tom mudam por perfil).

**Ref PRD:** Secção 1.4 — Brand Identity
**Ref Arquitectura:** Secção 4.3 — Design System DISC-Adaptive UI

## Acceptance Criteria

- [ ] **AC1:** Paleta de cores FYVR definida e configurada no Tailwind:
  ```
  fyvr-black:    #0A0A0A  (background principal)
  fyvr-dark:     #1A1A1A  (cards, surfaces)
  fyvr-gray:     #2A2A2A  (borders, separators)
  fyvr-text:     #FFFFFF  (texto principal)
  fyvr-muted:    #888888  (texto secundário)
  fyvr-accent:   #FF4500  (accent principal — "fire orange")
  fyvr-success:  #22C55E  (streaks, conclusão)
  fyvr-warning:  #EAB308  (alertas)

  DISC colors:
  disc-d:        #EF4444  (Dominância — vermelho)
  disc-i:        #EAB308  (Influência — amarelo)
  disc-s:        #22C55E  (Estabilidade — verde)
  disc-c:        #3B82F6  (Conformidade — azul)
  ```
- [ ] **AC2:** Tipografia configurada:
  - Font principal: Inter (ou similar — clean, modern, sans-serif)
  - Headings: Bold/Black weight
  - Body: Regular/Medium weight
  - Monospace: JetBrains Mono (para dados/métricas)
- [ ] **AC3:** Componentes base criados em `components/ui/`:
  - `Button.tsx` — variantes: primary, secondary, ghost, DISC-adaptive
  - `Card.tsx` — dark card com border subtle
  - `Badge.tsx` — streak badges, milestone badges
  - `Input.tsx` — styled input para forms
  - `ProgressBar.tsx` — barra de progresso animada
  - `Avatar.tsx` — avatar do utilizador
  - `BottomNav.tsx` — navegação inferior (4 tabs: Hoje, Progresso, Tribo, Perfil)
  - `MoodSelector.tsx` — selector de mood 1-5 (emojis ou escala visual)
- [ ] **AC4:** Layout base implementado:
  - Dark theme por defeito (sem opção light no MVP)
  - Bottom navigation com 4 tabs
  - Safe areas para mobile
  - Max-width container para desktop (mobile-first)
- [ ] **AC5:** DISC-adaptive CTA implementado conforme Arquitectura:
  ```typescript
  D: { ctaText: 'DOMINA', ctaColor: 'bg-red-600' }
  I: { ctaText: 'BORA COM TUDO', ctaColor: 'bg-yellow-500' }
  S: { ctaText: 'CONTINUAR', ctaColor: 'bg-green-600' }
  C: { ctaText: 'INICIAR PROTOCOLO', ctaColor: 'bg-blue-600' }
  ```
- [ ] **AC6:** Logo FYVR placeholder implementado (text-based: "FYVR" em bold)
- [ ] **AC7:** Animações básicas com Framer Motion:
  - Page transitions (fade)
  - Card hover/press states
  - Streak counter animation (number increment)
- [ ] **AC8:** Responsive: funciona em 375px (iPhone SE) até 428px (iPhone 14 Pro Max)
- [ ] **AC9:** Storybook ou página de preview (`/design-system`) com todos os componentes

## Technical Notes

- Instalar `framer-motion` para animações
- Configurar cores custom no `tailwind.config.ts`
- Usar CSS variables para as cores DISC (permitir troca dinâmica)
- `BottomNav` deve usar `usePathname()` do Next.js para highlight activo
- Componentes devem aceitar prop `discProfile` para adaptação

## Visual Reference

```
┌─────────────────────────────┐
│  FYVR          ⚡  🔥 12    │  ← Header: logo + streak
│─────────────────────────────│
│                             │
│  [Conteúdo da página]       │
│                             │
│                             │
│                             │
│─────────────────────────────│
│  📅 Hoje  📊 Prog  👥 Tribo  👤 │  ← Bottom Nav
└─────────────────────────────┘
```

## Definition of Done

- [ ] Código commitado no branch `feature/0.3-design-system`
- [ ] Todos os 8 componentes base criados e funcionais
- [ ] Paleta de cores aplicada globalmente
- [ ] DISC-adaptive CTA funcional (muda com prop)
- [ ] Bottom navigation funcional com routing
- [ ] Preview page acessível em `/design-system`
- [ ] Responsive em mobile (375px-428px)

## Dependencies

- **Story 0.1** — Project Setup (Next.js + Tailwind necessários)

## Blocked By

- Story 0.1

## Next Story

→ **Story 1.1** — Auth com Supabase (email + Google login)

---

*Story criada por River (SM) — AIOS*
