import OpenAI from 'openai'
import { SYSTEM_PROMPT, buildUserPrompt } from '@/lib/assessment/prompt'

export const maxDuration = 60 // Vercel: allow up to 60s for streaming

export async function POST(request: Request) {
  try {
    const { name, formattedScores } = await request.json()

    if (!name || !formattedScores) {
      return new Response(JSON.stringify({ error: 'Dados em falta' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key não configurada' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const openai = new OpenAI({ apiKey })

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserPrompt(name, formattedScores) },
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
    return new Response(JSON.stringify({ error: 'Erro interno ao gerar o Blueprint' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
