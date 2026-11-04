import { apiClient } from './apiClient'
import type { Partner } from '../types'

let cache: Record<string, string> | null = null
let fetchPromise: Promise<Record<string, string>> | null = null

export async function getPartnerNamesMap(forceRefresh = false): Promise<Record<string, string>> {
  if (cache && !forceRefresh) return cache
  if (fetchPromise && !forceRefresh) return fetchPromise

  fetchPromise = (async () => {
    try {
      const partners = await apiClient.get<Partner[]>('/api/partners')
      const map: Record<string, string> = {}
      ;(partners || []).forEach((p) => { map[p.id] = p.name })
      cache = map
      return map
    } catch {
      return cache || {}
    } finally {
      fetchPromise = null
    }
  })()

  return fetchPromise
}

