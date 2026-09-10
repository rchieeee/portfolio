import { useMemo, useState } from 'react'
import { profile } from '../portfolioData'
import { sounds } from '../utils/audio'

const TECH_CATEGORIES = [
  {
    category: 'Frontend & Web',
    technologies: [
      { id: 'nextjs', label: 'Next.js 14 (App Router)' },
      { id: 'react', label: 'React 19 / TypeScript' },
      { id: 'tailwind', label: 'Tailwind CSS / shadcn' },
      { id: 'wordpress', label: 'WordPress / WooCommerce' },
    ],
  },
  {
    category: 'Backend & Data Layer',
    technologies: [
      { id: 'node', label: 'Node.js / Express' },
      { id: 'python', label: 'Python / Flask / FastAPI' },
      { id: 'supabase', label: 'Supabase (PostgreSQL / RLS)' },
      { id: 'firestore', label: 'Google Cloud Firestore' },
    ],
  },
  {
    category: 'Mobile & Distributed Sync',
    technologies: [
      { id: 'react-native', label: 'React Native / Expo' },
      { id: 'flutter', label: 'Flutter 3 / Dart' },
      { id: 'sqlite', label: 'Offline SQLite / IndexedDB' },
      { id: 'realtime', label: 'WebSockets / Reactive Streams' },
    ],
  },
  {
    category: 'AI & Computer Vision',
    technologies: [
      { id: 'arcface', label: 'ArcFace / Biometrics' },
      { id: 'faiss', label: 'FAISS Vector Similarity' },
      { id: 'antispoof', label: 'Anti-Spoofing & Liveness' },
      { id: 'llm', label: 'LLM Prompt Harnesses (RAG)' },
    ],
  },
]

export default function TechStackFitChecker() {
  const [selected, setSelected] = useState([
    'react',
    'nextjs',
    'supabase',
    'realtime',
  ])

  const toggleTech = (id) => {
    sounds.play('tick')
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    sounds.play('press')
    const all = TECH_CATEGORIES.flatMap((c) => c.technologies.map((t) => t.id))
    setSelected(all)
  }

  const handleClear = () => {
    sounds.play('tick')
    setSelected([])
  }

  // Calculate dynamic compatibility rating based on verified production experience
  const analysis = useMemo(() => {
    const count = selected.length
    if (count === 0) {
      return {
        score: 0,
        status: 'Awaiting Selection',
        color: 'text-gray-400 dark:text-gray-500',
        borderColor: 'border-gray-200 dark:border-gray-800',
        summary:
          'Select one or more technologies from the matrix above to calculate production fit, architectural feasibility, and implementation runway.',
        verifiedApps: [],
      }
    }

    // High compatibility benchmark since all items represent Archie's core production stack
    const score = Math.min(94 + Math.round((count / 16) * 6), 100)

    const apps = []
    if (selected.some((s) => ['nextjs', 'react', 'supabase', 'realtime'].includes(s))) {
      apps.push('KABAN Treasury System (Next.js 14 + Supabase + 3FA)')
    }
    if (selected.some((s) => ['flutter', 'sqlite', 'firestore'].includes(s))) {
      apps.push('CloudZone POS (Flutter + SQLite + Firestore Sync)')
    }
    if (selected.some((s) => ['react', 'firestore', 'sqlite'].includes(s))) {
      apps.push('PNP-CCACGI System (React 19 + Canvas Compression + IndexedDB)')
    }
    if (selected.some((s) => ['react-native', 'python', 'arcface', 'faiss', 'antispoof'].includes(s))) {
      apps.push('Checkpoint Biometrics (Expo + Python ArcFace + FAISS)')
    }
    if (selected.some((s) => ['wordpress'].includes(s))) {
      apps.push('Custom Headless WordPress & WooCommerce Architecture')
    }

    const uniqueApps = Array.from(new Set(apps))

    let architecturalHighlight =
      'Direct production alignment. Archie has engineered and deployed systems with this exact stack configuration, ensuring proven data pipelines, zero-SaaS authentication, and battle-tested offline resilience.'

    if (selected.includes('sqlite') || selected.includes('realtime')) {
      architecturalHighlight =
        'Exceptional alignment. Your project demands offline-first fault tolerance or real-time synchronization—areas where Archie has architected zero-latency SQLite queues and Supabase WebSocket channels.'
    } else if (selected.includes('arcface') || selected.includes('faiss')) {
      architecturalHighlight =
        'Specialized AI alignment. Archie has proven production experience extracting 512-D vector embeddings and running sub-millisecond FAISS vector similarity search over direct local networks.'
    }

    return {
      score,
      status: score >= 98 ? '100% Production Ready' : 'High Architectural Fit',
      color: 'text-emerald-600 dark:text-emerald-400',
      borderColor: 'border-emerald-500/30 dark:border-emerald-500/20',
      summary: architecturalHighlight,
      verifiedApps: uniqueApps,
    }
  }, [selected])

  const selectedLabels = useMemo(() => {
    const all = TECH_CATEGORIES.flatMap((c) => c.technologies)
    return selected.map((id) => all.find((t) => t.id === id)?.label).filter(Boolean)
  }, [selected])

  const inquiryUrl = useMemo(() => {
    const subject = encodeURIComponent(`Project Inquiry — Architecture Fit (${analysis.score}% Match)`)
    const body = encodeURIComponent(
      `Hello Archie,\n\nI reviewed your portfolio and evaluated our project toolchain on your Stack Compatibility Evaluator:\n\nTarget Stack:\n- ${selectedLabels.join(
        '\n- '
      )}\n\nCompatibility Score: ${analysis.score}%\n\nLet's discuss project scope, milestones, and availability.\n\nBest regards,`
    )
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${profile.email}&su=${subject}&body=${body}`
  }, [selectedLabels, analysis.score])

  return (
    <section id="stack-fit" className="py-14 sm:py-20">
      <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-10 shadow-2xs dark:border-gray-800 dark:bg-[#111216]">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 border-b border-gray-100 pb-6 dark:border-gray-800/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="font-mono text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Technical Feasibility Tool
              </span>
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl dark:text-white">
              Stack Compatibility Evaluator
            </h2>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs">
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-gray-500 hover:text-gray-950 dark:hover:text-white underline cursor-pointer"
            >
              Select all
            </button>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-500 hover:text-gray-950 dark:hover:text-white underline cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>

        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          Select the technologies required for your application to inspect Archie&apos;s architectural alignment,
          matching production systems, and implementation runway.
        </p>

        {/* Categories Matrix */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {TECH_CATEGORIES.map((group) => (
            <div
              key={group.category}
              className="rounded-2xl border border-gray-200 bg-gray-50/50 p-4 sm:p-5 dark:border-gray-800/80 dark:bg-[#15161d]"
            >
              <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                {group.category}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {group.technologies.map((tech) => {
                  const isChecked = selected.includes(tech.id)
                  return (
                    <button
                      key={tech.id}
                      type="button"
                      onClick={() => toggleTech(tech.id)}
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-xs font-medium transition-all cursor-pointer ${
                        isChecked
                          ? 'border-gray-950 bg-gray-950 text-white shadow-xs dark:border-white dark:bg-white dark:text-gray-950'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900/80 dark:text-gray-300 dark:hover:border-gray-700'
                      }`}
                    >
                      <span className="text-[10px]">
                        {isChecked ? '✓' : '+'}
                      </span>
                      <span>{tech.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Analysis Panel */}
        <div className={`mt-8 rounded-2xl border ${analysis.borderColor} bg-gray-50/70 p-6 dark:bg-[#151720]`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200/80 pb-5 dark:border-gray-800">
            <div>
              <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Architectural Alignment Rating
              </div>
              <div className="mt-1 flex items-baseline gap-3">
                <span className={`font-mono text-3xl sm:text-4xl font-extrabold tracking-tight ${analysis.color}`}>
                  {analysis.score > 0 ? `${analysis.score}%` : '—'}
                </span>
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  {analysis.status}
                </span>
              </div>
            </div>

            <div className="font-mono text-xs text-gray-500 dark:text-gray-400">
              Selected Capabilities: <span className="font-bold text-gray-900 dark:text-white">{selected.length}</span> of 16
            </div>
          </div>

          <div className="mt-5">
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
              Engineering Assessment
            </h4>
            <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              {analysis.summary}
            </p>

            {analysis.verifiedApps.length > 0 && (
              <div className="mt-4">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Direct Production Reference Systems:
                </span>
                <ul className="mt-2 space-y-1.5 font-mono text-xs text-gray-700 dark:text-gray-300">
                  {analysis.verifiedApps.map((app) => (
                    <li key={app} className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-emerald-500" />
                      <span>{app}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Action CTA */}
          <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-gray-200/80 dark:border-gray-800">
            <a
              href={inquiryUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => sounds.play('press')}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-950 px-5 py-3 font-mono text-xs font-semibold text-white shadow-sm hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
            >
              <span>Inquire with Selected Architecture ({analysis.score}%) ↗</span>
            </a>

            <span className="font-mono text-[11px] text-gray-500 dark:text-gray-400">
              Direct developer inbox · Average response &lt; 2 hours
            </span>
          </div>
        </div>

      </div>
    </section>
  )
}
