# Squad Closer — Elite Sales Closing & Buyer Profiling

> 7 agentes baseados em elite minds reais com frameworks documentados.
> Pipeline completo: Perfil → Gap → Dor → Objecoes → Close.
> Clone minds > create bots.

## Como Usar

### Activar o Orchestrator (recomendado)
```
@closer
```
O chief analisa a tua situacao e encaminha para o agente certo no pipeline.

### Activar um Agente Directamente
```
@closer:{agent-id}
```

## Pipeline de Closing

```
1. PERFIL   → Alessandra perfila o buyer (DISC)
2. GAP      → Keenan identifica e quantifica o gap
3. DOR      → Sandler escava a dor profunda (Pain Funnel)
4. OBJECOES → Voss desarma + Blount sistematiza resposta
5. CLOSE    → Miner fecha com perguntas NEPQ
6. BASE     → Cialdini sustenta toda a comunicacao
```

## O Squad

### Tier 0 — Diagnostico
| Agente | Dominio | Framework | Activacao |
|--------|---------|-----------|-----------|
| Tony Alessandra | Buyer Profiling (DISC) | DISC + Platinum Rule | `@closer:tony-alessandra` |
| Keenan | Pain Quantification | Gap Selling | `@closer:keenan` |

### Tier 1 — Masters
| Agente | Dominio | Framework | Activacao |
|--------|---------|-----------|-----------|
| Chris Voss | Objection Neutralization | Tactical Empathy | `@closer:chris-voss` |
| David Sandler | Pain Excavation | Pain Funnel + Sandler System | `@closer:david-sandler` |
| Jeremy Miner | Closing | NEPQ | `@closer:jeremy-miner` |

### Tier 2 — Sistematizadores
| Agente | Dominio | Framework | Activacao |
|--------|---------|-----------|-----------|
| Jeb Blount | Objection System | Sales EQ + LAER 5-Step | `@closer:jeb-blount` |
| Robert Cialdini | Persuasion Architecture | 7 Principles of Influence | `@closer:robert-cialdini` |

## Quando Usar Cada Agente

| Situacao | Agente |
|----------|--------|
| Preciso de saber que tipo de comprador tenho (DISC) | Tony Alessandra |
| Preciso de quantificar o gap entre estado actual e desejado | Keenan |
| O prospect levantou objecoes emocionais | Chris Voss |
| Preciso de escavar a dor profunda do prospect | David Sandler |
| Preciso de fechar sem pressionar | Jeremy Miner |
| Preciso de um sistema estruturado para objecoes | Jeb Blount |
| Preciso de entender os gatilhos de persuasao | Robert Cialdini |
| "Preco muito alto" | Keenan (gap) + Chris Voss (desarmar) |
| "Preciso de pensar" | David Sandler (up-front contract) + Jeb Blount (LAER) |
| "Estou a falar com concorrentes" | Keenan (gap) + Jeremy Miner (NEPQ) |
| "Nao e o momento certo" | David Sandler (pain funnel) + Robert Cialdini (escassez) |

## Estrutura do Squad

```
squads/closer/
├── config.yaml              # Configuracao do squad
├── README.md                # Este ficheiro
├── agents/                  # 8 agentes (7 + orchestrator)
│   ├── closer-chief.md
│   ├── tony-alessandra.md
│   ├── keenan.md
│   ├── chris-voss.md
│   ├── david-sandler.md
│   ├── jeremy-miner.md
│   ├── jeb-blount.md
│   └── robert-cialdini.md
├── minds/                   # Mind DNA completo (Voice + Thinking)
│   ├── tony-alessandra.md
│   ├── keenan.md
│   ├── chris-voss.md
│   ├── david-sandler.md
│   ├── jeremy-miner.md
│   ├── jeb-blount.md
│   └── robert-cialdini.md
├── tasks/                   # (futuro)
├── workflows/               # (futuro)
└── data/                    # (futuro)
```

---
*Squad criado em 2026-03-21 por Squad Architect*
*Clone minds > create bots.*
