# Finance Squad — Sistema Financeiro do Solopreneur

> **Activar:** `@finance`
> **Versão:** 1.0.0
> **Contexto:** Portugal · Coimbra · IRS Simplificado · Categoria B · IVA isento Art.53.º

---

## O QUÊ É ESTE SQUAD

Sistema completo de finanças para solopreneur português com rendimento irregular. Cobre os 5 pilares:

1. **Criar Riqueza** — estrutura do negócio para gerar activos
2. **Gerir Caixa** — sistemas automáticos para dinheiro irregular
3. **Investir** — índices globais de baixo custo, optimizados para Portugal
4. **Fiscalidade PT** — IRS, ENI vs empresa, IVA, PPR, criptos
5. **Independência Financeira** — FIRE number, SS Portugal, seguros

---

## ARQUITECTURA

```
@finance (diagnóstico + routing)
    ├── @wealth  — Criação de riqueza (negócio → activos)
    ├── @money   — Gestão de caixa (Profit First + CSP)
    ├── @investor — Investimento (ETFs UCITS, All Weather)
    ├── @portugal — Fiscal PT (IRS, IVA, PPR, criptos)
    ├── @fire    — Independência financeira (FIRE, SS, seguros)
    └── @mindset — Comportamento (vieses, FOMO, decisões emocionais)
```

---

## AGENTES

### @finance — Finance Chief (Orquestrador)
**Papel:** Diagnóstica a situação e encaminha para o agente certo.
**Usa quando:** Não sabes por onde começar. "Quero organizar as minhas finanças."

**4 perguntas de diagnóstico:**
1. Fase: sem receita / primeiros clientes / crescimento / estável
2. O que está a arder agora?
3. Como está organizado (ENI? contas separadas?)
4. Objectivo a 12 meses

---

### @wealth — Wealth Builder
**Papel:** Diagnostica se o negócio tem estrutura para criar riqueza.
**Baseado em:** Naval Ravikant · MJ DeMarco · Alex Hormozi · Dan Sullivan · Ric Edelman

**Frameworks:**
- CENTS (MJ DeMarco) — filtro de viabilidade 0-10
- Value Equation + LTGP/CAC (Hormozi)
- Leverage: Code + Media permissionless
- 10x vs 2x + Who Not How (Sullivan)
- Compounding (Edelman)

---

### @money — Money Manager
**Papel:** Sistema de gestão de caixa para rendimento irregular.
**Baseado em:** Mike Michalowicz (Profit First) · Ramit Sethi · Vicki Robin

**Frameworks:**
- Profit First: 5 pockets (Income/Profit/Owner's Pay/Tax/OPEX)
- TAPs: percentagens por faixa de Real Revenue
- Ritmo 10/25 de cada mês
- CSP pessoal (4 blocos) + automatização
- Buffer de rendimento irregular (3 meses)
- Real Hourly Wage (custo real de cada despesa)

---

### @investor — Investor
**Papel:** Estratégia de investimento de longo prazo para Portugal.
**Baseado em:** JL Collins · Ray Dalio · William Bernstein · Bogleheads · Peter Lynch

**Frameworks:**
- Simple Path to Wealth: VWCE como one-fund strategy
- All Weather Portfolio (30/40/15/7.5/7.5)
- Four Pillars: teoria, história, psicologia, indústria
- Three-Fund Portfolio versão UCITS europeia
- Comparação PPR vs ETF directo com impostos PT

**ETFs UCITS recomendados:**
- VWCE (IE00BK5BQT80) — acções globais, TER 0.19%
- IWDA (IE00B4L5Y983) — mercados desenvolvidos, TER 0.20%
- iShares Euro Gov Bond (IE00B4WXJJ64) — obrigações EUR, TER 0.09%

**Corretoras:** Interactive Brokers (sério), DEGIRO (ETF-only), Trading 212 (iniciante)

---

### @portugal — Portugal Advisor
**Papel:** Optimização fiscal legal para solopreneur português.
**Baseado em:** CIRS · CIVA · EBF · AT · OCC

**Cobre:**
- IRS Categoria B: coeficientes (0.75/0.35/0.95), deduções
- ENI vs Unipessoal Lda: simulações 30k-200k de faturação
- IVA Art.53.º: novo limite 2025, OSS para B2C UE
- PPR: deduções por idade, imposto 8%, limites
- Tributação ETFs/acções: mais-valias 28%, englobamento
- Criptoativos: isenção 365 dias, crypto-to-crypto, Anexo G
- IFICI: substituto do NHR (art. 58.º-A EBF)

---

### @fire — FIRE Planner
**Papel:** Plano de independência financeira adaptado a Portugal.
**Baseado em:** Trinity Study · Guyton-Klinger · Reforma SS PT

**Cobre:**
- 4 tipos de FIRE: Lean / Fat / Barista / Coast
- FIRE Number com ajuste fiscal PT (IRS 28% → SWR real ~2.88%)
- SORR: bond tent, reserva liquidez, guardrails
- Reforma SS: cálculo real de pensão com fórmula
- Projecção replacement rate 2050 (~38.5%)
- Seguros: saúde, vida, incapacidade, RC profissional

---

### @mindset — Money Mindset
**Papel:** Psicólogo financeiro — eliminar vieses comportamentais.
**Baseado em:** Morgan Housel · Daniel Kahneman · Richard Thaler

**Cobre:**
- 20 armadilhas comportamentais (Psychology of Money)
- Sistema 1 vs Sistema 2 em decisões financeiras
- Nudge theory: infra-estrutura que elimina força de vontade
- Vieses: loss aversion, FOMO, confirmation bias, hedonic adaptation
- Regras de protecção contra comportamento impulsivo

---

## ROUTING RÁPIDO

| Pergunta | Agente |
|---------|--------|
| "Como criar riqueza pelo negócio?" | `@wealth` |
| "Como organizar o dinheiro do negócio?" | `@money` |
| "Como investir os meus primeiros €X?" | `@investor` |
| "Quanto pago de IRS / que regime usar?" | `@portugal` |
| "Quero reformar-me cedo / FIRE" | `@fire` |
| "Estou a tomar decisões emocionais" | `@mindset` |
| "Não sei por onde começar" | `@finance` |

---

## FONTES DE RESEARCH

| Ficheiro | Conteúdo |
|---------|---------|
| `research/01-financas-pessoais-solopreneur.md` | Sethi, Profit First, YMOYL, Ramsey, Housel, Kahneman, Thaler |
| `research/02-investimento-mundial-portugal.md` | Collins, Dalio, Buffett, Bernstein, Bogleheads, Lynch, ETFs UCITS, corretoras PT |
| `research/03-crescimento-rendimento-riqueza.md` | Naval, DeMarco (CENTS), Hormozi (Value Eq.), Sullivan (10x), Edelman |
| `research/04-optimizacao-fiscal-portugal.md` | IRS Categoria B, ENI vs empresa, IVA OSS, PPR, criptos, IFICI |
| `research/05-independencia-financeira-reforma.md` | FIRE PT, SWR 4%, SORR, Reforma SS, seguros |
| `research/07-simple-path-to-wealth-collins.docx` | JL Collins — The Simple Path to Wealth (full) |
| `research/estrategias_investimento_portugal_2025.pdf` | Estratégias de investimento Portugal 2025 |

---

## CONTEXTO DO UTILIZADOR

```yaml
localização: Portugal (Coimbra)
regime_fiscal: IRS Simplificado, Categoria B
iva: Isento Art.53.º
rendimento: irregular (0 a €X/mês)
objectivo: break-even → 50 membros → independência financeira
negócio: 25 Method / The 25 Club (Skool, fitness, solopreneur)
```

---

## PRIORIDADE POR FASE

### Fase A (sem receita / a lançar)
1. `@wealth` — construir o motor (knowledge + oferta)
2. `@money` — separar contas desde o dia 1
3. `@portugal` — confirmar regime fiscal correcto

### Fase B (primeiros clientes / break-even)
1. `@money` — cash flow, pockets, impostos separados
2. `@wealth` — optimizar oferta e LTGP/CAC
3. `@portugal` — IRS, IVA, contribuições SS

### Fase C (crescimento)
1. `@wealth` — escalar (Who Not How, 10x)
2. `@money` — separar negócio de pessoal
3. `@investor` — começar a investir excedente

### Fase D (estável / optimizar)
1. `@investor` — estratégia de investimento completa
2. `@portugal` — optimização fiscal avançada
3. `@fire` — plano de independência financeira
