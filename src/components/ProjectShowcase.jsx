import { useState } from 'react'
import { projects } from '../portfolioData'
import { sounds } from '../utils/audio'
import SpotlightCard from './SpotlightCard'

export default function ProjectShowcase({ onOpenCaseStudy }) {
  const flagship = projects.find((p) => p.id === 'kaban') || projects[0]
  const otherProjects = projects.filter((p) => p.id !== flagship.id)

  const [activePreviewIdx, setActivePreviewIdx] = useState(0)

  const previewTabs = [
    { title: 'Treasury Dashboard', img: '/project-images/kaban/1.jpg', label: 'Dark Mode Analytics' },
    { title: '3-Factor Auth (3FA)', img: '/project-images/kaban/14.jpg', label: 'Web Crypto + Turnstile' },
    { title: 'Payment Cashier', img: '/project-images/kaban/5.jpg', label: 'Instant Receipts' },
    { title: 'Public Transparency', img: '/project-images/kaban/17.jpg', label: 'Student Ledger' },
  ]

  return (
    <section id="projects" className="py-14 sm:py-20">
      <div className="mb-10 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Selected Work
          </span>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl dark:text-white">
            Featured Full-Stack &amp; Enterprise Products
          </h2>
        </div>
        <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
          {projects.length} Production Case Studies
        </span>
      </div>

      {/* ── #1 FLAGSHIP HERO SHOWCASE: KABAN ── */}
      {flagship && (
        <div className="mb-10">
          <SpotlightCard className="p-6 sm:p-10 border border-gray-200/90 bg-white/80 dark:border-gray-800/90 dark:bg-[#111217]/90 backdrop-blur-xl" tilt={false}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Information & Architecture Specs */}
              <div className="lg:col-span-6 flex flex-col justify-between h-full space-y-5">
                <div>
                  {/* Status & Category Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 font-mono text-[10.5px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      {flagship.badge}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-[10.5px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active Council Production
                    </span>
                    <span className="font-mono text-xs text-gray-400 dark:text-gray-500 ml-auto">
                      {flagship.year}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-950 dark:text-white">
                    {flagship.name}
                  </h3>
                  <p className="mt-1 font-mono text-xs text-amber-600 dark:text-amber-400/90 font-medium">
                    {flagship.category}
                  </p>

                  <p className="mt-4 text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-300">
                    {flagship.summary}
                  </p>

                  {/* Key Stats Strip */}
                  {flagship.stats && (
                    <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4 font-mono">
                      {flagship.stats.map((st, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl border border-gray-200/80 bg-gray-50/80 p-2.5 dark:border-gray-800/80 dark:bg-[#16171e]"
                        >
                          <div className="text-[10px] uppercase text-gray-400 dark:text-gray-500">
                            {st.label}
                          </div>
                          <div className="mt-1 text-xs font-bold text-gray-900 dark:text-white">
                            {st.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tech stack badges */}
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {flagship.tools.map((t) => (
                      <span
                        key={t}
                        className="rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 font-mono text-[11px] text-gray-700 dark:border-gray-800 dark:bg-gray-900/80 dark:text-gray-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Direct Action Triggers */}
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-200/80 dark:border-gray-800/80">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.play('press')
                      onOpenCaseStudy(flagship.slug)
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-gray-950 px-5 py-2.5 font-mono text-xs font-semibold text-white transition-all hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200 cursor-pointer shadow-sm hover:scale-[1.02]"
                  >
                    <span>Read Deep Case Study</span>
                    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                      <path d="M5 11L11 5M11 5H6M11 5V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {flagship.liveUrl && (
                    <a
                      href={flagship.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => sounds.play('tick')}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-4 py-2.5 font-mono text-xs font-semibold text-gray-900 transition-colors hover:border-gray-400 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
                    >
                      <span>Live App</span>
                      <span className="text-[10px]">↗</span>
                    </a>
                  )}

                  {flagship.githubUrl && (
                    <a
                      href={flagship.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => sounds.play('tick')}
                      className="inline-flex items-center gap-1.5 font-mono text-xs text-gray-500 hover:text-gray-950 underline underline-offset-4 dark:text-gray-400 dark:hover:text-white px-2 py-2"
                    >
                      <span>Repository ↗</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Right Column: Interactive Screenshot Carousel Switcher */}
              <div className="lg:col-span-6 flex flex-col gap-3">
                {/* Active Screenshot Display Frame */}
                <div
                  onClick={() => {
                    sounds.play('tick')
                    onOpenCaseStudy(flagship.slug)
                  }}
                  className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-950 shadow-xl cursor-pointer dark:border-gray-800 aspect-16/10"
                >
                  <img
                    src={previewTabs[activePreviewIdx].img}
                    alt={previewTabs[activePreviewIdx].title}
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-103"
                  />
                  {/* Subtle Dark Gradient Overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                  {/* Bottom Preview Caption */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono text-xs text-white">
                    <span className="font-semibold drop-shadow-sm">
                      {previewTabs[activePreviewIdx].title}
                    </span>
                    <span className="text-[10px] text-gray-300 bg-black/60 px-2 py-0.5 rounded backdrop-blur-md">
                      Click to explore 17 screenshots ↗
                    </span>
                  </div>
                </div>

                {/* Screenshot Switcher Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
                  {previewTabs.map((tab, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        sounds.play('tick')
                        setActivePreviewIdx(idx)
                      }}
                      className={`flex flex-col items-start rounded-xl border p-2 text-left transition-all ${
                        activePreviewIdx === idx
                          ? 'border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-950 shadow-sm'
                          : 'border-gray-200 bg-gray-50/70 text-gray-600 hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-400 dark:hover:border-gray-700'
                      }`}
                    >
                      <span className="text-[11px] font-bold line-clamp-1">{tab.title}</span>
                      <span className="text-[9.5px] opacity-75 line-clamp-1">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </SpotlightCard>
        </div>
      )}

      {/* ── Other Production Projects Grid ── */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {otherProjects.map((project) => (
          <SpotlightCard
            key={project.id}
            className="group flex flex-col justify-between p-6"
          >
            <div>
              {/* Header tags */}
              <div className="flex items-center justify-between gap-2">
                <span className="rounded border border-gray-200 bg-gray-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                  {project.badge}
                </span>
                <span className="font-mono text-[11px] text-gray-500 dark:text-gray-400">
                  {project.year}
                </span>
              </div>

              {/* Title & Tagline */}
              <h3 className="mt-4 text-xl font-bold tracking-tight text-gray-950 dark:text-white group-hover:underline underline-offset-4 decoration-gray-300 dark:decoration-gray-700">
                {project.name}
              </h3>
              <p className="font-mono text-[11.5px] text-gray-500 dark:text-gray-400">
                {project.category}
              </p>

              <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {project.summary}
              </p>

              {/* Tools list */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {project.tools.map((tool) => (
                  <span
                    key={tool}
                    className="rounded border border-gray-200 bg-gray-50 px-2 py-0.5 font-mono text-[10.5px] text-gray-700 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-300"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-800">
              <button
                type="button"
                onClick={() => {
                  sounds.play('tick')
                  onOpenCaseStudy(project.slug)
                }}
                className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-gray-950 hover:underline dark:text-white cursor-pointer"
              >
                <span>Read case study</span>
                <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" viewBox="0 0 16 16" fill="none">
                  <path d="M5 11L11 5M11 5H6M11 5V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => sounds.play('tick')}
                className="font-mono text-xs text-gray-500 hover:text-gray-950 hover:underline dark:text-gray-400 dark:hover:text-white"
              >
                GitHub ↗
              </a>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </section>
  )
}
