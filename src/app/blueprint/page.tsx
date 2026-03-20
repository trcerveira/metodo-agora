"use client";

import { useState, useEffect, useCallback } from "react";
import {
  sections as assessmentSections,
  getAllQuestions,
  getTotalQuestions,
  getSectionForQuestion,
  type AssessmentQuestion,
} from "@/lib/assessment/data";
import {
  calculateAssessmentResults,
  formatScoresForPrompt,
} from "@/lib/assessment/engine";

// --- Dados dos Módulos ---
const modules = [
  {
    id: "zg",
    number: 0,
    title: "Zona de Genialidade",
    subtitle: "Assessment completo — 7 frameworks",
    badge: "Genius",
    duration: "15-20 min",
    output: "Blueprint personalizado com plano a 90 dias",
  },
  {
    id: "m1",
    number: 1,
    title: "Entra na Máquina",
    subtitle: "Instalar Claude Code",
    badge: "Orquestrador",
    duration: "15 min",
    output: "Claude Code instalado e a funcionar",
  },
  {
    id: "m2",
    number: 2,
    title: 'Efeito "Eh Lá"',
    subtitle: "3 coisas em 10 minutos",
    badge: "Orquestrador",
    duration: "10 min",
    output: "README + Landing Page + Análise de mercado",
  },
  {
    id: "m3",
    number: 3,
    title: "O Terreno",
    subtitle: "4 comandos de terminal",
    badge: "Operator",
    duration: "15 min",
    output: "Pasta do projecto criada e organizada",
  },
  {
    id: "m4",
    number: 4,
    title: "A Cabine do Piloto",
    subtitle: "Interface do Claude Code",
    badge: "Operator",
    duration: "10 min",
    output: "Dominas as 3 zonas do terminal",
  },
  {
    id: "m5",
    number: 5,
    title: "Comandos de Combate",
    subtitle: "6 Slash Commands essenciais",
    badge: "Pilot",
    duration: "10 min",
    output: "6 comandos testados e dominados",
  },
  {
    id: "m6",
    number: 6,
    title: "A Caixa Negra",
    subtitle: "CLAUDE.md — memória permanente",
    badge: "Pilot",
    duration: "15 min",
    output: "Claude lembra-se de ti na próxima sessão",
  },
  {
    id: "m7",
    number: 7,
    title: "Activa o Squad",
    subtitle: "Instalar o NOW OX",
    badge: "Commander",
    duration: "15 min",
    output: "Squad operacional no terminal",
  },
  {
    id: "m8",
    number: 8,
    title: "Conhece a Equipa",
    subtitle: "Os agentes do NOW OX",
    badge: "Commander",
    duration: "10 min",
    output: "Sabes quem faz o quê no squad",
  },
  {
    id: "m9",
    number: 9,
    title: "Mission Briefing",
    subtitle: "PRD em 45 minutos",
    badge: "Builder",
    duration: "45 min",
    output: "PRD completo e profissional",
  },
];

// --- Mensagens do Guia por Módulo ---
const guideMessages: Record<number, { step: number; messages: string[] }[]> = {
  0: [ // M1 — Instalar
    { step: 0, messages: [
      "Olá, Orquestrador. Sou o teu guia. Não vou mostrar a cara — mas vou mostrar-te o caminho.",
      "Primeiro passo: abrir o terminal no teu computador.",
      "No Mac: procura 'Terminal' no Spotlight (Cmd + Espaço).",
      "No Windows: procura 'PowerShell' ou 'Command Prompt' no menu iniciar.",
      "Quando tiveres o terminal aberto, avisa-me. 👇",
    ]},
    { step: 1, messages: [
      "Perfeito. Estás no terminal.",
      "Vês aquele comando verde no Passo 1? Clica em 'copiar' e cola no teu terminal.",
      "Carrega Enter e espera uns segundos. O instalador faz tudo sozinho.",
      "Sem Node.js. Sem npm. Sem dependências. 1 comando e está feito.",
    ]},
    { step: 2, messages: [
      "Agora vamos verificar se ficou bem instalado.",
      "Copia o comando do Passo 2: claude doctor",
      "Se vês a versão e zero problemas — está perfeito.",
      "Se há erros, o doctor diz-te exactamente o que corrigir. Segue o que ele diz.",
    ]},
    { step: 3, messages: [
      "Quase lá. Agora vamos abrir o Claude Code pela primeira vez.",
      "Escreve 'claude' no terminal e carrega Enter.",
      "Ele vai abrir o browser para fazeres login. Usa a tua conta Claude Pro, Max ou Teams.",
      "Depois de login, volta ao terminal.",
    ]},
    { step: 4, messages: [
      "Último passo. Cria a pasta do teu projecto.",
      "Copia os dois comandos do Passo 4 — um cria a pasta, o outro abre o Claude Code dentro dela.",
      "Vês o cursor a piscar? 🔥",
      "ESTÁS DENTRO. A máquina está ligada. Tu és o piloto.",
      "Agora marca todos os checkpoints abaixo e avança para o próximo módulo.",
    ]},
  ],
  1: [ // M2 — Efeito Eh Lá
    { step: 0, messages: [
      "Pronto para o momento 'Eh Lá'?",
      "Nos próximos 10 minutos vais construir 3 coisas reais. Sem saber programar.",
      "Isto é o momento em que a descrença morre.",
      "Vamos a isso. 👇",
    ]},
  ],
};

// --- Componente: Chat do Guia ---
function ChatGuide({ moduleIndex, checkStep }: { moduleIndex: number; checkStep: number }) {
  const [visibleMessages, setVisibleMessages] = useState<string[]>([]);

  useEffect(() => {
    const moduleMessages = guideMessages[moduleIndex];
    if (!moduleMessages) {
      setVisibleMessages(["Módulo em construção. Em breve o teu guia estará aqui."]);
      return;
    }

    const allMessages: string[] = [];
    for (const group of moduleMessages) {
      if (group.step <= checkStep) {
        allMessages.push(...group.messages);
      }
    }
    setVisibleMessages(allMessages);
  }, [moduleIndex, checkStep]);

  return (
    <div className="flex flex-col h-full">
      {/* Header do Chat */}
      <div className="border-b border-now-green/10 px-4 py-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-now-green/10 border border-now-green/20 flex items-center justify-center">
          <span className="text-now-green text-xs">?</span>
        </div>
        <div>
          <p className="text-now-green font-mono text-sm font-bold">Guia NOW</p>
          <p className="text-now-green/30 font-mono text-xs">online — a guiar-te</p>
        </div>
      </div>

      {/* Mensagens */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {visibleMessages.map((msg, i) => (
          <div
            key={i}
            className="flex gap-2 animate-in fade-in slide-in-from-bottom-2"
            style={{ animationDelay: `${i * 100}ms`, animationFillMode: "backwards" }}
          >
            <div className="w-1 bg-now-green/20 rounded-full flex-shrink-0 mt-1" />
            <p className="text-now-ivory/80 text-sm font-mono leading-relaxed">
              {msg}
            </p>
          </div>
        ))}

        {/* Indicador de escrita */}
        <div className="flex gap-2 items-center pt-2">
          <div className="w-1 bg-now-green/10 rounded-full h-4" />
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-now-green/20 animate-pulse" />
            <span className="w-1.5 h-1.5 rounded-full bg-now-green/20 animate-pulse" style={{ animationDelay: "0.2s" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-now-green/20 animate-pulse" style={{ animationDelay: "0.4s" }} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-now-green/10 px-4 py-3">
        <p className="text-now-green/20 font-mono text-xs text-center italic">
          &quot;Em terra de cegos, quem tem um olho é rei.&quot;
        </p>
      </div>
    </div>
  );
}

// --- Componente: Barra de Progresso ---
function ProgressBar({ completed, total }: { completed: number; total: number }) {
  const percentage = Math.round((completed / total) * 100);

  const getBadge = () => {
    if (percentage === 0) return "—";
    if (percentage < 25) return "Orquestrador";
    if (percentage < 50) return "Operator";
    if (percentage < 75) return "Pilot";
    if (percentage < 90) return "Commander";
    if (percentage < 100) return "Builder";
    return "Launcher 🚀";
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-now-green text-sm font-mono font-bold">
          {percentage}% — {getBadge()}
        </span>
        <span className="text-now-green/40 text-xs font-mono">
          {completed}/{total} módulos
        </span>
      </div>
      <div className="w-full h-3 bg-now-gray rounded-full overflow-hidden border border-now-green/20">
        <div
          className="h-full bg-now-green rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// --- Componente: Aba do Módulo ---
function ModuleTab({
  mod,
  isActive,
  isCompleted,
  isLocked,
  onClick,
}: {
  mod: (typeof modules)[0];
  isActive: boolean;
  isCompleted: boolean;
  isLocked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      className={`
        relative px-3 py-2 text-xs font-mono rounded-t-lg transition-all border-b-2
        ${isActive
          ? "bg-now-terminal text-now-green border-now-green"
          : isCompleted
            ? "bg-now-green/10 text-now-green/80 border-now-green/30 hover:bg-now-green/20"
            : isLocked
              ? "bg-now-obsidian/50 text-now-green/20 border-transparent cursor-not-allowed"
              : "bg-now-obsidian text-now-green/50 border-transparent hover:text-now-green/70 hover:border-now-green/20"
        }
      `}
    >
      <span className="mr-1">
        {isCompleted ? "✅" : isLocked ? "🔒" : "🔓"}
      </span>
      {mod.number === 0 ? "ZG" : `M${mod.number}`}
    </button>
  );
}

// --- Componente: Bloco de Código Terminal ---
function TerminalBlock({ command, description }: { command: string; description?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-lg overflow-hidden border border-now-green/20">
      {description && (
        <div className="bg-now-green/5 px-4 py-2 text-xs text-now-green/60 font-mono">
          {description}
        </div>
      )}
      <div className="bg-now-obsidian px-4 py-3 flex items-center justify-between group">
        <code className="text-now-green font-mono text-sm">
          <span className="text-now-green/40">$ </span>{command}
        </code>
        <button
          onClick={handleCopy}
          className="text-now-green/30 hover:text-now-green text-xs font-mono transition-colors"
        >
          {copied ? "✓ copiado" : "copiar"}
        </button>
      </div>
    </div>
  );
}

// --- Componente: Checkpoint ---
function Checkpoint({ text, checked, onToggle }: { text: string; checked: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-3 w-full text-left py-2 px-3 rounded-lg hover:bg-now-green/5 transition-colors"
    >
      <div className={`
        w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all
        ${checked
          ? "bg-now-green border-now-green"
          : "border-now-green/30"
        }
      `}>
        {checked && <span className="text-now-obsidian text-xs font-bold">✓</span>}
      </div>
      <span className={`text-sm font-mono ${checked ? "text-now-green/50 line-through" : "text-now-ivory"}`}>
        {text}
      </span>
    </button>
  );
}

// --- Componente: Tabs de OS ---
function OSTabs({ activeOS, setActiveOS }: { activeOS: string; setActiveOS: (os: string) => void }) {
  const systems = [
    { id: "mac", label: "macOS / Linux", icon: "" },
    { id: "windows", label: "Windows", icon: "⊞" },
  ];

  return (
    <div className="flex gap-2 mb-3">
      {systems.map((os) => (
        <button
          key={os.id}
          onClick={() => setActiveOS(os.id)}
          className={`
            px-3 py-1.5 text-xs font-mono rounded-lg transition-all
            ${activeOS === os.id
              ? "bg-now-green/20 text-now-green border border-now-green/30"
              : "bg-now-obsidian text-now-green/30 border border-now-green/10 hover:text-now-green/50"
            }
          `}
        >
          {os.icon} {os.label}
        </button>
      ))}
    </div>
  );
}

// --- Conteúdo: Zona de Genialidade (Tab 0) ---
type ZGStep = 'intro' | 'name' | 'quiz' | 'processing' | 'result' | 'error'

function ZonaGenialidadeContent({ onComplete }: { onComplete: () => void }) {
  const [zgStep, setZgStep] = useState<ZGStep>('intro')
  const [zgName, setZgName] = useState('')
  const [qi, setQi] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [blueprint, setBlueprint] = useState<string | null>(null)
  const [fade, setFade] = useState(true)

  const allQuestions = getAllQuestions()
  const totalQuestions = getTotalQuestions()

  // Verificar se já tem blueprint guardado
  useEffect(() => {
    const saved = localStorage.getItem('blueprint_data')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (parsed.blueprint) {
        setBlueprint(parsed.blueprint)
        setZgName(parsed.name || '')
        setZgStep('result')
      }
    }
  }, [])

  const transition = useCallback((fn: () => void) => {
    setFade(false)
    setTimeout(() => { fn(); setFade(true) }, 200)
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
    const val = answers[allQuestions[qi].id]
    if (!val || (typeof val === 'string' && val.trim().length < 3)) return
    if (qi < totalQuestions - 1) {
      transition(() => setQi(qi + 1))
    } else {
      finishAssessment(answers)
    }
  }

  const goBack = () => {
    if (qi > 0) transition(() => setQi(qi - 1))
    else transition(() => setZgStep('name'))
  }

  const finishAssessment = async (finalAnswers: Record<string, string | string[]>) => {
    setZgStep('processing')
    try {
      const result = calculateAssessmentResults(finalAnswers)
      const formattedScores = formatScoresForPrompt(result)
      const res = await fetch('/api/generate-blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: zgName, formattedScores }),
      })
      if (!res.ok) throw new Error('Erro na API')
      const data = await res.json()
      setBlueprint(data.blueprint)
      localStorage.setItem('blueprint_data', JSON.stringify({
        name: zgName, blueprint: data.blueprint,
        result: { zone: result.zone, zoneTitle: result.zoneTitle, archetype: result.archetype, consistency: result.consistency },
        timestamp: new Date().toISOString(),
      }))
      setZgStep('result')
    } catch {
      setZgStep('error')
    }
  }

  // --- INTRO ---
  if (zgStep === 'intro') {
    return (
      <div className="space-y-6">
        <div className="border-l-2 border-now-green pl-4">
          <p className="text-now-green/60 text-xs font-mono uppercase tracking-wider mb-1">ASSESSMENT COMPLETO</p>
          <p className="text-now-ivory text-base">
            43 perguntas · 7 frameworks de elite · Blueprint personalizado gerado por AI com o teu plano de monetização a 90 dias.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {assessmentSections.map((s, i) => (
            <div key={s.id} className="flex items-center gap-3 rounded-lg border border-now-green/20 bg-now-terminal px-4 py-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-now-green text-xs font-bold text-black">
                {i + 1}
              </span>
              <div>
                <p className="font-mono text-sm text-now-ivory">{s.title}</p>
                <p className="text-xs text-now-green/40">{s.duration}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-now-green/5 border border-now-green/10 rounded-lg p-4">
          <p className="text-now-green text-sm font-mono font-bold mb-2">O QUE RECEBES</p>
          <ul className="space-y-1 text-sm text-now-ivory/70">
            <li>1. Diagnóstico de Zona (Gay Hendricks)</li>
            <li>2. Mapa de Talentos (CliftonStrengths)</li>
            <li>3. Habilidade Única (Dan Sullivan)</li>
            <li>4. Perfil de Riqueza (Roger Hamilton)</li>
            <li>5. Plano de Monetização (Alex Hormozi)</li>
            <li>6. Estilo de Execução (Kathy Kolbe)</li>
            <li>7. Posicionamento Pessoal (Sally Hogshead)</li>
          </ul>
        </div>

        <button
          onClick={() => setZgStep('name')}
          className="w-full py-4 bg-now-green text-now-obsidian font-mono font-bold text-lg rounded-lg hover:bg-now-green/90 transition-all"
        >
          COMEÇAR ASSESSMENT
        </button>

        <p className="text-center text-xs text-now-green/30 font-mono">~15-20 minutos · Resultado imediato · 100% personalizado</p>
      </div>
    )
  }

  // --- NAME ---
  if (zgStep === 'name') {
    const valid = zgName.trim().length > 1
    return (
      <div className="space-y-6 max-w-md">
        <h3 className="text-now-green font-mono font-bold text-sm">COMO TE CHAMAS?</h3>
        <p className="text-now-ivory/60 text-sm">Precisamos do teu nome para personalizar o Blueprint.</p>
        <form onSubmit={(e) => { e.preventDefault(); if (valid) transition(() => setZgStep('quiz')) }} className="space-y-4">
          <input
            type="text"
            value={zgName}
            onChange={(e) => setZgName(e.target.value)}
            placeholder="O teu nome"
            className="w-full rounded-md border border-now-green/20 bg-now-obsidian px-4 py-3 text-now-ivory placeholder-now-green/20 outline-none focus:border-now-green font-mono"
            autoFocus
          />
          <button
            type="submit"
            disabled={!valid}
            className="w-full rounded-md bg-now-green py-3.5 text-sm font-bold text-black transition hover:bg-now-green/90 disabled:opacity-30 font-mono"
          >
            CONTINUAR
          </button>
        </form>
      </div>
    )
  }

  // --- QUIZ ---
  if (zgStep === 'quiz') {
    const question = allQuestions[qi]
    const answer = answers[question.id]
    const progress = (qi / totalQuestions) * 100
    const { section, sectionIndex } = getSectionForQuestion(qi)
    const multiSelected = Array.isArray(answer) ? answer : []
    const openValue = typeof answer === 'string' ? answer : ''

    return (
      <div className={`transition-opacity duration-200 ${fade ? 'opacity-100' : 'opacity-0'}`}>
        {/* Progresso */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <button onClick={goBack} className="text-sm text-now-green/40 hover:text-now-green font-mono">&larr; voltar</button>
            <div className="text-right">
              <p className="text-xs font-medium text-now-green font-mono">{section.title}</p>
              <span className="font-mono text-xs text-now-green/40">{qi + 1}/{totalQuestions}</span>
            </div>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-now-green/10">
            <div className="h-full rounded-full bg-now-green transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-2 flex gap-1">
            {assessmentSections.map((s, i) => (
              <div key={s.id} className={`h-1 flex-1 rounded-full ${i < sectionIndex ? 'bg-now-green' : i === sectionIndex ? 'bg-now-green/50' : 'bg-now-green/10'}`} />
            ))}
          </div>
        </div>

        {/* Pergunta */}
        <h3 className="mb-2 text-lg font-bold text-now-ivory">{question.question}</h3>
        {question.subtitle && <p className="mb-6 text-sm text-now-ivory/40">{question.subtitle}</p>}

        {/* Single choice */}
        {question.type === 'single' && question.options && (
          <div className="space-y-2">
            {question.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSingleAnswer(option.value)}
                className={`w-full rounded-lg border px-4 py-3 text-left text-sm font-mono transition ${
                  answer === option.value
                    ? 'border-now-green bg-now-green/10 text-now-green'
                    : 'border-now-green/10 bg-now-terminal text-now-ivory/70 hover:border-now-green/30'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        {/* Multi choice */}
        {question.type === 'multi' && question.options && (
          <div className="space-y-2">
            {question.options.map((option) => {
              const selected = multiSelected.includes(option.value)
              return (
                <button
                  key={option.value}
                  onClick={() => handleMultiToggle(option.value)}
                  className={`w-full rounded-lg border px-4 py-3 text-left text-sm font-mono transition ${
                    selected
                      ? 'border-now-green bg-now-green/10 text-now-green'
                      : 'border-now-green/10 bg-now-terminal text-now-ivory/70 hover:border-now-green/30'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${selected ? 'border-now-green bg-now-green text-black' : 'border-now-green/20'}`}>
                      {selected && <span className="text-[10px] font-bold">✓</span>}
                    </span>
                    {option.label}
                  </span>
                </button>
              )
            })}
            <button
              onClick={handleMultiConfirm}
              disabled={multiSelected.length === 0}
              className="mt-3 w-full rounded-md bg-now-green py-3 text-sm font-bold text-black font-mono disabled:opacity-30"
            >
              CONFIRMAR ({multiSelected.length} selecionadas)
            </button>
          </div>
        )}

        {/* Open-ended */}
        {question.type === 'open' && (
          <div className="space-y-3">
            {question.hint && (
              <p className="rounded-lg border border-now-green/10 bg-now-terminal p-3 text-xs text-now-ivory/30 font-mono">{question.hint}</p>
            )}
            <textarea
              value={openValue}
              onChange={(e) => handleOpenAnswer(e.target.value)}
              placeholder="Escreve a tua resposta aqui..."
              maxLength={question.maxLength || 500}
              rows={4}
              className="w-full resize-none rounded-lg border border-now-green/20 bg-now-obsidian px-4 py-3 text-sm text-now-ivory placeholder-now-green/20 outline-none focus:border-now-green font-mono"
              autoFocus
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-now-green/30 font-mono">{openValue.length}/{question.maxLength || 500}</span>
              <button
                onClick={handleOpenConfirm}
                disabled={openValue.trim().length < 3}
                className="rounded-md bg-now-green px-6 py-2.5 text-sm font-bold text-black font-mono disabled:opacity-30"
              >
                CONTINUAR
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // --- PROCESSING ---
  if (zgStep === 'processing') {
    return <ZGProcessingView />
  }

  // --- ERROR ---
  if (zgStep === 'error') {
    return (
      <div className="py-12 text-center space-y-4">
        <p className="text-now-ivory font-mono">Houve um erro ao gerar o Blueprint.</p>
        <button
          onClick={() => finishAssessment(answers)}
          className="rounded-md bg-now-green px-8 py-3 text-sm font-bold text-black font-mono"
        >
          TENTAR NOVAMENTE
        </button>
      </div>
    )
  }

  // --- RESULT (Blueprint) ---
  if (zgStep === 'result' && blueprint) {
    return (
      <div className="space-y-6">
        <div className="bg-now-green/5 border border-now-green/20 rounded-lg p-4 text-center">
          <p className="text-now-green font-mono font-bold text-sm">BLUEPRINT GERADO</p>
          <h3 className="text-now-ivory text-xl font-bold mt-1">{zgName}</h3>
          <p className="text-now-green/40 text-xs font-mono mt-1">
            Gerado em {new Date().toLocaleDateString('pt-PT')}
          </p>
        </div>

        {/* Blueprint Markdown */}
        <div className="blueprint-md" dangerouslySetInnerHTML={{ __html: simpleMarkdown(blueprint) }} />

        {/* Divisor */}
        <div className="my-10 border-t border-now-green/10" />

        {/* CTA — Agora OX */}
        <div className="rounded-xl border-2 border-now-green/30 bg-now-terminal p-8 text-center space-y-4">
          <p className="text-now-green font-mono text-sm tracking-wider">E AGORA?</p>
          <h3 className="text-now-ivory text-2xl font-bold">
            Tens o plano.<br />Agora precisas da equipa.
          </h3>
          <p className="text-now-ivory/60 text-sm max-w-md mx-auto">
            Sabes quem és. Sabes o que construir. Mas construir sozinho é o caminho mais lento.
            O Agora OX é o teu squad de agentes AI — arquiteto, developer, QA, product owner —
            todos alinhados com o TEU perfil de genialidade.
          </p>
          <a
            href="https://buy.stripe.com/PLACEHOLDER_AGORA_OX"
            className="inline-block mt-4 rounded-lg bg-now-green px-10 py-4 text-lg font-bold text-black font-mono transition hover:shadow-[0_0_30px_rgba(191,214,75,0.4)]"
          >
            AGORA OX — €99
          </a>
          <p className="text-now-green/30 text-xs font-mono">
            Squad completo de agentes AI · Construído para o teu perfil
          </p>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={() => window.print()}
            className="flex-1 py-3 border border-now-green/30 text-now-green font-mono text-sm rounded-lg hover:bg-now-green/10 transition"
          >
            GUARDAR / IMPRIMIR
          </button>
          <button
            onClick={onComplete}
            className="flex-1 py-3 bg-now-green/20 text-now-green font-mono font-bold text-sm rounded-lg hover:bg-now-green/30 transition"
          >
            PRÓXIMO MÓDULO →
          </button>
        </div>
      </div>
    )
  }

  return null
}

// Processamento animado
function ZGProcessingView() {
  const steps = [
    'A analisar as tuas respostas...',
    'Gay Hendricks — Zona de Genialidade...',
    'Don Clifton — Mapa de Talentos...',
    'Dan Sullivan — Habilidade Única...',
    'Roger Hamilton — Perfil de Riqueza...',
    'Alex Hormozi — Plano de Monetização...',
    'Kathy Kolbe — Estilo de Execução...',
    'Sally Hogshead — Posicionamento...',
    'A cruzar os 7 frameworks...',
    'A gerar o teu Blueprint...',
  ]
  const [stepIdx, setStepIdx] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const si = setInterval(() => setStepIdx((p) => p < steps.length - 1 ? p + 1 : p), 1500)
    const pi = setInterval(() => setProgress((p) => p < 95 ? p + 1 : p), 150)
    return () => { clearInterval(si); clearInterval(pi) }
  }, [steps.length])

  return (
    <div className="py-12 text-center space-y-6">
      <div className="h-10 w-10 mx-auto animate-spin rounded-full border-2 border-now-green/20 border-t-now-green" />
      <h3 className="text-now-green font-mono font-bold">A GERAR O TEU BLUEPRINT</h3>
      <div className="h-32 overflow-hidden font-mono text-sm">
        {steps.slice(0, stepIdx + 1).map((s, i) => (
          <p key={i} className={`transition-opacity duration-500 ${i === stepIdx ? 'text-now-green' : 'text-now-green/20'}`}>
            &gt; {s}
          </p>
        ))}
      </div>
      <div className="w-48 mx-auto">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-now-green/10">
          <div className="h-full rounded-full bg-now-green transition-all duration-200" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-2 font-mono text-xs text-now-green/40">{progress}%</p>
      </div>
    </div>
  )
}

// Markdown simples para o Blueprint
function simpleMarkdown(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3 class="mt-8 mb-3 text-base font-bold text-now-green font-mono border-b border-now-green/10 pb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="mt-10 mb-3 text-lg font-bold text-now-ivory font-mono">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="mt-10 mb-4 text-xl font-bold text-now-green font-mono">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-now-ivory font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-now-green/70">$1</em>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 mb-1 text-sm leading-relaxed text-now-ivory/70 list-disc list-inside font-mono">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 mb-1 text-sm leading-relaxed text-now-ivory/70 list-decimal list-inside font-mono">$2</li>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-2 border-now-green pl-4 my-3 text-now-ivory/60 italic text-sm font-mono">$1</blockquote>')
    .replace(/^---$/gm, '<hr class="my-6 border-now-green/10" />')
    .replace(/^(?!<[hlubo]|<li|<hr)(.+)$/gm, '<p class="mb-2 text-sm leading-relaxed text-now-ivory/70 font-mono">$1</p>')
    .replace(/<p class="[^"]*"><\/p>/g, '')
}

// --- Conteúdo do Módulo 1 ---
function Module1Content({ onComplete, onStepChange }: { onComplete: () => void; onStepChange: (step: number) => void }) {
  const [checks, setChecks] = useState([false, false, false, false]);
  const [activeOS, setActiveOS] = useState("mac");
  const [currentStep, setCurrentStep] = useState(0);

  const toggleCheck = (index: number) => {
    const updated = [...checks];
    updated[index] = !updated[index];
    setChecks(updated);
    const completedCount = updated.filter(Boolean).length;
    const newStep = Math.min(completedCount + 1, 4);
    setCurrentStep(newStep);
    onStepChange(newStep);
  };

  useEffect(() => {
    onStepChange(0);
  }, []);

  const allChecked = checks.every(Boolean);

  return (
    <div className="space-y-6">
      {/* Contexto */}
      <div className="border-l-2 border-now-green pl-4">
        <p className="text-now-green/60 text-xs font-mono uppercase tracking-wider mb-1">📡 Contexto — 30 segundos</p>
        <p className="text-now-ivory text-base">
          1 comando. Zero dependências. Funciona em Mac, Windows e Linux. Sem Node.js. Sem downloads manuais. A máquina liga-se em 5 minutos.
        </p>
      </div>

      {/* Pré-requisito */}
      <div className="bg-now-green/5 border border-now-green/10 rounded-lg p-4">
        <p className="text-now-green text-sm font-mono font-bold mb-2">⚡ Antes de começar</p>
        <p className="text-now-ivory/80 text-sm mb-2">
          Precisas de uma conta Claude Pro, Max ou Teams. Vai a{" "}
          <span className="text-now-green">claude.ai</span> e cria a tua conta.
        </p>
        <div className="flex gap-4 mt-3 text-xs text-now-green/40 font-mono">
          <span> macOS 13.0+</span>
          <span>⊞ Windows 10+</span>
          <span>🐧 Ubuntu 20.04+</span>
        </div>
      </div>

      {/* Passo 1 — Instalar */}
      <div>
        <h3 className="text-now-green font-mono font-bold text-sm mb-2">PASSO 1 — Instalar</h3>
        <p className="text-now-ivory/70 text-sm mb-3">
          Abre o teu terminal e cola o comando para o teu sistema:
        </p>
        <OSTabs activeOS={activeOS} setActiveOS={setActiveOS} />
        {activeOS === "mac" ? (
          <TerminalBlock
            command="curl -fsSL https://claude.ai/install.sh | bash"
            description="Instalador nativo — Mac / Linux / WSL"
          />
        ) : (
          <TerminalBlock
            command="curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd"
            description="Instalador nativo — Windows"
          />
        )}
        <div className="mt-3 bg-now-obsidian border border-now-green/10 rounded-lg p-3">
          <p className="text-now-green/40 text-xs font-mono mb-2">Alternativas:</p>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono text-now-green/30">
            <span> Homebrew: brew install --cask claude-code</span>
            <span>⊞ WinGet: winget install Anthropic.ClaudeCode</span>
          </div>
        </div>
      </div>

      {/* Passo 2 — Verificar */}
      <div>
        <h3 className="text-now-green font-mono font-bold text-sm mb-2">PASSO 2 — Verificar</h3>
        <p className="text-now-ivory/70 text-sm mb-3">
          Confirma que ficou instalado:
        </p>
        <TerminalBlock
          command="claude doctor"
          description="Verifica instalação, versão e problemas"
        />
        <p className="text-now-ivory/50 text-xs mt-2">
          Se vês a versão e zero problemas, está perfeito. Se há erros, o doctor diz-te exactamente o que corrigir.
        </p>
      </div>

      {/* Passo 3 — Abrir */}
      <div>
        <h3 className="text-now-green font-mono font-bold text-sm mb-2">PASSO 3 — Abrir pela primeira vez</h3>
        <p className="text-now-ivory/70 text-sm mb-3">
          Abre o Claude Code. Ele vai abrir o browser para fazeres login com a tua conta:
        </p>
        <TerminalBlock
          command="claude"
          description="Abre o Claude Code — a máquina liga-se"
        />
        <p className="text-now-ivory/70 text-sm mt-3">
          Faz login com a tua conta Claude Pro, Max ou Teams. Volta ao terminal.
        </p>
      </div>

      {/* Passo 4 — Criar projecto */}
      <div>
        <h3 className="text-now-green font-mono font-bold text-sm mb-2">PASSO 4 — O teu projecto</h3>
        <p className="text-now-ivory/70 text-sm mb-3">
          Cria a pasta do teu projecto e abre o Claude Code dentro dela:
        </p>
        <TerminalBlock
          command="mkdir o-meu-projecto && cd o-meu-projecto"
          description="Cria e entra na pasta do projecto"
        />
        <TerminalBlock
          command="claude"
          description="Abre o Claude Code dentro do projecto"
        />
        <p className="text-now-ivory/70 text-sm mt-3">
          Vês o cursor a piscar? <span className="text-now-green font-bold">Estás dentro.</span> A máquina está ligada. Tu és o piloto.
        </p>
      </div>

      {/* Dica */}
      <div className="bg-now-green/5 border border-now-green/10 rounded-lg p-4">
        <p className="text-now-green text-xs font-mono">
          💡 <strong>Dica:</strong> O instalador nativo actualiza automaticamente em background. Nunca mais precisas de te preocupar com versões. Para forçar update manual: <code className="bg-now-obsidian px-1 rounded">claude update</code>
        </p>
      </div>

      {/* Checkpoint */}
      <div className="border border-now-green/20 rounded-lg p-4 bg-now-terminal">
        <p className="text-now-green font-mono font-bold text-sm mb-3">✅ CHECKPOINT</p>
        <div className="space-y-1">
          <Checkpoint
            text="Claude Code instalado (claude doctor sem erros)"
            checked={checks[0]}
            onToggle={() => toggleCheck(0)}
          />
          <Checkpoint
            text="Login feito com conta Claude Pro/Max/Teams"
            checked={checks[1]}
            onToggle={() => toggleCheck(1)}
          />
          <Checkpoint
            text="Pasta do projecto criada"
            checked={checks[2]}
            onToggle={() => toggleCheck(2)}
          />
          <Checkpoint
            text="Claude Code aberto (cursor a piscar)"
            checked={checks[3]}
            onToggle={() => toggleCheck(3)}
          />
        </div>
      </div>

      {/* Output */}
      <div className="bg-now-green/5 border border-now-green/20 rounded-lg p-4">
        <p className="text-now-green font-mono font-bold text-sm mb-2">🔥 O TEU OUTPUT</p>
        <p className="text-now-ivory text-sm">
          Claude Code instalado e a funcionar. Zero dependências. 1 comando. Um profissional cobraria <span className="text-now-green font-bold">$50</span> para te fazer este setup. Tu fizeste em 5 minutos.
        </p>
        <p className="text-now-ivory/40 text-xs mt-2 italic">
          &quot;Quem não arrisca, não petisca.&quot; — E tu acabaste de arriscar. O primeiro passo está dado.
        </p>
      </div>

      {/* Botão Avançar */}
      {allChecked && (
        <button
          onClick={onComplete}
          className="w-full py-4 bg-now-green text-now-obsidian font-mono font-bold text-lg rounded-lg hover:bg-now-green/90 transition-all animate-pulse"
        >
          Próximo Módulo →
        </button>
      )}

      {!allChecked && (
        <div className="text-center py-4">
          <p className="text-now-green/30 text-xs font-mono">
            Completa o checkpoint para desbloquear o próximo módulo
          </p>
        </div>
      )}
    </div>
  );
}

// --- Componente: Card de Prompt (M2) ---
function PromptCard({ title, description, prompt, icon }: { title: string; description: string; prompt: string; icon: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => { navigator.clipboard.writeText(prompt); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="rounded-lg border border-now-green/20 bg-now-terminal p-5 space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div><h4 className="text-now-green font-mono font-bold text-sm">{title}</h4><p className="text-now-ivory/50 text-xs">{description}</p></div>
      </div>
      <div className="bg-now-obsidian rounded-lg p-3 text-now-ivory/70 text-xs font-mono leading-relaxed whitespace-pre-wrap">{prompt}</div>
      <button onClick={handleCopy} className={`w-full py-2.5 rounded-md font-mono text-sm font-bold transition ${copied ? 'bg-now-green/20 text-now-green' : 'bg-now-green text-black hover:bg-now-green/90'}`}>
        {copied ? '✓ Copiado!' : 'Copiar prompt'}
      </button>
    </div>
  );
}

// --- M2 — 5 coisas em 10 minutos ---
function Module2Content({ onComplete }: { onComplete: () => void }) {
  const [done, setDone] = useState<boolean[]>([false, false, false, false, false]);
  const toggle = (i: number) => { const u = [...done]; u[i] = !u[i]; setDone(u); };
  const allDone = done.every(Boolean);
  const prompts = [
    { icon: '🌐', title: 'Landing Page', description: 'Uma página profissional em segundos', prompt: 'Cria uma landing page moderna para o meu projecto. Nome: [o teu projecto]. É um [descreve em 1 frase]. Usa design escuro com acentos verdes. Inclui: hero section com headline forte, 3 benefícios, secção de preço, e um botão de CTA. Tudo num só ficheiro HTML com CSS inline.' },
    { icon: '📊', title: 'Análise de Mercado', description: 'Percebe o terreno antes de construir', prompt: 'Analisa o mercado para: [descreve o teu produto/serviço]. Quero saber: 1) Quem é o público-alvo (perfil demográfico e psicográfico), 2) Quem são os 5 principais concorrentes e o que fazem bem/mal, 3) Qual o tamanho estimado do mercado, 4) Qual a oportunidade que ainda não está a ser explorada. Formato: relatório executivo com bullets.' },
    { icon: '💳', title: 'Cartão Digital', description: 'O teu cartão de visita do futuro', prompt: 'Cria um cartão de visita digital em HTML. Nome: [o teu nome]. Título: [o que fazes]. Inclui: foto placeholder, links para LinkedIn, email e WhatsApp, uma frase de posicionamento, e um botão "Guardar Contacto". Design minimalista escuro. Deve funcionar como página web standalone.' },
    { icon: '❓', title: 'Quiz Interactivo', description: 'Captura leads com inteligência', prompt: 'Cria um quiz interactivo em HTML + JavaScript. Tema: "[o teu nicho] — Qual é o teu nível?". 5 perguntas de escolha múltipla. No final mostra o resultado (Iniciante/Intermédio/Avançado) com uma descrição personalizada e um campo para capturar o email. Design atrativo com transições suaves.' },
    { icon: '📈', title: 'Dashboard', description: 'Visualiza dados como um pro', prompt: 'Cria um dashboard HTML com dados fictícios para um negócio de [o teu nicho]. Inclui: 4 cards de métricas no topo (receita, clientes, conversão, crescimento), 1 gráfico de barras de receita mensal (usa CSS puro, sem bibliotecas), e uma tabela com os últimos 5 clientes. Design escuro profissional.' },
  ];
  return (
    <div className="space-y-6">
      <div className="border-l-2 border-now-green pl-4">
        <p className="text-now-green/60 text-xs font-mono uppercase tracking-wider mb-1">O MOMENTO &quot;EH LÁ&quot;</p>
        <p className="text-now-ivory text-base">5 coisas que normalmente levam horas ou dias — tu vais fazê-las em 10 minutos. Copia o prompt, cola no Claude Code, e vê a magia acontecer.</p>
      </div>
      <div className="bg-now-green/5 border border-now-green/10 rounded-lg p-4">
        <p className="text-now-green text-sm font-mono font-bold mb-1">COMO FUNCIONA</p>
        <p className="text-now-ivory/70 text-sm">1. Clica em <strong className="text-now-green">Copiar prompt</strong> · 2. Cola no Claude Code · 3. Carrega Enter · 4. Marca como feito</p>
      </div>
      <div className="space-y-4">
        {prompts.map((p, i) => (
          <div key={i}><PromptCard {...p} /><div className="mt-2"><Checkpoint text={`${p.title} — feito`} checked={done[i]} onToggle={() => toggle(i)} /></div></div>
        ))}
      </div>
      <div className="bg-now-green/5 border border-now-green/20 rounded-lg p-4">
        <p className="text-now-green font-mono font-bold text-sm mb-2">🔥 O TEU OUTPUT</p>
        <p className="text-now-ivory text-sm">5 projectos reais, criados em minutos. Um freelancer cobraria <span className="text-now-green font-bold">€500+</span> por isto. Tu fizeste enquanto bebes o café.</p>
      </div>
      {allDone && <button onClick={onComplete} className="w-full py-4 bg-now-green text-now-obsidian font-mono font-bold text-lg rounded-lg hover:bg-now-green/90 transition-all animate-pulse">Próximo Módulo →</button>}
      {!allDone && <p className="text-center text-now-green/30 text-xs font-mono py-4">Completa os 5 para desbloquear o próximo módulo</p>}
    </div>
  );
}

// --- M3 — O Terreno ---
function Module3Content({ onComplete }: { onComplete: () => void }) {
  const [checks, setChecks] = useState([false, false, false, false]);
  const toggle = (i: number) => { const u = [...checks]; u[i] = !u[i]; setChecks(u); };
  const allDone = checks.every(Boolean);
  return (
    <div className="space-y-6">
      <div className="border-l-2 border-now-green pl-4">
        <p className="text-now-green/60 text-xs font-mono uppercase tracking-wider mb-1">O CICLO DE VIDA DE UMA PASTA</p>
        <p className="text-now-ivory text-base">4 comandos. Nascimento, vida, exploração e morte. Quando dominares estes, o terminal deixa de ser um ecrã preto assustador e passa a ser a tua ferramenta mais poderosa.</p>
      </div>
      <div><h3 className="text-now-green font-mono font-bold text-sm mb-2">1. NASCIMENTO — mkdir</h3><p className="text-now-ivory/70 text-sm mb-3">Criar uma pasta é dar vida a um projecto. Cada pasta é um universo.</p><TerminalBlock command="mkdir o-meu-projecto" description="Cria uma nova pasta — o nascimento" /><p className="text-now-ivory/40 text-xs mt-2 font-mono">mkdir = &quot;make directory&quot; = criar directório.</p></div>
      <div><h3 className="text-now-green font-mono font-bold text-sm mb-2">2. VIDA — cd</h3><p className="text-now-ivory/70 text-sm mb-3">Entrar numa pasta é como abrir uma porta. Sair é subir um andar.</p><TerminalBlock command="cd o-meu-projecto" description="Entra na pasta — estás dentro" /><TerminalBlock command="cd .." description="Sobe um nível — volta para trás" /><p className="text-now-ivory/40 text-xs mt-2 font-mono">cd = &quot;change directory&quot;. Os dois pontos (..) significam &quot;a pasta acima&quot;.</p></div>
      <div><h3 className="text-now-green font-mono font-bold text-sm mb-2">3. EXPLORAÇÃO — ls</h3><p className="text-now-ivory/70 text-sm mb-3">Ver o que está dentro. Olhar à volta. Saber onde estás.</p><TerminalBlock command="ls" description="Lista tudo o que está na pasta actual" /><TerminalBlock command="ls -la" description="Lista TUDO — incluindo ficheiros escondidos" /><p className="text-now-ivory/40 text-xs mt-2 font-mono">ls = &quot;list&quot;. A flag -la mostra ficheiros ocultos e detalhes.</p></div>
      <div><h3 className="text-now-green font-mono font-bold text-sm mb-2">4. MORTE — rm</h3><p className="text-now-ivory/70 text-sm mb-3">Apagar. Sem caixote do lixo. Poder absoluto requer responsabilidade absoluta.</p><TerminalBlock command="rm ficheiro.txt" description="Apaga um ficheiro — sem volta" /><TerminalBlock command="rm -r pasta-teste" description="Apaga uma pasta e tudo dentro dela" /><div className="mt-2 bg-red-500/5 border border-red-500/20 rounded-lg p-3"><p className="text-red-400 text-xs font-mono">⚠️ Cuidado: rm não tem &quot;undo&quot;. Verifica sempre o que estás a apagar.</p></div></div>
      <div className="bg-now-green/5 border border-now-green/10 rounded-lg p-4"><p className="text-now-green text-sm font-mono font-bold mb-2">EXERCÍCIO PRÁTICO</p><p className="text-now-ivory/70 text-sm mb-3">Executa estes comandos pela ordem. O ciclo completo.</p><TerminalBlock command="mkdir teste-agora && cd teste-agora && ls" description="1. Nasce + entra + explora" /><TerminalBlock command="mkdir sub-pasta && ls" description="2. Cria algo dentro + verifica" /><TerminalBlock command="cd .. && rm -r teste-agora && ls" description="3. Sai + destrói + confirma" /></div>
      <div className="border border-now-green/20 rounded-lg p-4 bg-now-terminal"><p className="text-now-green font-mono font-bold text-sm mb-3">✅ CHECKPOINT</p><div className="space-y-1"><Checkpoint text="Criei uma pasta com mkdir" checked={checks[0]} onToggle={() => toggle(0)} /><Checkpoint text="Entrei e saí com cd e cd .." checked={checks[1]} onToggle={() => toggle(1)} /><Checkpoint text="Listei conteúdo com ls" checked={checks[2]} onToggle={() => toggle(2)} /><Checkpoint text="Apaguei a pasta de teste com rm -r" checked={checks[3]} onToggle={() => toggle(3)} /></div></div>
      {allDone && <button onClick={onComplete} className="w-full py-4 bg-now-green text-now-obsidian font-mono font-bold text-lg rounded-lg hover:bg-now-green/90 transition-all animate-pulse">Próximo Módulo →</button>}
      {!allDone && <p className="text-center text-now-green/30 text-xs font-mono py-4">Completa o checkpoint para desbloquear o próximo módulo</p>}
    </div>
  );
}

// --- M4 — A Cabine do Piloto ---
function Module4Content({ onComplete }: { onComplete: () => void }) {
  const [checks, setChecks] = useState([false, false, false]);
  const toggle = (i: number) => { const u = [...checks]; u[i] = !u[i]; setChecks(u); };
  const allDone = checks.every(Boolean);
  return (
    <div className="space-y-6">
      <div className="border-l-2 border-now-green pl-4"><p className="text-now-green/60 text-xs font-mono uppercase tracking-wider mb-1">TU ÉS O PILOTO</p><p className="text-now-ivory text-base">O Claude Code tem 3 zonas. Quando as dominares, o terminal transforma-se na tua cabine de comando.</p></div>
      <div className="rounded-lg border-2 border-now-green/30 bg-now-terminal p-5 space-y-3"><div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-now-green text-black font-mono font-bold text-sm">1</span><h3 className="text-now-green font-mono font-bold">ZONA DE PROMPT</h3></div><p className="text-now-ivory/70 text-sm">É aqui que tu falas. O cursor a piscar no fundo do ecrã. Escreves o que queres e carregas Enter.</p><div className="bg-now-obsidian rounded-lg p-3 font-mono text-sm"><span className="text-now-green/40">❯ </span><span className="text-now-ivory">cria uma landing page para o meu projecto<span className="animate-pulse text-now-green">|</span></span></div><p className="text-now-ivory/40 text-xs font-mono">Tu dás a ordem. A máquina executa.</p></div>
      <div className="rounded-lg border-2 border-now-green/30 bg-now-terminal p-5 space-y-3"><div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-now-green text-black font-mono font-bold text-sm">2</span><h3 className="text-now-green font-mono font-bold">ZONA DE RESPOSTA</h3></div><p className="text-now-ivory/70 text-sm">O centro do ecrã. Onde o Claude mostra o que está a fazer em tempo real.</p><div className="bg-now-obsidian rounded-lg p-3 font-mono text-xs space-y-1"><p className="text-now-green/60">A criar src/index.html...</p><p className="text-now-green/60">A adicionar estilos CSS...</p><p className="text-now-green">✓ Landing page criada com sucesso</p></div><p className="text-now-ivory/40 text-xs font-mono">Lê sempre o que ele diz. É aqui que aprendes.</p></div>
      <div className="rounded-lg border-2 border-now-green/30 bg-now-terminal p-5 space-y-3"><div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-now-green text-black font-mono font-bold text-sm">3</span><h3 className="text-now-green font-mono font-bold">ZONA DE PERMISSÕES</h3></div><p className="text-now-ivory/70 text-sm">Quando o Claude quer fazer algo sensível, pede-te autorização. Tu decides. Sempre.</p><div className="bg-now-obsidian rounded-lg p-3 font-mono text-xs space-y-1"><p className="text-yellow-400/80">Posso criar o ficheiro src/index.html?</p><p className="text-now-ivory/50">[Y] Sim · [N] Não · [A] Sim para todos</p></div><p className="text-now-ivory/40 text-xs font-mono">Nada acontece sem a tua permissão. Controlo total.</p></div>
      <div className="bg-now-green/5 border border-now-green/10 rounded-lg p-4"><p className="text-now-green text-xs font-mono">💡 <strong>Resumo:</strong> Tu escreves (Zona 1) → Claude executa (Zona 2) → Tu autorizas (Zona 3). Como pilotar um avião: tu dás as ordens, o co-piloto executa, e tu confirmas cada manobra.</p></div>
      <div className="border border-now-green/20 rounded-lg p-4 bg-now-terminal"><p className="text-now-green font-mono font-bold text-sm mb-3">✅ CHECKPOINT</p><div className="space-y-1"><Checkpoint text="Sei onde escrevo os meus prompts (Zona 1)" checked={checks[0]} onToggle={() => toggle(0)} /><Checkpoint text="Sei ler as respostas do Claude (Zona 2)" checked={checks[1]} onToggle={() => toggle(1)} /><Checkpoint text="Sei aceitar/recusar permissões (Zona 3)" checked={checks[2]} onToggle={() => toggle(2)} /></div></div>
      {allDone && <button onClick={onComplete} className="w-full py-4 bg-now-green text-now-obsidian font-mono font-bold text-lg rounded-lg hover:bg-now-green/90 transition-all animate-pulse">Próximo Módulo →</button>}
      {!allDone && <p className="text-center text-now-green/30 text-xs font-mono py-4">Completa o checkpoint para desbloquear o próximo módulo</p>}
    </div>
  );
}

// --- M5 — Comandos de Combate ---
function Module5Content({ onComplete }: { onComplete: () => void }) {
  const [checks, setChecks] = useState([false, false, false, false, false, false]);
  const toggle = (i: number) => { const u = [...checks]; u[i] = !u[i]; setChecks(u); };
  const allDone = checks.every(Boolean);
  const commands = [
    { cmd: '/help', title: 'O Manual', desc: 'Mostra todos os comandos disponíveis. Quando não souberes o que fazer, começa por aqui.' },
    { cmd: '/init', title: 'O Reconhecimento', desc: 'Analisa o projecto inteiro e cria um CLAUDE.md. Usa no início de cada projecto novo.' },
    { cmd: '/status', title: 'O Radar', desc: 'Mostra o estado actual: contexto, ferramentas activas. O painel de instrumentos do piloto.' },
    { cmd: '/clear', title: 'O Reset', desc: 'Limpa o ecrã e recomeça a conversa. Quando ficar confusa, faz reset. Mente fresca, respostas melhores.' },
    { cmd: '/exit', title: 'A Saída', desc: 'Fecha o Claude Code. Podes também usar Ctrl+C. O teu código está guardado nos ficheiros.' },
    { cmd: '!comando', title: 'O Atalho', desc: 'Corre comandos do terminal directamente. !ls, !git status — fica dentro da cabine.' },
  ];
  return (
    <div className="space-y-6">
      <div className="border-l-2 border-now-green pl-4"><p className="text-now-green/60 text-xs font-mono uppercase tracking-wider mb-1">O TEU ARSENAL</p><p className="text-now-ivory text-base">6 comandos que transformam o Claude Code de &quot;ferramenta que uso&quot; em &quot;extensão do meu cérebro&quot;.</p></div>
      <div className="space-y-4">{commands.map((c, i) => (<div key={i} className="rounded-lg border border-now-green/20 bg-now-terminal p-4"><div className="flex items-center gap-3 mb-2"><code className="bg-now-green text-black font-mono font-bold text-sm px-3 py-1 rounded">{c.cmd}</code><span className="text-now-green font-mono font-bold text-sm">{c.title}</span></div><p className="text-now-ivory/70 text-sm">{c.desc}</p><div className="mt-2"><Checkpoint text={`Testei ${c.cmd}`} checked={checks[i]} onToggle={() => toggle(i)} /></div></div>))}</div>
      <div className="bg-now-green/5 border border-now-green/10 rounded-lg p-4"><p className="text-now-green text-sm font-mono font-bold mb-2">EXERCÍCIO PRÁTICO</p><p className="text-now-ivory/70 text-sm">Abre o Claude Code e corre cada comando. Vê o que acontece. Não se parte nada.</p><TerminalBlock command="/help" description="Vê o mapa completo" /><TerminalBlock command="/status" description="Verifica o radar" /><TerminalBlock command="!ls" description="Corre um comando sem sair do Claude" /></div>
      {allDone && <button onClick={onComplete} className="w-full py-4 bg-now-green text-now-obsidian font-mono font-bold text-lg rounded-lg hover:bg-now-green/90 transition-all animate-pulse">Próximo Módulo →</button>}
      {!allDone && <p className="text-center text-now-green/30 text-xs font-mono py-4">Testa os 6 comandos para desbloquear o próximo módulo</p>}
    </div>
  );
}

// --- M6 — A Caixa Negra ---
function Module6Content({ onComplete }: { onComplete: () => void }) {
  const [checks, setChecks] = useState([false, false, false]);
  const toggle = (i: number) => { const u = [...checks]; u[i] = !u[i]; setChecks(u); };
  const allDone = checks.every(Boolean);
  return (
    <div className="space-y-6">
      <div className="border-l-2 border-now-green pl-4"><p className="text-now-green/60 text-xs font-mono uppercase tracking-wider mb-1">MEMÓRIA PERMANENTE</p><p className="text-now-ivory text-base">Cada vez que abres o Claude Code, ele esquece-se de tudo. A não ser que lhe deixes uma nota — o CLAUDE.md.</p></div>
      <div className="rounded-lg border-2 border-now-green/30 bg-now-terminal p-5 space-y-3"><h3 className="text-now-green font-mono font-bold">O QUE É O CLAUDE.md?</h3><p className="text-now-ivory/70 text-sm">Um ficheiro na raiz do projecto. O Claude lê-o SEMPRE que arranca. É a sua caixa negra — tudo o que precisa de saber sobre ti e o projecto.</p><div className="bg-now-obsidian rounded-lg p-3 font-mono text-xs space-y-1"><p className="text-now-green/60">📁 o-meu-projecto/</p><p className="text-now-green/60">├── src/</p><p className="text-now-green/60">├── package.json</p><p className="text-now-green font-bold">└── CLAUDE.md ← a caixa negra</p></div></div>
      <div><h3 className="text-now-green font-mono font-bold text-sm mb-2">PASSO 1 — Criar o CLAUDE.md</h3><p className="text-now-ivory/70 text-sm mb-3">No Claude Code, dentro do projecto:</p><TerminalBlock command="/init" description="O Claude analisa o projecto e cria o CLAUDE.md por ti" /><p className="text-now-ivory/50 text-xs mt-2">Ou manualmente:</p><TerminalBlock command="Cria um ficheiro CLAUDE.md com informação sobre mim e o meu projecto. O meu nome é [nome], estou a construir [projecto], e o meu nível técnico é iniciante." description="Prompt para CLAUDE.md personalizado" /></div>
      <div><h3 className="text-now-green font-mono font-bold text-sm mb-2">PASSO 2 — Testar a memória</h3><p className="text-now-ivory/70 text-sm mb-3">Fecha o Claude Code, abre-o de novo, e pergunta:</p><TerminalBlock command="Qual é o meu nome e o que estou a construir?" description="Se responder correctamente, a caixa negra funciona" /></div>
      <div className="bg-now-green/5 border border-now-green/10 rounded-lg p-4"><p className="text-now-green text-sm font-mono font-bold mb-2">O QUE METER NO CLAUDE.md</p><ul className="space-y-1 text-sm text-now-ivory/70"><li>• O teu nome e nível técnico</li><li>• O que é o projecto (1-2 frases)</li><li>• Tecnologias usadas</li><li>• Regras especiais (ex: &quot;responde sempre em português&quot;)</li><li>• O que já foi feito vs o que falta</li></ul></div>
      <div className="border border-now-green/20 rounded-lg p-4 bg-now-terminal"><p className="text-now-green font-mono font-bold text-sm mb-3">✅ CHECKPOINT</p><div className="space-y-1"><Checkpoint text="CLAUDE.md criado na raiz do projecto" checked={checks[0]} onToggle={() => toggle(0)} /><Checkpoint text="Fechei e abri o Claude Code" checked={checks[1]} onToggle={() => toggle(1)} /><Checkpoint text="O Claude lembrou-se de mim" checked={checks[2]} onToggle={() => toggle(2)} /></div></div>
      {allDone && <button onClick={onComplete} className="w-full py-4 bg-now-green text-now-obsidian font-mono font-bold text-lg rounded-lg hover:bg-now-green/90 transition-all animate-pulse">Próximo Módulo →</button>}
      {!allDone && <p className="text-center text-now-green/30 text-xs font-mono py-4">Completa o checkpoint para desbloquear o próximo módulo</p>}
    </div>
  );
}

// --- M7 — Activa o Squad ---
function Module7Content({ onComplete }: { onComplete: () => void }) {
  const [checks, setChecks] = useState([false, false, false]);
  const toggle = (i: number) => { const u = [...checks]; u[i] = !u[i]; setChecks(u); };
  const allDone = checks.every(Boolean);
  return (
    <div className="space-y-6">
      <div className="border-l-2 border-now-green pl-4"><p className="text-now-green/60 text-xs font-mono uppercase tracking-wider mb-1">O TEU SQUAD DE AI</p><p className="text-now-ivory text-base">Até agora usaste o Claude Code sozinho. Agora vais instalar o Agora OX — um squad de agentes especializados. Tu és o CEO — eles são a equipa.</p></div>
      <div className="rounded-lg border-2 border-now-green/30 bg-now-terminal p-5 space-y-3"><h3 className="text-now-green font-mono font-bold">O QUE É O AGORA OX?</h3><p className="text-now-ivory/70 text-sm">Agentes AI que trabalham dentro do Claude Code. O PM cria o plano do produto. O Analyst analisa o mercado. Tu dás as ordens.</p></div>
      <div><h3 className="text-now-green font-mono font-bold text-sm mb-2">PASSO 1 — Instalar os agentes</h3><p className="text-now-ivory/70 text-sm mb-3">No Claude Code, dentro do projecto:</p><TerminalBlock command="Instala os agentes PM e Analyst do Agora OX. Cria as pastas necessárias em .claude/commands/ com os ficheiros de configuração de cada agente." description="Instala os 2 agentes fundamentais" /></div>
      <div><h3 className="text-now-green font-mono font-bold text-sm mb-2">PASSO 2 — Verificar</h3><p className="text-now-ivory/70 text-sm mb-3">Confirma que estão operacionais:</p><TerminalBlock command="/pm" description="Activa o PM — deve responder-te" /><TerminalBlock command="/analyst" description="Activa o Analyst — deve responder-te" /></div>
      <div className="bg-now-green/5 border border-now-green/10 rounded-lg p-4"><p className="text-now-green text-xs font-mono">💡 Se os comandos não funcionarem, verifica que os ficheiros estão em .claude/commands/. O Claude Code detecta-os automaticamente.</p></div>
      <div className="border border-now-green/20 rounded-lg p-4 bg-now-terminal"><p className="text-now-green font-mono font-bold text-sm mb-3">✅ CHECKPOINT</p><div className="space-y-1"><Checkpoint text="Agentes instalados em .claude/commands/" checked={checks[0]} onToggle={() => toggle(0)} /><Checkpoint text="/pm activado e a responder" checked={checks[1]} onToggle={() => toggle(1)} /><Checkpoint text="/analyst activado e a responder" checked={checks[2]} onToggle={() => toggle(2)} /></div></div>
      {allDone && <button onClick={onComplete} className="w-full py-4 bg-now-green text-now-obsidian font-mono font-bold text-lg rounded-lg hover:bg-now-green/90 transition-all animate-pulse">Próximo Módulo →</button>}
      {!allDone && <p className="text-center text-now-green/30 text-xs font-mono py-4">Completa o checkpoint para desbloquear o próximo módulo</p>}
    </div>
  );
}

// --- M8 — Conhece a Equipa ---
function Module8Content({ onComplete }: { onComplete: () => void }) {
  const [checks, setChecks] = useState([false, false]);
  const toggle = (i: number) => { const u = [...checks]; u[i] = !u[i]; setChecks(u); };
  const allDone = checks.every(Boolean);
  return (
    <div className="space-y-6">
      <div className="border-l-2 border-now-green pl-4"><p className="text-now-green/60 text-xs font-mono uppercase tracking-wider mb-1">QUEM FAZ O QUÊ</p><p className="text-now-ivory text-base">Dois agentes operacionais. Cada um com uma missão clara. Conhece-os antes de lhes dar ordens.</p></div>
      <div className="rounded-lg border-2 border-now-green/30 bg-now-terminal p-5 space-y-3"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-now-green text-black font-mono font-bold text-lg">PM</span><div><h3 className="text-now-green font-mono font-bold">Product Manager</h3><p className="text-now-ivory/40 text-xs font-mono">O estratega do produto</p></div></div><p className="text-now-ivory/70 text-sm">Faz-te as perguntas certas para transformar a tua ideia vaga num plano concreto. Cria o PRD — o documento que diz exactamente O QUE vais construir.</p><div className="space-y-1 text-sm text-now-ivory/60"><p>• Faz perguntas sobre o problema que resolves</p><p>• Define o público-alvo com detalhe</p><p>• Lista funcionalidades por prioridade</p><p>• Cria o PRD completo e profissional</p></div><TerminalBlock command="/pm" description="Activa o PM" /></div>
      <div className="rounded-lg border-2 border-now-green/30 bg-now-terminal p-5 space-y-3"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-now-green text-black font-mono font-bold text-lg">AN</span><div><h3 className="text-now-green font-mono font-bold">Analyst</h3><p className="text-now-ivory/40 text-xs font-mono">O investigador do mercado</p></div></div><p className="text-now-ivory/70 text-sm">Os teus olhos no mercado. Analisa concorrentes, identifica oportunidades, e diz-te se a tua ideia tem pernas para andar.</p><div className="space-y-1 text-sm text-now-ivory/60"><p>• Pesquisa concorrentes e alternativas</p><p>• Identifica lacunas no mercado</p><p>• Valida se há procura real</p><p>• Sugere ângulos de diferenciação</p></div><TerminalBlock command="/analyst" description="Activa o Analyst" /></div>
      <div className="bg-now-green/5 border border-now-green/10 rounded-lg p-4"><p className="text-now-green text-xs font-mono">💡 Usa o Analyst ANTES do PM. Primeiro percebe o mercado, depois cria o plano. Informação antes de decisão.</p></div>
      <div className="border border-now-green/20 rounded-lg p-4 bg-now-terminal"><p className="text-now-green font-mono font-bold text-sm mb-3">✅ CHECKPOINT</p><div className="space-y-1"><Checkpoint text="Percebo o que o PM faz (cria o PRD)" checked={checks[0]} onToggle={() => toggle(0)} /><Checkpoint text="Percebo o que o Analyst faz (investiga o mercado)" checked={checks[1]} onToggle={() => toggle(1)} /></div></div>
      {allDone && <button onClick={onComplete} className="w-full py-4 bg-now-green text-now-obsidian font-mono font-bold text-lg rounded-lg hover:bg-now-green/90 transition-all animate-pulse">Próximo Módulo →</button>}
      {!allDone && <p className="text-center text-now-green/30 text-xs font-mono py-4">Completa o checkpoint para desbloquear o próximo módulo</p>}
    </div>
  );
}

// --- M9 — Mission Briefing ---
function Module9Content({ onComplete }: { onComplete: () => void }) {
  const [checks, setChecks] = useState([false, false, false]);
  const toggle = (i: number) => { const u = [...checks]; u[i] = !u[i]; setChecks(u); };
  const allDone = checks.every(Boolean);
  return (
    <div className="space-y-6">
      <div className="border-l-2 border-now-green pl-4"><p className="text-now-green/60 text-xs font-mono uppercase tracking-wider mb-1">A MISSÃO FINAL</p><p className="text-now-ivory text-base">Tudo converge aqui. Activa o PM, dá-lhe a missão, e sai com um PRD completo — o plano do teu produto.</p></div>
      <div className="bg-now-green/5 border border-now-green/10 rounded-lg p-4"><p className="text-now-green text-sm font-mono font-bold mb-2">ANTES DE COMEÇAR</p><p className="text-now-ivory/70 text-sm">Abre o teu Blueprint da Zona de Genialidade (Tab ZG). Lê a secção 9 — o teu mini-PRD. Essa é a base. Agora o PM vai transformá-la num documento profissional.</p></div>
      <div><h3 className="text-now-green font-mono font-bold text-sm mb-2">PASSO 1 — Activar o PM</h3><TerminalBlock command="/pm" description="Activa o Product Manager" /></div>
      <div><h3 className="text-now-green font-mono font-bold text-sm mb-2">PASSO 2 — Dar a missão</h3><p className="text-now-ivory/70 text-sm mb-3">Cola este prompt e adapta com os dados do teu Blueprint:</p><PromptCard icon="🎯" title="Mission Briefing" description="O prompt que activa a criação do PRD" prompt={`Quero criar um PRD para o meu produto. Aqui está o contexto:\n\n- O meu perfil: [cola o teu arquétipo do Blueprint, ex: "O Arquiteto · Criador"]\n- A minha oferta ideal: [cola o resumo da secção 6 do Blueprint]\n- O problema que resolvo: [descreve em 1-2 frases]\n- Para quem: [o teu público-alvo]\n\nFaz-me as perguntas que precisares para criar um PRD completo e profissional. Pergunta uma de cada vez.`} /></div>
      <div><h3 className="text-now-green font-mono font-bold text-sm mb-2">PASSO 3 — Responder e receber o PRD</h3><p className="text-now-ivory/70 text-sm">O PM vai fazer-te 5-10 perguntas. Responde com honestidade. Quando tiver informação suficiente, gera o PRD completo.</p></div>
      <div className="border border-now-green/20 rounded-lg p-4 bg-now-terminal"><p className="text-now-green font-mono font-bold text-sm mb-3">✅ CHECKPOINT</p><div className="space-y-1"><Checkpoint text="PM activado e a fazer perguntas" checked={checks[0]} onToggle={() => toggle(0)} /><Checkpoint text="Respondi a todas as perguntas do PM" checked={checks[1]} onToggle={() => toggle(1)} /><Checkpoint text="PRD completo gerado e guardado" checked={checks[2]} onToggle={() => toggle(2)} /></div></div>
      <div className="bg-now-green/5 border border-now-green/20 rounded-lg p-4"><p className="text-now-green font-mono font-bold text-sm mb-2">🔥 O TEU OUTPUT</p><p className="text-now-ivory text-sm">Um PRD completo. O documento que uma startup pagaria <span className="text-now-green font-bold">€2.000-5.000</span> a um consultor para criar. Tu fizeste em 45 minutos com o teu squad.</p></div>
      {allDone && (<div className="space-y-6"><button onClick={onComplete} className="w-full py-4 bg-now-green text-now-obsidian font-mono font-bold text-lg rounded-lg hover:bg-now-green/90 transition-all animate-pulse">Completar Blueprint ✓</button><div className="my-6 border-t border-now-green/10" /><div className="rounded-xl border-2 border-now-green/30 bg-now-terminal p-8 text-center space-y-4"><p className="text-now-green font-mono text-sm tracking-wider">E AGORA?</p><h3 className="text-now-ivory text-2xl font-bold">Tens o plano.<br />Agora precisas da equipa.</h3><p className="text-now-ivory/60 text-sm max-w-md mx-auto">Sabes quem és. Tens o PRD. Mas construir sozinho com 2 agentes é como jogar futebol a dois. O Agora OX é o squad completo — arquiteto, developer, QA, designer, devops — 10+ agentes que transformam o teu PRD num produto real.</p><a href="https://buy.stripe.com/PLACEHOLDER_AGORA_OX" className="inline-block mt-4 rounded-lg bg-now-green px-10 py-4 text-lg font-bold text-black font-mono transition hover:shadow-[0_0_30px_rgba(191,214,75,0.4)]">AGORA OX — €99</a><p className="text-now-green/30 text-xs font-mono">Squad completo de agentes AI · Do PRD ao produto</p></div></div>)}
      {!allDone && <p className="text-center text-now-green/30 text-xs font-mono py-4">Completa o checkpoint para terminar</p>}
    </div>
  );
}

// --- Conteúdo Placeholder ---
function ModulePlaceholder({ mod }: { mod: (typeof modules)[0] }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="text-now-green/30 text-6xl mb-4">🔒</p>
      <h3 className="text-now-green/50 font-mono text-lg mb-2">{mod.title}</h3>
      <p className="text-now-green/20 font-mono text-sm">{mod.subtitle}</p>
      <p className="text-now-green/10 font-mono text-xs mt-4">Completa o módulo anterior para desbloquear</p>
    </div>
  );
}

// --- Página Principal ---
export default function BlueprintPage() {
  const [activeModule, setActiveModule] = useState(0);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [chatStep, setChatStep] = useState(0);
  const [showChat, setShowChat] = useState(true);

  // Carregar progresso do localStorage
  useEffect(() => {
    const saved = localStorage.getItem("now_blueprint_progress");
    if (saved) {
      const parsed = JSON.parse(saved);
      setCompletedModules(parsed.completed || []);
      setActiveModule(parsed.active || 0);
    }
  }, []);

  // Guardar progresso
  useEffect(() => {
    localStorage.setItem(
      "now_blueprint_progress",
      JSON.stringify({ completed: completedModules, active: activeModule })
    );
  }, [completedModules, activeModule]);

  // Reset chat step quando muda de módulo
  useEffect(() => {
    setChatStep(0);
  }, [activeModule]);

  const completeModule = (index: number) => {
    if (!completedModules.includes(index)) {
      setCompletedModules([...completedModules, index]);
    }
    if (index < modules.length - 1) {
      setActiveModule(index + 1);
    }
  };

  const isModuleLocked = (index: number) => {
    if (index === 0) return false;
    return !completedModules.includes(index - 1);
  };

  const renderModuleContent = (index: number) => {
    const mod = modules[index];

    if (isModuleLocked(index)) {
      return <ModulePlaceholder mod={mod} />;
    }

    switch (index) {
      case 0:
        return <ZonaGenialidadeContent onComplete={() => completeModule(0)} />;
      case 1:
        return <Module1Content onComplete={() => completeModule(1)} onStepChange={setChatStep} />;
      default:
        return (
          <div className="py-12 text-center">
            <p className="text-now-green/40 font-mono text-sm mb-4">
              Módulo em construção
            </p>
            <button
              onClick={() => completeModule(index)}
              className="px-6 py-2 border border-now-green/30 text-now-green/50 font-mono text-sm rounded-lg hover:bg-now-green/10 transition-colors"
            >
              Marcar como completo (dev mode)
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-now-obsidian text-now-ivory">
      {/* Header */}
      <header className="border-b border-now-green/10 px-4 lg:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-now-green font-mono font-bold text-xl tracking-wider">
              MÉTODO<span className="text-now-green/40">_</span>AGORA
            </h1>
            <p className="text-now-green/30 font-mono text-xs mt-1">
              Pacote Completo — €9
            </p>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-now-green/40 font-mono text-xs hidden sm:block">
              {completedModules.length}/{modules.length} módulos
            </p>
            <button
              onClick={() => setShowChat(!showChat)}
              className={`
                px-3 py-1.5 text-xs font-mono rounded-lg transition-all border
                ${showChat
                  ? "bg-now-green/10 text-now-green border-now-green/30"
                  : "bg-now-obsidian text-now-green/30 border-now-green/10"
                }
              `}
            >
              💬 {showChat ? "Guia ON" : "Guia OFF"}
            </button>
          </div>
        </div>
      </header>

      {/* Barra de Progresso */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-6">
        <ProgressBar completed={completedModules.length} total={modules.length} />
      </div>

      {/* Abas dos Módulos */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex gap-1 overflow-x-auto pb-1 mb-6 scrollbar-hide">
          {modules.map((mod, index) => (
            <ModuleTab
              key={mod.id}
              mod={mod}
              isActive={activeModule === index}
              isCompleted={completedModules.includes(index)}
              isLocked={isModuleLocked(index)}
              onClick={() => {
                if (!isModuleLocked(index)) setActiveModule(index);
              }}
            />
          ))}
        </div>
      </div>

      {/* Layout Principal: Conteúdo + Chat */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 pb-8">
        <div className={`flex gap-6 ${showChat ? "" : ""}`}>

          {/* Coluna Esquerda — Conteúdo do Módulo */}
          <div className={`${showChat ? "flex-1 min-w-0" : "w-full max-w-4xl mx-auto"}`}>
            {/* Cabeçalho do Módulo */}
            <div className="mb-6 pb-4 border-b border-now-green/10">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-now-green/30 font-mono text-xs">
                  M{modules[activeModule].number}
                </span>
                <span className="text-now-green/20">·</span>
                <span className="text-now-green/30 font-mono text-xs">
                  {modules[activeModule].duration}
                </span>
                <span className="text-now-green/20">·</span>
                <span className="bg-now-green/10 text-now-green px-2 py-0.5 rounded text-xs font-mono">
                  {modules[activeModule].badge}
                </span>
              </div>
              <h2 className="text-now-ivory font-mono font-bold text-2xl">
                {modules[activeModule].title}
              </h2>
              <p className="text-now-green/50 font-mono text-sm mt-1">
                {modules[activeModule].subtitle}
              </p>
              <p className="text-now-ivory/40 text-xs mt-2">
                Output: {modules[activeModule].output}
              </p>
            </div>

            {/* Conteúdo do Módulo */}
            {renderModuleContent(activeModule)}
          </div>

          {/* Coluna Direita — Chat do Guia */}
          {showChat && (
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-6 h-[calc(100vh-12rem)] bg-now-terminal border border-now-green/10 rounded-xl overflow-hidden flex flex-col">
                <ChatGuide moduleIndex={activeModule} checkStep={chatStep} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-now-green/10 px-6 py-4 mt-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-now-green/20 font-mono text-xs">
            Método Agora — A revolução não espera.
          </p>
        </div>
      </footer>
    </div>
  );
}
