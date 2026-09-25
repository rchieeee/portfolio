import { useMemo, useState } from 'react'
import { profile } from '../portfolioData'
import { sounds } from '../utils/audio'

const PRESETS = [
  {
    label: 'Full-Stack Web App',
    techs: ['react', 'nextjs', 'tailwind', 'supabase', 'realtime'],
  },
  {
    label: 'Offline-First Mobile App',
    techs: ['flutter', 'sqlite', 'firestore', 'realtime'],
  },
  {
    label: 'Secure Financial Portal',
    techs: ['nextjs', 'react', 'supabase', 'realtime', 'node'],
  },
  {
    label: 'AI & Biometrics System',
    techs: ['react-native', 'python', 'arcface', 'faiss', 'antispoof'],
  },
]

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
    category: 'Backend & Database',
    technologies: [
      { id: 'node', label: 'Node.js / Express' },
      { id: 'python', label: 'Python / Flask / FastAPI' },
      { id: 'supabase', label: 'Supabase (PostgreSQL)' },
      { id: 'firestore', label: 'Google Cloud Firestore' },
    ],
  },
  {
    category: 'Mobile & Offline Sync',
    technologies: [
      { id: 'react-native', label: 'React Native / Expo' },
      { id: 'flutter', label: 'Flutter 3 / Dart' },
      { id: 'sqlite', label: 'Offline SQLite / Local Cache' },
      { id: 'realtime', label: 'WebSockets / Real-Time Sync' },
    ],
  },
  {
    category: 'AI & Computer Vision',
    technologies: [
      { id: 'arcface', label: 'Face Biometrics (ArcFace)' },
      { id: 'faiss', label: 'Vector Search (FAISS)' },
      { id: 'antispoof', label: 'Anti-Spoofing & Liveness' },
      { id: 'llm', label: 'AI & LLM Integration (RAG)' },
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

  const applyPreset = (techs) => {
    sounds.play('press')
    setSelected(techs)
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
        status: 'Select Your Stack',
        color: 'text-gray-400 dark:text-gray-500',
        borderColor: 'border-gray-200 dark:border-gray-800',
        summary:
          'Click any technologies above or choose a quick preset to see how my hands-on production experience matches your project.',
        verifiedProjects: [],
      }
    }

    // High compatibility benchmark since all items represent Archie's core production stack
    const score = Math.min(94 + Math.round((count / 16) * 6), 100)

    const projects = []
    if (selected.some((s) => ['nextjs', 'react', 'supabase', 'realtime'].includes(s))) {
      projects.push({
        name: 'KABAN Treasury System',
        stack: 'Next.js 14 + Supabase + 3FA',
        desc: 'Enterprise treasury portal with multi-factor authentication, row-level security, and audit trails.',
      })
    }
    if (selected.some((s) => ['flutter', 'sqlite', 'firestore'].includes(s))) {
      projects.push({
        name: 'CloudZone POS',
        stack: 'Flutter + SQLite + Firestore',
        desc: 'Retail POS built for 100% offline reliability with automatic cloud synchronization when online.',
      })
    }
    if (selected.some((s) => ['react', 'firestore', 'sqlite'].includes(s))) {
      projects.push({
        name: 'PNP-CCACGI Portal',
        stack: 'React 19 + Canvas Optimization',
        desc: 'Police auxiliary management system serving 25,000+ officers with in-browser image compression.',
      })
    }
    if (selected.some((s) => ['react-native', 'python', 'arcface', 'faiss', 'antispoof'].includes(s))) {
      projects.push({
        name: 'Checkpoint Biometrics',
        stack: 'Expo + Python ArcFace + FAISS',
        desc: 'High-speed facial recognition and vector similarity search operating locally with zero cloud API costs.',
      })
    }
    if (selected.some((s) => ['wordpress'].includes(s))) {
      projects.push({
        name: 'Headless WooCommerce Architecture',
        stack: 'WordPress REST API + React',
        desc: 'Custom digital storefront engineered for fast product browsing and secure checkout.',
      })
    }

    let advice =
      'I have direct production experience with this tech stack. From database design to responsive frontend interfaces, I can jump straight into your project and start delivering without a learning curve.'

    if (selected.includes('sqlite') || selected.includes('realtime')) {
      advice =
        'I specialize in offline-first and real-time architectures. In systems like CloudZone POS and PNP-CCACGI, I built local SQLite/IndexedDB queues so users never lose work when internet cuts out, auto-syncing seamlessly when reconnected.'
    } else if (selected.includes('arcface') || selected.includes('faiss')) {
      advice =
        'I have hands-on experience building local AI and biometric pipelines. I have extracted facial embeddings and performed sub-millisecond FAISS vector similarity search on local networks without expensive third-party cloud API bills.'
    } else if (selected.includes('nextjs') || selected.includes('supabase')) {
      advice =
        'I build secure, high-performance web applications with Next.js and Supabase. In systems like KABAN, I engineered rock-solid Row-Level Security, multi-factor authentication, and instant live updates.'
    }

    return {
      score,
      status: score >= 98 ? 'Ready to Build Immediately' : 'High Production Fit',
      color: 'text-emerald-600 dark:text-emerald-400',
      borderColor: 'border-emerald-500/30 dark:border-emerald-500/20',
      summary: advice,
      verifiedProjects: projects,
    }
  }, [selected])

  const selectedLabels = useMemo(() => {
    const all = TECH_CATEGORIES.flatMap((c) => c.technologies)
    return selected.map((id) => all.find((t) => t.id === id)?.label).filter(Boolean)
  }, [selected])

  const inquiryUrl = useMemo(() => {
    const subject = encodeURIComponent(`Project Inquiry — Tech Stack Match (${analysis.score}%)`)
    const body = encodeURIComponent(
      `Hello Archie,\n\nI checked your portfolio and matched our project stack on your Tech Stack Matcher:\n\nTarget Stack:\n- ${selectedLabels.join(
        '\n- '
      )}\n\nMatch Rating: ${analysis.score}%\n\nI'd like to discuss our project scope, timeline, and availability.\n\nBest regards,`
    )
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${profile.email}&su=${subject}&body=${body}`
  }, [selectedLabels, analysis.score])

  return (
    <section id="stack-fit" className="py-14 sm:py-20">
      <div className="relative isolate rounded-3xl ios-glass-card p-6 sm:p-10 shadow-xl overflow-hidden">
        {/* Apple iOS Physical Specular Top Rim */}
        <div className="specular-rim" />
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/60 pb-6 dark:border-white/10">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl dark:text-white">
              Can I Build Your Project?
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Pick your tech stack to inspect real production match
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 font-mono text-xs whitespace-nowrap">
            <button
              type="button"
              onClick={handleSelectAll}
              className="ios-glass-pill rounded-lg px-3 py-1 text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              Select all
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="ios-glass-pill rounded-lg px-3 py-1 text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>

        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          Select the tools your project needs (or choose a quick preset below). See my hands-on production experience,
          actual systems I have already shipped with this stack, and how ready I am to build it for you.
        </p>

        {/* Quick Presets Strip */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-gray-400 dark:text-gray-500 font-semibold mr-1">
            Quick Presets:
          </span>
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => applyPreset(preset.techs)}
              className="ios-glass-pill rounded-lg px-2.5 py-1 font-mono text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Categories Matrix */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {TECH_CATEGORIES.map((group) => (
            <div
              key={group.category}
              className="ios-glass rounded-2xl p-4 sm:p-5 shadow-xs"
            >
              <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
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
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs font-medium transition-all cursor-pointer ${
                        isChecked
                          ? 'border border-gray-950 bg-gray-950 text-white shadow-xs dark:border-white/40 dark:bg-white dark:text-gray-950 scale-[1.02]'
                          : 'ios-glass-pill text-gray-700 dark:text-gray-300'
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
        <div className="ios-glass-card mt-8 rounded-2xl p-6 shadow-md border-emerald-500/40">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/60 pb-5 dark:border-white/10">
            <div>
              <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Project Match Rating
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
              How I Can Help You
            </h4>
            <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              {analysis.summary}
            </p>

            {analysis.verifiedProjects.length > 0 && (
              <div className="mt-5">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Real Systems I Have Built With This Stack:
                </span>
                <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {analysis.verifiedProjects.map((project) => (
                    <div
                      key={project.name}
                      className="ios-glass rounded-xl p-3 shadow-2xs"
                    >
                      <div>
                        <span className="font-mono text-xs font-bold text-gray-900 dark:text-white">
                          {project.name}
                        </span>
                      </div>
                      <div className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {project.stack}
                      </div>
                      <p className="mt-1 text-xs text-gray-600 dark:text-gray-300 leading-snug">
                        {project.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action CTA */}
          <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-white/60 dark:border-white/10">
            <a
              href={inquiryUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => sounds.play('press')}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-950 px-5 py-3 font-mono text-xs font-semibold text-white shadow-md hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-100 cursor-pointer active:scale-95 transition-all"
            >
              <span>Discuss Your Project ({analysis.score}% Match) →</span>
            </a>

            <span className="font-mono text-[11px] text-gray-500 dark:text-gray-400">
              Direct email to Archie · Usually replies within 2 hours
            </span>
          </div>
        </div>

      </div>
    </section>
  )
}
