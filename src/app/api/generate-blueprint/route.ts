import OpenAI from 'openai'
import { SYSTEM_PROMPT, buildUserPrompt } from '@/lib/assessment/prompt'

export const maxDuration = 60

// Rate limiter simples em memória (por IP, 3 pedidos por minuto)
const rateMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 3
const RATE_WINDOW = 60_000

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW })
    return false
  }
  entry.count++
  return entry.count > RATE_LIMIT
}

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function POST(request: Request) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (isRateLimited(ip)) {
      return jsonError('Demasiados pedidos. Tenta novamente em 1 minuto.', 429)
    }

    const body = await request.json()
    const { name, formattedScores } = body

    // Validação de input
    if (!name || typeof name !== 'string' || !formattedScores || typeof formattedScores !== 'string') {
      return jsonError('Dados em falta ou inválidos', 400)
    }
    if (name.length > 100) {
      return jsonError('Nome demasiado longo', 400)
    }
    if (formattedScores.length > 10000) {
      return jsonError('Dados do assessment demasiado grandes', 400)
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return jsonError('API key não configurada', 500)
    }

    const openai = new OpenAI({ apiKey })

    // Sanitizar name — remover HTML tags
    const safeName = name.replace(/<[^>]*>/g, '').trim()

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserPrompt(safeName, formattedScores) },
      ],
      temperature: 0.7,
      max_tokens: 4096,
      stream: true,
    })

    const encoder = new TextEncoder()

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content
            if (text) {
              controller.enqueue(encoder.encode(text))
            }
          }
          controller.close()
        } catch (err) {
          controller.error(err)
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('Erro ao gerar Blueprint:', error)
    return jsonError('Erro interno ao gerar o Blueprint', 500)
  }
}
