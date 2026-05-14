'use client'

import { useState } from 'react'
import {
  ALL_RANKS, DotaRank, DotaPosition, POSITION_LABELS,
  RANK_COLORS, RANK_MMR, BalancerPlayer, BalancedTeams,
} from '@/types'
import { cn, validateSteamId } from '@/lib/utils'
import { RankBadge } from '@/components/ui/RankBadge'
import { Plus, Trash2, Shuffle, Copy, RotateCcw, Star, Brain } from 'lucide-react'
import { toast } from 'sonner'

type Tab = 'balancer' | 'review'

let _id = 0
const uid = () => String(++_id)

const EMPTY_PLAYER = (): BalancerPlayer => ({
  id: uid(), name: '', rank: 'Archon', position: 1,
})

export default function BortyGPTPage() {
  const [tab, setTab] = useState<Tab>('balancer')

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10 animate-slideUp">
        <div className="inline-flex items-center gap-2 mb-4">
          <Brain size={20} className="text-arcane-400" />
          <span className="font-mono text-xs text-arcane-400 tracking-widest uppercase">AI-Powered</span>
        </div>
        <h1 className="font-cinzel font-black text-4xl md:text-5xl text-arcane-100 mb-3">
          BortyGPT
        </h1>
        <p className="font-rajdhani text-lg text-arcane-300/70">
          Your community's AI analyst. Brutally honest. Surprisingly helpful.
        </p>
      </div>

      {/* Tab switcher */}
      <div className="grid grid-cols-2 gap-2 mb-8 p-1 bg-void-900 border border-void-600 rounded-sm max-w-md mx-auto">
        {([
          { id: 'balancer', label: '⚖ Team Balancer' },
          { id: 'review',   label: '★ Player Review' },
        ] as const).map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'py-2.5 font-cinzel text-xs font-bold uppercase tracking-widest transition-all duration-200',
              tab === t.id
                ? 'bg-arcane-700/30 border border-arcane-600/60 text-arcane-100'
                : 'text-arcane-400/50 hover:text-arcane-300'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'balancer' ? <TeamBalancer /> : <PlayerReviewTool />}
    </div>
  )
}

// ── Team Balancer ──────────────────────────────────────────────────────────────

function TeamBalancer() {
  const [players, setPlayers]   = useState<BalancerPlayer[]>([EMPTY_PLAYER(), EMPTY_PLAYER(), EMPTY_PLAYER(), EMPTY_PLAYER(), EMPTY_PLAYER(), EMPTY_PLAYER(), EMPTY_PLAYER(), EMPTY_PLAYER(), EMPTY_PLAYER(), EMPTY_PLAYER()])
  const [result, setResult]     = useState<(BalancedTeams & { commentary?: string | null }) | null>(null)
  const [loading, setLoading]   = useState(false)

  function addPlayer() {
    if (players.length >= 20) return
    setPlayers(p => [...p, EMPTY_PLAYER()])
  }

  function removePlayer(id: string) {
    setPlayers(p => p.filter(x => x.id !== id))
  }

  function updatePlayer(id: string, field: keyof BalancerPlayer, value: unknown) {
    setPlayers(p => p.map(x => x.id === id ? { ...x, [field]: value } : x))
  }

  async function balance() {
    const valid = players.filter(p => p.name.trim())
    if (valid.length < 2) return toast.error('Add at least 2 named players')

    setLoading(true)
    try {
      const res = await fetch('/api/bortygpt/balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ players: valid, withCommentary: valid.length >= 6 }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data)
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Balance failed')
    } finally {
      setLoading(false)
    }
  }

  function copyToClipboard() {
    if (!result) return
    const text = [
      '⚔ SECRETLEAGUE TEAM DRAFT ⚔',
      '',
      '🌿 RADIANT:',
      ...result.radiant.map(p => `  ${p.name} (${p.rank}, Pos ${p.position})`),
      `  Avg MMR: ~${result.radiant_avg_mmr.toLocaleString()}`,
      '',
      '🔥 DIRE:',
      ...result.dire.map(p => `  ${p.name} (${p.rank}, Pos ${p.position})`),
      `  Avg MMR: ~${result.dire_avg_mmr.toLocaleString()}`,
      '',
      `Balance: ${result.balance_score}/100 — ${result.balance_label}`,
      result.commentary ? `\nBortyGPT: ${result.commentary}` : '',
    ].join('\n')

    navigator.clipboard.writeText(text).then(() => toast.success('Copied to clipboard!'))
  }

  return (
    <div className="space-y-4">
      {/* Player list */}
      <div className="card-arcane p-6">
        <div className="section-label">Players</div>
        <div className="space-y-2">
          {players.map((p, i) => (
            <div key={p.id} className="grid grid-cols-[28px_1fr_140px_120px_32px] gap-2 items-center animate-fadeIn">
              {/* Number */}
              <div className="w-7 h-7 rounded-full bg-arcane-800 border border-arcane-700/50
                              flex items-center justify-center font-cinzel text-[10px] text-arcane-400">
                {i + 1}
              </div>
              {/* Name */}
              <input
                className="input-arcane"
                placeholder="Player name"
                value={p.name}
                onChange={e => updatePlayer(p.id, 'name', e.target.value)}
              />
              {/* Rank */}
              <select
                className="input-arcane font-cinzel text-xs"
                value={p.rank}
                onChange={e => updatePlayer(p.id, 'rank', e.target.value)}
              >
                {ALL_RANKS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              {/* Position */}
              <select
                className="input-arcane font-cinzel text-xs"
                value={p.position}
                onChange={e => updatePlayer(p.id, 'position', Number(e.target.value))}
              >
                {([1,2,3,4,5] as DotaPosition[]).map(pos => (
                  <option key={pos} value={pos}>Pos {pos}</option>
                ))}
              </select>
              {/* Remove */}
              <button
                onClick={() => removePlayer(p.id)}
                className="w-8 h-8 rounded-full border border-void-500 text-arcane-500
                           hover:border-dire hover:text-dire transition-colors flex items-center justify-center"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>

        {players.length < 20 && (
          <button
            onClick={addPlayer}
            className="mt-3 w-full py-2.5 border border-dashed border-void-500 rounded-sm
                       font-cinzel text-xs text-arcane-500 hover:border-arcane-600 hover:text-arcane-400
                       transition-all flex items-center justify-center gap-2"
          >
            <Plus size={12} /> Add Player
          </button>
        )}

        <button
          onClick={balance}
          disabled={loading}
          className="btn-primary w-full mt-6 py-4"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-arcane-400 border-t-transparent rounded-full animate-spin" />
              Balancing…
            </>
          ) : (
            <>⚖ Balance Teams ⚖</>
          )}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="card-arcane p-6 animate-slideUp">
          <div className="section-label">Draft Result</div>

          {result.commentary && (
            <div className="mb-6 p-4 border border-arcane-700/30 rounded-sm bg-arcane-900/20">
              <div className="flex gap-2">
                <Brain size={14} className="text-arcane-400 flex-shrink-0 mt-0.5" />
                <p className="font-rajdhani text-sm text-arcane-200/80 italic">
                  {result.commentary}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Radiant */}
            <div className="border border-radiant/20 rounded-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-radiant/20 bg-radiant/5 flex justify-between items-center">
                <span className="font-cinzel font-bold text-sm text-radiant">🌿 Radiant</span>
                <span className="font-mono text-xs text-arcane-400">~{result.radiant_avg_mmr.toLocaleString()} MMR</span>
              </div>
              {result.radiant.map(p => (
                <PlayerRow key={p.id} player={p} />
              ))}
            </div>

            {/* Dire */}
            <div className="border border-dire/20 rounded-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-dire/20 bg-dire/5 flex justify-between items-center">
                <span className="font-cinzel font-bold text-sm text-dire">🔥 Dire</span>
                <span className="font-mono text-xs text-arcane-400">~{result.dire_avg_mmr.toLocaleString()} MMR</span>
              </div>
              {result.dire.map(p => (
                <PlayerRow key={p.id} player={p} />
              ))}
            </div>
          </div>

          {/* Balance meter */}
          <div className="border border-void-500 rounded-sm p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-cinzel text-xs text-arcane-400 uppercase tracking-widest">Balance Score</span>
              <span className="font-mono text-xs text-arcane-300">{result.balance_label}</span>
            </div>
            <div className="h-2 bg-void-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${result.balance_score}%`,
                  background: `hsl(${result.balance_score * 1.2}, 70%, 55%)`,
                }}
              />
            </div>
            <div className="text-center mt-2 font-cinzel font-bold text-2xl text-arcane-200">
              {result.balance_score}/100
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button onClick={balance} className="btn-ghost text-xs py-2 flex-1">
              <Shuffle size={13} /> Re-roll
            </button>
            <button onClick={copyToClipboard} className="btn-ghost text-xs py-2 flex-1">
              <Copy size={13} /> Copy to Discord
            </button>
            <button onClick={() => setResult(null)} className="btn-ghost text-xs py-2 flex-1">
              <RotateCcw size={13} /> Reset
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function PlayerRow({ player }: { player: BalancerPlayer }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 border-b border-void-700/40 last:border-0 hover:bg-void-700/20 transition-colors">
      <div
        className="w-6 h-6 rounded-full border border-void-500 flex-shrink-0
                   flex items-center justify-center font-cinzel text-[10px] font-bold"
        style={{ color: RANK_COLORS[player.rank] }}
      >
        {player.position}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-mono text-sm text-arcane-100 truncate">{player.name}</div>
        <div className="font-cinzel text-[10px]" style={{ color: RANK_COLORS[player.rank] }}>
          {player.rank}
        </div>
      </div>
      <div className="font-mono text-xs text-arcane-500">
        {(RANK_MMR[player.rank] / 1000).toFixed(1)}k
      </div>
    </div>
  )
}

// ── Player Review Tool ─────────────────────────────────────────────────────────

function PlayerReviewTool() {
  const [steamId, setSteamId] = useState('')
  const [ign, setIgn]         = useState('')
  const [rank, setRank]       = useState<DotaRank>('Archon')
  const [loading, setLoading] = useState(false)
  const [review, setReview]   = useState<null | {
    review: string
    strengths: string[]
    weaknesses: string[]
    hero_suggestions: string[]
    borty_rating: number
    catchphrase: string
    win_rate: number | null
    avg_kda: { k: string; d: string; a: string } | null
  }>(null)

  async function getReview() {
    if (!ign.trim())              return toast.error('Enter an IGN')
    if (!validateSteamId(steamId)) return toast.error('Steam ID must be 17 digits')

    setLoading(true)
    try {
      const res = await fetch('/api/bortygpt/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ steam_id: steamId, ign, rank }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setReview(data)
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Review failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="card-arcane p-6">
        <div className="section-label">Get Your BortyGPT Review</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-cinzel text-xs font-bold uppercase tracking-widest text-arcane-400/80 mb-1.5">
              IGN <span className="text-ember-400">*</span>
            </label>
            <input className="input-arcane" placeholder="Your in-game name" value={ign} onChange={e => setIgn(e.target.value)} />
          </div>
          <div>
            <label className="block font-cinzel text-xs font-bold uppercase tracking-widest text-arcane-400/80 mb-1.5">
              Steam ID (17 digits) <span className="text-ember-400">*</span>
            </label>
            <input
              className="input-arcane"
              placeholder="76561198..."
              value={steamId}
              maxLength={17}
              onChange={e => setSteamId(e.target.value.replace(/\D/g, ''))}
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block font-cinzel text-xs font-bold uppercase tracking-widest text-arcane-400/80 mb-2">
            Rank
          </label>
          <div className="flex flex-wrap gap-2">
            {ALL_RANKS.map(r => (
              <button
                key={r}
                onClick={() => setRank(r)}
                className={cn(
                  'px-3 py-1.5 border rounded-sm font-cinzel text-xs font-bold uppercase transition-all',
                  rank === r ? 'border-arcane-500 bg-arcane-800/30 text-arcane-200' : 'border-void-500 text-arcane-500 hover:border-arcane-700'
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <button onClick={getReview} disabled={loading} className="btn-primary w-full py-4">
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-arcane-400 border-t-transparent rounded-full animate-spin" />
              BortyGPT is thinking…
            </>
          ) : (
            <>★ Generate BortyGPT Review ★</>
          )}
        </button>
      </div>

      {review && (
        <div className="card-arcane p-6 animate-slideUp space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-cinzel font-bold text-xl text-arcane-100">{ign}</h2>
              <RankBadge rank={rank} className="mt-1" />
            </div>
            <div className="text-center flex-shrink-0">
              <div className="font-cinzel font-black text-4xl text-arcane-200">
                {review.borty_rating}
              </div>
              <div className="font-mono text-[10px] text-arcane-500 uppercase tracking-widest">/10</div>
              <div className="flex gap-0.5 mt-1 justify-center">
                {[...Array(10)].map((_, i) => (
                  <Star
                    key={i}
                    size={8}
                    className={i < review.borty_rating ? 'text-gold-200' : 'text-void-500'}
                    fill={i < review.borty_rating ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          {(review.win_rate !== null || review.avg_kda) && (
            <div className="flex gap-4 flex-wrap">
              {review.win_rate !== null && (
                <div className="card-arcane px-4 py-2 text-center">
                  <div className="font-cinzel font-bold text-lg text-arcane-100">{review.win_rate}%</div>
                  <div className="font-mono text-[10px] text-arcane-500">Win Rate (10 games)</div>
                </div>
              )}
              {review.avg_kda && (
                <div className="card-arcane px-4 py-2 text-center">
                  <div className="font-cinzel font-bold text-lg text-arcane-100">
                    {review.avg_kda.k}/{review.avg_kda.d}/{review.avg_kda.a}
                  </div>
                  <div className="font-mono text-[10px] text-arcane-500">Avg KDA (10 games)</div>
                </div>
              )}
            </div>
          )}

          {/* Catchphrase */}
          <div className="border-l-2 border-arcane-600 pl-4 py-1">
            <p className="font-cinzel text-sm italic text-arcane-300">"{review.catchphrase}"</p>
          </div>

          {/* Main review */}
          <p className="font-rajdhani text-base text-arcane-200/80 leading-relaxed">
            {review.review}
          </p>

          {/* Strengths & weaknesses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="section-label text-rune-400" style={{ color: '#6fcf97' }}>
                Strengths
              </div>
              <ul className="space-y-2">
                {review.strengths.map((s, i) => (
                  <li key={i} className="flex gap-2 font-rajdhani text-sm text-arcane-200">
                    <span className="text-radiant mt-0.5">✓</span> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="section-label" style={{ color: '#eb5757' }}>
                Weaknesses
              </div>
              <ul className="space-y-2">
                {review.weaknesses.map((w, i) => (
                  <li key={i} className="flex gap-2 font-rajdhani text-sm text-arcane-200">
                    <span className="text-dire mt-0.5">✗</span> {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Hero suggestions */}
          <div>
            <div className="section-label">Hero Suggestions</div>
            <div className="flex gap-2 flex-wrap">
              {review.hero_suggestions.map((h, i) => (
                <span key={i} className="px-3 py-1 border border-arcane-700/40 rounded-sm
                                         font-cinzel text-xs text-arcane-300 bg-arcane-900/20">
                  {h}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
