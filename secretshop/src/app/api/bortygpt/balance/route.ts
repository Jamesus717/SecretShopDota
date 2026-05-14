import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { BalancerPlayer, RANK_MMR, BalancedTeams } from '@/types'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function balanceTeams(players: BalancerPlayer[]): { radiant: BalancerPlayer[]; dire: BalancerPlayer[] } {
  // Greedy MMR balancing — sort by MMR desc, alternate assignment
  const sorted = [...players].sort((a, b) => RANK_MMR[b.rank] - RANK_MMR[a.rank])
  const radiant: BalancerPlayer[] = []
  const dire:    BalancerPlayer[] = []

  sorted.forEach((p, i) => {
    const radiantMMR = radiant.reduce((s, r) => s + RANK_MMR[r.rank], 0)
    const direMMR    = dire.reduce((s, d) => s + RANK_MMR[d.rank], 0)

    // Assign to team that has lower total MMR to balance
    if (radiant.length >= Math.ceil(players.length / 2)) {
      dire.push(p)
    } else if (dire.length >= Math.floor(players.length / 2)) {
      radiant.push(p)
    } else if (radiantMMR <= direMMR) {
      radiant.push(p)
    } else {
      dire.push(p)
    }
  })

  return { radiant, dire }
}

function calcBalance(radiant: BalancerPlayer[], dire: BalancerPlayer[]): number {
  const rMMR = radiant.reduce((s, p) => s + RANK_MMR[p.rank], 0) / (radiant.length || 1)
  const dMMR = dire.reduce((s, p) => s + RANK_MMR[p.rank], 0)    / (dire.length    || 1)
  const diff = Math.abs(rMMR - dMMR)
  // Score: 0 diff = 100, 1000 diff = 0
  return Math.max(0, Math.round(100 - (diff / 1000) * 100))
}

export async function POST(req: NextRequest) {
  try {
    const { players, withCommentary } = await req.json() as {
      players: BalancerPlayer[]
      withCommentary?: boolean
    }

    if (!players || players.length < 2) {
      return NextResponse.json({ error: 'At least 2 players required' }, { status: 400 })
    }

    const { radiant, dire } = balanceTeams(players)

    const radiantAvg = Math.round(radiant.reduce((s, p) => s + RANK_MMR[p.rank], 0) / (radiant.length || 1))
    const direAvg    = Math.round(dire.reduce((s, p) => s + RANK_MMR[p.rank], 0)    / (dire.length    || 1))
    const score      = calcBalance(radiant, dire)

    let commentary = null
    if (withCommentary && players.length >= 6) {
      try {
        const prompt = `You're BortyGPT. Give a SHORT 2-3 sentence commentary on this Dota team balance.
Radiant (avg ${radiantAvg} MMR): ${radiant.map(p => `${p.name} (${p.rank})`).join(', ')}
Dire (avg ${direAvg} MMR): ${dire.map(p => `${p.name} (${p.rank})`).join(', ')}
Balance score: ${score}/100
Be funny and direct. Call out if one team got stacked.`

        const msg = await anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 200,
          messages: [{ role: 'user', content: prompt }],
        })

        commentary = msg.content.filter(b => b.type === 'text').map(b => b.text).join('')
      } catch {
        // Commentary is optional, don't fail the whole request
      }
    }

    const balanceLabel =
      score >= 90 ? 'Perfectly Balanced' :
      score >= 75 ? 'Well Balanced' :
      score >= 60 ? 'Slightly Skewed' :
      score >= 40 ? 'One-Sided' :
      'Heavily Stacked'

    return NextResponse.json({
      radiant,
      dire,
      radiant_avg_mmr: radiantAvg,
      dire_avg_mmr:    direAvg,
      balance_score:   score,
      balance_label:   balanceLabel,
      commentary,
    } satisfies BalancedTeams & { commentary: string | null })
  } catch (e) {
    console.error('Balancer error:', e)
    return NextResponse.json({ error: 'Balance calculation failed' }, { status: 500 })
  }
}
