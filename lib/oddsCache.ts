// lib/oddsCache.ts

export type OddsApiResponse = unknown

type CacheEntry = {
  data: OddsApiResponse
  updatedAt: number
}

const CACHE_TTL_MS = 15_000 // 15 seconds – tweak as needed

const cache = new Map<string, CacheEntry>()

export function getCachedOdds(key: string) {
  const entry = cache.get(key)
  if (!entry) return null

  const ageMs = Date.now() - entry.updatedAt
  if (ageMs > CACHE_TTL_MS) {
    return null
  }

  return { data: entry.data, ageMs }
}

export function setCachedOdds(key: string, data: OddsApiResponse) {
  cache.set(key, {
    data,
    updatedAt: Date.now()
  })
}

export function getCacheTtlMs() {
  return CACHE_TTL_MS
}
