# Story 1.4 — Auth Middleware + Protected Routes

**Epic:** E1 — Auth & Onboarding
**Prioridade:** MUST
**Pontos:** 3
**Fase:** 1 (Semana 3-4)
**Assignee:** @dev
**Status:** [ ] To Do

---

## Descricao

Como **developer**, quero ter um middleware de autenticacao no Next.js que proteja as rotas da app, para que utilizadores nao autenticados sejam redirecionados para o login e utilizadores autenticados nao acedam a paginas de auth desnecessariamente.

## Contexto

A FYVR tem dois tipos de rotas: publicas (qualquer pessoa pode aceder) e protegidas (so utilizadores autenticados). O middleware do Next.js interceta TODOS os pedidos antes de renderizar a pagina, verificando se existe sessao activa no Supabase. Isto garante seguranca sem repetir logica de auth em cada pagina.

Alem de proteger rotas, o middleware tambem trata o fluxo de onboarding — se um utilizador autenticado ainda nao completou o onboarding (sem `disc_profile`), e redirecionado para `/onboarding` em vez de ver o conteudo da app.

**Ref PRD:** Seccao 5.1 — Feature F9 (Auth + Perfil)
**Ref Arquitectura:** Seccao 3.2 — Fluxo de Dados (Auth Check), Seccao 4.1 — Estrutura (`lib/supabase/middleware.ts`), Seccao 6.1 — Camadas de Seguranca

## Acceptance Criteria

- [ ] **AC1:** Middleware do Next.js (`middleware.ts`) implementado na raiz do projecto:
  - Ficheiro `middleware.ts` na raiz `src/middleware.ts` (ou raiz do projecto, conforme config Next.js)
  - Executa em TODOS os pedidos configurados no `matcher`
  - Usa `@supabase/ssr` para verificar sessao
- [ ] **AC2:** Rotas publicas definidas e acessiveis SEM autenticacao:
  - `/login` — pagina de login
  - `/register` — pagina de registo
  - `/` — landing page (futura, por agora pode redirecionar para `/login`)
  - `/auth/callback` — OAuth callback handler
  - Ficheiros estaticos (`_next/`, imagens, favicon, manifest.json, sw.js)
- [ ] **AC3:** Rotas protegidas definidas e acessiveis APENAS com autenticacao:
  - `/today` — treino diario (home)
  - `/progress` — progresso e metricas
  - `/tribe` — feed da comunidade
  - `/profile` — perfil e definicoes
  - `/onboarding` — onboarding DISC (requer auth mas nao requer perfil completo)
  - `/onboarding/profile` — criacao de perfil (requer auth mas nao requer perfil completo)
- [ ] **AC4:** Redirect de utilizadores NAO autenticados:
  - Aceder a qualquer rota protegida sem sessao → redirect para `/login`
  - O redirect preserva a rota original como query param: `/login?redirect=/today`
  - Apos login com sucesso, redirecionar para a rota original (se existir no query param)
- [ ] **AC5:** Redirect de utilizadores autenticados em paginas de auth:
  - Utilizador autenticado que acede a `/login` → redirect para `/today`
  - Utilizador autenticado que acede a `/register` → redirect para `/today`
  - Excepcao: se o user nao tem `disc_profile`, redirect para `/onboarding` em vez de `/today`
- [ ] **AC6:** Verificacao de onboarding completo no middleware:
  - Utilizador autenticado SEM `disc_profile` que acede a rotas protegidas (excepto `/onboarding` e `/onboarding/profile`) → redirect para `/onboarding`
  - Utilizador autenticado COM `disc_profile` que acede a `/onboarding` → redirect para `/today`
  - Isto garante que ninguem usa a app sem completar o onboarding
- [ ] **AC7:** Matcher do middleware configurado correctamente:
  - Nao interceptar ficheiros estaticos: `_next/static`, `_next/image`, `favicon.ico`, `manifest.json`, `sw.js`, `icon-*.png`
  - Interceptar todas as outras rotas
  - Config exemplo:
    ```typescript
    export const config = {
      matcher: [
        '/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|icon-.*\\.png).*)',
      ],
    }
    ```
- [ ] **AC8:** Sessao do Supabase refrescada no middleware:
  - O middleware chama `supabase.auth.getUser()` para validar e refrescar a sessao
  - Cookies de sessao actualizados automaticamente na response
  - Segue o padrao oficial Supabase + Next.js middleware
- [ ] **AC9:** Middleware nao bloqueia performance:
  - Execucao rapida (sem queries pesadas a DB no middleware)
  - Para a verificacao de `disc_profile` (AC6), usar uma abordagem eficiente:
    - Opcao A: guardar flag `onboarding_complete` num cookie apos completar onboarding
    - Opcao B: fazer query leve a `profiles` (apenas `disc_profile` column) — aceitavel no MVP
  - Se a query falhar (erro de rede), permitir o acesso em vez de bloquear (fail-open no MVP)

## Technical Notes

- O Supabase ja tem um padrao oficial de middleware para Next.js App Router — seguir esse padrao
- O ficheiro `lib/supabase/middleware.ts` (criado na Story 0.2) deve conter a funcao `updateSession()` que o middleware chama
- A logica do middleware e:
  1. Criar Supabase client com cookies do request
  2. Chamar `getUser()` para validar sessao
  3. Verificar se a rota e publica ou protegida
  4. Se protegida e sem sessao → redirect para `/login`
  5. Se auth page e com sessao → redirect para `/today` (ou `/onboarding`)
  6. Se rota protegida (excepto onboarding) e sem `disc_profile` → redirect para `/onboarding`
- Cuidado com loops infinitos de redirect — garantir que `/onboarding` nao redireciona para si mesmo
- A verificacao de `disc_profile` pode ser feita com `supabase.from('profiles').select('disc_profile').eq('id', user.id).single()` — query leve e rapida

## Fluxo do Middleware (Diagrama)

```
Request chega ao middleware
    |
    v
Rota e publica? (/login, /register, /, /auth/callback, static)
    |-- SIM --> Deixar passar
    |-- NAO --> Continuar
    v
Tem sessao activa? (supabase.auth.getUser())
    |-- NAO --> Redirect para /login?redirect=[rota-original]
    |-- SIM --> Continuar
    v
Rota e /login ou /register?
    |-- SIM --> Redirect para /today (ou /onboarding se sem disc_profile)
    |-- NAO --> Continuar
    v
Tem disc_profile preenchido?
    |-- NAO e rota NAO e /onboarding* --> Redirect para /onboarding
    |-- SIM e rota e /onboarding --> Redirect para /today
    |-- Caso contrario --> Deixar passar
```

## Ficheiros a Criar/Modificar

```
src/middleware.ts                       # Middleware principal do Next.js
src/lib/supabase/middleware.ts          # Funcao updateSession() (modificar se ja existe)
```

## Definition of Done

- [ ] Codigo commitado no branch `feature/1.4-auth-middleware`
- [ ] Rotas protegidas inacessiveis sem login (redirect para `/login`)
- [ ] Rotas de auth inacessiveis com login (redirect para `/today`)
- [ ] Onboarding incompleto bloqueia acesso a app (redirect para `/onboarding`)
- [ ] Onboarding completo bloqueia acesso a `/onboarding` (redirect para `/today`)
- [ ] Redirect com query param funciona (volta a rota original apos login)
- [ ] Sem loops infinitos de redirect
- [ ] Ficheiros estaticos e API routes nao sao bloqueados
- [ ] `npm run build` passa sem erros

## Dependencies

- **Story 1.1** — Auth (sistema de login/registo implementado)
- **Story 0.2** — Supabase Setup (middleware client configurado em `lib/supabase/middleware.ts`)

## Blocked By

- Story 1.1

## Next Story

-> **Story 2.1** — MaaS Engine (Edge Function + Claude API integration)

---

*Story criada por River (SM) — AIOS*
