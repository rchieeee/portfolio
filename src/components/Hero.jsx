import { keyMetrics, profile, socials } from '../portfolioData'
import { sounds } from '../utils/audio'
import InteractiveAvatar from './InteractiveAvatar'
import InteractiveHeroCanvas from './InteractiveHeroCanvas'
import ScrambleHeadlineText from './ScrambleHeadlineText'
import SpotlightCard from './SpotlightCard'

export default function Hero({ onOpenTerminal, theme }) {
  return (
    <section id="top" className="relative pt-12 pb-16 sm:pt-20 sm:pb-24">
      {/* ── Interactive Particle Constellation Canvas ── */}
      <InteractiveHeroCanvas theme={theme} />

      {/* ── Interactive 3D Avatar & Clean Location Status ── */}
      <div className="reveal d1 relative z-10 mb-6 flex items-center gap-4">
        <InteractiveAvatar />
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 font-mono text-xs text-gray-500 dark:text-gray-400">
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <span>{profile.location} · UTC+8</span>
          </div>
          <div className="font-mono text-xs text-gray-400 dark:text-gray-500">
            {profile.role}
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
          className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 font-mono text-[13px] font-medium text-white shadow-sm hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200 active:scale-95"
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
          className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white/90 px-5 py-3 font-mono text-[13px] font-medium text-gray-900 shadow-2xs hover:bg-gray-50 dark:border-gray-700 dark:bg-[#141418]/90 dark:text-white dark:hover:bg-gray-800 backdrop-blur-md active:scale-95"
        >
          <span className="font-bold text-gray-950 dark:text-white">$</span>
          <span>Open Interactive CLI</span>
        </button>

        <a
          href={`mailto:${profile.email}`}
          onClick={() => sounds.play('tick')}
          className="inline-flex items-center gap-1.5 px-4 py-3 font-mono text-[13px] text-gray-500 hover:text-gray-950 hover:underline dark:text-gray-400 dark:hover:text-white"
        >
          <span>email me ↗</span>
        </a>
      </div>

      {/* Social Badges Row */}
      <div className="reveal d5 relative z-10 mt-8 flex flex-wrap items-center gap-3 font-mono text-[12px] text-gray-500 dark:text-gray-400">
        {socials.map((s) => (
          <a
            key={s.label}
            href={s.url}
            target="_blank"
            rel="noreferrer"
            onClick={() => sounds.play('tick')}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white/70 px-2.5 py-1 backdrop-blur-md transition-all hover:border-gray-400 hover:text-gray-950 dark:border-gray-800 dark:bg-gray-900/60 dark:hover:border-gray-600 dark:hover:text-white hover:-translate-y-0.5"
          >
            <span>{s.label}</span>
            <span className="text-gray-400 dark:text-gray-500">{s.username}</span>
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
