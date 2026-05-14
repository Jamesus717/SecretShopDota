import { createAdminClient } from '@/lib/supabase'
import { SoloRegistration, DotaRank, POSITION_LABELS } from '@/types'
import {
  getPlayerProfile, getRecentMatches, getPlayerHeroes, accountIdFromSteamId64,
} from '@/lib/opendota'
import { RankBadge } from '@/components/ui/RankBadge'
import { rankTierToName, getWinRate, formatDuration } from '@/lib/utils'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { BortyReviewButton } from '@/components/bortygpt/BortyReviewButton'

export const revalidate = 300

async function getPlayer(id: string): Promise<SoloRegistration | null> {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('solo_registrations')
      .select('*')
      .eq('id', id)
      .single()
    return data
  } catch {
    return null
  }
}

interface Props {
  params: { id: string }
}

export default async function PlayerProfilePage({ params }: Props) {
  const player = await getPlayer(params.id)
  if (!player) notFound()

  const accountId = accountIdFromSteamId64(player.steam_id)
  const [profile, recentMatches, heroes] = await Promise.all([
    getPlayerProfile(accountId),
    getRecentMatches(accountId),
    getPlayerHeroes(accountId),
  ])

  const rank = profile?.rank_tier
    ? rankTierToName(profile.rank_tier)
    : player.rank as DotaRank

  const recentTen = recentMatches.slice(0, 10)
  const wins = recentTen.filter(m => {
    const isRadiant = m.player_slot < 128
    return isRadiant ? m.radiant_win : !m.radiant_win
  }).length

  const avgKills   = recentTen.length ? (recentTen.reduce((s, m) => s + m.kills, 0)   / recentTen.length).toFixed(1) : '—'
  const avgDeaths  = recentTen.length ? (recentTen.reduce((s, m) => s + m.deaths, 0)  / recentTen.length).toFixed(1) : '—'
  const avgAssists = recentTen.length ? (recentTen.reduce((s, m) => s + m.assists, 0) / recentTen.length).toFixed(1) : '—'

  const topHeroes = heroes.sort((a, b) => b.games - a.games).slice(0, 6)

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/players" className="btn-ghost inline-flex text-xs mb-8">
        <ArrowLeft size={12} /> Back to Players
      </Link>

      {/* ── Profile header ──────────────────────────────────── */}
      <div className="card-arcane p-6 md:p-8 mb-6 animate-slideUp">
        <div className="flex items-start gap-5 flex-wrap">
          {profile?.profile.avatarfull && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.profile.avatarfull}
              alt={player.ign}
              className="w-20 h-20 rounded-sm border border-arcane-700/40 flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <h1 className="font-cinzel font-black text-3xl text-arcane-100 mb-1">
              {player.ign}
            </h1>
            {player.steam_name && (
              <div className="font-mono text-sm text-arcane-400 mb-3">{player.steam_name}</div>
            )}
            <div className="flex items-center gap-3 flex-wrap">
              <RankBadge rank={rank} />
              <span className="font-cinzel text-xs uppercase tracking-wide text-arcane-500 border border-void-500 px-2 py-0.5 rounded-sm">
                Pos {player.primary_position} — {POSITION_LABELS[player.primary_position as keyof typeof POSITION_LABELS]}
              </span>
              {player.discord_username && (
                <span className="font-mono text-xs text-[#5865F2] border border-[#5865F2]/30 px-2 py-0.5 rounded-sm">
                  {player.discord_username}
                </span>
              )}
            </div>
          </div>
          {profile?.profile.profileurl && (
            <a
              href={profile.profile.profileurl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost text-xs py-1.5 px-3 flex-shrink-0"
            >
              Steam <ExternalLink size={10} />
            </a>
          )}
        </div>
      </div>

      {/* ── Stats ───────────────────────────────────────────── */}
      {recentTen.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Win Rate', value: `${getWinRate(wins, recentTen.length)}%` },
            { label: 'Avg Kills', value: avgKills },
            { label: 'Avg Deaths', value: avgDeaths },
            { label: 'Avg Assists', value: avgAssists },
          ].map(s => (
            <div key={s.label} className="card-arcane p-4 text-center">
              <div className="font-cinzel font-black text-2xl text-arcane-100 mb-1">{s.value}</div>
              <div className="font-mono text-[10px] text-arcane-500 uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── Hero pool ───────────────────────────────────────── */}
      {topHeroes.length > 0 && (
        <div className="card-arcane p-6 mb-6">
          <div className="section-label">Top Heroes</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {topHeroes.map(h => (
              <div key={h.hero_id} className="border border-void-500 rounded-sm p-3">
                <div className="font-mono text-sm text-arcane-100 mb-1">Hero #{h.hero_id}</div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-arcane-500">{h.games} games</span>
                  <span className={`font-mono text-xs font-bold ${getWinRate(h.win, h.games) >= 50 ? 'text-radiant' : 'text-dire'}`}>
                    {getWinRate(h.win, h.games)}% WR
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── BortyGPT Review ─────────────────────────────────── */}
      <div className="card-arcane p-6 mb-6">
        <div className="section-label">BortyGPT Scouting Report</div>
        <BortyReviewButton
          steamId={player.steam_id}
          ign={player.ign}
          rank={rank}
        />
      </div>

      {/* ── Recent matches ──────────────────────────────────── */}
      {recentTen.length > 0 && (
        <div className="card-arcane p-6">
          <div className="section-label">Recent Matches</div>
          <div className="space-y-2">
            {recentTen.map(m => {
              const isRadiant = m.player_slot < 128
              const won = isRadiant ? m.radiant_win : !m.radiant_win
              return (
                <a
                  key={m.match_id}
                  href={`https://www.dotabuff.com/matches/${m.match_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-3 border border-void-600 rounded-sm
                             hover:border-arcane-700 transition-colors group"
                >
                  <div className={`w-2 h-8 rounded-full flex-shrink-0 ${won ? 'bg-radiant' : 'bg-dire'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="font-cinzel text-xs font-bold text-arcane-300">
                      Hero #{m.hero_id}
                    </div>
                    <div className="font-mono text-xs text-arcane-500">
                      {m.kills}/{m.deaths}/{m.assists} · {formatDuration(m.duration)}
                    </div>
                  </div>
                  <div className={`font-cinzel text-xs font-bold ${won ? 'text-radiant' : 'text-dire'}`}>
                    {won ? 'W' : 'L'}
                  </div>
                  <ExternalLink size={10} className="text-arcane-600 group-hover:text-arcane-400" />
                </a>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
