# Story 1.2 — Onboarding DISC (3 Perguntas Cenario)

**Epic:** E1 — Auth & Onboarding
**Prioridade:** MUST
**Pontos:** 5
**Fase:** 1 (Semana 3-4)
**Assignee:** @dev
**Status:** [ ] To Do

---

## Descricao

Como **novo utilizador**, quero responder a 3 perguntas de cenario durante o onboarding, para que a FYVR descubra o meu perfil DISC (D/I/S/C) e adapte toda a experiencia — treinos, comunicacao, e motivacao — a minha personalidade.

## Contexto

O perfil DISC e o coracao da diferenciacao da FYVR. Em vez de tratar toda a gente igual, a app detecta se a pessoa e Dominante (D), Influente (I), Estavel (S), ou Conforme (C) e adapta TUDO: tom das mensagens, tipo de motivacao, layout da UI, e estilo dos push notifications.

No MVP, a deteccao e feita com 3 perguntas de cenario — cada uma com 4 opcoes, onde cada opcao mapeia para um dos 4 perfis DISC. O perfil primario e determinado pelo que tiver 2+ respostas iguais.

**Ref PRD:** Seccao 4.3 — Diferenciador DISC, Seccao 5.1 — Feature F2 (Onboarding DISC)
**Ref Arquitectura:** Seccao 8.1 — Fluxo de Onboarding (DISC Detection), Seccao 4.3 — Design System DISC-Adaptive UI

## Acceptance Criteria

- [ ] **AC1:** Ecra de boas-vindas (`/onboarding`) exibido apos primeiro registo:
  - Titulo: "Vamos conhecer-te em 30 segundos"
  - Subtitulo explicativo: "3 perguntas rapidas para personalizar a tua experiencia"
  - Botao "Comecar" que inicia o questionario
- [ ] **AC2:** Pergunta 1 — Cenario pos-treino (ecra dedicado):
  - Pergunta: "Acabaste um treino duro. O que fazes a seguir?"
  - Opcao A (D): "Verifico os meus tempos. Bati o record? Se nao, amanha bato."
  - Opcao B (I): "Tiro uma foto e partilho com os amigos. Bora celebrar!"
  - Opcao C (S): "Sento-me calmamente, respiro fundo. Amanha continuo no meu ritmo."
  - Opcao D (C): "Abro a app e analiso os dados: calorias, pace, volume total."
  - UI: 4 cards clicaveis, cada um com o texto da opcao
- [ ] **AC3:** Pergunta 2 — Motivacao diaria (ecra dedicado):
  - Pergunta: "O que mais te motiva a treinar?"
  - Opcao A (D): "Superar-me. Ser melhor do que ontem."
  - Opcao B (I): "Treinar com amigos ou fazer parte de um grupo."
  - Opcao C (S): "Manter a rotina. Saber que estou a cuidar de mim."
  - Opcao D (C): "Ver os numeros a subir. Dados nao mentem."
  - UI: 4 cards clicaveis, mesma estrutura da Pergunta 1
- [ ] **AC4:** Pergunta 3 — Perda de motivacao (ecra dedicado):
  - Pergunta: "Quando perdes a motivacao, o que te faz voltar?"
  - Opcao A (D): "Alguem me desafia. Nao aceito perder."
  - Opcao B (I): "Um amigo diz 'vamos juntos'. Sozinho e dificil."
  - Opcao C (S): "Lembro-me que pequenos passos contam. Sem pressao."
  - Opcao D (C): "Revejo o meu progresso. Os dados mostram que vale a pena."
  - UI: 4 cards clicaveis, mesma estrutura
- [ ] **AC5:** Navegacao entre perguntas funcional:
  - Progresso visual: indicador de "1 de 3", "2 de 3", "3 de 3" (progress bar ou dots)
  - Botao "Seguinte" activado apenas apos seleccionar uma opcao
  - Botao "Voltar" disponivel nas perguntas 2 e 3
  - Animacao de transicao suave entre ecras (slide ou fade)
- [ ] **AC6:** Calculo do perfil DISC implementado correctamente:
  - Cada resposta soma +1 ao perfil correspondente (D, I, S, ou C)
  - Scores guardados como objecto: `{ D: 0-3, I: 0-3, S: 0-3, C: 0-3 }`
  - Perfil primario = o que tiver **2 ou mais** respostas
  - Se todas as respostas forem diferentes (1-1-1-0), usar a resposta da **Pergunta 1** como primario (cenario mais revelador)
  - Exemplos de calculo:
    - D, D, S → perfil primario = D (2 respostas)
    - I, I, I → perfil primario = I (3 respostas)
    - D, I, S → perfil primario = D (regra de desempate: Pergunta 1)
- [ ] **AC7:** Ecra de resultado apos a 3a pergunta:
  - Mostra o perfil detectado com titulo personalizado:
    - D: "Es um Dominador! Directo, competitivo, focado em resultados."
    - I: "Es um Influenciador! Social, energetico, adora celebrar."
    - S: "Es um Estabilizador! Calmo, consistente, valoriza a rotina."
    - C: "Es um Analitico! Preciso, focado em dados e tecnica."
  - Breve descricao de como a app se vai adaptar (1-2 frases)
  - Botao "Continuar" que avanca para a criacao de perfil (Story 1.3)
- [ ] **AC8:** Dados guardados na base de dados:
  - `profiles.disc_profile` actualizado com o perfil primario ('D', 'I', 'S', ou 'C')
  - `profiles.disc_scores` actualizado com o objecto de scores: `{"D": 1, "I": 0, "S": 2, "C": 0}`
  - `profiles.disc_detected_at` actualizado com timestamp actual
  - Update feito via `supabase.from('profiles').update(...)` com o ID do user autenticado
- [ ] **AC9:** UI segue o Design System FYVR:
  - Fundo escuro, tipografia bold para perguntas
  - Cards de opcao com borda accent (#FF4500) quando seleccionados
  - Estado visual claro de "seleccionado" vs "nao seleccionado"
  - Mobile-first, funciona em 320px-428px de largura
  - Transicoes suaves (Framer Motion ou CSS transitions)

## Technical Notes

- A pagina `/onboarding` fica em `src/app/(auth)/onboarding/page.tsx`
- Usar React state local (`useState`) para gerir as respostas das 3 perguntas antes de submeter
- As perguntas e opcoes devem estar num array/constante para facilitar manutencao (nao hardcoded no JSX)
- Estrutura sugerida para os dados das perguntas:
  ```typescript
  // lib/maas/disc.ts
  interface DISCQuestion {
    id: number
    question: string
    options: {
      text: string
      profile: 'D' | 'I' | 'S' | 'C'
    }[]
  }
  ```
- O calculo do perfil pode ficar em `lib/maas/disc.ts` como funcao utilitaria `calculateDISCProfile(answers)`
- O onboarding so e acessivel para users sem `disc_profile` — users com perfil ja definido devem ser redirecionados para `/today`
- Considerar usar Framer Motion para animacoes de transicao (ja incluido no stack)

## Ficheiros a Criar/Modificar

```
src/app/(auth)/onboarding/page.tsx     # Pagina de onboarding (3 ecras + resultado)
src/lib/maas/disc.ts                   # Perguntas DISC + funcao calculateDISCProfile()
src/types/user.ts                      # Tipo DISCProfile (se nao existir)
```

## Definition of Done

- [ ] Codigo commitado no branch `feature/1.2-disc-onboarding`
- [ ] 3 ecras de perguntas navegaveis (frente e tras)
- [ ] Cada opcao mapeia correctamente para D, I, S, ou C
- [ ] Calculo do perfil funciona para todos os cenarios (2+ iguais, e desempate)
- [ ] Perfil guardado correctamente em `profiles.disc_profile` e `profiles.disc_scores`
- [ ] Ecra de resultado mostra perfil com descricao
- [ ] `npm run build` passa sem erros

## Dependencies

- **Story 1.1** — Auth (utilizador tem de estar autenticado para aceder ao onboarding)

## Blocked By

- Story 1.1

## Next Story

-> **Story 1.3** — Criacao de perfil (profile + DISC save)

---

*Story criada por River (SM) — AIOS*
