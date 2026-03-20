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
      source: 'zona-genialidade-express',
    }

    // Lead captured — will be saved to Supabase when configured

    // TODO: Save to Supabase
    // const { data: row, error } = await supabase.from('quiz_leads').insert(lead)

    // TODO: Send email via Resend
    // await resend.emails.send({
    //   from: 'NOW <results@metodonow.com>',
    //   to: data.email,
    //   subject: `${data.name}, your Genius Zone Profile is ready`,
    //   html: generateEmailHTML(data.name, data.result),
    // })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to process quiz submission' }, { status: 500 })
  }
}
