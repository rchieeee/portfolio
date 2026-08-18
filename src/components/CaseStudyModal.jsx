import { projects } from '../portfolioData'
import { sounds } from '../utils/audio'

export default function CaseStudyModal({ slug, onClose }) {
  if (!slug) return null
  const project = projects.find((p) => p.slug === slug)
  if (!project) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl sm:p-8 dark:border-gray-800 dark:bg-[#141418]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Technical Case Study · {project.year}
            </span>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-ink dark:text-white">
              {project.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-ink dark:hover:bg-gray-800 dark:hover:text-white"
          >
            <svg className="h-5 w-5" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Body content */}
        <div className="my-6 space-y-6 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-ink dark:text-white">
              Product Overview
            </h4>
            <p className="mt-1.5">{project.overview}</p>
          </div>

          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-ink dark:text-white">
              The Engineering Challenge
            </h4>
            <p className="mt-1.5">{project.challenge}</p>
          </div>

          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-ink dark:text-white">
              The Architectural Solution
            </h4>
            <p className="mt-1.5">{project.solution}</p>
          </div>

          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-ink dark:text-white">
              Key Technical Highlights
            </h4>
            <ul className="mt-2 space-y-1.5 pl-4 font-mono text-xs list-disc text-gray-600 dark:text-gray-400">
              {project.highlights.map((h, idx) => (
                <li key={idx}>{h}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-ink dark:text-white">
              Technologies &amp; Libraries
            </h4>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {project.tools.map((t) => (
                <span
                  key={t}
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1 font-mono text-xs text-ink dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-5 dark:border-gray-800">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => sounds.play('tick')}
            className="font-mono text-xs font-semibold text-ink hover:underline dark:text-white"
          >
            View Repository on GitHub ↗
          </a>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-ink px-5 py-2.5 font-mono text-xs font-semibold text-white dark:bg-white dark:text-ink"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
