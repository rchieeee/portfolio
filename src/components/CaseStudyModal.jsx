import { useState } from 'react'
import { projects } from '../portfolioData'
import { sounds } from '../utils/audio'

export default function CaseStudyModal({ slug, onClose }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedImgIdx, setSelectedImgIdx] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  if (!slug) return null
  const project = projects.find((p) => p.slug === slug)
  if (!project) return null

  const isKaban = project.id === 'kaban'
  const screenshots = project.images || []

  const categories = ['All', 'Analytics', 'Security (3FA)', 'Treasury Ops', 'Transparency', 'Students', 'Governance']

  const filteredScreenshots =
    activeCategory === 'All'
      ? screenshots
      : screenshots.filter((s) => s.category === activeCategory)

  const activeScreenshot = filteredScreenshots[selectedImgIdx] || filteredScreenshots[0] || screenshots[0]

  const handlePrevImg = () => {
    sounds.play('tick')
    setSelectedImgIdx((prev) => (prev > 0 ? prev - 1 : filteredScreenshots.length - 1))
  }

  const handleNextImg = () => {
    sounds.play('tick')
    setSelectedImgIdx((prev) => (prev < filteredScreenshots.length - 1 ? prev + 1 : 0))
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Main Modal Card */}
      <div className="relative z-10 max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-gray-200 bg-white p-5 shadow-2xl sm:p-8 dark:border-gray-800 dark:bg-[#111216] text-gray-900 dark:text-gray-100">
        {/* Header Bar */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-200 pb-5 dark:border-gray-800">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                {project.badge}
              </span>
              <span className="font-mono text-xs text-gray-400 dark:text-gray-500">
                A.Y. {project.year} · Case Study
              </span>
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-950 dark:text-white">
              {project.name}
            </h2>
            <p className="mt-1 font-mono text-xs text-gray-500 dark:text-gray-400">
              {project.category}
            </p>
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => sounds.play('tick')}
                className="hidden sm:inline-flex items-center gap-1 rounded-xl bg-gray-900 px-3.5 py-1.5 font-mono text-xs font-semibold text-white hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200 transition-colors"
              >
                <span>Live Demo</span>
                <span className="text-[10px]">↗</span>
              </a>
            )}

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-950 dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:text-white transition-colors cursor-pointer"
              title="Close modal"
            >
              <svg className="h-5 w-5" viewBox="0 0 16 16" fill="none">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Interactive Screenshot Gallery & Lightbox (For KABAN) ── */}
        {isKaban && screenshots.length > 0 && (
          <div className="mt-6 space-y-4 rounded-2xl border border-gray-200/90 bg-gray-50/70 p-4 sm:p-6 dark:border-gray-800/90 dark:bg-[#0c0d12]/90">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-gray-950 dark:text-white">
                  Interactive Production Gallery ({screenshots.length} System Screens)
                </h4>
              </div>

              {/* Category Filter Chips */}
              <div className="flex flex-wrap gap-1 font-mono text-[10.5px]">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      sounds.play('tick')
                      setActiveCategory(cat)
                      setSelectedImgIdx(0)
                    }}
                    className={`rounded-lg px-2.5 py-1 transition-all ${
                      activeCategory === cat
                        ? 'bg-gray-900 font-semibold text-white dark:bg-white dark:text-gray-950 shadow-xs'
                        : 'bg-white/80 text-gray-600 hover:bg-white dark:bg-gray-900/60 dark:text-gray-400 dark:hover:bg-gray-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Active Screenshot Frame with Lightbox Trigger */}
            {activeScreenshot && (
              <div className="space-y-2">
                <div className="relative group overflow-hidden rounded-xl border border-gray-300/80 bg-gray-950 aspect-16/9 shadow-lg">
                  <img
                    src={activeScreenshot.src}
                    alt={activeScreenshot.title}
                    className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-102 cursor-zoom-in"
                    onClick={() => setLightboxOpen(true)}
                  />

                  {/* Previous / Next Controls */}
                  <button
                    type="button"
                    onClick={handlePrevImg}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/70 p-2 text-white hover:bg-black transition-opacity opacity-0 group-hover:opacity-100 backdrop-blur-md"
                    title="Previous screenshot"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImg}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/70 p-2 text-white hover:bg-black transition-opacity opacity-0 group-hover:opacity-100 backdrop-blur-md"
                    title="Next screenshot"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {/* Bottom Image Info Banner */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 sm:p-4 text-white font-mono flex items-center justify-between">
                    <div>
                      <div className="text-xs sm:text-sm font-bold">{activeScreenshot.title}</div>
                      <div className="text-[10px] sm:text-[11px] text-gray-300 line-clamp-1">{activeScreenshot.desc}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLightboxOpen(true)}
                      className="ml-3 rounded-lg bg-white/20 px-2.5 py-1 text-[10px] text-white hover:bg-white/30 backdrop-blur-md shrink-0 cursor-pointer"
                    >
                      Zoom ⤢
                    </button>
                  </div>
                </div>

                {/* Thumbnails Row */}
                <div className="flex gap-2 overflow-x-auto py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {filteredScreenshots.map((scr, idx) => (
                    <button
                      key={scr.id}
                      type="button"
                      onClick={() => {
                        sounds.play('tick')
                        setSelectedImgIdx(idx)
                      }}
                      className={`relative h-14 w-22 sm:h-16 sm:w-26 shrink-0 overflow-hidden rounded-lg border-2 transition-all cursor-pointer ${
                        selectedImgIdx === idx
                          ? 'border-emerald-500 ring-2 ring-emerald-500/40 scale-105 z-10'
                          : 'border-gray-200 dark:border-gray-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={scr.src} alt={scr.title} className="h-full w-full object-cover object-top" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Technical Deep-Dive Sections ── */}
        <div className="my-6 space-y-6 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          {/* Product Overview */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-gray-950 dark:text-white">
              Product Overview &amp; Production Scope
            </h4>
            <p className="mt-2 text-sm leading-relaxed">{project.overview}</p>
          </div>

          {/* 3-Factor Authentication Architecture (For KABAN) */}
          {isKaban && (
            <div className="rounded-2xl border border-gray-200/90 bg-gray-50/70 p-5 dark:border-gray-800/90 dark:bg-[#15161c]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  🔐 Proprietary 3-Factor Authentication Pipeline (Zero SaaS Identity Cost)
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Built from scratch using native Web Crypto APIs and Supabase SMTP without NextAuth or paid third-party auth services.
              </p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="rounded-xl border border-gray-200 bg-white p-3.5 dark:border-gray-800 dark:bg-[#1a1b24]">
                  <div className="font-bold text-gray-950 dark:text-white text-[11px] uppercase">
                    Factor 1 — Password
                  </div>
                  <p className="mt-1.5 text-[10.5px] text-gray-500 dark:text-gray-400 leading-normal">
                    Salted SHA-256 Web Crypto hashing (<code className="text-amber-500">$kaban$v1$</code>) with Cloudflare Turnstile bot shielding.
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-3.5 dark:border-gray-800 dark:bg-[#1a1b24]">
                  <div className="font-bold text-gray-950 dark:text-white text-[11px] uppercase">
                    Factor 2 — Gmail OTP
                  </div>
                  <p className="mt-1.5 text-[10.5px] text-gray-500 dark:text-gray-400 leading-normal">
                    6-digit one-time code delivered via Supabase SMTP. 120-second active countdown with 3-attempt lockout.
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-3.5 dark:border-gray-800 dark:bg-[#1a1b24]">
                  <div className="font-bold text-gray-950 dark:text-white text-[11px] uppercase">
                    Factor 3 — Security PIN
                  </div>
                  <p className="mt-1.5 text-[10.5px] text-gray-500 dark:text-gray-400 leading-normal">
                    Secondary numerical PIN with 24-hour automatic account freeze upon 3 consecutive failed attempts.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* System Architecture Flow (For KABAN) */}
          {isKaban && project.architecture && (
            <div>
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-gray-950 dark:text-white">
                Dual-Layer Offline-First Architecture
              </h4>
              <div className="mt-2 rounded-xl border border-gray-200 bg-gray-900 p-4 font-mono text-[11px] text-emerald-400 overflow-x-auto">
                <pre className="leading-relaxed">
{`Browser ──► Cloudflare WAF + Turnstile Bot Shield
              │
              ▼
         Next.js 14 (Vercel Edge Middleware · HMAC-SHA256 Token)
              │
    ┌─────────┴──────────┐
    │                    │
 Supabase PostgreSQL   LocalStorage Engine
 (Cloud Source of Truth)  (Offline-First Cache Fallback)
    │                    │
    └─────────┬──────────┘
              │
        In-Memory SWR Cache Layer
              │
        Supabase Realtime WebSocket Channels
        (Multi-admin instant live sync)`}
                </pre>
              </div>

              <ul className="mt-3 space-y-1.5 pl-4 font-mono text-xs list-disc text-gray-600 dark:text-gray-400">
                {project.architecture.map((arch, idx) => (
                  <li key={idx}>{arch}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Engineering Challenge & Solution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-gray-950 dark:text-white">
                The Engineering Challenge
              </h4>
              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed">{project.challenge}</p>
            </div>

            <div>
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-gray-950 dark:text-white">
                The Architectural Solution
              </h4>
              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed">{project.solution}</p>
            </div>
          </div>

          {/* Key Technical Highlights */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-gray-950 dark:text-white">
              Key Technical Highlights
            </h4>
            <ul className="mt-2 space-y-1.5 pl-4 font-mono text-xs list-disc text-gray-600 dark:text-gray-400">
              {project.highlights.map((h, idx) => (
                <li key={idx}>{h}</li>
              ))}
            </ul>
          </div>

          {/* Technologies & Libraries */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-gray-950 dark:text-white">
              Technologies &amp; Libraries
            </h4>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {project.tools.map((t) => (
                <span
                  key={t}
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1 font-mono text-xs text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Developers Credit */}
          {isKaban && (
            <div className="border-t border-gray-200 pt-4 dark:border-gray-800 font-mono text-xs flex flex-wrap items-center justify-between gap-2 text-gray-500 dark:text-gray-400">
              <div>
                Lead Developer &amp; Designer: <b className="text-gray-900 dark:text-white">Archie S. Boiser</b> · Co-Developer: <b className="text-gray-900 dark:text-white">Rico Alentijo</b>
              </div>
              <span className="text-[11px]">Built for Student Council Treasury · A.Y. 2026–2027</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-5 dark:border-gray-800">
          <div className="flex items-center gap-3 font-mono text-xs">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => sounds.play('tick')}
                className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Launch Live App ({new URL(project.liveUrl).hostname}) ↗
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => sounds.play('tick')}
                className="text-gray-500 hover:text-gray-950 dark:text-gray-400 dark:hover:text-white hover:underline"
              >
                GitHub Repo ↗
              </a>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-gray-950 px-5 py-2.5 font-mono text-xs font-semibold text-white hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200 transition-colors cursor-pointer"
          >
            Close Case Study
          </button>
        </div>
      </div>

      {/* ── Fullscreen Lightbox Zoom Modal ── */}
      {lightboxOpen && activeScreenshot && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/95 p-4 sm:p-8 backdrop-blur-xl animate-fade-in"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative max-h-full max-w-6xl w-full flex flex-col items-center">
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute -top-10 right-0 rounded-full bg-white/20 p-2 text-white hover:bg-white/40 cursor-pointer"
            >
              <svg className="h-5 w-5" viewBox="0 0 16 16" fill="none">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            <img
              src={activeScreenshot.src}
              alt={activeScreenshot.title}
              className="max-h-[82vh] w-auto rounded-xl object-contain shadow-2xl border border-gray-800"
            />
            <div className="mt-3 text-center font-mono text-white text-xs sm:text-sm">
              <span className="font-bold">{activeScreenshot.title}</span> — {activeScreenshot.desc}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
