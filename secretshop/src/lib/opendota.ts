import {
  OpenDotaPlayer,
  OpenDotaHeroStat,
  OpenDotaRecentMatch,
} from '@/types'

const BASE = 'https://api.opendota.com/api'

async function odFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      next: { revalidate: 300 }, // 5-minute cache
    })
    if (!res.ok) return null
    return res.json() as Promise<T>
  } catch {
    return null
  }
}

export async function getPlayerProfile(accountId: number): Promise<OpenDotaPlayer | null> {
  return odFetch<OpenDotaPlayer>(`/players/${accountId}`)
}

export async function getPlayerHeroes(accountId: number): Promise<OpenDotaHeroStat[]> {
  const data = await odFetch<OpenDotaHeroStat[]>(`/players/${accountId}/heroes`)
  return data ?? []
}

export async function getRecentMatches(accountId: number): Promise<OpenDotaRecentMatch[]> {
  const data = await odFetch<OpenDotaRecentMatch[]>(
    `/players/${accountId}/recentMatches`
  )
  return data ?? []
}

export async function getHeroName(heroId: number): Promise<string> {
  // Returns hero name from constants — cache indefinitely
  const data = await fetch(`${BASE}/constants/heroes`, {
    next: { revalidate: 86400 },
  }).then((r) => r.json()).catch(() => ({}))
  return data[heroId]?.localized_name ?? `Hero ${heroId}`
}

export function accountIdFromSteamId64(steamId64: string): number {
  return Number(BigInt(steamId64) - BigInt('76561197960265728'))
}
