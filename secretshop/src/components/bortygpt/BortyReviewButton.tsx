'use client'

import { useState } from 'react'
import { DotaRank, RANK_COLORS } from '@/types'
import { Brain, Star } from 'lucide-react'
import { RankBadge } from '@/components/ui/RankBadge'
import { toast } from 'sonner'

interface Props {
  steamId: string
  ign: string
  rank: DotaRank
}

interface ReviewResult {
  review: string
  strengths: string[]
  weaknesses: string[]
  hero_suggestions: string[]
  borty_rating: number
  catchphrase: string
  win_rate: number | null
  avg_kda: { k: string; d: string; a: string } | null
}

export function BortyReviewButton({ steamId, ign, rank }: Props) {
  const [loading, setLoading] = useState(false)
  const [review, setReview]   = useState<ReviewResult | null>(null)

  async function generate() {
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

  if (!review) {
    return (
      <div className="text-center py-6">
        <Brain size={32} className="text-arcane-600 mx-auto mb-4" />
        <p className="font-rajdhani text-arcane-400 mb-6">
          Get an AI-powered scouting report on {ign} — strengths, weaknesses, hero picks, and a Borty rating.
        </p>
        <button
          onClick={generate}
          disabled={loading}
          className="btn-primary text-sm py-3 px-8"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-arcane-400 border-t-transparent rounded-full animate-spin" />
              BortyGPT is analysing…
            </>
          ) : (
            <>
              <Brain size={14} />
              Generate Scouting Report
            </>
          )}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5 animate-slideUp">
      {/* Rating + catchphrase */}
      <div className="flex items-center gap-6">
        <div className="text-center">
          <div className="font-cinzel font-black text-5xl text-arcane-100">{review.borty_rating}</div>
          <div className="font-mono text-[10px] text-arcane-500 uppercase tracking-widest">/10 Borty Rating</div>
          <div className="flex gap-0.5 mt-2 justify-center">
            {[...Array(10)].map((_, i) => (
              <Star
                key={i}
                size={10}
                className={i < review.borty_rating ? 'text-gold-200' : 'text-void-600'}
                fill={i < review.borty_rating ? 'currentColor' : 'none'}
              />
            ))}
          </div>
        </div>
        <div className="border-l border-arcane-700/40 pl-6 flex-1">
          <p className="font-cinzel text-sm italic text-arcane-300">"{review.catchphrase}"</p>
        </div>
      </div>

      {/* Main review */}
      <p className="font-rajdhani text-base text-arcane-200/80 leading-relaxed">
        {review.review}
      </p>

      {/* Strengths / weaknesses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="font-cinzel text-xs font-bold uppercase tracking-widest text-radiant mb-3">Strengths</div>
          <ul className="space-y-2">
            {review.strengths.map((s, i) => (
              <li key={i} className="flex gap-2 font-rajdhani text-sm text-arcane-200">
                <span className="text-radiant flex-shrink-0">✓</span> {s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-cinzel text-xs font-bold uppercase tracking-widest text-dire mb-3">Weaknesses</div>
          <ul className="space-y-2">
            {review.weaknesses.map((w, i) => (
              <li key={i} className="flex gap-2 font-rajdhani text-sm text-arcane-200">
                <span className="text-dire flex-shrink-0">✗</span> {w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Hero suggestions */}
      <div>
        <div className="font-cinzel text-xs font-bold uppercase tracking-widest text-arcane-400 mb-3">Hero Suggestions</div>
        <div className="flex gap-2 flex-wrap">
          {review.hero_suggestions.map((h, i) => (
            <span key={i} className="px-3 py-1 border border-arcane-700/40 rounded-sm font-cinzel text-xs text-arcane-300 bg-arcane-900/20">
              {h}
            </span>
          ))}
        </div>
      </div>

      <button onClick={generate} disabled={loading} className="btn-ghost text-xs py-2 px-4">
        <Brain size={12} /> Regenerate
      </button>
    </div>
  )
}
