'use client'

import { useEffect, useState } from 'react'
import { getCountdown } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface CountdownProps {
  targetDate: string
  label?: string
  className?: string
}

export function Countdown({ targetDate, label = 'Tournament Begins', className }: CountdownProps) {
  const [time, setTime] = useState<ReturnType<typeof getCountdown> | null>(null)

  useEffect(() => {
    setTime(getCountdown(targetDate))
    const interval = setInterval(() => {
      setTime(getCountdown(targetDate))
    }, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  if (!time) return <div className="h-[96px]" />

  if (time.expired) {
    return (
      <div className={cn('text-center', className)}>
        <p className="font-cinzel text-rune-400 text-lg tracking-widest uppercase animate-glow-pulse">
          ⚔ Tournament Is Live ⚔
        </p>
      </div>
    )
  }

  const units = [
    { value: time.days,    label: 'Days' },
    { value: time.hours,   label: 'Hours' },
    { value: time.minutes, label: 'Mins' },
    { value: time.seconds, label: 'Secs' },
  ]

  return (
    <div className={cn('text-center', className)}>
      <p className="font-cinzel text-xs tracking-widest uppercase text-arcane-400/60 mb-4">
        {label}
      </p>
      <div className="flex items-center justify-center gap-3">
        {units.map((u, i) => (
          <div key={u.label} className="flex items-center gap-3">
            <div className="card-arcane px-4 py-3 min-w-[64px] text-center">
              <div className="font-cinzel font-black text-3xl text-arcane-100 leading-none tabular-nums">
                {String(u.value).padStart(2, '0')}
              </div>
              <div className="font-mono text-[10px] text-arcane-400/60 tracking-widest uppercase mt-1">
                {u.label}
              </div>
            </div>
            {i < units.length - 1 && (
              <span className="font-cinzel text-xl text-arcane-600 animate-glow-pulse">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
