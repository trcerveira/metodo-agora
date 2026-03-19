# Story 7.1 — Landing Page FYVR

**Epic:** E7 — Landing Page & Launch
**Prioridade:** MUST
**Pontos:** 5
**Fase:** 3 (Semana 12)
**Assignee:** @dev
**Status:** [ ] To Do

---

## Descrição

Como **visitante**, quero ver uma landing page impactante da FYVR na raiz do site que me explique o que é a app, o que a torna diferente, e quanto custa, para que me sinta motivado a registar-me e começar a treinar.

## Contexto

A landing page é a porta de entrada pública da FYVR. É a primeira impressão — e para uma marca faceless como a FYVR, o design e a mensagem têm de falar por si. A inspiração é a Nike: bold, minimal, preto com accent laranja/vermelho, tipografia que grita energia. O tom é directo e contagioso: "Catch the FYVR." A página deve converter visitantes em utilizadores registados.

**Ref PRD:** Secção 1.3 — Slogan "Catch the FYVR", Secção 1.4 — Brand Identity (faceless, Nike-inspired), Secção 7.1 — Pricing
**Ref Arquitectura:** Secção 4.4 — Ecrãs principais, Secção 9.1 — Vercel (hosting)

## Acceptance Criteria

- [ ] **AC1:** Página pública na rota `/` (root do site):
  - Acessível sem autenticação
  - Server-rendered (SSR/SSG) para SEO
  - Meta tags configuradas: title, description, og:image, og:title, og:description
  - `<title>`: "FYVR — Catch the FYVR | Treino Híbrido com IA"
  - `<meta description>`: "App de treino híbrido (corrida + força) com IA adaptativa e comunidade. Nunca mais desistas. 12.99€/mês."
- [ ] **AC2:** Secção Hero no topo:
  - Headline principal: "Catch the FYVR." (grande, bold, impactante)
  - Subheadline: "Treino híbrido com IA que se adapta a ti. Comunidade que não te deixa parar."
  - Botão CTA primário: "Começa Grátis" → link para `/register`
  - Botão CTA secundário: "Vê como funciona" → scroll para secção de features
  - Background escuro (#000000) com accent (#FF4500) nos CTAs
  - Animação subtil de entrada (fade-in + slide-up)
- [ ] **AC3:** Secção "O Problema" (por que existimos):
  - Headline: "50% das pessoas desistem nos primeiros 6 meses."
  - 3-4 pain points em cards ou lista:
    - "Treinos genéricos que não se adaptam"
    - "Comunicação igual para todos"
    - "Sem accountability — treinas sozinho"
    - "Sem progresso visível"
  - Transição: "A FYVR muda isto."
- [ ] **AC4:** Secção "Como Funciona" (3 pilares):
  - 3 cards ou blocos com os pilares anti-desistência:
    - **IA Adaptativa + MaaS**: "A app adapta o treino E a comunicação ao teu perfil. Não és um número — és tu."
    - **Tribo**: "Nunca treinas sozinho. Uma comunidade que te vê, te apoia, e te desafia."
    - **Gamificação**: "Streaks, badges, desafios. Cada treino conta. Cada dia importa."
  - Ícone ou ilustração simples para cada pilar
  - Visual limpo, sem excesso de texto
- [ ] **AC5:** Secção "DISC — Comunicação Personalizada":
  - Headline: "A app que te conhece."
  - Explicação breve do DISC adaptada ao visitante:
    - "Gostas de ser desafiado? A FYVR desafia-te."
    - "Preferes ir ao teu ritmo? A FYVR respeita-te."
    - "Queres dados? A FYVR mostra-te tudo."
    - "Adoras comunidade? A FYVR junta-te à tribo."
  - Visual: 4 mini-cards ou ícones representando D, I, S, C
- [ ] **AC6:** Secção de Pricing (planos):
  - 3 cards lado a lado (ou empilhados em mobile):
    - **Free** (0€): features listadas do tier Free
    - **Pro** (12.99€/mês): features listadas do tier Pro — badge "Mais Popular"
    - **Premium** (24.99€/mês): features listadas do tier Premium
  - CTA em cada card: "Começa Grátis" / "Upgrade para Pro" / "Upgrade para Premium"
  - Todos os CTAs levam a `/register` (regista primeiro, paga depois)
- [ ] **AC7:** Secção de Social Proof (testemunhos/dados):
  - Como a app é nova e faceless, usar dados em vez de testemunhos:
    - "97% das pessoas não podem pagar um PT. A FYVR custa 0.43€ por dia."
    - "Treino híbrido: 72% da Gen Z já faz."
    - "O teu PT de IA. Sempre contigo. Nunca julgando."
  - Design: números grandes com texto de suporte
- [ ] **AC8:** Footer:
  - Logo FYVR
  - Links: Termos de Serviço, Política de Privacidade (podem ser páginas placeholder)
  - Copyright: "© 2026 FYVR. Todos os direitos reservados."
  - "Feito em Portugal 🇵🇹" (opcional, tom humano)
- [ ] **AC9:** Responsividade e performance:
  - Layout responsivo: mobile (320px-428px), tablet (768px), desktop (1024px+)
  - Imagens optimizadas (next/image com lazy loading)
  - Performance: Lighthouse score > 90 em Performance e Acessibilidade
  - Sem imagens pesadas — usar CSS gradients, SVGs, e tipografia bold
- [ ] **AC10:** Navegação no topo:
  - Logo FYVR à esquerda
  - Links de scroll: "Como Funciona", "Planos"
  - Botões à direita: "Entrar" (link para `/login`), "Começa Grátis" (link para `/register`)
  - Navbar fixa (sticky) ao fazer scroll
  - Transparente no topo, com background ao fazer scroll

## Technical Notes

- Usar Next.js Static Generation (`generateStaticParams` ou page sem data fetching) para performance máxima
- Animações: Framer Motion para scroll animations (intersection observer) ou CSS `@keyframes`
- A landing page não deve carregar código do Supabase (não precisa de auth)
- Separar o layout da landing page do layout da app (sem bottom nav, sem sidebar)
- Para SEO: adicionar JSON-LD structured data (WebSite, Product)
- Considerar `next/font` para carregar fontes optimizadas
- O design faceless significa: zero fotos de pessoas reais, zero rostos. Usar formas geométricas, tipografia, e cor

## Ficheiros a Criar/Modificar

```
src/app/page.tsx                            # Landing page principal
src/app/layout.tsx                          # Modificar — separar layout público vs app
src/components/landing/Hero.tsx             # Secção hero
src/components/landing/Problem.tsx          # Secção do problema
src/components/landing/HowItWorks.tsx       # Secção como funciona (3 pilares)
src/components/landing/DISCSection.tsx      # Secção DISC
src/components/landing/Pricing.tsx          # Secção pricing
src/components/landing/SocialProof.tsx      # Secção social proof
src/components/landing/Footer.tsx           # Footer
src/components/landing/Navbar.tsx           # Navegação sticky
```

## Definition of Done

- [ ] Código commitado no branch `feature/7.1-landing-page`
- [ ] Landing page acessível na rota `/` sem autenticação
- [ ] Todas as secções implementadas com conteúdo final
- [ ] CTAs funcionais (links para `/register` e `/login`)
- [ ] Design faceless, bold, Nike-inspired
- [ ] Responsivo em mobile, tablet, e desktop
- [ ] Lighthouse Performance > 90
- [ ] Meta tags e SEO configurados
- [ ] Navbar sticky funcional
- [ ] `npm run build` passa sem erros

## Dependencies

- **Story 0.3** — Design System (cores, tipografia, componentes base)

## Blocked By

- Story 0.3

## Next Story

→ **Story 7.2** — Beta launch setup

---

*Story criada por River (SM) — AIOS*
