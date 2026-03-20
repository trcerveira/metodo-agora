'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import {
  sections,
  getAllQuestions,
  getTotalQuestions,
  getSectionForQuestion,
  type AssessmentQuestion,
} from '@/lib/assessment/data'
import {
  calculateAssessmentResults,
  formatScoresForPrompt,
} from '@/lib/assessment/engine'

type Step = 'intro' | 'name' | 'quiz' | 'processing' | 'error'

export default function AssessmentPage() {
  const [step, setStep] = useState<Step>('intro')
  const [qi, setQi] = useState(0)
  const [name, setName] = useState('')
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [fade, setFade] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  const allQuestions = getAllQuestions()
  const totalQuestions = getTotalQuestions()

  const transition = useCallback((fn: () => void) => {
    setFade(false)
    setTimeout(() => {
      fn()
      setFade(true)
    }, 200)
  }, [])

  const handleSingleAnswer = (value: string) => {
    const q = allQuestions[qi]
    const newAnswers = { ...answers, [q.id]: value }
    setAnswers(newAnswers)

    if (qi < totalQuestions - 1) {
      transition(() => setQi(qi + 1))
    } else {
      finishAssessment(newAnswers)
    }
  }

  const handleMultiToggle = (value: string) => {
    const q = allQuestions[qi]
    const current = (answers[q.id] as string[]) || []
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    setAnswers({ ...answers, [q.id]: updated })
  }

  const handleMultiConfirm = () => {
    if (qi < totalQuestions - 1) {
      transition(() => setQi(qi + 1))
    } else {
      finishAssessment(answers)
    }
  }

  const handleOpenAnswer = (value: string) => {
    setAnswers({ ...answers, [allQuestions[qi].id]: value })
  }

  const handleOpenConfirm = () => {
    const q = allQuestions[qi]
    const val = answers[q.id]
    if (!val || (typeof val === 'string' && val.trim().length < 3)) return

    if (qi < totalQuestions - 1) {
      transition(() => setQi(qi + 1))
    } else {
      finishAssessment(answers)
    }
  }

  const goBack = () => {
    if (qi > 0) transition(() => setQi(qi - 1))
    else transition(() => setStep('name'))
  }

  const finishAssessment = async (finalAnswers: Record<string, string | string[]>) => {
    transition(() => setStep('processing'))

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 90000) // 90s timeout

    try {
      const result = calculateAssessmentResults(finalAnswers)
      const formattedScores = formatScoresForPrompt(result)

      const res = await fetch('/api/generate-blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, formattedScores }),
        signal: controller.signal,
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Erro na API' }))
        throw new Error(err.error || 'Erro na API')
      }

      const saveBlueprintData = (text: string) => {
        localStorage.setItem(
          'blueprint_data',
          JSON.stringify({
            name,
            blueprint: text,
            result: {
              zone: result.zone,
              zoneTitle: result.zoneTitle,
              archetype: result.archetype,
              strengthsDomain: result.strengthsDomain,
              wealthProfile: result.wealthProfile,
              kolbeDominant: result.kolbeDominant,
              consistency: result.consistency,
            },
            timestamp: new Date().toISOString(),
          })
        )
      }

      // Ler o stream correctamente (a API retorna streaming de texto, não JSON)
      const reader = res.body?.getReader()

      if (!reader) {
        // Fallback para browsers sem ReadableStream (iOS Safari < 16.4)
        const fullText = await res.text()
        saveBlueprintData(fullText)
        window.location.href = '/resultado'
        return
      }

      const decoder = new TextDecoder()
      let fullText = ''

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          fullText += decoder.decode(value, { stream: true })
        }
      } finally {
        reader.releaseLock()
      }

      saveBlueprintData(fullText)
      window.location.href = '/resultado'
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setErrorMsg('A geração demorou demasiado. Verifica a tua ligação e tenta novamente.')
      } else {
        setErrorMsg('Houve um erro ao gerar o teu Blueprint. Tenta novamente.')
      }
      setStep('error')
    } finally {
      clearTimeout(timeout)
    }
  }

  return (
    <main className="min-h-screen bg-now-obsidian text-now-white font-sans selection:bg-now-green/20">
      <div className={`transition-opacity duration-200 ${fade ? 'opacity-100' : 'opacity-0'}`}>
        {step === 'intro' && (
          <IntroScreen onStart={() => transition(() => setStep('name'))} />
        )}
        {step === 'name' && (
          <NameScreen
            name={name}
            onNameChange={setName}
            onContinue={() => transition(() => setStep('quiz'))}
            onBack={() => transition(() => setStep('intro'))}
          />
        )}
        {step === 'quiz' && (
          <QuizScreen
            question={allQuestions[qi]}
            questionIndex={qi}
            totalQuestions={totalQuestions}
            answer={answers[allQuestions[qi].id]}
            onSingleAnswer={handleSingleAnswer}
            onMultiToggle={handleMultiToggle}
            onMultiConfirm={handleMultiConfirm}
            onOpenAnswer={handleOpenAnswer}
            onOpenConfirm={handleOpenConfirm}
            onBack={goBack}
          />
        )}
        {step === 'processing' && <ProcessingScreen />}
        {step === 'error' && (
          <ErrorScreen
            message={errorMsg}
            onRetry={() => finishAssessment(answers)}
          />
        )}
      </div>
    </main>
  )
}

// ============================================================
// Ecrã Intro
// ============================================================
function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="mb-6">
        <span className="text-sm tracking-[6px] text-now-green-dark">MÉTODO</span>
        <h1 className="mt-1 text-5xl font-bold tracking-tight text-now-green sm:text-6xl">
          AGORA
        </h1>
      </div>

      <h2 className="max-w-lg text-2xl font-bold text-now-white sm:text-3xl">
        Assessment Completo da <span className="text-now-green">Zona de Genialidade</span>
      </h2>

      <p className="mt-4 max-w-md text-now-white/70">
        43 perguntas · 7 frameworks de elite · Blueprint personalizado gerado por AI
        com o teu plano de monetização a 90 dias.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-3 text-left text-sm sm:grid-cols-2">
        {[
          { n: '1', t: 'Contexto Pessoal', d: '5 min' },
          { n: '2', t: 'Atividades e Energia', d: '8 min' },
          { n: '3', t: 'Talentos e Padrões', d: '7 min' },
          { n: '4', t: 'Estilo de Negócios', d: '5 min' },
          { n: '5', t: 'Visão e Ambição', d: '5 min' },
        ].map((s) => (
          <div
            key={s.n}
            className="flex items-center gap-3 rounded-lg border border-now-green-dim bg-now-terminal px-4 py-3"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-now-green text-xs font-bold text-black">
              {s.n}
            </span>
            <div>
              <p className="font-medium text-now-white">{s.t}</p>
              <p className="text-xs text-now-green-dark">{s.d}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onStart}
        className="mt-10 rounded-md bg-now-green px-10 py-4 text-sm font-bold tracking-wide text-black transition hover:shadow-[0_0_20px_rgba(191,214,75,0.4)]"
      >
        COMEÇAR ASSESSMENT
      </button>

      <p className="mt-4 text-xs text-now-green-dark">
        ~15-20 minutos · Resultado imediato · 100% personalizado
      </p>
    </div>
  )
}

// ============================================================
// Ecrã Nome
// ============================================================
function NameScreen({
  name,
  onNameChange,
  onContinue,
  onBack,
}: {
  name: string
  onNameChange: (v: string) => void
  onContinue: () => void
  onBack: () => void
}) {
  const valid = name.trim().length > 1

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <button
        onClick={onBack}
        className="absolute left-4 top-4 text-sm text-now-green-dark hover:text-now-green"
      >
        &larr; Voltar
      </button>

      <h2 className="mb-2 text-center text-xl font-bold text-now-green">
        Como te chamas?
      </h2>
      <p className="mb-8 max-w-sm text-center text-sm text-now-white/60">
        Precisamos do teu nome para personalizar o Blueprint.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (valid) onContinue()
        }}
        className="w-full max-w-sm space-y-4"
      >
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="O teu nome"
          className="w-full rounded-md border border-now-green-dim bg-now-terminal px-4 py-3 text-now-white placeholder-now-white/30 outline-none focus:border-now-green"
          autoFocus
        />
        <button
          type="submit"
          disabled={!valid}
          className="w-full rounded-md bg-now-green py-3.5 text-sm font-bold text-black transition hover:shadow-[0_0_20px_rgba(191,214,75,0.4)] disabled:opacity-30"
        >
          CONTINUAR
        </button>
      </form>
    </div>
  )
}

// ============================================================
// Ecrã de Pergunta (suporta single, multi, open)
// ============================================================
function QuizScreen({
  question,
  questionIndex,
  totalQuestions,
  answer,
  onSingleAnswer,
  onMultiToggle,
  onMultiConfirm,
  onOpenAnswer,
  onOpenConfirm,
  onBack,
}: {
  question: AssessmentQuestion
  questionIndex: number
  totalQuestions: number
  answer?: string | string[]
  onSingleAnswer: (value: string) => void
  onMultiToggle: (value: string) => void
  onMultiConfirm: () => void
  onOpenAnswer: (value: string) => void
  onOpenConfirm: () => void
  onBack: () => void
}) {
  const progress = (questionIndex / totalQuestions) * 100
  const { section, sectionIndex } = getSectionForQuestion(questionIndex)
  const multiSelected = Array.isArray(answer) ? answer : []
  const openValue = typeof answer === 'string' ? answer : ''

  return (
    <div className="flex min-h-screen flex-col px-6 pt-6 pb-12">
      {/* Header: secção + progresso */}
      <div className="mx-auto w-full max-w-lg">
        <div className="mb-2 flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-sm text-now-green-dark hover:text-now-green"
          >
            &larr;
          </button>
          <div className="text-right">
            <p className="text-xs font-medium text-now-green">
              {section.title}
            </p>
            <span className="font-mono text-xs text-now-green-dark">
              {questionIndex + 1}/{totalQuestions}
            </span>
          </div>
        </div>

        {/* Barra de progresso com marcadores de secção */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-now-green-dim">
          <div
            className="h-full rounded-full bg-now-green transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Indicadores de secção */}
        <div className="mt-2 flex gap-1">
          {sections.map((s, i) => (
            <div
              key={s.id}
              className={`h-1 flex-1 rounded-full ${
                i < sectionIndex
                  ? 'bg-now-green'
                  : i === sectionIndex
                    ? 'bg-now-green/50'
                    : 'bg-now-green-dim'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Pergunta */}
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="w-full max-w-lg">
          <h2 className="mb-2 text-xl font-bold text-now-white sm:text-2xl">
            {question.question}
          </h2>
          {question.subtitle && (
            <p className="mb-6 text-sm text-now-white/50">{question.subtitle}</p>
          )}

          {/* Single choice */}
          {question.type === 'single' && question.options && (
            <div className="space-y-3">
              {question.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onSingleAnswer(option.value)}
                  className={`w-full rounded-lg border px-5 py-4 text-left text-sm transition ${
                    answer === option.value
                      ? 'border-now-green bg-now-green/10 text-now-green'
                      : 'border-now-green-dim bg-now-terminal text-now-white/80 hover:border-now-green-dark hover:bg-now-green-dim/30'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}

          {/* Multi choice */}
          {question.type === 'multi' && question.options && (
            <div className="space-y-3">
              {question.options.map((option) => {
                const selected = multiSelected.includes(option.value)
                return (
                  <button
                    key={option.value}
                    onClick={() => onMultiToggle(option.value)}
                    className={`w-full rounded-lg border px-5 py-4 text-left text-sm transition ${
                      selected
                        ? 'border-now-green bg-now-green/10 text-now-green'
                        : 'border-now-green-dim bg-now-terminal text-now-white/80 hover:border-now-green-dark hover:bg-now-green-dim/30'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                          selected
                            ? 'border-now-green bg-now-green text-black'
                            : 'border-now-green-dim'
                        }`}
                      >
                        {selected && (
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                      {option.label}
                    </span>
                  </button>
                )
              })}

              <button
                onClick={onMultiConfirm}
                disabled={multiSelected.length === 0}
                className="mt-4 w-full rounded-md bg-now-green py-3.5 text-sm font-bold text-black transition hover:shadow-[0_0_20px_rgba(191,214,75,0.4)] disabled:opacity-30"
              >
                CONFIRMAR ({multiSelected.length} selecionadas)
              </button>
            </div>
          )}

          {/* Open-ended */}
          {question.type === 'open' && (
            <div className="space-y-4">
              {question.hint && (
                <p className="rounded-lg border border-now-green-dim bg-now-terminal p-4 text-xs text-now-white/40">
                  {question.hint}
                </p>
              )}
              <textarea
                value={openValue}
                onChange={(e) => onOpenAnswer(e.target.value)}
                placeholder="Escreve a tua resposta aqui..."
                maxLength={question.maxLength || 500}
                rows={4}
                className="w-full resize-none rounded-lg border border-now-green-dim bg-now-terminal px-4 py-3 text-sm text-now-white placeholder-now-white/30 outline-none focus:border-now-green"
                autoFocus
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-now-green-dark">
                  {openValue.length}/{question.maxLength || 500}
                </span>
                <button
                  onClick={onOpenConfirm}
                  disabled={openValue.trim().length < 3}
                  className="rounded-md bg-now-green px-8 py-3 text-sm font-bold text-black transition hover:shadow-[0_0_20px_rgba(191,214,75,0.4)] disabled:opacity-30"
                >
                  CONTINUAR
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Ecrã de Processamento
// ============================================================
const PROCESSING_STEPS = [
  'A analisar as tuas respostas...',
  'Gay Hendricks — Zona de Genialidade...',
  'Don Clifton — Mapa de Talentos...',
  'Dan Sullivan — Habilidade Única...',
  'Roger Hamilton — Perfil de Riqueza...',
  'Alex Hormozi — Plano de Monetização...',
  'Kathy Kolbe — Estilo de Execução...',
  'Sally Hogshead — Posicionamento...',
  'A cruzar os 7 frameworks...',
  'A gerar o teu Blueprint personalizado...',
]

function ProcessingScreen() {
  const [stepIndex, setStepIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= PROCESSING_STEPS.length - 1) {
          clearInterval(stepInterval)
          return prev
        }
        return prev + 1
      })
    }, 1500)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval)
          return 95
        }
        return prev + 1
      })
    }, 150)

    return () => {
      clearInterval(stepInterval)
      clearInterval(progressInterval)
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="mb-8 h-10 w-10 animate-spin rounded-full border-2 border-now-green-dim border-t-now-green" />

      <h2 className="mb-2 text-xl font-bold text-now-green">
        A GERAR O TEU BLUEPRINT
      </h2>
      <p className="mb-8 text-sm text-now-white/50">
        7 especialistas a analisar o teu perfil...
      </p>

      <div className="mb-8 h-40 overflow-hidden font-mono text-sm">
        {PROCESSING_STEPS.slice(0, stepIndex + 1).map((s, i) => (
          <p
            key={i}
            className={`transition-opacity duration-500 ${
              i === stepIndex ? 'text-now-green' : 'text-now-green-dark/40'
            }`}
          >
            &gt; {s}
          </p>
        ))}
      </div>

      <div className="w-56">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-now-green-dim">
          <div
            className="h-full rounded-full bg-now-green transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 font-mono text-xs text-now-green-dark">{progress}%</p>
      </div>
    </div>
  )
}

// ============================================================
// Ecrã de Erro
// ============================================================
function ErrorScreen({
  message,
  onRetry,
}: {
  message: string
  onRetry: () => void
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 text-4xl">!</div>
      <h2 className="mb-4 text-xl font-bold text-now-white">{message}</h2>
      <button
        onClick={onRetry}
        className="rounded-md bg-now-green px-8 py-3 text-sm font-bold text-black transition hover:shadow-[0_0_20px_rgba(191,214,75,0.4)]"
      >
        TENTAR NOVAMENTE
      </button>
    </div>
  )
}
