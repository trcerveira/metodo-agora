# Story 2.3 — Daily Check-in (Mood 1-5 + State Adjustment)

**Epic:** E2 — MaaS Engine & DISC
**Prioridade:** MUST
**Pontos:** 3
**Fase:** 1 (Semana 3-5)
**Assignee:** @dev
**Status:** [ ] To Do

---

## Descrição

Como **utilizador da FYVR**, quero fazer um check-in rápido de "como me sinto hoje" antes de treinar, para que a app adapte a intensidade do treino e o tom das mensagens ao meu estado actual.

## Contexto

O check-in diário é a variável A(t) da equação MaaS — a capacidade do receptor no momento. Se o utilizador está cansado (mood 1-2), não faz sentido empurrá-lo para um treino pesado com linguagem agressiva. Se está energético (mood 4-5), pode ir mais longe.

Este componente é o ponto de entrada do Daily Loop — é a primeira coisa que o utilizador vê quando abre a app e ainda não tem treino gerado para hoje. O mood capturado alimenta o MaaS Engine (Story 2.1) que gera o treino e as mensagens adaptadas.

**Ref PRD:** Secção 5.1 — Feature F4 (Check-in Diário), Secção 4.2 — Variável A(t)
**Ref Arquitectura:** Secção 3.2 — Fluxo de Dados Principal, Secção 8.2 — Daily Loop

## Acceptance Criteria

- [ ] **AC1:** Componente `MoodSelector` criado em `components/workout/CheckIn.tsx`
- [ ] **AC2:** Interface visual com escala de 1 a 5:
  ```
  ┌─────────────────────────────────────┐
  │                                     │
  │     Como te sentes hoje?            │
  │                                     │
  │     1     2     3     4     5       │
  │     😴    😐    🙂    😊    🔥      │
  │   Exausto Meh  Okay  Bem  On Fire  │
  │                                     │
  │     [  Seleccionar  ]               │
  │                                     │
  └─────────────────────────────────────┘
  ```
- [ ] **AC3:** Cada nível de mood tem:
  - Ícone/emoji representativo
  - Label descritivo em português
  - Cor associada (1=cinzento, 2=amarelo escuro, 3=amarelo, 4=verde, 5=laranja FYVR)
- [ ] **AC4:** Selector é interactivo com feedback visual:
  - Toque/clique selecciona o mood
  - Opção seleccionada fica destacada (escala, cor, animação)
  - Animação suave com Framer Motion ao seleccionar
- [ ] **AC5:** Mood seleccionado é guardado no campo `pre_mood` da tabela `workouts`:
  ```typescript
  // Ao submeter o check-in
  const { error } = await supabase
    .from('workouts')
    .upsert({
      user_id: user.id,
      date: today,
      pre_mood: selectedMood,
      status: 'pending'
    })
  ```
- [ ] **AC6:** Após selecção do mood, a app chama o MaaS Engine (Story 2.1) com o mood como input
- [ ] **AC7:** Regras de ajuste de intensidade baseadas no mood:
  | Mood | Ajuste de Treino | Ajuste de Tom MaaS |
  |------|-----------------|-------------------|
  | 1 (Exausto) | Recovery workout ou -40% volume | Gentil, sem pressão (override DISC) |
  | 2 (Meh) | -30% volume, exercícios mais simples | Encorajador, leve |
  | 3 (Okay) | Treino normal (100%) | Tom DISC normal |
  | 4 (Bem) | Treino normal, pode ter bónus | Tom DISC normal, energético |
  | 5 (On Fire) | +10% volume, desafio extra | Tom DISC máximo, push |
- [ ] **AC8:** Se o utilizador já fez check-in hoje, não mostrar novamente — ir directo ao treino
- [ ] **AC9:** Verificação: se mood = 1, mostrar mensagem de cuidado:
  ```
  "Tudo bem descansar. Hoje temos um treino leve só para ti.
   Se não te sentes bem fisicamente, podes saltar. Cuida-te."
  ```
- [ ] **AC10:** Hook `useCheckIn` criado em `hooks/useCheckIn.ts`:
  ```typescript
  export function useCheckIn() {
    return {
      todaysMood: number | null,     // mood já submetido hoje
      hasDoneCheckIn: boolean,       // já fez check-in hoje?
      submitMood: (mood: number) => Promise<void>,
      isLoading: boolean,
      error: string | null
    }
  }
  ```
- [ ] **AC11:** Componente responsivo (funciona em 375px-428px)
- [ ] **AC12:** Transição suave do check-in para o ecrã de treino (Framer Motion fade/slide)

## Technical Notes

- O `MoodSelector` já está listado na Story 0.3 como componente do Design System — esta story implementa a lógica completa
- A tabela `workouts` já tem o campo `pre_mood INTEGER CHECK (pre_mood BETWEEN 1 AND 5)` (definido na Story 0.2)
- Usar `upsert` para evitar duplicados — se o utilizador já tem workout para hoje, apenas actualizar o `pre_mood`
- O mood é passado ao MaaS Engine como parâmetro `mood` no `MaaSInput`
- Para moods 1-2, o MaaS Engine deve incluir instrução extra no prompt: "O utilizador está cansado. Sê mais gentil independentemente do perfil DISC."
- A label de cada mood deve ser amigável e curta:
  ```typescript
  const MOOD_LABELS = {
    1: 'Exausto',
    2: 'Meh',
    3: 'Okay',
    4: 'Bem',
    5: 'On Fire'
  }
  ```
- Considerar guardar histórico de moods para análise futura (o campo `pre_mood` na tabela `workouts` já cobre isto)

## Estrutura de Ficheiros

```
src/
├── components/
│   └── workout/
│       └── CheckIn.tsx       # Componente MoodSelector completo
├── hooks/
│   └── useCheckIn.ts         # Hook para lógica de check-in
└── lib/
    └── maas/
        └── mood.ts           # MOOD_LABELS, regras de ajuste de intensidade
```

## Definition of Done

- [ ] Código commitado no branch `feature/2.3-daily-checkin`
- [ ] Componente MoodSelector renderiza correctamente nos 5 estados
- [ ] Mood guardado na tabela `workouts.pre_mood`
- [ ] Check-in não aparece se já foi feito hoje
- [ ] Mood passa correctamente para o MaaS Engine
- [ ] Animações suaves com Framer Motion
- [ ] Responsivo em mobile (375px-428px)
- [ ] Mensagem de cuidado aparece quando mood = 1

## Dependencies

- **Story 1.1** — Auth com Supabase (utilizador autenticado necessário para guardar mood)

## Blocked By

- Story 1.1

## Next Story

→ **Story 2.4** — DISC-Adaptive UI (temas, CTAs, layout por perfil)

---

*Story criada por River (SM) — AIOS*