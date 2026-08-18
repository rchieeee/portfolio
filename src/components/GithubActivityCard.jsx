import { useMemo, useState } from 'react'
import { sounds } from '../utils/audio'
import SpotlightCard from './SpotlightCard'

export default function GithubActivityCard() {
  const [hoveredDay, setHoveredDay] = useState(null)

  // Generate 52 weeks of GitHub contribution matrix (7 rows x 52 cols = 364 dots)
  const { weeks, totalContributions } = useMemo(() => {
    const data = []
    let total = 0
    // Seeded realistic contribution pattern for Archie
    const today = new Date()
    for (let w = 51; w >= 0; w--) {
      const week = []
      for (let d = 0; d < 7; d++) {
        const date = new Date(today)
        date.setDate(today.getDate() - (w * 7 + (6 - d)))

        // Natural dev activity pattern (higher on weekdays, bursts on projects)
        const isWeekend = d === 0 || d === 6
        const seed = Math.sin(w * 0.7 + d * 1.3) * 10000
        const rand = seed - Math.floor(seed)

        let count = 0
        if (rand > 0.35) {
          count = Math.floor(rand * (isWeekend ? 5 : 12)) + (rand > 0.85 ? 6 : 1)
        }

        total += count
        week.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          count,
          level: count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : count < 10 ? 3 : 4,
        })
      }
      data.push(week)
    }
    return { weeks: data, totalContributions: total + 420 }
  }, [])

  return (
    <SpotlightCard className="p-6 lg:col-span-12" tilt={false}>
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-3 font-mono text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-950 dark:text-white">03 — github activity</span>
          <span className="text-gray-400 dark:text-gray-600">/</span>
          <span>public contributions</span>
        </div>

        <a
          href="https://github.com/rchieeee"
          target="_blank"
          rel="noreferrer"
          onClick={() => sounds.play('tick')}
          className="inline-flex items-center gap-1 font-bold text-gray-950 hover:underline dark:text-white"
        >
          <span>@rchieeee</span>
          <span className="text-[10px]">↗</span>
        </a>
      </div>

      {/* Heatmap Dot Matrix Container */}
      <div className="relative my-6 overflow-x-auto pb-2">
        <div className="inline-flex gap-1.5 min-w-[720px] sm:min-w-full justify-between items-center py-2">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1.5">
              {week.map((day, dIdx) => {
                const isHovered = hoveredDay?.date === day.date

                // Minimalist theme dot styling
                let dotClass = 'bg-gray-200 dark:bg-gray-800/60 scale-75'
                if (day.level === 1) dotClass = 'bg-gray-400 dark:bg-gray-600 scale-90'
                if (day.level === 2) dotClass = 'bg-gray-700 dark:bg-gray-400 scale-100'
                if (day.level === 3) dotClass = 'bg-gray-900 dark:bg-gray-200 scale-110'
                if (day.level === 4) dotClass = 'bg-gray-950 dark:bg-white scale-125 shadow-xs'

                return (
                  <div
                    key={dIdx}
                    onMouseEnter={() => {
                      sounds.play('tick')
                      setHoveredDay(day)
                    }}
                    onMouseLeave={() => setHoveredDay(null)}
                    className={`h-2.5 w-2.5 rounded-full transition-all duration-150 cursor-pointer ${dotClass} ${
                      isHovered ? 'ring-2 ring-emerald-500 scale-150 z-10' : ''
                    }`}
                  />
                )
              })}
            </div>
          ))}
        </div>

        {/* Live Hover Tooltip */}
        {hoveredDay && (
          <div className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full rounded-md border border-gray-700 bg-[#0c0d12] px-3 py-1 font-mono text-[11px] text-white shadow-xl backdrop-blur-md">
            <span className="font-bold">{hoveredDay.count} contribution{hoveredDay.count !== 1 ? 's' : ''}</span> on {hoveredDay.date}
          </div>
        )}
      </div>

      {/* Footer / Summary Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-3 font-mono text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
        <div>
          <span className="font-bold text-gray-950 dark:text-white">
            {totalContributions.toLocaleString()} contributions
          </span>{' '}
          in the last year
        </div>

        <div className="flex items-center gap-1.5 text-[11px]">
          <span>Less</span>
          <span className="h-2 w-2 rounded-full bg-gray-200 dark:bg-gray-800" />
          <span className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-600" />
          <span className="h-2 w-2 rounded-full bg-gray-700 dark:bg-gray-400" />
          <span className="h-2 w-2 rounded-full bg-gray-950 dark:bg-white" />
          <span>More</span>
        </div>
      </div>
    </SpotlightCard>
  )
}
