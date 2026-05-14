'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ALL_RANKS, DotaRank, DotaPosition, POSITION_LABELS, RANK_COLORS } from '@/types'
import { validateSteamId, cn } from '@/lib/utils'
import { RankBadge } from '@/components/ui/RankBadge'
import { Sword, Shield, ChevronRight, Plus, Trash2, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

function RegistrationForm() {
  const searchParams = useSearchParams()
  const [mode, setMode]       = useState<'solo' | 'team'>(
    searchParams.get('mode') === 'team' ? 'team' : 'solo'
  )
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)

  // Solo fields
  const [ign, setIgn]                     = useState('')
  const [steamId, setSteamId]             = useState('')
  const [steamName, setSteamName]         = useState('')
  const [discord, setDiscord]             = useState('')
  const [rank, setRank]                   = useState<DotaRank | null>(null)
  const [position, setPosition]           = useState<DotaPosition | null>(null)
  const [secondaryPos, setSecondaryPos]   = useState<DotaPosition | null>(null)

  // Team fields
  const [teamName, setTeamName] = useState('')
  const [players, setPlayers]   = useState([
    { ign: '', steamId: '', discord: '', rank: null as DotaRank | null, position: null as DotaPosition | null },
    { ign: '', steamId: '', discord: '', rank: null as DotaRank | null, position: null as DotaPosition | null },
    { ign: '', steamId: '', discord: '', rank: null as DotaRank | null, position: null as DotaPosition | null },
    { ign: '', steamId: '', discord: '', rank: null as DotaRank | null, position: null as DotaPosition | null },
    { ign: '', steamId: '', discord: '', rank: null as DotaRank | null, position: null as DotaPosition | null },
  ])

  function updatePlayer(i: number, field: string, value: unknown) {
    setPlayers((prev) => prev.map((p, idx) => idx === i ? { ...p, [field]: value } : p))
  }

  async function handleSoloSubmit() {
    if (!ign.trim())              return toast.error('IGN is required')
    if (!validateSteamId(steamId)) return toast.error('Steam ID must be 17 digits')
    if (!rank)                    return toast.error('Please select your rank')
    if (!position)                return toast.error('Please select your primary position')

    setLoading(true)
    try {
      const res = await fetch('/api/register/solo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ign, steam_id: steamId, steam_name: steamName, discord_username: discord, rank, primary_position: position, secondary_position: secondaryPos }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Registration failed')
      setSubmitted(true)
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function handleTeamSubmit() {
    if (!teamName.trim()) return toast.error('Team name is required')
    for (let i = 0; i < 5; i++) {
      const p = players[i]
      if (!p.ign.trim())              return toast.error(`Player ${i + 1}: IGN required`)
      if (!validateSteamId(p.steamId)) return toast.error(`Player ${i + 1}: Invalid Steam ID`)
      if (!p.rank)                    return toast.error(`Player ${i + 1}: Select rank`)
      if (!p.position)                return toast.error(`Player ${i + 1}: Select position`)
    }

    setLoading(true)
    try {
      const res = await fetch('/api/register/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team_name: teamName, players }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Registration failed')
      setSubmitted(true)
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="card-arcane max-w-xl mx-auto p-12 text-center animate-slideUp">
        <div className="flex justify-center mb-6">
          <CheckCircle size={64} className="text-rune-400 animate-float" />
        </div>
        <h2 className="font-cinzel font-bold text-2xl text-arcane-100 mb-3">
          Registration Received
        </h2>
        <p className="font-rajdhani text-arcane-300/70 text-lg mb-6">
          Your entry has been submitted to SecretLeague.
          Check the Discord for confirmation and further updates.
        </p>
        <a
          href="https://discord.gg/WFddEyeMeg"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-rune text-sm"
        >
          Go to Discord
          <ChevronRight size={14} />
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Mode toggle */}
      <div className="grid grid-cols-2 gap-2 mb-8 p-1 bg-void-900 border border-void-600 rounded-sm">
        {(['solo', 'team'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              'flex items-center justify-center gap-2 py-3 font-cinzel text-xs font-bold uppercase tracking-widest transition-all duration-200',
              mode === m
                ? 'bg-arcane-700/30 border border-arcane-600/60 text-arcane-100'
                : 'text-arcane-400/50 hover:text-arcane-300'
            )}
          >
            {m === 'solo' ? <Sword size={14} /> : <Shield size={14} />}
            {m === 'solo' ? 'Solo Entry' : 'Team Entry'}
          </button>
        ))}
      </div>

      {mode === 'solo' ? (
        <div className="card-arcane p-6 md:p-8 space-y-6 animate-fadeIn">
          <div className="section-label">Player Info</div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="In-Game Name" required>
              <input className="input-arcane" placeholder="e.g. Borty" value={ign} onChange={e => setIgn(e.target.value)} />
            </Field>
            <Field label="Steam Display Name">
              <input className="input-arcane" placeholder="Steam profile name" value={steamName} onChange={e => setSteamName(e.target.value)} />
            </Field>
            <Field label="Steam ID (17 digits)" required>
              <input
                className="input-arcane"
                placeholder="76561198..."
                value={steamId}
                maxLength={17}
                onChange={e => setSteamId(e.target.value.replace(/\D/g, ''))}
              />
            </Field>
            <Field label="Discord Username">
              <input className="input-arcane" placeholder="username" value={discord} onChange={e => setDiscord(e.target.value)} />
            </Field>
          </div>

          <div className="section-label">Rank</div>
          <RankSelector value={rank} onChange={setRank} />

          <div className="section-label">Primary Position</div>
          <PositionSelector value={position} onChange={setPosition} />

          <div className="section-label">Secondary Position <span className="text-arcane-500 font-normal normal-case tracking-normal">(optional)</span></div>
          <PositionSelector value={secondaryPos} onChange={setSecondaryPos} exclude={position ?? undefined} />

          <button
            className="btn-primary w-full py-4 mt-4 text-sm"
            onClick={handleSoloSubmit}
            disabled={loading}
          >
            {loading ? 'Submitting…' : '⚔ Submit Solo Entry ⚔'}
          </button>
        </div>
      ) : (
        <div className="space-y-4 animate-fadeIn">
          <div className="card-arcane p-6 md:p-8">
            <div className="section-label">Team Name</div>
            <Field label="Team Name" required>
              <input className="input-arcane" placeholder="e.g. The Cursed Ones" value={teamName} onChange={e => setTeamName(e.target.value)} />
            </Field>
          </div>

          {players.map((p, i) => (
            <div key={i} className="card-arcane p-6 md:p-8">
              <div className="section-label">
                {i === 0 ? '★ Captain — ' : ''}Player {i + 1}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <Field label="In-Game Name" required>
                  <input className="input-arcane" placeholder="IGN" value={p.ign} onChange={e => updatePlayer(i, 'ign', e.target.value)} />
                </Field>
                <Field label="Steam ID" required>
                  <input className="input-arcane" placeholder="76561198..." value={p.steamId} maxLength={17} onChange={e => updatePlayer(i, 'steamId', e.target.value.replace(/\D/g, ''))} />
                </Field>
                <Field label="Discord">
                  <input className="input-arcane" placeholder="username" value={p.discord} onChange={e => updatePlayer(i, 'discord', e.target.value)} />
                </Field>
              </div>
              <div className="mb-4">
                <div className="section-label">Rank</div>
                <RankSelector value={p.rank} onChange={v => updatePlayer(i, 'rank', v)} />
              </div>
              <div>
                <div className="section-label">Position</div>
                <PositionSelector value={p.position} onChange={v => updatePlayer(i, 'position', v)} />
              </div>
            </div>
          ))}

          <button
            className="btn-rune w-full py-4 text-sm"
            onClick={handleTeamSubmit}
            disabled={loading}
          >
            {loading ? 'Submitting…' : '🛡 Submit Team Entry 🛡'}
          </button>
        </div>
      )}
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-cinzel text-xs font-bold uppercase tracking-widest text-arcane-400/80 mb-1.5">
        {label} {required && <span className="text-ember-400">*</span>}
      </label>
      {children}
    </div>
  )
}

function RankSelector({ value, onChange }: { value: DotaRank | null; onChange: (r: DotaRank) => void }) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
      {ALL_RANKS.map((r) => (
        <button
          key={r}
          onClick={() => onChange(r)}
          className={cn(
            'flex flex-col items-center gap-1.5 p-2 border rounded-sm transition-all duration-200 group',
            value === r
              ? 'border-arcane-500 bg-arcane-800/30'
              : 'border-void-500 hover:border-arcane-700'
          )}
        >
          <img
            src={`/assets/ranks/${r.toLowerCase()}.png`}
            alt={r}
            className="w-9 h-9 object-contain"
            style={{ filter: `drop-shadow(0 0 10px ${RANK_COLORS[r]}40)` }}
          />
          <span className={cn(
            'font-cinzel text-[9px] font-bold uppercase leading-tight text-center',
            value === r ? 'text-arcane-200' : 'text-arcane-400/50 group-hover:text-arcane-400'
          )}>
            {r}
          </span>
        </button>
      ))}
    </div>
  )
}

function PositionSelector({
  value,
  onChange,
  exclude,
}: {
  value: DotaPosition | null
  onChange: (p: DotaPosition | null) => void
  exclude?: DotaPosition
}) {
  const positions: DotaPosition[] = [1, 2, 3, 4, 5]
  return (
    <div className="flex flex-wrap gap-2">
      {positions.map((pos) => (
        <button
          key={pos}
          onClick={() => onChange(value === pos ? null : pos)}
          disabled={pos === exclude}
          className={cn(
            'flex items-center gap-2 px-4 py-2 border rounded-sm font-cinzel text-xs font-bold uppercase tracking-wide transition-all duration-200',
            pos === exclude
              ? 'opacity-20 cursor-not-allowed border-void-600 text-arcane-500'
              : value === pos
              ? 'border-arcane-500 bg-arcane-800/30 text-arcane-200'
              : 'border-void-500 text-arcane-400/60 hover:border-arcane-700 hover:text-arcane-300'
          )}
        >
          <span className="text-arcane-600">{pos}</span>
          {POSITION_LABELS[pos]}
        </button>
      ))}
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function RegisterPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12 animate-slideUp">
        <div className="section-label justify-center">SecretLeague Season I</div>
        <h1 className="font-cinzel font-black text-4xl md:text-5xl text-arcane-100 mb-4">
          Tournament Registration
        </h1>
        <p className="font-rajdhani text-lg text-arcane-300/70 max-w-lg mx-auto">
          Enter as a solo player and we will seed you into a team, or bring your full 5-stack.
          All ranks welcome.
        </p>
      </div>

      <Suspense fallback={<div className="text-center text-arcane-400 font-mono">Loading…</div>}>
        <RegistrationForm />
      </Suspense>
    </div>
  )
}
