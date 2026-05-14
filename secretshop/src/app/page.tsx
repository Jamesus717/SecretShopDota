import Link from 'next/link'
import { Countdown } from '@/components/ui/Countdown'
import { Sword, Users, Brain, Trophy, ChevronRight, Zap } from 'lucide-react'

const TOURNAMENT_DATE     = process.env.NEXT_PUBLIC_TOURNAMENT_DATE     ?? '2026-08-01T18:00:00Z'
const REGISTRATION_DEADLINE = process.env.NEXT_PUBLIC_REGISTRATION_DEADLINE ?? '2026-07-25T23:59:59Z'

const features = [
  {
    icon: Brain,
    title: 'BortyGPT',
    desc: 'AI-powered post-game reviews, player scouting reports, and brutally honest coaching — powered by Claude.',
    color: 'text-arcane-300',
    border: 'border-arcane-600/35',
  },
  {
    icon: Sword,
    title: 'SecretLeague',
    desc: 'Structured in-house tournament with proper seeding, scheduling, and scorekeeping. Solo or full 5-stack.',
    color: 'text-rune-300',
    border: 'border-rune-600/35',
  },
  {
    icon: Users,
    title: 'Team Balancer',
    desc: 'Fair MMR-based team balancing for in-house lobbies. No more lopsided stomps.',
    color: 'text-gold-200',
    border: 'border-gold-600/35',
  },
  {
    icon: Trophy,
    title: 'Player Profiles',
    desc: 'Connect your Steam ID and get a full breakdown — hero pool, win rates, and your BortyGPT scouting report.',
    color: 'text-ember-400',
    border: 'border-ember-500/35',
  },
]

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="text-center mb-20 animate-slideUp">

        {/* Season badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8
                        border border-gold-600/40 rounded-sm bg-gold-900/20">
          <Zap size={12} className="text-gold-300" />
          <span className="font-mono text-xs text-gold-300 tracking-widest uppercase">
            Season I — Registrations Open
          </span>
          <Zap size={12} className="text-gold-300" />
        </div>

        {/* Main title */}
        <h1 className="font-display font-black text-6xl md:text-8xl lg:text-[100px]
                        text-arcane-100 leading-none tracking-tight mb-4
                        text-glow-arcane">
          SECRET
          <br />
          <span className="text-gold-200">LEAGUE</span>
        </h1>

        <div className="diamond-divider max-w-sm mx-auto">
          <div className="w-2 h-2 bg-gold-300 rotate-45 flex-shrink-0" />
        </div>

        <p className="font-rajdhani text-xl md:text-2xl text-arcane-200/70 max-w-2xl mx-auto mb-10">
          Your favourite item shop, now a tournament.
          <br />
          Real games. Real teammates. Real improvement.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/register" className="btn-primary text-sm py-3 px-8 w-full sm:w-auto">
            <Sword size={16} />
            Sign Up for Season I
          </Link>
          <a
            href="https://discord.gg/WFddEyeMeg"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost text-sm py-3 px-8 w-full sm:w-auto"
          >
            Join the Discord
            <ChevronRight size={14} />
          </a>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-16">
          {[
            { value: '10', label: 'Teams Max' },
            { value: 'AUG', label: '2026 Start' },
            { value: '5v5', label: 'Format' },
            { value: 'ALL', label: 'Ranks Welcome' },
          ].map((stat) => (
            <div key={stat.label} className="card-arcane p-4 text-center">
              <div className="font-cinzel font-black text-2xl text-arcane-200 leading-none mb-1">
                {stat.value}
              </div>
              <div className="font-mono text-[10px] text-arcane-400/60 tracking-widest uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Countdown */}
        <div className="card-arcane max-w-lg mx-auto p-8">
          <Countdown targetDate={TOURNAMENT_DATE} label="Season I Begins In" />
        </div>
      </section>

      {/* ── Registration deadline banner ───────────────────────────── */}
      <section className="mb-20">
        <div className="relative border border-rune-700/40 rounded-sm p-6 md:p-8
                        bg-rune-900/10 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px
                          bg-gradient-to-r from-transparent via-rune-500/60 to-transparent" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-cinzel font-bold text-xl text-rune-200 mb-2">
                Registration Closes Soon
              </h2>
              <p className="font-rajdhani text-arcane-300/70">
                Sign up as a solo player or with your full 5-stack before the deadline.
                <br />All ranks are welcome — we have brackets for everyone.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Countdown
                targetDate={REGISTRATION_DEADLINE}
                label="Sign-ups Close In"
              />
            </div>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link href="/register?mode=solo" className="btn-rune text-sm py-2.5 px-6">
              <Sword size={14} />
              Solo Entry
            </Link>
            <Link href="/register?mode=team" className="btn-ghost text-sm py-2.5 px-6">
              <Users size={14} />
              Team Entry
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────── */}
      <section className="mb-20">
        <div className="section-label">What We Offer</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className={`card-arcane p-6 border ${f.border} transition-all duration-300
                          hover:bg-void-700/50 group`}
            >
              <div className="flex items-start gap-4">
                <div className={`mt-0.5 ${f.color}`}>
                  <f.icon size={22} />
                </div>
                <div>
                  <h3 className={`font-cinzel font-bold text-base mb-2 ${f.color}`}>
                    {f.title}
                  </h3>
                  <p className="font-rajdhani text-arcane-300/70 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Format overview ────────────────────────────────────────── */}
      <section className="mb-20">
        <div className="section-label">Tournament Format</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              phase: 'Group Stage',
              detail: '2 groups of 5 teams — round-robin Bo1 within each group.',
              sub: 'Top 2 from each group advance',
            },
            {
              phase: 'Semifinals',
              detail: '1st vs 2nd cross-group matchups — Best of 3.',
              sub: 'Winners advance to Grand Final',
            },
            {
              phase: 'Grand Final',
              detail: 'Best of 3 — the last two teams left standing.',
              sub: 'Champions crowned, glory achieved',
            },
          ].map((stage, i) => (
            <div key={stage.phase} className="card-arcane p-6">
              <div className="font-mono text-xs text-gold-400 mb-2">
                STAGE {i + 1}
              </div>
              <h3 className="font-cinzel font-bold text-arcane-200 mb-3">
                {stage.phase}
              </h3>
              <p className="font-rajdhani text-arcane-300/70 text-sm mb-2">
                {stage.detail}
              </p>
              <p className="font-mono text-xs text-arcane-500">
                {stage.sub}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Discord CTA ────────────────────────────────────────────── */}
      <section>
        <div className="card-arcane p-10 text-center">
          <h2 className="font-cinzel font-bold text-3xl text-arcane-100 mb-4">
            Join the Community
          </h2>
          <p className="font-rajdhani text-arcane-300/70 text-lg max-w-lg mx-auto mb-8">
            All coordination, match scheduling, and BortyGPT announcements happen in Discord.
            First stop before signing up.
          </p>
          <a
            href="https://discord.gg/WFddEyeMeg"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex text-sm py-3 px-10"
            style={{ backgroundColor: 'rgba(88,101,242,0.15)', borderColor: '#5865F2' }}
          >
            <svg width="18" height="14" viewBox="0 0 71 55" fill="currentColor" className="text-[#5865F2]">
              <path d="M60.1 4.9A58.5 58.5 0 0 0 45.6.7a.2.2 0 0 0-.2.1 40.7 40.7 0 0 0-1.8 3.7 54 54 0 0 0-16.2 0A37.5 37.5 0 0 0 25.6.8a.2.2 0 0 0-.2-.1A58.3 58.3 0 0 0 10.9 4.9a.2.2 0 0 0-.1.1C1.6 18.7-1 32.2.3 45.5a.2.2 0 0 0 .1.2 58.8 58.8 0 0 0 17.7 9 .2.2 0 0 0 .2-.1 42 42 0 0 0 3.6-5.9.2.2 0 0 0-.1-.3 38.7 38.7 0 0 1-5.5-2.6.2.2 0 0 1 0-.4l1.1-.9a.2.2 0 0 1 .2 0c11.5 5.3 24 5.3 35.4 0a.2.2 0 0 1 .2 0l1.1.9a.2.2 0 0 1 0 .4 36.1 36.1 0 0 1-5.5 2.6.2.2 0 0 0-.1.3 47.1 47.1 0 0 0 3.6 5.9.2.2 0 0 0 .2.1 58.6 58.6 0 0 0 17.8-9 .2.2 0 0 0 .1-.2C73 30.1 69.3 16.7 60.2 5a.2.2 0 0 0-.1-.1zM23.7 37.8c-3.5 0-6.4-3.2-6.4-7.2s2.8-7.2 6.4-7.2c3.6 0 6.5 3.3 6.4 7.2 0 4-2.8 7.2-6.4 7.2zm23.7 0c-3.5 0-6.4-3.2-6.4-7.2s2.8-7.2 6.4-7.2c3.6 0 6.5 3.3 6.4 7.2 0 4-2.8 7.2-6.4 7.2z"/>
            </svg>
            Join the Discord
          </a>
        </div>
      </section>
    </div>
  )
}
