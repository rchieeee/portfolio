import { projects } from '../portfolioData'
import { sounds } from '../utils/audio'
import SpotlightCard from './SpotlightCard'

export default function ProjectShowcase({ onOpenCaseStudy }) {
  return (
    <section id="projects" className="py-14 sm:py-20">
      <div className="mb-10 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Selected Work
          </span>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl dark:text-white">
            Featured Full-Stack &amp; AI Products
          </h2>
        </div>
        <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
          {projects.length} Production Case Studies
        </span>
      </div>

      {/* Grid of Projects with 3D Spotlight Tilt (Uniform 2-Column Layout with Visual Previews) */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <SpotlightCard
            key={project.id}
            className="group flex flex-col justify-between overflow-hidden p-0"
          >
            <div>
              {/* ── Top Visual Preview Banner / Browser Frame ── */}
              <div
                onClick={() => {
                  sounds.play('tick')
                  onOpenCaseStudy(project.slug)
                }}
                className="relative overflow-hidden border-b border-gray-200/80 bg-gray-950 aspect-16/9 cursor-pointer dark:border-gray-800"
              >
                {project.id === 'kaban' ? (
                  <>
                    <img
                      src="/project-images/kaban/1.jpg"
                      alt="KABAN Student Council Treasury System Dashboard"
                      className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Dark Glass Overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0c0d10] via-black/30 to-black/60" />
                  </>
                ) : project.id === 'kanso' ? (
                  <div className="flex h-full w-full flex-col justify-between bg-gradient-to-br from-[#1c1917] via-[#121110] to-[#090807] p-5 font-mono text-xs text-stone-300 transition-transform duration-500 group-hover:scale-103">
                    <div className="flex items-center justify-between text-[11px] text-stone-400 border-b border-stone-800 pb-2">
                      <span>kanso-studio.commerce</span>
                      <span className="text-amber-400">● 100 Performance</span>
                    </div>
                    <div className="space-y-1 my-auto">
                      <div className="text-sm font-bold text-white tracking-tight">Kanso Minimalist Flagship</div>
                      <div className="text-[11px] text-stone-400">Headless Shopify + Next.js App Router</div>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-stone-500">
                      <span>Sub-second page transitions</span>
                      <span className="text-stone-300">Stripe API Checkout</span>
                    </div>
                  </div>
                ) : project.id === 'common-ground' ? (
                  <div className="flex h-full w-full flex-col justify-between bg-gradient-to-br from-[#0c1829] via-[#09111c] to-[#05090f] p-5 font-mono text-xs text-blue-200 transition-transform duration-500 group-hover:scale-103">
                    <div className="flex items-center justify-between text-[11px] text-blue-400 border-b border-blue-900/60 pb-2">
                      <span>common-ground.io</span>
                      <span className="text-emerald-400">● Live WebSockets</span>
                    </div>
                    <div className="space-y-1 my-auto">
                      <div className="text-sm font-bold text-white tracking-tight">Builder Community Arena</div>
                      <div className="text-[11px] text-blue-300">Real-time discussion streams &amp; live chapter maps</div>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-blue-400/80">
                      <span>Regional Tech Chapters</span>
                      <span className="text-blue-200">Instant Event Sync</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full w-full flex-col justify-between bg-gradient-to-br from-[#1b0d26] via-[#100717] to-[#08030c] p-5 font-mono text-xs text-purple-200 transition-transform duration-500 group-hover:scale-103">
                    <div className="flex items-center justify-between text-[11px] text-purple-400 border-b border-purple-900/60 pb-2">
                      <span>synapse-engine.dev</span>
                      <span className="text-purple-300">● AST Sandbox</span>
                    </div>
                    <div className="space-y-1 my-auto">
                      <div className="text-sm font-bold text-white tracking-tight">Deterministic AI Harness</div>
                      <div className="text-[11px] text-purple-300">Automated AST code transformations with lint verification</div>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-purple-400/80">
                      <span>Zero Hallucination</span>
                      <span className="text-purple-200">Visual Code Diff</span>
                    </div>
                  </div>
                )}

                {/* Mockup Browser Window Controls Header */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <div className="flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 backdrop-blur-md font-mono text-[10px] text-gray-300">
                    <span className="h-2 w-2 rounded-full bg-red-500/80" />
                    <span className="h-2 w-2 rounded-full bg-yellow-500/80" />
                    <span className="h-2 w-2 rounded-full bg-emerald-500/80" />
                    <span className="ml-1 opacity-75">
                      {project.id === 'kaban' ? 'treasurer-system.vercel.app' : project.slug}
                    </span>
                  </div>

                  <span className="rounded-md border border-white/10 bg-black/70 px-2 py-0.5 font-mono text-[10px] font-semibold text-white backdrop-blur-md">
                    {project.badge}
                  </span>
                </div>

                {/* Bottom Click to View Overlay */}
                <div className="absolute bottom-2.5 right-3 pointer-events-none">
                  <span className="rounded-lg bg-black/70 px-2 py-1 font-mono text-[10px] text-gray-300 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                    Inspect Screenshots ↗
                  </span>
                </div>
              </div>

              {/* ── Content Section ── */}
              <div className="p-6 sm:p-7">
                {/* Header tags */}
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-amber-600 dark:text-amber-400 font-semibold">
                    {project.category}
                  </span>
                  <span className="font-mono text-[11px] text-gray-500 dark:text-gray-400">
                    {project.year}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mt-2 text-xl font-bold tracking-tight text-gray-950 dark:text-white group-hover:underline underline-offset-4 decoration-gray-300 dark:decoration-gray-700">
                  {project.name}
                </h3>

                <p className="mt-2.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
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
            </div>

            {/* Action Buttons Footer */}
            <div className="mx-6 sm:mx-7 mb-6 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-800">
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

              <div className="flex items-center gap-3 font-mono text-xs">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => sounds.play('tick')}
                    className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                  >
                    Live ↗
                  </a>
                )}
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => sounds.play('tick')}
                  className="text-gray-500 hover:text-gray-950 hover:underline dark:text-gray-400 dark:hover:text-white"
                >
                  GitHub ↗
                </a>
              </div>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </section>
  )
}
