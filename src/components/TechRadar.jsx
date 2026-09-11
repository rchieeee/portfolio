import { useState } from 'react'
import { techCategories } from '../portfolioData'
import { sounds } from '../utils/audio'

function TechIcon({ iconId }) {
  const baseClass = 'h-4 w-4'
  switch (iconId) {
    case 'react':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <ellipse cx="12" cy="12" rx="10" ry="4" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
      )
    case 'nextjs':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9.5" />
          <path d="M9 16V8l7.5 9.5V8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'typescript':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="3" width="18" height="18" rx="4" />
          <path d="M7.5 9h5M10 9v7M14 10.5c.3-.6 1-1 1.8-1 1 0 1.7.6 1.7 1.4 0 1.8-3.5 1.5-3.5 3.3 0 .8.8 1.4 1.8 1.4.8 0 1.5-.4 1.8-1" strokeLinecap="round" />
        </svg>
      )
    case 'javascript':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="3" width="18" height="18" rx="4" />
          <path d="M8 12.5v2.2c0 .7-.5 1.3-1.3 1.3-.6 0-1.1-.4-1.2-1M13.5 10.5c.3-.6 1-1 1.8-1 1 0 1.7.6 1.7 1.4 0 1.8-3.5 1.5-3.5 3.3 0 .8.8 1.4 1.8 1.4.8 0 1.5-.4 1.8-1" strokeLinecap="round" />
        </svg>
      )
    case 'tailwind':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M6 13c1.5-3 3.5-3 5 0s3.5 3 5 0M8 8c1.5-3 3.5-3 5 0s3.5 3 5 0" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'vite':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'html':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'state':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="6" cy="6" r="2.5" />
          <circle cx="18" cy="6" r="2.5" />
          <circle cx="12" cy="18" r="2.5" />
          <path d="M8 7.5l3 8M16 7.5l-3 8" strokeLinecap="round" />
        </svg>
      )
    case 'node':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 2.5l8 4.6v9.2l-8 4.6-8-4.6V7.1L12 2.5z" />
          <path d="M12 12v9M12 12l8-4.6M12 12L4 7.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'express':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9.5" />
          <path d="M8 12h8M12 8v8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'python':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 4.5h4a2 2 0 012 2v2.5a2 2 0 01-2 2H9a2 2 0 00-2 2v2.5a2 2 0 002 2h4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="10" cy="7.5" r="0.75" fill="currentColor" />
          <circle cx="14" cy="16.5" r="0.75" fill="currentColor" />
        </svg>
      )
    case 'fastapi':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9.5" />
          <path d="M13 6l-5 6.5h4.5l-1 5.5 5.5-7h-4.5l1.5-5z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'api':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="4" width="18" height="6" rx="2" />
          <rect x="3" y="14" width="18" height="6" rx="2" />
          <path d="M7 7h.01M7 17h.01" strokeLinecap="round" />
        </svg>
      )
    case 'graphql':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="4" r="2" />
          <circle cx="19" cy="8" r="2" />
          <circle cx="19" cy="16" r="2" />
          <circle cx="12" cy="20" r="2" />
          <circle cx="5" cy="16" r="2" />
          <circle cx="5" cy="8" r="2" />
          <path d="M12 6v12M6.7 9l10.6 6M6.7 15l10.6-6" strokeLinecap="round" opacity="0.6" />
        </svg>
      )
    case 'websocket':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 12a8 8 0 0116 0M7 12a5 5 0 0110 0M10 12a2 2 0 014 0" strokeLinecap="round" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
        </svg>
      )
    case 'auth':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 2L4 5.5v6.2c0 5 3.4 9.7 8 10.8 4.6-1.1 8-5.8 8-10.8V5.5L12 2z" strokeLinejoin="round" />
          <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'postgres':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <ellipse cx="12" cy="6" rx="8" ry="3" />
          <path d="M4 6v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
          <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
        </svg>
      )
    case 'supabase':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M13 2.5L3.5 14h8l-1 7.5 9.5-11.5h-8l1-7.5z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'firebase':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4.5 17L8 4.5l3.5 6M4.5 17l10-13 4 13-14 0z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'redis':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 3l8 4-8 4-8-4 8-4zM4 11l8 4 8-4M4 16l8 4 8-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'prisma':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 19L11 3l9 16-7-4-9 4z" strokeLinejoin="round" />
        </svg>
      )
    case 'docker':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="10" width="3" height="3" rx="0.5" />
          <rect x="7.5" y="10" width="3" height="3" rx="0.5" />
          <rect x="12" y="10" width="3" height="3" rx="0.5" />
          <rect x="7.5" y="6" width="3" height="3" rx="0.5" />
          <path d="M2 14c1 2 3.5 4 8 4s8-2 11-4c.5-2-1-4-3-4H2v4z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'vercel':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 3L22 20H2L12 3z" strokeLinejoin="round" />
        </svg>
      )
    case 'git':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="6" cy="6" r="2.5" />
          <circle cx="6" cy="18" r="2.5" />
          <circle cx="18" cy="12" r="2.5" />
          <path d="M6 8.5v7M8.5 7l7 3.5" strokeLinecap="round" />
        </svg>
      )
    case 'wordpress':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9.5" />
          <path d="M6.5 9l3.5 9 2.5-6.5L15 18l3-9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'woocommerce':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="9" cy="19" r="1.5" />
          <circle cx="17" cy="19" r="1.5" />
          <path d="M3 4h3l2.5 11h9.5l2-8H6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'php':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="6" width="18" height="12" rx="4" />
          <path d="M7 10h2a1.5 1.5 0 010 3H7m0 0v2M15 10h2a1.5 1.5 0 010 3h-2m0 0v2M12 10v5" strokeLinecap="round" />
        </svg>
      )
    case 'acf':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="4" width="18" height="16" rx="3" />
          <path d="M7 8h10M7 12h7M7 16h4" strokeLinecap="round" />
        </svg>
      )
    case 'headless':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="5" width="8" height="6" rx="1.5" />
          <rect x="13" y="13" width="8" height="6" rx="1.5" />
          <path d="M7 11v4a2 2 0 002 2h4M17 13V9a2 2 0 00-2-2h-4" strokeLinecap="round" />
        </svg>
      )
    case 'speed':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 3a9 9 0 00-9 9c0 3.5 2 6.5 5 8h8c3-1.5 5-4.5 5-8a9 9 0 00-9-9z" />
          <path d="M12 12l3-4" strokeLinecap="round" />
        </svg>
      )
    case 'claude':
    case 'openai':
    case 'prompt':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" strokeLinecap="round" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )
    case 'guardrail':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 3L4 6.5v5.8c0 5 3.4 9.6 8 10.7 4.6-1.1 8-5.7 8-10.7V6.5L12 3z" strokeLinejoin="round" />
          <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'rag':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="11" cy="11" r="7" />
          <path d="M16.5 16.5L21 21M8 11h6M11 8v6" strokeLinecap="round" />
        </svg>
      )
    case 'biometrics':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 8V5a1 1 0 011-1h3M16 4h3a1 1 0 011 1v3M20 16v3a1 1 0 01-1 1h-3M8 20H5a1 1 0 01-1-1v-3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="9" cy="10" r="1" fill="currentColor" />
          <circle cx="15" cy="10" r="1" fill="currentColor" />
          <path d="M9 15a4 4 0 006 0" strokeLinecap="round" />
        </svg>
      )
    default:
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
  }
}

export default function TechRadar() {
  const [activeCategory, setActiveCategory] = useState(0)
  const currentCategory = techCategories[activeCategory] || techCategories[0]

  return (
    <section id="stack" className="py-14 sm:py-20">
      {/* ── Section Header ── */}
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Technical Toolchain
          </span>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl dark:text-white">
            Languages, Frameworks &amp; Systems
          </h2>
        </div>
        <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-gray-500 dark:text-gray-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Production-tested in active systems</span>
        </div>
      </div>

      {/* ── Main Layout: Sidebar Tabs (4 cols) + Active Grid (8 cols) ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Category Selector Tabs */}
        <div className="flex flex-row gap-2 overflow-x-auto pb-1 no-scrollbar lg:col-span-4 lg:flex-col lg:pb-0">
          {techCategories.map((cat, idx) => {
            const isActive = activeCategory === idx
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => {
                  sounds.play('tick')
                  setActiveCategory(idx)
                }}
                className={`group flex items-center justify-between rounded-xl px-4 py-3 text-left font-mono text-xs transition-all cursor-pointer select-none lg:w-full shrink-0 ${
                  isActive
                    ? 'border border-gray-950 bg-gray-950 text-white shadow-xs dark:border-white dark:bg-white dark:text-gray-950 font-semibold'
                    : 'border border-gray-200/90 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-950 dark:border-gray-800/90 dark:bg-[#111217] dark:text-gray-400 dark:hover:border-gray-700 dark:hover:bg-[#161822] dark:hover:text-white'
                }`}
              >
                <span className="truncate pr-2">{cat.name}</span>
                <span
                  className={`rounded-md px-1.5 py-0.5 text-[10px] font-mono transition-colors shrink-0 ${
                    isActive
                      ? 'bg-white/20 text-white dark:bg-gray-900/20 dark:text-gray-950'
                      : 'bg-gray-100 text-gray-500 group-hover:text-gray-950 dark:bg-gray-800/80 dark:text-gray-400 dark:group-hover:text-white'
                  }`}
                >
                  {cat.items.length}
                </span>
              </button>
            )
          })}
        </div>

        {/* Active Category Cards Grid */}
        <div className="flex flex-col justify-between rounded-2xl border border-gray-200/90 bg-white/80 p-5 sm:p-6 shadow-sm backdrop-blur-md transition-colors lg:col-span-8 dark:border-gray-800/90 dark:bg-[#111217]/80">
          {/* Top Info Bar */}
          <div>
            <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-3.5 dark:border-gray-800/70">
              <div className="flex items-center gap-2">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-gray-950 dark:text-white">
                  {currentCategory.name}
                </h3>
                <span className="text-gray-300 dark:text-gray-700">•</span>
                <span className="font-mono text-[11px] text-gray-500 dark:text-gray-400">
                  {currentCategory.items.length} tools
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-gray-600 dark:text-gray-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Production Proficient</span>
              </div>
            </div>

            {/* 2-Column Minimal Card Grid */}
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {currentCategory.items.map((rawItem) => {
                const item =
                  typeof rawItem === 'string'
                    ? { name: rawItem, role: 'Production implementation', badge: 'Core', iconId: '' }
                    : rawItem

                return (
                  <div
                    key={item.name}
                    className="group flex items-start gap-3 rounded-xl border border-gray-200/80 bg-gray-50/60 p-3 sm:p-3.5 transition-all duration-200 hover:border-gray-400 hover:bg-white hover:shadow-xs dark:border-gray-800/80 dark:bg-[#151722]/50 dark:hover:border-gray-700 dark:hover:bg-[#181b28]"
                  >
                    {/* Minimal SVG Brand Icon */}
                    <div className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-lg border border-gray-200/90 bg-white text-gray-700 shadow-2xs transition-colors group-hover:border-gray-400 group-hover:text-gray-950 dark:border-gray-800/90 dark:bg-[#0e0f14] dark:text-gray-300 dark:group-hover:border-gray-600 dark:group-hover:text-white">
                      <TechIcon iconId={item.iconId} />
                    </div>

                    {/* Tech Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1.5">
                        <h4 className="truncate font-mono text-[12.5px] font-semibold tracking-tight text-gray-900 transition-colors group-hover:text-gray-950 dark:text-gray-100 dark:group-hover:text-white">
                          {item.name}
                        </h4>
                        {item.badge && (
                          <span className="shrink-0 rounded border border-gray-200/90 bg-white px-1.5 py-0.2 font-mono text-[9px] font-medium text-gray-500 transition-colors dark:border-gray-800 dark:bg-gray-900/80 dark:text-gray-400">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 line-clamp-1 font-mono text-[10.5px] text-gray-500 transition-colors dark:text-gray-400">
                        {item.role}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Micro Engineering Note Footer */}
          <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-3.5 font-mono text-[10.5px] text-gray-400 dark:border-gray-800/70 dark:text-gray-500">
            <span>Verified in production applications</span>
            <span className="hidden sm:inline">Zero Fluff • Real Deployments</span>
          </div>
        </div>
      </div>
    </section>
  )
}
