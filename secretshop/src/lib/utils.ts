import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { DotaRank, RANK_MMR } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMMR(rank: DotaRank): string {
  return `~${RANK_MMR[rank].toLocaleString()} MMR`
}

export function steamId64ToAccountId(steamId64: string): number {
  // Steam ID64 = 76561197960265728 + accountId
  return Number(BigInt(steamId64) - BigInt('76561197960265728'))
}

export function accountIdToSteamId64(accountId: number): string {
  return (BigInt(accountId) + BigInt('76561197960265728')).toString()
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function getWinRate(wins: number, total: number): number {
  if (total === 0) return 0
  return Math.round((wins / total) * 100)
}

export function rankTierToName(tier: number | null): DotaRank {
  if (!tier) return 'Herald'
  const base = Math.floor(tier / 10)
  const map: Record<number, DotaRank> = {
    1: 'Herald',
    2: 'Guardian',
    3: 'Crusader',
    4: 'Archon',
    5: 'Legend',
    6: 'Ancient',
    7: 'Divine',
    8: 'Immortal',
  }
  return map[base] ?? 'Herald'
}

export function getCountdown(targetDate: string): {
  days: number
  hours: number
  minutes: number
  seconds: number
  expired: boolean
} {
  const target = new Date(targetDate).getTime()
  const now = Date.now()
  const diff = target - now

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
  }

  const days    = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds, expired: false }
}

export function validateSteamId(id: string): boolean {
  return /^\d{17}$/.test(id)
}

export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n - 1) + '…' : str
}
