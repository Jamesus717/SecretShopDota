import { createAdminClient } from '@/lib/supabase'
import { TournamentTeam, TournamentMatch } from '@/types'
import { Trophy, Calendar } from 'lucide-react'

export const revalidate = 60

async function getBracketData() {
  try {
    const supabase = createAdminClient()
    const [{ data: teams }, { data: matches }] = await Promise.all([
      supabase.from('tournament_teams').select('*').order('points', { ascending: false }),
      supabase.from('tournament_matches').select('*').order('scheduled_at'),
    ])
    return {
      teams:   (teams   ?? []) as TournamentTeam[],
      matches: (matches ?? []) as TournamentMatch[],
    }
  } catch {
    return { teams: [], matches: [] }
  }
}

export default async function BracketPage() {
  const { teams, matches } = await getBracketData()

  const groupA    = teams.filter(t => t.group === 'A')
  const groupB    = teams.filter(t => t.group === 'B')
  const semis     = matches.filter(m => m.round === 'semi')
  const grandFinal = matches.filter(m => m.round === 'grand_final')

  const isEmpty = teams.length === 0

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12 animate-slideUp">
        <div className="section-label justify-center">SecretLeague Season I</div>
        <h1 className="font-cinzel font-black text-4xl md:text-5xl text-arcane-100 mb-3">
          Tournament Bracket
        </h1>
        <p className="font-rajdhani text-arcane-300/70">
          Group stage → Semifinals → Grand Final
        </p>
      </div>

      {isEmpty ? (
        <div className="card-arcane p-16 text-center">
          <Trophy size={48} className="text-arcane-600 mx-auto mb-4" />
          <h2 className="font-cinzel text-xl text-arcane-400 mb-2">
            Bracket Not Yet Set
          </h2>
          <p className="font-rajdhani text-arcane-500">
            The bracket will be seeded once registrations close. Check back soon.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 text-arcane-600 font-mono text-xs">
            <Calendar size={14} />
            Tournament starts August 2026
          </div>
        </div>
      ) : (
        <>
          {/* Group Stage */}
          {(groupA.length > 0 || groupB.length > 0) && (
            <section className="mb-12">
              <div className="section-label">Group Stage</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[{ label: 'Group A', teams: groupA }, { label: 'Group B', teams: groupB }].map(({ label, teams: groupTeams }) => (
                  groupTeams.length > 0 && (
                    <div key={label} className="card-arcane overflow-hidden">
                      <div className="px-5 py-3 border-b border-arcane-700/30 bg-arcane-900/20">
                        <h3 className="font-cinzel font-bold text-sm text-arcane-200">{label}</h3>
                      </div>
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-void-600">
                            <th className="px-5 py-2 text-left font-cinzel text-[10px] uppercase tracking-widest text-arcane-500">Team</th>
                            <th className="px-3 py-2 text-center font-cinzel text-[10px] uppercase tracking-widest text-arcane-500">W</th>
                            <th className="px-3 py-2 text-center font-cinzel text-[10px] uppercase tracking-widest text-arcane-500">L</th>
                            <th className="px-3 py-2 text-center font-cinzel text-[10px] uppercase tracking-widest text-arcane-500">Pts</th>
                          </tr>
                        </thead>
                        <tbody>
                          {groupTeams.map((team, i) => (
                            <tr key={team.id} className={`border-b border-void-700/40 last:border-0 ${i < 2 ? 'bg-rune-900/10' : ''}`}>
                              <td className="px-5 py-3">
                                <div className="flex items-center gap-2">
                                  {i < 2 && <div className="w-1 h-4 bg-rune-500 rounded-full" />}
                                  <span className="font-mono text-sm text-arcane-100">{team.name}</span>
                                </div>
                              </td>
                              <td className="px-3 py-3 text-center font-mono text-sm text-radiant">{team.wins}</td>
                              <td className="px-3 py-3 text-center font-mono text-sm text-dire">{team.losses}</td>
                              <td className="px-3 py-3 text-center font-cinzel text-sm font-bold text-arcane-200">{team.points}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="px-5 py-2 border-t border-void-700/40">
                        <span className="font-mono text-[10px] text-rune-500">↑ Top 2 advance to semifinals</span>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </section>
          )}

          {/* Semifinals */}
          {semis.length > 0 && (
            <section className="mb-12">
              <div className="section-label">Semifinals (Bo3)</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {semis.map(match => <MatchCard key={match.id} match={match} />)}
              </div>
            </section>
          )}

          {/* Grand Final */}
          {grandFinal.length > 0 && (
            <section>
              <div className="section-label">Grand Final (Bo3)</div>
              <div className="max-w-md mx-auto">
                {grandFinal.map(match => <MatchCard key={match.id} match={match} highlight />)}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}

function MatchCard({ match, highlight }: { match: TournamentMatch; highlight?: boolean }) {
  const played = match.winner_id !== null
  const dateStr = match.scheduled_at
    ? new Date(match.scheduled_at).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
    : 'TBD'

  return (
    <div className={`card-arcane p-5 ${highlight ? 'border-gold-600/30' : ''}`}>
      {highlight && (
        <div className="flex items-center gap-2 mb-4">
          <Trophy size={14} className="text-gold-200" />
          <span className="font-cinzel text-xs text-gold-200 uppercase tracking-widest">Grand Final</span>
        </div>
      )}

      <div className="flex items-center gap-4">
        <TeamResult
          name={match.team_a_name}
          score={match.team_a_score}
          won={match.winner_id === match.team_a_id}
          played={played}
        />
        <div className="font-cinzel text-sm text-arcane-600 font-bold">VS</div>
        <TeamResult
          name={match.team_b_name}
          score={match.team_b_score}
          won={match.winner_id === match.team_b_id}
          played={played}
        />
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-void-700/40">
        <span className="font-mono text-[10px] text-arcane-500">{dateStr}</span>
        {match.dotabuff_link && (
          <a href={match.dotabuff_link} target="_blank" rel="noopener noreferrer"
            className="font-mono text-[10px] text-arcane-400 hover:text-arcane-200 transition-colors">
            Dotabuff →
          </a>
        )}
      </div>
    </div>
  )
}

function TeamResult({ name, score, won, played }: {
  name: string; score: number | null; won: boolean; played: boolean
}) {
  return (
    <div className={`flex-1 text-center p-3 rounded-sm ${played && won ? 'bg-rune-900/20 border border-rune-700/30' : 'border border-void-600'}`}>
      <div className={`font-mono text-sm font-bold mb-1 ${played && won ? 'text-radiant' : 'text-arcane-300'}`}>
        {name}
      </div>
      {score !== null && (
        <div className="font-cinzel font-black text-2xl text-arcane-100">{score}</div>
      )}
    </div>
  )
}
