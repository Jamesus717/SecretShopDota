import { createAdminClient } from '@/lib/supabase'
import { SoloRegistration, DotaRank } from '@/types'
import { RankBadge } from '@/components/ui/RankBadge'
import { POSITION_LABELS } from '@/types'
import Link from 'next/link'
import { Users, ChevronRight } from 'lucide-react'

export const revalidate = 60 // revalidate every minute

async function getPlayers(): Promise<SoloRegistration[]> {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('solo_registrations')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
    return data ?? []
  } catch {
    return []
  }
}

export default async function PlayersPage() {
  const players = await getPlayers()

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-start justify-between mb-10 animate-slideUp">
        <div>
          <div className="section-label">SecretLeague Season I</div>
          <h1 className="font-cinzel font-black text-4xl md:text-5xl text-arcane-100 mb-3">
            Registered Players
          </h1>
          <p className="font-rajdhani text-arcane-300/70">
            {players.length} player{players.length !== 1 ? 's' : ''} registered
          </p>
        </div>
        <Link href="/register" className="btn-primary text-xs py-2 px-4 hidden md:inline-flex">
          Register Now
          <ChevronRight size={12} />
        </Link>
      </div>

      {players.length === 0 ? (
        <div className="card-arcane p-16 text-center">
          <Users size={48} className="text-arcane-600 mx-auto mb-4" />
          <h2 className="font-cinzel text-xl text-arcane-400 mb-2">No players yet</h2>
          <p className="font-rajdhani text-arcane-500">Be the first to sign up for Season I</p>
          <Link href="/register" className="btn-primary inline-flex mt-6 text-xs">
            Register Now
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {players.map((p) => (
            <Link
              key={p.id}
              href={`/players/${p.id}`}
              className="card-arcane p-5 hover:bg-void-700/50 transition-all duration-200 group block"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="font-mono text-base text-arcane-100 font-bold group-hover:text-arcane-50 transition-colors">
                    {p.ign}
                  </div>
                  {p.steam_name && (
                    <div className="font-mono text-xs text-arcane-500 mt-0.5">{p.steam_name}</div>
                  )}
                </div>
                <ChevronRight size={16} className="text-arcane-600 group-hover:text-arcane-400 transition-colors mt-0.5 flex-shrink-0" />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <RankBadge rank={p.rank as DotaRank} size="sm" />
                <span className="font-cinzel text-[10px] uppercase tracking-wide text-arcane-500 border border-void-500 px-1.5 py-0.5 rounded-sm">
                  Pos {p.primary_position} — {POSITION_LABELS[p.primary_position as keyof typeof POSITION_LABELS]}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
