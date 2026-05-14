import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { sendDiscordWebhook, soloRegistrationEmbed } from '@/lib/discord'
import { validateSteamId } from '@/lib/utils'
import { DotaRank, DotaPosition } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      ign,
      steam_id,
      steam_name,
      discord_username,
      rank,
      primary_position,
      secondary_position,
    } = body as {
      ign: string
      steam_id: string
      steam_name: string
      discord_username?: string
      rank: DotaRank
      primary_position: DotaPosition
      secondary_position?: DotaPosition
    }

    // Validate
    if (!ign?.trim())              return NextResponse.json({ error: 'IGN required' },           { status: 400 })
    if (!validateSteamId(steam_id)) return NextResponse.json({ error: 'Invalid Steam ID' },       { status: 400 })
    if (!rank)                     return NextResponse.json({ error: 'Rank required' },           { status: 400 })
    if (!primary_position)         return NextResponse.json({ error: 'Position required' },       { status: 400 })

    const supabase = createAdminClient()

    // Check for duplicate steam ID in this season
    const { data: existing } = await supabase
      .from('solo_registrations')
      .select('id')
      .eq('steam_id', steam_id)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'This Steam account is already registered' },
        { status: 409 }
      )
    }

    // Insert registration
    const { data, error } = await supabase
      .from('solo_registrations')
      .insert({
        ign: ign.trim(),
        steam_id,
        steam_name: steam_name?.trim() ?? null,
        discord_username: discord_username?.trim() ?? null,
        rank,
        primary_position,
        secondary_position: secondary_position ?? null,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Fire Discord webhook (non-blocking)
    sendDiscordWebhook(
      soloRegistrationEmbed({
        ign: ign.trim(),
        rank,
        position: primary_position,
        discord: discord_username ?? null,
        steamId: steam_id,
      })
    ).catch(console.error)

    return NextResponse.json({ success: true, id: data.id })
  } catch (e) {
    console.error('Registration error:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
