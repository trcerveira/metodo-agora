# Story 2.2 — DISC Communication Templates (4 Perfis × Mensagens)

**Epic:** E2 — MaaS Engine & DISC
**Prioridade:** MUST
**Pontos:** 5
**Fase:** 1 (Semana 3-5)
**Assignee:** @dev
**Status:** [ ] To Do

---

## Descrição

Como **utilizador da FYVR**, quero que a app me fale sempre no tom certo para a minha personalidade, mesmo quando a IA não está disponível, para que a experiência seja consistente e nunca genérica.

## Contexto

Os templates DISC são a base da comunicação da FYVR. Cada perfil (D, I, S, C) tem mensagens pré-escritas para 5 contextos diferentes: saudação diária, introdução de treino, pós-treino, notificações e milestones. Estes templates servem dois propósitos:

1. **Fallback** — quando a Claude API está indisponível, a app usa estes templates em vez de falhar
2. **Consistência** — garantem que o tom DISC é mantido em todas as interacções

**Ref PRD:** Secção 4.3 — Perfil DISC (tabela de comunicação por perfil)
**Ref Arquitectura:** Secção 4.3 — Design System DISC-Adaptive UI, Secção 7.2 — Optimização Claude API (templates pré-gerados)

## Acceptance Criteria

- [ ] **AC1:** Ficheiro `lib/maas/templates.ts` criado com todos os templates organizados por perfil DISC
- [ ] **AC2:** Templates de **saudação diária** (greeting) — 5 variações por perfil:
  ```typescript
  const GREETINGS = {
    D: [
      "Bom dia, campeão. Hoje vais esmagar.",
      "Estás pronto? O teu recorde está à espera de ser batido.",
      "Sem desculpas. Hoje é dia de dominar.",
      "Os fracos descansam. Tu treinas.",
      "Mais um dia, mais uma vitória. Vamos."
    ],
    I: [
      "Bom diaaaa! Hoje vai ser incrível!",
      "Olá, estrela! Pronto para arrasar?",
      "O squad está a treinar — bora juntar-nos!",
      "Hoje é dia de celebrar cada rep!",
      "Energia no máximo! Vamos fazer acontecer!"
    ],
    S: [
      "Bom dia. Que bom ver-te de volta.",
      "Mais um dia de consistência. Estás no caminho certo.",
      "Sem pressão. Ao teu ritmo, como sempre.",
      "Cada dia conta. E tu estás aqui. Isso importa.",
      "Bem-vindo de volta. Vamos continuar juntos."
    ],
    C: [
      "Bom dia. Os teus dados de ontem já foram processados.",
      "Análise matinal: condições óptimas para treino.",
      "O teu protocolo de hoje está calculado. Vamos executar.",
      "Baseado nas tuas métricas, hoje é dia de progressão.",
      "Relatório: a tua consistência está acima da média. Continua."
    ]
  }
  ```
- [ ] **AC3:** Templates de **introdução de treino** (workout_intro) — 3 variações por perfil:
  ```typescript
  const WORKOUT_INTRO = {
    D: [
      "O treino de hoje não é para qualquer um. Mostra do que és feito.",
      "Preparado para o desafio? É agora ou nunca.",
      "Este treino vai testar os teus limites. Aceitas?"
    ],
    I: [
      "O treino de hoje está on fire! Vai ser divertido!",
      "Prepara-te para o melhor treino da semana!",
      "Bora lá! Cada exercício é uma celebração!"
    ],
    S: [
      "O treino de hoje é acessível e bem equilibrado. Sem stress.",
      "Vamos com calma, passo a passo. Estou contigo.",
      "Não te preocupes com a perfeição. O importante é fazer."
    ],
    C: [
      "Treino optimizado para o teu nível actual. Volume e intensidade calibrados.",
      "Protocolo de hoje: baseado nos teus dados das últimas sessões.",
      "Cada exercício foi seleccionado para máxima eficiência."
    ]
  }
  ```
- [ ] **AC4:** Templates de **pós-treino** (post_workout) — 3 variações por perfil:
  ```typescript
  const POST_WORKOUT = {
    D: [
      "Dominaste. Amanhã, mais.",
      "Outro treino no bolso. Ninguém te pára.",
      "Os números não mentem — estás a ficar mais forte."
    ],
    I: [
      "CONSEGUISTE! Que orgulho! Partilha com o squad!",
      "Mais um treino épico! O squad vai adorar!",
      "Estás on fire! Amanhã fazemos ainda melhor!"
    ],
    S: [
      "Muito bem. Mais um dia de consistência. Orgulho em ti.",
      "Fizeste o que tinhas de fazer. Descansa e volta amanhã.",
      "Cada treino conta. E tu não falhaste. Parabéns."
    ],
    C: [
      "Treino registado. Dados actualizados nas tuas métricas.",
      "Sessão concluída. Performance dentro dos parâmetros esperados.",
      "Dados guardados. Progressão de +2.3% face à semana anterior."
    ]
  }
  ```
- [ ] **AC5:** Templates de **notificações push** (notifications) — 3 variações por perfil:
  ```typescript
  const NOTIFICATIONS = {
    D: [
      "O teu rival já treinou hoje. E tu?",
      "Dia de descanso? Os campeões não descansam.",
      "O teu streak está em risco. Vai treinar."
    ],
    I: [
      "O squad está à tua espera! Bora treinar!",
      "3 amigos já treinaram hoje. Junta-te!",
      "Não percas a diversão! O treino de hoje está épico!"
    ],
    S: [
      "Quando puderes, o teu treino está à espera. Sem pressa.",
      "Lembra-te: consistência > intensidade. Um treino leve também conta.",
      "O teu streak de {streak} dias merece continuar. Tu consegues."
    ],
    C: [
      "Alerta: o teu horário óptimo de treino é daqui a 30 minutos.",
      "Dados: treinar agora maximiza a tua recuperação antes de amanhã.",
      "Streak actual: {streak} dias. Probabilidade de manter: 87% se treinares hoje."
    ]
  }
  ```
- [ ] **AC6:** Templates de **milestones** (milestones) — para marcos de 7, 30, 60, 90 dias:
  ```typescript
  const MILESTONES = {
    D: {
      7: "7 dias sem parar. Bom começo. Mas os verdadeiros campeões não param aqui.",
      30: "30 dias. Top 15% dos utilizadores. Mas tu queres o top 1%, certo?",
      60: "60 dias. Estás a construir algo sério. Continua a dominar.",
      90: "90 DIAS. Tu és dos que não desistem. Respeito total."
    },
    I: {
      7: "1 SEMANA COMPLETA! Isso merece uma celebração enorme!",
      30: "30 DIAS! O squad está orgulhoso de ti! Partilha esta conquista!",
      60: "60 dias de pura dedicação! Tu és uma inspiração!",
      90: "90 DIAS! LENDA! Tu és a prova de que é possível!"
    },
    S: {
      7: "7 dias seguidos. Que bonito. Estás a criar uma rotina sólida.",
      30: "30 dias. Devagar e sempre. Estás a fazer algo incrível por ti.",
      60: "60 dias de consistência. Isso é raro. Estou orgulhoso de ti.",
      90: "90 dias. Isto já faz parte de quem tu és. Parabéns, de coração."
    },
    C: {
      7: "Marco: 7 dias consecutivos. Probabilidade de manter streak: 62%.",
      30: "Marco: 30 dias. Estás no top 15% de retenção. Dado estatístico relevante.",
      60: "Marco: 60 dias. Padrão de treino estabilizado. Métricas consistentes.",
      90: "Marco: 90 dias. Taxa de desistência após 90 dias: <8%. Estás no grupo de elite."
    }
  }
  ```
- [ ] **AC7:** Função `getFallbackContent()` que retorna conteúdo completo usando templates quando Claude API falha:
  ```typescript
  export function getFallbackContent(
    discProfile: DISCProfile,
    mood: number,
    streakDays: number
  ): MaaSOutput {
    // Selecciona template aleatório do perfil
    // Ajusta tom baseado no mood
    // Retorna MaaSOutput completo com treino genérico
  }
  ```
- [ ] **AC8:** Função `getRandomTemplate()` que selecciona template aleatório sem repetir o último usado:
  ```typescript
  export function getRandomTemplate(
    templates: string[],
    lastUsedIndex?: number
  ): string
  ```
- [ ] **AC9:** Templates suportam variáveis dinâmicas com `{variavel}`:
  - `{streak}` — dias de streak actual
  - `{nome}` — nome do utilizador
  - `{nivel}` — nível de treino
  - Função `interpolateTemplate(template: string, vars: Record<string, string>): string`
- [ ] **AC10:** Treino genérico de fallback incluído para cada nível (1-5) e tipo (hybrid, run, strength, recovery)
- [ ] **AC11:** Todos os templates escritos em **português de Portugal** (não brasileiro)

## Technical Notes

- Organizar templates num objecto bem tipado para facilitar manutenção
- Usar `as const` para type safety nos templates
- A função `getFallbackContent()` é crítica — é chamada pela Story 2.1 quando o Claude API falha
- Para evitar repetição, guardar o `lastUsedIndex` no `localStorage` do browser
- Os templates de fallback devem incluir pelo menos 1 treino genérico por nível:
  ```typescript
  const FALLBACK_WORKOUTS = {
    1: { // Iniciante
      type: 'hybrid',
      exercises: [
        { name: 'Caminhada rápida', duration: '10 min' },
        { name: 'Agachamentos', sets: 3, reps: '10' },
        { name: 'Push-ups (joelhos)', sets: 3, reps: '8' },
        { name: 'Prancha', sets: 3, reps: '20s' }
      ],
      estimatedDuration: 25
    },
    // ... níveis 2-5
  }
  ```
- Considerar extrair templates para ficheiros JSON separados no futuro (para edição sem deploy)

## Estrutura de Ficheiros

```
src/
└── lib/
    └── maas/
        ├── templates.ts          # Todos os templates DISC
        ├── fallback-workouts.ts  # Treinos genéricos de fallback por nível
        └── disc.ts               # Tipos e utilitários DISC (já existe da Story 2.1)
```

## Definition of Done

- [ ] Código commitado no branch `feature/2.2-disc-templates`
- [ ] Todos os 4 perfis DISC têm templates para os 5 contextos
- [ ] Função `getFallbackContent()` retorna `MaaSOutput` válido
- [ ] Variáveis dinâmicas ({streak}, {nome}, {nivel}) interpolam correctamente
- [ ] Templates revistos por falante nativo de português de Portugal
- [ ] Fallback testado: quando Claude API falha, o utilizador recebe conteúdo coerente

## Dependencies

- **Story 2.1** — MaaS Engine (interfaces `MaaSInput` e `MaaSOutput` definidas)

## Blocked By

- Story 2.1

## Next Story

→ **Story 2.3** — Daily Check-in (mood 1-5 + state adjustment)

---

*Story criada por River (SM) — AIOS*