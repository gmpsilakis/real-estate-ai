import Anthropic from '@anthropic-ai/sdk'
import { MARKET_DATA_SYSTEM, MARKET_DATA_USER } from '@/lib/prompts'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY is not configured. Create a .env.local file.' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    })
  }

  const body = await req.json().catch(() => ({}))
  const { state, region } = body as { state?: string; region?: string }

  const encoder = new TextEncoder()
  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        const stream = client.messages.stream({
          model: 'claude-sonnet-4-6',
          max_tokens: 4096,
          tools: [{ type: 'web_search_20250305' as const, name: 'web_search' }],
          system: [
            {
              type: 'text' as const,
              text: MARKET_DATA_SYSTEM,
              cache_control: { type: 'ephemeral' as const },
            },
          ],
          messages: [{ role: 'user', content: MARKET_DATA_USER(state, region) }],
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
