import { keyMetrics, profile, socials } from '../portfolioData'
import { sounds } from '../utils/audio'
import InteractiveAvatar from './InteractiveAvatar'
import ScrambleHeadlineText from './ScrambleHeadlineText'
import SpotlightCard from './SpotlightCard'

export default function Hero({ onOpenTerminal, theme: _theme }) {
  return (
    <section id="top" className="relative pt-12 pb-16 sm:pt-20 sm:pb-24">
      {/* ── Interactive 3D Avatar & Clean Location Status with Frosted Glass Pill ── */}
      <div className="reveal d1 relative z-10 mb-6 flex items-center">
        <div className="ios-glass-pill inline-flex items-center gap-3.5 rounded-2xl px-3.5 py-2 shadow-sm">
          <InteractiveAvatar />
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 font-mono text-xs text-gray-600 dark:text-gray-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{profile.location} · UTC+8</span>
            </div>
            <div className="font-mono text-xs text-gray-400 dark:text-gray-500">
              {profile.role}
            </div>
          </div>
        </div>
      </div>

      {/* Main Headline (Moves ONLY while hovering, 100% static when not hovered) */}
      <div className="reveal d2 relative z-10 max-w-3xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-950 sm:text-5xl sm:leading-[1.15] dark:text-white">
          building cool web apps &amp; <ScrambleHeadlineText />
        </h1>
      </div>

      {/* Engaging & Entertaining Bio */}
      <div className="reveal d3 relative z-10 mt-6 max-w-2xl space-y-3">
        <p className="text-base leading-relaxed text-gray-600 sm:text-lg dark:text-gray-300">
          wazzupp... i&apos;m <b className="text-gray-950 dark:text-white">{profile.name}</b> — a full-stack developer and generative AI builder from the Philippines. I love turning wild ideas into fast, responsive web apps and building smart AI tools that actually get things done.
        </p>
        <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
          When I&apos;m not writing code with React, Node, or Python, you&apos;ll find me experimenting with generative models, tweaking UI details, or exploring new tech. Feel free to check out my work below, test the interactive code inspector, or open the{' '}
          <button
            type="button"
            onClick={() => {
              sounds.play('chime')
              onOpenTerminal()
            }}
            className="inline font-mono font-semibold text-gray-950 underline underline-offset-4 hover:opacity-75 dark:text-white cursor-pointer"
          >
            $ terminal (⌘K)
          </button>{' '}
          to play around!
        </p>
      </div>

      {/* Action Buttons & CLI Trigger */}
      <div className="reveal d4 relative z-10 mt-8 flex flex-wrap items-center gap-3">
        <a
          href="#projects"
          onClick={() => sounds.play('press')}
          className="inline-flex items-center gap-2 rounded-xl bg-gray-950 px-5 py-3 font-mono text-[13px] font-semibold text-white shadow-lg hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-100 active:scale-95 transition-all"
        >
          <span>explore projects</span>
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
            <path d="M8 3v10M3 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>

        <button
          type="button"
          onClick={() => {
            sounds.play('chime')
            onOpenTerminal()
          }}
          className="ios-glass-button inline-flex items-center gap-2 rounded-xl px-5 py-3 font-mono text-[13px] font-semibold text-gray-900 dark:text-white"
        >
          <span className="font-bold text-gray-950 dark:text-white">$</span>
          <span>Open Interactive CLI</span>
        </button>
      </div>

      {/* Clean Editorial Links */}
      <div className="reveal d5 relative z-10 mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs text-gray-500 dark:text-gray-400">
        <span className="text-gray-400 dark:text-gray-600">connect /</span>
        {socials.map((s) => (
          <a
            key={s.label}
            href={s.url}
            target="_blank"
            rel="noreferrer"
            onClick={() => sounds.play('tick')}
            className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-950 underline underline-offset-4 decoration-gray-300 dark:text-gray-400 dark:hover:text-white dark:decoration-gray-700 hover:decoration-current"
          >
            <span>{s.label.toLowerCase()}</span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500">↗</span>
          </a>
        ))}
      </div>

      {/* Key Metrics Grid (With 3D Spotlight Cards) */}
      <div className="reveal d5 relative z-10 mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {keyMetrics.map((metric, idx) => (
          <SpotlightCard
            key={idx}
            className="p-4"
          >
            <div className="text-xl font-bold tracking-tight text-gray-950 sm:text-2xl dark:text-white">
              {metric.value}
            </div>
            <div className="mt-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              {metric.label}
            </div>
            <div className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
              {metric.detail}
            </div>
          </SpotlightCard>
        ))}
      </div>
    </section>
  )
}
