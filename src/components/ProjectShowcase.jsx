import { useEffect, useState } from 'react'
import { projects } from '../portfolioData'
import { sounds } from '../utils/audio'
import SpotlightCard from './SpotlightCard'

function ProjectImageLoop({ images, heroImage, title, onClick }) {
  const [currentIdx, setCurrentIdx] = useState(0)

  // Curate key preview images if images array exists, or fallback to heroImage
  const imageList =
    images && images.length > 0
      ? images.map((img) => (typeof img === 'string' ? img : img.src))
      : heroImage
      ? [heroImage]
      : []

  useEffect(() => {
    if (imageList.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % imageList.length)
    }, 3500) // smooth 3.5s cycle

    return () => clearInterval(interval)
  }, [imageList.length])

  if (imageList.length === 0) return null

  return (
    <div
      onClick={onClick}
      className="relative overflow-hidden border-b border-gray-200/80 bg-gray-950 h-36 sm:h-40 cursor-pointer dark:border-gray-800 select-none"
    >
      {/* Stitched Smooth Crossfading Image Stack */}
      {imageList.map((src, idx) => (
        <img
          key={src}
          src={src}
          alt={`${title} preview ${idx + 1}`}
          className={`absolute inset-0 h-full w-full object-cover object-top transition-all duration-1000 ease-in-out group-hover:scale-103 ${
            currentIdx === idx
              ? 'opacity-100 scale-100 z-10'
              : 'opacity-0 scale-[0.99] z-0 pointer-events-none'
          }`}
        />
      ))}

      {/* Subtle bottom gradient & minimal loop progress indicator */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-center justify-between p-3.5 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
        {imageList.length > 1 && (
          <div className="flex items-center gap-1.5">
            {imageList.slice(0, 8).map((_, dotIdx) => (
              <span
                key={dotIdx}
                className={`h-1 rounded-full transition-all duration-700 ${
                  currentIdx === dotIdx ? 'w-4 bg-white' : 'w-1 bg-white/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>
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

      {/* Grid of Projects with 3D Spotlight Tilt */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <SpotlightCard
            key={project.id}
            className="group flex flex-col justify-between overflow-hidden p-0"
          >
            <div>
              {/* ── Smooth Looping Image Preview ── */}
              <ProjectImageLoop
                images={project.images}
                heroImage={project.heroImage}
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
