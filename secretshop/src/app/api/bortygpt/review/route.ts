import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { DotaRank, RANK_MMR } from '@/types'
import { getPlayerProfile, getRecentMatches, getPlayerHeroes, accountIdFromSteamId64 } from '@/lib/opendota'
import { rankTierToName } from '@/lib/utils'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { steam_id, ign, rank } = await req.json() as {
      steam_id: string
      ign: string
      rank: DotaRank
    }

    if (!steam_id || !ign) {
      return NextResponse.json({ error: 'steam_id and ign required' }, { status: 400 })
    }

    // Fetch OpenDota data
    const accountId    = accountIdFromSteamId64(steam_id)
    const [profile, recentMatches, heroes] = await Promise.all([
      getPlayerProfile(accountId),
      getRecentMatches(accountId),
      getPlayerHeroes(accountId),
    ])

    const detectedRank = profile?.rank_tier
      ? rankTierToName(profile.rank_tier)
      : rank ?? 'Unknown'

    const recentStats = recentMatches.slice(0, 10)
    const winRate     = recentStats.length
      ? Math.round((recentStats.filter(m => {
          const isRadiant = m.player_slot < 128
          return isRadiant ? m.radiant_win : !m.radiant_win
        }).length / recentStats.length) * 100)
      : null

    const avgKDA = recentStats.length ? {
      k: (recentStats.reduce((s, m) => s + m.kills, 0)   / recentStats.length).toFixed(1),
      d: (recentStats.reduce((s, m) => s + m.deaths, 0)  / recentStats.length).toFixed(1),
      a: (recentStats.reduce((s, m) => s + m.assists, 0) / recentStats.length).toFixed(1),
    } : null

    const topHeroes = heroes
      .sort((a, b) => b.games - a.games)
      .slice(0, 5)
      .map(h => ({
        hero_id: h.hero_id,
        games: h.games,
        winRate: Math.round((h.win / h.games) * 100),
      }))

    // Build the BortyGPT prompt
    const systemPrompt = `You are BortyGPT — the SecretShop Dota community's AI analyst. 
You give honest, entertaining, and genuinely useful player reviews. 
You are direct, funny, and a little bit savage — like a coach who actually cares but won't coddle you.
You love Dota 2 and know it deeply. Write like a real person who plays the game, not a corporate AI.
Keep reviews punchy: around 150-200 words for the main review.
Format your response as JSON exactly matching this structure:
{
  "review": "string - main review paragraph",
  "strengths": ["string", "string", "string"],
  "weaknesses": ["string", "string", "string"],
  "hero_suggestions": ["HeroName", "HeroName", "HeroName"],
  "borty_rating": number between 1-10,
  "catchphrase": "one punchy memorable line about this player"
}`

    const userPrompt = `Write a BortyGPT player review for:

Player: ${ign}
Rank: ${detectedRank} (~${RANK_MMR[detectedRank as DotaRank] ?? '?'} MMR)
Recent win rate (last 10 games): ${winRate !== null ? `${winRate}%` : 'Unknown'}
Average KDA (last 10 games): ${avgKDA ? `${avgKDA.k}/${avgKDA.d}/${avgKDA.a}` : 'Unknown'}
Top heroes by games: ${topHeroes.length ? topHeroes.map(h => `Hero ID ${h.hero_id} (${h.games} games, ${h.winRate}% WR)`).join(', ') : 'No data'}

Be honest, funny, and helpful. Don't make things up if data is missing — acknowledge it.`

    const message = await anthropic.messages.create({
      model:      'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system:     systemPrompt,
      messages:   [{ role: 'user', content: userPrompt }],
    })

    const text = message.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('')

    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)

    return NextResponse.json({
      ...parsed,
      steam_id,
      ign,
      rank: detectedRank,
      win_rate: winRate,
      avg_kda: avgKDA,
      generated_at: new Date().toISOString(),
    })
  } catch (e) {
    console.error('BortyGPT review error:', e)
    return NextResponse.json({ error: 'Failed to generate review' }, { status: 500 })
  }
}
