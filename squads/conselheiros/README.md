# Squad de Conselheiros — Elite Minds Advisory Board

> 11 conselheiros baseados em elite minds reais com frameworks documentados.
> Clone minds > create bots.

## Como Usar

### Activar o Orchestrator (recomendado)
```
@conselheiros
```
O chief faz o diagnóstico e encaminha-te para o conselheiro certo.

### Activar um Conselheiro Directamente
```
@conselheiros:{agent-id}
```

## O Board

### Tier 0 — Diagnóstico
| Conselheiro | Domínio | Activação |
|------------|---------|-----------|
| Charlie Munger | Modelos Mentais & Decisão | `@conselheiros:charlie-munger` |
| Peter Drucker | Gestão & Eficácia Executiva | `@conselheiros:peter-drucker` |

### Tier 1 — Masters
| Conselheiro | Domínio | Activação |
|------------|---------|-----------|
| Ray Dalio | Princípios & Transparência Radical | `@conselheiros:ray-dalio` |
| Keith Cunningham | CEO Advisory & Thinking Time | `@conselheiros:keith-cunningham` |
| Jim Collins | Estratégia & Excelência Organizacional | `@conselheiros:jim-collins` |
| Steve Jobs | Produto, Inovação & Design | `@conselheiros:steve-jobs` |

### Tier 2 — Especialistas
| Conselheiro | Domínio | Activação |
|------------|---------|-----------|
| Alex Hormozi | Monetização & Ofertas | `@conselheiros:alex-hormozi` |
| Marshall Goldsmith | Coaching & Mudança Comportamental | `@conselheiros:marshall-goldsmith` |
| Brené Brown | Confiança & Liderança Corajosa | `@conselheiros:brene-brown` |
| Simon Sinek | Propósito & Visão | `@conselheiros:simon-sinek` |
| Alan Nicolas | IA Aplicada & Segundo Cérebro | `@conselheiros:alan-nicolas` |

## Estrutura do Squad

```
squads/conselheiros/
├── config.yaml              # Configuração do squad
├── README.md                # Este ficheiro
├── agents/                  # 12 agentes (11 + orchestrator)
│   ├── conselheiros-chief.md
│   ├── charlie-munger.md
│   ├── peter-drucker.md
│   ├── ray-dalio.md
│   ├── keith-cunningham.md
│   ├── jim-collins.md
│   ├── steve-jobs.md
│   ├── alex-hormozi.md
│   ├── marshall-goldsmith.md
│   ├── brene-brown.md
│   ├── simon-sinek.md
│   └── alan-nicolas.md
├── minds/                   # Mind DNA completo (Voice + Thinking)
│   ├── charlie-munger.md
│   ├── peter-drucker.md
│   ├── ray-dalio.md
│   ├── keith-cunningham.md
│   ├── jim-collins.md
│   ├── steve-jobs.md
│   ├── alex-hormozi.md
│   ├── marshall-goldsmith.md
│   ├── brene-brown.md
│   ├── simon-sinek.md
│   └── alan-nicolas.md
├── tasks/                   # (futuro)
├── workflows/               # (futuro)
└── data/                    # (futuro)
```

## Quando Usar Cada Conselheiro

| Situação | Conselheiro |
|----------|------------|
| Decisão difícil com múltiplas variáveis | Charlie Munger |
| Não sei o que priorizar | Peter Drucker |
| Preciso de criar princípios/regras | Ray Dalio |
| Problema de negócio que não consigo resolver | Keith Cunningham |
| Empresa sem foco ou a perder momentum | Jim Collins |
| Produto confuso ou com funcionalidades a mais | Steve Jobs |
| Preciso de cobrar mais ou criar oferta | Alex Hormozi |
| Quero mudar um comportamento ou hábito | Marshall Goldsmith |
| Equipa sem confiança ou com conflitos | Brené Brown |
| Não sei o meu propósito ou "porquê" | Simon Sinek |
| Quero implementar IA no meu negócio | Alan Nicolas |

---
*Squad criado em 2026-03-18 por Squad Architect*
*Clone minds > create bots.*
