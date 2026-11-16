import Anthropic from '@anthropic-ai/sdk'
import {
  SINGLE_FAMILY_SYSTEM, buildSingleFamilyMessage,
  VACATION_RENTAL_SYSTEM, buildVacationRentalMessage,
  CONDO_SYSTEM, buildCondoMessage,
  FIX_FLIP_SYSTEM, buildFixFlipMessage,
} from '@/lib/prompts'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

type AnalyzeType = 'single-family' | 'vacation-rental' | 'condos' | 'fix-flip'

function getSystemPrompt(type: AnalyzeType): string {
  switch (type) {
    case 'single-family': return SINGLE_FAMILY_SYSTEM
    case 'vacation-rental': return VACATION_RENTAL_SYSTEM
    case 'condos': return CONDO_SYSTEM
    case 'fix-flip': return FIX_FLIP_SYSTEM
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildUserMessage(type: AnalyzeType, params: any): string {
  switch (type) {
    case 'single-family': return buildSingleFamilyMessage(params)
    case 'vacation-rental': return buildVacationRentalMessage(params)
    case 'condos': return buildCondoMessage(params)
    case 'fix-flip': return buildFixFlipMessage(params)
  }
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY is not configured.' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    })
  }

  const body = await req.json()
  const { type, params } = body as { type: AnalyzeType; params: Record<string, string> }

  if (!type || !params) {
    return new Response(JSON.stringify({ error: 'Missing type or params' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    })
  }

  const systemPrompt = getSystemPrompt(type)
  const userMessage = buildUserMessage(type, params)

  const encoder = new TextEncoder()
  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        const stream = client.messages.stream({
          model: 'claude-sonnet-4-6',
          max_tokens: 6000,
          tools: [{ type: 'web_search_20250305' as const, name: 'web_search' }],
          system: [
            {
              type: 'text' as const,
              text: systemPrompt,
              cache_control: { type: 'ephemeral' as const },
            },
          ],
          messages: [{ role: 'user', content: userMessage }],
        })

        for await (const event of stream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            controller.enqueue(encoder.encode(event.delta.text))
          }
        }
        controller.close()
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error'
        controller.enqueue(encoder.encode(JSON.stringify({ error: msg })))
        controller.close()
      }
    },
  })

  return new Response(readableStream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
