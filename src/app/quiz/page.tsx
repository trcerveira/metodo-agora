'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { questions } from '@/lib/quiz/data'
import { calculateResults, type QuizResult } from '@/lib/quiz/engine'

type Step = 'landing' | 'email' | 'quiz' | 'processing' | 'result'

export default function QuizPage() {
  const [step, setStep] = useState<Step>('landing')
  const [qi, setQi] = useState(0)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [result, setResult] = useState<QuizResult | null>(null)
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
      transition(() => {
        setStep('processing')
        const res = calculateResults(newAnswers)
        setResult(res)

        fetch('/api/quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, answers: newAnswers, result: res }),
        }).catch(() => {})
      })
    }
  }

  const goBack = () => {
    if (qi > 0) transition(() => setQi(qi - 1))
    else transition(() => setStep('email'))
  }

  return (
    <main className="min-h-screen bg-now-obsidian text-now-white font-sans selection:bg-now-green/20">
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
            onContinue={() => transition(() => setStep('quiz'))}
            onBack={() => transition(() => setStep('landing'))}
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
// Ecrã Inicial
// ============================================================
function LandingScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="mb-6">
        <span className="text-sm tracking-[6px] text-now-green-dark">MÉTODO</span>
        <h1 className="mt-1 text-5xl font-bold tracking-tight text-now-green sm:text-6xl">
          AGORA
        </h1>
      </div>

      <h2 className="max-w-lg text-2xl font-bold text-now-white sm:text-3xl">
        Descobre a Tua <span className="text-now-green">Zona de Genialidade</span>
      </h2>

      <p className="mt-4 max-w-md text-now-white/70">
        Em 3 minutos, descobre o que deverias estar a construir — baseado em 7
        frameworks comportamentais de elite usados pelos melhores empreendedores do mundo.
      </p>

      <button
        onClick={onStart}
        className="mt-8 rounded-md bg-now-green px-8 py-3.5 text-sm font-bold tracking-wide text-black transition hover:shadow-[0_0_20px_rgba(191,214,75,0.4)]"
      >
        COMEÇA O TESTE GRÁTIS
      </button>

      <p className="mt-6 text-xs text-now-green-dark">
        10 perguntas · 3 minutos · Resultado imediato
      </p>
    </div>
  )
}

// ============================================================
// Captura de Email
// ============================================================
function EmailScreen({
  name,
  email,
  onNameChange,
  onEmailChange,
  onContinue,
  onBack,
}: {
  name: string
  email: string
  onNameChange: (v: string) => void
  onEmailChange: (v: string) => void
  onContinue: () => void
  onBack: () => void
}) {
  const valid = name.trim().length > 1 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (valid) onContinue()
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <button
        onClick={onBack}
        className="absolute left-4 top-4 text-sm text-now-green-dark hover:text-now-green"
      >
        &larr; Voltar
      </button>

      <h2 className="mb-2 text-center text-xl font-bold text-now-green">
        Antes de começar
      </h2>
      <p className="mb-8 max-w-sm text-center text-sm text-now-white/60">
        Deixa o teu nome e email para guardar o teu resultado.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div>
          <label htmlFor="name" className="mb-1 block text-xs tracking-wider text-now-green-dark">
            O TEU NOME
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="João"
            className="w-full rounded-md border border-now-green-dim bg-now-terminal px-4 py-3 text-now-white placeholder-now-white/30 outline-none focus:border-now-green"
            autoFocus
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-xs tracking-wider text-now-green-dark">
            O TEU EMAIL
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="joao@exemplo.com"
            className="w-full rounded-md border border-now-green-dim bg-now-terminal px-4 py-3 text-now-white placeholder-now-white/30 outline-none focus:border-now-green"
          />
        </div>

        <button
          type="submit"
          disabled={!valid}
          className="w-full rounded-md bg-now-green py-3.5 text-sm font-bold text-black transition hover:shadow-[0_0_20px_rgba(191,214,75,0.4)] disabled:opacity-30 disabled:hover:shadow-none"
        >
          CONTINUAR
        </button>
      </form>

      <p className="mt-8 max-w-sm text-center text-xs text-now-white/30">
        Os teus dados são privados. Sem spam, prometido.
      </p>
    </div>
  )
}

// ============================================================
// Ecrã de Pergunta
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
      {/* Barra de progresso */}
      <div className="mx-auto w-full max-w-lg">
        <div className="mb-1 flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-sm text-now-green-dark hover:text-now-green"
          >
            &larr;
          </button>
          <span className="font-mono text-xs text-now-green-dark">
            {index + 1}/{total}
          </span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-now-green-dim">
          <div
            className="h-full rounded-full bg-now-green transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Pergunta */}
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="w-full max-w-lg">
          <h2 className="mb-2 text-xl font-bold text-now-white sm:text-2xl">
            {question.question}
          </h2>
          {question.subtitle && (
            <p className="mb-8 text-sm text-now-white/50">{question.subtitle}</p>
          )}

          <div className="space-y-3">
            {question.options.map((option) => (
              <button
                key={option.value}
                onClick={() => onAnswer(option.value)}
                className={`w-full rounded-lg border px-5 py-4 text-left text-sm transition ${
                  selectedValue === option.value
                    ? 'border-now-green bg-now-green/10 text-now-green'
                    : 'border-now-green-dim bg-now-terminal text-now-white/80 hover:border-now-green-dark hover:bg-now-green-dim/30'
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
// Ecrã de Processamento
// ============================================================
const ANALYSIS_STEPS = [
  'A mapear Zona de Genialidade...',
  'A calcular Perfil de Riqueza...',
  'A identificar Domínio de Forças...',
  'A cruzar 7 frameworks...',
  'A gerar o teu relatório...',
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
      <div className="mb-8 h-8 w-8 animate-spin rounded-full border-2 border-now-green-dim border-t-now-green" />

      <h2 className="mb-6 text-xl font-bold text-now-green">
        A ANALISAR O TEU PERFIL
      </h2>

      <div className="mb-8 h-20 font-mono text-sm text-now-green-dark">
        {ANALYSIS_STEPS.slice(0, stepIndex + 1).map((s, i) => (
          <p
            key={i}
            className={`transition-opacity duration-300 ${i === stepIndex ? 'text-now-green' : 'text-now-green-dark/50'}`}
          >
            &gt; {s}
          </p>
        ))}
      </div>

      <div className="w-48">
        <div className="h-1 w-full overflow-hidden rounded-full bg-now-green-dim">
          <div
            className="h-full rounded-full bg-now-green transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 font-mono text-xs text-now-green-dark">{progress}%</p>
      </div>
    </div>
  )
}

// ============================================================
// Ecrã de Resultado
// ============================================================
function ResultScreen({
  result,
  name,
}: {
  result: QuizResult
  name: string
}) {
  const zoneBadge =
    result.zone === 'genius'
      ? 'bg-now-green text-black'
      : result.zone === 'excellence'
        ? 'bg-yellow-400 text-black'
        : 'bg-orange-400 text-black'

  return (
    <div className="mx-auto max-w-lg px-6 py-12">
      {/* Cabeçalho */}
      <div className="mb-8 text-center">
        <p className="text-xs tracking-[4px] text-now-green-dark">O TEU PERFIL</p>
        <h1 className="mt-2 text-3xl font-bold text-now-green">{name}</h1>
      </div>

      {/* Badge da Zona */}
      <div className="mb-8 rounded-lg border border-now-green-dim bg-now-terminal p-6 text-center">
        <span
          className={`inline-block rounded-full px-4 py-1.5 text-xs font-bold tracking-wider ${zoneBadge}`}
        >
          {result.zoneTitle.toUpperCase()}
        </span>
        <p className="mt-4 text-sm leading-relaxed text-now-white/70">
          {result.zoneDescription}
        </p>
      </div>

      {/* Arquétipo */}
      <div className="mb-8 text-center">
        <p className="text-xs tracking-[3px] text-now-green-dark">O TEU ARQUÉTIPO</p>
        <h2 className="mt-2 text-2xl font-bold text-now-green">{result.archetype}</h2>
        <p className="mt-1 font-mono text-xs text-now-green-dark">
          Consistência: {result.consistency}%
        </p>
      </div>

      {/* Domínio de Forças */}
      <div className="mb-4 rounded-lg border border-now-green-dim bg-now-terminal p-5">
        <p className="mb-1 text-xs tracking-wider text-now-green-dark">
          DOMÍNIO DE FORÇAS
        </p>
        <h3 className="mb-2 text-lg font-bold text-now-green">
          {result.strengthsTitle}
        </h3>
        <p className="text-sm leading-relaxed text-now-white/70">
          {result.strengthsDescription}
        </p>
      </div>

      {/* Perfil de Riqueza */}
      <div className="mb-8 rounded-lg border border-now-green-dim bg-now-terminal p-5">
        <p className="mb-1 text-xs tracking-wider text-now-green-dark">
          PERFIL DE RIQUEZA
        </p>
        <h3 className="mb-2 text-lg font-bold text-now-green">
          {result.wealthTitle}
        </h3>
        <p className="text-sm leading-relaxed text-now-white/70">
          {result.wealthDescription}
        </p>
      </div>

      {/* Divisor */}
      <div className="mb-8 border-t border-now-green-dim" />

      {/* Teaser — o que falta */}
      <div className="mb-6">
        <h3 className="mb-2 text-base font-bold text-now-white">
          Isto foram 3 de 7 frameworks.
        </h3>
        <p className="mb-1 text-sm text-now-white/60">
          Acabaste de ver uma amostra. O pacote completo inclui:
        </p>
      </div>

      {/* O que recebem por €9 */}
      <div className="mb-6 rounded-lg border border-now-green-dim bg-now-terminal p-5">
        <p className="mb-3 text-xs font-bold tracking-wider text-now-green">O QUE RECEBES</p>
        <div className="space-y-2 text-sm text-now-white/70">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 text-now-green">1.</span>
            <span><strong className="text-now-white/90">Zona de Genialidade completa</strong> — 43 perguntas, 7 frameworks, relatório detalhado</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="mt-0.5 text-now-green">2.</span>
            <span><strong className="text-now-white/90">Instalar o Claude Code</strong> — passo a passo do zero, mesmo sem saber programar</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="mt-0.5 text-now-green">3.</span>
            <span><strong className="text-now-white/90">Agente Analyst</strong> — analisa o teu mercado e encontra oportunidades reais</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="mt-0.5 text-now-green">4.</span>
            <span><strong className="text-now-white/90">Agente PO</strong> — transforma a tua ideia num produto concreto</span>
          </div>
        </div>
      </div>

      {/* CTA principal */}
      <div className="mb-12">
        <a
          href="/comprar"
          className="block w-full rounded-lg bg-now-green py-4 text-center text-base font-bold text-black transition hover:shadow-[0_0_20px_rgba(191,214,75,0.4)]"
        >
          QUERO O PACOTE COMPLETO
        </a>
      </div>

      {/* Rodapé */}
      <div className="border-t border-now-green-dim pt-8 text-center">
        <img
          src="/logo-metodo-agora.png"
          alt="Método Agora"
          className="mx-auto w-48"
        />
        <p className="mt-3 text-xs text-now-green-dark">
          A revolução não espera.
        </p>
      </div>
    </div>
  )
}
