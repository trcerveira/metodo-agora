'use client'

// ============================================================
// Página de Venda — Método Agora (Low Ticket €9)
// O botão redireciona para checkout externo (Gumroad/LemonSqueezy)
// ============================================================

// TODO: Substituir pelo link real do Gumroad ou LemonSqueezy
const CHECKOUT_URL = 'https://buy.stripe.com/eVqdRb9SvcsMbda6Dwa3u00'

export default function ComprarPage() {
  return (
    <main className="min-h-screen bg-now-obsidian text-now-white font-sans">
      <div className="mx-auto max-w-lg px-6 py-12">

        {/* Cabeçalho */}
        <div className="mb-2 text-center">
          <span className="text-xs tracking-[6px] text-now-green-dark">MÉTODO</span>
          <h1 className="mt-1 text-4xl font-bold text-now-green">AGORA</h1>
        </div>
        <p className="mb-10 text-center text-xs tracking-wider text-now-green-dark">
          EDIÇÃO #1 — VAGAS LIMITADAS
        </p>

        {/* Problema → Solução */}
        <div className="mb-8">
          <p className="mb-3 text-sm text-now-white/60">
            Fizeste o teste express e descobriste a tua zona. Mas viste apenas <strong className="text-now-white/90">3 de 7 frameworks</strong>.
          </p>
          <p className="text-sm text-now-white/60">
            O pacote completo dá-te o mapa inteiro — e as ferramentas para agir.
          </p>
        </div>

        {/* O que recebes */}
        <div className="mb-8 rounded-lg border border-now-green-dim bg-now-terminal p-6">
          <p className="mb-4 text-xs font-bold tracking-wider text-now-green">O QUE RECEBES</p>
          <ul className="space-y-4 text-sm">
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-now-green text-xs font-bold text-black">1</span>
              <div>
                <p className="font-bold text-now-white/90">Zona de Genialidade completa</p>
                <p className="text-now-white/50">43 perguntas, 7 frameworks, relatório detalhado com o teu perfil completo</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-now-green text-xs font-bold text-black">2</span>
              <div>
                <p className="font-bold text-now-white/90">Instalar o Claude Code</p>
                <p className="text-now-white/50">Guia passo a passo do zero — mesmo que nunca tenhas programado</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-now-green text-xs font-bold text-black">3</span>
              <div>
                <p className="font-bold text-now-white/90">Agente Analyst</p>
                <p className="text-now-white/50">Analisa o teu mercado e encontra oportunidades reais para o teu perfil</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-now-green text-xs font-bold text-black">4</span>
              <div>
                <p className="font-bold text-now-white/90">Agente PO (Product Owner)</p>
                <p className="text-now-white/50">Transforma a tua ideia num produto concreto, pronto a construir</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Escassez */}
        <div className="mb-6 rounded-lg border border-now-green/30 bg-now-green/5 p-4 text-center">
          <p className="text-sm text-now-white/70">
            Apenas <strong className="text-now-green">10 vagas</strong> a este preço. Depois sobe.
          </p>
        </div>

        {/* Preço + CTA */}
        <div className="mb-6 text-center">
          <p className="text-5xl font-bold text-now-green">€9</p>
          <p className="mt-1 text-xs text-now-white/40">Pagamento único · Acesso imediato · Cartão ou PayPal</p>
        </div>

        <a
          href={CHECKOUT_URL}
          className="mb-4 block w-full rounded-lg bg-now-green py-4 text-center text-base font-bold text-black transition hover:shadow-[0_0_20px_rgba(191,214,75,0.4)]"
        >
          QUERO O PACOTE COMPLETO
        </a>

        {/* Garantia */}
        <p className="mb-10 text-center text-xs text-now-white/40">
          Garantia de 7 dias — se não ficares satisfeito, devolvemos o dinheiro. Sem perguntas.
        </p>

        {/* Teaser próximo nível */}
        <div className="mb-8 rounded-lg border border-now-green-dim/50 bg-now-terminal/50 p-4">
          <p className="mb-2 text-xs font-bold tracking-wider text-now-green-dark">PRÓXIMO NÍVEL — €99</p>
          <p className="text-sm text-now-white/50">
            Todos os agentes do squad + blueprint do PRD ao MVP em 48 horas. O Método Agora completo.
          </p>
        </div>

        {/* Voltar */}
        <div className="text-center">
          <a href="/quiz" className="text-xs text-now-green-dark hover:text-now-green">
            &larr; Voltar ao teste
          </a>
        </div>

        {/* Rodapé */}
        <div className="mt-12 border-t border-now-green-dim pt-8 text-center">
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
    </main>
  )
}
