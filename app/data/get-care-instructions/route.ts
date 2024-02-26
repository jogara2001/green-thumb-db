import { NextResponse } from 'next/server'
import OpenAI from 'openai'

export const dynamic = 'force-dynamic'

interface GetCareInstructionsParams {
  common_name: string
  scientific_name: string
}

export async function POST (request: Request) {
  const openai = new OpenAI()
  const params: GetCareInstructionsParams = await request.json()

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'system', content: `Generate me care instructions for the following plant: ${params.common_name}` }],
      model: 'gpt-3.5-turbo'
    })

    return NextResponse.json({
      content: completion.choices[0].message.content
    })
  } catch {
    return NextResponse.json({
      content: 'Error generating data'
    })
  }
}
