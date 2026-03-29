import { questions } from './data'

// ============================================================
// Body Score Engine — Level 1 / 2 / 3
// Each level has an IDENTITY, not just a label
// The result is a MIRROR, not a diagnosis
// ============================================================

export type Level = 1 | 2 | 3

export interface BodyScoreResult {
  level: Level
  levelTitle: string
  levelIdentity: string
  levelSubtitle: string
  levelDescription: string
  levelMirror: string // The "that's SO me" moment
  score: number
  maxScore: number
  topInsights: string[]
  recommendation: string
  nextLevel: string
}

const LEVEL_DATA: Record<Level, {
  title: string
  identity: string
  subtitle: string
  description: string
  mirror: string
  recommendation: string
  nextLevel: string
}> = {
  1: {
    title: 'Level 1 — Pain & Mobility',
    identity: 'The Awakener',
    subtitle: 'Your body has been trying to talk to you. Today, you finally listened.',
    description:
      'You\'re carrying tension, stiffness, and pain that\'s been building for months — maybe years. You\'ve been pushing through it, ignoring the signals, hoping it would fix itself. It won\'t. But here\'s what most people don\'t understand: you\'re not broken. Your body just forgot how to move the way it was designed to. And that can be re-learned — faster than you think.',
    mirror: 'You\'re the person who says "I\'m fine" while wincing when you tie your shoes. You know something\'s off, but you don\'t know where to start. That confusion ends today.',
    recommendation:
      'You don\'t need a gym. You don\'t need to "push through it." You need a precise mobility and stability program that unlocks your joints one by one, starting with the ones that are screaming the loudest. The right system will have you moving pain-free in weeks, not months.',
    nextLevel: 'Once your pain is gone and your joints are free, you\'ll graduate to Level 2 — where we build real strength on your new foundation.',
  },
  2: {
    title: 'Level 2 — Strength & Stability',
    identity: 'The Builder',
    subtitle: 'The foundation is there. Now it\'s time to build something on it.',
    description:
      'You\'ve moved past the pain phase — you\'re active, you move reasonably well, and you\'re not dealing with constant discomfort. But deep down, you know there\'s a gap between where you are and where you could be. You\'re functional, but not strong. You move, but you don\'t move with confidence. Level 2 is where that changes.',
    mirror: 'You\'re the person who exercises but secretly wonders if you\'re doing it right. You\'ve tried programs but never felt like they were built for YOUR body. You\'re not a beginner — but you\'re not where you want to be either.',
    recommendation:
      'You need progressive, structured strength training that builds on your existing mobility. Not random workouts — a system that tracks your progress, challenges you at the right pace, and gives you the confidence that every session is taking you somewhere.',
    nextLevel: 'When your strength matches your mobility, you unlock Level 3 — where training becomes performance and fitness becomes sport.',
  },
  3: {
    title: 'Level 3 — Performance & Athlete',
    identity: 'The Performer',
    subtitle: 'You\'re not here to get fit. You\'re here to see what you\'re capable of.',
    description:
      'Your mobility is excellent, your strength is solid, and you train with intention. You\'re in the top tier. Most people never get here. Level 3 isn\'t about fixing problems — it\'s about pushing boundaries. HYROX. Competitions. Personal records. Whatever your arena, this is where fitness stops being a habit and becomes a pursuit.',
    mirror: 'You\'re the person who gets restless on rest days. You don\'t just work out — you train. You have goals, timelines, and the discipline to chase them. You just need the right system to channel that energy.',
    recommendation:
      'You need periodized, sport-specific programming with clear competition prep cycles. Progressive overload, energy system development, and a coach who understands the difference between training hard and training smart.',
    nextLevel: 'Level 3 is not the end — it\'s where the game begins. Your next milestone is yours to define.',
  },
}

export function calculateBodyScore(answers: Record<string, string>): BodyScoreResult {
  let level1Score = 0
  let level2Score = 0
  let level3Score = 0

  for (const [qId, answerValue] of Object.entries(answers)) {
    const question = questions.find((q) => q.id === qId)
    if (!question) continue

    const option = question.options.find((o) => o.value === answerValue)
    if (!option) continue

    level1Score += option.level1
    level2Score += option.level2
    level3Score += option.level3
  }

  const totalScore = level1Score + level2Score + level3Score

  // Determine level
  let level: Level
  if (level1Score >= level2Score && level1Score >= level3Score) {
    level = 1
  } else if (level3Score >= level2Score) {
    level = 3
  } else {
    level = 2
  }

  // Body score out of 100 (higher = better physical condition)
  const rawScore = Math.round(((level2Score + level3Score) / (totalScore || 1)) * 100)
  const bodyScore = Math.min(rawScore, 100)

  // Insights based on specific answers (not "issues" — INSIGHTS)
  const topInsights: string[] = []

  const bodyRel = answers['body_relationship']
  const morning = answers['morning']
  const pain = answers['pain_signal']
  const fear = answers['fear']
  const movement = answers['movement_identity']
  const sitting = answers['sitting']

  if (bodyRel === 'ignoring' || bodyRel === 'reconnecting')
    topInsights.push('Your body-mind connection needs rebuilding — this is where transformation starts')
  if (morning === 'stiff' || morning === 'cracks')
    topInsights.push('Morning stiffness is your body\'s daily report card — yours says "help"')
  if (pain === 'daily' || pain === 'weekly')
    topInsights.push('Your pain isn\'t random — it\'s a pattern that can be decoded and reversed')
  if (sitting === 'locked' || sitting === 'stiff')
    topInsights.push('Prolonged sitting has shortened your hip flexors and weakened your posterior chain')
  if (fear === 'independence' || fear === 'decline')
    topInsights.push('Your fear is valid — but it\'s also your strongest fuel for change')
  if (movement === 'lost' || movement === 'moving_poorly')
    topInsights.push('You haven\'t lost the ability to move well — you\'ve just stopped practicing it')

  if (topInsights.length === 0)
    topInsights.push('Your body is well-maintained — now it\'s about optimization, not repair')

  const levelData = LEVEL_DATA[level]

  return {
    level,
    levelTitle: levelData.title,
    levelIdentity: levelData.identity,
    levelSubtitle: levelData.subtitle,
    levelDescription: levelData.description,
    levelMirror: levelData.mirror,
    score: bodyScore,
    maxScore: 100,
    topInsights,
    recommendation: levelData.recommendation,
    nextLevel: levelData.nextLevel,
  }
}
