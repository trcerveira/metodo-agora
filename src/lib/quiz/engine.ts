import { questions, type StrengthsDomain, type WealthProfile } from './data'

// ============================================================
// Motor de Cálculo — Zona de Genialidade Express
// ============================================================

export type Zone = 'genius' | 'excellence' | 'competence'

export interface QuizResult {
  zone: Zone
  zoneTitle: string
  zoneDescription: string
  zoneHook: string
  strengthsDomain: StrengthsDomain
  strengthsTitle: string
  strengthsDescription: string
  wealthProfile: WealthProfile
  wealthTitle: string
  wealthDescription: string
  archetype: string
  consistency: number
}

// --- Descrições ---

const ZONE_DATA: Record<Zone, { title: string; description: string; hook: string }> = {
  genius: {
    title: 'Zona de Genialidade',
    description:
      'As tuas respostas mostram forte alinhamento entre talento, energia e paixão. Mas atenção — 87% das pessoas nesta zona acabam por sabotá-la inconscientemente. Chama-se Upper Limit Problem: quanto mais perto estás do teu potencial, mais o teu cérebro inventa formas de te puxar para baixo. Estás a proteger esta zona — ou a sabotá-la sem saber?',
    hook: 'Estás na zona certa. Mas estás a sabotá-la sem saber?',
  },
  excellence: {
    title: 'Zona de Excelência',
    description:
      'Estás a fazer trabalho em que és EXCELENTE — mas que não te acende verdadeiramente por dentro. Os outros recompensam-te e validam-te aqui, o que torna difícil sair. É a armadilha mais perigosa: ser tão bom em algo que nunca chegas ao que és GENIAL. A tua genialidade está numa direção diferente — e os 7 frameworks completos revelam exatamente qual.',
    hook: 'És excelente. Mas excelente não é genial.',
  },
  competence: {
    title: 'Zona de Descoberta',
    description:
      'Tens interesses e capacidades diversas — o que é poderoso, não fraco. Mas sem foco, essa diversidade dispersa-te em vez de te servir. As tuas respostas mostram que ainda não encaixaste na tua zona de genialidade singular. A análise completa dos 7 frameworks vai mapear o caminho exato desde onde estás até onde a tua genialidade vive.',
    hook: 'Tens potencial espalhado. Precisas de foco.',
  },
}

const STRENGTHS_DATA: Record<StrengthsDomain, { title: string; description: string }> = {
  executing: {
    title: 'O Construtor',
    description:
      'Tu fazes as coisas acontecer. Enquanto os outros ainda estão a planear, tu já entregaste a primeira versão. A tua genialidade está em transformar visão em realidade, entregar resultados consistentes e trazer ordem ao caos.',
  },
  influencing: {
    title: 'O Catalisador',
    description:
      'Tu moves pessoas à ação. Seja pelas palavras, pela energia ou pela força da personalidade, tens a capacidade rara de transformar céticos em crentes e espectadores em participantes.',
  },
  relationship: {
    title: 'A Ponte',
    description:
      'Tu compreendes pessoas a um nível que a maioria não alcança. A tua genialidade está em construir confiança, criar conexões profundas e tornar toda a gente à tua volta melhor. As equipas funcionam por causa de pessoas como tu.',
  },
  strategic: {
    title: 'O Arquiteto',
    description:
      'Tu vês o plano que os outros não conseguem ver. Enquanto a maioria resolve os problemas de hoje, tu já estás a mapear a paisagem de amanhã. A tua genialidade está no reconhecimento de padrões, na análise e no pensamento visionário.',
  },
}

const WEALTH_DATA: Record<WealthProfile, { title: string; description: string }> = {
  creator: {
    title: 'Criador',
    description: 'O teu caminho para a riqueza é pela inovação — criar produtos, conteúdo e ideias que não existiam antes. Pensa em Steve Jobs, Walt Disney.',
  },
  mechanic: {
    title: 'Mecânico',
    description: 'O teu caminho para a riqueza é pela otimização — pegar no que existe e torná-lo 10x melhor. Pensa em Sam Walton, Ray Kroc.',
  },
  star: {
    title: 'Estrela',
    description: 'O teu caminho para a riqueza é pela visibilidade — a tua marca pessoal É o produto. Pensa em Oprah, Gary Vee.',
  },
  supporter: {
    title: 'Apoiador',
    description: 'O teu caminho para a riqueza é pela liderança — construir e gerir equipas que executam ao mais alto nível. Pensa em Jack Welch.',
  },
  dealmaker: {
    title: 'Negociador',
    description: 'O teu caminho para a riqueza é pelas conexões — vês oportunidades onde os outros veem estranhos. Pensa em Richard Branson.',
  },
  trader: {
    title: 'Comerciante',
    description: 'O teu caminho para a riqueza é pelo timing — sabes exatamente quando comprar, vender ou pivotar. Pensa em George Soros.',
  },
  accumulator: {
    title: 'Acumulador',
    description: 'O teu caminho para a riqueza é pela consistência — crescimento estável, investimentos inteligentes, juros compostos ao longo do tempo. Pensa em Warren Buffett.',
  },
  lord: {
    title: 'Senhor dos Sistemas',
    description: 'O teu caminho para a riqueza é pelo controlo — construir sistemas autónomos que geram cash flow sem ti. Pensa em Andrew Carnegie.',
  },
}

// --- Cálculo ---

export function calculateResults(answers: Record<string, string>): QuizResult {
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

  for (const [qId, answerValue] of Object.entries(answers)) {
    const question = questions.find((q) => q.id === qId)
    if (!question) continue

    const option = question.options.find((o) => o.value === answerValue)
    if (!option) continue

    if (option.scores.strengths) {
      for (const [key, val] of Object.entries(option.scores.strengths)) {
        strengthScores[key as StrengthsDomain] += val
      }
    }

    if (option.scores.wealth) {
      for (const [key, val] of Object.entries(option.scores.wealth)) {
        wealthScores[key as WealthProfile] += val
      }
    }
  }

  // Domínio de forças mais forte
  const sortedStrengths = Object.entries(strengthScores).sort((a, b) => b[1] - a[1])
  const topStrength = sortedStrengths[0][0] as StrengthsDomain

  // Perfil de riqueza mais forte
  const sortedWealth = Object.entries(wealthScores).sort((a, b) => b[1] - a[1])
  const topWealth = sortedWealth[0][0] as WealthProfile

  // Zona — baseada na consistência (quão dominante é a força principal)
  const totalStrength = Object.values(strengthScores).reduce((a, b) => a + b, 0)
  const consistency = totalStrength > 0 ? sortedStrengths[0][1] / totalStrength : 0

  // Limiares calibrados para distribuição realista:
  // ~30% genius (muito consistente), ~50% excellence (armadilha), ~20% competence (disperso)
  let zone: Zone
  if (consistency > 0.55) zone = 'genius'
  else if (consistency > 0.38) zone = 'excellence'
  else zone = 'competence'

  const zoneInfo = ZONE_DATA[zone]
  const strengthInfo = STRENGTHS_DATA[topStrength]
  const wealthInfo = WEALTH_DATA[topWealth]

  return {
    zone,
    zoneTitle: zoneInfo.title,
    zoneDescription: zoneInfo.description,
    zoneHook: zoneInfo.hook,
    strengthsDomain: topStrength,
    strengthsTitle: strengthInfo.title,
    strengthsDescription: strengthInfo.description,
    wealthProfile: topWealth,
    wealthTitle: wealthInfo.title,
    wealthDescription: wealthInfo.description,
    archetype: `${strengthInfo.title} · ${wealthInfo.title}`,
    consistency: Math.round(consistency * 100),
  }
}

// --- Template HTML do Email ---

export function generateEmailHTML(name: string, result: QuizResult): string {
  const zoneBg = result.zone === 'genius' ? '#BFD64B' : result.zone === 'excellence' ? '#ADFF2F' : '#FFA500'
  const zoneColor = '#000000'

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0A0E1A;color:#E8E4DC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0E1A;">
<tr><td align="center" style="padding:40px 20px;">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

<!-- Cabeçalho -->
<tr><td style="text-align:center;padding:30px 0;">
<h1 style="color:#BFD64B;font-size:28px;margin:0;letter-spacing:4px;">O TEU PERFIL DA ZONA DE GENIALIDADE</h1>
<p style="color:#7A8A32;font-size:14px;margin:10px 0 0;">Método Agora · Assessment Express</p>
</td></tr>

<!-- Nome -->
<tr><td style="padding:0 0 30px;text-align:center;">
<p style="color:#E8E4DC;font-size:16px;margin:0;">${name}, aqui estão os teus resultados.</p>
</td></tr>

<!-- Badge da Zona -->
<tr><td style="padding:20px;background:#111628;border:1px solid #1E2310;border-radius:8px;">
<div style="text-align:center;margin-bottom:16px;">
<span style="display:inline-block;background:${zoneBg};color:${zoneColor};font-weight:700;font-size:14px;padding:6px 16px;border-radius:20px;letter-spacing:1px;">${result.zoneTitle.toUpperCase()}</span>
</div>
<p style="color:#E8E4DC;font-size:14px;line-height:1.6;margin:0;">${result.zoneDescription}</p>
</td></tr>

<!-- Arquétipo -->
<tr><td style="padding:30px 0 10px;text-align:center;">
<p style="color:#7A8A32;font-size:12px;letter-spacing:2px;margin:0;">O TEU ARQUÉTIPO</p>
<h2 style="color:#BFD64B;font-size:24px;margin:8px 0 0;">${result.archetype}</h2>
</td></tr>

<!-- Forças -->
<tr><td style="padding:20px;margin-top:20px;background:#111628;border:1px solid #1E2310;border-radius:8px;">
<p style="color:#7A8A32;font-size:12px;letter-spacing:2px;margin:0 0 8px;">DOMÍNIO DE FORÇAS</p>
<h3 style="color:#BFD64B;font-size:18px;margin:0 0 8px;">${result.strengthsTitle}</h3>
<p style="color:#E8E4DC;font-size:14px;line-height:1.6;margin:0;">${result.strengthsDescription}</p>
</td></tr>

<!-- Espaçador -->
<tr><td style="padding:10px 0;"></td></tr>

<!-- Perfil de Riqueza -->
<tr><td style="padding:20px;background:#111628;border:1px solid #1E2310;border-radius:8px;">
<p style="color:#7A8A32;font-size:12px;letter-spacing:2px;margin:0 0 8px;">PERFIL DE RIQUEZA</p>
<h3 style="color:#BFD64B;font-size:18px;margin:0 0 8px;">${result.wealthTitle}</h3>
<p style="color:#E8E4DC;font-size:14px;line-height:1.6;margin:0;">${result.wealthDescription}</p>
</td></tr>

<!-- Divisor -->
<tr><td style="padding:30px 0;text-align:center;">
<div style="border-top:1px solid #1E2310;"></div>
</td></tr>

<!-- O que isto significa -->
<tr><td style="padding:0 0 30px;">
<h3 style="color:#BFD64B;font-size:18px;margin:0 0 12px;">O que isto significa para ti?</h3>
<p style="color:#E8E4DC;font-size:14px;line-height:1.6;margin:0 0 12px;">Este assessment express mapeou o teu perfil em 3 de 7 frameworks de elite. Agora conheces a tua <strong style="color:#BFD64B;">Zona de Genialidade</strong>, o teu <strong style="color:#BFD64B;">Domínio de Forças</strong> e o teu <strong style="color:#BFD64B;">Perfil de Riqueza</strong>.</p>
<p style="color:#E8E4DC;font-size:14px;line-height:1.6;margin:0;">Mas faltam 4 frameworks — incluindo o teu <em>Upper Limit Problem</em> (o padrão oculto que sabota o teu crescimento), o teu <em>Modo de Ação Kolbe</em> (como executas naturalmente) e a tua <em>Fascination Advantage</em> (como o mundo te perceciona).</p>
</td></tr>

<!-- CTA: Blueprint -->
<tr><td style="text-align:center;padding:20px 0;">
<p style="color:#7A8A32;font-size:12px;letter-spacing:2px;margin:0 0 12px;">PRONTO PARA CONSTRUIR?</p>
<a href="#" style="display:inline-block;background:#BFD64B;color:#000000;font-weight:700;font-size:16px;padding:14px 32px;border-radius:6px;text-decoration:none;letter-spacing:1px;">OBTÉM O BLUEPRINT — €29</a>
<p style="color:#E8E4DC;font-size:13px;margin:12px 0 0;">Método Agora: Da ideia à startup em 48 horas.</p>
</td></tr>

<!-- Divisor -->
<tr><td style="padding:20px 0;text-align:center;">
<p style="color:#7A8A32;font-size:13px;margin:0;">— ou —</p>
</td></tr>

<!-- CTA: Lista de espera -->
<tr><td style="text-align:center;padding:0 0 40px;">
<a href="#" style="display:inline-block;border:1px solid #BFD64B;color:#BFD64B;font-weight:700;font-size:14px;padding:12px 28px;border-radius:6px;text-decoration:none;letter-spacing:1px;">ENTRA NA LISTA DE ESPERA — EDIÇÃO #1</a>
<p style="color:#E8E4DC;font-size:13px;margin:12px 0 0;">Inclui o <strong style="color:#BFD64B;">assessment completo de 43 perguntas</strong> com os 7 frameworks + plano de monetização personalizado a 90 dias.</p>
</td></tr>

<!-- Rodapé -->
<tr><td style="text-align:center;padding:20px 0;border-top:1px solid #1E2310;">
<p style="color:#7A8A32;font-size:11px;margin:0;">Método Agora · A revolução não espera.</p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`
}
