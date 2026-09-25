import { testimonials } from '../portfolioData'

export default function TestimonialsSection() {
  return (
    <section className="py-14 sm:py-20">
      <div className="mb-10">
        <span className="font-mono text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Peer Validation
        </span>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl dark:text-white">
          Recommendations &amp; Collaboration
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {testimonials.map((item, idx) => (
          <div
            key={idx}
            className="ios-glass-card flex flex-col justify-between rounded-2xl p-6 sm:p-7 shadow-md overflow-hidden"
          >
            {/* Apple iOS Physical Specular Top Rim */}
            <div className="specular-rim" />

            <div>
              <span className="font-serif text-3xl text-gray-400 dark:text-gray-500 leading-none">
                &ldquo;
              </span>
              <p className="font-serif text-[14.5px] leading-relaxed text-gray-700 dark:text-gray-300">
                {item.quote}
              </p>
            </div>

            <div className="mt-6 flex items-center gap-3 border-t border-white/60 pt-4 dark:border-white/10">
              <div className="ios-glass flex h-9 w-9 items-center justify-center rounded-full font-mono text-xs font-bold text-gray-950 dark:text-white shadow-xs">
                {item.initials}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-gray-950 dark:text-white">
                  {item.author}
                </div>
                <div className="truncate font-mono text-[11px] text-gray-500 dark:text-gray-400">
                  {item.role}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
