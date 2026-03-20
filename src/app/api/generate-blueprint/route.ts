import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { SYSTEM_PROMPT, buildUserPrompt } from '@/lib/assessment/prompt'

export async function POST(request: Request) {
  try {
    const { name, formattedScores } = await request.json()

    if (!name || !formattedScores) {
      return NextResponse.json(
        { error: 'Dados em falta' },
        { status: 400 }
      )
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key não configurada' },
        { status: 500 }
      )
    }

    const openai = new OpenAI({ apiKey })

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserPrompt(name, formattedScores) },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    })

    const blueprint = completion.choices[0]?.message?.content

    if (!blueprint) {
      return NextResponse.json(
        { error: 'Não foi possível gerar o Blueprint' },
        { status: 500 }
      )
    }

    return NextResponse.json({ blueprint })
  } catch (error) {
    console.error('Erro ao gerar Blueprint:', error)
    return NextResponse.json(
      { error: 'Erro interno ao gerar o Blueprint' },
      { status: 500 }
    )
  }
}
