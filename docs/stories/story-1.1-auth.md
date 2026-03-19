# Story 1.1 — Auth com Supabase (Email + Google Login)

**Epic:** E1 — Auth & Onboarding
**Prioridade:** MUST
**Pontos:** 5
**Fase:** 1 (Semana 3-4)
**Assignee:** @dev
**Status:** [ ] To Do

---

## Descricao

Como **utilizador**, quero poder registar-me e fazer login na FYVR com email/password ou com a minha conta Google, para que consiga aceder a uma experiencia personalizada e segura.

## Contexto

A autenticacao e a porta de entrada da FYVR. Sem auth, nenhuma feature funciona -- nao ha perfil, nao ha DISC, nao ha treinos personalizados. O Supabase Auth e o servico escolhido porque inclui email + social login (Google OAuth) no free tier, com session management automatico e integracao nativa com o Next.js App Router.

**Ref PRD:** Seccao 5.1 — Feature F9 (Auth + Perfil), Seccao 9.1 — Stack Recomendado (Supabase Auth)
**Ref Arquitectura:** Seccao 3.2 — Fluxo de Dados Principal (Auth Check), Seccao 4.1 — Estrutura de Pastas (`(auth)/login`, `(auth)/register`), Seccao 6.1 — Camadas de Seguranca

## Acceptance Criteria

- [ ] **AC1:** Pagina de registo (`/register`) criada com formulario funcional:
  - Campo email (validacao de formato)
  - Campo password (minimo 6 caracteres)
  - Botao "Criar Conta" que regista via `supabase.auth.signUp()`
  - Botao "Continuar com Google" para OAuth
  - Link "Ja tens conta? Entra aqui" que redireciona para `/login`
- [ ] **AC2:** Pagina de login (`/login`) criada com formulario funcional:
  - Campo email
  - Campo password
  - Botao "Entrar" que autentica via `supabase.auth.signInWithPassword()`
  - Botao "Continuar com Google" para OAuth
  - Link "Nao tens conta? Cria aqui" que redireciona para `/register`
- [ ] **AC3:** Google OAuth configurado no Supabase Dashboard:
  - Google OAuth provider activo no Supabase (Authentication > Providers)
  - Client ID e Client Secret configurados (Google Cloud Console)
  - Callback URL configurado: `https://<supabase-project>.supabase.co/auth/v1/callback`
  - Login com Google funciona tanto no `/login` como no `/register`
- [ ] **AC4:** Session management implementado:
  - Apos login com sucesso, sessao guardada automaticamente pelo Supabase
  - Utilizador permanece logado entre sessoes (refresh token)
  - Funcao de logout disponivel (`supabase.auth.signOut()`)
- [ ] **AC5:** Redirect logic implementada apos autenticacao:
  - Utilizador **novo** (sem `disc_profile` na tabela `profiles`) → redireciona para `/onboarding`
  - Utilizador **existente** (com `disc_profile` preenchido) → redireciona para `/today`
  - Logica verifica `profiles.disc_profile IS NULL` para decidir o redirect
- [ ] **AC6:** Callback route (`/auth/callback`) criada para processar OAuth redirects:
  - Route handler em `src/app/auth/callback/route.ts`
  - Troca o `code` por sessao via `supabase.auth.exchangeCodeForSession()`
  - Redireciona para `/onboarding` ou `/today` conforme AC5
- [ ] **AC7:** Tratamento de erros implementado:
  - Email ja registado → mensagem "Este email ja esta registado"
  - Password demasiado curta → mensagem "Password deve ter pelo menos 6 caracteres"
  - Credenciais invalidas → mensagem "Email ou password incorrectos"
  - Erro de rede → mensagem "Erro de ligacao. Tenta novamente."
  - Mensagens de erro exibidas junto ao formulario (nao em alert)
- [ ] **AC8:** UI segue o Design System FYVR (Story 0.3):
  - Fundo escuro (#000000 ou tema escuro)
  - Cor accent (#FF4500) nos botoes primarios
  - Tipografia e espacamento consistentes com o design system
  - Layout responsivo (mobile-first, funciona em 320px-428px de largura)
  - Logo FYVR no topo de ambas as paginas
- [ ] **AC9:** Loading states implementados:
  - Botao mostra spinner/loading durante o pedido de auth
  - Formulario desactivado durante o pedido (evita double-submit)

## Technical Notes

- Usar `@supabase/ssr` para integracao com Next.js App Router (Server Components + Client Components)
- O Supabase client do browser (`lib/supabase/client.ts`) ja deve existir da Story 0.2
- O trigger `on_auth_user_created` (Story 0.2) cria automaticamente uma row em `profiles` quando o user se regista — nao e preciso criar manualmente
- Para Google OAuth, usar `supabase.auth.signInWithOAuth({ provider: 'google' })` com `redirectTo` para o callback
- As paginas de login/register sao Client Components (`'use client'`) porque precisam de estado e interactividade
- Rota de callback e um Route Handler (Server-side) que processa o token
- Variavel de ambiente necessaria: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (ja configuradas na Story 0.2)
- Para o redirect logic (AC5), fazer query a `profiles` apos auth para verificar `disc_profile`

## Ficheiros a Criar/Modificar

```
src/app/(auth)/login/page.tsx          # Pagina de login
src/app/(auth)/register/page.tsx       # Pagina de registo
src/app/auth/callback/route.ts         # OAuth callback handler
src/components/ui/AuthForm.tsx         # Componente reutilizavel de formulario (opcional)
```

## Definition of Done

- [ ] Codigo commitado no branch `feature/1.1-auth`
- [ ] Registo com email/password funciona e cria user no Supabase
- [ ] Login com email/password funciona e redireciona correctamente
- [ ] Login com Google funciona end-to-end
- [ ] Redirect para `/onboarding` funciona para novos users
- [ ] Redirect para `/today` funciona para users existentes
- [ ] Erros mostrados correctamente ao utilizador
- [ ] `npm run build` passa sem erros

## Dependencies

- **Story 0.1** — Project Setup (Next.js base, estrutura de pastas)
- **Story 0.2** — Supabase Setup (client configurado, tabela `profiles` criada, trigger `on_auth_user_created`)

## Blocked By

- Story 0.1, Story 0.2

## Next Story

-> **Story 1.2** — Onboarding DISC (3 perguntas cenario)

---

*Story criada por River (SM) — AIOS*
