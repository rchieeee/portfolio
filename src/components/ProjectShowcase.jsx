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

      {/* Grid of Projects with 3D Spotlight Tilt (Uniform 2-Column Layout) */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <SpotlightCard
            key={project.id}
            className="group flex flex-col justify-between p-6 sm:p-7"
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
                  className="font-mono text-xs text-gray-500 hover:text-gray-950 hover:underline dark:text-gray-400 dark:hover:text-white"
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
