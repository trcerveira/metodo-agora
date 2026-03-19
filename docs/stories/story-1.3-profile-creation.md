# Story 1.3 — Criacao de Perfil (Profile + DISC Save)

**Epic:** E1 — Auth & Onboarding
**Prioridade:** MUST
**Pontos:** 3
**Fase:** 1 (Semana 3-4)
**Assignee:** @dev
**Status:** [ ] To Do

---

## Descricao

Como **novo utilizador**, apos completar o questionario DISC, quero preencher o meu perfil com nome, nivel de treino, horario preferido e objectivos, para que a FYVR possa gerar treinos adaptados ao meu contexto real.

## Contexto

Apos o onboarding DISC (Story 1.2), o utilizador ainda nao tem informacao de treino preenchida. Esta story recolhe os dados necessarios para que o MaaS Engine (Epic E2) e o sistema de treinos (Epic E3) funcionem correctamente. Os dados sao guardados na tabela `profiles` do Supabase, que ja foi criada na Story 0.2.

A row em `profiles` ja existe neste ponto — foi criada automaticamente pelo trigger `on_auth_user_created` (Story 0.2) com valores por defeito. Esta story faz UPDATE dos campos adicionais.

**Ref PRD:** Seccao 5.1 — Feature F9 (Auth + Perfil), Seccao 4.3 — Perfil DISC
**Ref Arquitectura:** Seccao 5.1 — Schema `profiles` (campos `training_level`, `preferred_time`, `goals`, `display_name`)

## Acceptance Criteria

- [ ] **AC1:** Ecra de criacao de perfil (`/onboarding/profile`) exibido apos ecra de resultado DISC:
  - Titulo: "Quase la! Conta-nos mais sobre ti."
  - Subtitulo com o perfil DISC detectado: "Perfil: [D/I/S/C] — [descricao curta]"
- [ ] **AC2:** Campo "Nome" (display name) implementado:
  - Input de texto para o nome que aparecera na app e na Tribo
  - Pre-preenchido com o nome do Google (se login via OAuth) ou vazio
  - Validacao: obrigatorio, minimo 2 caracteres, maximo 30 caracteres
  - Placeholder: "Como queres ser conhecido?"
- [ ] **AC3:** Campo "Nivel de treino" implementado com selector visual (1-5):
  - Nivel 1: "Iniciante total — nunca treinei ou voltei agora"
  - Nivel 2: "Iniciante — treino ha menos de 3 meses"
  - Nivel 3: "Intermedio — treino regularmente ha 3-12 meses"
  - Nivel 4: "Avancado — treino ha mais de 1 ano"
  - Nivel 5: "Atleta — treino intensamente ha anos"
  - UI: 5 opcoes clicaveis (cards ou botoes com descricao)
  - Default: nenhum seleccionado (obrigatorio escolher)
- [ ] **AC4:** Campo "Horario preferido" implementado:
  - 3 opcoes: "Manha" (morning), "Tarde" (afternoon), "Noite" (evening)
  - UI: 3 botoes/cards com icone representativo (sol, sol com nuvem, lua)
  - Default: nenhum seleccionado (obrigatorio escolher)
  - Valor guardado: `morning`, `afternoon`, ou `evening` em `profiles.preferred_time`
- [ ] **AC5:** Campo "Objectivos" implementado (seleccao multipla):
  - Opcoes disponiveis:
    - "Resistencia" (endurance) — melhorar corrida e cardio
    - "Forca" (strength) — ganhar forca e musculo
    - "Hibrido" (hybrid) — equilibrio entre corrida e forca
    - "Perder peso" (weight_loss) — composicao corporal
  - UI: 4 opcoes clicaveis, multipla seleccao permitida (minimo 1 obrigatoria)
  - Estado visual claro: seleccionado (com borda accent) vs nao seleccionado
  - Valores guardados como array em `profiles.goals`: `["endurance", "strength"]`
- [ ] **AC6:** Botao "Comecar a treinar" no final do formulario:
  - Activo apenas quando todos os campos obrigatorios estao preenchidos (nome + nivel + horario + pelo menos 1 objectivo)
  - Desactivado (grayed out) enquanto faltar algum campo
  - Ao clicar: guarda todos os dados e redireciona para `/today`
- [ ] **AC7:** Dados guardados correctamente na tabela `profiles`:
  - `profiles.display_name` → nome introduzido
  - `profiles.training_level` → valor 1-5
  - `profiles.preferred_time` → 'morning', 'afternoon', ou 'evening'
  - `profiles.goals` → array de strings (ex: `["hybrid", "weight_loss"]`)
  - `profiles.updated_at` → timestamp actual
  - Update via `supabase.from('profiles').update({...}).eq('id', user.id)`
- [ ] **AC8:** Tratamento de erros:
  - Erro de rede → mensagem "Erro ao guardar perfil. Tenta novamente."
  - Campos invalidos → mensagem de validacao junto ao campo
  - Botao mostra loading durante o save
- [ ] **AC9:** UI segue o Design System FYVR:
  - Fundo escuro, accent nos elementos interactivos
  - Mobile-first (320px-428px)
  - Espacamento confortavel entre campos (formulario nao parece apertado)
  - Scroll suave se o conteudo exceder a altura do ecra

## Technical Notes

- Esta pagina pode ser uma continuacao do fluxo de onboarding ou uma rota separada (`/onboarding/profile`)
- O perfil DISC ja foi guardado na Story 1.2 — esta story so actualiza os campos de treino
- Para pre-preencher o nome via Google, aceder a `user.user_metadata.full_name` do Supabase Auth
- Os valores de `equipment` (definidos no schema) nao sao recolhidos no MVP — ficam com o default `[]`
- Considerar agrupar o formulario num unico ecra com scroll, ou dividir em 2-3 steps (decisao de UX do developer)
- Apos o save com sucesso, o utilizador tem perfil completo e nunca mais ve o onboarding

## Ficheiros a Criar/Modificar

```
src/app/(auth)/onboarding/profile/page.tsx   # Ecra de criacao de perfil
src/types/user.ts                            # Adicionar tipos para TrainingLevel, Goal, etc.
```

## Definition of Done

- [ ] Codigo commitado no branch `feature/1.3-profile-creation`
- [ ] Formulario recolhe nome, nivel, horario e objectivos
- [ ] Dados guardados correctamente na tabela `profiles` do Supabase
- [ ] Validacao funciona (campos obrigatorios, limites)
- [ ] Redirect para `/today` apos save com sucesso
- [ ] `npm run build` passa sem erros

## Dependencies

- **Story 1.2** — Onboarding DISC (perfil DISC deve estar guardado antes desta story)
- **Story 0.2** — Supabase Setup (tabela `profiles` e trigger existem)

## Blocked By

- Story 1.2

## Next Story

-> **Story 1.4** — Auth middleware + protected routes

---

*Story criada por River (SM) — AIOS*
