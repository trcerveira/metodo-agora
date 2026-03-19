# Story 2.1 — MaaS Engine (Edge Function + Claude API)

**Epic:** E2 — MaaS Engine & DISC
**Prioridade:** MUST
**Pontos:** 8
**Fase:** 1 (Semana 3-5)
**Assignee:** @dev
**Status:** [ ] To Do

---

## Descrição

Como **utilizador da FYVR**, quero receber mensagens personalizadas que se adaptam ao meu perfil DISC, ao meu estado de espírito e ao meu histórico de treino, para que cada interacção com a app pareça feita à minha medida e me motive a continuar.

## Contexto

O MaaS (Message as a Service) é o diferenciador central da FYVR. Em vez de comunicar de forma genérica com todos os utilizadores, a app usa uma Supabase Edge Function que chama a Claude API (modelo Haiku — rápido e barato) para gerar conteúdo personalizado em tempo real.

A equação MaaS define que o conhecimento transferido (K_e) depende da qualidade do conteúdo (T), do estado actual do receptor A(t), do meio (M), e do amplificador de IA (Amp_IA). Esta story implementa o Amp_IA — o motor que traduz instruções técnicas de treino para a linguagem certa de cada utilizador.

**Ref PRD:** Secção 4.2 — MaaS (Message as a Service), Secção 4.3 — Perfil DISC
**Ref Arquitectura:** Secção 5.2 — Edge Functions, Secção 5.3 — MaaS Engine, Secção 7.2 — Optimização Claude API

## Acceptance Criteria

- [ ] **AC1:** Supabase Edge Function `generate-workout` criada em `supabase/functions/generate-workout/index.ts`
- [ ] **AC2:** Edge Function aceita o seguinte input (interface `MaaSInput`):
  ```typescript
  interface MaaSInput {
    discProfile: 'D' | 'I' | 'S' | 'C'
    mood: number           // 1-5 (do check-in diário)
    trainingLevel: number  // 1-5 (nível do utilizador)
    dayOfWeek: string      // 'monday', 'tuesday', etc.
    streakDays: number     // dias consecutivos de treino
    lastWorkoutDifficulty: string | null  // 'easy' | 'ideal' | 'hard' | null
    weeklyWorkouts: number // treinos já feitos esta semana
  }
  ```
- [ ] **AC3:** 4 system prompts DISC implementados no objecto `DISC_SYSTEM_PROMPTS`:
  ```typescript
  const DISC_SYSTEM_PROMPTS = {
    D: `És um coach de fitness competitivo e directo. Desafia o utilizador.
       Usa frases curtas e poderosas. Foca em records, rankings e performance.
       Nunca sejas suave. Empurra-os. Usa palavras como "domina", "esmaga", "bate".
       Responde SEMPRE em português de Portugal.`,

    I: `És um coach de fitness entusiasta e social. Sê energético e divertido.
       Usa emojis, exclamações, e celebra tudo. Foca na comunidade, amigos, partilha.
       Faz do treino uma festa, não uma obrigação.
       Responde SEMPRE em português de Portugal.`,

    S: `És um coach de fitness calmo e encorajador. Sê gentil e paciente.
       Nunca pressiones. Foca na consistência, rotina, pequenas vitórias.
       Usa palavras como "ao teu ritmo", "sem pressa", "continua assim".
       Responde SEMPRE em português de Portugal.`,

    C: `És um coach de fitness analítico e baseado em dados. Sê preciso e factual.
       Fornece números, percentagens, comparações. Foca na técnica e métricas.
       Usa palavras como "os dados mostram", "as tuas métricas", "protocolo óptimo".
       Responde SEMPRE em português de Portugal.`,
  }
  ```
- [ ] **AC4:** Claude API chamada com modelo `claude-haiku-4-5-20251001` e `max_tokens: 500`
- [ ] **AC5:** Prompt do user inclui todas as variáveis de contexto (mood, level, dia, streak, dificuldade, treinos da semana)
- [ ] **AC6:** Output da Edge Function retorna JSON estruturado com:
  ```typescript
  interface MaaSOutput {
    greeting: string        // saudação personalizada (máx 2 frases)
    workout: {              // dados do treino
      type: 'hybrid' | 'run' | 'strength' | 'recovery'
      exercises: Array<{
        name: string
        sets?: number
        reps?: string       // "8-12" ou "30s"
        duration?: string   // para corrida/cardio
        rest?: string
      }>
      estimatedDuration: number  // minutos
    }
    ctaText: string         // texto do botão CTA (ex: "DOMINA", "BORA!")
    motivation: string      // mensagem pós-treino (máx 1 frase)
  }
  ```
- [ ] **AC7:** Ajuste de intensidade baseado no mood:
  - mood 1-2: reduzir volume 30%, tom mais gentil (independente do DISC)
  - mood 3: treino normal
  - mood 4-5: treino completo, tom energético
- [ ] **AC8:** Ajuste baseado em `lastWorkoutDifficulty`:
  - `easy`: aumentar ligeiramente a intensidade
  - `ideal`: manter
  - `hard`: reduzir ligeiramente
  - `null` (primeiro treino): nível conservador
- [ ] **AC9:** Tratamento de erros robusto:
  - Se Claude API falhar → retornar template de fallback (Story 2.2)
  - Se input inválido → retornar erro 400 com mensagem clara
  - Timeout de 10 segundos na chamada API
  - Log de erros para debugging
- [ ] **AC10:** Sistema de cache implementado:
  - Cache key: `${discProfile}_${mood}_${trainingLevel}_${dayOfWeek}`
  - TTL: 1 hora
  - Usar tabela `maas_cache` no Supabase ou cache em memória da Edge Function
- [ ] **AC11:** `ANTHROPIC_API_KEY` configurada como secret na Edge Function (nunca exposta ao frontend)
- [ ] **AC12:** Endpoint protegido — apenas utilizadores autenticados podem chamar a Edge Function
- [ ] **AC13:** Utilitário `lib/maas/engine.ts` criado no frontend para chamar a Edge Function:
  ```typescript
  // lib/maas/engine.ts
  export async function generateMaaSContent(input: MaaSInput): Promise<MaaSOutput> {
    const { data, error } = await supabase.functions.invoke('generate-workout', {
      body: input
    })
    if (error) throw new Error(`MaaS Engine error: ${error.message}`)
    return data as MaaSOutput
  }
  ```

## Technical Notes

- Instalar `@anthropic-ai/sdk` na Edge Function (Deno runtime)
- A Edge Function corre em Deno — usar `import` em vez de `require`
- Para o cache, a opção mais simples é uma tabela `maas_cache` no Supabase:
  ```sql
  CREATE TABLE public.maas_cache (
    cache_key TEXT PRIMARY KEY,
    response JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL
  );
  ```
- O modelo Haiku é ~10x mais barato que Sonnet/Opus — ideal para mensagens curtas em tempo real
- Custo estimado: 100 users × 1 call/dia × ~$0.001 = ~$3/mês
- Com cache, pode reduzir para ~$1.5/mês (combinações DISC+mood+level repetem-se)
- A Edge Function deve fazer `JSON.parse()` da resposta do Claude com try/catch (o LLM pode retornar JSON mal formatado)
- Considerar usar `response_format: { type: "json_object" }` se disponível no SDK

## Estrutura de Ficheiros

```
supabase/
└── functions/
    └── generate-workout/
        ├── index.ts          # Handler principal da Edge Function
        └── types.ts          # MaaSInput, MaaSOutput interfaces

src/
└── lib/
    └── maas/
        ├── engine.ts         # Cliente frontend para chamar a Edge Function
        ├── disc.ts           # DISC_SYSTEM_PROMPTS + utilidades DISC
        └── templates.ts      # Templates de fallback (Story 2.2)
```

## Definition of Done

- [ ] Código commitado no branch `feature/2.1-maas-engine`
- [ ] Edge Function deployada no Supabase
- [ ] Claude API responde correctamente para os 4 perfis DISC
- [ ] Output JSON válido e conforme interface `MaaSOutput`
- [ ] Cache funcional (segunda chamada com mesmos parâmetros usa cache)
- [ ] Fallback funciona quando Claude API está indisponível
- [ ] ANTHROPIC_API_KEY segura (não exposta no frontend)
- [ ] Testes manuais com os 4 perfis DISC × 5 moods = 20 combinações verificadas

## Dependencies

- **Story 0.2** — Setup Supabase (Edge Functions, base de dados, auth)

## Blocked By

- Story 0.2

## Next Story

→ **Story 2.2** — DISC Communication Templates (4 perfis × mensagens)

---

*Story criada por River (SM) — AIOS*