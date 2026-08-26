import { useMemo, useState } from 'react'
import { profile } from '../portfolioData'
import { sounds } from '../utils/audio'
import SpotlightCard from './SpotlightCard'

const PLATFORMS = [
  {
    id: 'web',
    name: 'Full-Stack Web App',
    stack: 'React 19 / Next.js 14 + Node/PostgreSQL',
    baseWeeks: 3,
  },
  {
    id: 'mobile',
    name: 'Mobile POS / Retail System',
    stack: 'Flutter 3 + SQLite Offline + Firebase',
    baseWeeks: 4,
  },
  {
    id: 'civic',
    name: 'Civic / Enterprise Portal',
    stack: 'React 19 + Cloud Firestore + ExcelJS',
    baseWeeks: 3,
  },
  {
    id: 'wordpress',
    name: 'WordPress & WooCommerce',
    stack: 'Custom Theme + PHP + ACF + REST API',
    baseWeeks: 2,
  },
]

const CAPABILITIES = [
  { id: 'offline', name: 'Offline-First & Local DB', weeks: 1.0, icon: '⚡' },
  { id: 'realtime', name: 'Realtime WebSockets / Streams', weeks: 0.8, icon: '🔄' },
  { id: 'auth3fa', name: 'Zero-SaaS 3-Factor Auth', weeks: 0.7, icon: '🔐' },
  { id: 'compression', name: 'Client-Side Image Optimizer (~30KB)', weeks: 0.5, icon: '🖼️' },
  { id: 'receipts', name: 'Printable PDF Receipts / Memos', weeks: 0.5, icon: '📄' },
  { id: 'warning_memo', name: 'Automated Disciplinary Warnings', weeks: 0.6, icon: '⚠️' },
  { id: 'ai_rag', name: 'AI / LLM Integration (RAG / Claude)', weeks: 1.0, icon: '🤖' },
  { id: 'excel_export', name: 'ExcelJS Spreadsheet Engine', weeks: 0.4, icon: '📊' },
  { id: 'rls_rules', name: 'Granular RLS & Cloud Security Rules', weeks: 0.5, icon: '🛡️' },
  { id: 'dark_mode', name: 'Accessible Dark / Light Theme System', weeks: 0.3, icon: '🌓' },
]

const TIMELINES = [
  { id: 'rush', label: '⚡ Rapid Sprint', multiplier: 0.75, note: 'Accelerated milestone cycles' },
  { id: 'standard', label: '🎯 Standard Production', multiplier: 1.0, note: 'Balanced testing & QA' },
  { id: 'enterprise', label: '🛡️ Comprehensive Lifecycle', multiplier: 1.35, note: 'Deep audits & staging' },
]

export default function ProjectEstimator() {
  const [selectedPlatform, setSelectedPlatform] = useState('web')
  const [selectedCaps, setSelectedCaps] = useState(['offline', 'realtime', 'auth3fa'])
  const [selectedTimeline, setSelectedTimeline] = useState('standard')
  const [copied, setCopied] = useState(false)

  const activePlatform = PLATFORMS.find((p) => p.id === selectedPlatform) || PLATFORMS[0]
  const activeTimeline = TIMELINES.find((t) => t.id === selectedTimeline) || TIMELINES[1]

  const toggleCap = (id) => {
    sounds.play('tick')
    setSelectedCaps((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  // Dynamic Estimation Calculations
  const calculated = useMemo(() => {
    const capsWeeks = selectedCaps.reduce((acc, capId) => {
      const cap = CAPABILITIES.find((c) => c.id === capId)
      return acc + (cap ? cap.weeks : 0)
    }, 0)

    const rawTotal = (activePlatform.baseWeeks + capsWeeks) * activeTimeline.multiplier
    const minWeeks = Math.max(1, Math.round(rawTotal * 0.85))
    const maxWeeks = Math.max(minWeeks + 1, Math.round(rawTotal * 1.15))

    let complexity = 'Standard Full-Stack'
    if (selectedCaps.length >= 6) complexity = 'Enterprise Distributed System'
    else if (selectedCaps.length >= 3) complexity = 'Production Grade & Offline Resilient'

    return {
      minWeeks,
      maxWeeks,
      complexity,
      selectedCount: selectedCaps.length,
    }
  }, [activePlatform, selectedCaps, activeTimeline])

  // Generate Structured Markdown Scope
  const generateScopeMarkdown = () => {
    const capsList = selectedCaps
      .map((id) => {
        const c = CAPABILITIES.find((cap) => cap.id === id)
        return `• ${c?.name}`
      })
      .join('\n')

    return `### Project Scope Specification
**Target Platform:** ${activePlatform.name} (${activePlatform.stack})
**Delivery Window:** ~${calculated.minWeeks}–${calculated.maxWeeks} Weeks (${activeTimeline.label})
**Complexity Tier:** ${calculated.complexity}

**Selected Core Capabilities (${calculated.selectedCount}):**
${capsList || '• Standard Core Framework Foundation'}

---
*Generated via Archie S. Boiser Portfolio Estimator (https://archieboiser.vercel.app)*`
  }

  const handleCopyScope = () => {
    sounds.play('success')
    const md = generateScopeMarkdown()
    navigator.clipboard.writeText(md)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleSendEmail = () => {
    sounds.play('press')
    const subject = encodeURIComponent(`Project Inquiry: ${activePlatform.name} (${calculated.minWeeks}-${calculated.maxWeeks} Weeks)`)
    const body = encodeURIComponent(
      `Hi Archie,\n\nI configured a project scope on your portfolio estimator:\n\n` +
      `• Platform: ${activePlatform.name}\n` +
      `• Target Timeline: ~${calculated.minWeeks}–${calculated.maxWeeks} Weeks\n` +
      `• Key Modules (${calculated.selectedCount}):\n` +
      selectedCaps.map((id) => `  - ${CAPABILITIES.find((c) => c.id === id)?.name}`).join('\n') +
      `\n\nLooking forward to discussing availability and collaboration.\n\nBest regards,`
    )
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${profile.email}&su=${subject}&body=${body}`, '_blank')
  }

  return (
    <section id="estimator" className="py-14 sm:py-20 border-t border-gray-200/80 dark:border-gray-800/80">
      {/* Section Header */}
      <div className="mb-10 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Interactive Planning Tool
          </span>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl dark:text-white">
            Project Scope &amp; Delivery Estimator
          </h2>
        </div>
        <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
          Live Architectural Spec Generator
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* ── Left Column: Interactive Selectors (7 cols) ── */}
        <div className="space-y-6 lg:col-span-7">
          {/* Step 1: Platform Selection */}
          <div>
            <label className="font-mono text-xs font-bold uppercase tracking-wider text-gray-950 dark:text-white block mb-2.5">
              1. Select Primary Architecture
            </label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {PLATFORMS.map((plat) => (
                <button
                  key={plat.id}
                  type="button"
                  onClick={() => {
                    sounds.play('tick')
                    setSelectedPlatform(plat.id)
                  }}
                  className={`rounded-xl p-3.5 text-left font-mono text-xs transition-all cursor-pointer ${
                    selectedPlatform === plat.id
                      ? 'border border-gray-950 bg-gray-950 text-white dark:border-white dark:bg-white dark:text-gray-950 font-bold shadow-xs'
                      : 'border border-gray-200 bg-white text-gray-700 hover:border-gray-300 dark:border-gray-800 dark:bg-[#121216] dark:text-gray-300 dark:hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{plat.name}</span>
                    <span className="text-[10px] opacity-70">~{plat.baseWeeks}w</span>
                  </div>
                  <div className="mt-1 text-[11px] font-normal opacity-80 truncate">
                    {plat.stack}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Capabilities & Modules */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="font-mono text-xs font-bold uppercase tracking-wider text-gray-950 dark:text-white">
                2. Add-on Capabilities &amp; Modules ({selectedCaps.length} selected)
              </label>
              <span className="font-mono text-[11px] text-gray-400 dark:text-gray-500">
                Click to toggle
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {CAPABILITIES.map((cap) => {
                const isSelected = selectedCaps.includes(cap.id)
                return (
                  <button
                    key={cap.id}
                    type="button"
                    onClick={() => toggleCap(cap.id)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'border border-gray-900 bg-gray-100 text-gray-950 font-bold dark:border-gray-600 dark:bg-[#1e2028] dark:text-white shadow-xs'
                        : 'border border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-gray-800 dark:bg-[#101115] dark:text-gray-400 dark:hover:border-gray-700'
                    }`}
                  >
                    <span>{cap.icon}</span>
                    <span>{cap.name}</span>
                    <span className={`text-[10px] ${isSelected ? 'text-gray-900 dark:text-white font-bold' : 'text-gray-400'}`}>
                      {isSelected ? '✓' : '+'}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Step 3: Target Timeline Preference */}
          <div>
            <label className="font-mono text-xs font-bold uppercase tracking-wider text-gray-950 dark:text-white block mb-2.5">
              3. Delivery Pace &amp; Sprint Mode
            </label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {TIMELINES.map((time) => (
                <button
                  key={time.id}
                  type="button"
                  onClick={() => {
                    sounds.play('tick')
                    setSelectedTimeline(time.id)
                  }}
                  className={`rounded-xl p-3 text-left font-mono text-xs transition-all cursor-pointer ${
                    selectedTimeline === time.id
                      ? 'border border-gray-950 bg-gray-950 text-white dark:border-white dark:bg-white dark:text-gray-950 font-bold shadow-xs'
                      : 'border border-gray-200 bg-white text-gray-700 hover:border-gray-300 dark:border-gray-800 dark:bg-[#121216] dark:text-gray-300 dark:hover:border-gray-700'
                  }`}
                >
                  <div>{time.label}</div>
                  <div className="mt-0.5 text-[10.5px] font-normal opacity-75">
                    {time.note}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right Column: Dynamic Live Estimate Output (5 cols) ── */}
        <div className="lg:col-span-5">
          <SpotlightCard className="h-full flex flex-col justify-between p-6 sm:p-7 border border-gray-200 bg-white dark:border-gray-800 dark:bg-[#111217]">
            <div className="space-y-5">
              {/* Header Badge */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-gray-950 dark:text-white">
                  Live Scope Estimate
                </span>
                <span className="font-mono text-[10.5px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                  ● Available for Work
                </span>
              </div>

              {/* Delivery Window Stat */}
              <div>
                <div className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl dark:text-white">
                  ~{calculated.minWeeks}–{calculated.maxWeeks} <span className="text-lg font-normal text-gray-500">Weeks</span>
                </div>
                <div className="mt-1 font-mono text-xs text-gray-500 dark:text-gray-400">
                  Estimated development &amp; QA turnaround
                </div>
              </div>

              {/* Scope Breakdown */}
              <div className="space-y-2 rounded-xl border border-gray-100 bg-gray-50/80 p-3.5 dark:border-gray-800/80 dark:bg-[#0c0d12] font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Architecture:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{activePlatform.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Complexity:</span>
                  <span className="font-semibold text-gray-900 dark:text-white truncate max-w-[170px]">{calculated.complexity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Selected Modules:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{calculated.selectedCount} capabilities</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2 font-mono text-xs">
                <button
                  type="button"
                  onClick={handleSendEmail}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gray-950 py-3 font-semibold text-white hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200 transition-all cursor-pointer shadow-xs active:scale-98"
                >
                  <span>Book Archie with this Scope ↗</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyScope}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-300 py-2.5 font-medium text-gray-800 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-[#181a22] transition-all cursor-pointer active:scale-98"
                >
                  <span>{copied ? '✓ Scope Copied to Clipboard!' : '📋 Copy Scoped Specification'}</span>
                </button>
              </div>
            </div>

            <div className="mt-5 border-t border-gray-100 pt-3 text-center font-mono text-[11px] text-gray-400 dark:border-gray-800 dark:text-gray-500">
              No commitments. Instant structured specification ready for review.
            </div>
          </SpotlightCard>
        </div>
      </div>
    </section>
  )
}
