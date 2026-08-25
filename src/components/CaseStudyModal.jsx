import { useState } from 'react'
import { projects } from '../portfolioData'
import { sounds } from '../utils/audio'

export default function CaseStudyModal({ slug, onClose }) {
  const [activeTab, setActiveTab] = useState('gallery') // 'gallery' | 'security' | 'engineering'
  const [selectedScreenIdx, setSelectedScreenIdx] = useState(0)
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeFactor, setActiveFactor] = useState(1)
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

  const activeScreenshot = filteredScreenshots[selectedScreenIdx] || filteredScreenshots[0] || screenshots[0]

  const handlePrevImg = () => {
    sounds.play('tick')
    setSelectedScreenIdx((prev) => (prev > 0 ? prev - 1 : filteredScreenshots.length - 1))
  }

  const handleNextImg = () => {
    sounds.play('tick')
    setSelectedScreenIdx((prev) => (prev < filteredScreenshots.length - 1 ? prev + 1 : 0))
  }

  const switchTab = (tab) => {
    sounds.play('tick')
    setActiveTab(tab)
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
      <div className="relative z-10 flex flex-col max-h-[92vh] w-full max-w-4xl rounded-3xl border border-gray-200/90 bg-white shadow-2xl dark:border-gray-800/90 dark:bg-[#0f1015] text-gray-900 dark:text-gray-100 overflow-hidden">
        
        {/* ── Top Header ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200/80 px-6 py-4 dark:border-gray-800/80 bg-white/50 dark:bg-[#0f1015]/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight text-gray-950 dark:text-white sm:text-xl">
                  {project.name}
                </h2>
                <span className="rounded bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-600 dark:text-amber-400">
                  {project.badge}
                </span>
              </div>
              <p className="font-mono text-xs text-gray-500 dark:text-gray-400">
                {project.category} · A.Y. {project.year}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => sounds.play('tick')}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gray-950 px-3 py-1.5 font-mono text-xs font-semibold text-white hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200 transition-colors shadow-xs"
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
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Tabbed View Switcher ── */}
        {isKaban && (
          <div className="flex items-center gap-2 border-b border-gray-200/80 px-6 py-2.5 font-mono text-xs dark:border-gray-800/80 bg-gray-50/50 dark:bg-[#13141b]/50 overflow-x-auto [scrollbar-width:none]">
            <button
              type="button"
              onClick={() => switchTab('gallery')}
              className={`rounded-lg px-3 py-1.5 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'gallery'
                  ? 'bg-gray-900 font-bold text-white dark:bg-white dark:text-gray-950 shadow-xs'
                  : 'text-gray-600 hover:text-gray-950 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              📸 System Screens ({screenshots.length})
            </button>

            <button
              type="button"
              onClick={() => switchTab('security')}
              className={`rounded-lg px-3 py-1.5 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-gray-900 font-bold text-white dark:bg-white dark:text-gray-950 shadow-xs'
                  : 'text-gray-600 hover:text-gray-950 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              🔐 3FA Security &amp; Architecture
            </button>

            <button
              type="button"
              onClick={() => switchTab('engineering')}
              className={`rounded-lg px-3 py-1.5 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'engineering'
                  ? 'bg-gray-900 font-bold text-white dark:bg-white dark:text-gray-950 shadow-xs'
                  : 'text-gray-600 hover:text-gray-950 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              ⚡ Engineering Deep-Dive &amp; Solved Challenges
            </button>
          </div>
        )}

        {/* ── Scrollable Body Area ── */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 [scrollbar-width:thin]">

          {/* ═════════ TAB 1: SYSTEM SCREENS & GALLERY ═════════ */}
          {activeTab === 'gallery' && (
            <div className="space-y-4">
              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
                <div className="flex flex-wrap gap-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        sounds.play('tick')
                        setActiveCategory(cat)
                        setSelectedScreenIdx(0)
                      }}
                      className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
                        activeCategory === cat
                          ? 'bg-amber-500 font-bold text-white shadow-xs'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800/80 dark:text-gray-400 dark:hover:bg-gray-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <span className="text-gray-400 dark:text-gray-500 text-[10.5px]">
                  Showing {selectedScreenIdx + 1} of {filteredScreenshots.length}
                </span>
              </div>

              {/* Main Browser Frame Display */}
              {activeScreenshot && (
                <div className="overflow-hidden rounded-2xl border border-gray-300/80 bg-gray-950 shadow-xl dark:border-gray-800">
                  {/* Traffic Lights Header */}
                  <div className="flex items-center justify-between border-b border-gray-800/90 bg-[#0d0e13] px-4 py-2 font-mono text-xs text-gray-400">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
                      <span className="ml-2 text-[11px] text-gray-400 hidden sm:inline">
                        treasurer-system.vercel.app
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-gray-300 font-semibold truncate max-w-xs sm:max-w-none">
                        {activeScreenshot.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => setLightboxOpen(true)}
                        className="rounded bg-gray-800 px-2 py-0.5 text-[10px] text-gray-300 hover:bg-gray-700 cursor-pointer"
                      >
                        Zoom ⤢
                      </button>
                    </div>
                  </div>

                  {/* Screenshot Viewport */}
                  <div className="relative group aspect-16/9 bg-[#07080a]">
                    <img
                      src={activeScreenshot.src}
                      alt={activeScreenshot.title}
                      className="h-full w-full object-cover object-top cursor-zoom-in transition-transform duration-300 group-hover:scale-[1.01]"
                      onClick={() => setLightboxOpen(true)}
                    />

                    {/* Nav Arrows */}
                    <button
                      type="button"
                      onClick={handlePrevImg}
                      className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/75 p-2 text-white hover:bg-black transition-opacity opacity-0 group-hover:opacity-100 backdrop-blur-md cursor-pointer"
                      title="Previous"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={handleNextImg}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/75 p-2 text-white hover:bg-black transition-opacity opacity-0 group-hover:opacity-100 backdrop-blur-md cursor-pointer"
                      title="Next"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>

                    {/* Context Caption */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-3 sm:p-4 text-white font-mono">
                      <div className="text-xs sm:text-sm font-bold">{activeScreenshot.title}</div>
                      <div className="text-[10px] sm:text-[11px] text-gray-300">{activeScreenshot.desc}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Thumbnails Strip */}
              <div className="flex gap-2 overflow-x-auto py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {filteredScreenshots.map((scr, idx) => (
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

              {/* Quick Spec Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 font-mono">
                <div className="rounded-xl border border-gray-200/80 bg-gray-50/70 p-3 dark:border-gray-800/80 dark:bg-[#14151c]">
                  <div className="text-[10px] uppercase text-gray-400 dark:text-gray-500">Security</div>
                  <div className="text-xs font-bold text-gray-900 dark:text-white mt-0.5">3-Factor Auth</div>
                </div>
                <div className="rounded-xl border border-gray-200/80 bg-gray-50/70 p-3 dark:border-gray-800/80 dark:bg-[#14151c]">
                  <div className="text-[10px] uppercase text-gray-400 dark:text-gray-500">Data Sync</div>
                  <div className="text-xs font-bold text-gray-900 dark:text-white mt-0.5">Offline-First</div>
                </div>
                <div className="rounded-xl border border-gray-200/80 bg-gray-50/70 p-3 dark:border-gray-800/80 dark:bg-[#14151c]">
                  <div className="text-[10px] uppercase text-gray-400 dark:text-gray-500">Database</div>
                  <div className="text-xs font-bold text-gray-900 dark:text-white mt-0.5">9 RLS Tables</div>
                </div>
                <div className="rounded-xl border border-gray-200/80 bg-gray-50/70 p-3 dark:border-gray-800/80 dark:bg-[#14151c]">
                  <div className="text-[10px] uppercase text-gray-400 dark:text-gray-500">Identity Cost</div>
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">$0 Zero SaaS</div>
                </div>
              </div>
            </div>
          )}

          {/* ═════════ TAB 2: 3FA SECURITY & ARCHITECTURE ═════════ */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Interactive 3FA Flow Simulator */}
              <div className="rounded-2xl border border-gray-200/90 bg-gray-50/70 p-5 dark:border-gray-800/90 dark:bg-[#14151c]">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-3 dark:border-gray-800">
                  <div>
                    <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      Proprietary 3-Factor Authentication Pipeline
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Engineered with native Web Crypto API &amp; Supabase SMTP (zero external identity fees).
                    </p>
                  </div>

                  <div className="flex items-center gap-1 font-mono text-xs">
                    {[1, 2, 3].map((factorNum) => (
                      <button
                        key={factorNum}
                        type="button"
                        onClick={() => {
                          sounds.play('tick')
                          setActiveFactor(factorNum)
                        }}
                        className={`rounded-lg px-3 py-1 font-bold transition-all cursor-pointer ${
                          activeFactor === factorNum
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400'
                        }`}
                      >
                        Factor {factorNum}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Factor Details Card */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                  <div
                    onClick={() => {
                      sounds.play('tick')
                      setActiveFactor(1)
                    }}
                    className={`rounded-xl border p-4 transition-all cursor-pointer ${
                      activeFactor === 1
                        ? 'border-amber-500 bg-amber-500/10 shadow-xs'
                        : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1b24]'
                    }`}
                  >
                    <div className="font-bold text-gray-950 dark:text-white">Factor 1 · Salted Hash + Turnstile</div>
                    <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400 leading-normal">
                      Salted SHA-256 Web Crypto hashing (<code className="text-amber-500">$kaban$v1$</code>) with Cloudflare Turnstile bot shielding.
                    </p>
                  </div>

                  <div
                    onClick={() => {
                      sounds.play('tick')
                      setActiveFactor(2)
                    }}
                    className={`rounded-xl border p-4 transition-all cursor-pointer ${
                      activeFactor === 2
                        ? 'border-amber-500 bg-amber-500/10 shadow-xs'
                        : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1b24]'
                    }`}
                  >
                    <div className="font-bold text-gray-950 dark:text-white">Factor 2 · Gmail OTP</div>
                    <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400 leading-normal">
                      6-digit one-time code delivered via Supabase SMTP with 120-second countdown and 3-attempt lockout.
                    </p>
                  </div>

                  <div
                    onClick={() => {
                      sounds.play('tick')
                      setActiveFactor(3)
                    }}
                    className={`rounded-xl border p-4 transition-all cursor-pointer ${
                      activeFactor === 3
                        ? 'border-amber-500 bg-amber-500/10 shadow-xs'
                        : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1b24]'
                    }`}
                  >
                    <div className="font-bold text-gray-950 dark:text-white">Factor 3 · 24h Freeze PIN</div>
                    <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400 leading-normal">
                      Master numeric security PIN with automatic 24-hour account freeze upon 3 consecutive failed attempts.
                    </p>
                  </div>
                </div>

                {/* Factor Preview Screenshot */}
                <div className="mt-4 overflow-hidden rounded-xl border border-gray-300 dark:border-gray-800 aspect-16/9 bg-black">
                  <img
                    src={`/project-images/kaban/${activeFactor === 1 ? '14' : activeFactor === 2 ? '15' : '16'}.jpg`}
                    alt={`Factor ${activeFactor} Screenshot`}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
              </div>

              {/* Dual-Layer Offline-First Architecture Diagram */}
              <div>
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-gray-950 dark:text-white">
                  Offline-First Architecture &amp; Data Pipeline
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
              </div>
            </div>
          )}

          {/* ═════════ TAB 3: ENGINEERING DEEP-DIVE & CHALLENGES ═════════ */}
          {activeTab === 'engineering' && (
            <div className="space-y-6">
              {/* Backstory */}
              <div className="rounded-2xl border border-gray-200/90 bg-gray-50/70 p-5 dark:border-gray-800/90 dark:bg-[#14151c]">
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-gray-950 dark:text-white">
                  The Real-World Context
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  {project.overview}
                </p>
              </div>

              {/* Engineering Challenges Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-[#14151c]">
                  <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Challenge 1 · Campus Wi-Fi Blackouts
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
                    Erratic school internet during rush enrollment caused duplicate or lost collections. We built a dual-layer LocalStorage cache fallback that queues transactions and auto-syncs to Supabase upon reconnection.
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-[#14151c]">
                  <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Challenge 2 · Dynamic Fee Scope Engine
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
                    Different dues apply only to specific courses (e.g. BSIT vs BSED) or year levels. The scope engine automatically assesses and updates individual student ledgers dynamically.
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-[#14151c]">
                  <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Challenge 3 · Frictionless Public Transparency
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
                    Students shouldn&apos;t need to register accounts to verify balances. We built a zero-login portal protected with a sliding-window rate limiter to prevent student data scraping.
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-[#14151c]">
                  <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Challenge 4 · Multi-Admin Realtime Sync
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
                    Multiple treasurers collect payments concurrently. Supabase Realtime WebSocket channels broadcast instant receipts and balance updates with zero page reloads.
                  </p>
                </div>
              </div>

              {/* Tech Stack Badges */}
              <div>
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-gray-950 dark:text-white">
                  Tech Stack &amp; Toolchain
                </h4>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {project.tools.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1 font-mono text-xs text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Developer Team */}
              <div className="border-t border-gray-200 pt-4 dark:border-gray-800 font-mono text-xs flex flex-wrap items-center justify-between gap-2 text-gray-500 dark:text-gray-400">
                <div>
                  Lead Developer: <b className="text-gray-900 dark:text-white">Archie S. Boiser</b> · Co-Developer: <b className="text-gray-900 dark:text-white">Rico Alentijo</b>
                </div>
                <span>Student Council Treasury Office · A.Y. 2026–2027</span>
              </div>
            </div>
          )}

        </div>

        {/* ── Fixed Bottom Actions Bar ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200/80 px-6 py-4 dark:border-gray-800/80 bg-white/50 dark:bg-[#0f1015]/50 backdrop-blur-md">
          <div className="flex items-center gap-3 font-mono text-xs">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => sounds.play('tick')}
                className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                treasurer-system.vercel.app ↗
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
                GitHub ↗
              </a>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-gray-950 px-5 py-2 font-mono text-xs font-semibold text-white hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200 transition-colors cursor-pointer"
          >
            Close
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
