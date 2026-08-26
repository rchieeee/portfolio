import { useState } from 'react'
import { profile } from '../portfolioData'
import { SOUND_PROFILES, sounds } from '../utils/audio'

export default function HeaderNav({
  activeSection,
  onOpenTerminal,
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
    { id: 'estimator', label: 'estimate' },
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
    const currentIdx = SOUND_PROFILES.findIndex((p) => p.id === activeProfile)
    const nextIdx = (currentIdx + 1) % SOUND_PROFILES.length
    const nextProfile = SOUND_PROFILES[nextIdx].id
    sounds.setProfile(nextProfile)
    setActiveProfile(nextProfile)
  }

  const currentSoundProfile = SOUND_PROFILES.find((p) => p.id === activeProfile) || SOUND_PROFILES[0]

  return (
    <header className="sticky top-4 z-40 mx-auto max-w-4xl px-4 sm:px-6">
      {/* Floating Island Navigation Container */}
      <div className="flex items-center justify-between rounded-2xl border border-gray-200/90 bg-white/90 px-4 py-2.5 shadow-sm backdrop-blur-xl transition-colors dark:border-gray-800/90 dark:bg-[#121318]/90">
        {/* Brand Logo */}
        <a
          href="#top"
          onClick={() => sounds.play('tick')}
          className="flex items-center gap-2 text-sm font-semibold tracking-tight text-gray-950 dark:text-white"
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
                className={`rounded-lg px-3 py-1.5 font-mono text-[12.5px] transition-colors ${
                  isActive
                    ? 'bg-gray-100 font-semibold text-gray-950 dark:bg-gray-800 dark:text-white'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-950 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-white'
                }`}
              >
                {link.label}
              </a>
            )
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Interactive Terminal Trigger Button */}
          <button
            type="button"
            onClick={() => {
              sounds.play('chime')
              onOpenTerminal()
            }}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 font-mono text-[11px] text-gray-700 hover:border-gray-400 hover:bg-white hover:text-gray-950 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-800"
            title="Open Interactive CLI Terminal"
          >
            <span className="font-bold text-gray-950 dark:text-white">$</span>
            <span className="hidden sm:inline">CLI</span>
            <kbd className="hidden rounded bg-gray-200 px-1 py-0.5 text-[9px] text-gray-600 sm:inline dark:bg-gray-800 dark:text-gray-300">
              {modKey}+K
            </kbd>
          </button>

          {/* Clean Tactile Theme Switcher */}
          <button
            type="button"
            onClick={toggleThemeMode}
            disabled={themeCooldown}
            className="group relative flex h-7 w-13 items-center rounded-full border border-gray-300 bg-gray-100 p-0.5 shadow-inner transition-colors hover:border-gray-400 dark:border-gray-700 dark:bg-[#0c0d12] dark:hover:border-gray-600 cursor-pointer active:scale-95"
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Theme Mode"
          >
            {/* Sliding Thumb */}
            <span
              className={`flex h-5.5 w-5.5 transform items-center justify-center rounded-full shadow-sm transition-transform duration-200 ease-out ${
                isDark
                  ? 'translate-x-6 bg-white text-gray-950'
                  : 'translate-x-0 bg-gray-900 text-white'
              }`}
            >
              {isDark ? (
                <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3">
                  <path d="M20 13.6A8 8 0 1 1 10.4 4a6.2 6.2 0 0 0 9.6 9.6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3">
                  <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 2v1.5M12 20.5V22M2 12h1.5M20.5 12H22M4.9 4.9l1 1M18.1 18.1l1 1M19.1 4.9l-1 1M5.9 18.1l-1 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </span>
          </button>

          {/* Tactile Sound Profile & Toggle */}
          <div className="hidden items-center gap-1.5 sm:inline-flex">
            {soundEnabled && (
              <button
                type="button"
                onClick={handleCycleSoundProfile}
                className="flex h-7 items-center gap-1 rounded-full border border-gray-200 bg-gray-50/80 px-2 font-mono text-[10.5px] text-gray-700 hover:border-gray-300 dark:border-gray-800 dark:bg-[#0c0d12] dark:text-gray-300 dark:hover:border-gray-700 cursor-pointer active:scale-95 transition-all"
                title={`Sound FX: ${currentSoundProfile.name} (Click to switch)`}
              >
                <span>{currentSoundProfile.icon}</span>
                <span className="font-semibold">{currentSoundProfile.name.split(' ')[0]}</span>
              </button>
            )}

            {/* Mute/Unmute Button */}
            <button
              type="button"
              onClick={onToggleSound}
              className={`h-7 w-7 items-center justify-center rounded-full border transition-colors inline-flex cursor-pointer ${
                soundEnabled
                  ? 'border-gray-300 bg-gray-100 text-gray-950 dark:border-gray-700 dark:bg-[#0c0d12] dark:text-white'
                  : 'border-gray-200 text-gray-400 hover:text-gray-950 dark:border-gray-800 dark:hover:text-white'
              }`}
              title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
            >
              {soundEnabled ? (
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                  <path d="M5 10v4h3l4 3V7L8 10H5zM16 9a4 4 0 010 6M18.5 6.5a7.5 7.5 0 010 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                  <path d="M5 10v4h3l4 3V7L8 10H5zM16 10l5 5M21 10l-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => {
              sounds.play('toggle')
              setMobileMenuOpen(!mobileMenuOpen)
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 md:hidden dark:text-gray-300 dark:hover:bg-gray-800"
            aria-label="Toggle menu"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-between bg-white p-6 md:hidden dark:bg-[#090a0f]">
          <div>
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-800">
              <span className="font-mono text-base font-bold text-gray-950 dark:text-white">
                {profile.brand}
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg p-1.5 text-gray-600 dark:text-gray-300"
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
                  className="rounded-xl px-4 py-3 text-left text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="space-y-4 border-t border-gray-200 pt-6 font-mono text-sm dark:border-gray-800">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false)
                onOpenTerminal()
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 text-white dark:bg-white dark:text-gray-950 font-semibold"
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
          </div>
        </div>
      )}
    </header>
  )
}
