import { DotaRank, RANK_COLORS } from '@/types'
import { cn } from '@/lib/utils'

interface RankBadgeProps {
  rank: DotaRank
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

const RANK_ICON: Record<DotaRank, string> = {
  Herald: '/assets/ranks/herald.png',
  Guardian: '/assets/ranks/guardian.png',
  Crusader: '/assets/ranks/crusader.png',
  Archon: '/assets/ranks/archon.png',
  Legend: '/assets/ranks/legend.png',
  Ancient: '/assets/ranks/ancient.png',
  Divine: '/assets/ranks/divine.png',
  Immortal: '/assets/ranks/immortal.png',
}

const RANK_BORDER: Record<DotaRank, string> = {
  Herald:   'border-[#9e9e9e]/40 text-[#9e9e9e]',
  Guardian: 'border-[#78c2c4]/40 text-[#78c2c4]',
  Crusader: 'border-[#c89b3c]/40 text-[#c89b3c]',
  Archon:   'border-[#b0b0c8]/40 text-[#b0b0c8]',
  Legend:   'border-[#6aafdc]/40 text-[#6aafdc]',
  Ancient:  'border-[#6fcf97]/40 text-[#6fcf97]',
  Divine:   'border-[#c084fc]/40 text-[#c084fc]',
  Immortal: 'border-[#f97316]/40 text-[#f97316]',
}

const RANK_BG: Record<DotaRank, string> = {
  Herald:   'bg-[#9e9e9e]/10',
  Guardian: 'bg-[#78c2c4]/10',
  Crusader: 'bg-[#c89b3c]/10',
  Archon:   'bg-[#b0b0c8]/10',
  Legend:   'bg-[#6aafdc]/10',
  Ancient:  'bg-[#6fcf97]/10',
  Divine:   'bg-[#c084fc]/10',
  Immortal: 'bg-[#f97316]/10',
}

export function RankBadge({ rank, size = 'md', showLabel = true, className }: RankBadgeProps) {
  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-0.5',
    lg: 'text-sm px-3 py-1',
  }

  const iconClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  return (
    <span
      className={cn(
        'rank-badge font-cinzel font-bold uppercase tracking-wide border rounded-sm',
        RANK_BORDER[rank],
        RANK_BG[rank],
        sizeClasses[size],
        className
      )}
    >
      <img
        src={RANK_ICON[rank]}
        alt={rank}
        className={cn('flex-shrink-0 object-contain', iconClasses[size])}
        style={{ filter: `drop-shadow(0 0 6px ${RANK_COLORS[rank]}40)` }}
      />
      {showLabel && rank}
    </span>
  )
}
