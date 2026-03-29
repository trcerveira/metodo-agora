import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    const lead = {
      name: data.name,
      email: data.email,
      answers: data.answers,
      result: data.result,
      timestamp: new Date().toISOString(),
      source: 'method-c-body-score',
    }

    // Log for now — will be saved to database when configured
    console.log('[Method C] New lead:', lead.email, 'Level:', lead.result?.level)

    // TODO: Save to Supabase
    // const { error } = await supabase.from('body_score_leads').insert(lead)

    // TODO: Send welcome email via Resend

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to process submission' }, { status: 500 })
  }
}
