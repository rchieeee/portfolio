import { useState } from 'react'
import { projects } from '../portfolioData'
import { sounds } from '../utils/audio'

export default function CaseStudyModal({ slug, onClose }) {
  const [selectedScreenIdx, setSelectedScreenIdx] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  if (!slug) return null
  const project = projects.find((p) => p.slug === slug)
  if (!project) return null

  const isKaban = project.id === 'kaban'
  const isPnp = project.id === 'pnp-ccacgi'
  const isCloudzone = project.id === 'cloudzone-pos'
  const screenshots = project.images || []
  const activeScreenshot = screenshots[selectedScreenIdx] || screenshots[0]

  const handlePrevImg = () => {
    sounds.play('tick')
    setSelectedScreenIdx((prev) => (prev > 0 ? prev - 1 : screenshots.length - 1))
  }

  const handleNextImg = () => {
    sounds.play('tick')
    setSelectedScreenIdx((prev) => (prev < screenshots.length - 1 ? prev + 1 : 0))
  }

  const getHostname = (url) => {
    try {
      return new URL(url).hostname
    } catch {
      return 'Live app'
    }
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
      <div className="relative z-10 flex flex-col max-h-[90vh] w-full max-w-3xl rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-[#0e0f14] text-gray-900 dark:text-gray-100 overflow-hidden">
        
        {/* ── Top Header ── */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800/80">
          <div className="space-y-0.5">
            <div className="font-mono text-[11px] text-gray-400 dark:text-gray-500">
              case study / {project.year} · {project.category}
            </div>
            <h2 className="text-xl font-bold tracking-tight text-gray-950 dark:text-white">
              {project.name}
            </h2>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => sounds.play('tick')}
                className="text-gray-950 hover:underline dark:text-white font-medium"
              >
                Live app ↗
              </a>
            )}

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-950 dark:hover:bg-gray-800 dark:hover:text-white transition-colors cursor-pointer"
              title="Close modal"
            >
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Scrollable Body Area ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 [scrollbar-width:thin]">

          {/* ── Minimal Image Gallery ── */}
          {screenshots.length > 0 && activeScreenshot && (
            <div className="space-y-2.5">
              {/* Main Image Frame with Uncropped Display & Ambient Backdrop */}
              <div className="relative group overflow-hidden rounded-xl border border-gray-200 bg-[#07080c] h-[360px] sm:h-[460px] md:h-[500px] flex items-center justify-center shadow-sm dark:border-gray-800">
                {screenshots.map((scr, idx) => (
                  <div
                    key={scr.id}
                    className={`absolute inset-0 flex items-center justify-center p-2 transition-opacity duration-500 ease-in-out ${
                      selectedScreenIdx === idx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                    }`}
                  >
                    {/* Ambient blurred backdrop glow */}
                    <img
                      src={scr.src}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 h-full w-full object-cover blur-2xl opacity-15 scale-110 pointer-events-none"
                    />

                    {/* Uncropped Full-Fidelity Screenshot */}
                    <img
                      src={scr.src}
                      alt={scr.title}
                      className="relative z-10 max-h-full max-w-full h-auto w-auto object-contain cursor-zoom-in rounded-lg shadow-lg"
                      onClick={() => setLightboxOpen(true)}
                    />
                  </div>
                ))}

                {/* Subtle Hover Arrows */}
                <button
                  type="button"
                  onClick={handlePrevImg}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black transition-opacity opacity-0 group-hover:opacity-100 backdrop-blur-md cursor-pointer"
                  title="Previous image"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={handleNextImg}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black transition-opacity opacity-0 group-hover:opacity-100 backdrop-blur-md cursor-pointer"
                  title="Next image"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              {/* Minimal Caption & Navigation Row */}
              <div className="flex items-center justify-between font-mono text-[11px] text-gray-500 dark:text-gray-400">
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {String(selectedScreenIdx + 1).padStart(2, '0')} / {screenshots.length}
                  </span>
                  <span className="mx-1.5">·</span>
                  <span>{activeScreenshot.title}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrevImg}
                    className="hover:text-gray-950 dark:hover:text-white cursor-pointer"
                  >
                    ← prev
                  </button>
                  <span>/</span>
                  <button
                    type="button"
                    onClick={handleNextImg}
                    className="hover:text-gray-950 dark:hover:text-white cursor-pointer"
                  >
                    next →
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => setLightboxOpen(true)}
                    className="hover:text-gray-950 dark:hover:text-white cursor-pointer"
                  >
                    zoom ⤢
                  </button>
                </div>
              </div>

              {/* Minimal Thumbnail Strip */}
              <div className="flex gap-1.5 overflow-x-auto py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {screenshots.map((scr, idx) => (
                  <button
                    key={scr.id}
                    type="button"
                    onClick={() => {
                      sounds.play('tick')
                      setSelectedScreenIdx(idx)
                    }}
                    className={`relative h-10 w-16 shrink-0 overflow-hidden rounded-md border transition-all cursor-pointer ${
                      selectedScreenIdx === idx
                        ? 'border-gray-950 dark:border-white ring-1 ring-gray-950 dark:ring-white opacity-100'
                        : 'border-gray-200 dark:border-gray-800 opacity-40 hover:opacity-80'
                    }`}
                  >
                    <img src={scr.src} alt={scr.title} className="h-full w-full object-cover object-top" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Editorial Story & Architecture ── */}
          <div className="space-y-5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            {/* Overview */}
            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-gray-950 dark:text-white font-semibold">
                Overview
              </h4>
              <p className="mt-1.5">{project.overview}</p>
            </div>

            {/* KABAN Security & 3FA */}
            {isKaban && (
              <div className="border-t border-gray-100 pt-4 dark:border-gray-800/80">
                <h4 className="font-mono text-xs uppercase tracking-wider text-gray-950 dark:text-white font-semibold">
                  3-Factor Authentication Security
                </h4>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Custom-built without paid third-party auth services to eliminate SaaS costs for the student body:
                </p>
                <ul className="mt-2 space-y-1 font-mono text-xs list-disc pl-4 text-gray-600 dark:text-gray-300">
                  <li>
                    <b className="text-gray-900 dark:text-white">Factor 1:</b> Salted SHA-256 Web Crypto hashing (<code className="text-amber-600 dark:text-amber-400">$kaban$v1$</code>) with Cloudflare Turnstile bot shielding.
                  </li>
                  <li>
                    <b className="text-gray-900 dark:text-white">Factor 2:</b> 6-digit Gmail OTP via Supabase SMTP with a 120-second timer and 3-attempt lockout.
                  </li>
                  <li>
                    <b className="text-gray-900 dark:text-white">Factor 3:</b> Master numeric Security PIN with a 24-hour automatic account freeze upon 3 consecutive failed attempts.
                  </li>
                </ul>
              </div>
            )}

            {/* KABAN Architecture & Offline-First Sync */}
            {isKaban && (
              <div className="border-t border-gray-100 pt-4 dark:border-gray-800/80">
                <h4 className="font-mono text-xs uppercase tracking-wider text-gray-950 dark:text-white font-semibold">
                  Architecture &amp; Offline-First Sync
                </h4>
                <p className="mt-1.5">
                  To prevent lost collections during campus Wi-Fi blackouts, KABAN employs a dual-layer sync model: Supabase PostgreSQL acts as cloud source of truth, backed by a LocalStorage offline queue and SWR cache layer. Realtime WebSocket channels instantly sync transactions across multiple concurrent treasurers.
                </p>
              </div>
            )}

            {/* PNP-CCACGI Specific: Canvas Compression & Field Resiliency */}
            {isPnp && (
              <div className="border-t border-gray-100 pt-4 dark:border-gray-800/80">
                <h4 className="font-mono text-xs uppercase tracking-wider text-gray-950 dark:text-white font-semibold">
                  Client-Side Image Optimization &amp; Field Resiliency
                </h4>
                <p className="mt-1.5">
                  Volunteer member photos captured on mobile cameras (5MB–10MB) are automatically downsampled and compressed via HTML5 Canvas into ultra-compact ~30KB WebP files directly in-browser. This achieves a <b>99.6% reduction in storage and bandwidth</b>, allowing over 25,000 active member profiles to operate within free-tier cloud limits.
                </p>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  During remote provincial radio nets, IndexedDB persistent offline caching buffers all roll call attendance writes locally, auto-synchronizing to Google Cloud Firestore the moment cellular data is restored.
                </p>
              </div>
            )}

            {/* PNP-CCACGI Specific: Disciplinary Escalation & Checkpoint Verification */}
            {isPnp && (
              <div className="border-t border-gray-100 pt-4 dark:border-gray-800/80">
                <h4 className="font-mono text-xs uppercase tracking-wider text-gray-950 dark:text-white font-semibold">
                  3-Stage Disciplinary Escalation &amp; Checkpoint Verification
                </h4>
                <p className="mt-1.5">
                  To ensure only authorized volunteers display organizational vehicle decals at PNP checkpoints, the system enforces a strict 3-stage warning workflow (1st Warning Inactivity → 2nd Impending Removal → 3rd Revocation &amp; Flagging). The system generates official dispatch memorandums formatted with dual organizational crests and dual command signatories (Secretariat &amp; Commander) ready for official print archiving.
                </p>
              </div>
            )}

            {/* CloudZone POS Specific: Bidirectional Reactive Sync & Offline Queue */}
            {isCloudzone && (
              <div className="border-t border-gray-100 pt-4 dark:border-gray-800/80">
                <h4 className="font-mono text-xs uppercase tracking-wider text-gray-950 dark:text-white font-semibold">
                  Bidirectional Stream Sync &amp; Offline SQLite Queue
                </h4>
                <p className="mt-1.5">
                  Instead of polling or relying on a single cloud dependency, CloudZone uses persistent <code>snapshots()</code> listeners on every cashier device. When a cashier rings up a sale, local SQLite writes occur in <b>&lt;1ms (zero-latency)</b>. Mutations queue into an SQLite <code>sync_queue</code> table and drain to Firestore asynchronously. All other connected terminals receive the stream event and update their local databases in seconds.
                </p>
              </div>
            )}

            {/* CloudZone POS Specific: FK-Safe Conflict Resolution & Remote Reset */}
            {isCloudzone && (
              <div className="border-t border-gray-100 pt-4 dark:border-gray-800/80">
                <h4 className="font-mono text-xs uppercase tracking-wider text-gray-950 dark:text-white font-semibold">
                  FK-Safe Cross-Device Merging &amp; Remote Wipe Signal
                </h4>
                <p className="mt-1.5">
                  To prevent silent SQLite foreign key constraint failures during cross-device document merges, the SyncEngine dynamically toggles <code>PRAGMA foreign_keys = OFF</code> during listener-driven upserts. Furthermore, the master admin console features an instant <b>Remote Factory Reset Signal</b>: writing a timestamp to Firestore triggers active cashier listeners to atomically wipe all local SQLite tables and fire an <code>onForceLogout</code> stream, instantly kicking unauthorized terminals back to login.
                </p>
              </div>
            )}

            {/* Key Technical Highlights */}
            <div className="border-t border-gray-100 pt-4 dark:border-gray-800/80">
              <h4 className="font-mono text-xs uppercase tracking-wider text-gray-950 dark:text-white font-semibold">
                Highlights
              </h4>
              <ul className="mt-2 space-y-1 font-mono text-xs list-disc pl-4 text-gray-600 dark:text-gray-400">
                {project.highlights.map((h, idx) => (
                  <li key={idx}>{h}</li>
                ))}
              </ul>
            </div>

            {/* Technologies */}
            <div className="border-t border-gray-100 pt-4 dark:border-gray-800/80">
              <h4 className="font-mono text-xs uppercase tracking-wider text-gray-950 dark:text-white font-semibold">
                Technologies
              </h4>
              <div className="mt-2 flex flex-wrap gap-1.5 font-mono text-xs">
                {project.tools.map((t) => (
                  <span
                    key={t}
                    className="rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-gray-700 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Credits */}
            {project.developer && (
              <div className="border-t border-gray-100 pt-4 dark:border-gray-800/80 font-mono text-xs text-gray-400 dark:text-gray-500 flex flex-wrap items-center justify-between gap-2">
                <div>
                  Developer: <span className="text-gray-900 dark:text-white">{project.developer}</span>
                </div>
                <span>{project.organization || `Production System · ${project.year}`}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Minimal Fixed Bottom Bar ── */}
        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-3.5 dark:border-gray-800/80 font-mono text-xs">
          <div className="flex items-center gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => sounds.play('tick')}
                className="text-gray-950 hover:underline dark:text-white font-medium"
              >
                {getHostname(project.liveUrl)} ↗
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => sounds.play('tick')}
                className="text-gray-400 hover:text-gray-950 dark:text-gray-500 dark:hover:text-white hover:underline"
              >
                GitHub ↗
              </a>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-gray-950 px-4 py-1.5 font-semibold text-white hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>

      {/* ── Fullscreen Lightbox Zoom Modal ── */}
      {lightboxOpen && activeScreenshot && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/95 p-4 sm:p-8 backdrop-blur-xl"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative max-h-full max-w-5xl w-full flex flex-col items-center">
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
            <div className="mt-3 text-center font-mono text-white text-xs">
              <span className="font-bold">{activeScreenshot.title}</span> — {activeScreenshot.desc}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
