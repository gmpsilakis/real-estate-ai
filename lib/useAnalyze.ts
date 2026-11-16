'use client'
import { useState, useCallback } from 'react'

export function extractJSON<T>(raw: string): T | null {
  try {
    const start = raw.indexOf('{')
    const end = raw.lastIndexOf('}')
    if (start === -1 || end === -1) return null
    return JSON.parse(raw.slice(start, end + 1)) as T
  } catch { return null }
}

export function useAnalyze<T>(type: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [streamText, setStreamText] = useState('')
  const [error, setError] = useState('')

  const analyze = useCallback(async (params: Record<string, string>) => {
    setLoading(true)
    setError('')
    setStreamText('')
    setData(null)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, params }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'API error')
      }

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (reader) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        setStreamText(accumulated)
      }

      const parsed = extractJSON<T>(accumulated)
      if (!parsed) throw new Error('Could not parse response. Please try again.')
      setData(parsed)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
      setStreamText('')
    }
  }, [type])

  return { data, loading, streamText, error, analyze }
}
