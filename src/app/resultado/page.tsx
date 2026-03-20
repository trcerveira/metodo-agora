'use client'

import { useState, useEffect } from 'react'

interface BlueprintData {
  name: string
  blueprint: string
  result: {
    zone: string
    zoneTitle: string
    archetype: string
    strengthsDomain: string
    wealthProfile: string
    kolbeDominant: string
    consistency: number
  }
  timestamp: string
}

export default function ResultadoPage() {
  const [data, setData] = useState<BlueprintData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('blueprint_data')
    if (stored) {
      try {
        setData(JSON.parse(stored))
      } catch {
        localStorage.removeItem('blueprint_data')
      }
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-now-obsidian">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-now-green-dim border-t-now-green" />
      </main>
    )
  }

  if (!data) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-now-obsidian px-6 text-center">
        <h1 className="mb-4 text-2xl font-bold text-now-white">
          Nenhum Blueprint encontrado
        </h1>
        <p className="mb-8 text-now-white/60">
          Precisas de completar o assessment primeiro.
        </p>
        <a
          href="/assessment"
          className="rounded-md bg-now-green px-8 py-3 text-sm font-bold text-black transition hover:shadow-[0_0_20px_rgba(191,214,75,0.4)]"
        >
          INICIAR ASSESSMENT
        </a>
      </main>
    )
  }

  const zoneBadge =
    data.result.zone === 'genius'
      ? 'bg-now-green text-black'
      : data.result.zone === 'excellence'
        ? 'bg-yellow-400 text-black'
        : 'bg-orange-400 text-black'

  return (
    <main className="min-h-screen bg-now-obsidian font-sans text-now-white selection:bg-now-green/20">
      {/* Header */}
      <header className="border-b border-now-green-dim px-6 py-8 text-center">
        <span className="text-xs tracking-[6px] text-now-green-dark">MÉTODO</span>
        <h1 className="mt-1 text-3xl font-bold text-now-green">AGORA</h1>
        <p className="mt-2 text-sm text-now-white/50">
          Blueprint da Zona de Genialidade
        </p>
      </header>

      {/* Profile Summary */}
      <div className="mx-auto max-w-2xl px-6 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-now-ivory">{data.name}</h2>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-bold tracking-wider ${zoneBadge}`}>
              {data.result.zoneTitle.toUpperCase()}
            </span>
            <span className="rounded-full border border-now-green-dim px-3 py-1 text-xs text-now-green">
              {data.result.archetype}
            </span>
          </div>
          <p className="mt-2 font-mono text-xs text-now-green-dark">
            Consistência: {data.result.consistency}% · Gerado em{' '}
            {new Date(data.timestamp).toLocaleDateString('pt-PT')}
          </p>
        </div>

        {/* Blueprint Content (Markdown → HTML) */}
        <div className="blueprint-content">
          <MarkdownRenderer content={data.blueprint} />
        </div>

        {/* CTA — Agora OX */}
        <div className="mt-12 rounded-xl border-2 border-now-green-dim/50 bg-[#111628] p-8 text-center space-y-4">
          <p className="text-now-green text-sm tracking-wider">E AGORA?</p>
          <h3 className="text-now-ivory text-2xl font-bold">
            Tens o plano.<br />Agora precisas da equipa.
          </h3>
          <p className="text-now-white/50 text-sm max-w-md mx-auto">
            Sabes quem és. Sabes o que construir. Mas construir sozinho é o caminho mais lento.
            O Agora OX é o teu squad de agentes AI — arquiteto, developer, QA, product owner —
            todos alinhados com o TEU perfil de genialidade.
          </p>
          <a
            href="https://buy.stripe.com/PLACEHOLDER_AGORA_OX"
            className="inline-block mt-4 rounded-lg bg-now-green px-10 py-4 text-lg font-bold text-black transition hover:shadow-[0_0_30px_rgba(191,214,75,0.4)]"
          >
            AGORA OX — €99
          </a>
          <p className="text-now-green-dark text-xs">
            Squad completo de agentes AI · Construído para o teu perfil
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 border-t border-now-green-dim pt-8 text-center">
          <button
            onClick={() => window.print()}
            className="rounded-md border border-now-green px-6 py-2.5 text-sm font-bold text-now-green transition hover:bg-now-green hover:text-black"
          >
            GUARDAR / IMPRIMIR
          </button>
          <div className="mt-6">
            <span className="text-xs tracking-[4px] text-now-green-dark">MÉTODO</span>
            <p className="text-lg font-bold text-now-green">AGORA</p>
            <p className="mt-1 text-xs text-now-green-dark">A revolução não espera.</p>
          </div>
        </div>
      </div>
    </main>
  )
}

// ============================================================
// Markdown Renderer simples
// ============================================================
function MarkdownRenderer({ content }: { content: string }) {
  const html = markdownToHtml(content)

  return (
    <div
      className="prose-invert prose-now max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// Sanitização final — remove qualquer tag HTML que não esteja na whitelist
function sanitizeHtml(html: string): string {
  const allowedTags = ['h1', 'h2', 'h3', 'p', 'strong', 'em', 'li', 'blockquote', 'hr']
  return html.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*\/?>/g, (match, tag) => {
    return allowedTags.includes(tag.toLowerCase()) ? match : ''
  })
}

function markdownToHtml(md: string): string {
  const safe = escapeHtml(md)
  const html = safe
    .replace(/^### (.+)$/gm, '<h3 class="mt-10 mb-4 text-lg font-bold text-now-green border-b border-now-green-dim pb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="mt-12 mb-4 text-xl font-bold text-now-ivory">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="mt-12 mb-6 text-2xl font-bold text-now-green">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-now-ivory font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-now-green/80">$1</em>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 mb-1.5 text-sm leading-relaxed text-now-white/80 list-disc list-inside">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 mb-1.5 text-sm leading-relaxed text-now-white/80 list-decimal list-inside">$2</li>')
    .replace(/^&gt; (.+)$/gm, '<blockquote class="border-l-2 border-now-green pl-4 my-4 text-now-white/70 italic">$1</blockquote>')
    .replace(/^---$/gm, '<hr class="my-8 border-now-green-dim" />')
    .replace(/^(?!<[hlubo]|<li|<hr)(.+)$/gm, '<p class="mb-3 text-sm leading-relaxed text-now-white/80">$1</p>')
    .replace(/<p class="[^"]*"><\/p>/g, '')

  return sanitizeHtml(html)
}
