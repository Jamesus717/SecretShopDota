interface DiscordEmbed {
  title: string
  description?: string
  color: number
  fields?: { name: string; value: string; inline?: boolean }[]
  footer?: { text: string }
  timestamp?: string
}

export async function sendDiscordWebhook(embed: DiscordEmbed): Promise<boolean> {
  const url = process.env.DISCORD_WEBHOOK_URL
  if (!url) {
    console.warn('DISCORD_WEBHOOK_URL not set — skipping webhook')
    return false
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'SecretLeague Bot',
        avatar_url: 'https://secretshop.gg/logo.png',
        embeds: [embed],
      }),
    })
    return res.ok
  } catch {
    return false
  }
}

export function soloRegistrationEmbed(data: {
  ign: string
  rank: string
  position: number
  discord: string | null
  steamId: string
}) {
  return {
    title: '⚔️ New Solo Registration',
    color: 0x534ab7,
    fields: [
      { name: 'IGN',        value: data.ign,                              inline: true },
      { name: 'Rank',       value: data.rank,                             inline: true },
      { name: 'Position',   value: `Pos ${data.position}`,                inline: true },
      { name: 'Discord',    value: data.discord ?? '—',                   inline: true },
      { name: 'Steam ID',   value: `\`${data.steamId}\``,                 inline: true },
    ],
    footer:    { text: 'SecretLeague Registration System' },
    timestamp: new Date().toISOString(),
  } satisfies DiscordEmbed
}

export function teamRegistrationEmbed(data: {
  teamName: string
  captainIgn: string
  playerCount: number
  avgMmr: number
}) {
  return {
    title: '🛡️ New Team Registration',
    color: 0x1d9e75,
    fields: [
      { name: 'Team',         value: data.teamName,                        inline: true },
      { name: 'Captain',      value: data.captainIgn,                      inline: true },
      { name: 'Players',      value: `${data.playerCount}/5`,              inline: true },
      { name: 'Avg MMR',      value: `~${data.avgMmr.toLocaleString()}`,   inline: true },
    ],
    footer:    { text: 'SecretLeague Registration System' },
    timestamp: new Date().toISOString(),
  } satisfies DiscordEmbed
}
