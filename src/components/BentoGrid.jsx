import { useEffect, useState } from 'react'
import { codeSnippets, harnessStages, profile } from '../portfolioData'
import { sounds } from '../utils/audio'
import SpotlightCard from './SpotlightCard'

export default function BentoGrid() {
  const [activeTab, setActiveTab] = useState('frontend')
  const [copied, setCopied] = useState(false)
  const [runningStage, setRunningStage] = useState(null)
  const [manilaTime, setManilaTime] = useState('')

  // Live Manila clock
  useEffect(() => {
    const update = () => {
      setManilaTime(
        new Intl.DateTimeFormat('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: profile.timezone,
        }).format(new Date())
      )
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(codeSnippets[activeTab])
    }
    sounds.play('success')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Interactive AI Harness Simulator
  const handleSimulateHarness = () => {
    sounds.play('toggle')
    setRunningStage(0)

    const runNext = (stage) => {
      if (stage < 4) {
        setRunningStage(stage)
        sounds.play('tick')
        setTimeout(() => runNext(stage + 1), 500)
      } else {
        sounds.play('chime')
        setTimeout(() => setRunningStage(null), 1600)
      }
    }

    setTimeout(() => runNext(1), 400)
  }

  return (
    <section id="architecture" className="py-14 sm:py-20">
      <div className="mb-8">
        <span className="font-mono text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Architecture &amp; Core Systems
        </span>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl dark:text-white">
          Engineered for performance &amp; deterministic AI.
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          An interactive look into the code paradigms, AI harnesses, and live nodes I build with.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Bento 1: Interactive Code Inspector (8 cols) */}
        <SpotlightCard className="flex flex-col justify-between p-5 sm:p-6 lg:col-span-8">
          {/* Header & Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/60 pb-3 dark:border-white/10">
            <div className="flex items-center gap-2 font-mono text-xs text-gray-600 dark:text-gray-400">
              <span className="font-semibold text-gray-950 dark:text-white">Code Inspector</span>
            </div>

            {/* Code Tabs */}
            <div className="ios-glass-inset flex rounded-xl p-1 font-mono text-[11px]">
              {[
                { id: 'frontend', label: 'Frontend' },
                { id: 'backend', label: 'Backend API' },
                { id: 'aiHarness', label: 'AI Harness' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    sounds.play('tick')
                    setActiveTab(tab.id)
                  }}
                  className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-white/90 text-gray-950 dark:bg-white/20 dark:text-white font-semibold shadow-xs border border-white/80 dark:border-white/15 backdrop-blur-md'
                      : 'text-gray-600 hover:text-gray-950 dark:text-gray-400 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Code Viewer Body */}
          <div className="ios-glass-inset relative my-4 overflow-x-auto rounded-xl p-4 font-mono text-[12px] leading-relaxed text-gray-900 dark:text-gray-200 transition-all duration-200">
            <pre>
              <code>{codeSnippets[activeTab]}</code>
            </pre>
          </div>

          {/* Footer with copy button */}
          <div className="flex items-center justify-between border-t border-white/60 pt-3 font-mono text-[11px] text-gray-500 dark:border-white/10 dark:text-gray-400">
            <span>Production snippet</span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="text-gray-950 hover:underline dark:text-white font-semibold cursor-pointer"
            >
              {copied ? '✓ Copied' : 'Copy Code'}
            </button>
          </div>
        </SpotlightCard>

        {/* Bento 2: Manila Live Node Status (4 cols) */}
        <SpotlightCard className="flex flex-col justify-between p-5 sm:p-6 lg:col-span-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Live Node Status
              </span>
              <span className="ios-glass-pill inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </span>
            </div>

            <div className="mt-4">
              <div className="text-3xl font-bold font-mono tracking-tight text-gray-950 dark:text-white">
                {manilaTime || '12:00:00'}
              </div>
              <p className="mt-1 font-mono text-xs text-gray-500">
                Asia/Manila · Philippine Time (UTC+8)
              </p>
            </div>

            <div className="mt-6 space-y-2 border-t border-white/60 pt-4 font-mono text-[11.5px] dark:border-white/10">
              <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                <span>Location:</span>
                <span className="font-semibold text-gray-950 dark:text-white">Lupon, Davao Oriental</span>
              </div>
              <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                <span>Network Ping:</span>
                <span className="font-semibold text-gray-950 dark:text-white">~24ms</span>
              </div>
              <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                <span>Deployment:</span>
                <span className="font-semibold text-gray-950 dark:text-white">Vercel Edge &amp; Docker</span>
              </div>
            </div>
          </div>

          <div className="ios-glass-inset mt-6 rounded-xl p-3 text-center font-mono text-[11px] text-gray-600 dark:text-gray-400">
            Open for remote full-stack roles worldwide.
          </div>
        </SpotlightCard>

        {/* Bento 3: Interactive AI Harness Visualizer (12 cols) */}
        <SpotlightCard className="p-6 sm:p-7 lg:col-span-12" tilt={false}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                AI Engineering Paradigm
              </span>
              <h3 className="text-lg font-bold text-gray-950 dark:text-white">
                How I Build Deterministic AI Harnesses
              </h3>
            </div>

            <button
              type="button"
              onClick={handleSimulateHarness}
              className="ios-glass-button inline-flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-semibold text-gray-900 dark:text-white"
            >
              <span>{runningStage !== null ? '● Running Pipeline...' : '▶ Simulate Harness Run'}</span>
            </button>
          </div>

          {/* 4 Pipeline Stages */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {harnessStages.map((stage, idx) => {
              const isCurrent = runningStage === idx + 1
              const isPast = runningStage !== null && runningStage > idx + 1

              return (
                <div
                  key={stage.step}
                  className={`relative rounded-xl p-4 transition-all duration-300 ${
                    isCurrent
                      ? 'ios-glass-card border-gray-900 bg-white dark:border-white/40 dark:bg-white/15 text-gray-950 dark:text-white shadow-lg scale-[1.02]'
                      : isPast
                      ? 'ios-glass border-emerald-500/40 text-gray-900 dark:text-white'
                      : 'ios-glass text-gray-800 dark:text-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold opacity-60">
                      STAGE {stage.step}
                    </span>
                    <span
                      className={`ios-glass-pill rounded-md px-2 py-0.5 font-mono text-[9.5px] uppercase font-semibold ${
                        isCurrent
                          ? 'border border-current font-bold'
                          : isPast
                          ? 'border border-emerald-500 text-emerald-600 dark:text-emerald-400'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {stage.badge}
                    </span>
                  </div>

                  <h4 className="mt-2 text-sm font-semibold">
                    {stage.name}
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed opacity-80">
                    {stage.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </SpotlightCard>
      </div>
    </section>
  )
}
