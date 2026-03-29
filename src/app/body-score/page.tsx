'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { questions } from '@/lib/body-score/data'
import { calculateBodyScore, type BodyScoreResult } from '@/lib/body-score/engine'

type Step = 'landing' | 'quiz' | 'email' | 'processing' | 'result'

export default function BodyScorePage() {
  const [step, setStep] = useState<Step>('landing')
  const [qi, setQi] = useState(0)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [result, setResult] = useState<BodyScoreResult | null>(null)
  const [fade, setFade] = useState(true)

  const transition = useCallback((fn: () => void) => {
    setFade(false)
    setTimeout(() => {
      fn()
      setFade(true)
    }, 200)
  }, [])

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [questions[qi].id]: value }
    setAnswers(newAnswers)

    if (qi < questions.length - 1) {
      transition(() => setQi(qi + 1))
    } else {
      // Quiz done — go straight to processing (email already captured)
      const res = calculateBodyScore(newAnswers)
      setResult(res)
      fetch('/api/body-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, answers: newAnswers, result: res, step: 'completed' }),
      }).catch(() => {})
      transition(() => setStep('processing'))
    }
  }

  const goBack = () => {
    if (qi > 0) transition(() => setQi(qi - 1))
    else transition(() => setStep('landing'))
  }


  return (
    <main className="min-h-screen bg-[#0A0E1A] text-[#F0ECE4] font-sans selection:bg-[#BFD64B]/20">
      <div
        className={`transition-opacity duration-200 ${fade ? 'opacity-100' : 'opacity-0'}`}
      >
        {step === 'landing' && (
          <LandingScreen onStart={() => transition(() => setStep('email'))} />
        )}
        {step === 'email' && (
          <EmailScreen
            name={name}
            email={email}
            onNameChange={setName}
            onEmailChange={setEmail}
            onContinue={() => {
              fetch('/api/body-score', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, step: 'started', timestamp: new Date().toISOString() }),
              }).catch(() => {})
              transition(() => setStep('quiz'))
            }}
          />
        )}
        {step === 'quiz' && (
          <QuestionScreen
            question={questions[qi]}
            index={qi}
            total={questions.length}
            selectedValue={answers[questions[qi].id]}
            onAnswer={handleAnswer}
            onBack={goBack}
          />
        )}
        {step === 'processing' && (
          <ProcessingScreen onDone={() => setStep('result')} />
        )}
        {step === 'result' && result && (
          <ResultScreen result={result} name={name} />
        )}
      </div>
    </main>
  )
}

// ============================================================
// Landing Screen
// ============================================================
function LandingScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="mb-8">
        <span className="text-xs tracking-[6px] text-[#BFD64B]/60 uppercase">Method C</span>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-[#F0ECE4] sm:text-5xl">
          Body Score
        </h1>
      </div>

      <h2 className="max-w-md text-xl font-semibold text-[#F0ECE4] sm:text-2xl">
        Your body is talking.{' '}
        <span className="text-[#BFD64B]">Are you listening?</span>
      </h2>

      <p className="mt-4 max-w-sm text-sm text-[#F0ECE4]/50 leading-relaxed">
        Take this free 2-minute assessment to discover your body&apos;s current level
        — and what it needs to move, feel, and perform better.
      </p>

      <button
        onClick={onStart}
        className="mt-8 rounded-lg bg-[#BFD64B] px-8 py-3.5 text-sm font-bold tracking-wide text-black transition hover:bg-[#d4e66b] hover:shadow-[0_0_24px_rgba(191,214,75,0.3)]"
      >
        START FREE ASSESSMENT
      </button>

      <p className="mt-6 text-xs text-[#F0ECE4]/30">
        8 questions &middot; 2 minutes &middot; Instant results
      </p>

      <div className="mt-12 flex items-center gap-6 text-xs text-[#F0ECE4]/30">
        <span>No equipment needed</span>
        <span className="h-3 w-px bg-[#F0ECE4]/10" />
        <span>Science-based</span>
        <span className="h-3 w-px bg-[#F0ECE4]/10" />
        <span>100% free</span>
      </div>
    </div>
  )
}

// ============================================================
// Question Screen
// ============================================================
function QuestionScreen({
  question,
  index,
  total,
  selectedValue,
  onAnswer,
  onBack,
}: {
  question: (typeof questions)[number]
  index: number
  total: number
  selectedValue?: string
  onAnswer: (value: string) => void
  onBack: () => void
}) {
  const progress = ((index) / total) * 100

  return (
    <div className="flex min-h-screen flex-col px-6 pt-6 pb-12">
      <div className="mx-auto w-full max-w-lg">
        <div className="mb-1 flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-sm text-[#F0ECE4]/40 hover:text-[#BFD64B] transition"
          >
            &larr;
          </button>
          <span className="font-mono text-xs text-[#F0ECE4]/30">
            {index + 1}/{total}
          </span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-[#F0ECE4]/10">
          <div
            className="h-full rounded-full bg-[#BFD64B] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="w-full max-w-lg">
          <h2 className="mb-2 text-xl font-bold text-[#F0ECE4] sm:text-2xl">
            {question.question}
          </h2>
          {question.subtitle && (
            <p className="mb-8 text-sm text-[#F0ECE4]/40">{question.subtitle}</p>
          )}

          <div className="space-y-3">
            {question.options.map((option) => (
              <button
                key={option.value}
                onClick={() => onAnswer(option.value)}
                className={`w-full rounded-lg border px-5 py-4 text-left text-sm transition ${
                  selectedValue === option.value
                    ? 'border-[#BFD64B] bg-[#BFD64B]/10 text-[#BFD64B]'
                    : 'border-white/10 bg-[#F0ECE4]/5 text-[#F0ECE4]/80 hover:border-[#BFD64B]/30 hover:bg-[#F0ECE4]/8'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Email Capture (after quiz, before results)
// ============================================================
function EmailScreen({
  name,
  email,
  onNameChange,
  onEmailChange,
  onContinue,
}: {
  name: string
  email: string
  onNameChange: (v: string) => void
  onEmailChange: (v: string) => void
  onContinue: () => void
}) {
  const valid = name.trim().length > 1 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (valid) onContinue()
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <h2 className="mb-2 text-center text-xl font-bold text-[#F0ECE4]">
        Before we start
      </h2>
      <p className="mb-8 max-w-sm text-center text-sm text-[#F0ECE4]/50">
        Enter your name and email so we can save your results and send your personalized report.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div>
          <label htmlFor="bs-name" className="mb-1 block text-xs tracking-wider text-[#F0ECE4]/40 uppercase">
            Your name
          </label>
          <input
            id="bs-name"
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="John"
            className="w-full rounded-lg border border-white/10 bg-[#F0ECE4]/5 px-4 py-3 text-[#F0ECE4] placeholder-white/20 outline-none focus:border-[#BFD64B] transition"
            autoFocus
          />
        </div>

        <div>
          <label htmlFor="bs-email" className="mb-1 block text-xs tracking-wider text-[#F0ECE4]/40 uppercase">
            Your email
          </label>
          <input
            id="bs-email"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="john@example.com"
            className="w-full rounded-lg border border-white/10 bg-[#F0ECE4]/5 px-4 py-3 text-[#F0ECE4] placeholder-white/20 outline-none focus:border-[#BFD64B] transition"
          />
        </div>

        <button
          type="submit"
          disabled={!valid}
          className="w-full rounded-lg bg-[#BFD64B] py-3.5 text-sm font-bold text-black transition hover:bg-[#d4e66b] hover:shadow-[0_0_24px_rgba(191,214,75,0.3)] disabled:opacity-30 disabled:hover:shadow-none"
        >
          START ASSESSMENT
        </button>
      </form>

      <p className="mt-8 max-w-sm text-center text-xs text-[#F0ECE4]/20">
        Your data is private. No spam, ever.
      </p>
    </div>
  )
}

// ============================================================
// Processing Screen
// ============================================================
const ANALYSIS_STEPS = [
  'Analyzing pain patterns...',
  'Evaluating mobility range...',
  'Assessing stability markers...',
  'Calculating your Body Score...',
  'Generating recommendations...',
]

function ProcessingScreen({ onDone }: { onDone: () => void }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= ANALYSIS_STEPS.length - 1) {
          clearInterval(stepInterval)
          return prev
        }
        return prev + 1
      })
    }, 600)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 2
      })
    }, 60)

    const timeout = setTimeout(() => onDoneRef.current(), 3500)

    return () => {
      clearInterval(stepInterval)
      clearInterval(progressInterval)
      clearTimeout(timeout)
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="mb-8 h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[#BFD64B]" />

      <h2 className="mb-6 text-xl font-bold text-[#BFD64B]">
        ANALYZING YOUR BODY
      </h2>

      <div className="mb-8 h-24 font-mono text-sm text-[#F0ECE4]/40">
        {ANALYSIS_STEPS.slice(0, stepIndex + 1).map((s, i) => (
          <p
            key={i}
            className={`transition-opacity duration-300 ${i === stepIndex ? 'text-[#BFD64B]' : 'text-[#F0ECE4]/20'}`}
          >
            &gt; {s}
          </p>
        ))}
      </div>

      <div className="w-48">
        <div className="h-1 w-full overflow-hidden rounded-full bg-[#F0ECE4]/10">
          <div
            className="h-full rounded-full bg-[#BFD64B] transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 font-mono text-xs text-[#F0ECE4]/30">{progress}%</p>
      </div>
    </div>
  )
}

// ============================================================
// Result Screen — The Mirror
// ============================================================
function ResultScreen({
  result,
  name,
}: {
  result: BodyScoreResult
  name: string
}) {
  const levelColor =
    result.level === 1
      ? 'text-red-400'
      : result.level === 2
        ? 'text-yellow-400'
        : 'text-green-400'

  const levelBg =
    result.level === 1
      ? 'bg-red-400'
      : result.level === 2
        ? 'bg-yellow-400'
        : 'bg-green-400'

  const levelBorder =
    result.level === 1
      ? 'border-red-400'
      : result.level === 2
        ? 'border-yellow-400'
        : 'border-green-400'

  const scoreColor =
    result.score < 40
      ? 'text-red-400'
      : result.score < 70
        ? 'text-yellow-400'
        : 'text-green-400'

  return (
    <div className="mx-auto max-w-lg px-6 py-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <p className="text-xs tracking-[4px] text-[#F0ECE4]/30 uppercase">Your Body Score</p>
        <h1 className="mt-2 text-3xl font-bold text-[#F0ECE4]">{name}</h1>
      </div>

      {/* Score Circle */}
      <div className="mb-4 flex flex-col items-center">
        <div className={`flex h-28 w-28 items-center justify-center rounded-full border-4 ${levelBorder}`}>
          <span className={`text-4xl font-bold ${scoreColor}`}>{result.score}</span>
        </div>
        <p className="mt-2 text-xs text-[#F0ECE4]/30">out of 100</p>
      </div>

      {/* Identity Badge */}
      <div className="mb-8 text-center">
        <span
          className={`inline-block rounded-full ${levelBg} px-4 py-1.5 text-xs font-bold tracking-wider text-black`}
        >
          {result.levelIdentity.toUpperCase()}
        </span>
        <p className="mt-2 text-xs text-[#F0ECE4]/40">{result.levelTitle}</p>
      </div>

      {/* The Subtitle — emotional hook */}
      <div className="mb-8 text-center">
        <p className={`text-lg font-semibold leading-relaxed ${levelColor}`}>
          {result.levelSubtitle}
        </p>
      </div>

      {/* The Mirror — "that's SO me" moment */}
      <div className={`mb-8 rounded-xl border ${levelBorder}/30 bg-[#F0ECE4]/5 p-6`}>
        <p className="mb-2 text-xs font-bold tracking-wider text-[#F0ECE4]/40 uppercase">
          Does this sound like you?
        </p>
        <p className="text-sm leading-relaxed text-[#F0ECE4]/80 italic">
          &ldquo;{result.levelMirror}&rdquo;
        </p>
      </div>

      {/* Description */}
      <div className="mb-8 rounded-xl border border-white/10 bg-[#F0ECE4]/5 p-6">
        <p className="mb-2 text-xs font-bold tracking-wider text-[#F0ECE4]/40 uppercase">
          What Your Score Means
        </p>
        <p className="text-sm leading-relaxed text-[#F0ECE4]/60">
          {result.levelDescription}
        </p>
      </div>

      {/* Insights (not "issues" — INSIGHTS) */}
      {result.topInsights.length > 0 && (
        <div className="mb-8 rounded-xl border border-white/10 bg-[#F0ECE4]/5 p-5">
          <p className="mb-3 text-xs font-bold tracking-wider text-[#F0ECE4]/40 uppercase">
            What Your Body Is Telling You
          </p>
          <div className="space-y-3">
            {result.topInsights.map((insight, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-[#F0ECE4]/70">
                <span className={`mt-1 h-2 w-2 rounded-full shrink-0 ${levelBg}`} />
                {insight}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendation */}
      <div className="mb-6 rounded-xl border border-[#BFD64B]/20 bg-[#BFD64B]/5 p-5">
        <p className="mb-2 text-xs font-bold tracking-wider text-[#BFD64B] uppercase">
          What You Need
        </p>
        <p className="text-sm leading-relaxed text-[#F0ECE4]/70">
          {result.recommendation}
        </p>
      </div>

      {/* Next Level */}
      <div className="mb-8 rounded-xl border border-white/10 bg-[#F0ECE4]/5 p-5">
        <p className="mb-2 text-xs font-bold tracking-wider text-[#BFD64B]/60 uppercase">
          What Comes Next
        </p>
        <p className="text-sm leading-relaxed text-[#F0ECE4]/50">
          {result.nextLevel}
        </p>
      </div>

      {/* Divider */}
      <div className="mb-8 border-t border-white/10" />

      {/* The Method C System */}
      <div className="mb-6 text-center">
        <p className="text-xs tracking-[4px] text-[#BFD64B]/60 uppercase">Introducing</p>
        <h2 className="mt-2 text-2xl font-bold text-[#F0ECE4]">Method C</h2>
        <p className="mt-2 text-sm text-[#F0ECE4]/50">
          A 3-level system that meets you where you are — and takes you where you want to go.
        </p>
      </div>

      <div className="mb-8 space-y-3">
        <div className={`rounded-lg border p-4 ${result.level === 1 ? 'border-[#BFD64B] bg-[#BFD64B]/5' : 'border-white/10 bg-[#F0ECE4]/5'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-bold ${result.level === 1 ? 'text-[#BFD64B]' : 'text-[#F0ECE4]/60'}`}>
                Level 1 — The Awakener
              </p>
              <p className="text-xs text-[#F0ECE4]/40 mt-1">From pain to freedom. Your body remembers how to move.</p>
            </div>
            {result.level === 1 && <span className="text-xs font-bold text-[#BFD64B] bg-[#BFD64B]/10 px-2 py-1 rounded">YOU</span>}
          </div>
        </div>
        <div className={`rounded-lg border p-4 ${result.level === 2 ? 'border-[#BFD64B] bg-[#BFD64B]/5' : 'border-white/10 bg-[#F0ECE4]/5'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-bold ${result.level === 2 ? 'text-[#BFD64B]' : 'text-[#F0ECE4]/60'}`}>
                Level 2 — The Builder
              </p>
              <p className="text-xs text-[#F0ECE4]/40 mt-1">From moving to mastering. Strength with purpose.</p>
            </div>
            {result.level === 2 && <span className="text-xs font-bold text-[#BFD64B] bg-[#BFD64B]/10 px-2 py-1 rounded">YOU</span>}
          </div>
        </div>
        <div className={`rounded-lg border p-4 ${result.level === 3 ? 'border-[#BFD64B] bg-[#BFD64B]/5' : 'border-white/10 bg-[#F0ECE4]/5'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-bold ${result.level === 3 ? 'text-[#BFD64B]' : 'text-[#F0ECE4]/60'}`}>
                Level 3 — The Performer
              </p>
              <p className="text-xs text-[#F0ECE4]/40 mt-1">From training to competing. HYROX and beyond.</p>
            </div>
            {result.level === 3 && <span className="text-xs font-bold text-[#BFD64B] bg-[#BFD64B]/10 px-2 py-1 rounded">YOU</span>}
          </div>
        </div>
      </div>

      {/* Founding Members CTA — Hormozi Stack */}
      <div className="mb-8 rounded-xl border border-[#BFD64B]/30 bg-gradient-to-b from-[#BFD64B]/10 to-transparent p-6">
        <div className="text-center">
          <p className="text-xs tracking-[3px] text-[#BFD64B]/80 uppercase">Founding Members</p>
          <p className="mt-1 text-xs text-[#F0ECE4]/30">Only 5 spots left — then price goes up</p>
        </div>

        {/* Value Stack */}
        <div className="mt-6 space-y-4">
          <p className="text-xs font-bold tracking-wider text-[#F0ECE4]/40 uppercase">Everything you get:</p>

          {/* Item 1 */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 text-[#BFD64B]">&#10003;</span>
              <div>
                <p className="text-sm font-semibold text-[#F0ECE4]/90">Full Body Assessment (15 tests)</p>
                <p className="text-xs text-[#F0ECE4]/40">Video-guided, zero equipment. A PT charges $80+ for this.</p>
              </div>
            </div>
            <span className="text-sm text-[#F0ECE4]/30 line-through shrink-0">$80</span>
          </div>

          {/* Item 2 */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 text-[#BFD64B]">&#10003;</span>
              <div>
                <p className="text-sm font-semibold text-[#F0ECE4]/90">Personalized Training Plan</p>
                <p className="text-xs text-[#F0ECE4]/40">Built around YOUR body, YOUR level, YOUR goals. Updated monthly.</p>
              </div>
            </div>
            <span className="text-sm text-[#F0ECE4]/30 line-through shrink-0">$60</span>
          </div>

          {/* Item 3 */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 text-[#BFD64B]">&#10003;</span>
              <div>
                <p className="text-sm font-semibold text-[#F0ECE4]/90">Weekly Coach Check-ins</p>
                <p className="text-xs text-[#F0ECE4]/40">Real feedback from a real coach. Not a chatbot. Not an app.</p>
              </div>
            </div>
            <span className="text-sm text-[#F0ECE4]/30 line-through shrink-0">$120</span>
          </div>

          {/* Item 4 */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 text-[#BFD64B]">&#10003;</span>
              <div>
                <p className="text-sm font-semibold text-[#F0ECE4]/90">Level Progression System</p>
                <p className="text-xs text-[#F0ECE4]/40">Clear milestones from Level 1 to Level 3. Know exactly where you are.</p>
              </div>
            </div>
            <span className="text-sm text-[#F0ECE4]/30 line-through shrink-0">$30</span>
          </div>

          {/* Item 5 */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 text-[#BFD64B]">&#10003;</span>
              <div>
                <p className="text-sm font-semibold text-[#F0ECE4]/90">Exercise Video Library</p>
                <p className="text-xs text-[#F0ECE4]/40">Every exercise demonstrated. No guessing. Perfect form every time.</p>
              </div>
            </div>
            <span className="text-sm text-[#F0ECE4]/30 line-through shrink-0">$29</span>
          </div>
        </div>

        {/* Bonus */}
        <div className="mt-6 rounded-lg border border-[#BFD64B]/20 bg-[#BFD64B]/5 p-4">
          <p className="text-xs font-bold tracking-wider text-[#BFD64B] uppercase">Founding Member Bonus</p>
          <div className="mt-2 flex items-start gap-2">
            <span className="mt-0.5 text-[#BFD64B]">&#9733;</span>
            <div>
              <p className="text-sm font-semibold text-[#F0ECE4]/90">Locked-in Price — Forever</p>
              <p className="text-xs text-[#F0ECE4]/40">When we raise the price (and we will), yours stays at $49. Guaranteed.</p>
            </div>
          </div>
        </div>

        {/* Total Value vs Price */}
        <div className="mt-6 border-t border-[#F0ECE4]/10 pt-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm text-[#F0ECE4]/40">Total value:</span>
            <span className="text-lg font-bold text-[#F0ECE4]/50 line-through">$319/mo</span>
          </div>
          <div className="mt-2 flex items-baseline justify-center gap-1">
            <span className="text-sm text-[#F0ECE4]/40">You pay:</span>
            <span className="text-4xl font-bold text-[#BFD64B]">$49</span>
            <span className="text-sm text-[#F0ECE4]/40">/month</span>
          </div>
          <p className="mt-1 text-xs text-[#BFD64B]/60">That&apos;s $1.63/day — less than your coffee</p>
        </div>

        {/* CTA */}
        <a
          href="https://buy.stripe.com/test"
          className="mt-6 block w-full rounded-lg bg-[#BFD64B] py-4 text-center text-base font-bold text-black transition hover:bg-[#d4e66b] hover:shadow-[0_0_24px_rgba(191,214,75,0.3)]"
        >
          JOIN NOW — $49/MONTH
        </a>

        {/* Guarantee */}
        <div className="mt-4 rounded-lg border border-[#F0ECE4]/10 bg-[#F0ECE4]/5 p-3 text-center">
          <p className="text-xs font-semibold text-[#F0ECE4]/70">
            30-Day Money-Back Guarantee
          </p>
          <p className="mt-1 text-xs text-[#F0ECE4]/40">
            If you don&apos;t feel a difference in 30 days, you get a full refund. No questions. No hassle.
          </p>
        </div>

        <p className="mt-3 text-center text-xs text-[#F0ECE4]/30">
          Cancel anytime. No contracts. No BS.
        </p>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 pt-8 text-center">
        <p className="text-xs tracking-[3px] text-[#F0ECE4]/20 uppercase">Method C</p>
        <p className="mt-2 text-xs text-[#F0ECE4]/30">
          From pain to performance. One level at a time.
        </p>
      </div>
    </div>
  )
}
