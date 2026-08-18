import { experience } from '../portfolioData'

export default function ExperienceTimeline() {
  return (
    <section id="experience" className="py-14 sm:py-20">
      <div className="mb-10">
        <span className="font-mono text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Career Track
        </span>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl dark:text-white">
          Engineering Experience &amp; Milestones
        </h2>
      </div>

      <div className="space-y-4">
        {experience.map((item, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-2xs transition-all hover:border-gray-400 dark:border-gray-800 dark:bg-[#121216] dark:hover:border-gray-700"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-950 dark:text-white">
                  {item.role}
                </h3>
                <p className="font-mono text-xs text-gray-600 dark:text-gray-400">
                  {item.company} · <span>{item.location}</span>
                </p>
              </div>

              <span className="font-mono text-xs font-semibold text-gray-500 dark:text-gray-400">
                {item.period}
              </span>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              {item.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5 border-t border-gray-100 pt-3 dark:border-gray-800">
              {item.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded border border-gray-200 bg-gray-50 px-2 py-0.5 font-mono text-[10.5px] text-gray-700 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
