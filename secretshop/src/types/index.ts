// ─── Dota Ranks ───────────────────────────────────────────────────────────────
export type DotaRank =
  | 'Herald'
  | 'Guardian'
  | 'Crusader'
  | 'Archon'
  | 'Legend'
  | 'Ancient'
  | 'Divine'
  | 'Immortal'

export const RANK_MMR: Record<DotaRank, number> = {
  Herald:   400,
  Guardian: 1050,
  Crusader: 1750,
  Archon:   2450,
  Legend:   3150,
  Ancient:  3850,
  Divine:   4750,
  Immortal: 6000,
}

export const RANK_COLORS: Record<DotaRank, string> = {
  Herald:   '#9e9e9e',
  Guardian: '#78c2c4',
  Crusader: '#c89b3c',
  Archon:   '#b0b0c8',
  Legend:   '#6aafdc',
  Ancient:  '#6fcf97',
  Divine:   '#c084fc',
  Immortal: '#f97316',
}

export const ALL_RANKS: DotaRank[] = [
  'Herald', 'Guardian', 'Crusader', 'Archon',
  'Legend', 'Ancient', 'Divine', 'Immortal',
]

// ─── Positions ────────────────────────────────────────────────────────────────
export type DotaPosition = 1 | 2 | 3 | 4 | 5

export const POSITION_LABELS: Record<DotaPosition, string> = {
  1: 'Carry',
  2: 'Mid',
  3: 'Offlane',
  4: 'Soft Support',
  5: 'Hard Support',
}

// ─── Registration ─────────────────────────────────────────────────────────────
export interface SoloRegistration {
  id: string
  created_at: string
  ign: string
  steam_name: string
  steam_id: string
  discord_username: string | null
  rank: DotaRank
  primary_position: DotaPosition
  secondary_position: DotaPosition | null
  status: 'pending' | 'approved' | 'rejected'
  team_id: string | null
  notes: string | null
}

export interface TeamPlayer {
  ign: string
  steam_id: string
  discord_username: string | null
  rank: DotaRank
  primary_position: DotaPosition
}

export interface TeamRegistration {
  id: string
  created_at: string
  team_name: string
  captain_ign: string
  captain_discord: string | null
  players: TeamPlayer[]
  avg_mmr: number
  status: 'pending' | 'approved' | 'rejected'
  notes: string | null
}

// ─── Tournament ───────────────────────────────────────────────────────────────
export interface TournamentMatch {
  id: string
  round: 'group_a' | 'group_b' | 'semi' | 'grand_final'
  team_a_id: string
  team_b_id: string
  team_a_name: string
  team_b_name: string
  team_a_score: number | null
  team_b_score: number | null
  scheduled_at: string | null
  played_at: string | null
  winner_id: string | null
  dotabuff_link: string | null
}

export interface TournamentTeam {
  id: string
  name: string
  players: TeamPlayer[]
  group: 'A' | 'B'
  wins: number
  losses: number
  points: number
}

// ─── BortyGPT ─────────────────────────────────────────────────────────────────
export interface BalancerPlayer {
  id: string
  name: string
  rank: DotaRank
  position: DotaPosition
}

export interface BalancedTeams {
  radiant: BalancerPlayer[]
  dire:    BalancerPlayer[]
  radiant_avg_mmr: number
  dire_avg_mmr:    number
  balance_score:   number // 0–100, 100 = perfect
  balance_label:   string
}

export interface PlayerReview {
  steam_id: string
  ign: string
  rank: DotaRank
  review: string
  hero_suggestions: string[]
  strengths: string[]
  weaknesses: string[]
  borty_rating: number // 1–10
  generated_at: string
}

// ─── OpenDota ─────────────────────────────────────────────────────────────────
export interface OpenDotaPlayer {
  profile: {
    account_id: number
    personaname: string
    avatarfull: string
    profileurl: string
  }
  rank_tier: number | null
  leaderboard_rank: number | null
}

export interface OpenDotaHeroStat {
  hero_id: number
  last_played: number
  games: number
  win: number
  with_games: number
  with_win: number
  against_games: number
  against_win: number
}

export interface OpenDotaRecentMatch {
  match_id: number
  player_slot: number
  radiant_win: boolean
  duration: number
  game_mode: number
  lobby_type: number
  hero_id: number
  start_time: number
  kills: number
  deaths: number
  assists: number
  xp_per_min: number
  gold_per_min: number
  hero_damage: number
  tower_damage: number
  hero_healing: number
  last_hits: number
}
