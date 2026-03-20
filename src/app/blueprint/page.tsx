"use client";

import { useState, useEffect } from "react";

// --- Dados dos Módulos ---
const modules = [
  {
    id: "m1",
    number: 1,
    title: "Entra na Máquina",
    subtitle: "Instalar Claude Code",
    badge: "Awakened",
    duration: "15 min",
    output: "Claude Code instalado e a funcionar",
  },
  {
    id: "m2",
    number: 2,
    title: 'Efeito "Eh Lá"',
    subtitle: "3 coisas em 10 minutos",
    badge: "Awakened",
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
      "Olá, Awakened. Sou o teu guia. Não vou mostrar a cara — mas vou mostrar-te o caminho.",
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
    if (percentage < 25) return "Awakened";
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
      M{mod.number}
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

// --- Conteúdo Placeholder para outros módulos ---
function ModulePlaceholder({ mod }: { mod: (typeof modules)[0] }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="text-now-green/30 text-6xl mb-4">🔒</p>
      <h3 className="text-now-green/50 font-mono text-lg mb-2">{mod.title}</h3>
      <p className="text-now-green/20 font-mono text-sm">{mod.subtitle}</p>
      <p className="text-now-green/10 font-mono text-xs mt-4">
        Completa o módulo anterior para desbloquear
      </p>
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
        return <Module1Content onComplete={() => completeModule(0)} onStepChange={setChatStep} />;
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
              NOW<span className="text-now-green/40">_</span>BLUEPRINT
            </h1>
            <p className="text-now-green/30 font-mono text-xs mt-1">
              Método NOW — De zero a MVP em 48 horas
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
            Método NOW — A revolução não espera. Stay awake.
          </p>
        </div>
      </footer>
    </div>
  );
}
