// ============================================================
// Method C — Body Score Quiz (EN)
// 10 questions · 2-3 min · Captures email · Scores Level 1/2/3
// Designed with "mirror effect" — person feels SEEN, not diagnosed
// ============================================================

export interface QuizOption {
  label: string
  value: string
  level1: number // Pain & Mobility (The Awakener)
  level2: number // Strength & Stability (The Builder)
  level3: number // Performance & Athlete (The Performer)
}

export interface QuizQuestion {
  id: string
  question: string
  subtitle?: string
  options: QuizOption[]
}

export const questions: QuizQuestion[] = [
  // Q1 — THE MIRROR (identity question — sets the emotional tone)
  {
    id: 'body_relationship',
    question: 'How would you describe your relationship with your body right now?',
    subtitle: 'Be honest. No one else will see this.',
    options: [
      { label: 'We\'re not on speaking terms — it hurts and I ignore it', value: 'ignoring', level1: 4, level2: 0, level3: 0 },
      { label: 'We\'re reconnecting — I know something needs to change', value: 'reconnecting', level1: 3, level2: 1, level3: 0 },
      { label: 'We\'re on good terms — I move well but want more', value: 'good', level1: 0, level2: 3, level3: 1 },
      { label: 'We\'re a team — I push it and it responds', value: 'team', level1: 0, level2: 0, level3: 4 },
    ],
  },

  // Q2 — THE MORNING TEST (universal, relatable)
  {
    id: 'morning',
    question: 'What happens in the first 10 seconds after you get out of bed?',
    subtitle: 'That moment when your feet hit the floor.',
    options: [
      { label: 'I groan. Everything is stiff. It takes a while to get going.', value: 'stiff', level1: 4, level2: 0, level3: 0 },
      { label: 'A few cracks and pops, but I manage.', value: 'cracks', level1: 2, level2: 2, level3: 0 },
      { label: 'I feel fine — no complaints.', value: 'fine', level1: 0, level2: 2, level3: 2 },
      { label: 'I feel ready. Sometimes I stretch because I enjoy it, not because I need to.', value: 'ready', level1: 0, level2: 0, level3: 4 },
    ],
  },

  // Q3 — THE DROPPED KEYS TEST (visual metaphor, instant recognition)
  {
    id: 'floor',
    question: 'You drop your keys on the floor. What does picking them up look like?',
    subtitle: 'Small movements reveal big truths.',
    options: [
      { label: 'I brace myself, bend my knees, and hope my back cooperates', value: 'brace', level1: 4, level2: 0, level3: 0 },
      { label: 'I can get them, but it\'s not exactly graceful', value: 'ungraceful', level1: 2, level2: 2, level3: 0 },
      { label: 'I just bend down and grab them — no big deal', value: 'easy', level1: 0, level2: 2, level3: 2 },
      { label: 'I could pick them up in a deep squat without thinking about it', value: 'squat', level1: 0, level2: 0, level3: 4 },
    ],
  },

  // Q4 — THE SITTING TRAP (everyone relates to this)
  {
    id: 'sitting',
    question: 'After sitting for 2 hours, you stand up. What does your body say?',
    subtitle: 'Your body is always talking. Most people just stopped listening.',
    options: [
      { label: '"Finally!" — everything is tight, hips locked, back aching', value: 'locked', level1: 4, level2: 0, level3: 0 },
      { label: '"Hmm" — a bit stiff, takes a few steps to loosen up', value: 'stiff', level1: 2, level2: 2, level3: 0 },
      { label: '"Fine" — I stand up and move on without noticing', value: 'fine', level1: 0, level2: 2, level3: 2 },
      { label: '"Let\'s go" — I rarely sit that long anyway', value: 'active', level1: 0, level2: 0, level3: 4 },
    ],
  },

  // Q5 — THE PAIN QUESTION (reframed as signal, not symptom)
  {
    id: 'pain_signal',
    question: 'How often does your body send you pain signals?',
    subtitle: 'Pain is not the enemy — it\'s a message you haven\'t decoded yet.',
    options: [
      { label: 'Daily — it\'s become background noise I try to ignore', value: 'daily', level1: 4, level2: 0, level3: 0 },
      { label: 'A few times a week — certain movements trigger it', value: 'weekly', level1: 3, level2: 1, level3: 0 },
      { label: 'Occasionally — only when I push too hard or sleep badly', value: 'occasionally', level1: 1, level2: 2, level3: 1 },
      { label: 'Rarely — and when it happens, I know exactly why', value: 'rarely', level1: 0, level2: 1, level3: 3 },
    ],
  },

  // Q6 — THE MOVEMENT IDENTITY (who are you physically?)
  {
    id: 'movement_identity',
    question: 'Which statement feels most TRUE about you right now?',
    subtitle: 'Not what you wish — what IS.',
    options: [
      { label: 'I\'ve lost touch with my body. I don\'t really move anymore.', value: 'lost', level1: 4, level2: 0, level3: 0 },
      { label: 'I move, but I know I\'m not moving WELL.', value: 'moving_poorly', level1: 2, level2: 2, level3: 0 },
      { label: 'I exercise regularly and feel decent, but I could be better.', value: 'decent', level1: 0, level2: 3, level3: 1 },
      { label: 'I train with intention. My body is a tool I\'ve learned to use.', value: 'trained', level1: 0, level2: 0, level3: 4 },
    ],
  },

  // Q7 — THE OVERHEAD TEST (physical reality check)
  {
    id: 'overhead',
    question: 'Raise both arms straight above your head. What happens?',
    subtitle: 'Try it right now. Seriously.',
    options: [
      { label: 'My arms don\'t go straight up — they angle forward or my back arches', value: 'restricted', level1: 4, level2: 0, level3: 0 },
      { label: 'They go up, but I feel tightness in my shoulders or upper back', value: 'tight', level1: 2, level2: 2, level3: 0 },
      { label: 'Full range — arms by my ears, no compensation', value: 'full', level1: 0, level2: 2, level3: 2 },
      { label: 'Full range with control — I could hold weight overhead comfortably', value: 'strong', level1: 0, level2: 0, level3: 4 },
    ],
  },

  // Q8 — THE FEAR QUESTION (emotional depth — this is the mirror moment)
  {
    id: 'fear',
    question: 'What\'s your biggest fear about your body in the next 10 years?',
    subtitle: 'This question matters more than you think.',
    options: [
      { label: 'That the pain gets worse and I lose my independence', value: 'independence', level1: 4, level2: 0, level3: 0 },
      { label: 'That I slowly become someone who "used to be active"', value: 'decline', level1: 2, level2: 2, level3: 0 },
      { label: 'That I never reach my physical potential', value: 'potential', level1: 0, level2: 2, level3: 2 },
      { label: 'Honestly? I\'m not afraid — I know what I\'m building', value: 'confident', level1: 0, level2: 0, level3: 4 },
    ],
  },

  // Q9 — THE GOAL (aspirational — what they WANT)
  {
    id: 'dream',
    question: 'If you could wake up tomorrow in your ideal body, what would be different?',
    subtitle: 'Dream for a second. What does that version of you feel like?',
    options: [
      { label: 'No pain. Just... no pain. That would change everything.', value: 'no_pain', level1: 4, level2: 0, level3: 0 },
      { label: 'I\'d move with confidence — no stiffness, no limitations', value: 'confidence', level1: 1, level2: 3, level3: 0 },
      { label: 'I\'d be strong, lean, and feel powerful in my own skin', value: 'powerful', level1: 0, level2: 2, level3: 2 },
      { label: 'I\'d be ready to compete — HYROX, a marathon, whatever I choose', value: 'compete', level1: 0, level2: 0, level3: 4 },
    ],
  },

  // Q10 — THE COMMITMENT (closing — bridges to CTA)
  {
    id: 'commitment',
    question: 'If a system existed that could take you from where you are to where you want to be — would you commit?',
    subtitle: 'Not a gym. Not an app. A system built around YOUR body.',
    options: [
      { label: 'Yes — if someone finally showed me WHERE to start', value: 'where', level1: 4, level2: 0, level3: 0 },
      { label: 'Yes — if it was structured and I could see progress', value: 'structured', level1: 0, level2: 3, level3: 1 },
      { label: 'Yes — if it actually challenged me and wasn\'t generic', value: 'challenge', level1: 0, level2: 1, level3: 3 },
      { label: 'I\'m already committed — I just need the right system', value: 'ready', level1: 0, level2: 0, level3: 4 },
    ],
  },
]
