import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { sendDiscordWebhook, teamRegistrationEmbed } from '@/lib/discord'
import { validateSteamId } from '@/lib/utils'
import { DotaRank, DotaPosition, RANK_MMR } from '@/types'

interface PlayerInput {
  ign: string
  steamId: string
  discord?: string
  rank: DotaRank
  position: DotaPosition
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { team_name, players } = body as {
      team_name: string
      players: PlayerInput[]
    }

    if (!team_name?.trim()) return NextResponse.json({ error: 'Team name required' }, { status: 400 })
    if (!players || players.length !== 5) return NextResponse.json({ error: 'Exactly 5 players required' }, { status: 400 })

    for (let i = 0; i < players.length; i++) {
      const p = players[i]
      if (!p.ign?.trim())              return NextResponse.json({ error: `Player ${i + 1}: IGN required` },    { status: 400 })
      if (!validateSteamId(p.steamId)) return NextResponse.json({ error: `Player ${i + 1}: Invalid Steam ID` }, { status: 400 })
      if (!p.rank)                     return NextResponse.json({ error: `Player ${i + 1}: Rank required` },   { status: 400 })
      if (!p.position)                 return NextResponse.json({ error: `Player ${i + 1}: Position required` }, { status: 400 })
    }

    // Compute avg MMR
    const avgMmr = Math.round(
      players.reduce((sum, p) => sum + RANK_MMR[p.rank], 0) / players.length
    )

    const supabase = createAdminClient()

    // Check duplicate team name
    const { data: existing } = await supabase
      .from('team_registrations')
      .select('id')
      .ilike('team_name', team_name.trim())
      .single()

    if (existing) {
      return NextResponse.json({ error: 'A team with this name already exists' }, { status: 409 })
    }

    const { data, error } = await supabase
      .from('team_registrations')
      .insert({
        team_name: team_name.trim(),
        captain_ign: players[0].ign.trim(),
        captain_discord: players[0].discord?.trim() ?? null,
        players: players.map(p => ({
          ign: p.ign.trim(),
          steam_id: p.steamId,
          discord_username: p.discord?.trim() ?? null,
          rank: p.rank,
          primary_position: p.position,
        })),
        avg_mmr: avgMmr,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    sendDiscordWebhook(
      teamRegistrationEmbed({
        teamName: team_name.trim(),
        captainIgn: players[0].ign.trim(),
        playerCount: 5,
        avgMmr,
      })
    ).catch(console.error)

    return NextResponse.json({ success: true, id: data.id })
  } catch (e) {
    console.error('Team registration error:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
