import { useState } from 'react'
import { techCategories } from '../portfolioData'
import { sounds } from '../utils/audio'

export default function TechRadar() {
  const [activeCategory, setActiveCategory] = useState(0)

  return (
    <section id="stack" className="py-14 sm:py-20">
      <div className="mb-10 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Technical Toolchain
          </span>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl dark:text-white">
            Languages, Frameworks &amp; Systems
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Category Tabs (4 cols) */}
        <div className="flex flex-row gap-2 overflow-x-auto lg:col-span-4 lg:flex-col">
          {techCategories.map((cat, idx) => (
            <button
              key={cat.name}
              type="button"
              onClick={() => {
                sounds.play('tick')
                setActiveCategory(idx)
              }}
              className={`flex-1 rounded-xl p-3.5 text-left font-mono text-xs transition-all lg:flex-none ${
                activeCategory === idx
                  ? 'border border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-950 font-bold shadow-xs'
                  : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-[#121216] dark:text-gray-400 dark:hover:bg-gray-800/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{cat.name}</span>
                <span className="text-[10px] opacity-70">
                  {cat.items.length} tools
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Active Category Skills Grid (8 cols) */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-2xs lg:col-span-8 dark:border-gray-800 dark:bg-[#121216]">
          <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-800">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-gray-950 dark:text-white">
              {techCategories[activeCategory].name}
            </h3>
            <span className="font-mono text-[11px] text-gray-500 dark:text-gray-400">
              ● Production Proficient
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {techCategories[activeCategory].items.map((item) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-mono text-[12.5px] text-gray-900 transition-colors hover:border-gray-400 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-200 dark:hover:border-gray-600"
              >
                <span>{item}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-gray-900 dark:bg-white" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
