import { useState } from 'react'
import { profile } from '../portfolioData'
import { SOUND_PROFILES, sounds } from '../utils/audio'

export default function HeaderNav({
  activeSection,
  onOpenTerminal,
  onOpenArcade,
  theme,
  onSetTheme,
  themeCooldown = false,
  soundEnabled,
  onToggleSound,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeProfile, setActiveProfile] = useState(() => sounds.profile)
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent || '')
  const modKey = isMac ? '⌘' : 'Alt'

  const navLinks = [
    { id: 'projects', label: 'projects' },
    { id: 'architecture', label: 'architecture' },
    { id: 'stack', label: 'stack' },
    { id: 'experience', label: 'experience' },
    { id: 'contact', label: 'contact' },
  ]

  const handleNavClick = (id) => {
    sounds.play('press')
    setMobileMenuOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const isDark = theme === 'dark'

  const toggleThemeMode = () => {
    if (themeCooldown) return
    onSetTheme(isDark ? 'light' : 'dark')
  }

  const handleCycleSoundProfile = () => {
    if (!soundEnabled) {
      onToggleSound()
      return
    }
    const currentIdx = SOUND_PROFILES.findIndex((p) => p.id === activeProfile)
    if (currentIdx === SOUND_PROFILES.length - 1) {
      // Cycle to Mute
      onToggleSound()
    } else {
      const nextIdx = currentIdx + 1
      const nextProfile = SOUND_PROFILES[nextIdx].id
      sounds.setProfile(nextProfile)
      setActiveProfile(nextProfile)
    }
  }

  const currentSoundProfile = SOUND_PROFILES.find((p) => p.id === activeProfile) || SOUND_PROFILES[0]

  return (
    <>
      {/* ── Main Navigation Island (Sticky, Centered) ── */}
      <header className="sticky top-4 z-40 mx-auto max-w-fit px-4 pointer-events-none">
        <div className="pointer-events-auto relative flex items-center gap-2 sm:gap-3 rounded-2xl ios-glass px-3.5 py-2 sm:px-4 sm:py-2.5 shadow-lg overflow-hidden">
          {/* Specular top rim */}
          <div className="specular-rim" />

          {/* Brand Logo */}
          <a
            href="#top"
            onClick={() => sounds.play('tick')}
            className="flex items-center gap-2 text-sm font-semibold tracking-tight text-gray-950 dark:text-white pr-1"
          >
            <span className="font-mono font-bold text-[14px]">
              {profile.brand}
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => sounds.play('tick')}
                  className={`rounded-lg px-2.5 py-1 font-mono text-[12px] transition-all ${
                    isActive
                      ? 'bg-white/80 font-semibold text-gray-950 shadow-xs border border-white/70 dark:border-white/10 dark:bg-white/15 dark:text-white backdrop-blur-md'
                      : 'text-gray-600 hover:bg-white/50 hover:text-gray-950 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white'
                  }`}
                >
                  {link.label}
                </a>
              )
            })}
          </nav>

          {/* Action Area */}
          <div className="flex items-center gap-2">
            {/* Cyber Air Hockey 'play' Trigger */}
            <button
              type="button"
              onClick={() => {
                sounds.play('chime')
                onOpenArcade?.()
              }}
              className="ios-glass-pill flex items-center rounded-lg px-2.5 py-1 font-mono text-[11px] font-semibold text-gray-800 dark:text-gray-200 cursor-pointer"
              title="Play Cyber Air Hockey"
            >
              play
            </button>

            {/* Mobile-only theme toggle switch for fast access */}
            <button
              type="button"
              onClick={toggleThemeMode}
              disabled={themeCooldown}
              className="group relative flex h-6 w-11 items-center rounded-full border border-white/60 bg-black/5 p-0.5 shadow-inner transition-colors dark:border-white/15 dark:bg-white/10 cursor-pointer active:scale-95 md:hidden"
              title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle Theme Mode"
            >
              <span
                className={`flex h-4.5 w-4.5 transform items-center justify-center rounded-full shadow-sm transition-transform duration-200 ease-out ${
                  isDark
                    ? 'translate-x-5 bg-white text-gray-950'
                    : 'translate-x-0 bg-gray-900 text-white'
                }`}
              >
                {isDark ? (
                  <svg viewBox="0 0 24 24" fill="none" className="h-2.5 w-2.5">
                    <path d="M20 13.6A8 8 0 1 1 10.4 4a6.2 6.2 0 0 0 9.6 9.6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" className="h-2.5 w-2.5">
                    <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 2v1.5M12 20.5V22M2 12h1.5M20.5 12H22M4.9 4.9l1 1M18.1 18.1l1 1M19.1 4.9l-1 1M5.9 18.1l-1 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
              </span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => {
                sounds.play('toggle')
                setMobileMenuOpen(!mobileMenuOpen)
              }}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-700 hover:bg-white/60 md:hidden dark:text-gray-300 dark:hover:bg-white/10"
              aria-label="Toggle menu"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ── Top-Right Screen Controls: Positioned on Top Right of the Screen ── */}
      <aside
        aria-label="Screen utility controls"
        className="fixed top-4 right-4 sm:right-6 z-40 hidden md:flex items-center gap-1.5 sm:gap-2 rounded-2xl ios-glass p-1.5 sm:px-2.5 sm:py-2 shadow-lg overflow-hidden"
      >
        {/* Specular top rim */}
        <div className="specular-rim" />

        {/* Interactive Terminal Trigger Button ($ CLI) */}
        <button
          type="button"
          onClick={() => {
            sounds.play('chime')
            onOpenTerminal()
          }}
          className="ios-glass-pill flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-[11px] text-gray-800 dark:text-gray-200 cursor-pointer"
          title="Open Interactive CLI Terminal"
        >
          <span className="font-bold text-gray-950 dark:text-white">$</span>
          <span className="hidden lg:inline font-semibold">CLI</span>
          <kbd className="hidden xl:inline rounded bg-black/5 px-1 py-0.5 text-[9px] text-gray-600 dark:bg-white/15 dark:text-gray-300">
            {modKey}+K
          </kbd>
        </button>

        {/* Clean Tactile Theme Switcher */}
        <button
          type="button"
          onClick={toggleThemeMode}
          disabled={themeCooldown}
          className="group relative flex h-6.5 w-12 items-center rounded-full border border-white/60 bg-black/5 p-0.5 shadow-inner transition-colors dark:border-white/15 dark:bg-white/10 cursor-pointer active:scale-95"
          title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle Theme Mode"
        >
          <span
            className={`flex h-5 w-5 transform items-center justify-center rounded-full shadow-sm transition-transform duration-200 ease-out ${
              isDark
                ? 'translate-x-5.5 bg-white text-gray-950'
                : 'translate-x-0 bg-gray-900 text-white'
            }`}
          >
            {isDark ? (
              <svg viewBox="0 0 24 24" fill="none" className="h-2.5 w-2.5">
                <path d="M20 13.6A8 8 0 1 1 10.4 4a6.2 6.2 0 0 0 9.6 9.6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" className="h-2.5 w-2.5">
                <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="2" />
                <path d="M12 2v1.5M12 20.5V22M2 12h1.5M20.5 12H22M4.9 4.9l1 1M18.1 18.1l1 1M19.1 4.9l-1 1M5.9 18.1l-1 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </span>
        </button>

        {/* Unified Tactile Audio Controller */}
        <button
          type="button"
          onClick={handleCycleSoundProfile}
          className={`ios-glass-pill h-6.5 items-center gap-1.5 rounded-full px-2.5 font-mono text-[11px] cursor-pointer active:scale-95 inline-flex ${
            soundEnabled
              ? 'text-gray-900 dark:text-white'
              : 'text-gray-400 dark:text-gray-500 opacity-70'
          }`}
          title={`Audio: ${soundEnabled ? currentSoundProfile.name : 'Muted'} (Click to cycle profile or mute)`}
        >
          {soundEnabled ? (
            <svg className="h-3 w-3 text-gray-700 dark:text-gray-300" viewBox="0 0 24 24" fill="none">
              <path d="M5 10v4h3l4 3V7L8 10H5zM16 9a4 4 0 010 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg className="h-3 w-3 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none">
              <path d="M5 10v4h3l4 3V7L8 10H5zM16 10l5 5M21 10l-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          <span className="font-semibold hidden lg:inline">
            {soundEnabled ? currentSoundProfile.name : 'Muted'}
          </span>
        </button>
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-between ios-glass p-6 md:hidden shadow-2xl backdrop-blur-3xl">
          <div>
            <div className="flex items-center justify-between border-b border-white/60 pb-4 dark:border-white/10">
              <span className="font-mono text-base font-bold text-gray-950 dark:text-white">
                {profile.brand}
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="ios-glass-pill rounded-lg p-2 text-gray-700 dark:text-gray-200"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <nav className="mt-8 flex flex-col gap-2 font-mono text-base">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleNavClick(link.id)}
                  className="rounded-xl px-4 py-3 text-left text-gray-800 hover:bg-white/60 dark:text-gray-200 dark:hover:bg-white/10 transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="space-y-3 border-t border-white/60 pt-5 font-mono text-sm dark:border-white/10">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false)
                sounds.play('chime')
                onOpenArcade?.()
              }}
              className="ios-glass-button flex w-full items-center justify-center rounded-xl py-2.5 font-mono text-sm font-semibold text-gray-900 dark:text-white cursor-pointer"
            >
              play
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false)
                onOpenTerminal()
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-2.5 text-white dark:bg-white dark:text-gray-950 font-semibold shadow-md active:scale-95"
            >
              <span>$ Open CLI Terminal</span>
            </button>

            <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
              <span>Theme Mode:</span>
              <button
                type="button"
                onClick={toggleThemeMode}
                disabled={themeCooldown}
                className="rounded-lg border border-gray-300 px-4 py-1.5 text-xs font-bold text-gray-950 dark:border-gray-700 dark:text-white cursor-pointer"
              >
                Switch to {isDark ? 'Light' : 'Dark'}
              </button>
            </div>

            <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
              <span>Sound Profile:</span>
              <button
                type="button"
                onClick={handleCycleSoundProfile}
                className="rounded-lg border border-gray-300 px-4 py-1.5 text-xs font-bold text-gray-950 dark:border-gray-700 dark:text-white cursor-pointer"
              >
                {soundEnabled ? currentSoundProfile.name : 'Muted'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
