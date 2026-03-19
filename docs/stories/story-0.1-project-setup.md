# Story 0.1 — Setup do Repositório, Next.js 15, Tailwind, PWA

**Epic:** E0 — Project Setup
**Prioridade:** MUST
**Pontos:** 3
**Fase:** 0 (Semana 1)
**Assignee:** @dev
**Status:** [ ] To Do

---

## Descrição

Como **developer**, quero ter o projecto FYVR configurado com Next.js 15, Tailwind CSS, e PWA support, para que toda a equipa possa começar a desenvolver features sobre uma base sólida.

## Contexto

A FYVR é uma PWA (Progressive Web App) de treino híbrido. O projecto base precisa de Next.js 15 (App Router), React 19, Tailwind CSS, e configuração PWA com Service Worker e manifest.json.

**Ref PRD:** Secção 9.1 — Stack Recomendado
**Ref Arquitectura:** Secção 2.1 — Stack Seleccionado, Secção 4.1 — Estrutura de Pastas

## Acceptance Criteria

- [ ] **AC1:** Projecto Next.js 15 criado com App Router (`src/app/`)
- [ ] **AC2:** Tailwind CSS configurado e funcional
- [ ] **AC3:** PWA manifest.json configurado com:
  - name: "FYVR"
  - short_name: "FYVR"
  - theme_color: "#FF4500"
  - background_color: "#000000"
  - display: "standalone"
  - start_url: "/today"
  - icons (192x192 e 512x512)
- [ ] **AC4:** Service Worker básico registado (offline fallback)
- [ ] **AC5:** Estrutura de pastas criada conforme Arquitectura Secção 4.1:
  ```
  src/
  ├── app/(auth)/
  ├── app/(main)/today/
  ├── app/(main)/progress/
  ├── app/(main)/tribe/
  ├── app/(main)/profile/
  ├── components/ui/
  ├── components/workout/
  ├── components/tribe/
  ├── components/progress/
  ├── components/maas/
  ├── lib/supabase/
  ├── lib/maas/
  ├── lib/stripe/
  ├── lib/utils/
  ├── hooks/
  ├── types/
  └── styles/
  ```
- [ ] **AC6:** Deploy no Vercel funcional (auto-deploy on push)
- [ ] **AC7:** Ficheiro `.env.local.example` com todas as variáveis de ambiente necessárias:
  ```
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_ANON_KEY=
  SUPABASE_SERVICE_ROLE_KEY=
  ANTHROPIC_API_KEY=
  STRIPE_SECRET_KEY=
  STRIPE_WEBHOOK_SECRET=
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
  ONESIGNAL_APP_ID=
  ```
- [ ] **AC8:** `npm run dev` funciona sem erros
- [ ] **AC9:** `npm run build` passa sem erros

## Technical Notes

- Usar `npx create-next-app@latest` com TypeScript, App Router, Tailwind, src/ directory
- PWA: usar `next-pwa` package ou configuração manual de Service Worker
- Tema FYVR: fundo preto (#000), accent (#FF4500 — laranja/vermelho energético)
- Não instalar Supabase/Stripe nesta story — apenas criar a estrutura de pastas

## Definition of Done

- [ ] Código commitado no branch `feature/0.1-project-setup`
- [ ] Build passa sem erros
- [ ] Deploy no Vercel funciona
- [ ] PWA installável no mobile (manifest válido)
- [ ] README actualizado com instruções de setup

## Dependencies

- Nenhuma (primeira story)

## Blocked By

- Nenhum

## Next Story

→ **Story 0.2** — Setup Supabase (projecto, schema SQL, RLS)

---

*Story criada por River (SM) — AIOS*
