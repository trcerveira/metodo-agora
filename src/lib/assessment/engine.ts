// ============================================================
// Motor de Scoring — Assessment Completo (7 Frameworks)
// ============================================================

import {
  sections,
  getAllQuestions,
  type StrengthsDomain,
  type WealthProfile,
  type KolbeMode,
  type AssessmentQuestion,
} from './data'

// --- Result Types ---

export type HendricksZone = 'genius' | 'excellence' | 'competence'

export interface FrameworkScores {
  strengths: Record<StrengthsDomain, number>
  wealth: Record<WealthProfile, number>
  kolbe: Record<KolbeMode, number>
}

export interface AssessmentResult {
  // Hendricks — Zona
  zone: HendricksZone
  zoneTitle: string
  zoneConfidence: number

  // Clifton — Forças
  strengthsDomain: StrengthsDomain
  strengthsTop: StrengthsDomain[]
  strengthsScores: Record<StrengthsDomain, number>

  // Hamilton — Wealth Dynamics
  wealthProfile: WealthProfile
  wealthSecondary: WealthProfile
  wealthScores: Record<WealthProfile, number>

  // Kolbe — Modos de Ação
  kolbeDominant: KolbeMode
  kolbeScores: Record<KolbeMode, number>

  // Meta
  archetype: string
  consistency: number

  // Respostas abertas (para GPT-4o-mini)
  openAnswers: Record<string, string>

  // Todas as respostas (para contexto)
  allAnswers: Record<string, string | string[]>
}

// --- Descrições ---

const ZONE_TITLES: Record<HendricksZone, string> = {
  genius: 'Zona de Genialidade',
  excellence: 'Zona de Excelência',
  competence: 'Zona de Descoberta',
}

const STRENGTHS_TITLES: Record<StrengthsDomain, string> = {
  executing: 'O Construtor',
  influencing: 'O Catalisador',
  relationship: 'A Ponte',
  strategic: 'O Arquiteto',
}

const WEALTH_TITLES: Record<WealthProfile, string> = {
  creator: 'Criador',
  mechanic: 'Mecânico',
  star: 'Estrela',
  supporter: 'Apoiador',
  dealmaker: 'Negociador',
  trader: 'Comerciante',
  accumulator: 'Acumulador',
  lord: 'Senhor dos Sistemas',
}

const KOLBE_TITLES: Record<KolbeMode, string> = {
  factFinder: 'Investigador',
  followThru: 'Sistematizador',
  quickStart: 'Iniciador Rápido',
  implementor: 'Implementador',
}

// --- Cálculo ---

export function calculateAssessmentResults(
  answers: Record<string, string | string[]>
): AssessmentResult {
  const allQuestions = getAllQuestions()

  const strengthScores: Record<StrengthsDomain, number> = {
    executing: 0,
    influencing: 0,
    relationship: 0,
    strategic: 0,
  }

  const wealthScores: Record<WealthProfile, number> = {
    creator: 0,
    mechanic: 0,
    star: 0,
    supporter: 0,
    dealmaker: 0,
    trader: 0,
    accumulator: 0,
    lord: 0,
  }

  const kolbeScores: Record<KolbeMode, number> = {
    factFinder: 0,
    followThru: 0,
    quickStart: 0,
    implementor: 0,
  }

  const openAnswers: Record<string, string> = {}

  for (const [qId, answerValue] of Object.entries(answers)) {
    const question = allQuestions.find((q) => q.id === qId)
    if (!question) continue

    // Respostas abertas
    if (question.type === 'open') {
      openAnswers[qId] = String(answerValue)
      continue
    }

    // Multi-select: processar cada opção selecionada
    const selectedValues = Array.isArray(answerValue) ? answerValue : [answerValue]

    for (const val of selectedValues) {
      const option = question.options?.find((o) => o.value === val)
      if (!option) continue

      if (option.scores.strengths) {
        for (const [key, score] of Object.entries(option.scores.strengths)) {
          strengthScores[key as StrengthsDomain] += score
        }
      }

      if (option.scores.wealth) {
        for (const [key, score] of Object.entries(option.scores.wealth)) {
          wealthScores[key as WealthProfile] += score
        }
      }

      if (option.scores.kolbe) {
        for (const [key, score] of Object.entries(option.scores.kolbe)) {
          kolbeScores[key as KolbeMode] += score
        }
      }
    }
  }

  // Forças — ordenadas
  const sortedStrengths = Object.entries(strengthScores).sort(
    (a, b) => b[1] - a[1]
  ) as [StrengthsDomain, number][]
  const topStrength = sortedStrengths[0][0]

  // Wealth — top 2
  const sortedWealth = Object.entries(wealthScores).sort(
    (a, b) => b[1] - a[1]
  ) as [WealthProfile, number][]
  const topWealth = sortedWealth[0][0]
  const secondWealth = sortedWealth[1][0]

  // Kolbe — dominante
  const sortedKolbe = Object.entries(kolbeScores).sort(
    (a, b) => b[1] - a[1]
  ) as [KolbeMode, number][]
  const topKolbe = sortedKolbe[0][0]

  // Zona (Hendricks) — baseada na consistência
  const totalStrength = Object.values(strengthScores).reduce((a, b) => a + b, 0)
  const consistency = totalStrength > 0 ? sortedStrengths[0][1] / totalStrength : 0

  let zone: HendricksZone
  if (consistency > 0.50) zone = 'genius'
  else if (consistency > 0.35) zone = 'excellence'
  else zone = 'competence'

  return {
    zone,
    zoneTitle: ZONE_TITLES[zone],
    zoneConfidence: Math.round(consistency * 100),

    strengthsDomain: topStrength,
    strengthsTop: sortedStrengths.slice(0, 3).map(([k]) => k),
    strengthsScores: strengthScores,

    wealthProfile: topWealth,
    wealthSecondary: secondWealth,
    wealthScores: wealthScores,

    kolbeDominant: topKolbe,
    kolbeScores: kolbeScores,

    archetype: `${STRENGTHS_TITLES[topStrength]} · ${WEALTH_TITLES[topWealth]}`,
    consistency: Math.round(consistency * 100),

    openAnswers,
    allAnswers: answers,
  }
}

// --- Helpers para o prompt do GPT ---

export function formatScoresForPrompt(result: AssessmentResult): string {
  const lines: string[] = []

  lines.push('## SCORES CALCULADOS')
  lines.push('')

  // Zona
  lines.push(`### Hendricks — Zona de Genialidade`)
  lines.push(`- Zona atual: ${result.zoneTitle} (confiança: ${result.zoneConfidence}%)`)
  lines.push('')

  // Forças
  lines.push(`### Clifton — Domínio de Forças`)
  lines.push(`- Domínio principal: ${STRENGTHS_TITLES[result.strengthsDomain]} (${result.strengthsDomain})`)
  lines.push(`- Top 3: ${result.strengthsTop.map((s) => STRENGTHS_TITLES[s]).join(', ')}`)
  for (const [key, val] of Object.entries(result.strengthsScores)) {
    lines.push(`  - ${STRENGTHS_TITLES[key as StrengthsDomain]}: ${val} pontos`)
  }
  lines.push('')

  // Wealth
  lines.push(`### Hamilton — Wealth Dynamics`)
  lines.push(`- Perfil primário: ${WEALTH_TITLES[result.wealthProfile]} (${result.wealthProfile})`)
  lines.push(`- Perfil secundário: ${WEALTH_TITLES[result.wealthSecondary]} (${result.wealthSecondary})`)
  for (const [key, val] of Object.entries(result.wealthScores)) {
    lines.push(`  - ${WEALTH_TITLES[key as WealthProfile]}: ${val} pontos`)
  }
  lines.push('')

  // Kolbe
  lines.push(`### Kolbe — Modos de Ação`)
  lines.push(`- Modo dominante: ${KOLBE_TITLES[result.kolbeDominant]} (${result.kolbeDominant})`)
  for (const [key, val] of Object.entries(result.kolbeScores)) {
    lines.push(`  - ${KOLBE_TITLES[key as KolbeMode]}: ${val} pontos`)
  }
  lines.push('')

  // Arquétipo
  lines.push(`### Arquétipo Combinado`)
  lines.push(`- ${result.archetype}`)
  lines.push(`- Consistência: ${result.consistency}%`)
  lines.push('')

  // Respostas abertas
  if (Object.keys(result.openAnswers).length > 0) {
    lines.push('## RESPOSTAS ABERTAS DO UTILIZADOR')
    lines.push('')
    const questionLabels: Record<string, string> = {
      ctx_oque_faz: 'O que faz no dia a dia',
      ctx_sem_dinheiro: 'Se dinheiro não fosse problema',
      talent_competencia_genialidade: 'Faz bem mas não gosta',
      vision_90dias: 'Resultado desejado em 90 dias',
      vision_bloqueio: 'Maior obstáculo atual',
    }
    for (const [key, val] of Object.entries(result.openAnswers)) {
      lines.push(`**${questionLabels[key] || key}:** ${val}`)
      lines.push('')
    }
  }

  // Respostas de contexto relevantes
  lines.push('## CONTEXTO ADICIONAL')
  lines.push('')
  const contextKeys: Record<string, string> = {
    ctx_area: 'Área de atuação',
    ctx_experiencia: 'Tempo de experiência',
    ctx_intro_extro: 'Introversão/Extroversão',
    ctx_analitico_intuitivo: 'Analítico/Intuitivo',
    ctx_estrutura_flex: 'Estrutura/Flexibilidade',
    biz_como_ganha: 'Modelo de negócio preferido',
    biz_risco: 'Tolerância ao risco',
    biz_solo_time: 'Solo vs equipa',
    biz_preco: 'Relação com preço',
    biz_escala: 'Preferência de escala',
    vision_receita: 'Meta de receita',
    vision_tempo: 'Tempo disponível',
    vision_ai: 'Experiência com AI',
  }

  for (const [key, label] of Object.entries(contextKeys)) {
    const val = result.allAnswers[key]
    if (val) {
      lines.push(`- ${label}: ${Array.isArray(val) ? val.join(', ') : val}`)
    }
  }

  return lines.join('\n')
}
