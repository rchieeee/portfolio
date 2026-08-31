import { projects } from '../portfolioData'
import { sounds } from '../utils/audio'
import SpotlightCard from './SpotlightCard'

function ProjectCoverImage({ image, title, onClick }) {
  if (!image) return null

  return (
    <div
      onClick={onClick}
      className="relative overflow-hidden border-b border-gray-200/80 bg-[#06070a] h-44 sm:h-48 cursor-pointer dark:border-gray-800 select-none"
    >
      {/* Ambient blurred backdrop glow */}
      <img
        src={image}
        alt=""
        aria-hidden="true"
        className="project-cover-bw absolute inset-0 h-full w-full object-cover blur-2xl opacity-20 group-hover:opacity-40 scale-110 pointer-events-none transition-opacity duration-700"
      />

      {/* Main crisp display cover image (smooth color reveal, zero jarring zoom) */}
      <img
        src={image}
        alt={`${title} display cover`}
        className="project-cover-bw relative z-10 h-full w-full object-cover object-center"
      />

      {/* Subtle hover gradient */}
      <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </div>
  )
}

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

      {/* Grid of Projects (2-Column Formation) */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <SpotlightCard
            key={project.id}
            tilt={false}
            className="group flex flex-col justify-between overflow-hidden p-0"
          >
            <div>
              {/* ── Static High-Impact Display Image ── */}
              <ProjectCoverImage
                image={project.displayImage || project.heroImage}
                title={project.name}
                onClick={() => {
                  sounds.play('tick')
                  onOpenCaseStudy(project.slug)
                }}
              />

              {/* ── Card Content ── */}
              <div className="p-6 sm:p-7">
                {/* Header tags */}
                <div className="flex items-center justify-between gap-2 font-mono text-xs">
                  <span className="text-gray-500 dark:text-gray-400">
                    {project.category}
                  </span>
                  <span className="text-gray-400 dark:text-gray-500">
                    {project.year}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mt-2.5 text-xl font-bold tracking-tight text-gray-950 dark:text-white group-hover:underline underline-offset-4 decoration-gray-300 dark:decoration-gray-700">
                  {project.name}
                </h3>

                <p className="mt-2.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  {project.summary}
                </p>

                {/* Tools list (Curated top 4 for minimal card) */}
                <div className="mt-4 flex flex-wrap gap-1.5 font-mono text-[10.5px]">
                  {project.tools.slice(0, 4).map((tool) => (
                    <span
                      key={tool}
                      className="rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-gray-700 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-300"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons Footer */}
            <div className="mx-6 sm:mx-7 mb-6 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-800 font-mono text-xs">
              <button
                type="button"
                onClick={() => {
                  sounds.play('tick')
                  onOpenCaseStudy(project.slug)
                }}
                className="inline-flex items-center gap-1.5 font-semibold text-gray-950 hover:underline dark:text-white cursor-pointer"
              >
                <span>Read case study</span>
                <span className="text-[10px]">↗</span>
              </button>

              <div className="flex items-center gap-3">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => sounds.play('tick')}
                    className="text-gray-600 hover:text-gray-950 dark:text-gray-400 dark:hover:text-white hover:underline"
                  >
                    Live ↗
                  </a>
                )}
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => sounds.play('tick')}
                  className="text-gray-400 hover:text-gray-950 dark:text-gray-500 dark:hover:text-white hover:underline"
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
