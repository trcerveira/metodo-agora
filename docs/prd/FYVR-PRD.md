# PRD — FYVR
**Product Requirements Document**
**Versão:** 1.0
**Data:** 2026-03-19
**Autor:** Morgan (PM) | Telmo Cerveira (Founder)
**Status:** Draft

---

## 1. Visão do Produto

### 1.1 Mission Statement

> **"Acabar com a desistência no fitness. Dar a toda a pessoa um treinador de IA ao seu lado e uma tribo que não a deixa parar — por menos de 13€/mês."**

### 1.2 Product Vision

**FYVR** é uma app mobile de treino híbrido (corrida + força) com IA adaptativa que resolve o problema #1 da indústria fitness: **as pessoas desistem passados 3 meses.**

A FYVR diferencia-se por não adaptar apenas o treino — adapta a **comunicação**. Através do sistema MaaS (Message as a Service) e perfil DISC, a app reconhece a personalidade de cada utilizador e comunica de forma personalizada, criando uma experiência que faz cada pessoa sentir-se vista e entendida.

### 1.3 Slogan

> **"Catch the FYVR."**

### 1.4 Brand Identity

- **Tipo:** Marca faceless — sem guru, sem cara. A marca é a estrela.
- **Inspiração:** Nike ("Just Do It") — energia, acção, identidade
- **Tom:** Energético, contagioso, inclusivo, moderno
- **Visual:** Bold, minimal, t-shirt-ready

---

## 2. Problema

### 2.1 Problem Statement

A indústria do fitness tem uma taxa de desistência de **50% nos primeiros 6 meses**. A maioria das pessoas quer treinar regularmente mas falha por 5 razões:

| # | Causa da Desistência | Evidência |
|---|---------------------|-----------|
| 1 | **Tédio** — mesma rotina repetida | Apps dão o mesmo plano durante semanas |
| 2 | **Sem progresso visível** | Não medem o que importa para o utilizador |
| 3 | **Sem accountability** | Treinam sozinhas, ninguém nota se faltam |
| 4 | **Programa não se adapta** | Demasiado fácil ou demasiado difícil |
| 5 | **Comunicação genérica** | A app fala com todos da mesma forma |

### 2.2 Gap de Mercado

97% das pessoas não podem pagar um Personal Trainer (30-80€/sessão, 360-960€/mês). Entre "treinar sozinho e desistir" e "pagar PT e ter resultados" existe um vazio enorme.

### 2.3 Oportunidade

- O treino híbrido (corrida + força) é mainstream em 2026
- HYROX cresceu de 600 para 550.000 participantes (2018-2025)
- 72% da Gen Z já faz treino híbrido
- **Não existe app dominante para treino híbrido** — o trono está vazio
- 50% da Gen Z está aberta a AI coaching
- Mercado de fitness apps: $14.6B em 2026

---

## 3. Utilizador-Alvo

### 3.1 Target Primário

**Gen Z + Millennials (18-43 anos)** que:
- Querem treinar regularmente mas desistem
- Não podem pagar Personal Trainer
- Interessam-se por treino híbrido (corrida + força)
- Usam smartphone como ferramenta principal
- Valorizam comunidade e pertença

### 3.2 Personas

#### Persona 1: "O Recomeçador" — Miguel, 28 anos
- Já tentou 3 apps de fitness, desistiu de todas
- Quer resultados mas perde motivação ao fim de 1 mês
- Perfil DISC: **S (Estabilidade)** — precisa de encorajamento gentil, não pressão
- Gasta: 0-15€/mês em apps
- Pain: "Começo sempre motivado mas depois perco o ritmo"

#### Persona 2: "A Competitiva" — Sofia, 24 anos
- Corre 3x por semana, quer adicionar força
- Adora desafios, leaderboards, e partilhar resultados
- Perfil DISC: **D (Dominância)** — quer ser desafiada, quer bater records
- Gasta: 10-25€/mês em fitness
- Pain: "As apps de corrida não têm força, as de força não têm corrida"

#### Persona 3: "O Analítico" — Pedro, 35 anos
- Engenheiro, quer dados e métricas detalhadas
- Usa Apple Watch, quer integração com wearables
- Perfil DISC: **C (Conformidade)** — quer gráficos, progressão medida, técnica
- Gasta: 15-30€/mês em tech/fitness
- Pain: "Quero saber exactamente quanto estou a progredir"

#### Persona 4: "O Social" — Ana, 22 anos
- Treina com amigas, gosta de group workouts
- Partilha tudo nas redes sociais
- Perfil DISC: **I (Influência)** — quer comunidade, diversão, celebração
- Gasta: 5-15€/mês
- Pain: "Treinar sozinha é aborrecido, preciso de companhia"

---

## 4. Solução

### 4.1 Core Product

App mobile de treino híbrido (corrida + força) com 3 pilares anti-desistência:

| Pilar | Descrição | Problema que Resolve |
|-------|-----------|---------------------|
| **IA Adaptativa + MaaS** | IA que adapta treinos E comunicação ao perfil do utilizador | Programa não se adapta + Comunicação genérica |
| **Tribo** | Comunidade onde ninguém treina sozinho | Sem accountability + Tédio |
| **Gamificação** | Streaks, desafios, milestones, badges | Sem progresso visível + Tédio |

### 4.2 Diferenciador: MaaS (Message as a Service)

Sistema de comunicação adaptativa baseado na Teoria da Comunicação MaaS:

**Equação:**
```
K_e = [(T × A(t) × M × Amp_IA) × Lc_g] / [Lc_i + Lc_e] × (1 ± σ)
```

| Variável | Significado | Na FYVR |
|----------|-----------|---------|
| **T** | Qualidade do emissor | Conteúdo de treino validado por PT profissional |
| **A(t)** | Capacidade do receptor no momento | Estado actual do utilizador (motivação, energia, dia) |
| **M** | Meio de comunicação | Texto, áudio, push notification — adaptado ao contexto |
| **Amp_IA** | Amplificador de IA | IA traduz instrução técnica para linguagem do utilizador |
| **Lc_g** | Prática real (esforço bom) | O utilizador FAZ o treino — engagement activo |
| **Lc_i + Lc_e** | Ruído (complexidade + distracções) | Interface ultra-limpa, 1 ecrã = 1 acção |
| **σ** | Variação do mundo real | IA aceita que dias diferentes = resultados diferentes |

**Resultado:** Conhecimento transferido de 35% (vs ~18% sem MaaS) = **1.8x mais eficaz**.

### 4.3 Diferenciador: Perfil DISC

A app detecta o perfil comportamental do utilizador e adapta toda a experiência:

| Perfil | Comunicação | Motivação | UI Focus |
|--------|-----------|-----------|----------|
| **D (Dominância)** | Directa, desafiante | Records, competição, leaderboards | Performance metrics |
| **I (Influência)** | Entusiasta, social | Amigos, partilha, celebração | Feed social, challenges |
| **S (Estabilidade)** | Gentil, encorajadora | Consistência, rotina, streaks | Progresso calmo |
| **C (Conformidade)** | Analítica, detalhada | Dados, gráficos, técnica | Dashboards, métricas |

**Detecção:**
- **MVP:** 3 perguntas cenário no onboarding → perfil primário
- **Fase 2:** Detecção comportamental automática (padrões de uso)

---

## 5. Features — Priorização MoSCoW

### 5.1 MUST HAVE (MVP)

| # | Feature | Descrição | Pilar |
|---|---------|-----------|-------|
| F1 | **Treino Híbrido Diário** | Plano diário de corrida + força, adaptado ao nível | Core |
| F2 | **Onboarding DISC** | 3 perguntas cenário → perfil comportamental | DISC |
| F3 | **Comunicação Adaptativa (MaaS)** | 4 tons de comunicação por perfil DISC | MaaS |
| F4 | **Check-in Diário** | "Como te sentes hoje?" (1-5) → ajusta treino e tom | MaaS |
| F5 | **Streak Counter** | Dias consecutivos de treino | Gamificação |
| F6 | **Feed da Tribo** | Feed social com actividade da comunidade | Tribo |
| F7 | **Progresso Visual** | Gráficos de evolução (km, peso, consistência) | Gamificação |
| F8 | **Notificações Adaptativas** | Push notifications personalizadas por perfil DISC | MaaS |
| F9 | **Auth + Perfil** | Registo, login, perfil de utilizador | Core |
| F10 | **Subscrição (Stripe)** | Free tier + Pro tier com pagamento | Core |

### 5.2 SHOULD HAVE (v1.1 — Mês 4-6)

| # | Feature | Descrição | Pilar |
|---|---------|-----------|-------|
| F11 | Desafios Semanais | Challenges da comunidade ("3 treinos esta semana") | Gamificação |
| F12 | Leaderboards | Rankings por consistência (não performance) | Gamificação |
| F13 | Badges & Milestones | "Passaste os 3 meses — top 12%!" | Gamificação |
| F14 | Detecção DISC Comportamental | IA aprende perfil pelo uso (sem perguntar) | DISC |
| F15 | Treinos Sazonais | Verão=outdoor, inverno=indoor | Core |
| F16 | Áudio Coaching | Voz durante corrida com instruções adaptadas | MaaS |

### 5.3 COULD HAVE (v2.0 — Mês 7-12)

| # | Feature | Descrição |
|---|---------|-----------|
| F17 | Integração Wearables | Apple Watch, Garmin, Fitbit |
| F18 | Planos para Provas | HYROX, meias-maratonas, Spartan |
| F19 | Nutrição Básica | Sugestões nutricionais adaptadas ao treino |
| F20 | Co-criação de Challenges | Utilizadores criam desafios para a tribo |
| F21 | Programa de Afiliação | Membros trazem amigos, ganham benefícios |

### 5.4 WON'T HAVE (fora de scope)

- Vídeos com face do founder
- Personal training 1:1 ao vivo
- E-commerce de equipamento
- Funcionalidades médicas/clínicas

---

## 6. 6 Patterns of Opportunity

| Pattern | Sub-Pattern | Implementação na FYVR |
|---------|-------------|----------------------|
| **ACCELERATION** | Perfecting One Thing | Perfeitar UMA coisa: manter pessoas a treinar |
| | Catalyzation | App acelera desenvolvimento físico de cada utilizador |
| | AI | IA adapta treinos + comunicação em tempo real |
| **CYCLICALITY** | Repetitive Cycles | Ciclos de treino 4-6 semanas que evoluem |
| | Seasonal | Programas sazonais (verão outdoor, inverno indoor) |
| | Youthfulness | Energia jovem, playful, desafiante |
| **REDUCTION** | Subscription | 12.99€/mês — simples, acessível |
| | Simplicity | Abre → vê treino → faz. Zero decisões |
| | Curation | Treinos curados por IA, não catálogos infinitos |
| **REDIRECTION** | Gamifying | Streaks, desafios, milestones, badges |
| | Surprising | Treinos surpresa, "boss fights" mensais |
| | Gamification | Leaderboards por consistência, pontos |
| **CONVERGENCE** | Physical + Digital | Treino real + tracking digital + comunidade online |
| | Adding Value | PT de IA + comunidade + gamificação > PT sozinho |
| | Co-creation | Utilizadores votam/criam desafios |
| **DIVERGENCE** | Personalization | DISC + MaaS = experiência única por pessoa |
| | Belonging | "Eu sou FYVR" — identidade tribal |
| | Authenticity | Marca autêntica, sem filtros, sem promessas falsas |

### Megatrends Activados

| Megatrend | Como FYVR Capitaliza |
|-----------|---------------------|
| **AI** | PT de IA com MaaS + DISC |
| **Gamification** | Sistema anti-desistência gamificado |
| **Tribalism** | Comunidade como cola de retenção |
| **Personalization** | Comunicação e treino adaptados por pessoa |
| **Simplicity** | Zero fricção, 1 ecrã = 1 acção |
| **Instant Entrepreneurship** | Built by solopreneur, for solopreneurs of fitness |
| **Prosumerism** | Utilizadores co-criam desafios |
| **Curation** | Treinos curados, não catálogos |

---

## 7. Modelo de Negócio

### 7.1 Pricing

| Tier | Preço | Features |
|------|-------|----------|
| **Free** | 0€ | 1 treino/semana, feed read-only, streak básico |
| **Pro** | 12.99€/mês | Treinos diários personalizados, MaaS + DISC, comunidade completa, streaks, gamificação |
| **Premium** | 24.99€/mês | Tudo + planos para provas, áudio coaching, nutrição básica, desafios exclusivos |

### 7.2 Revenue Projections

| Marco | Utilizadores Pro | Utilizadores Premium | MRR |
|-------|-----------------|---------------------|-----|
| 6 meses | 100 | 25 | 1.924€ |
| 12 meses | 500 | 100 | 8.995€ |
| 18 meses | 1.500 | 400 | 29.481€ |
| 24 meses | 5.000 | 1.200 | 94.950€ |

### 7.3 Unit Economics

| Métrica | Valor Estimado |
|---------|---------------|
| CAC (Customer Acquisition Cost) | 3-8€ (orgânico + community) |
| LTV (Lifetime Value) | 104€ (8 meses × 13€) |
| LTV/CAC Ratio | 13-35x |
| Churn Mensal Estimado | 8-12% (vs 15-20% indústria) |
| Break-even | ~200 Pro subscribers |

---

## 8. Métricas de Sucesso

### 8.1 North Star Metric

> **Utilizadores activos que treinam 3+ vezes por semana durante 90+ dias**

Esta métrica captura directamente a missão: acabar com a desistência.

### 8.2 KPIs Primários

| KPI | Target MVP | Target 12 meses |
|-----|-----------|-----------------|
| DAU/MAU Ratio | >25% | >35% |
| Retenção D30 | >35% | >45% |
| Retenção D90 | >20% | >30% |
| Treinos completados/semana/user | 2.5 | 3.5 |
| Streak médio | 8 dias | 18 dias |
| NPS | >40 | >55 |

### 8.3 KPIs Secundários

| KPI | Target |
|-----|--------|
| Free → Pro Conversion | >5% |
| Pro → Premium Upsell | >15% |
| Referral Rate | >10% dos Pro users |
| Community Posts/Week | >2 per active user |
| DISC Profile Accuracy (self-reported) | >75% |

---

## 9. Arquitectura Técnica (Alto Nível)

### 9.1 Stack Recomendado

| Camada | Tecnologia | Justificação |
|--------|-----------|-------------|
| **Frontend** | React Native ou PWA (Progressive Web App) | Cross-platform, budget-friendly |
| **Backend** | Supabase (BaaS) | Auth, DB, realtime, storage — free tier generoso |
| **IA/LLM** | Claude API (Anthropic) | MaaS + DISC communication engine |
| **Pagamentos** | Stripe | Subscrições, standard da indústria |
| **Analytics** | Mixpanel free tier | Tracking de engagement e retenção |
| **Push Notifications** | OneSignal free tier | Notificações adaptativas |
| **Hosting** | Vercel (frontend) + Supabase (backend) | Free/low-cost tiers |

### 9.2 MVP Technical Path

**Opção recomendada: PWA (Progressive Web App)**

| Factor | PWA | React Native |
|--------|-----|-------------|
| Custo | Baixo (web tech) | Médio-Alto |
| Tempo to market | 8-10 semanas | 12-16 semanas |
| Budget 300€ | Viável | Apertado |
| App Store | Não precisa (instala via browser) | Precisa ($99/ano Apple + $25 Google) |
| Performance | Boa para MVP | Excelente |
| Push Notifications | Suportado (Android + iOS 16.4+) | Nativo |

### 9.3 Arquitectura MaaS Engine

```
┌──────────────────────────────────────────────────┐
│                  FYVR MaaS Engine                 │
│                                                    │
│  Input:                                            │
│  ├── User DISC Profile (D/I/S/C)                  │
│  ├── Current State: A(t) (mood 1-5, day, time)    │
│  ├── Training Context (exercise, level, week)      │
│  └── History (patterns, streaks, preferences)      │
│                                                    │
│  Process:                                          │
│  ├── Select Communication Template (DISC)          │
│  ├── Adjust Tone (A(t) state modifier)             │
│  ├── Apply Amp_IA (Claude API personalization)     │
│  └── Minimize Noise (Lc_i + Lc_e)                 │
│                                                    │
│  Output:                                           │
│  ├── Personalized Workout Message                  │
│  ├── Adapted Notifications                         │
│  └── Community Prompts                             │
└──────────────────────────────────────────────────┘
```

---

## 10. Roadmap

### Fase 0: Fundação (Semanas 1-2)
- Setup do projecto (repo, Supabase, Vercel)
- Design system (cores, tipografia, componentes)
- Wireframes dos 3 ecrãs principais

### Fase 1: Core MVP (Semanas 3-6)
- Auth + Perfil de utilizador
- Onboarding com 3 perguntas DISC
- Treino diário híbrido (corrida + força) — 3 níveis
- Check-in diário ("Como te sentes?")
- Comunicação adaptativa básica (4 templates DISC)
- Streak counter

### Fase 2: Community + Gamification (Semanas 7-10)
- Feed da tribo (posts, actividade)
- Progresso visual (gráficos)
- Notificações adaptativas (push)
- Primeiro sistema de badges

### Fase 3: Payment + Launch (Semanas 11-12)
- Integração Stripe (Free + Pro)
- Landing page
- Beta launch com 50 utilizadores
- Feedback loop e iteração

### Fase 4: Growth (Meses 4-6)
- Desafios semanais
- Leaderboards por consistência
- Detecção DISC comportamental (sem perguntas)
- Áudio coaching durante corrida

### Fase 5: Scale (Meses 7-12)
- Premium tier
- Wearables integration
- Planos para provas (HYROX, meias-maratonas)
- Nutrição básica
- Programa de afiliação

---

## 11. Riscos e Mitigações

| # | Risco | Probabilidade | Impacto | Mitigação |
|---|-------|-------------|---------|-----------|
| R1 | Fundador dispersa-se (Upper Limit Problem) | Alta | Crítico | Accountability partner, sprints de 7 dias, parking lot para novas ideias |
| R2 | Budget insuficiente para features | Média | Alto | PWA first, free tiers de todos os serviços, MVP radical |
| R3 | Retenção abaixo do esperado | Média | Alto | MaaS + DISC como diferenciador de retenção, iterar com dados |
| R4 | Concorrente lança app de treino híbrido | Baixa | Médio | MaaS + DISC é o moat — difícil de copiar rapidamente |
| R5 | Claude API custos escalam | Baixa | Médio | Cache de respostas, templates pré-gerados, API calls eficientes |
| R6 | Qualidade dos treinos questionada | Média | Alto | Fundador é PT há 6 anos — credibilidade técnica real |

---

## 12. Constraints

| Constraint | Valor | Impacto |
|-----------|-------|---------|
| Budget inicial | 300€ | PWA obrigatório, free tiers, zero paid marketing |
| Horas/semana | 30h | Foco radical no MVP, sem features nice-to-have |
| Founder faceless | Obrigatório | Sem vídeo com cara, marca é a estrela |
| Solo founder | 1 pessoa | Precisa de IA/automação para escalar |
| Sem experiência de programação | Iniciante | Claude Code + AIOS como tooling principal |

---

## 13. Success Criteria — Go/No-Go

### Go para v1.1 (após 12 semanas):
- [ ] 50 beta users registados
- [ ] 20 utilizadores activos semanais
- [ ] 5 Pro subscribers pagantes
- [ ] Retenção D30 > 30%
- [ ] NPS > 35

### Go para Scale (após 6 meses):
- [ ] 200 Pro subscribers
- [ ] MRR > 2.500€
- [ ] Retenção D90 > 20%
- [ ] 3+ treinos/semana por utilizador activo
- [ ] Community engagement > 2 posts/semana/user

---

## 14. Competitive Landscape

| App | Foco | DISC? | MaaS? | Hybrid? | Preço |
|-----|------|-------|-------|---------|-------|
| Nike Training Club | Generalista | ❌ | ❌ | Parcial | Free |
| Freeletics | AI Bodyweight | ❌ | ❌ | ❌ | 14.99€ |
| Strava | Running/Cycling | ❌ | ❌ | ❌ | 11.99€ |
| Fitbod | Strength | ❌ | ❌ | ❌ | 12.99€ |
| HYROX Fitness | HYROX Racing | ❌ | ❌ | ✅ (competição) | Free |
| **FYVR** | **Hybrid + Anti-Quit** | **✅** | **✅** | **✅** | **12.99€** |

**FYVR é a única app com MaaS + DISC + Treino Híbrido.** Zero concorrência directa.

---

## 15. Stakeholders

| Stakeholder | Papel | Responsabilidade |
|------------|-------|-----------------|
| Telmo Cerveira | Founder, Product Owner | Visão, conteúdo de treino, decisões estratégicas |
| @architect | Tech Lead (AIOS) | Arquitectura técnica, decisões de stack |
| @dev | Development (AIOS) | Implementação do MVP |
| @qa | Quality (AIOS) | Testing e validação |
| Squad Conselheiros | Advisory Board | Validação estratégica (Hormozi, Munger, Collins, etc.) |

---

## Aprovação

| Aprovador | Data | Status |
|-----------|------|--------|
| Telmo Cerveira (Founder) | Pendente | ⏳ |
| Morgan (PM) | 2026-03-19 | ✅ Aprovado |

---

*PRD gerado por Morgan (PM) — AIOS*
*Produto: FYVR v1.0*
*Data: 2026-03-19*

— Morgan, planejando o futuro 📊
