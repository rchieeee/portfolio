import { useState } from 'react'
import { projects } from '../portfolioData'
import { sounds } from '../utils/audio'

export default function CaseStudyModal({ slug, onClose }) {
  const [selectedScreenIdx, setSelectedScreenIdx] = useState(0)
  const [activeFactor, setActiveFactor] = useState(1) // 3FA interactive switcher
  const [lightboxOpen, setLightboxOpen] = useState(false)

  if (!slug) return null
  const project = projects.find((p) => p.slug === slug)
  if (!project) return null

  const isKaban = project.id === 'kaban'
  const screenshots = project.images || []

  // Curated interactive tabs for KABAN
  const curatedKabanTabs = [
    { label: 'Analytics Dashboard', idx: 0, tag: 'Dark Mode', desc: 'Real-time financial flow, collection turnouts, and cashflow charts.' },
    { label: '3-Factor Auth (3FA)', idx: 2, tag: 'Security', desc: 'Factor 1 Password + Turnstile, Factor 2 Gmail OTP, Factor 3 PIN.' },
    { label: 'Payables & Scope', idx: 5, tag: 'Fee Engine', desc: 'Dynamic targeting rules for courses, year levels, and sections.' },
    { label: 'Cashier & Receipts', idx: 7, tag: 'Disbursement', desc: 'Instant student search, cashier change calculator, and PDF receipts.' },
    { label: 'Public Transparency', idx: 10, tag: 'Zero Friction', desc: 'Frictionless student ledger with anti-scraping rate limiter.' },
    { label: 'Audit Trail Logs', idx: 15, tag: 'Governance', desc: 'Immutable activity ledger with officer digital signatures.' },
  ]

  const activeScreenshot = screenshots[selectedScreenIdx] || screenshots[0]

  const handleSelectTab = (idx) => {
    sounds.play('tick')
    setSelectedScreenIdx(idx)
  }

  const handlePrevImg = () => {
    sounds.play('tick')
    setSelectedScreenIdx((prev) => (prev > 0 ? prev - 1 : screenshots.length - 1))
  }

  const handleNextImg = () => {
    sounds.play('tick')
    setSelectedScreenIdx((prev) => (prev < screenshots.length - 1 ? prev + 1 : 0))
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Main Modal Surface */}
      <div className="relative z-10 max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-gray-200 bg-white p-5 shadow-2xl sm:p-8 dark:border-gray-800 dark:bg-[#111217] text-gray-900 dark:text-gray-100 [scrollbar-width:thin]">
        {/* ── Top Header ── */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-200 pb-5 dark:border-gray-800">
          <div>
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-gray-500 dark:text-gray-400">
              <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                {project.badge}
              </span>
              <span>·</span>
              <span className="font-semibold text-gray-900 dark:text-white">A.Y. {project.year}</span>
              <span>·</span>
              <span>{project.category}</span>
            </div>

            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-950 dark:text-white">
              {project.name}
            </h2>
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => sounds.play('tick')}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gray-950 px-3.5 py-2 font-mono text-xs font-semibold text-white hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200 transition-colors shadow-sm cursor-pointer"
              >
                <span>Live App</span>
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

        {/* ── Interactive Mac / Browser Device Viewport (KABAN) ── */}
        {isKaban && screenshots.length > 0 && (
          <div className="mt-6 space-y-3">
            {/* Quick Interactive Module Navigator */}
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                {curatedKabanTabs.map((tab) => (
                  <button
                    key={tab.label}
                    type="button"
                    onClick={() => handleSelectTab(tab.idx)}
                    className={`rounded-lg px-3 py-1.5 transition-all whitespace-nowrap cursor-pointer ${
                      selectedScreenIdx === tab.idx
                        ? 'bg-gray-950 font-bold text-white dark:bg-white dark:text-gray-950 shadow-xs'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-900/70 dark:text-gray-400 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className="ml-1.5 opacity-60 text-[9.5px]">[{tab.tag}]</span>
                  </button>
                ))}
              </div>

              <span className="hidden sm:inline font-mono text-[10.5px] text-gray-400 dark:text-gray-500 whitespace-nowrap">
                {selectedScreenIdx + 1} / {screenshots.length} Screens
              </span>
            </div>

            {/* Browser Frame with Traffic Lights */}
            <div className="overflow-hidden rounded-2xl border border-gray-300/80 bg-gray-950 shadow-xl dark:border-gray-800">
              {/* Chrome Top Bar */}
              <div className="flex items-center justify-between border-b border-gray-800 bg-[#0d0e12] px-4 py-2.5 font-mono text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
                  <span className="ml-2 font-mono text-[11px] text-gray-400 hidden sm:inline">
                    treasurer-system.vercel.app
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px]">
                  <span className="text-gray-300 font-semibold">{activeScreenshot.title}</span>
                  <button
                    type="button"
                    onClick={() => setLightboxOpen(true)}
                    className="ml-2 rounded bg-gray-800 px-2 py-0.5 text-[10px] text-gray-300 hover:bg-gray-700 cursor-pointer"
                  >
                    Zoom ⤢
                  </button>
                </div>
              </div>

              {/* Main Screenshot Canvas */}
              <div className="relative group aspect-16/9 bg-[#08080a]">
                <img
                  src={activeScreenshot.src}
                  alt={activeScreenshot.title}
                  className="h-full w-full object-cover object-top cursor-zoom-in transition-transform duration-300 group-hover:scale-[1.01]"
                  onClick={() => setLightboxOpen(true)}
                />

                {/* Left/Right Click Arrows */}
                <button
                  type="button"
                  onClick={handlePrevImg}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/75 p-2.5 text-white hover:bg-black transition-opacity opacity-0 group-hover:opacity-100 backdrop-blur-md cursor-pointer"
                  title="Previous screenshot"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={handleNextImg}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/75 p-2.5 text-white hover:bg-black transition-opacity opacity-0 group-hover:opacity-100 backdrop-blur-md cursor-pointer"
                  title="Next screenshot"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {/* Bottom Context Strip */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-3 sm:p-4 text-white font-mono flex items-center justify-between">
                  <div>
                    <div className="text-xs sm:text-sm font-bold">{activeScreenshot.title}</div>
                    <div className="text-[10px] sm:text-[11px] text-gray-300">{activeScreenshot.desc}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Thumbnail Navigation Strip */}
            <div className="flex gap-2 overflow-x-auto py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {screenshots.map((scr, idx) => (
                <button
                  key={scr.id}
                  type="button"
                  onClick={() => {
                    sounds.play('tick')
                    setSelectedScreenIdx(idx)
                  }}
                  className={`relative h-13 w-20 sm:h-14 sm:w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all cursor-pointer ${
                    selectedScreenIdx === idx
                      ? 'border-amber-500 ring-2 ring-amber-500/40 scale-105 z-10'
                      : 'border-gray-200 dark:border-gray-800 opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={scr.src} alt={scr.title} className="h-full w-full object-cover object-top" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Authentic Developer Insights & Architecture ── */}
        <div className="my-6 space-y-6 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          {/* Authentic Real-World Backstory */}
          <div className="rounded-2xl border border-gray-200/90 bg-gray-50/70 p-5 dark:border-gray-800/90 dark:bg-[#15161d]">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-gray-950 dark:text-white">
              The Real-World Problem We Solved
            </h4>
            <p className="mt-2 leading-relaxed">
              {project.overview}
            </p>
            <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 font-mono text-xs text-amber-700 dark:text-amber-400">
              <b>⚡ Why Custom Built?</b> Student council treasuries handle real student funds every semester, but commercial SaaS tools (Clerk, Stripe Billing, Auth0) charge costly per-user subscriptions that eat into council budgets. We engineered an offline-first stack with zero third-party auth dependencies that runs at 100% reliability for $0 operating cost.
            </div>
          </div>

          {/* Interactive 3FA Architecture Playground */}
          {isKaban && (
            <div className="rounded-2xl border border-gray-200/90 bg-white p-5 dark:border-gray-800/90 dark:bg-[#161720]">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-3 dark:border-gray-800">
                <div>
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Proprietary 3-Factor Authentication Flow
                  </span>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Click each factor to inspect how security gates are enforced:
                  </div>
                </div>
                <div className="flex items-center gap-1 font-mono text-xs">
                  {[1, 2, 3].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => {
                        sounds.play('tick')
                        setActiveFactor(f)
                        if (f === 1) setSelectedScreenIdx(2) // login-3fa
                        if (f === 2) setSelectedScreenIdx(3) // login-otp
                        if (f === 3) setSelectedScreenIdx(4) // login-pin
                      }}
                      className={`rounded-lg px-2.5 py-1 font-bold transition-all cursor-pointer ${
                        activeFactor === f
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
                      }`}
                    >
                      Factor {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Factor Explanation */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div
                  onClick={() => {
                    sounds.play('tick')
                    setActiveFactor(1)
                    setSelectedScreenIdx(2)
                  }}
                  className={`rounded-xl border p-3.5 transition-all cursor-pointer ${
                    activeFactor === 1
                      ? 'border-amber-500 bg-amber-500/10 dark:bg-amber-500/10'
                      : 'border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#1a1b26]'
                  }`}
                >
                  <div className="font-bold text-gray-950 dark:text-white">Factor 1 · Salted Hash + Bot Shield</div>
                  <p className="mt-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                    Salted SHA-256 Web Crypto hashing (<code className="text-amber-500">$kaban$v1$</code>) with Cloudflare Turnstile token validation.
                  </p>
                </div>

                <div
                  onClick={() => {
                    sounds.play('tick')
                    setActiveFactor(2)
                    setSelectedScreenIdx(3)
                  }}
                  className={`rounded-xl border p-3.5 transition-all cursor-pointer ${
                    activeFactor === 2
                      ? 'border-amber-500 bg-amber-500/10 dark:bg-amber-500/10'
                      : 'border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#1a1b26]'
                  }`}
                >
                  <div className="font-bold text-gray-950 dark:text-white">Factor 2 · Gmail OTP</div>
                  <p className="mt-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                    6-digit one-time code sent via Supabase SMTP with 120-second countdown and 3-attempt lockout.
                  </p>
                </div>

                <div
                  onClick={() => {
                    sounds.play('tick')
                    setActiveFactor(3)
                    setSelectedScreenIdx(4)
                  }}
                  className={`rounded-xl border p-3.5 transition-all cursor-pointer ${
                    activeFactor === 3
                      ? 'border-amber-500 bg-amber-500/10 dark:bg-amber-500/10'
                      : 'border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#1a1b26]'
                  }`}
                >
                  <div className="font-bold text-gray-950 dark:text-white">Factor 3 · 24h Freeze PIN</div>
                  <p className="mt-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                    Master numeric PIN code with automatic 24-hour account freeze if entered incorrectly 3 times.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* System Architecture Box */}
          {isKaban && project.architecture && (
            <div>
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-gray-950 dark:text-white">
                Dual-Layer Offline-First Architecture
              </h4>
              <div className="mt-2 rounded-xl border border-gray-200 bg-gray-950 p-4 font-mono text-[11px] text-emerald-400 overflow-x-auto">
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

          {/* Challenge & Solution Grid */}
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

          {/* Technologies */}
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

          {/* Developer Credits */}
          {isKaban && (
            <div className="border-t border-gray-200 pt-4 dark:border-gray-800 font-mono text-xs flex flex-wrap items-center justify-between gap-2 text-gray-500 dark:text-gray-400">
              <div>
                Lead Developer &amp; Designer: <b className="text-gray-900 dark:text-white">Archie S. Boiser</b> · Co-Developer: <b className="text-gray-900 dark:text-white">Rico Alentijo</b>
              </div>
              <span className="text-[11px]">Built for Student Council Treasury · A.Y. 2026–2027</span>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
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
