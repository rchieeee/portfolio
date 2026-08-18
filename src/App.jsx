import { useEffect, useState } from 'react'
import './App.css'
import BentoGrid from './components/BentoGrid'
import CaseStudyModal from './components/CaseStudyModal'
import ContactSection from './components/ContactSection'
import CyberArcadeModal from './components/CyberArcadeModal'
import ExperienceTimeline from './components/ExperienceTimeline'
import HeaderNav from './components/HeaderNav'
import Hero from './components/Hero'
import InteractiveHeroCanvas from './components/InteractiveHeroCanvas'
import ProjectShowcase from './components/ProjectShowcase'
import TechRadar from './components/TechRadar'
import TerminalOverlay from './components/TerminalOverlay'
import TestimonialsSection from './components/TestimonialsSection'
import { sounds } from './utils/audio'

export default function App() {
  const [activeSection, setActiveSection] = useState('top')
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('theme')
      return saved === 'dark' || saved === 'light' || saved === 'system' ? saved : 'system'
    } catch {
      return 'system'
    }
  })
  const [soundEnabled, setSoundEnabled] = useState(() => sounds.enabled)
  const [terminalOpen, setTerminalOpen] = useState(false)
  const [isArcadeOpen, setIsArcadeOpen] = useState(false)
  const [caseStudySlug, setCaseStudySlug] = useState(null)

  // Theme calculation
  const isDarkMode = (themeValue) => {
    if (themeValue === 'dark') return true
    if (themeValue === 'light') return false
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  const applyTheme = (themeValue) => {
    const root = document.documentElement
    const dark = isDarkMode(themeValue)
    if (dark) {
      root.classList.add('dark')
      root.setAttribute('data-theme', 'dark')
    } else {
      root.classList.remove('dark')
      root.setAttribute('data-theme', 'light')
    }
  }

  // Handle instant theme change
  const handleSetTheme = (newTheme) => {
    sounds.play('toggle')
    setTheme(newTheme)
    try {
      localStorage.setItem('theme', newTheme)
    } catch {}
    applyTheme(newTheme)
  }

  // Sound toggle
  const handleToggleSound = () => {
    const state = sounds.toggleSound()
    setSoundEnabled(state)
  }

  // Initialize theme on mount
  useEffect(() => {
    applyTheme(theme)

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleMediaChange = () => {
      if (theme === 'system') {
        applyTheme('system')
      }
    }
    mediaQuery.addEventListener('change', handleMediaChange)
    return () => mediaQuery.removeEventListener('change', handleMediaChange)
  }, [theme])

  // Scrollspy observer for active section
  useEffect(() => {
    const sectionIds = ['top', 'architecture', 'projects', 'stack', 'experience', 'contact']
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0px -55% 0px' }
    )

    sections.forEach((sec) => observer.observe(sec))
    return () => observer.disconnect()
  }, [])

  // Keyboard shortcut: ⌘K or Alt+K for Terminal CLI
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.altKey) && (e.code === 'KeyK' || e.key.toLowerCase() === 'k') && !e.ctrlKey) {
        e.preventDefault()
        setTerminalOpen((prev) => !prev)
      }
      if (e.key === 'Escape') {
        setTerminalOpen(false)
        setIsArcadeOpen(false)
        setCaseStudySlug(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="relative min-h-screen bg-white text-gray-950 transition-colors duration-200 dark:bg-[#0c0d0e] dark:text-[#f5f5f7]">
      {/* ── Global Interactive Magnetic Particle Canvas ── */}
      <InteractiveHeroCanvas theme={theme} />

      {/* Floating Top Navigation */}
      <HeaderNav
        activeSection={activeSection}
        onOpenTerminal={() => setTerminalOpen(true)}
        theme={theme}
        onSetTheme={handleSetTheme}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main Content Area */}
      <main className="main-container relative z-10">
        <Hero onOpenTerminal={() => setTerminalOpen(true)} theme={theme} />
        <BentoGrid />
        <ProjectShowcase onOpenCaseStudy={(slug) => setCaseStudySlug(slug)} />
        <TechRadar />
        <ExperienceTimeline />
        <TestimonialsSection />
        <ContactSection />
      </main>

      {/* Interactive Terminal CLI Overlay (⌘K) */}
      <TerminalOverlay
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
        onLaunchGame={() => {
          setTerminalOpen(false)
          setIsArcadeOpen(true)
        }}
      />

      {/* Real-time Multiplayer Cyber Arcade Modal */}
      <CyberArcadeModal
        isOpen={isArcadeOpen}
        onClose={() => setIsArcadeOpen(false)}
      />

      {/* Technical Case Study Modal */}
      <CaseStudyModal
        slug={caseStudySlug}
        onClose={() => setCaseStudySlug(null)}
      />
    </div>
  )
}
